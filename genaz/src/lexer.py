"""
GenAz Lexer & Scanner
Converts source code into a clean stream of typed tokens with line/col tracking.
"""

from typing import List, Optional
from .ast_nodes import Token, TokenType


class LexerError(Exception):
    def __init__(self, message: str, line: int, col: int):
        super().__init__(f"SyntaxError [Line {line}, Col {col}]: {message}")
        self.line = line
        self.col = col


class Lexer:
    KEYWORDS = {
        "fn": TokenType.FN,
        "let": TokenType.LET,
        "mut": TokenType.MUT,
        "const": TokenType.CONST,
        "if": TokenType.IF,
        "elif": TokenType.ELIF,
        "else": TokenType.ELSE,
        "while": TokenType.WHILE,
        "for": TokenType.FOR,
        "in": TokenType.IN,
        "return": TokenType.RETURN,
        "break": TokenType.BREAK,
        "continue": TokenType.CONTINUE,
        "match": TokenType.MATCH,
        "struct": TokenType.STRUCT,
        "type": TokenType.TYPE,
        "import": TokenType.IMPORT,
        "spawn": TokenType.SPAWN,
        "chan": TokenType.CHAN,
        "async": TokenType.ASYNC,
        "await": TokenType.AWAIT,
        "true": TokenType.BOOL,
        "false": TokenType.BOOL,
        "and": TokenType.AND,
        "or": TokenType.OR,
        "not": TokenType.NOT,
    }

    def __init__(self, source: str):
        self.source = source
        self.pos = 0
        self.line = 1
        self.col = 1
        self.tokens: List[Token] = []

    def peek(self, offset: int = 0) -> str:
        idx = self.pos + offset
        if idx < len(self.source):
            return self.source[idx]
        return ""

    def advance(self) -> str:
        if self.pos < len(self.source):
            ch = self.source[self.pos]
            self.pos += 1
            if ch == "\n":
                self.line += 1
                self.col = 1
            else:
                self.col += 1
            return ch
        return ""

    def match(self, expected: str) -> bool:
        if self.peek() == expected:
            self.advance()
            return True
        return False

    def tokenize(self) -> List[Token]:
        while self.pos < len(self.source):
            ch = self.peek()
            start_line = self.line
            start_col = self.col

            # Whitespace
            if ch in " \t\r":
                self.advance()
                continue

            # Comments (# or //)
            if ch == "#" or (ch == "/" and self.peek(1) == "/"):
                while self.peek() and self.peek() != "\n":
                    self.advance()
                continue

            # Multi-line comment (/* ... */)
            if ch == "/" and self.peek(1) == "*":
                self.advance()
                self.advance()
                while self.peek() and not (self.peek() == "*" and self.peek(1) == "/"):
                    self.advance()
                if self.peek():
                    self.advance() # *
                    self.advance() # /
                continue

            # Newlines
            if ch == "\n":
                self.advance()
                # Suppress consecutive newlines
                if not self.tokens or self.tokens[-1].type != TokenType.NEWLINE:
                    self.tokens.append(Token(TokenType.NEWLINE, "\n", start_line, start_col))
                continue

            # Semicolon as newline/delimiter
            if ch == ";":
                self.advance()
                self.tokens.append(Token(TokenType.SEMICOLON, ";", start_line, start_col))
                continue

            # Numbers (Integer or Float)
            if ch.isdigit():
                num_str = ""
                has_dot = False
                while self.peek().isdigit() or (self.peek() == "." and self.peek(1).isdigit() and not has_dot):
                    if self.peek() == ".":
                        has_dot = True
                    num_str += self.advance()
                
                if has_dot:
                    self.tokens.append(Token(TokenType.FLOAT, float(num_str), start_line, start_col))
                else:
                    self.tokens.append(Token(TokenType.INT, int(num_str), start_line, start_col))
                continue

            # String Literals ("..." or '...')
            if ch in ('"', "'"):
                quote_type = self.advance()
                str_val = ""
                while self.peek() and self.peek() != quote_type:
                    c = self.advance()
                    if c == "\\" and self.peek():
                        escape = self.advance()
                        escapes = {"n": "\n", "t": "\t", "r": "\r", "\\": "\\", '"': '"', "'": "'"}
                        str_val += escapes.get(escape, escape)
                    else:
                        str_val += c
                
                if not self.peek():
                    raise LexerError("Unterminated string literal", start_line, start_col)
                self.advance() # closing quote
                self.tokens.append(Token(TokenType.STRING, str_val, start_line, start_col))
                continue

            # Identifiers and Keywords
            if ch.isalpha() or ch == "_":
                ident = ""
                while self.peek().isalnum() or self.peek() == "_":
                    ident += self.advance()
                
                if ident in self.KEYWORDS:
                    tok_type = self.KEYWORDS[ident]
                    if tok_type == TokenType.BOOL:
                        self.tokens.append(Token(TokenType.BOOL, ident == "true", start_line, start_col))
                    else:
                        self.tokens.append(Token(tok_type, ident, start_line, start_col))
                else:
                    self.tokens.append(Token(TokenType.IDENTIFIER, ident, start_line, start_col))
                continue

            # Two-character & Single-character Operators
            self.advance()
            if ch == "+":
                if self.match("="): self.tokens.append(Token(TokenType.PLUS_ASSIGN, "+=", start_line, start_col))
                else: self.tokens.append(Token(TokenType.PLUS, "+", start_line, start_col))
            elif ch == "-":
                if self.match(">"): self.tokens.append(Token(TokenType.ARROW, "->", start_line, start_col))
                elif self.match("="): self.tokens.append(Token(TokenType.MINUS_ASSIGN, "-=", start_line, start_col))
                else: self.tokens.append(Token(TokenType.MINUS, "-", start_line, start_col))
            elif ch == "*":
                if self.match("*"): self.tokens.append(Token(TokenType.POW, "**", start_line, start_col))
                elif self.match("="): self.tokens.append(Token(TokenType.STAR_ASSIGN, "*=", start_line, start_col))
                else: self.tokens.append(Token(TokenType.STAR, "*", start_line, start_col))
            elif ch == "/":
                if self.match("="): self.tokens.append(Token(TokenType.SLASH_ASSIGN, "/=", start_line, start_col))
                else: self.tokens.append(Token(TokenType.SLASH, "/", start_line, start_col))
            elif ch == "%":
                self.tokens.append(Token(TokenType.PERCENT, "%", start_line, start_col))
            elif ch == "=":
                if self.match("="): self.tokens.append(Token(TokenType.EQ, "==", start_line, start_col))
                elif self.match(">"): self.tokens.append(Token(TokenType.FAT_ARROW, "=>", start_line, start_col))
                else: self.tokens.append(Token(TokenType.ASSIGN, "=", start_line, start_col))
            elif ch == "!":
                if self.match("="): self.tokens.append(Token(TokenType.NEQ, "!=", start_line, start_col))
                else: self.tokens.append(Token(TokenType.NOT, "!", start_line, start_col))
            elif ch == "<":
                if self.match("="): self.tokens.append(Token(TokenType.LTE, "<=", start_line, start_col))
                elif self.match("-"): self.tokens.append(Token(TokenType.SEND, "<-", start_line, start_col))
                else: self.tokens.append(Token(TokenType.LT, "<", start_line, start_col))
            elif ch == ">":
                if self.match("="): self.tokens.append(Token(TokenType.GTE, ">=", start_line, start_col))
                else: self.tokens.append(Token(TokenType.GT, ">", start_line, start_col))
            elif ch == "&" and self.match("&"):
                self.tokens.append(Token(TokenType.AND, "&&", start_line, start_col))
            elif ch == "|" and self.match("|"):
                self.tokens.append(Token(TokenType.OR, "||", start_line, start_col))
            elif ch == "(": self.tokens.append(Token(TokenType.LPAREN, "(", start_line, start_col))
            elif ch == ")": self.tokens.append(Token(TokenType.RPAREN, ")", start_line, start_col))
            elif ch == "{": self.tokens.append(Token(TokenType.LBRACE, "{", start_line, start_col))
            elif ch == "}": self.tokens.append(Token(TokenType.RBRACE, "}", start_line, start_col))
            elif ch == "[": self.tokens.append(Token(TokenType.LBRACKET, "[", start_line, start_col))
            elif ch == "]": self.tokens.append(Token(TokenType.RBRACKET, "]", start_line, start_col))
            elif ch == ":": self.tokens.append(Token(TokenType.COLON, ":", start_line, start_col))
            elif ch == ",": self.tokens.append(Token(TokenType.COMMA, ",", start_line, start_col))
            elif ch == ".": self.tokens.append(Token(TokenType.DOT, ".", start_line, start_col))
            else:
                raise LexerError(f"Unexpected character: {ch!r}", start_line, start_col)

        self.tokens.append(Token(TokenType.EOF, "", self.line, self.col))
        return self.tokens
