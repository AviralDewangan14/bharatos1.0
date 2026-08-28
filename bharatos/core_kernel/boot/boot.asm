; ==============================================================================
; BharatOS Sovereign Bare-Metal Operating System Kernel
; File: bharatos/core_kernel/boot/boot.asm
; Architecture: x86_64 (Multiboot 1 & Multiboot 2 Compliant Bootloader Bootstrap)
; Description: Sets up 32-bit Protected Mode, creates 4-Level 64-bit Paging tables,
;              enables Long Mode (IA-32e), loads GDT, and jumps to 64-bit C kmain().
; ==============================================================================

[BITS 32]

; --- MULTIBOOT 1 HEADER CONSTANTS ---
MB1_MAGIC       equ 0x1BADB002
MB1_FLAGS       equ 0x00000003      ; Align modules on page boundaries + provide memory map
MB1_CHECKSUM    equ -(MB1_MAGIC + MB1_FLAGS)

; --- MULTIBOOT 2 HEADER CONSTANTS ---
MB2_MAGIC       equ 0xE85250D6
MB2_ARCH        equ 0               ; i386 32-bit protected mode
MB2_LENGTH      equ (mb2_header_end - mb2_header_start)
MB2_CHECKSUM    equ -(MB2_MAGIC + MB2_ARCH + MB2_LENGTH)

section .multiboot
align 4
mb1_header_start:
    dd MB1_MAGIC
    dd MB1_FLAGS
    dd MB1_CHECKSUM

align 8
mb2_header_start:
    dd MB2_MAGIC
    dd MB2_ARCH
    dd MB2_LENGTH
    dd MB2_CHECKSUM

    ; End tag
    dw 0
    dw 0
    dd 8
mb2_header_end:

; ==============================================================================
; BOOTSTRAP ENTRY POINT (GRUB / QEMU drops here in 32-bit Protected Mode)
; ==============================================================================
section .text
global _start
extern kmain

_start:
    ; 1. Disable interrupts during CPU mode transition
    cli

    ; 2. Initialize stack pointer
    mov esp, stack_top

    ; 3. Save Multiboot magic and information structure pointer
    mov edi, eax                    ; Arg 1: Multiboot Magic
    mov esi, ebx                    ; Arg 2: Multiboot Info Pointer

    ; 4. Verify CPU supports CPUID and Long Mode (64-bit)
    call check_cpuid
    call check_long_mode

    ; 5. Set up 4-Level Paging (Identity Map first 1GB with 2MB huge pages)
    call setup_page_tables
    call enable_paging

    ; 6. Load 64-bit Global Descriptor Table
    lgdt [gdt64_pointer]

    ; 7. Long jump into 64-bit Code Segment
    jmp gdt64_code_segment:long_mode_entry

; ==============================================================================
; CPU CAPABILITY CHECKS
; ==============================================================================
check_cpuid:
    pushfd
    pop eax
    mov ecx, eax
    xor eax, 1 << 21                ; Flip ID bit in EFLAGS
    push eax
    popfd
    pushfd
    pop eax
    push ecx
    popfd
    xor eax, ecx
    jz .no_cpuid
    ret
.no_cpuid:
    mov al, "1"                     ; Error 1: CPUID not supported
    jmp error_halt

check_long_mode:
    ; Test extended processor info is available
    mov eax, 0x80000000
    cpuid
    cmp eax, 0x80000001
    jb .no_long_mode

    ; Test if Long Mode (LM bit 29 in edx) is available
    mov eax, 0x80000001
    cpuid
    test edx, 1 << 29
    jz .no_long_mode
    ret
.no_long_mode:
    mov al, "2"                     ; Error 2: 64-bit Long Mode not supported
    jmp error_halt

