"""
GenAz Recursive Descent Parser
Transforms token stream into structured Abstract Syntax Tree (AST).
"""

from typing import List, Optional, Any
from .ast_nodes import (
    Token, TokenType, ASTNode, Program, Block, Literal, Identifier,
    ListLiteral, MapLiteral, LetStmt, AssignStmt, BinaryOp, UnaryOp,
    FunctionDecl, FunctionCall, ReturnStmt, IfStmt, WhileStmt,
    ForInStmt, SpawnStmt, ChannelSend, ChannelRecv, MemberAccess,
    IndexAccess, ImportStmt
)


class ParserError(Exception):
    def __init__(self, message: str, token: Token):
        super().__init__(f"ParseError [Line {token.line}, Col {token.column}]: {message} (got {token.type.name})")
        self.token = token


class Parser:
    def __init__(self, tokens: List[Token]):
        self.tokens = tokens
        self.pos = 0

    def peek(self, offset: int = 0) -> Token:
        idx = self.pos + offset
        if idx < len(self.tokens):
            return self.tokens[idx]
        return self.tokens[-1]

    def current(self) -> Token:
        return self.peek()

    def advance(self) -> Token:
        tok = self.current()
        if tok.type != TokenType.EOF:
            self.pos += 1
        return tok

    def match(self, *expected_types: TokenType) -> bool:
        if self.current().type in expected_types:
            self.advance()
            return True
        return False

    def expect(self, expected_type: TokenType, err_msg: str = "") -> Token:
        if self.current().type == expected_type:
            return self.advance()
        msg = err_msg or f"Expected {expected_type.name}"
        raise ParserError(msg, self.current())

    def skip_newlines(self):
        while self.current().type in (TokenType.NEWLINE, TokenType.SEMICOLON):
            self.advance()

    def parse(self) -> Program:
        statements = []
        self.skip_newlines()
        while self.current().type != TokenType.EOF:
            stmt = self.parse_statement()
            if stmt:
                statements.append(stmt)
            self.skip_newlines()
        return Program(statements=statements)

    def parse_statement(self) -> ASTNode:
        self.skip_newlines()
        tok = self.current()

        if tok.type == TokenType.LET:
            return self.parse_let_statement()
        elif tok.type == TokenType.FN:
            return self.parse_function_decl()
        elif tok.type == TokenType.IF:
            return self.parse_if_statement()
        elif tok.type == TokenType.WHILE:
            return self.parse_while_statement()
        elif tok.type == TokenType.FOR:
            return self.parse_for_in_statement()
        elif tok.type == TokenType.RETURN:
            return self.parse_return_statement()
        elif tok.type == TokenType.SPAWN:
            return self.parse_spawn_statement()
        elif tok.type == TokenType.IMPORT:
            return self.parse_import_statement()
        else:
            return self.parse_expression_statement()

    def parse_let_statement(self) -> LetStmt:
        self.expect(TokenType.LET)
        is_mut = self.match(TokenType.MUT)
        ident_tok = self.expect(TokenType.IDENTIFIER, "Expected variable name after 'let'")
        
        type_ann = None
        if self.match(TokenType.COLON):
            type_tok = self.expect(TokenType.IDENTIFIER, "Expected type name after ':'")
            type_ann = type_tok.value

        self.expect(TokenType.ASSIGN, "Expected '=' in variable declaration")
        val = self.parse_expression()
        return LetStmt(name=ident_tok.value, is_mut=is_mut, type_annotation=type_ann, value=val)

    def parse_function_decl(self) -> FunctionDecl:
        self.expect(TokenType.FN)
        name_tok = self.expect(TokenType.IDENTIFIER, "Expected function name after 'fn'")
        self.expect(TokenType.LPAREN, "Expected '(' after function name")
        
        params = []
        if self.current().type != TokenType.RPAREN:
            while True:
                pname = self.expect(TokenType.IDENTIFIER, "Expected parameter name").value
                ptype = None
                if self.match(TokenType.COLON):
                    ptype = self.advance().value if self.current().type in (TokenType.IDENTIFIER, TokenType.CHAN, TokenType.FN) else self.expect(TokenType.IDENTIFIER, "Expected type name after ':'").value
                params.append((pname, ptype, None))
                if not self.match(TokenType.COMMA):
                    break
        self.expect(TokenType.RPAREN, "Expected ')' after parameter list")

        ret_type = None
        if self.match(TokenType.ARROW):
            ret_type = self.expect(TokenType.IDENTIFIER, "Expected return type after '->'").value

        body = self.parse_block()
        return FunctionDecl(name=name_tok.value, params=params, return_type=ret_type, body=body)

    def parse_block(self) -> Block:
        self.skip_newlines()
        self.expect(TokenType.LBRACE, "Expected '{' to start block")
        stmts = []
        self.skip_newlines()
        while self.current().type != TokenType.RBRACE and self.current().type != TokenType.EOF:
            stmt = self.parse_statement()
            if stmt:
                stmts.append(stmt)
            self.skip_newlines()
        self.expect(TokenType.RBRACE, "Expected '}' to close block")
        return Block(statements=stmts)

    def parse_if_statement(self) -> IfStmt:
        self.expect(TokenType.IF)
        cond = self.parse_expression()
        then_branch = self.parse_block()
        self.skip_newlines()

        elif_branches = []
        while self.match(TokenType.ELIF):
            e_cond = self.parse_expression()
            e_body = self.parse_block()
            elif_branches.append((e_cond, e_body))
            self.skip_newlines()

        else_branch = None
        if self.match(TokenType.ELSE):
            else_branch = self.parse_block()

        return IfStmt(condition=cond, then_branch=then_branch, elif_branches=elif_branches, else_branch=else_branch)

    def parse_while_statement(self) -> WhileStmt:
        self.expect(TokenType.WHILE)
        cond = self.parse_expression()
        body = self.parse_block()
        return WhileStmt(condition=cond, body=body)

    def parse_for_in_statement(self) -> ForInStmt:
        self.expect(TokenType.FOR)
        var_tok = self.expect(TokenType.IDENTIFIER, "Expected variable name in for-loop")
        self.expect(TokenType.IN, "Expected 'in' in for-loop")
        iterable = self.parse_expression()
        body = self.parse_block()
        return ForInStmt(var_name=var_tok.value, iterable=iterable, body=body)

    def parse_return_statement(self) -> ReturnStmt:
        self.expect(TokenType.RETURN)
        if self.current().type in (TokenType.NEWLINE, TokenType.SEMICOLON, TokenType.RBRACE, TokenType.EOF):
            return ReturnStmt(value=None)
        val = self.parse_expression()
        return ReturnStmt(value=val)

    def parse_spawn_statement(self) -> SpawnStmt:
        self.expect(TokenType.SPAWN)
        call_expr = self.parse_expression()
        if not isinstance(call_expr, FunctionCall):
            raise ParserError("Expected function call after 'spawn'", self.current())
        return SpawnStmt(call=call_expr)

    def parse_import_statement(self) -> ImportStmt:
        self.expect(TokenType.IMPORT)
        mod_tok = self.expect(TokenType.IDENTIFIER, "Expected module name after 'import'")
        alias = None
        return ImportStmt(module_name=mod_tok.value, alias=alias)

    def parse_expression_statement(self) -> ASTNode:
        expr = self.parse_expression()
        tok = self.current()
        if tok.type in (TokenType.ASSIGN, TokenType.PLUS_ASSIGN, TokenType.MINUS_ASSIGN, TokenType.STAR_ASSIGN, TokenType.SLASH_ASSIGN):
            op_tok = self.advance()
            val = self.parse_expression()
            return AssignStmt(target=expr, value=val, op=op_tok.value)
        elif tok.type == TokenType.SEND:
            self.advance()
            val = self.parse_expression()
            return ChannelSend(channel=expr, value=val)
        return expr

    def parse_expression(self) -> ASTNode:
        return self.parse_logical_or()

    def parse_logical_or(self) -> ASTNode:
        node = self.parse_logical_and()
        while self.match(TokenType.OR):
            right = self.parse_logical_and()
            node = BinaryOp(left=node, op="or", right=right)
        return node

    def parse_logical_and(self) -> ASTNode:
        node = self.parse_equality()
        while self.match(TokenType.AND):
            right = self.parse_equality()
            node = BinaryOp(left=node, op="and", right=right)
        return node

    def parse_equality(self) -> ASTNode:
        node = self.parse_comparison()
        while self.current().type in (TokenType.EQ, TokenType.NEQ):
            op = self.advance().value
            right = self.parse_comparison()
            node = BinaryOp(left=node, op=op, right=right)
        return node

    def parse_comparison(self) -> ASTNode:
        node = self.parse_term()
        while self.current().type in (TokenType.LT, TokenType.LTE, TokenType.GT, TokenType.GTE):
            op = self.advance().value
            right = self.parse_term()
            node = BinaryOp(left=node, op=op, right=right)
        return node

    def parse_term(self) -> ASTNode:
        node = self.parse_factor()
        while self.current().type in (TokenType.PLUS, TokenType.MINUS):
            op = self.advance().value
            right = self.parse_factor()
            node = BinaryOp(left=node, op=op, right=right)
        return node

    def parse_factor(self) -> ASTNode:
        node = self.parse_power()
        while self.current().type in (TokenType.STAR, TokenType.SLASH, TokenType.PERCENT):
            op = self.advance().value
            right = self.parse_power()
            node = BinaryOp(left=node, op=op, right=right)
        return node

    def parse_power(self) -> ASTNode:
        node = self.parse_unary()
        while self.match(TokenType.POW):
            right = self.parse_unary()
            node = BinaryOp(left=node, op="**", right=right)
        return node

    def parse_unary(self) -> ASTNode:
        if self.current().type in (TokenType.MINUS, TokenType.NOT):
            op = self.advance().value
            operand = self.parse_unary()
            return UnaryOp(op=op, operand=operand)
        elif self.current().type == TokenType.SEND:
            self.advance() # '<-'
            operand = self.parse_unary()
            return ChannelRecv(channel=operand)
        return self.parse_call_and_member()

    def parse_call_and_member(self) -> ASTNode:
        node = self.parse_primary()
        while True:
            if self.match(TokenType.LPAREN):
                args = []
                if self.current().type != TokenType.RPAREN:
                    while True:
                        args.append(self.parse_expression())
                        if not self.match(TokenType.COMMA):
                            break
                self.expect(TokenType.RPAREN, "Expected ')' after call arguments")
                node = FunctionCall(callee=node, args=args)
            elif self.match(TokenType.DOT):
                member_tok = self.expect(TokenType.IDENTIFIER, "Expected member name after '.'")
                node = MemberAccess(object_expr=node, member_name=member_tok.value)
            elif self.match(TokenType.LBRACKET):
                idx = self.parse_expression()
                self.expect(TokenType.RBRACKET, "Expected ']' after index")
                node = IndexAccess(collection=node, index=idx)
            else:
                break
        return node

    def parse_primary(self) -> ASTNode:
        tok = self.current()

        if tok.type == TokenType.INT:
            self.advance()
            return Literal(value=tok.value, type_name="i64")
        elif tok.type == TokenType.FLOAT:
            self.advance()
            return Literal(value=tok.value, type_name="f64")
        elif tok.type == TokenType.STRING:
            self.advance()
            return Literal(value=tok.value, type_name="str")
        elif tok.type == TokenType.BOOL:
            self.advance()
            return Literal(value=tok.value, type_name="bool")
        elif tok.type in (TokenType.IDENTIFIER, TokenType.CHAN):
            self.advance()
            name_str = tok.value if isinstance(tok.value, str) else "chan"
            return Identifier(name=name_str)
        elif self.match(TokenType.LPAREN):
            expr = self.parse_expression()
            self.expect(TokenType.RPAREN, "Expected ')' after expression")
            return expr
        elif self.match(TokenType.LBRACKET):
            elements = []
            self.skip_newlines()
            if self.current().type != TokenType.RBRACKET:
                while True:
                    self.skip_newlines()
                    if self.current().type == TokenType.RBRACKET: break
                    elements.append(self.parse_expression())
                    self.skip_newlines()
                    if not self.match(TokenType.COMMA):
                        break
                    self.skip_newlines()
            self.skip_newlines()
            self.expect(TokenType.RBRACKET, "Expected ']' after list elements")
            return ListLiteral(elements=elements)
        elif self.match(TokenType.LBRACE):
            pairs = []
            self.skip_newlines()
            if self.current().type != TokenType.RBRACE:
                while True:
                    self.skip_newlines()
                    if self.current().type == TokenType.RBRACE: break
                    key = self.parse_expression()
                    self.skip_newlines()
                    self.expect(TokenType.COLON, "Expected ':' in map entry")
                    self.skip_newlines()
                    val = self.parse_expression()
                    pairs.append((key, val))
                    self.skip_newlines()
                    if not self.match(TokenType.COMMA):
                        break
                    self.skip_newlines()
            self.skip_newlines()
            self.expect(TokenType.RBRACE, "Expected '}' after map pairs")
            return MapLiteral(pairs=pairs)
        else:
            raise ParserError(f"Unexpected token in expression: {tok.type.name}", tok)
