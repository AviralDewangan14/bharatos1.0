"""
GenAz Native Programming Language Toolchain
Commands: run, build, check, dis, ast, tokens, repl, gui, version
"""

import sys
import os
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
from src.binary_format import serialize_bytecode, deserialize_bytecode


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


def execute_binary(data: bytes, filename: str = "<binary>") -> any:
    instructions, constants = deserialize_bytecode(data)
    vm = VirtualMachine(instructions, constants)
    return vm.run()


def print_help():
    print("""
GenAz Native Programming Language (v1.0.0)
Usage: genaz <command> [options] <file>

Commands:
  run <file.gaz|file.gbc>     Execute a GenAz source or compiled binary file
  build <file.gaz> [-o out]   Compile source code into binary bytecode (.gbc)
  check <file.gaz>            Validate syntax and verify static types
  dis <file.gaz|file.gbc>     Disassemble bytecode into readable assembly
  ast <file.gaz>              Display Abstract Syntax Tree
  tokens <file.gaz>           Dump token stream with line & column indices
  repl                        Start interactive REPL session
  gui                         Launch native desktop IDE application
  version                     Display version information
""")


def main():
    if len(sys.argv) < 2:
        print_help()
        return

    cmd = sys.argv[1].lower()

    if cmd in ("-h", "--help", "help"):
        print_help()

    elif cmd in ("-v", "--version", "version"):
        print("GenAz Native Programming Language Compiler v1.0.0")

    elif cmd == "repl":
        start_repl()

    elif cmd == "gui":
        try:
            from src.gui import launch_desktop_ide
            launch_desktop_ide()
        except Exception as e:
            print(f"[Error launching GUI]: {e}")

    elif cmd == "build":
        if len(sys.argv) < 3:
            print("Error: Missing input file for 'genaz build'")
            print("Usage: genaz build <input.gaz> [-o <output.gbc>]")
            sys.exit(1)

        input_path = Path(sys.argv[2])
        if not input_path.exists():
            print(f"Error: File '{input_path}' not found")
            sys.exit(1)

        output_path = input_path.with_suffix(".gbc")
        if "-o" in sys.argv:
            idx = sys.argv.index("-o")
            if idx + 1 < len(sys.argv):
                output_path = Path(sys.argv[idx + 1])

        source = input_path.read_text(encoding="utf-8")
        tokens = Lexer(source).tokenize()
        prog = Parser(tokens).parse()
        TypeChecker().check(prog)
        instrs, consts, fns = BytecodeCompiler().compile(prog)
        binary_data = serialize_bytecode(instrs, consts, fns)
        output_path.write_bytes(binary_data)
        print(f"[SUCCESS] Compiled '{input_path}' -> '{output_path}' ({len(binary_data)} bytes)")

    elif cmd in ("run", "check", "dis", "ast", "tokens"):
        if len(sys.argv) < 3:
            print(f"Error: Missing input file for 'genaz {cmd}'")
            print(f"Usage: genaz {cmd} <file.gaz|file.gbc>")
            sys.exit(1)

        file_path = Path(sys.argv[2])
        if not file_path.exists():
            print(f"Error: File '{file_path}' not found")
            sys.exit(1)

        if file_path.suffix == ".gbc":
            data = file_path.read_bytes()
            if cmd == "run":
                execute_binary(data, str(file_path))
            elif cmd == "dis":
                instrs, consts = deserialize_bytecode(data)
                print(disassemble(instrs, consts))
            else:
                print(f"Error: Command '{cmd}' cannot be performed on precompiled binary (.gbc).")
            return

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
        file_path = Path(cmd)
        if file_path.exists():
            if file_path.suffix == ".gbc":
                execute_binary(file_path.read_bytes(), str(file_path))
            else:
                execute_source(file_path.read_text(encoding="utf-8"), str(file_path))
        else:
            print(f"Unknown command: '{cmd}'")
            print("Run 'genaz --help' for usage.")


if __name__ == "__main__":
    main()
