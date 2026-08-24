//! BharatOS Bare-Metal Sovereign Microkernel (x86_64 / ARM64).
//! Zero foreign telemetry, copy-on-write memory paging, and liquid glass compositor hooks.

#![no_std]
#![no_main]
#![feature(abi_x86_interrupt)]

use core::panic::PanicInfo;

pub mod memory;
pub mod interrupts;
pub mod process;
pub mod crypto;
pub mod compositor;

/// Kernel entry point called by UEFI bootloader
#[no_mangle]
pub extern "C" fn _start() -> ! {
    // 1. Initialize Kavach Zero-Trust Hardware Security Enclave
    crypto::kavach_init();

    // 2. Initialize 4-Level 64-bit Paging & Virtual Memory Manager
    memory::init_paging();

    // 3. Initialize Global Descriptor Table (GDT) & Interrupt Descriptor Table (IDT)
    interrupts::init_idt();

    // 4. Initialize Multi-Core Process Scheduler & Real-Time Compositor Driver
    process::init_scheduler();

    // 5. Initialize GPU Framebuffer for Liquid Glass Desktop Compositor (120 FPS)
    compositor::init_liquid_compositor();

    // Enter Sovereign Kernel Loop
    loop {
        x86_64::instructions::hlt();
    }
}

/// Sovereign Panic Handler (Zero External Telemetry Leak)
#[panic_handler]
fn panic(_info: &PanicInfo) -> ! {
    loop {
        x86_64::instructions::hlt();
    }
}