; ==============================================================================
; 4-LEVEL PAGING TABLES SETUP (PML4 -> PDPT -> PD -> PT)
; ==============================================================================
setup_page_tables:
    ; Clear page table memory buffer
    mov edi, pml4_table
    xor eax, eax
    mov ecx, 4096 * 3 / 4
    rep stosd

    ; PML4[0] points to PDPT
    mov eax, pdpt_table
    or eax, 0b11                    ; Present + Writable
    mov [pml4_table], eax

    ; PDPT[0] points to Page Directory (PD)
    mov eax, page_dir_table
    or eax, 0b11                    ; Present + Writable
    mov [pdpt_table], eax

    ; Map 512 entries in Page Directory with 2MB Huge Pages (Total 1GB RAM)
    mov ecx, 0                      ; Counter
.map_pd_entry:
    mov eax, 0x200000               ; 2MB
    mul ecx
    or eax, 0b10000011              ; Present + Writable + Huge Page (bit 7)
    mov [page_dir_table + ecx * 8], eax

    inc ecx
    cmp ecx, 512                    ; 512 * 2MB = 1GB
    jne .map_pd_entry
    ret

enable_paging:
    ; Pass PML4 address to CR3 register
    mov eax, pml4_table
    mov cr3, eax

    ; Enable PAE (Physical Address Extension) in CR4
    mov eax, cr4
    or eax, 1 << 5                  ; Set PAE bit
    mov cr4, eax

    ; Enable Long Mode in EFER MSR (Model Specific Register)
    mov ecx, 0xC0000080             ; EFER MSR address
    rdmsr
    or eax, 1 << 8                  ; Set Long Mode Enable (LME) bit
    wrmsr

    ; Enable Paging and Protected Mode in CR0
    mov eax, cr0
    or eax, 1 << 31 | 1 << 0        ; Set PG (bit 31) and PE (bit 0)
    mov cr0, eax
    ret

error_halt:
    ; Print 'ERR:' and error code to VGA buffer at 0xB8000
    mov dword [0xB8000], 0x4F524F45 ; 'ER' in Red/White
    mov dword [0xB8004], 0x4F3A4F52 ; 'R:' in Red/White
    mov byte  [0xB8008], al         ; Error number
    mov byte  [0xB8009], 0x4F
    cli
    hlt

; ==============================================================================
; 64-BIT LONG MODE TRANSITION
; ==============================================================================
[BITS 64]
long_mode_entry:
    ; Reload all segment registers with 64-bit Data Segment
    mov ax, gdt64_data_segment
    mov ds, ax
    mov es, ax
    mov fs, ax
    mov gs, ax
    mov ss, ax

    ; Ensure 64-bit stack pointer
    mov rsp, stack_top

    ; Call 64-bit C Kernel Main function
    ; RDI = Multiboot Magic, RSI = Multiboot Info Struct
    call kmain

    ; Kernel should never return; if it does, halt CPU
.halt_loop:
    cli
    hlt
    jmp .halt_loop

; ==============================================================================
; 64-BIT GLOBAL DESCRIPTOR TABLE (GDT)
; ==============================================================================
section .rodata
align 8
gdt64_table:
    ; Null Descriptor
    dq 0
gdt64_code:
    ; 64-bit Kernel Code Segment (Exec/Read, 64-bit Long Mode flag set)
    dq (1 << 43) | (1 << 44) | (1 << 47) | (1 << 53)
gdt64_data:
    ; 64-bit Kernel Data Segment (Read/Write)
    dq (1 << 41) | (1 << 44) | (1 << 47)
gdt64_end:

gdt64_pointer:
    dw gdt64_end - gdt64_table - 1
    dq gdt64_table

gdt64_code_segment equ gdt64_code - gdt64_table
gdt64_data_segment equ gdt64_data - gdt64_table

; ==============================================================================
; BSS ALLOCATIONS (PAGE TABLES & STACK)
; ==============================================================================
section .bss
align 4096
pml4_table:
    resb 4096
pdpt_table:
    resb 4096
page_dir_table:
    resb 4096

align 16
stack_bottom:
    resb 16384                      ; 16 KB Kernel Stack
stack_top:
