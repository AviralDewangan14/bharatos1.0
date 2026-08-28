#include "../include/vga.h"
#include "../include/io.h"
#include "../include/memory.h"
#include <stdarg.h>

static size_t vga_row = 0;
static size_t vga_col = 0;
static uint8_t vga_color = 0;

void vga_init(void) {
    vga_row = 0;
    vga_col = 0;
    vga_color = vga_entry_color(VGA_COLOR_LIGHT_GREY, VGA_COLOR_BLACK);
    vga_clear();
}

void vga_set_color(vga_color_t fg, vga_color_t bg) {
    vga_color = vga_entry_color(fg, bg);
}

void vga_clear(void) {
    for (size_t y = 0; y < VGA_HEIGHT; y++) {
        for (size_t x = 0; x < VGA_WIDTH; x++) {
            const size_t index = y * VGA_WIDTH + x;
            VGA_MEMORY[index] = vga_entry(' ', vga_color);
        }
    }
    vga_row = 0;
    vga_col = 0;
    vga_set_cursor(0, 0);
}

void vga_set_cursor(size_t x, size_t y) {
    uint16_t pos = (uint16_t)(y * VGA_WIDTH + x);
    outb(0x3D4, 0x0F);
    outb(0x3D5, (uint8_t)(pos & 0xFF));
    outb(0x3D4, 0x0E);
    outb(0x3D5, (uint8_t)((pos >> 8) & 0xFF));
}

void vga_get_cursor(size_t* x, size_t* y) {
    if (x) *x = vga_col;
    if (y) *y = vga_row;
}

void vga_scroll(void) {
    for (size_t y = 0; y < VGA_HEIGHT - 1; y++) {
        for (size_t x = 0; x < VGA_WIDTH; x++) {
            VGA_MEMORY[y * VGA_WIDTH + x] = VGA_MEMORY[(y + 1) * VGA_WIDTH + x];
        }
    }
    for (size_t x = 0; x < VGA_WIDTH; x++) {
        VGA_MEMORY[(VGA_HEIGHT - 1) * VGA_WIDTH + x] = vga_entry(' ', vga_color);
    }
    vga_row = VGA_HEIGHT - 1;
}

void vga_putc(char c) {
    if (c == '\n') {
        vga_col = 0;
        if (++vga_row == VGA_HEIGHT) {
            vga_scroll();
        }
    } else if (c == '\r') {
        vga_col = 0;
    } else if (c == '\b') {
        if (vga_col > 0) {
            vga_col--;
            VGA_MEMORY[vga_row * VGA_WIDTH + vga_col] = vga_entry(' ', vga_color);
        }
    } else if (c == '\t') {
        vga_col = (vga_col + 4) & ~3;
        if (vga_col >= VGA_WIDTH) {
            vga_col = 0;
            if (++vga_row == VGA_HEIGHT) {
                vga_scroll();
            }
        }
    } else {
        const size_t index = vga_row * VGA_WIDTH + vga_col;
        VGA_MEMORY[index] = vga_entry((unsigned char)c, vga_color);
        if (++vga_col == VGA_WIDTH) {
            vga_col = 0;
            if (++vga_row == VGA_HEIGHT) {
                vga_scroll();
            }
        }
    }
    vga_set_cursor(vga_col, vga_row);
}

void vga_puts(const char* str) {
    if (!str) return;
    while (*str) {
        vga_putc(*str++);
    }
}

static void print_number(uint64_t n, int base, int is_signed, int min_width, char pad_char) {
    char buf[65];
    int i = 0;
    bool negative = false;

    if (is_signed && (int64_t)n < 0) {
        negative = true;
        n = (uint64_t)(-(int64_t)n);
    }

    if (n == 0) {
        buf[i++] = '0';
    } else {
        while (n > 0) {
            uint64_t rem = n % base;
            buf[i++] = (rem < 10) ? ('0' + rem) : ('A' + rem - 10);
            n /= base;
        }
    }

    if (negative) {
        buf[i++] = '-';
    }

    while (i < min_width) {
        buf[i++] = pad_char;
    }

    for (int j = i - 1; j >= 0; j--) {
        vga_putc(buf[j]);
    }
}

void vga_printf(const char* fmt, ...) {
    va_list args;
    va_start(args, fmt);

    for (size_t i = 0; fmt[i] != '\0'; i++) {
        if (fmt[i] != '%') {
            vga_putc(fmt[i]);
            continue;
        }

        i++; // Skip '%'
        int min_width = 0;
        char pad_char = ' ';

        if (fmt[i] == '0') {
            pad_char = '0';
            i++;
        }
        while (fmt[i] >= '0' && fmt[i] <= '9') {
            min_width = min_width * 10 + (fmt[i] - '0');
            i++;
        }

        switch (fmt[i]) {
            case 'c': {
                char c = (char)va_arg(args, int);
                vga_putc(c);
                break;
            }
            case 's': {
                const char* s = va_arg(args, const char*);
                vga_puts(s ? s : "(null)");
                break;
            }
            case 'd':
            case 'i': {
                int64_t val = va_arg(args, int64_t);
                print_number((uint64_t)val, 10, 1, min_width, pad_char);
                break;
            }
            case 'u': {
                uint64_t val = va_arg(args, uint64_t);
                print_number(val, 10, 0, min_width, pad_char);
                break;
            }
            case 'x':
            case 'X':
            case 'p': {
                uint64_t val = va_arg(args, uint64_t);
                print_number(val, 16, 0, min_width, pad_char);
                break;
            }
            case '%': {
                vga_putc('%');
                break;
            }
            default:
                vga_putc('%');
                vga_putc(fmt[i]);
                break;
        }
    }

    va_end(args);
}
