"""
GenAz Language Command-Line Interface
Commands: run, build, check, repl, bench
"""

import sys
import os
if hasattr(sys.stdout, 'reconfigure'):
    try: sys.stdout.reconfigure(encoding='utf-8')
    except Exception: pass

from pathlib import Path

# Add src to sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.lexer import Lexer
from src.parser import Parser
from src.type_checker import TypeChecker
from src.compiler import BytecodeCompiler
from src.vm import VirtualMachine
from src.repl import start_repl


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


def main():
    if len(sys.argv) < 2:
        print("Usage: genaz <command> [arguments]")
        print("Commands:")
        print("  run <file.gaz>     Compile and execute a GenAz source file")
        print("  check <file.gaz>   Type check and validate syntax")
        print("  repl               Start the interactive REPL")
        print("  version            Display GenAz compiler version")
        return

    cmd = sys.argv[1]

    if cmd == "repl":
        start_repl()

    elif cmd == "version":
        print("GenAz Language Compiler v1.0.0 (Fast, Simple & Universal)")

    elif cmd in ("run", "check"):
        if len(sys.argv) < 3:
            print(f"Error: Missing filename for 'genaz {cmd}'")
            sys.exit(1)
        
        file_path = Path(sys.argv[2])
        if not file_path.exists():
            print(f"Error: File '{file_path}' not found")
            sys.exit(1)

        source_code = file_path.read_text(encoding="utf-8")

        if cmd == "check":
            lexer = Lexer(source_code)
            tokens = lexer.tokenize()
            parser = Parser(tokens)
            prog = parser.parse()
            TypeChecker().check(prog)
            print(f"[OK] '{file_path}' passed syntax and static type verification.")
        else:
            execute_source(source_code, str(file_path))

    else:
        # Direct file execution fallback
        file_path = Path(cmd)
        if file_path.exists():
            execute_source(file_path.read_text(encoding="utf-8"), str(file_path))
        else:
            print(f"Unknown command: {cmd}")


if __name__ == "__main__":
    main()
