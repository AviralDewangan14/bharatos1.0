#include "../include/kernel.h"
#include "../include/vga.h"
#include "../include/serial.h"
#include "../include/gdt.h"
#include "../include/idt.h"
#include "../include/keyboard.h"
#include "../include/memory.h"
#include "../include/shell.h"
#include "../include/io.h"

void panic(const char* message) {
    cli();
    vga_set_color(VGA_COLOR_WHITE, VGA_COLOR_RED);
    vga_printf("\n[KERNEL PANIC] %s\n", message);
    serial_printf("\n[KERNEL PANIC] %s\n", message);
    while (1) {
        hlt();
    }
}

void kmain(uint32_t multiboot_magic, uint32_t multiboot_info_addr) {
    (void)multiboot_info_addr;

    // 1. Initialize Serial Port for QEMU / Hardware debug stream
    serial_init();
    serial_puts("\n\n=======================================================\n");
    serial_puts("   BharatOS Sovereign Microkernel Booting (x86_64)   \n");
    serial_puts("=======================================================\n");

    // 2. Initialize VGA Text Mode Console at 0xB8000
    vga_init();

    // 3. Print Sovereign BharatOS Welcome Banner
    vga_set_color(VGA_COLOR_LIGHT_CYAN, VGA_COLOR_BLACK);
    vga_puts("===============================================================================\n");
    vga_set_color(VGA_COLOR_YELLOW, VGA_COLOR_BLACK);
    vga_puts("     ____  _   _    _    ____     _  _____ ___  ____       ___  ____         \n");
    vga_puts("    | __ )| | | |  / \\  |  _ \\   / \\|_   _/ _ \\/ ___|     / _ \\/ ___|        \n");
    vga_puts("    |  _ \\| |_| | / _ \\ | |_) | / _ \\ | || | | \\___ \\    | | | \\___ \\        \n");
    vga_puts("    | |_) |  _  |/ ___ \\|  _ < / ___ \\| || |_| |___) |   | |_| |___) |       \n");
    vga_puts("    |____/|_| |_/_/   \\_\\_| \\_/_/   \\_\\_| \\___/|____/     \\___/|____/        \n");
    vga_set_color(VGA_COLOR_LIGHT_CYAN, VGA_COLOR_BLACK);
    vga_puts("===============================================================================\n");

    vga_set_color(VGA_COLOR_LIGHT_GREEN, VGA_COLOR_BLACK);
    vga_printf(" BharatOS Sovereign Bare-Metal Microkernel v%d.%d.%d-%s (%s)\n",
        BHARATOS_VERSION_MAJOR, BHARATOS_VERSION_MINOR, BHARATOS_VERSION_PATCH,
        BHARATOS_CODENAME, BHARATOS_ARCH);
    vga_set_color(VGA_COLOR_LIGHT_GREY, VGA_COLOR_BLACK);
    vga_printf(" Developer: %s | Core Stack: Assembly (NASM) + C (GCC) + Linker (LD)\n", BHARATOS_DEVELOPER);
    vga_puts("-------------------------------------------------------------------------------\n");

    // 4. Validate Multiboot Bootloader Magic
    if (multiboot_magic == 0x1BADB002 || multiboot_magic == 0x2BADB002 || multiboot_magic == 0x36D76289) {
        vga_set_color(VGA_COLOR_LIGHT_GREEN, VGA_COLOR_BLACK);
        vga_printf(" [OK] Multiboot Handshake Validated (Magic: 0x%08X)\n", multiboot_magic);
    } else {
        vga_set_color(VGA_COLOR_YELLOW, VGA_COLOR_BLACK);
        vga_printf(" [INFO] Bootloader Handshake Loaded (Magic: 0x%08X)\n", multiboot_magic);
    }

    // 5. Initialize 64-bit Global Descriptor Table & TSS
    vga_set_color(VGA_COLOR_LIGHT_GREY, VGA_COLOR_BLACK);
    vga_puts(" [..] Initializing 64-bit Global Descriptor Table (GDT)... ");
    gdt_init();
    vga_set_color(VGA_COLOR_LIGHT_GREEN, VGA_COLOR_BLACK);
    vga_puts("[OK]\n");

    // 6. Initialize Interrupt Descriptor Table (IDT) & 8259 PIC Remap
    vga_set_color(VGA_COLOR_LIGHT_GREY, VGA_COLOR_BLACK);
    vga_puts(" [..] Initializing IDT (256 Gates) & Remapping 8259 PIC... ");
    idt_init();
    vga_set_color(VGA_COLOR_LIGHT_GREEN, VGA_COLOR_BLACK);
    vga_puts("[OK]\n");

    // 7. Initialize Physical Memory Manager & Paging
    vga_set_color(VGA_COLOR_LIGHT_GREY, VGA_COLOR_BLACK);
    vga_puts(" [..] Initializing Physical Memory Page Frame Allocator...  ");
    memory_init(64 * 1024 * 1024); // 64 MB
    vga_set_color(VGA_COLOR_LIGHT_GREEN, VGA_COLOR_BLACK);
    vga_puts("[OK]\n");

    // 8. Initialize PS/2 Keyboard Driver
    vga_set_color(VGA_COLOR_LIGHT_GREY, VGA_COLOR_BLACK);
    vga_puts(" [..] Initializing PS/2 Keyboard Controller & IRQ1 Handler... ");
    keyboard_init();
    vga_set_color(VGA_COLOR_LIGHT_GREEN, VGA_COLOR_BLACK);
    vga_puts("[OK]\n");

    // 9. Enable CPU Interrupts (STI)
    sti();
    vga_set_color(VGA_COLOR_LIGHT_GREEN, VGA_COLOR_BLACK);
    vga_puts(" [OK] CPU Interrupts Enabled (STI). Kernel is live and interactive.\n");
    vga_set_color(VGA_COLOR_LIGHT_GREY, VGA_COLOR_BLACK);
    vga_puts("-------------------------------------------------------------------------------\n");

    // 10. Launch Ring-0 Interactive Kernel Shell
    vga_set_color(VGA_COLOR_WHITE, VGA_COLOR_BLACK);
    vga_puts("Type 'help' to inspect kernel capabilities, 'memory', 'cpu', or 'puf'.\n\n");
    shell_init();

    // 11. Kernel Idle Loop (Interrupt-driven)
    while (1) {
        hlt();
    }
}
