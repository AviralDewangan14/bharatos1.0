#ifndef BHARATOS_SHELL_H
#define BHARATOS_SHELL_H

#include "types.h"

/* ==============================================================================
 * BharatOS Ring-0 Sovereign Kernel Shell (Interactive Terminal Console)
 * ============================================================================== */

#define SHELL_BUFFER_SIZE 256

void shell_init(void);
void shell_handle_char(char c);
void shell_execute_command(const char* command);
void shell_prompt(void);

#endif /* BHARATOS_SHELL_H */
