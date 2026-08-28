#ifndef BHARATOS_KERNEL_H
#define BHARATOS_KERNEL_H

#include "types.h"

/* ==============================================================================
 * BharatOS Sovereign Bare-Metal Kernel Definitions
 * ============================================================================== */

#define BHARATOS_VERSION_MAJOR 1
#define BHARATOS_VERSION_MINOR 0
#define BHARATOS_VERSION_PATCH 0
#define BHARATOS_CODENAME      "Sovereign-Prithvi"
#define BHARATOS_ARCH          "x86_64"
#define BHARATOS_DEVELOPER     "Aviral Dewangan"

void kmain(uint32_t multiboot_magic, uint32_t multiboot_info_addr) __attribute__((noreturn));
void panic(const char* message) __attribute__((noreturn));

#endif /* BHARATOS_KERNEL_H */
