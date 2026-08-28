#ifndef BHARATOS_MEMORY_H
#define BHARATOS_MEMORY_H

#include "types.h"

/* ==============================================================================
 * BharatOS Physical Memory Manager (PMM) & Virtual Memory Paging
 * Page Size: 4096 bytes (4KB) | Huge Page Size: 2097152 bytes (2MB)
 * ============================================================================== */

#define PAGE_SIZE 4096

void memory_init(uint64_t total_memory_bytes);
void* pmm_alloc_page(void);
void pmm_free_page(void* page);
size_t pmm_get_free_pages(void);
size_t pmm_get_total_pages(void);

void* kmalloc(size_t size);
void kfree(void* ptr);

/* Standard memory manipulation */
void* memset(void* dest, int val, size_t len);
void* memcpy(void* dest, const void* src, size_t len);
int memcmp(const void* s1, const void* s2, size_t n);
size_t strlen(const char* str);
int strcmp(const char* s1, const char* s2);
int strncmp(const char* s1, const char* s2, size_t n);
char* strcpy(char* dest, const char* src);
char* strncpy(char* dest, const char* src, size_t n);

#endif /* BHARATOS_MEMORY_H */
