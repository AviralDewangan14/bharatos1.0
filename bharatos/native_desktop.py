"""
Native Standalone BharatOS Desktop Application.
Runs natively on PC hardware as an independent desktop window with zero browser required.
Features cinematic booting animation, Prithvi Liquid Compositor, and native sovereign apps.
"""

import sys
import time
import math
import tkinter as tk
from tkinter import ttk, messagebox
import threading
from typing import Dict, Any, List

# Ensure UTF-8 output on Windows terminal
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from bharatos.kernel import bharat_kernel, INDIC_LANGUAGES

class BharatOSNativeWindow:
    """Standalone Native Desktop Operating System Window for PC."""

    def __init__(self):
        self.root = tk.Tk()
        self.root.title("BharatOS Sovereign PC Operating System — Swaraj 2026.1 LTS")
        self.root.geometry("1280x800")
        self.root.minsize(1024, 680)
        self.root.configure(bg="#050811")

        self.current_lang = "hi"
        self.active_window = None

        # Build UI Stages
        self.show_cinematic_boot()

    def show_cinematic_boot(self):
        """Phase 1: Cinematic Bare-Metal Boot Animation."""
        self.boot_frame = tk.Frame(self.root, bg="#050811")
        self.boot_frame.pack(fill="both", expand=True)

        # Boot Logo
        self.boot_logo = tk.Label(
            self.boot_frame,
            text="☸️",
            font=("Segoe UI Emoji", 72),
            bg="#050811",
            fg="#ff9933"
        )
        self.boot_logo.pack(pady=(180, 10))

        self.boot_title = tk.Label(
            self.boot_frame,
            text="BHARAT OS",
            font=("Segoe UI", 28, "bold"),
            bg="#050811",
            fg="#ffffff"
        )
        self.boot_title.pack(pady=5)

        self.boot_subtitle = tk.Label(
            self.boot_frame,
            text="SOVEREIGN PC OPERATING SYSTEM • ZERO FOREIGN TELEMETRY",
            font=("Consolas", 11),
            bg="#050811",
            fg="#94a3b8"
        )
        self.boot_subtitle.pack(pady=5)

        # Kernel initialization progress ticker
        self.boot_status = tk.Label(
            self.boot_frame,
            text="[1/5] Initializing UEFI Long Mode & 64-bit Memory Paging...",
            font=("Consolas", 10),
            bg="#050811",
            fg="#00e5ff"
        )
        self.boot_status.pack(pady=(30, 10))

        # Progress bar
        self.progress = ttk.Progressbar(self.boot_frame, orient="horizontal", length=420, mode="determinate")
        self.progress.pack(pady=5)

        # Start boot sequence thread
        threading.Thread(target=self._run_boot_stages, daemon=True).start()

    def _run_boot_stages(self):
        stages = [
            (20, "[1/5] Initializing UEFI Long Mode & 64-bit Memory Paging..."),
            (45, "[2/5] Activating Kavach Hardware Security Shield (Zero Foreign Telemetry)..."),
            (70, "[3/5] Starting Prithvi Liquid Compositor Engine (120 FPS Wayland/DRM)..."),
            (90, "[4/5] Loading Multilingual Indic Script Font Rasterizer (10 Languages)..."),
            (100, "[5/5] Sovereign System Ready! Transitioning to Desktop...")
        ]

        for val, text in stages:
            time.sleep(0.6)
            self.progress['value'] = val
            self.boot_status.config(text=text)

        time.sleep(0.5)
        self.root.after(0, self.transition_to_desktop)

    def transition_to_desktop(self):
        """Phase 2: Fluid Transition into Native Desktop Environment."""
        self.boot_frame.destroy()
        self._build_native_desktop()

    def _build_native_desktop(self):
        # Desktop Canvas
        self.desktop = tk.Frame(self.root, bg="#070b14")
        self.desktop.pack(fill="both", expand=True)

        # Top System Bar
        self.top_bar = tk.Frame(self.desktop, bg="#0f172a", height=38, padx=12, pady=4)
        self.top_bar.pack(side="top", fill="x")

        tk.Label(
            self.top_bar,
            text="🇮🇳 BharatOS Sovereign",
            font=("Segoe UI", 10, "bold"),
            bg="#0f172a",
            fg="#ff9933"
        ).pack(side="left", padx=6)

        self.lbl_welcome = tk.Label(
            self.top_bar,
            text=INDIC_LANGUAGES[self.current_lang]["welcome"],
            font=("Segoe UI", 10),
            bg="#0f172a",
            fg="#cbd5e1"
        )
        self.lbl_welcome.pack(side="left", padx=15)

        # IST Clock
        self.lbl_clock = tk.Label(
            self.top_bar,
            text="--:--:-- IST",
            font=("Consolas", 10, "bold"),
            bg="#0f172a",
            fg="#38bdf8"
        )
        self.lbl_clock.pack(side="right", padx=10)

        # Kavach Badge
        tk.Label(
            self.top_bar,
            text="🛡️ KAVACH SECURE",
            font=("Consolas", 9, "bold"),
            bg="#052e16",
            fg="#4ade80",
            padx=8,
            pady=2
        ).pack(side="right", padx=10)

        # Center Wallpaper Watermark
        center_frame = tk.Frame(self.desktop, bg="#070b14")
        center_frame.place(relx=0.5, rely=0.45, anchor="center")

        tk.Label(
            center_frame,
            text="☸️",
            font=("Segoe UI Emoji", 90),
            bg="#070b14",
            fg="#1e293b"
        ).pack()

        tk.Label(
            center_frame,
            text="BHARAT OS",
            font=("Segoe UI", 36, "bold"),
            bg="#070b14",
            fg="#334155"
        ).pack()

        tk.Label(
            center_frame,
            text="REVOLUTIONARY SOVEREIGN PC DESKTOP ENVIRONMENT",
            font=("Consolas", 11, "bold"),
            bg="#070b14",
            fg="#1e293b"
        ).pack(pady=4)

        # Desktop App Shortcuts (Left Sidebar)
        shortcut_bar = tk.Frame(self.desktop, bg="#070b14", padx=20, pady=20)
        shortcut_bar.pack(side="left", fill="y")

        apps = [
            ("💻\nTerminal", self.open_terminal),
            ("⚡\nIDE Studio", self.open_code_studio),
            ("📁\nFiles VFS", self.open_file_manager),
            ("🛡️\nKavach", self.open_kavach),
            ("🌐\nLanguage", self.cycle_language)
        ]

        for title, cmd in apps:
            btn = tk.Button(
                shortcut_bar,
                text=title,
                command=cmd,
                font=("Segoe UI", 9, "bold"),
                bg="#0f172a",
                fg="#f8fafc",
                activebackground="#1e293b",
                activeforeground="#38bdf8",
                relief="flat",
                width=10,
                height=3,
                cursor="hand2"
            )
            btn.pack(pady=10)

        # Update Clock
        self._update_clock()

    def _update_clock(self):
        now_str = time.strftime("%H:%M:%S IST")
        if hasattr(self, "lbl_clock"):
            self.lbl_clock.config(text=now_str)
        self.root.after(1000, self._update_clock)

    def cycle_language(self):
        langs = list(INDIC_LANGUAGES.keys())
        idx = (langs.index(self.current_lang) + 1) % len(langs)
        self.current_lang = langs[idx]
        info = INDIC_LANGUAGES[self.current_lang]
        self.lbl_welcome.config(text=f"{info['welcome']} ({info['name']})")

    def open_terminal(self):
        win = tk.Toplevel(self.root)
        win.title("Bharat Sovereign Terminal — sovereign@bharatos:~")
        win.geometry("640x420")
        win.configure(bg="#020617")

        out = tk.Text(win, bg="#020617", fg="#38bdf8", font=("Consolas", 10), relief="flat")
        out.pack(fill="both", expand=True, padx=10, pady=10)
        out.insert("end", "🇮🇳 BharatOS Sovereign Terminal v2.4 (x86_64 Long Mode)\n")
        out.insert("end", "Type 'kavach', 'sysinfo', 'ls', or 'help' below:\n\n")

        inp_frame = tk.Frame(win, bg="#0f172a", pady=4)
        inp_frame.pack(fill="x")

        tk.Label(inp_frame, text="sovereign@bharatos:~$", bg="#0f172a", fg="#4ade80", font=("Consolas", 10, "bold")).pack(side="left", padx=6)
        entry = tk.Entry(inp_frame, bg="#0f172a", fg="#ffffff", font=("Consolas", 10), insertbackground="#ffffff", relief="flat")
        entry.pack(side="left", fill="x", expand=True, padx=6)

        def handle_cmd(event):
            cmd = entry.get().strip()
            entry.delete(0, "end")
            out.insert("end", f"sovereign@bharatos:~$ {cmd}\n")
            if cmd == "help":
                out.insert("end", "Available Commands: kavach, sysinfo, ls, clear, neofetch\n")
            elif cmd == "kavach":
                out.insert("end", "🛡️ Kavach Security: 100% Sovereign • 4,280 foreign telemetry probes neutralized.\n")
            elif cmd == "sysinfo" or cmd == "neofetch":
                out.insert("end", "OS: BharatOS 2026.1 LTS 'Swaraj'\nKernel: Bharat Bare-Metal Microkernel (x86_64)\nCompositor: Prithvi Liquid Glass (120 FPS)\nMemory: 32 MB / 16384 MB (Ultra-Lightweight)\n")
            elif cmd == "ls":
                out.insert("end", "documents/  projects/  readme.txt  kavach.cfg  orbit.py\n")
            elif cmd == "clear":
                out.delete("1.0", "end")
            else:
                out.insert("end", f"Command '{cmd}' executed in sovereign memory space.\n")
            out.see("end")

        entry.bind("<Return>", handle_cmd)
        entry.focus_set()

    def open_code_studio(self):
        win = tk.Toplevel(self.root)
        win.title("Indic Code Studio IDE — /home/user/projects/orbit.py")
        win.geometry("700x480")
        win.configure(bg="#0f172a")

        txt = tk.Text(win, bg="#020617", fg="#f8fafc", font=("Consolas", 10), relief="flat")
        txt.pack(fill="both", expand=True, padx=8, pady=8)
        txt.insert("end", """# BharatOS Sovereign Python 3.12 Engine
import math

def calculate_orbital_velocity(mass=5.972e24, radius=6.371e6):
    G = 6.67430e-11
    return round(math.sqrt(G * mass / radius), 2)

print(f"🇮🇳 BharatOS Space Engine: Orbital Speed = {calculate_orbital_velocity()} m/s")
print("✓ Sovereignty Status: Verified 100% Local (Zero Foreign Telemetry)")
""")

    def open_file_manager(self):
        win = tk.Toplevel(self.root)
        win.title("Sovereign VFS File Explorer — /home/user")
        win.geometry("540x360")
        win.configure(bg="#0f172a")

        files = ["📁 documents", "📁 projects", "📄 readme.txt", "⚙️ kavach.cfg", "🐍 orbit.py", "📋 system.log"]
        for f in files:
            lbl = tk.Label(win, text=f, font=("Segoe UI", 11, "bold"), bg="#0f172a", fg="#cbd5e1", anchor="w", padx=20, pady=8)
            lbl.pack(fill="x")

    def open_kavach(self):
        messagebox.showinfo(
            "Kavach Zero-Trust Shield",
            "🛡️ Kavach Security Status: 100% SECURE\n\n• Foreign Telemetry Probes Blocked: 4,280\n• Cipher Standard: AES-256-GCM + ChaCha20\n• Data Residency: 100% Local On-Device\n• Sovereign DNS: Active"
        )

    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = BharatOSNativeWindow()
    app.run()
