/* ==============================================================================
 * FOCUSDEFEND: WIN32 LOW-LEVEL WINDOW FOCUS & PROCESS HOOKS
 * Developer: Aviral Dewangan | Architecture: C / Win32 API
 * ============================================================================== */

#include <stdio.h>
#include <stdbool.h>
#include <string.h>

#ifdef _WIN32
#include <windows.h>

// Interrogates active foreground window title and process path
bool win32_is_distracting_foreground(const char* const* blacklisted_keywords, int count) {
    HWND hwnd = GetForegroundWindow();
    if (!hwnd) return false;

    char window_title[256];
    if (GetWindowTextA(hwnd, window_title, sizeof(window_title)) <= 0) {
        return false;
    }

    for (int i = 0; i < count; i++) {
        if (strstr(window_title, blacklisted_keywords[i]) != NULL) {
            return true;
        }
    }
    return false;
}
#else
bool win32_is_distracting_foreground(const char* const* blacklisted_keywords, int count) {
    (void)blacklisted_keywords;
    (void)count;
    return false;
}
#endif
