#ifndef BHARATOS_KEYBOARD_H
#define BHARATOS_KEYBOARD_H

#include "types.h"

/* ==============================================================================
 * BharatOS PS/2 Keyboard Driver (IRQ1, Data Port: 0x60, Status Port: 0x64)
 * ============================================================================== */

#define KEYBOARD_DATA_PORT   0x60
#define KEYBOARD_STATUS_PORT 0x64

typedef void (*keyboard_callback_t)(char c);

void keyboard_init(void);
void keyboard_set_callback(keyboard_callback_t cb);
char keyboard_getchar(void);

#endif /* BHARATOS_KEYBOARD_H */
