# GenAz Programming Language

GenAz is a fast, simple, and expressive programming language designed for clean general-purpose programming, concurrency, and high-performance computation.

## Features
- **Clean Syntax**: Intuitive and readable without syntactic noise.
- **Static Type Inference**: Hindley-Milner type inference engine catches errors early without requiring verbose type annotations.
- **Stack Bytecode VM**: High-performance bytecode virtual machine with 25+ specialized opcodes.
- **Built-in Concurrency**: Lightweight `spawn` green threads and thread-safe channels (`chan`).
- **Matrix & Tensor Acceleration**: Native matrix multiplication kernel (`matmul`).
- **Interactive Toolchain**: CLI with `run`, `check`, `dis` (disassembler), `ast`, `tokens`, `repl`, and `gui` (web IDE).

## Getting Started

### 1. Run a GenAz Program
```bash
python -m genaz.src.main run genaz/examples/01_hello.gaz
```

### 2. Interactive REPL
```bash
python -m genaz.src.main repl
```

### 3. Bytecode Disassembler
```bash
python -m genaz.src.main dis genaz/examples/02_fibonacci.gaz
```

### 4. Interactive Web IDE
```bash
python -m genaz.src.main gui
```
Or open `genaz/ide/index.html` in your browser.

## Code Example

```genaz
// Fibonacci calculation
fn fib(n) {
    if n <= 1 {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}

for i in 0..10 {
    print("fib(" + str(i) + ") = " + str(fib(i)));
}
```

## Directory Structure
```
genaz/
├── src/
│   ├── lexer.py             # Tokenizer with line & column tracking
│   ├── parser.py            # Recursive descent AST parser
│   ├── type_checker.py      # Hindley-Milner type checker
│   ├── compiler.py          # Stack bytecode compiler
│   ├── vm.py                # High-speed virtual machine
│   ├── disassembler.py      # Bytecode disassembler
│   ├── repl.py              # Interactive REPL shell
│   └── main.py              # Universal CLI
├── ide/
│   └── index.html           # Web-based IDE playground
├── examples/                # Real example scripts (.gaz)
└── tests/                   # Automated unit tests
```

## Author
Created by **Aviral Dewangan**  
GitHub: [@AviralDewangan14](https://github.com/AviralDewangan14)
