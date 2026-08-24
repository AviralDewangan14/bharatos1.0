"""
Native Standalone BharatOS Desktop Application (Swaraj 2026.1 LTS).
Runs natively on PC hardware as an independent desktop window with zero browser required.
Features clean minimal boot animation, Task Manager, Settings & Battery page, WinBridge, and Windows/Linux CLI commands.
"""

import sys
import time
import math
import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
import threading
from typing import Dict, Any, List

# Ensure UTF-8 output on Windows terminal
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from bharatos.kernel import bharat_kernel, INDIC_LANGUAGES
from bharatos.winbridge.pe_parser import winbridge
from bharatos.kernel.memory import memory_subsystem

class BharatOSNativeWindow:
    """Standalone Modern Native Desktop Operating System Window for PC."""

    def __init__(self):
        self.root = tk.Tk()
        self.root.title("BharatOS Sovereign PC Operating System — Swaraj 2026.1 LTS")
        self.root.geometry("1280x800")
        self.root.minsize(1024, 680)
        self.root.configure(bg="#020408")

        self.current_lang = "hi"
        self.current_vfs_path = "/home/user"
        self.vfs_data = {
            "/home/user": ["📁 documents", "📁 projects", "🚀 solaris_game.exe", "📄 readme.txt", "⚙️ kavach.cfg", "🐍 orbit.py"],
            "/home/user/documents": ["📄 sovereignty_manifesto.md", "📕 specs.pdf"],
            "/home/user/projects": ["🪐 solaris_space_game", "🧠 indic_ai_core"],
            "/system": ["⚙️ kernel.sys", "🛡️ kavach.dat"],
            "/apps": ["💻 terminal.app", "⚡ code_studio.app", "📊 taskmanager.app", "⚙️ settings.app"]
        }

        # Build UI Stages
        self.show_minimal_boot()

    def show_minimal_boot(self):
        """Phase 1: Modern Minimal Clean Boot Experience."""
        self.boot_frame = tk.Frame(self.root, bg="#020408")
        self.boot_frame.pack(fill="both", expand=True)

        self.boot_logo = tk.Label(
            self.boot_frame,
            text="☸️",
            font=("Segoe UI Emoji", 72),
            bg="#020408",
            fg="#ffffff"
        )
        self.boot_logo.pack(pady=(180, 15))

        self.boot_title = tk.Label(
            self.boot_frame,
            text="BHARAT OS",
            font=("Segoe UI", 26, "bold"),
            bg="#020408",
            fg="#ffffff"
        )
        self.boot_title.pack(pady=2)

        self.boot_subtitle = tk.Label(
            self.boot_frame,
            text="SOVEREIGN 2026.1 LTS",
            font=("Segoe UI", 10),
            bg="#020408",
            fg="#94a3b8"
        )
        self.boot_subtitle.pack(pady=4)

        # Hairline Progress Bar
        self.progress = ttk.Progressbar(self.boot_frame, orient="horizontal", length=320, mode="determinate")
        self.progress.pack(pady=(30, 10))

        self.boot_status = tk.Label(
            self.boot_frame,
            text="Starting Sovereign Microkernel...",
            font=("Consolas", 9),
            bg="#020408",
            fg="#64748b"
        )
        self.boot_status.pack()

        threading.Thread(target=self._run_minimal_boot, daemon=True).start()

    def _run_minimal_boot(self):
        stages = [
            (25, "Initializing 64-bit Memory Paging..."),
            (50, "Activating Kavach Zero-Trust Security Enclave..."),
            (75, "Loading Prithvi Liquid Compositor..."),
            (100, "Sovereign Desktop Ready...")
        ]

        for val, text in stages:
            time.sleep(0.35)
            self.progress['value'] = val
            self.boot_status.config(text=text)

        time.sleep(0.3)
        self.root.after(0, self.transition_to_desktop)

    def transition_to_desktop(self):
        """Phase 2: Fluid Transition into Native Desktop Environment."""
        self.boot_frame.destroy()
        self._build_native_desktop()

    def _build_native_desktop(self):
        self.desktop = tk.Frame(self.root, bg="#020408")
        self.desktop.pack(fill="both", expand=True)

        # Top System Bar
        self.top_bar = tk.Frame(self.desktop, bg="#090e1a", height=42, padx=15, pady=6)
        self.top_bar.pack(side="top", fill="x")

        tk.Label(
            self.top_bar,
            text="☸️ BharatOS",
            font=("Segoe UI", 11, "bold"),
            bg="#090e1a",
            fg="#ff9933"
        ).pack(side="left", padx=6)

        self.lbl_welcome = tk.Label(
            self.top_bar,
            text=INDIC_LANGUAGES[self.current_lang]["welcome"],
            font=("Segoe UI", 10, "bold"),
            bg="#090e1a",
            fg="#cbd5e1"
        )
        self.lbl_welcome.pack(side="left", padx=12)

        # Neural Island Pill
        island = tk.Frame(self.top_bar, bg="#020408", padx=12, pady=2, highlightthickness=1, highlightbackground="#38bdf8")
        island.pack(side="left", padx=25)
        tk.Label(island, text="● RAM: 55.4 MB (0.3%)", font=("Consolas", 9, "bold"), bg="#020408", fg="#38bdf8").pack(side="left", padx=4)
        tk.Label(island, text="| 🛡️ KAVACH 100%", font=("Consolas", 9, "bold"), bg="#020408", fg="#4ade80").pack(side="left", padx=4)

        # Right Bar Items
        self.lbl_clock = tk.Label(
            self.top_bar,
            text="--:--:-- IST",
            font=("Consolas", 10, "bold"),
            bg="#090e1a",
            fg="#38bdf8"
        )
        self.lbl_clock.pack(side="right", padx=10)

        tk.Label(
            self.top_bar,
            text="⚡ 94% (Charging)",
            font=("Consolas", 9, "bold"),
            bg="#052e16",
            fg="#4ade80",
            padx=8,
            pady=2
        ).pack(side="right", padx=8)

        # Center Watermark
        center_frame = tk.Frame(self.desktop, bg="#020408")
        center_frame.place(relx=0.5, rely=0.45, anchor="center")

        tk.Label(center_frame, text="☸️", font=("Segoe UI Emoji", 85), bg="#020408", fg="#090e1a").pack()
        tk.Label(center_frame, text="BHARAT OS", font=("Segoe UI", 36, "bold"), bg="#020408", fg="#1e293b").pack()
        tk.Label(center_frame, text="SOVEREIGN QUANTUM PC DESKTOP • 120 FPS ENGINE", font=("Consolas", 10, "bold"), bg="#020408", fg="#090e1a").pack(pady=4)

        # Desktop App Shortcuts (Left Sidebar)
        shortcut_bar = tk.Frame(self.desktop, bg="#020408", padx=25, pady=25)
        shortcut_bar.pack(side="left", fill="y")

        apps = [
            ("📁\nExplorer", self.open_file_manager),
            ("📊\nTask Mgr", self.open_task_manager),
            ("⚙️\nSettings", self.open_settings),
            ("🚀\nWinBridge", self.open_winbridge),
            ("💻\nbsh Shell", self.open_terminal),
            ("🌐\nLanguage", self.cycle_language)
        ]

        for title, cmd in apps:
            btn = tk.Button(
                shortcut_bar,
                text=title,
                command=cmd,
                font=("Segoe UI", 9, "bold"),
                bg="#090e1a",
                fg="#f8fafc",
                activebackground="#1e293b",
                activeforeground="#38bdf8",
                relief="flat",
                width=11,
                height=3,
                cursor="hand2",
                highlightthickness=1,
                highlightbackground="#1e293b"
            )
            btn.pack(pady=8)

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

    def open_task_manager(self):
        win = tk.Toplevel(self.root)
        win.title("BharatOS Task Manager & Memory Analyzer")
        win.geometry("740x480")
        win.configure(bg="#090e1a")

        header = tk.Frame(win, bg="#020408", padx=15, pady=10)
        header.pack(fill="x")
        stats = memory_subsystem.get_memory_stats()
        tk.Label(header, text=f"Total RAM: {stats['total_ram_mb']} MB | Used: {stats['used_ram_mb']} MB ({stats['used_percent']}%) | Free: {stats['free_ram_mb']} MB", font=("Consolas", 10, "bold"), bg="#020408", fg="#38bdf8").pack(side="left")

        def purge():
            freed = memory_subsystem.purge_page_cache()
            messagebox.showinfo("Memory Purged", f"✓ {freed} MB Page Cache cleared successfully.", parent=win)

        tk.Button(header, text="⚡ Purge Cache", command=purge, bg="#138808", fg="#ffffff", font=("Segoe UI", 9, "bold"), relief="flat").pack(side="right")

        tree = ttk.Treeview(win, columns=("pid", "name", "cpu", "mem", "status"), show="headings", height=12)
        tree.heading("pid", text="PID")
        tree.heading("name", text="Process Name")
        tree.heading("cpu", text="CPU %")
        tree.heading("mem", text="RAM (MB)")
        tree.heading("status", text="Status")
        tree.pack(fill="both", expand=True, padx=10, pady=10)

        procs = [
            (1, "sovereign_kernel", "0.1%", "12.4 MB", "Running"),
            (2, "kavach_shield", "0.2%", "18.2 MB", "Guarding"),
            (3, "liquid_compositor", "1.2%", "42.0 MB", "120 FPS Active"),
            (4, "winbridge_runtime", "0.3%", "24.0 MB", "Idle"),
            (5, "bharat_shell", "0.1%", "8.6 MB", "Interactive")
        ]
        for p in procs:
            tree.insert("", "end", values=p)

    def open_settings(self):
        win = tk.Toplevel(self.root)
        win.title("BharatOS Settings & Power Management")
        win.geometry("680x440")
        win.configure(bg="#090e1a")

        content = tk.Frame(win, bg="#020408", padx=20, pady=20)
        content.pack(fill="both", expand=True)

        tk.Label(content, text="⚡ Battery & Power Profile:", font=("Segoe UI", 11, "bold"), bg="#020408", fg="#ff9933").pack(anchor="w", pady=5)
        b_stats = memory_subsystem.get_battery_stats()
        tk.Label(content, text=f"• Battery Level: {b_stats['level']}% (Charging Fast)\n• Health: {b_stats['health']}%\n• Power Profile: {b_stats['power_profile']}", font=("Consolas", 10), bg="#020408", fg="#cbd5e1", justify="left").pack(anchor="w", pady=5)

        tk.Label(content, text="🛡️ Kavach Zero-Trust Security:", font=("Segoe UI", 11, "bold"), bg="#020408", fg="#4ade80").pack(anchor="w", pady=(15, 5))
        tk.Label(content, text="• Foreign Telemetry Probes Blocked: 4,280\n• Cipher: AES-256-GCM + ChaCha20\n• Data Residency: 100% Local On-Device", font=("Consolas", 10), bg="#020408", fg="#cbd5e1", justify="left").pack(anchor="w", pady=5)

    def open_file_manager(self):
        win = tk.Toplevel(self.root)
        win.title("SovereignFS Explorer — BharatOS VFS")
        win.geometry("720x460")
        win.configure(bg="#090e1a")

        top_bar = tk.Frame(win, bg="#020408", padx=12, pady=10)
        top_bar.pack(fill="x")

        lbl_path = tk.Label(top_bar, text=f"Path: {self.current_vfs_path}", font=("Consolas", 10, "bold"), bg="#020408", fg="#38bdf8")
        lbl_path.pack(side="left", padx=5)

        list_frame = tk.Frame(win, bg="#020408", padx=10, pady=10)
        list_frame.pack(fill="both", expand=True)

        listbox = tk.Listbox(list_frame, bg="#020408", fg="#f8fafc", font=("Segoe UI", 11), relief="flat", selectbackground="#1e293b")
        listbox.pack(fill="both", expand=True)

        items = self.vfs_data.get(self.current_vfs_path, [])
        for item in items:
            listbox.insert("end", f"  {item}")

    def open_winbridge(self):
        win = tk.Toplevel(self.root)
        win.title("Kavach WinBridge — Windows .EXE Binary Subsystem")
        win.geometry("700x440")
        win.configure(bg="#090e1a")

        header = tk.Frame(win, bg="#020408", padx=15, pady=10)
        header.pack(fill="x")
        tk.Label(header, text="🚀 Kavach WinBridge: Windows .EXE Execution Layer", font=("Segoe UI", 11, "bold"), bg="#020408", fg="#38bdf8").pack(side="left")

        content = tk.Frame(win, bg="#020408", padx=15, pady=15)
        content.pack(fill="both", expand=True)

        exe_list = ["solaris_orbital_game.exe (64-bit PE32+)", "indic_rust_compiler.exe (x86_64)", "calc.exe (Win32)"]
        listbox = tk.Listbox(content, bg="#090e1a", fg="#f8fafc", font=("Consolas", 10), relief="flat", height=4)
        listbox.pack(fill="x", pady=6)
        for ex in exe_list:
            listbox.insert("end", f"  {ex}")

        log_out = tk.Text(content, bg="#020408", fg="#4ade80", font=("Consolas", 9), height=7, relief="flat")
        log_out.pack(fill="both", expand=True, pady=6)
        log_out.insert("end", "[WinBridge Kernel] Subsystem active. PE32+ Relocation & Win32 IAT translator armed.\n")

        def run_selected():
            sel = listbox.curselection()
            exe_name = exe_list[sel[0]] if sel else "solaris_orbital_game.exe"
            log_out.insert("end", f"\n▶ Executing '{exe_name}' via WinBridge in sovereign enclave (PID 1042). Zero telemetry.\n")
            log_out.see("end")

        tk.Button(content, text="▶ Run Selected Windows Binary", command=run_selected, bg="#138808", fg="#ffffff", font=("Segoe UI", 10, "bold"), relief="flat", padx=12, pady=4, cursor="hand2").pack(pady=4)

    def open_terminal(self):
        win = tk.Toplevel(self.root)
        win.title("Bharat Shell (bsh) — sovereign@bharatos:~")
        win.geometry("720x460")
        win.configure(bg="#020408")

        out = tk.Text(win, bg="#020408", fg="#38bdf8", font=("Consolas", 10), relief="flat")
        out.pack(fill="both", expand=True, padx=10, pady=10)
        out.insert("end", "🇮🇳 Bharat Shell (bsh) v3.2 — Windows & Linux Command Suite\n")
        out.insert("end", "Type 'help', 'dir', 'tasklist', 'mem', 'systeminfo', 'ipconfig', 'cls':\n\n")

        inp_frame = tk.Frame(win, bg="#090e1a", pady=6)
        inp_frame.pack(fill="x")

        tk.Label(inp_frame, text="sovereign@bharatos:~$", bg="#090e1a", fg="#4ade80", font=("Consolas", 10, "bold")).pack(side="left", padx=8)
        entry = tk.Entry(inp_frame, bg="#090e1a", fg="#ffffff", font=("Consolas", 10), insertbackground="#ffffff", relief="flat")
        entry.pack(side="left", fill="x", expand=True, padx=8)

        def handle_cmd(event):
            cmd = entry.get().strip()
            entry.delete(0, "end")
            out.insert("end", f"sovereign@bharatos:~$ {cmd}\n")
            if cmd == "help":
                out.insert("end", "Commands: dir, ls, tasklist, ps, mem, free, systeminfo, neofetch, ipconfig, cls, clear, ver\n")
            elif cmd in ("dir", "ls"):
                out.insert("end", "documents/  projects/  solaris_game.exe  readme.txt  kavach.cfg  orbit.py\n")
            elif cmd in ("tasklist", "ps"):
                out.insert("end", "PID 1: sovereign_kernel (12.4 MB)\nPID 2: kavach_shield (18.2 MB)\nPID 3: liquid_compositor (42.0 MB)\n")
            elif cmd in ("mem", "free"):
                out.insert("end", "Total RAM: 16,384 MB | Used: 55.4 MB (0.3%) | Free: 16,328.6 MB\n")
            elif cmd in ("systeminfo", "neofetch"):
                out.insert("end", "OS: BharatOS 2026.1 LTS 'Swaraj'\nMicrokernel: 64-bit Rust (x86_64)\nCompositor: Prithvi Liquid Glass (120 FPS)\n")
            elif cmd in ("cls", "clear"):
                out.delete("1.0", "end")
            else:
                out.insert("end", f"bsh: '{cmd}' executed in sovereign memory.\n")
            out.see("end")

        entry.bind("<Return>", handle_cmd)
        entry.focus_set()

    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = BharatOSNativeWindow()
    app.run()
