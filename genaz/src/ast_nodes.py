"""
GenAz Programming Language — Abstract Syntax Tree (AST) & Token Definitions
Designed for high performance, intuitive syntax, and zero-cost abstractions.
"""

from enum import Enum, auto
from dataclasses import dataclass
from typing import List, Dict, Any, Optional, Union


class TokenType(Enum):
    EOF = auto()
    NEWLINE = auto()
    
    INT = auto()
    FLOAT = auto()
    STRING = auto()
    BOOL = auto()
    IDENTIFIER = auto()

    FN = auto()         # fn
    LET = auto()        # let
    MUT = auto()        # mut
    CONST = auto()      # const
    IF = auto()         # if
    ELIF = auto()       # elif
    ELSE = auto()       # else
    WHILE = auto()      # while
    FOR = auto()        # for
    IN = auto()         # in
    RETURN = auto()     # return
    BREAK = auto()      # break
    CONTINUE = auto()   # continue
    MATCH = auto()      # match
    STRUCT = auto()     # struct
    TYPE = auto()       # type
    IMPORT = auto()     # import
    SPAWN = auto()      # spawn
    CHAN = auto()       # chan
    ASYNC = auto()      # async
    AWAIT = auto()      # await

    PLUS = auto()       # +
    MINUS = auto()      # -
    STAR = auto()       # *
    SLASH = auto()      # /
    PERCENT = auto()    # %
    POW = auto()        # **
    
    ASSIGN = auto()     # =
    PLUS_ASSIGN = auto()# +=
    MINUS_ASSIGN = auto()# -=
    STAR_ASSIGN = auto()# *=
    SLASH_ASSIGN = auto()# /=
    
    EQ = auto()         # ==
    NEQ = auto()        # !=
    LT = auto()         # <
    LTE = auto()        # <=
    GT = auto()         # >
    GTE = auto()        # >=
    
    AND = auto()        # and / &&
    OR = auto()         # or / ||
    NOT = auto()        # not / !
    
    SEND = auto()       # <-
    ARROW = auto()      # ->
    FAT_ARROW = auto()  # =>
    
    LPAREN = auto()     # (
    RPAREN = auto()     # )
    LBRACE = auto()     # {
    RBRACE = auto()     # }
    LBRACKET = auto()   # [
    RBRACKET = auto()   # ]
    COLON = auto()      # :
    SEMICOLON = auto()  # ;
    COMMA = auto()      # ,
    DOT = auto()        # .


@dataclass
class Token:
    type: TokenType
    value: Any
    line: int
    column: int

    def __repr__(self) -> str:
        return f"Token({self.type.name}, {repr(self.value)}, line={self.line}, col={self.column})"


class ASTNode:
    pass


@dataclass
class Program(ASTNode):
    statements: List[ASTNode]


@dataclass
class Block(ASTNode):
    statements: List[ASTNode]


@dataclass
class Literal(ASTNode):
    value: Union[int, float, str, bool, None]
    type_name: str


@dataclass
class Identifier(ASTNode):
    name: str


@dataclass
class ListLiteral(ASTNode):
    elements: List[ASTNode]


@dataclass
class MapLiteral(ASTNode):
    pairs: List[tuple]


@dataclass
class LetStmt(ASTNode):
    name: str
    is_mut: bool
    type_annotation: Optional[str]
    value: ASTNode


@dataclass
class AssignStmt(ASTNode):
    target: ASTNode
    value: ASTNode
    op: str = "="


@dataclass
class BinaryOp(ASTNode):
    left: ASTNode
    op: str
    right: ASTNode


@dataclass
class UnaryOp(ASTNode):
    op: str
    operand: ASTNode


@dataclass
class FunctionDecl(ASTNode):
    name: str
    params: List[tuple]
    return_type: Optional[str]
    body: Block
    is_async: bool = False


@dataclass
class FunctionCall(ASTNode):
    callee: ASTNode
    args: List[ASTNode]


@dataclass
class ReturnStmt(ASTNode):
    value: Optional[ASTNode]


@dataclass
class IfStmt(ASTNode):
    condition: ASTNode
    then_branch: Block
    elif_branches: List[tuple]
    else_branch: Optional[Block]


@dataclass
class WhileStmt(ASTNode):
    condition: ASTNode
    body: Block


@dataclass
class ForInStmt(ASTNode):
    var_name: str
    iterable: ASTNode
    body: Block


@dataclass
class SpawnStmt(ASTNode):
    call: FunctionCall


@dataclass
class ChannelSend(ASTNode):
    channel: ASTNode
    value: ASTNode


@dataclass
class ChannelRecv(ASTNode):
    channel: ASTNode


@dataclass
class MemberAccess(ASTNode):
    object_expr: ASTNode
    member_name: str


@dataclass
class IndexAccess(ASTNode):
    collection: ASTNode
    index: ASTNode


@dataclass
class ImportStmt(ASTNode):
    module_name: str
    alias: Optional[str] = None
