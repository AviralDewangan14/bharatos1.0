import sys
"""
GenAz Virtual Machine Runtime
Fast stack-based bytecode interpreter with concurrency scheduler and native channels.
"""

import time
import queue
import threading
import math
from typing import List, Dict, Any, Optional
from .compiler import OpCode, Instruction, CompiledFunction


class VMError(Exception):
    def __init__(self, message: str):
        super().__init__(f"RuntimeError: {message}")


class Channel:
    """Go-style typed channel for thread-safe message passing."""
    def __init__(self, capacity: int = 0):
        self.queue = queue.Queue(maxsize=capacity)

    def send(self, val: Any):
        self.queue.put(val)

    def recv(self) -> Any:
        return self.queue.get()


class VirtualMachine:
    def __init__(self, instructions: List[Instruction], constants: List[Any], globals_env: Optional[Dict[str, Any]] = None):
        self.instructions = instructions
        self.constants = constants
        self.stack: List[Any] = []
        self.globals: Dict[str, Any] = globals_env or {}
        self.call_frames: List[dict] = []
        self.ip = 0
        self.threads: List[threading.Thread] = []
        self.setup_builtins()

    def setup_builtins(self):
        self.globals.update({
            "print": lambda *args: sys.stdout.write(" ".join(str(a) for a in args) + " "),
            "println": lambda *args: sys.stdout.write(" ".join(str(a) for a in args) + "\n"),
            "input": lambda prompt="": input(prompt),
            "len": lambda x: len(x),
            "range": lambda start, end=None: list(range(start, end)) if end is not None else list(range(start)),
            "type_of": lambda x: type(x).__name__,
            "assert": lambda cond, msg="Assertion failed": self._assert(cond, msg),
            "chan": lambda cap=0: Channel(cap),
            "sin": lambda x: math.sin(x),
            "cos": lambda x: math.cos(x),
            "sqrt": lambda x: math.sqrt(x),
            "pow": lambda x, y: math.pow(x, y),
            "time_now": lambda: time.time(),
            "sleep": lambda s: time.sleep(s),
            "matrix_mul": self._matrix_mul,
        })

    def _assert(self, cond: bool, msg: str):
        if not cond:
            raise VMError(msg)

    def _matrix_mul(self, A: List[List[float]], B: List[List[float]]) -> List[List[float]]:
        rows_A = len(A)
        cols_A = len(A[0])
        rows_B = len(B)
        cols_B = len(B[0])
        if cols_A != rows_B:
            raise VMError(f"Matrix dimension mismatch: ({rows_A}x{cols_A}) * ({rows_B}x{cols_B})")
        
        result = [[0.0 for _ in range(cols_B)] for _ in range(rows_A)]
        for i in range(rows_A):
            for j in range(cols_B):
                for k in range(cols_A):
                    result[i][j] += A[i][k] * B[k][j]
        return result

    def push(self, val: Any):
        self.stack.append(val)

    def pop(self) -> Any:
        if not self.stack:
            raise VMError("Stack underflow")
        return self.stack.pop()

    def peek(self) -> Any:
        if not self.stack:
            raise VMError("Stack underflow")
        return self.stack[-1]

    def run(self) -> Any:
        while self.ip < len(self.instructions):
            inst = self.instructions[self.ip]
            op = inst.opcode
            arg = inst.arg
            self.ip += 1

            if op == OpCode.HALT:
                break

            elif op == OpCode.CONST:
                val = self.constants[arg]
                self.push(val)

            elif op == OpCode.POP:
                self.pop()

            elif op == OpCode.DUP:
                self.push(self.peek())

            elif op == OpCode.LOAD:
                if self.call_frames and arg in self.call_frames[-1]["locals"]:
                    self.push(self.call_frames[-1]["locals"][arg])
                elif arg in self.globals:
                    self.push(self.globals[arg])
                else:
                    raise VMError(f"Undefined variable '{arg}'")

            elif op == OpCode.STORE:
                val = self.pop()
                if self.call_frames and arg in self.call_frames[-1]["locals"]:
                    self.call_frames[-1]["locals"][arg] = val
                elif self.call_frames:
                    self.call_frames[-1]["locals"][arg] = val
                else:
                    self.globals[arg] = val

            elif op == OpCode.ADD:
                b = self.pop()
                a = self.pop()
                if isinstance(a, str) or isinstance(b, str):
                    self.push(str(a) + str(b))
                else:
                    self.push(a + b)

            elif op == OpCode.SUB:
                b = self.pop()
                a = self.pop()
                self.push(a - b)

            elif op == OpCode.MUL:
                b = self.pop()
                a = self.pop()
                self.push(a * b)

            elif op == OpCode.DIV:
                b = self.pop()
                a = self.pop()
                if b == 0:
                    raise VMError("Division by zero")
                self.push(a / b if isinstance(a, float) or isinstance(b, float) else a // b)

            elif op == OpCode.MOD:
                b = self.pop()
                a = self.pop()
                self.push(a % b)

            elif op == OpCode.POW:
                b = self.pop()
                a = self.pop()
                self.push(a ** b)

            elif op == OpCode.NEG:
                a = self.pop()
                self.push(-a)

            elif op == OpCode.NOT:
                a = self.pop()
                self.push(not a)

            elif op == OpCode.EQ:
                b = self.pop()
                a = self.pop()
                self.push(a == b)

            elif op == OpCode.NEQ:
                b = self.pop()
                a = self.pop()
                self.push(a != b)

            elif op == OpCode.LT:
                b = self.pop()
                a = self.pop()
                self.push(a < b)

            elif op == OpCode.LTE:
                b = self.pop()
                a = self.pop()
                self.push(a <= b)

            elif op == OpCode.GT:
                b = self.pop()
                a = self.pop()
                self.push(a > b)

            elif op == OpCode.GTE:
                b = self.pop()
                a = self.pop()
                self.push(a >= b)

            elif op == OpCode.JUMP:
                self.ip = arg

            elif op == OpCode.JUMP_IF_FALSE:
                cond = self.pop()
                if not cond:
                    self.ip = arg

            elif op == OpCode.CALL:
                arg_count = arg
                callee = self.pop()

                args = [self.pop() for _ in range(arg_count)]
                args.reverse()

                if callable(callee):
                    res = callee(*args)
                    self.push(res)
                elif isinstance(callee, CompiledFunction):
                    locals_dict = {p: a for p, a in zip(callee.params, args)}
                    self.call_frames.append({
                        "return_ip": self.ip,
                        "instructions": self.instructions,
                        "constants": self.constants,
                        "locals": locals_dict
                    })
                    self.instructions = callee.instructions
                    self.constants = callee.constants
                    self.ip = 0
                else:
                    raise VMError(f"'{callee}' is not callable")

            elif op == OpCode.RET:
                ret_val = self.pop()
                frame = self.call_frames.pop()
                self.ip = frame["return_ip"]
                self.instructions = frame["instructions"]
                self.constants = frame["constants"]
                self.push(ret_val)

            elif op == OpCode.SPAWN:
                arg_count = arg
                callee = self.pop()
                args = [self.pop() for _ in range(arg_count)]
                args.reverse()

                def thread_worker():
                    if callable(callee):
                        callee(*args)
                    elif isinstance(callee, CompiledFunction):
                        sub_vm = VirtualMachine(callee.instructions, callee.constants, globals_env=self.globals)
                        sub_vm.call_frames.append({"locals": {p: a for p, a in zip(callee.params, args)}, "return_ip": 0, "instructions": [], "constants": []})
                        sub_vm.run()

                t = threading.Thread(target=thread_worker, daemon=True)
                t.start()
                self.threads.append(t)
                self.push(None)

            elif op == OpCode.CHAN_SEND:
                chan = self.pop()
                val = self.pop()
                if isinstance(chan, Channel):
                    chan.send(val)
                else:
                    raise VMError("Target of '<-' is not a channel")

            elif op == OpCode.CHAN_RECV:
                chan = self.pop()
                if isinstance(chan, Channel):
                    self.push(chan.recv())
                else:
                    raise VMError("Expression is not a channel")

            elif op == OpCode.MAKE_LIST:
                count = arg
                items = [self.pop() for _ in range(count)]
                items.reverse()
                self.push(items)

            elif op == OpCode.MAKE_MAP:
                count = arg
                m = {}
                for _ in range(count):
                    v = self.pop()
                    k = self.pop()
                    m[k] = v
                self.push(m)

            elif op == OpCode.INDEX_GET:
                idx = self.pop()
                coll = self.pop()
                try:
                    self.push(coll[idx])
                except Exception as e:
                    raise VMError(f"Index error: {e}")

            elif op == OpCode.INDEX_SET:
                idx = self.pop()
                coll = self.pop()
                val = self.pop()
                try:
                    coll[idx] = val
                except Exception as e:
                    raise VMError(f"Index set error: {e}")

        for t in self.threads:
            t.join(timeout=0.2)

        return self.stack[-1] if self.stack else None
