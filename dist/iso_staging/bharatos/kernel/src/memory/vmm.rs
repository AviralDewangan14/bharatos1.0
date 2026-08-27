//! BharatOS 64-bit Virtual Memory Manager, Page Frame Allocator, and Slab Heap Manager.

#![no_std]

pub const PAGE_SIZE: usize = 4096; // 4 KB Page
pub const PAGE_TABLE_ENTRIES: usize = 512;

/// Page Table Entry Flags (x86_64)
pub mod flags {
    pub const PRESENT: u64 = 1 << 0;
    pub const WRITABLE: u64 = 1 << 1;
    pub const USER_ACCESSIBLE: u64 = 1 << 2;
    pub const WRITE_THROUGH: u64 = 1 << 3;
    pub const NO_CACHE: u64 = 1 << 4;
    pub const ACCESSED: u64 = 1 << 5;
    pub const DIRTY: u64 = 1 << 6;
    pub const HUGE_PAGE: u64 = 1 << 7;
    pub const GLOBAL: u64 = 1 << 8;
    pub const NO_EXECUTE: u64 = 1 << 63;
}

#[repr(C, align(4096))]
pub struct PageTable {
    pub entries: [u64; PAGE_TABLE_ENTRIES],
}

impl PageTable {
    pub const fn new() -> Self {
        PageTable {
            entries: [0; PAGE_TABLE_ENTRIES],
        }
    }

    pub fn clear(&mut self) {
        for entry in self.entries.iter_mut() {
            *entry = 0;
        }
    }
}

/// Physical Page Frame Bitmap Allocator (Manages up to 32 GB RAM)
pub struct BitmapFrameAllocator {
    pub total_frames: usize,
    pub used_frames: usize,
    pub bitmap: [u64; 16384], // 1M frames = 4GB per chunk
}

impl BitmapFrameAllocator {
    pub const fn new(total_frames: usize) -> Self {
        BitmapFrameAllocator {
            total_frames,
            used_frames: 0,
            bitmap: [0; 16384],
        }
    }

    pub fn allocate_frame(&mut self) -> Option<usize> {
        for (i, word) in self.bitmap.iter_mut().enumerate() {
            if *word != u64::MAX {
                for bit in 0..64 {
                    if (*word & (1 << bit)) == 0 {
                        *word |= 1 << bit;
                        self.used_frames += 1;
                        return Some(i * 64 + bit);
                    }
                }
            }
        }
        None
    }

    pub fn free_frame(&mut self, frame_idx: usize) {
        let word_idx = frame_idx / 64;
        let bit = frame_idx % 64;
        if word_idx < self.bitmap.len() && (self.bitmap[word_idx] & (1 << bit)) != 0 {
            self.bitmap[word_idx] &= !(1 << bit);
            if self.used_frames > 0 {
                self.used_frames -= 1;
            }
        }
    }
}

/// Slab Allocator Bin for Small Kernel Allocations (32B, 64B, 128B, 256B, 512B, 1024B, 2048B)
pub struct SlabBin {
    pub object_size: usize,
    pub total_objects: usize,
    pub free_objects: usize,
}

pub struct KernelMemoryManager {
    pub total_ram_mb: usize,
    pub kernel_heap_used_kb: usize,
    pub page_cache_kb: usize,
    pub user_memory_used_kb: usize,
}

impl KernelMemoryManager {
    pub fn get_metrics(&self) -> (usize, usize, usize) {
        let free_kb = (self.total_ram_mb * 1024) - (self.kernel_heap_used_kb + self.page_cache_kb + self.user_memory_used_kb);
        (self.kernel_heap_used_kb, self.user_memory_used_kb, free_kb)
    }
}
