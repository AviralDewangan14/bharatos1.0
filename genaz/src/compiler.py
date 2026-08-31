"""
GenAz Bytecode Compiler
Translates AST into compact, high-efficiency bytecode instructions.
"""

from enum import Enum, auto
from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from .ast_nodes import (
    Program, Block, Literal, Identifier, LetStmt, AssignStmt,
    BinaryOp, UnaryOp, FunctionDecl, FunctionCall, ReturnStmt,
    IfStmt, WhileStmt, ForInStmt, SpawnStmt, ChannelSend, ChannelRecv,
    MemberAccess, IndexAccess, ListLiteral, MapLiteral
)


class OpCode(Enum):
    CONST = auto()
    POP = auto()
    DUP = auto()
    
    LOAD = auto()
    STORE = auto()
    
    ADD = auto()
    SUB = auto()
    MUL = auto()
    DIV = auto()
    MOD = auto()
    POW = auto()
    NEG = auto()
    NOT = auto()
    
    EQ = auto()
    NEQ = auto()
    LT = auto()
    LTE = auto()
    GT = auto()
    GTE = auto()
    
    JUMP = auto()
    JUMP_IF_FALSE = auto()
    
    CALL = auto()
    RET = auto()
    
    SPAWN = auto()
    CHAN_SEND = auto()
    CHAN_RECV = auto()
    
    MAKE_LIST = auto()
    MAKE_MAP = auto()
    INDEX_GET = auto()
    INDEX_SET = auto()
    
    HALT = auto()


@dataclass
class Instruction:
    opcode: OpCode
    arg: Any = None
    line: int = 0

    def __repr__(self) -> str:
        if self.arg is not None:
            return f"{self.opcode.name:<16} {repr(self.arg)}"
        return f"{self.opcode.name}"


@dataclass
class CompiledFunction:
    name: str
    params: List[str]
    instructions: List[Instruction]
    constants: List[Any]


