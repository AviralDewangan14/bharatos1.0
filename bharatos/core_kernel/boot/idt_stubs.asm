; ==============================================================================
; BharatOS Sovereign Bare-Metal Operating System Kernel
; File: bharatos/core_kernel/boot/idt_stubs.asm
; Architecture: x86_64
; Description: Assembly Interrupt Service Routines (ISRs 0-31) and Hardware IRQs (32-47).
;              Preserves CPU registers, aligns stack, calls C handler, and executes IRETQ.
; ==============================================================================

[BITS 64]

extern isr_handler
extern irq_handler

; Macro for ISRs without an error code (pushes dummy 0 for uniform stack layout)
%macro ISR_NOERRCODE 1
global isr%1
isr%1:
    push qword 0                    ; Push dummy error code
    push qword %1                   ; Push interrupt number
    jmp isr_common_stub
%endmacro

; Macro for ISRs with an error code pushed by CPU
%macro ISR_ERRCODE 1
global isr%1
isr%1:
    push qword %1                   ; Push interrupt number (error code already on stack)
    jmp isr_common_stub
%endmacro

; Macro for Hardware IRQs (mapped to 32-47)
%macro IRQ 2
global irq%1
irq%1:
    push qword 0                    ; Dummy error code
    push qword %2                   ; Interrupt vector number (32 + IRQ)
    jmp irq_common_stub
%endmacro

; --- CPU EXCEPTIONS (ISRs 0 - 31) ---
ISR_NOERRCODE 0                     ; #DE: Divide by Zero
ISR_NOERRCODE 1                     ; #DB: Debug Exception
ISR_NOERRCODE 2                     ; NMI: Non-Maskable Interrupt
ISR_NOERRCODE 3                     ; #BP: Breakpoint Exception
ISR_NOERRCODE 4                     ; #OF: Overflow Exception
ISR_NOERRCODE 5                     ; #BR: BOUND Range Exceeded
ISR_NOERRCODE 6                     ; #UD: Invalid Opcode Exception
ISR_NOERRCODE 7                     ; #NM: Device Not Available
ISR_ERRCODE   8                     ; #DF: Double Fault Exception
ISR_NOERRCODE 9                     ; Coprocessor Segment Overrun
ISR_ERRCODE   10                    ; #TS: Invalid TSS Exception
ISR_ERRCODE   11                    ; #NP: Segment Not Present
ISR_ERRCODE   12                    ; #SS: Stack Fault Exception
ISR_ERRCODE   13                    ; #GP: General Protection Fault
ISR_ERRCODE   14                    ; #PF: Page Fault Exception
ISR_NOERRCODE 15                    ; Reserved
ISR_NOERRCODE 16                    ; #MF: x87 FPU Floating-Point Error
ISR_ERRCODE   17                    ; #AC: Alignment Check Exception
ISR_NOERRCODE 18                    ; #MC: Machine-Check Exception
ISR_NOERRCODE 19                    ; #XF: SIMD Floating-Point Exception
ISR_NOERRCODE 20                    ; #VE: Virtualization Exception
ISR_ERRCODE   21                    ; #CP: Control Protection Exception
ISR_NOERRCODE 22                    ; Reserved
ISR_NOERRCODE 23                    ; Reserved
ISR_NOERRCODE 24                    ; Reserved
ISR_NOERRCODE 25                    ; Reserved
ISR_NOERRCODE 26                    ; Reserved
ISR_NOERRCODE 27                    ; Reserved
ISR_NOERRCODE 28                    ; #HV: Hypervisor Injection Exception
ISR_ERRCODE   29                    ; #VC: VMM Communication Exception
ISR_ERRCODE   30                    ; #SX: Security Exception
ISR_NOERRCODE 31                    ; Reserved

; --- HARDWARE INTERRUPT REQUESTS (IRQs 0 - 15 -> ISRs 32 - 47) ---
IRQ 0,  32                          ; IRQ0:  PIT Programmable Interval Timer
IRQ 1,  33                          ; IRQ1:  PS/2 Keyboard
IRQ 2,  34                          ; IRQ2:  Cascade (used internally)
IRQ 3,  35                          ; IRQ3:  COM2 Serial Port
IRQ 4,  36                          ; IRQ4:  COM1 Serial Port
IRQ 5,  37                          ; IRQ5:  LPT2 Parallel Port / Sound Card
IRQ 6,  38                          ; IRQ6:  Floppy Disk Controller
IRQ 7,  39                          ; IRQ7:  LPT1 Spurious
IRQ 8,  40                          ; IRQ8:  CMOS Real-Time Clock
IRQ 9,  41                          ; IRQ9:  Free / Open / ACPI
IRQ 10, 42                          ; IRQ10: Free / Open / Network
IRQ 11, 43                          ; IRQ11: Free / Open / USB
IRQ 12, 44                          ; IRQ12: PS/2 Mouse
IRQ 13, 45                          ; IRQ13: FPU / Math Coprocessor
IRQ 14, 46                          ; IRQ14: Primary ATA Hard Disk
IRQ 15, 47                          ; IRQ15: Secondary ATA Hard Disk

; ==============================================================================
; COMMON ISR STUB (Preserves all 64-bit general registers and calls C isr_handler)
; ==============================================================================
section .text
isr_common_stub:
    push r15
    push r14
    push r13
    push r12
    push r11
    push r10
    push r9
    push r8
    push rbp
    push rdi
    push rsi
    push rdx
    push rcx
    push rbx
    push rax

    ; Pass pointer to interrupt_frame struct as RDI (1st argument in System V ABI)
    mov rdi, rsp
    call isr_handler

    ; Restore registers
    pop rax
    pop rbx
    pop rcx
    pop rdx
    pop rsi
    pop rdi
    pop rbp
    pop r8
    pop r9
    pop r10
    pop r11
    pop r12
    pop r13
    pop r14
    pop r15

    ; Clean up interrupt number and error code from stack (16 bytes)
    add rsp, 16
    iretq

; ==============================================================================
; COMMON IRQ STUB (Preserves registers and calls C irq_handler)
; ==============================================================================
irq_common_stub:
    push r15
    push r14
    push r13
    push r12
    push r11
    push r10
    push r9
    push r8
    push rbp
    push rdi
    push rsi
    push rdx
    push rcx
    push rbx
    push rax

    mov rdi, rsp
    call irq_handler

    pop rax
    pop rbx
    pop rcx
    pop rdx
    pop rsi
    pop rdi
    pop rbp
    pop r8
    pop r9
    pop r10
    pop r11
    pop r12
    pop r13
    pop r14
    pop r15

    add rsp, 16
    iretq
