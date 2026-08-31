"""
GenAz Bytecode Disassembler
Formats raw instructions and constants into readable assembly.
"""

def disassemble(instructions, constants, functions=None) -> str:
    lines = []
    lines.append("=== GenAz Bytecode Disassembly ===")
    lines.append(f"Constants ({len(constants)}):")
    for i, c in enumerate(constants):
        lines.append(f"  [{i:02d}] {repr(c)}")
    lines.append("")
    
    lines.append("Bytecode Instructions:")
    for i, instr in enumerate(instructions):
        op_name = instr.opcode.name if hasattr(instr, 'opcode') else str(instr[0])
        arg = instr.arg if hasattr(instr, 'arg') else (instr[1] if len(instr) > 1 else "")
        arg_repr = f"({arg})" if arg is not None and arg != "" else ""
        lines.append(f"  {i:04d}:  {op_name:<18} {arg_repr}")

    if functions:
        lines.append("")
        lines.append(f"User Functions ({len(functions)}):")
        for fn_name, fn_meta in functions.items():
            entry = fn_meta.get('entry_ip', 0) if isinstance(fn_meta, dict) else fn_meta
            params = fn_meta.get('params', []) if isinstance(fn_meta, dict) else []
            lines.append(f"  - fn {fn_name}({', '.join(params)}): entry at offset {entry}")

    return "\n".join(lines)
