"""
GenAz Native Desktop IDE
A standalone desktop development environment built with Tkinter.
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import sys
import io
from pathlib import Path

# Add project root
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.lexer import Lexer
from src.parser import Parser
from src.type_checker import TypeChecker
from src.compiler import BytecodeCompiler
from src.vm import VirtualMachine
from src.disassembler import disassemble


class GenAzDesktopIDE:
    def __init__(self, root):
        self.root = root
        self.root.title("GenAz Native Desktop IDE — v1.0.0")
        self.root.geometry("1000x680")
        self.root.configure(bg="#0f172a")

        # Top Control Bar
        top_bar = tk.Frame(root, bg="#1e293b", height=44, padx=10, pady=6)
        top_bar.pack(fill=tk.X, side=tk.TOP)

        tk.Label(top_bar, text="⚡ GenAz IDE", font=("Segoe UI", 12, "bold"), fg="#38bdf8", bg="#1e293b").pack(side=tk.LEFT, padx=6)

        btn_style = {"bg": "#0284c7", "fg": "#ffffff", "font": ("Segoe UI", 9, "bold"), "relief": "flat", "padx": 10, "pady": 4}
        
        tk.Button(top_bar, text="▶ Run (F5)", command=self.run_code, **btn_style).pack(side=tk.LEFT, padx=4)
        tk.Button(top_bar, text="⚙️ Compile .gbc", command=self.build_binary, bg="#334155", fg="#ffffff", font=("Segoe UI", 9), relief="flat", padx=8, pady=4).pack(side=tk.LEFT, padx=4)
        tk.Button(top_bar, text="🔍 Disassemble", command=self.disassemble_code, bg="#334155", fg="#ffffff", font=("Segoe UI", 9), relief="flat", padx=8, pady=4).pack(side=tk.LEFT, padx=4)
        tk.Button(top_bar, text="📂 Open", command=self.open_file, bg="#334155", fg="#ffffff", font=("Segoe UI", 9), relief="flat", padx=8, pady=4).pack(side=tk.LEFT, padx=4)
        tk.Button(top_bar, text="💾 Save", command=self.save_file, bg="#334155", fg="#ffffff", font=("Segoe UI", 9), relief="flat", padx=8, pady=4).pack(side=tk.LEFT, padx=4)

        # Main Paned Window (Split into Editor & Console)
        paned = tk.PanedWindow(root, orient=tk.VERTICAL, bg="#334155", sashwidth=4)
        paned.pack(fill=tk.BOTH, expand=True, padx=8, pady=8)

        # Editor Area
        editor_frame = tk.Frame(paned, bg="#090d16")
        paned.add(editor_frame, height=420)

        tk.Label(editor_frame, text="Source Code (.gaz)", font=("Segoe UI", 9, "bold"), fg="#94a3b8", bg="#090d16", anchor="w").pack(fill=tk.X, padx=8, pady=4)

        self.editor = tk.Text(editor_frame, font=("Consolas", 11), bg="#090d16", fg="#f8fafc", insertbackground="#38bdf8", relief="flat", padx=10, pady=10)
        self.editor.pack(fill=tk.BOTH, expand=True)

        # Console Output Area
        console_frame = tk.Frame(paned, bg="#020617")
        paned.add(console_frame, height=200)

        tk.Label(console_frame, text="Terminal & VM Execution Output", font=("Segoe UI", 9, "bold"), fg="#94a3b8", bg="#020617", anchor="w").pack(fill=tk.X, padx=8, pady=4)

        self.console = tk.Text(console_frame, font=("Consolas", 10), bg="#020617", fg="#38bdf8", relief="flat", padx=10, pady=6)
        self.console.pack(fill=tk.BOTH, expand=True)

        # Load Default Sample Code
        default_code = '''// GenAz Native Programming Language Demo
fn fib(n) {
    if n <= 1 {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}

println("=== GenAz Native VM Execution ===");
println("Fibonacci sequence from 0 to 10:");
for i in 0..11 {
    println("fib(" + str(i) + ") = " + str(fib(i)));
}
'''
        self.editor.insert(tk.END, default_code)
        self.root.bind("<F5>", lambda e: self.run_code())

    def log(self, text):
        self.console.insert(tk.END, text + "\n")
        self.console.see(tk.END)

    def run_code(self):
        self.console.delete("1.0", tk.END)
        source = self.editor.get("1.0", tk.END).strip()
        if not source:
            self.log("[Error] Source is empty.")
            return

        old_stdout = sys.stdout
        redirected = io.StringIO()
        sys.stdout = redirected

        try:
            lexer = Lexer(source)
            tokens = lexer.tokenize()

            parser = Parser(tokens)
            program = parser.parse()

            TypeChecker().check(program)

            compiler = BytecodeCompiler()
            instructions, constants, functions = compiler.compile(program)

            vm = VirtualMachine(instructions, constants)
            vm.run()

            sys.stdout = old_stdout
            self.log(redirected.getvalue())
            self.log("[SUCCESS] Program executed with exit code 0.")
        except Exception as e:
            sys.stdout = old_stdout
            self.log(redirected.getvalue())
            self.log(f"[RUNTIME ERROR] {e}")

    def disassemble_code(self):
        self.console.delete("1.0", tk.END)
        source = self.editor.get("1.0", tk.END).strip()
        try:
            tokens = Lexer(source).tokenize()
            prog = Parser(tokens).parse()
            instrs, consts, fns = BytecodeCompiler().compile(prog)
            self.log(disassemble(instrs, consts, fns))
        except Exception as e:
            self.log(f"[DISASSEMBLY ERROR] {e}")

    def build_binary(self):
        source = self.editor.get("1.0", tk.END).strip()
        if not source:
            return
        save_path = filedialog.asksaveasfilename(defaultextension=".gbc", filetypes=[("GenAz Bytecode", "*.gbc")])
        if not save_path:
            return
        try:
            from src.binary_format import serialize_bytecode
            tokens = Lexer(source).tokenize()
            prog = Parser(tokens).parse()
            instrs, consts, fns = BytecodeCompiler().compile(prog)
            data = serialize_bytecode(instrs, consts, fns)
            Path(save_path).write_bytes(data)
            self.log(f"[SUCCESS] Compiled {len(data)} bytes of binary bytecode to: {save_path}")
        except Exception as e:
            self.log(f"[BUILD ERROR] {e}")

    def open_file(self):
        path = filedialog.askopenfilename(filetypes=[("GenAz Source", "*.gaz"), ("All Files", "*.*")])
        if path:
            text = Path(path).read_text(encoding="utf-8")
            self.editor.delete("1.0", tk.END)
            self.editor.insert(tk.END, text)
            self.log(f"[LOADED] {path}")

    def save_file(self):
        path = filedialog.asksaveasfilename(defaultextension=".gaz", filetypes=[("GenAz Source", "*.gaz")])
        if path:
            Path(path).write_text(self.editor.get("1.0", tk.END), encoding="utf-8")
            self.log(f"[SAVED] {path}")


def launch_desktop_ide():
    root = tk.Tk()
    app = GenAzDesktopIDE(root)
    root.mainloop()


if __name__ == "__main__":
    launch_desktop_ide()
