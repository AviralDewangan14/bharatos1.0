#include "../include/keyboard.h"
#include "../include/idt.h"
#include "../include/pic.h"
#include "../include/io.h"
#include "../include/serial.h"

static keyboard_callback_t active_callback = 0;
static bool shift_pressed = false;
static bool caps_lock = false;

// US QWERTY Scan Code Set 1 lookup tables
static const char kbd_us[128] = {
    0,  27, '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '\b',
  '\t', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\n',
    0,  'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', '`',
    0,  '\\', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 0,
  '*',
    0,  ' ',
    0,  0,   0,   0,   0,   0,   0,   0,   0,   0,
    0,  0,   0,   0,   0,   0,   '-',
    0,  0,   0,   '+',
    0,  0,   0,   0,   0,   0,   0,   0,
    0,  0,   0,
};

static const char kbd_us_shift[128] = {
    0,  27, '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '\b',
  '\t', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '\n',
    0,  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '\"', '~',
    0,  '|', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 0,
  '*',
    0,  ' ',
    0,  0,   0,   0,   0,   0,   0,   0,   0,   0,
    0,  0,   0,   0,   0,   0,   '-',
    0,  0,   0,   '+',
    0,  0,   0,   0,   0,   0,   0,   0,
    0,  0,   0,
};

static void keyboard_interrupt_handler(struct interrupt_frame* frame) {
    (void)frame;
    uint8_t scancode = inb(KEYBOARD_DATA_PORT);

    // Key release (break code has bit 7 set)
    if (scancode & 0x80) {
        uint8_t released = scancode & 0x7F;
        if (released == 0x2A || released == 0x36) { // Left / Right Shift released
            shift_pressed = false;
        }
        return;
    }

    // Key press (make code)
    if (scancode == 0x2A || scancode == 0x36) { // Left / Right Shift pressed
        shift_pressed = true;
        return;
    }
    if (scancode == 0x3A) { // Caps Lock toggled
        caps_lock = !caps_lock;
        return;
    }

    if (scancode < 128) {
        char c = shift_pressed ? kbd_us_shift[scancode] : kbd_us[scancode];
        if (caps_lock && c >= 'a' && c <= 'z') {
            c -= 32;
        } else if (caps_lock && shift_pressed && c >= 'A' && c <= 'Z') {
            c += 32;
        }

        if (c != 0 && active_callback != 0) {
            active_callback(c);
        }
    }
}

void keyboard_set_callback(keyboard_callback_t cb) {
    active_callback = cb;
}

void keyboard_init(void) {
    register_interrupt_handler(33, keyboard_interrupt_handler); // IRQ1 = Vector 33
    pic_unmask_irq(1); // Unmask IRQ1 in PIC
    serial_puts("[KEYBOARD] PS/2 Keyboard IRQ1 Registered.\n");
}
