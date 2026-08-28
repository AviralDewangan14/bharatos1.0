#ifndef BHARATOS_PIC_H
#define BHARATOS_PIC_H

#include "types.h"

/* ==============================================================================
 * BharatOS 8259 Programmable Interrupt Controller (PIC) Driver
 * Master PIC: Command 0x20, Data 0x21 | Slave PIC: Command 0xA0, Data 0xA1
 * ============================================================================== */

#define PIC1_COMMAND 0x20
#define PIC1_DATA    0x21
#define PIC2_COMMAND 0xA0
#define PIC2_DATA    0xA1

#define PIC_EOI      0x20

#define ICW1_INIT    0x10
#define ICW1_ICW4    0x01
#define ICW4_8086    0x01

void pic_remap(int offset1, int offset2);
void pic_send_eoi(uint8_t irq);
void pic_mask_irq(uint8_t irq);
void pic_unmask_irq(uint8_t irq);
void pic_disable(void);

#endif /* BHARATOS_PIC_H */
