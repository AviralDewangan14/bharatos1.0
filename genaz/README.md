# GenAz Programming Language

A fast, clean, and expressive native programming language featuring static type inference, a stack bytecode virtual machine, lightweight concurrency, and a native desktop IDE.

## Overview
GenAz is designed from scratch as a standalone, general-purpose language with:
- **Fast Bytecode Compiler**: Compiles `.gaz` source code into binary `.gbc` bytecode files.
- **Virtual Machine**: Stack-based execution engine with 25+ opcodes, green threads, and thread-safe channels.
- **Native Desktop IDE**: Built-in desktop editor and debugger (`genaz gui`).
- **Hindley-Milner Type Inference**: Static type validation without requiring repetitive type annotations.

---

## 🚀 Installation & CLI Usage

Add the `genaz/bin` folder to your system PATH, or run directly:

```bash
# 1. Run a source script directly
python genaz/src/main.py run genaz/examples/01_hello.gaz

# 2. Compile to native binary bytecode (.gbc)
python genaz/src/main.py build genaz/examples/02_fibonacci.gaz -o fib.gbc

# 3. Run the compiled binary bytecode
python genaz/src/main.py run fib.gbc

# 4. Disassemble bytecode
python genaz/src/main.py dis genaz/examples/01_hello.gaz

# 5. Interactive REPL
python genaz/src/main.py repl

# 6. Launch Native Desktop GUI IDE
python genaz/src/main.py gui
```

---

## 📝 Syntax & Language Features

### Functions & Control Flow
```genaz
fn fib(n) {
    if n <= 1 {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}

for i in 0..10 {
    println("fib(" + str(i) + ") = " + str(fib(i)));
}
```

### Concurrency (Green Threads & Channels)
```genaz
fn worker(ch, id) {
    println("Worker " + str(id) + " processing data...");
    ch <- "Result from worker " + str(id);
}

let c = chan(4);
spawn worker(c, 1);
spawn worker(c, 2);

println(<-c);
println(<-c);
```

### Matrices & Tensors
```genaz
let A = [[1, 2], [3, 4]];
let B = [[5, 6], [7, 8]];

let C = matmul(A, B);
println("Matrix Multiplication:");
println(C);
```

---

## 📂 Project Structure

```
genaz/
├── bin/
│   ├── genaz.bat            # Windows command line runner
│   ├── genaz.cmd            # Windows CMD runner
│   └── genaz                # Unix / macOS shell script
├── src/
│   ├── lexer.py             # Lexical tokenizer
│   ├── parser.py            # Recursive descent AST parser
│   ├── type_checker.py      # Type inference engine
│   ├── compiler.py          # Stack bytecode compiler
│   ├── binary_format.py     # Binary bytecode (.gbc) serializer
│   ├── vm.py                # Virtual machine runtime
│   ├── disassembler.py      # Bytecode disassembler
│   ├── repl.py              # Interactive REPL
│   ├── gui.py               # Native Desktop Tkinter IDE
│   └── main.py              # Universal CLI entrypoint
├── examples/                # Example scripts (.gaz)
└── tests/                   # Automated unit tests
```

---

## 👤 Author
Created by **Aviral Dewangan**  
GitHub: [@AviralDewangan14](https://github.com/AviralDewangan14)
