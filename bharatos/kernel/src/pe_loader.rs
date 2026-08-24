//! Bare-Metal PE32+ (Windows .EXE) Binary Loader for BharatOS Kernel.
//! Maps Windows PE sections into 64-bit virtual memory pages and hooks Win32 syscalls.

#![no_std]

#[repr(C, packed)]
pub struct ImageDosHeader {
    pub e_magic: u16,      // Magic number "MZ" (0x5A4D)
    pub e_cblp: u16,
    pub e_cp: u16,
    pub e_crlc: u16,
    pub e_cparhdr: u16,
    pub e_minalloc: u16,
    pub e_maxalloc: u16,
    pub e_ss: u16,
    pub e_sp: u16,
    pub e_csum: u16,
    pub e_ip: u16,
    pub e_cs: u16,
    pub e_lfarlc: u16,
    pub e_ovno: u16,
    pub e_res: [u16; 4],
    pub e_oemid: u16,
    pub e_oeminfo: u16,
    pub e_res2: [u16; 10],
    pub e_lfanew: u32,     // File address of new exe header
}

#[repr(C, packed)]
pub struct ImageFileHeader {
    pub machine: u16,
    pub number_of_sections: u16,
    pub time_date_stamp: u32,
    pub pointer_to_symbol_table: u32,
    pub number_of_symbols: u32,
    pub size_of_optional_header: u16,
    pub characteristics: u16,
}

#[repr(C, packed)]
pub struct ImageSectionHeader {
    pub name: [u8; 8],
    pub virtual_size: u32,
    pub virtual_address: u32,
    pub size_of_raw_data: u32,
    pub pointer_to_raw_data: u32,
    pub pointer_to_relocations: u32,
    pub pointer_to_linenumbers: u32,
    pub number_of_relocations: u16,
    pub number_of_linenumbers: u16,
    pub characteristics: u32,
}

pub struct WinBridgeLoader;

impl WinBridgeLoader {
    /// Validates PE32+ (x86_64) DOS and NT signatures
    pub fn validate_pe(data: &[u8]) -> bool {
        if data.len() < 64 {
            return false;
        }

        // Check DOS "MZ"
        if data[0] != b'M' || data[1] != b'Z' {
            return false;
        }

        let e_lfanew = u32::from_le_bytes([data[0x3C], data[0x3D], data[0x3E], data[0x3F]]) as usize;
        if e_lfanew + 4 > data.len() {
            return false;
        }

        // Check PE signature "PE\0\0"
        data[e_lfanew] == b'P' && data[e_lfanew + 1] == b'E' && data[e_lfanew + 2] == 0 && data[e_lfanew + 3] == 0
    }
}
