#include "../include/serial.h"
#include "../include/io.h"
#include <stdarg.h>

void serial_init(void) {
    outb(COM1_PORT + 1, 0x00);    // Disable all interrupts
    outb(COM1_PORT + 3, 0x80);    // Enable DLAB (set baud rate divisor)
    outb(COM1_PORT + 0, 0x03);    // Set divisor to 3 (lo byte) 38400 baud
    outb(COM1_PORT + 1, 0x00);    //                  (hi byte)
    outb(COM1_PORT + 3, 0x03);    // 8 bits, no parity, one stop bit
    outb(COM1_PORT + 2, 0xC7);    // Enable FIFO, clear them, with 14-byte threshold
    outb(COM1_PORT + 4, 0x0B);    // IRQs enabled, RTS/DSR set
}

int serial_received(void) {
    return inb(COM1_PORT + 5) & 1;
}

char serial_read(void) {
    while (serial_received() == 0);
    return (char)inb(COM1_PORT);
}

int serial_is_transmit_empty(void) {
    return inb(COM1_PORT + 5) & 0x20;
}

void serial_putc(char c) {
    while (serial_is_transmit_empty() == 0);
    outb(COM1_PORT, (uint8_t)c);
}

void serial_puts(const char* str) {
    if (!str) return;
    while (*str) {
        if (*str == '\n') {
            serial_putc('\r');
        }
        serial_putc(*str++);
    }
}

static void serial_print_number(uint64_t n, int base, int is_signed) {
    char buf[65];
    int i = 0;

    if (is_signed && (int64_t)n < 0) {
        serial_putc('-');
        n = (uint64_t)(-(int64_t)n);
    }

    if (n == 0) {
        serial_putc('0');
        return;
    }

    while (n > 0) {
        uint64_t rem = n % base;
        buf[i++] = (rem < 10) ? ('0' + rem) : ('A' + rem - 10);
        n /= base;
    }

    for (int j = i - 1; j >= 0; j--) {
        serial_putc(buf[j]);
    }
}

void serial_printf(const char* fmt, ...) {
    va_list args;
    va_start(args, fmt);

    for (size_t i = 0; fmt[i] != '\0'; i++) {
        if (fmt[i] != '%') {
            if (fmt[i] == '\n') serial_putc('\r');
            serial_putc(fmt[i]);
            continue;
        }

        i++;
        switch (fmt[i]) {
            case 'c': {
                char c = (char)va_arg(args, int);
                serial_putc(c);
                break;
            }
            case 's': {
                const char* s = va_arg(args, const char*);
                serial_puts(s ? s : "(null)");
                break;
            }
            case 'd':
            case 'i': {
                int64_t val = va_arg(args, int64_t);
                serial_print_number((uint64_t)val, 10, 1);
                break;
            }
            case 'u': {
                uint64_t val = va_arg(args, uint64_t);
                serial_print_number(val, 10, 0);
                break;
            }
            case 'x':
            case 'X':
            case 'p': {
                uint64_t val = va_arg(args, uint64_t);
                serial_puts("0x");
                serial_print_number(val, 16, 0);
                break;
            }
            case '%': {
                serial_putc('%');
                break;
            }
            default:
                serial_putc('%');
                serial_putc(fmt[i]);
                break;
        }
    }

    va_end(args);
}