class BytecodeCompiler:
    def __init__(self):
        self.instructions: List[Instruction] = []
        self.constants: List[Any] = []
        self.functions: Dict[str, CompiledFunction] = {}

    def add_constant(self, value: Any) -> int:
        if value in self.constants:
            return self.constants.index(value)
        self.constants.append(value)
        return len(self.constants) - 1

    def emit(self, opcode: OpCode, arg: Any = None, line: int = 0) -> int:
        inst = Instruction(opcode, arg, line)
        self.instructions.append(inst)
        return len(self.instructions) - 1

    def compile(self, program: Program) -> tuple[List[Instruction], List[Any], Dict[str, CompiledFunction]]:
        for stmt in program.statements:
            self.compile_stmt(stmt)
        self.emit(OpCode.HALT)
        return self.instructions, self.constants, self.functions

    def compile_stmt(self, stmt):
        if isinstance(stmt, LetStmt):
            self.compile_expr(stmt.value)
            self.emit(OpCode.STORE, stmt.name)

        elif isinstance(stmt, AssignStmt):
            if stmt.op == "=":
                self.compile_expr(stmt.value)
            else:
                bin_op = stmt.op[0] # '+', '-', '*', '/'
                self.compile_expr(stmt.target)
                self.compile_expr(stmt.value)
                op_map = {'+': OpCode.ADD, '-': OpCode.SUB, '*': OpCode.MUL, '/': OpCode.DIV}
                self.emit(op_map.get(bin_op, OpCode.ADD))

            if isinstance(stmt.target, Identifier):
                self.emit(OpCode.STORE, stmt.target.name)
            elif isinstance(stmt.target, IndexAccess):
                self.compile_expr(stmt.target.collection)
                self.compile_expr(stmt.target.index)
                self.emit(OpCode.INDEX_SET)

        elif isinstance(stmt, FunctionDecl):
            sub_compiler = BytecodeCompiler()
            for s in stmt.body.statements:
                sub_compiler.compile_stmt(s)
            sub_compiler.emit(OpCode.CONST, sub_compiler.add_constant(None))
            sub_compiler.emit(OpCode.RET)

            compiled_fn = CompiledFunction(
                name=stmt.name,
                params=[p[0] for p in stmt.params],
                instructions=sub_compiler.instructions,
                constants=sub_compiler.constants
            )
            self.functions[stmt.name] = compiled_fn
            const_idx = self.add_constant(compiled_fn)
            self.emit(OpCode.CONST, const_idx)
            self.emit(OpCode.STORE, stmt.name)

        elif isinstance(stmt, ReturnStmt):
            if stmt.value:
                self.compile_expr(stmt.value)
            else:
                c_idx = self.add_constant(None)
                self.emit(OpCode.CONST, c_idx)
            self.emit(OpCode.RET)

        elif isinstance(stmt, IfStmt):
            self.compile_expr(stmt.condition)
            jump_false_ip = self.emit(OpCode.JUMP_IF_FALSE, 0)

            for s in stmt.then_branch.statements:
                self.compile_stmt(s)

            exit_jumps = [self.emit(OpCode.JUMP, 0)]
            self.instructions[jump_false_ip].arg = len(self.instructions)

            for cond, elif_block in stmt.elif_branches:
                self.compile_expr(cond)
                elif_jump_false = self.emit(OpCode.JUMP_IF_FALSE, 0)
                for s in elif_block.statements:
                    self.compile_stmt(s)
                exit_jumps.append(self.emit(OpCode.JUMP, 0))
                self.instructions[elif_jump_false].arg = len(self.instructions)

            if stmt.else_branch:
                for s in stmt.else_branch.statements:
                    self.compile_stmt(s)

            end_ip = len(self.instructions)
            for j in exit_jumps:
                self.instructions[j].arg = end_ip

        elif isinstance(stmt, WhileStmt):
            loop_start_ip = len(self.instructions)
            self.compile_expr(stmt.condition)
            exit_jump_ip = self.emit(OpCode.JUMP_IF_FALSE, 0)

            for s in stmt.body.statements:
                self.compile_stmt(s)

            self.emit(OpCode.JUMP, loop_start_ip)
            self.instructions[exit_jump_ip].arg = len(self.instructions)

        elif isinstance(stmt, ForInStmt):
            self.compile_expr(stmt.iterable)
            iter_var = f"__iter_{len(self.instructions)}"
            idx_var = f"__idx_{len(self.instructions)}"

            self.emit(OpCode.STORE, iter_var)
            c_zero = self.add_constant(0)
            self.emit(OpCode.CONST, c_zero)
            self.emit(OpCode.STORE, idx_var)

            loop_start = len(self.instructions)
            self.emit(OpCode.LOAD, idx_var)
            self.emit(OpCode.LOAD, "len")
            self.emit(OpCode.LOAD, iter_var)
            self.emit(OpCode.CALL, 1)
            self.emit(OpCode.LT)
            exit_jump = self.emit(OpCode.JUMP_IF_FALSE, 0)

            self.emit(OpCode.LOAD, iter_var)
            self.emit(OpCode.LOAD, idx_var)
            self.emit(OpCode.INDEX_GET)
            self.emit(OpCode.STORE, stmt.var_name)

            for s in stmt.body.statements:
                self.compile_stmt(s)

            self.emit(OpCode.LOAD, idx_var)
            c_one = self.add_constant(1)
            self.emit(OpCode.CONST, c_one)
            self.emit(OpCode.ADD)
            self.emit(OpCode.STORE, idx_var)

            self.emit(OpCode.JUMP, loop_start)
            self.instructions[exit_jump].arg = len(self.instructions)

        elif isinstance(stmt, SpawnStmt):
            self.compile_expr(stmt.call.callee)
            for arg in stmt.call.args:
                self.compile_expr(arg)
            self.emit(OpCode.SPAWN, len(stmt.call.args))

        elif isinstance(stmt, ChannelSend):
            self.compile_expr(stmt.channel)
            self.compile_expr(stmt.value)
            self.emit(OpCode.CHAN_SEND)

        elif isinstance(stmt, (FunctionCall, BinaryOp, UnaryOp)):
            self.compile_expr(stmt)
            self.emit(OpCode.POP)

    def compile_expr(self, expr):
        if isinstance(expr, Literal):
            const_idx = self.add_constant(expr.value)
            self.emit(OpCode.CONST, const_idx)

        elif isinstance(expr, Identifier):
            self.emit(OpCode.LOAD, expr.name)

        elif isinstance(expr, ListLiteral):
            for el in expr.elements:
                self.compile_expr(el)
            self.emit(OpCode.MAKE_LIST, len(expr.elements))

        elif isinstance(expr, MapLiteral):
            for k, v in expr.pairs:
                if isinstance(k, Identifier):
                    c_idx = self.add_constant(k.name)
                    self.emit(OpCode.CONST, c_idx)
                else:
                    self.compile_expr(k)
                self.compile_expr(v)
            self.emit(OpCode.MAKE_MAP, len(expr.pairs))

        elif isinstance(expr, BinaryOp):
            self.compile_expr(expr.left)
            self.compile_expr(expr.right)
            op_map = {
                "+": OpCode.ADD, "-": OpCode.SUB, "*": OpCode.MUL, "/": OpCode.DIV,
                "%": OpCode.MOD, "**": OpCode.POW, "==": OpCode.EQ, "!=": OpCode.NEQ,
                "<": OpCode.LT, "<=": OpCode.LTE, ">": OpCode.GT, ">=": OpCode.GTE,
            }
            if expr.op in op_map:
                self.emit(op_map[expr.op])
            elif expr.op == "and":
                self.emit(OpCode.MUL)
            elif expr.op == "or":
                self.emit(OpCode.ADD)

        elif isinstance(expr, UnaryOp):
            self.compile_expr(expr.operand)
            if expr.op == "-": self.emit(OpCode.NEG)
            elif expr.op == "!": self.emit(OpCode.NOT)

        elif isinstance(expr, FunctionCall):
            self.compile_expr(expr.callee)
            for arg in expr.args:
                self.compile_expr(arg)
            self.emit(OpCode.CALL, len(expr.args))

        elif isinstance(expr, ChannelRecv):
            self.compile_expr(expr.channel)
            self.emit(OpCode.CHAN_RECV)

        elif isinstance(expr, IndexAccess):
            self.compile_expr(expr.collection)
            self.compile_expr(expr.index)
            self.emit(OpCode.INDEX_GET)

        elif isinstance(expr, MemberAccess):
            self.compile_expr(expr.object_expr)
            c_idx = self.add_constant(expr.member_name)
            self.emit(OpCode.CONST, c_idx)
            self.emit(OpCode.INDEX_GET)
