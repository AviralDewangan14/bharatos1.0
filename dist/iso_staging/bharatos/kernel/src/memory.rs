//! BharatOS 64-bit Virtual Memory Manager & Page Allocator.

#![no_std]

pub struct PageTable {
    pub entries: [u64; 512],
}

pub static mut KERNEL_PAGE_DIRECTORY: PageTable = PageTable { entries: [0; 512] };

/// Initializes 4-Level 64-bit paging structures
pub fn init_paging() {
    unsafe {
        // Identity map first 1GB physical memory
        for i in 0..512 {
            // Present + Writable + HugePage (2MB)
            KERNEL_PAGE_DIRECTORY.entries[i] = ((i as u64) * 0x200000) | 0x83;
        }
    }
}
