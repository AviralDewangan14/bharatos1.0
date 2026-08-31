"""
GenAz Virtual Machine Runtime
High-speed stack bytecode interpreter with comprehensive built-ins,
linear algebra, file I/O, networking, and helpful error diagnostics.
"""

import sys
import time
import queue
import threading
import math
import json
import random
import uuid
import urllib.request
import urllib.parse
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


def _levenshtein(s1: str, s2: str) -> int:
    if len(s1) < len(s2):
        return _levenshtein(s2, s1)
    if len(s2) == 0:
        return len(s1)
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]


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
        builtins = {
            # I/O & Output
            "print": lambda *args: sys.stdout.write(" ".join(str(a) for a in args) + " "),
            "println": lambda *args: sys.stdout.write(" ".join(str(a) for a in args) + "\n"),
            "input": lambda prompt="": input(prompt),
            
            # Type Conversions
            "str": lambda x: str(x),
            "int": lambda x: int(float(x)),
            "float": lambda x: float(x),
            "bool": lambda x: bool(x),
            "type_of": lambda x: type(x).__name__,
            "len": lambda x: len(x),
            "range": lambda start, end=None: list(range(start, end)) if end is not None else list(range(start)),
            "assert": lambda cond, msg="Assertion failed": self._assert(cond, msg),

            # Concurrency & Channels
            "chan": lambda cap=0: Channel(cap),

            # Advanced Math Functions
            "sin": lambda x: math.sin(x),
            "cos": lambda x: math.cos(x),
            "tan": lambda x: math.tan(x),
            "asin": lambda x: math.asin(x),
            "acos": lambda x: math.acos(x),
            "atan": lambda x: math.atan(x),
            "atan2": lambda y, x: math.atan2(y, x),
            "sqrt": lambda x: math.sqrt(x),
            "cbrt": lambda x: math.pow(x, 1.0 / 3.0),
            "pow": lambda x, y: math.pow(x, y),
            "exp": lambda x: math.exp(x),
            "log": lambda x: math.log(x),
            "log10": lambda x: math.log10(x),
            "log2": lambda x: math.log2(x),
            "abs": lambda x: abs(x),
            "floor": lambda x: math.floor(x),
            "ceil": lambda x: math.ceil(x),
            "round": lambda x, digits=0: round(x, digits) if digits > 0 else round(x),
            "min": lambda *args: min(args[0]) if len(args) == 1 and isinstance(args[0], list) else min(args),
            "max": lambda *args: max(args[0]) if len(args) == 1 and isinstance(args[0], list) else max(args),
            "clamp": lambda val, low, high: max(low, min(high, val)),
            "gcd": lambda a, b: math.gcd(int(a), int(b)),
            "factorial": lambda n: math.factorial(int(n)),

            # Statistics & Aggregations
            "sum": lambda lst: sum(lst),
            "mean": lambda lst: sum(lst) / len(lst) if lst else 0.0,
            "median": lambda lst: self._median(lst),
            "variance": lambda lst: self._variance(lst),
            "std_dev": lambda lst: math.sqrt(self._variance(lst)),

            # Linear Algebra & Matrices
            "matmul": self._matrix_mul,
            "matrix_mul": self._matrix_mul,
            "transpose": self._transpose,
            "dot": self._dot_product,
            "zeros": lambda r, c: [[0.0 for _ in range(c)] for _ in range(r)],
            "ones": lambda r, c: [[1.0 for _ in range(c)] for _ in range(r)],
            "eye": lambda n: [[1.0 if i == j else 0.0 for j in range(n)] for i in range(n)],

            # String Manipulation
            "split": lambda s, sep=" ": s.split(sep),
            "join": lambda lst, sep="": sep.join(str(x) for x in lst),
            "trim": lambda s: s.strip(),
            "replace": lambda s, old, new: s.replace(old, new),
            "to_upper": lambda s: s.upper(),
            "to_lower": lambda s: s.lower(),
            "starts_with": lambda s, p: s.startswith(p),
            "ends_with": lambda s, suf: s.endswith(suf),
            "contains": lambda s, sub: sub in s,
            "index_of": lambda s, sub: s.find(sub),

            # List Utilities
            "push": lambda lst, v: lst.append(v) or lst,
            "pop_item": lambda lst: lst.pop(),
            "sort": lambda lst: sorted(lst),
            "reverse": lambda lst: list(reversed(lst)),

            # Map Utilities
            "keys": lambda m: list(m.keys()),
            "values": lambda m: list(m.values()),
            "has_key": lambda m, k: k in m,

            # File System & I/O
            "read_file": self._read_file,
            "write_file": self._write_file,
            "append_file": self._append_file,
            "file_exists": lambda p: os.path.exists(p),

            # JSON Parsing & Serialization
            "json_encode": lambda obj: json.dumps(obj),
            "json_decode": lambda s: json.loads(s),

            # HTTP Networking
            "http_get": self._http_get,
            "http_post": self._http_post,

            # Time & System
            "time_now": lambda: time.time(),
            "time_ms": lambda: int(time.time() * 1000),
            "sleep": lambda s: time.sleep(s),
            "sleep_ms": lambda ms: time.sleep(ms / 1000.0),
            "random": lambda: random.random(),
            "random_int": lambda low, high: random.randint(low, high),
            "random_choice": lambda lst: random.choice(lst),
            "uuid": lambda: str(uuid.uuid4()),
        }
        self.globals.update(builtins)

    def _assert(self, cond: bool, msg: str):
        if not cond:
            raise VMError(msg)

    def _median(self, lst: List[float]) -> float:
        if not lst: return 0.0
        sorted_lst = sorted(lst)
        n = len(sorted_lst)
        mid = n // 2
        if n % 2 == 1:
            return sorted_lst[mid]
        return (sorted_lst[mid - 1] + sorted_lst[mid]) / 2.0

    def _variance(self, lst: List[float]) -> float:
        if len(lst) < 2: return 0.0
        avg = sum(lst) / len(lst)
        return sum((x - avg) ** 2 for x in lst) / (len(lst) - 1)

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

    def _transpose(self, A: List[List[float]]) -> List[List[float]]:
        if not A: return []
        return [[A[j][i] for j in range(len(A))] for i in range(len(A[0]))]

    def _dot_product(self, u: List[float], v: List[float]) -> float:
        if len(u) != len(v):
            raise VMError(f"Vector size mismatch for dot product: {len(u)} vs {len(v)}")
        return sum(a * b for a, b in zip(u, v))

    def _read_file(self, path: str) -> str:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()

    def _write_file(self, path: str, content: str) -> bool:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        return True

    def _append_file(self, path: str, content: str) -> bool:
        with open(path, "a", encoding="utf-8") as f:
            f.write(content)
        return True

    def _http_get(self, url: str) -> dict:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'GenAz-HTTP/1.0'})
            with urllib.request.urlopen(req, timeout=10) as resp:
                status = resp.status
                body = resp.read().decode('utf-8')
                return {"status": status, "body": body, "ok": True}
        except Exception as e:
            return {"status": 500, "error": str(e), "ok": False}

    def _http_post(self, url: str, data_dict: dict) -> dict:
        try:
            data = json.dumps(data_dict).encode('utf-8')
            req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json', 'User-Agent': 'GenAz-HTTP/1.0'})
            with urllib.request.urlopen(req, timeout=10) as resp:
                status = resp.status
                body = resp.read().decode('utf-8')
                return {"status": status, "body": body, "ok": True}
        except Exception as e:
            return {"status": 500, "error": str(e), "ok": False}

    def _suggest_name(self, name: str) -> Optional[str]:
        candidates = list(self.globals.keys())
        if self.call_frames:
            candidates.extend(list(self.call_frames[-1]["locals"].keys()))
        
        matches = []
        for c in candidates:
            dist = _levenshtein(name, c)
            if dist <= 2:
                matches.append((dist, c))
        if matches:
            matches.sort(key=lambda x: x[0])
            return matches[0][1]
        return None

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

            if op == OpCode.CONST:
                self.push(self.constants[arg])

            elif op == OpCode.POP:
                self.pop()

            elif op == OpCode.DUP:
                self.push(self.peek())

            elif op == OpCode.LOAD:
                val = None
                if self.call_frames and arg in self.call_frames[-1]["locals"]:
                    val = self.call_frames[-1]["locals"][arg]
                elif arg in self.globals:
                    val = self.globals[arg]
                else:
                    suggestion = self._suggest_name(arg)
                    hint = f" Did you mean '{suggestion}'?" if suggestion else ""
                    raise VMError(f"Undefined variable or function '{arg}'.{hint}")
                self.push(val)

            elif op == OpCode.STORE:
                val = self.pop()
                if self.call_frames:
                    self.call_frames[-1]["locals"][arg] = val
                else:
                    self.globals[arg] = val

            elif op == OpCode.ADD:
                b = self.pop()
                a = self.pop()
                if isinstance(a, str) or isinstance(b, str):
                    self.push(str(a) + str(b))
                elif isinstance(a, list) and isinstance(b, list):
                    self.push(a + b)
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
                self.push(a / b)

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
                num_args = arg
                args = [self.pop() for _ in range(num_args)]
                args.reverse()
                callee = self.pop()

                if callable(callee):
                    res = callee(*args)
                    self.push(res)
                elif isinstance(callee, CompiledFunction):
                    if len(args) != len(callee.params):
                        raise VMError(f"Function '{callee.name}' expects {len(callee.params)} arguments, got {len(args)}")
                    
                    locals_dict = {param: val for param, val in zip(callee.params, args)}
                    sub_vm = VirtualMachine(callee.instructions, callee.constants, self.globals)
                    sub_vm.call_frames.append({"locals": locals_dict})
                    ret_val = sub_vm.run()
                    self.push(ret_val)
                else:
                    raise VMError(f"'{callee}' is not callable")

            elif op == OpCode.RET:
                val = self.pop() if self.stack else None
                return val

            elif op == OpCode.SPAWN:
                num_args = arg if arg is not None else 0
                args_val = [self.pop() for _ in range(num_args)]
                args_val.reverse()
                fn_val = self.pop()
                if isinstance(fn_val, CompiledFunction):
                    def worker_thread():
                        sub_vm = VirtualMachine(fn_val.instructions, fn_val.constants, self.globals)
                        locals_dict = {p: v for p, v in zip(fn_val.params, args_val)}
                        sub_vm.call_frames.append({"locals": locals_dict})
                        sub_vm.run()
                    
                    t = threading.Thread(target=worker_thread, daemon=True)
                    t.start()
                    self.threads.append(t)
                elif callable(fn_val):
                    t = threading.Thread(target=fn_val, args=args_val, daemon=True)
                    t.start()
                    self.threads.append(t)
                else:
                    raise VMError(f"Cannot spawn non-callable target: {fn_val}")

            elif op == OpCode.CHAN_SEND:
                val = self.pop()
                chan = self.pop()
                if not isinstance(chan, Channel):
                    raise VMError("Left side of <- must be a Channel")
                chan.send(val)

            elif op == OpCode.CHAN_RECV:
                chan = self.pop()
                if not isinstance(chan, Channel):
                    raise VMError("Target of <- must be a Channel")
                self.push(chan.recv())

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
                target = self.pop()
                if isinstance(target, (list, str, dict)):
                    self.push(target[idx])
                else:
                    raise VMError(f"Type '{type(target).__name__}' does not support indexing")

            elif op == OpCode.INDEX_SET:
                val = self.pop()
                idx = self.pop()
                target = self.pop()
                target[idx] = val

            elif op == OpCode.HALT:
                break

        for t in self.threads:
            t.join(timeout=1.0)

        if self.stack:
            return self.stack[-1]
        return None
