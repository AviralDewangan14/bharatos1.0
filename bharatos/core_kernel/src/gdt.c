#include "../include/gdt.h"
#include "../include/memory.h"
#include "../include/serial.h"

static struct gdt_entry gdt_entries[5];
static struct gdt_ptr   gdt_pointer;
static struct tss_entry tss_entry;

extern void gdt_flush(uint64_t);
extern void tss_flush(void);

static void gdt_set_gate(int num, uint32_t base, uint32_t limit, uint8_t access, uint8_t gran) {
    gdt_entries[num].base_low    = (base & 0xFFFF);
    gdt_entries[num].base_middle = (base >> 16) & 0xFF;
    gdt_entries[num].base_high   = (base >> 24) & 0xFF;

    gdt_entries[num].limit_low   = (limit & 0xFFFF);
    gdt_entries[num].granularity = (limit >> 16) & 0x0F;

    gdt_entries[num].granularity |= gran & 0xF0;
    gdt_entries[num].access      = access;
}

void gdt_init(void) {
    gdt_pointer.limit = (sizeof(struct gdt_entry) * 5) - 1;
    gdt_pointer.base  = (uint64_t)&gdt_entries;

    // 0x00: Null Segment
    gdt_set_gate(0, 0, 0, 0, 0);

    // 0x08: Kernel Code Segment (64-bit Long Mode: 0x9A, Gran: 0x20)
    gdt_set_gate(1, 0, 0xFFFFFFFF, 0x9A, 0xA0);

    // 0x10: Kernel Data Segment (64-bit Read/Write: 0x92, Gran: 0x20)
    gdt_set_gate(2, 0, 0xFFFFFFFF, 0x92, 0xA0);

    // 0x18: User Code Segment (Ring 3: 0xFA)
    gdt_set_gate(3, 0, 0xFFFFFFFF, 0xFA, 0xA0);

    // 0x20: User Data Segment (Ring 3: 0xF2)
    gdt_set_gate(4, 0, 0xFFFFFFFF, 0xF2, 0xA0);

    // Initialize TSS structure
    memset(&tss_entry, 0, sizeof(struct tss_entry));
    tss_entry.iomap_base = sizeof(struct tss_entry);

    serial_puts("[GDT] 64-bit Global Descriptor Table & Segments Initialized.\n");
}
