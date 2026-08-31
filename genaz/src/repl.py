"""
GenAz Interactive REPL (Read-Eval-Print Loop)
Provides immediate feedback, syntax highlighting, and expression evaluation.
"""

import sys
from .lexer import Lexer
from .parser import Parser
from .type_checker import TypeChecker
from .compiler import BytecodeCompiler
from .vm import VirtualMachine


def start_repl():
    print("=================================================================")
    print(" 🚀 GenAz Interactive REPL v1.0.0 (x86_64-genaz-runtime)")
    print(" Type expressions or statements. Type 'exit()' or Ctrl+C to quit.")
    print("=================================================================")

    globals_env = {}
    type_checker = TypeChecker()

    while True:
        try:
            line = input("genaz> ")
            if not line.strip():
                continue
            if line.strip() in ("exit()", "quit()", "exit"):
                print("Bye!")
                break

            # Tokenize & Parse
            lexer = Lexer(line)
            tokens = lexer.tokenize()
            parser = Parser(tokens)
            program = parser.parse()

            # Type Check
            type_checker.check(program)

            # Compile & Run
            compiler = BytecodeCompiler()
            instructions, constants, functions = compiler.compile(program)
            vm = VirtualMachine(instructions, constants, globals_env=globals_env)
            result = vm.run()

            # Update persistent globals
            globals_env.update(vm.globals)

            if result is not None:
                print(f"=> {result}")

        except KeyboardInterrupt:
            print("\nBye!")
            break
        except Exception as e:
            print(f"Error: {e}", file=sys.stderr)
