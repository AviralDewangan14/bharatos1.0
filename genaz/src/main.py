"""
GenAz Universal CLI & Toolchain
Commands: run, check, dis, ast, tokens, repl, gui, version
"""

import sys
import os
import webbrowser
import threading
import http.server
import socketserver
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    try: sys.stdout.reconfigure(encoding='utf-8')
    except Exception: pass

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.lexer import Lexer
from src.parser import Parser
from src.type_checker import TypeChecker
from src.compiler import BytecodeCompiler
from src.vm import VirtualMachine
from src.repl import start_repl
from src.disassembler import disassemble


def execute_source(source: str, filename: str = "<stdin>") -> any:
    lexer = Lexer(source)
    tokens = lexer.tokenize()
    
    parser = Parser(tokens)
    program = parser.parse()

    type_checker = TypeChecker()
    type_checker.check(program)

    compiler = BytecodeCompiler()
    instructions, constants, functions = compiler.compile(program)

    vm = VirtualMachine(instructions, constants)
    return vm.run()


def launch_gui(port: int = 8520):
    ide_path = Path(__file__).parent.parent / "ide"
    os.chdir(str(ide_path))
    
    handler = http.server.SimpleHTTPRequestHandler
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            url = f"http://localhost:{port}/index.html"
            print(f"[*] Launching GenAz IDE Playground at: {url}")
            threading.Timer(0.5, lambda: webbrowser.open(url)).start()
            httpd.serve_forever()
    except OSError:
        url = f"http://localhost:{port}/index.html"
        print(f"[*] GenAz IDE running at: {url}")
        webbrowser.open(url)


def print_help():
    print("""
GenAz Language Toolchain (v1.0.0)
Usage: genaz <command> [arguments]

Commands:
  run <file.gaz>       Compile and run a GenAz program
  check <file.gaz>     Validate syntax and check static types
  dis <file.gaz>       Disassemble source code into virtual machine bytecode
  ast <file.gaz>       Parse and display Abstract Syntax Tree
  tokens <file.gaz>    Dump lexical token stream
  repl                 Start interactive command prompt
  gui                  Launch interactive web IDE playground
  version              Display version and runtime information
""")


def main():
    if len(sys.argv) < 2:
        print_help()
        return

    cmd = sys.argv[1].lower()

    if cmd in ("-h", "--help", "help"):
        print_help()

    elif cmd in ("-v", "--version", "version"):
        print("GenAz Language Toolchain v1.0.0 — Fast, Simple, Sovereign")

    elif cmd == "repl":
        start_repl()

    elif cmd == "gui":
        launch_gui()

    elif cmd in ("run", "check", "dis", "ast", "tokens"):
        if len(sys.argv) < 3:
            print(f"Error: Missing input file for 'genaz {cmd}'")
            print(f"Usage: genaz {cmd} <file.gaz>")
            sys.exit(1)

        file_path = Path(sys.argv[2])
        if not file_path.exists():
            print(f"Error: File '{file_path}' not found")
            sys.exit(1)

        source = file_path.read_text(encoding="utf-8")

        if cmd == "tokens":
            tokens = Lexer(source).tokenize()
            for t in tokens:
                print(f"Line {t.line:02d}:{t.col:02d}  {t.type.name:<18}  {repr(t.value)}")

        elif cmd == "ast":
            tokens = Lexer(source).tokenize()
            prog = Parser(tokens).parse()
            print(prog)

        elif cmd == "check":
            tokens = Lexer(source).tokenize()
            prog = Parser(tokens).parse()
            TypeChecker().check(prog)
            print(f"[SUCCESS] '{file_path}' passed syntax and static type checks.")

        elif cmd == "dis":
            tokens = Lexer(source).tokenize()
            prog = Parser(tokens).parse()
            instrs, consts, fns = BytecodeCompiler().compile(prog)
            print(disassemble(instrs, consts, fns))

        elif cmd == "run":
            execute_source(source, str(file_path))

    else:
        # Fallback: if user passed a .gaz file directly
        file_path = Path(cmd)
        if file_path.exists() and file_path.suffix == ".gaz":
            execute_source(file_path.read_text(encoding="utf-8"), str(file_path))
        else:
            print(f"Unknown command or file: '{cmd}'")
            print("Run 'genaz --help' for available commands.")


if __name__ == "__main__":
    main()
