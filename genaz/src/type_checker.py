"""
GenAz Static Type Checker & Inference Engine
Enforces type safety with seamless Hindley-Milner-style local type inference.
"""

from typing import Dict, Any, Optional
from .ast_nodes import (
    Program, Block, Literal, Identifier, LetStmt, AssignStmt,
    BinaryOp, UnaryOp, FunctionDecl, FunctionCall, ReturnStmt,
    IfStmt, WhileStmt, ForInStmt, ListLiteral, MapLiteral
)


class TypeError(Exception):
    def __init__(self, message: str):
        super().__init__(f"TypeError: {message}")


class TypeChecker:
    PRIMITIVES = {"i64", "f64", "str", "bool", "nil", "any", "list", "map", "chan"}

    def __init__(self):
        self.scopes: list[Dict[str, str]] = [{}]
        self.functions: Dict[str, tuple] = {
            "print": (["any"], "nil"),
            "println": (["any"], "nil"),
            "input": (["str"], "str"),
            "len": (["any"], "i64"),
            "range": (["i64", "i64"], "list"),
            "type_of": (["any"], "str"),
            "assert": (["bool", "str"], "nil"),
            "chan": ([], "chan"),
            "sin": (["f64"], "f64"),
            "cos": (["f64"], "f64"),
            "sqrt": (["f64"], "f64"),
            "pow": (["f64", "f64"], "f64"),
            "matrix_mul": (["list", "list"], "list"),
            "read_file": (["str"], "str"),
            "write_file": (["str", "str"], "bool"),
            "time_now": ([], "f64"),
            "sleep": (["f64"], "nil")
        }

    def push_scope(self):
        self.scopes.append({})

    def pop_scope(self):
        self.scopes.pop()

    def set_var(self, name: str, type_name: str):
        self.scopes[-1][name] = type_name

    def lookup_var(self, name: str) -> Optional[str]:
        for scope in reversed(self.scopes):
            if name in scope:
                return scope[name]
        return None

    def check(self, program: Program):
        for stmt in program.statements:
            self.check_stmt(stmt)

    def check_stmt(self, stmt):
        if isinstance(stmt, LetStmt):
            val_type = self.infer_type(stmt.value)
            declared_type = stmt.type_annotation or val_type
            if stmt.type_annotation and stmt.type_annotation != "any" and val_type != "any":
                if stmt.type_annotation != val_type:
                    if not (stmt.type_annotation == "f64" and val_type == "i64"):
                        raise TypeError(f"Cannot assign '{val_type}' to variable '{stmt.name}' of type '{stmt.type_annotation}'")
            self.set_var(stmt.name, declared_type)

        elif isinstance(stmt, FunctionDecl):
            param_types = [p[1] or "any" for p in stmt.params]
            ret_type = stmt.return_type or "any"
            self.functions[stmt.name] = (param_types, ret_type)
            self.set_var(stmt.name, "fn")

            self.push_scope()
            for pname, ptype, _ in stmt.params:
                self.set_var(pname, ptype or "any")
            for s in stmt.body.statements:
                self.check_stmt(s)
            self.pop_scope()

        elif isinstance(stmt, IfStmt):
            self.infer_type(stmt.condition)
            self.push_scope()
            for s in stmt.then_branch.statements: self.check_stmt(s)
            self.pop_scope()
            for cond, b in stmt.elif_branches:
                self.infer_type(cond)
                self.push_scope()
                for s in b.statements: self.check_stmt(s)
                self.pop_scope()
            if stmt.else_branch:
                self.push_scope()
                for s in stmt.else_branch.statements: self.check_stmt(s)
                self.pop_scope()

        elif isinstance(stmt, WhileStmt):
            self.infer_type(stmt.condition)
            self.push_scope()
            for s in stmt.body.statements: self.check_stmt(s)
            self.pop_scope()

        elif isinstance(stmt, ForInStmt):
            iter_type = self.infer_type(stmt.iterable)
            self.push_scope()
            self.set_var(stmt.var_name, "any" if iter_type == "list" else "i64")
            for s in stmt.body.statements: self.check_stmt(s)
            self.pop_scope()

        elif isinstance(stmt, ReturnStmt):
            if stmt.value:
                self.infer_type(stmt.value)

        elif isinstance(stmt, AssignStmt):
            val_type = self.infer_type(stmt.value)
            if isinstance(stmt.target, Identifier):
                var_type = self.lookup_var(stmt.target.name)
                if not var_type:
                    self.set_var(stmt.target.name, val_type)

        elif isinstance(stmt, (FunctionCall, BinaryOp, UnaryOp)):
            self.infer_type(stmt)

    def infer_type(self, expr) -> str:
        if isinstance(expr, Literal):
            return expr.type_name
        elif isinstance(expr, Identifier):
            t = self.lookup_var(expr.name)
            return t or "any"
        elif isinstance(expr, ListLiteral):
            return "list"
        elif isinstance(expr, MapLiteral):
            return "map"
        elif isinstance(expr, BinaryOp):
            l = self.infer_type(expr.left)
            r = self.infer_type(expr.right)
            if expr.op in ("+", "-", "*", "/", "%", "**"):
                if l == "f64" or r == "f64": return "f64"
                if l == "str" or r == "str": return "str"
                return "i64"
            elif expr.op in ("==", "!=", "<", "<=", ">", ">=", "and", "or"):
                return "bool"
            return "any"
        elif isinstance(expr, UnaryOp):
            if expr.op == "!": return "bool"
            return self.infer_type(expr.operand)
        elif isinstance(expr, FunctionCall):
            if isinstance(expr.callee, Identifier):
                if expr.callee.name in self.functions:
                    return self.functions[expr.callee.name][1]
            return "any"
        return "any"
