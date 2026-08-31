import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))

from src.lexer import Lexer, TokenType
from src.parser import Parser
from src.type_checker import TypeChecker
from src.compiler import BytecodeCompiler
from src.vm import VirtualMachine


class TestGenAzLanguage(unittest.TestCase):
    def test_lexer_tokens(self):
        code = "let mut x: i64 = 42 + 10"
        lexer = Lexer(code)
        tokens = lexer.tokenize()
        types = [t.type for t in tokens if t.type != TokenType.EOF]
        self.assertEqual(types, [
            TokenType.LET, TokenType.MUT, TokenType.IDENTIFIER,
            TokenType.COLON, TokenType.IDENTIFIER, TokenType.ASSIGN,
            TokenType.INT, TokenType.PLUS, TokenType.INT
        ])

    def test_arithmetic_eval(self):
        code = """
        let x = 10 + 20 * 2
        let y = (x - 10) / 4
        """
        lexer = Lexer(code)
        prog = Parser(lexer.tokenize()).parse()
        TypeChecker().check(prog)
        inst, consts, fns = BytecodeCompiler().compile(prog)
        vm = VirtualMachine(inst, consts)
        vm.run()
        self.assertEqual(vm.globals["x"], 50)
        self.assertEqual(vm.globals["y"], 10)

    def test_function_calls(self):
        code = """
        fn add(a: i64, b: i64) -> i64 {
            return a + b
        }
        let res = add(15, 25)
        """
        lexer = Lexer(code)
        prog = Parser(lexer.tokenize()).parse()
        TypeChecker().check(prog)
        inst, consts, fns = BytecodeCompiler().compile(prog)
        vm = VirtualMachine(inst, consts)
        vm.run()
        self.assertEqual(vm.globals["res"], 40)

    def test_loops_and_conditionals(self):
        code = """
        let mut total = 0
        let mut i = 1
        while i <= 5 {
            total += i
            i += 1
        }
        """
        lexer = Lexer(code)
        prog = Parser(lexer.tokenize()).parse()
        TypeChecker().check(prog)
        inst, consts, fns = BytecodeCompiler().compile(prog)
        vm = VirtualMachine(inst, consts)
        vm.run()
        self.assertEqual(vm.globals["total"], 15)


if __name__ == "__main__":
    unittest.main()
