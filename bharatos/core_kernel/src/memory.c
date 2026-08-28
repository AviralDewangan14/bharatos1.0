#include "../include/memory.h"
#include "../include/serial.h"

#define BITMAP_SIZE (32768) // 32768 * 32 * 4KB = 4 GB Physical RAM address space
static uint32_t memory_bitmap[BITMAP_SIZE];
static uint64_t total_memory = 0;
static uint64_t total_pages = 0;
static uint64_t free_pages = 0;

// Simple Heap Allocator (placed at 16MB in physical memory)
static uint8_t* heap_current = (uint8_t*)0x1000000;

static inline void bitmap_set(uint64_t page) {
    memory_bitmap[page / 32] |= (1 << (page % 32));
}

static inline void bitmap_clear(uint64_t page) {
    memory_bitmap[page / 32] &= ~(1 << (page % 32));
}

static inline bool bitmap_test(uint64_t page) {
    return (memory_bitmap[page / 32] & (1 << (page % 32))) != 0;
}

void memory_init(uint64_t total_mem_bytes) {
    total_memory = total_mem_bytes ? total_mem_bytes : (64 * 1024 * 1024); // Default 64MB
    total_pages = total_memory / PAGE_SIZE;
    free_pages = total_pages;

    memset(memory_bitmap, 0, sizeof(memory_bitmap));

    // Reserve first 4MB (Kernel text, BSS, VGA, page tables)
    for (uint64_t i = 0; i < 1024; i++) {
        bitmap_set(i);
        free_pages--;
    }

    serial_printf("[PMM] Physical Memory Initialized: Total %u MB, Free Pages: %u\n", (uint32_t)(total_memory / 1048576), (uint32_t)free_pages);
}

void* pmm_alloc_page(void) {
    for (uint64_t i = 0; i < total_pages; i++) {
        if (!bitmap_test(i)) {
            bitmap_set(i);
            free_pages--;
            return (void*)(i * PAGE_SIZE);
        }
    }
    return NULL; // Out of memory
}

void pmm_free_page(void* page) {
    uint64_t p = (uint64_t)page / PAGE_SIZE;
    if (bitmap_test(p)) {
        bitmap_clear(p);
        free_pages++;
    }
}

size_t pmm_get_free_pages(void) {
    return free_pages;
}

size_t pmm_get_total_pages(void) {
    return total_pages;
}

void* kmalloc(size_t size) {
    // 8-byte alignment
    size = (size + 7) & ~7;
    void* ptr = (void*)heap_current;
    heap_current += size;
    return ptr;
}

void kfree(void* ptr) {
    (void)ptr; // Bump allocator does not free individual slices
}

/* ==============================================================================
 * Freestanding String & Memory Utilities
 * ============================================================================== */

void* memset(void* dest, int val, size_t len) {
    uint8_t* ptr = (uint8_t*)dest;
    while (len-- > 0) {
        *ptr++ = (uint8_t)val;
    }
    return dest;
}

void* memcpy(void* dest, const void* src, size_t len) {
    uint8_t* d = (uint8_t*)dest;
    const uint8_t* s = (const uint8_t*)src;
    while (len-- > 0) {
        *d++ = *s++;
    }
    return dest;
}

int memcmp(const void* s1, const void* s2, size_t n) {
    const uint8_t* p1 = (const uint8_t*)s1;
    const uint8_t* p2 = (const uint8_t*)s2;
    while (n-- > 0) {
        if (*p1 != *p2) return *p1 - *p2;
        p1++;
        p2++;
    }
    return 0;
}

size_t strlen(const char* str) {
    size_t len = 0;
    while (str && str[len]) len++;
    return len;
}

int strcmp(const char* s1, const char* s2) {
    if (!s1 || !s2) return -1;
    while (*s1 && (*s1 == *s2)) {
        s1++;
        s2++;
    }
    return *(const unsigned char*)s1 - *(const unsigned char*)s2;
}

int strncmp(const char* s1, const char* s2, size_t n) {
    if (!s1 || !s2 || n == 0) return 0;
    while (n-- > 0 && *s1 && (*s1 == *s2)) {
        s1++;
        s2++;
    }
    return *(const unsigned char*)s1 - *(const unsigned char*)s2;
}

char* strcpy(char* dest, const char* src) {
    char* d = dest;
    while ((*d++ = *src++));
    return dest;
}

char* strncpy(char* dest, const char* src, size_t n) {
    char* d = dest;
    while (n > 0 && *src) {
        *d++ = *src++;
        n--;
    }
    while (n > 0) {
        *d++ = '\0';
        n--;
    }
    return dest;
}
