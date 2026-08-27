"""
BharatOS Global Keyboard Shortcuts & Keybindings Registry.
"""

from typing import Dict, Any, List

DEFAULT_KEYBINDINGS = [
    {"shortcut": "Super / Win", "action": "Toggle Sudarshan Core Menu", "category": "Navigation"},
    {"shortcut": "Super + E", "action": "Open SovereignFS File Explorer", "category": "Files"},
    {"shortcut": "Super + T", "action": "Open Bharat Shell (bsh) Terminal", "category": "Terminal"},
    {"shortcut": "Super + G", "action": "Toggle 144 FPS Sovereign Game Hub", "category": "Gaming"},
    {"shortcut": "Super + I", "action": "Open System Settings & Control Center", "category": "System"},
    {"shortcut": "Super + M", "action": "Open Task Manager & RAM Analyzer", "category": "Performance"},
    {"shortcut": "Super + L", "action": "Lock Sovereign Screen", "category": "Security"},
    {"shortcut": "Alt + Tab", "action": "3D Spatial Window Switcher", "category": "Windowing"},
    {"shortcut": "Ctrl + Shift + Esc", "action": "Instant Task Manager", "category": "Performance"}
]

class KeybindingsManager:
    def __init__(self):
        self.bindings = list(DEFAULT_KEYBINDINGS)

    def get_bindings(self) -> List[Dict[str, str]]:
        return self.bindings


# Global instance
keybindings = KeybindingsManager()
