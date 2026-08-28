#ifndef BHARATOS_IDT_H
#define BHARATOS_IDT_H

#include "types.h"

/* ==============================================================================
 * BharatOS Interrupt Descriptor Table (IDT) & Exception Frame
 * ============================================================================== */

struct idt_entry {
    uint16_t offset_low;        // Bits 0..15 of ISR address
    uint16_t selector;          // Kernel code segment selector (0x08)
    uint8_t  ist;               // Interrupt Stack Table offset in TSS
    uint8_t  type_attributes;   // Gate type, DPL, Present bit
    uint16_t offset_middle;     // Bits 16..31 of ISR address
    uint32_t offset_high;       // Bits 32..63 of ISR address
    uint32_t zero;              // Reserved, must be 0
} __attribute__((packed));

struct idt_ptr {
    uint16_t limit;
    uint64_t base;
} __attribute__((packed));

/* Interrupt stack frame pushed by CPU and idt_stubs.asm */
struct interrupt_frame {
    uint64_t rax, rbx, rcx, rdx, rsi, rdi, rbp;
    uint64_t r8, r9, r10, r11, r12, r13, r14, r15;
    uint64_t int_no;
    uint64_t error_code;
    uint64_t rip;
    uint64_t cs;
    uint64_t rflags;
    uint64_t rsp;
    uint64_t ss;
} __attribute__((packed));

typedef void (*isr_t)(struct interrupt_frame* frame);

void idt_init(void);
void idt_set_gate(uint8_t num, uint64_t base, uint16_t sel, uint8_t flags);
void register_interrupt_handler(uint8_t n, isr_t handler);

#endif /* BHARATOS_IDT_H */
