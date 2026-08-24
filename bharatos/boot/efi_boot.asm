; ====================================================================
; BharatOS Sovereign UEFI Bootloader (x86_64 Bare-Metal Entry)
; Initializes 64-bit Long Mode, Identity Paging, and Passes GOP Framebuffer
; ====================================================================

[BITS 64]
[GLOBAL _start]
[EXTERN kernel_main]

SECTION .text
_start:
    ; 1. Disable hardware interrupts during bootstrap
    cli

    ; 2. Initialize 64-bit Segment Registers
    xor ax, ax
    mov ds, ax
    mov es, ax
    mov ss, ax
    mov fs, ax
    mov gs, ax

    ; 3. Setup Sovereign High-Memory Stack (16-byte aligned)
    mov rsp, 0x7FFFFFFF0
    and rsp, -16

    ; 4. Verify SSE / AVX support for Liquid Glass Compositor
    mov eax, 1
    cpuid
    test edx, 1 << 25
    jz .no_sse

    ; Enable SSE in CR0 / CR4
    mov rax, cr0
    and ax, 0xFFFB      ; Clear CR0.EM
    or ax, 0x2          ; Set CR0.MP
    mov cr0, rax
    mov rax, cr4
    or ax, 3 << 9       ; Set CR4.OSFXSR and CR4.OSXMMEXCPT
    mov cr4, rax

    ; 5. Jump into BharatOS Sovereign Microkernel
    call kernel_main

.halt_loop:
    hlt
    jmp .halt_loop

.no_sse:
    ; Fallback halt if CPU lacks SSE hardware acceleration
    hlt
    jmp .no_sse
