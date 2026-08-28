/* ==============================================================================
 * BharatOS Sovereign Bare-Metal Operating System Kernel
 * File: bharatos/core_kernel/linker.ld
 * Description: GNU LD Linker script mapping x86_64 Multiboot kernel starting at 1MB (0x100000).
 *              Ensures page alignment (4KB / 0x1000) for .text, .rodata, .data, .bss.
 * ============================================================================== */

ENTRY(_start)
OUTPUT_FORMAT("elf64-x86-64")
OUTPUT_ARCH(i386:x86-64)

SECTIONS
{
    /* Load address: 1MB (0x100000), standard physical load address above BIOS and VGA */
    . = 0x100000;

    __kernel_start = .;

    /* Multiboot Header MUST reside in the first 8KB of the executable binary */
    .multiboot ALIGN(4K) :
    {
        *(.multiboot)
    }

    /* Executable Machine Code */
    .text ALIGN(4K) :
    {
        *(.text)
        *(.text.*)
    }

    /* Read-Only Constants, GDT, String Literals */
    .rodata ALIGN(4K) :
    {
        *(.rodata)
        *(.rodata.*)
    }

    /* Initialized Global and Static Variables */
    .data ALIGN(4K) :
    {
        *(.data)
        *(.data.*)
    }

    /* Uninitialized Data (BSS), Page Tables, and Kernel Stack */
    .bss ALIGN(4K) :
    {
        __bss_start = .;
        *(COMMON)
        *(.bss)
        *(.bss.*)
        __bss_end = .;
    }

    __kernel_end = .;
}
