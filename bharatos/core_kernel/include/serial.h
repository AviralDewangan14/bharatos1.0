#ifndef BHARATOS_SERIAL_H
#define BHARATOS_SERIAL_H

#include "types.h"

/* ==============================================================================
 * BharatOS UART 16550 Serial Debug Driver (COM1 Port: 0x3F8)
 * ============================================================================== */

#define COM1_PORT 0x3F8

void serial_init(void);
int serial_received(void);
char serial_read(void);
int serial_is_transmit_empty(void);
void serial_putc(char c);
void serial_puts(const char* str);
void serial_printf(const char* fmt, ...);

#endif /* BHARATOS_SERIAL_H */
