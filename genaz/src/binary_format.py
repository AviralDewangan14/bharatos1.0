"""
GenAz Binary Bytecode Serializer & Deserializer (.gbc)
Supports primitives, collections, and CompiledFunction objects.
"""

import struct
from typing import Tuple, List, Any
from .compiler import Instruction, OpCode, CompiledFunction

MAGIC = b"GAZ1"
VERSION = 1


def _serialize_const(c: Any, buf: bytearray):
    if isinstance(c, int):
        buf.extend(b"I")
        buf.extend(struct.pack(">q", c))
    elif isinstance(c, float):
        buf.extend(b"F")
        buf.extend(struct.pack(">d", c))
    elif isinstance(c, str):
        buf.extend(b"S")
        enc = c.encode("utf-8")
        buf.extend(struct.pack(">I", len(enc)))
        buf.extend(enc)
    elif isinstance(c, bool):
        buf.extend(b"B")
        buf.extend(struct.pack("?", c))
    elif isinstance(c, CompiledFunction):
        buf.extend(b"X")
        name_enc = c.name.encode("utf-8")
        buf.extend(struct.pack(">I", len(name_enc)))
        buf.extend(name_enc)
        
        # Params
        buf.extend(struct.pack(">I", len(c.params)))
        for p in c.params:
            p_enc = p.encode("utf-8")
            buf.extend(struct.pack(">I", len(p_enc)))
            buf.extend(p_enc)
            
        # Constants
        buf.extend(struct.pack(">I", len(c.constants)))
        for sub_c in c.constants:
            _serialize_const(sub_c, buf)
            
        # Instructions
        buf.extend(struct.pack(">I", len(c.instructions)))
        for instr in c.instructions:
            _serialize_instr(instr, buf)
    else:
        buf.extend(b"N")


def _serialize_instr(instr: Instruction, buf: bytearray):
    op_val = instr.opcode.value if hasattr(instr, "opcode") else instr[0].value
    buf.extend(struct.pack(">B", op_val))
    arg = instr.arg if hasattr(instr, "arg") else (instr[1] if len(instr) > 1 else None)
    if isinstance(arg, int):
        buf.extend(b"i")
        buf.extend(struct.pack(">i", arg))
    elif isinstance(arg, str):
        buf.extend(b"s")
        enc = arg.encode("utf-8")
        buf.extend(struct.pack(">I", len(enc)))
        buf.extend(enc)
    else:
        buf.extend(b"n")


def serialize_bytecode(instructions: List[Instruction], constants: List[Any], functions: dict = None) -> bytes:
    buf = bytearray()
    buf.extend(MAGIC)
    buf.extend(struct.pack(">H", VERSION))

    # Constants Pool
    buf.extend(struct.pack(">I", len(constants)))
    for c in constants:
        _serialize_const(c, buf)

    # Main Instructions
    buf.extend(struct.pack(">I", len(instructions)))
    for instr in instructions:
        _serialize_instr(instr, buf)

    return bytes(buf)


def _deserialize_const(data: bytes, offset: int) -> Tuple[Any, int]:
    tag = data[offset : offset + 1]
    offset += 1

    if tag == b"I":
        val = struct.unpack_from(">q", data, offset)[0]
        return val, offset + 8
    elif tag == b"F":
        val = struct.unpack_from(">d", data, offset)[0]
        return val, offset + 8
    elif tag == b"S":
        length = struct.unpack_from(">I", data, offset)[0]
        offset += 4
        val = data[offset : offset + length].decode("utf-8")
        return val, offset + length
    elif tag == b"B":
        val = struct.unpack_from("?", data, offset)[0]
        return val, offset + 1
    elif tag == b"X":
        # CompiledFunction
        name_len = struct.unpack_from(">I", data, offset)[0]
        offset += 4
        fn_name = data[offset : offset + name_len].decode("utf-8")
        offset += name_len

        num_params = struct.unpack_from(">I", data, offset)[0]
        offset += 4
        params = []
        for _ in range(num_params):
            p_len = struct.unpack_from(">I", data, offset)[0]
            offset += 4
            p_str = data[offset : offset + p_len].decode("utf-8")
            offset += p_len
            params.append(p_str)

        num_consts = struct.unpack_from(">I", data, offset)[0]
        offset += 4
        fn_constants = []
        for _ in range(num_consts):
            val, offset = _deserialize_const(data, offset)
            fn_constants.append(val)

        num_instrs = struct.unpack_from(">I", data, offset)[0]
        offset += 4
        fn_instructions = []
        opcode_map = {op.value: op for op in OpCode}
        for _ in range(num_instrs):
            instr, offset = _deserialize_instr(data, offset, opcode_map)
            fn_instructions.append(instr)

        return CompiledFunction(fn_name, params, fn_instructions, fn_constants), offset
    else:
        return None, offset


def _deserialize_instr(data: bytes, offset: int, opcode_map: dict) -> Tuple[Instruction, int]:
    op_byte = struct.unpack_from(">B", data, offset)[0]
    offset += 1
    opcode = opcode_map.get(op_byte, OpCode.HALT)

    arg_tag = data[offset : offset + 1]
    offset += 1
    arg = None
    if arg_tag == b"i":
        arg = struct.unpack_from(">i", data, offset)[0]
        offset += 4
    elif arg_tag == b"s":
        length = struct.unpack_from(">I", data, offset)[0]
        offset += 4
        arg = data[offset : offset + length].decode("utf-8")
        offset += length

    return Instruction(opcode, arg), offset


def deserialize_bytecode(data: bytes) -> Tuple[List[Instruction], List[Any]]:
    if len(data) < 6 or data[:4] != MAGIC:
        raise ValueError("Invalid GenAz Bytecode binary file")

    offset = 6  # Skip MAGIC + VERSION
    num_consts = struct.unpack_from(">I", data, offset)[0]
    offset += 4

    constants = []
    for _ in range(num_consts):
        val, offset = _deserialize_const(data, offset)
        constants.append(val)

    num_instrs = struct.unpack_from(">I", data, offset)[0]
    offset += 4

    instructions = []
    opcode_map = {op.value: op for op in OpCode}
    for _ in range(num_instrs):
        instr, offset = _deserialize_instr(data, offset, opcode_map)
        instructions.append(instr)

    return instructions, constants
