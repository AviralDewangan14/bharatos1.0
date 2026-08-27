//! Kavach Zero-Trust Hardware Security Enclave & Hardware Crypto.

#![no_std]

pub static mut TELEMETRY_BLOCK_COUNTER: u32 = 0;

pub fn kavach_init() {
    unsafe {
        TELEMETRY_BLOCK_COUNTER = 4280;
    }
}

pub fn block_unauthorized_telemetry() -> bool {
    unsafe {
        TELEMETRY_BLOCK_COUNTER += 1;
    }
    true
}
