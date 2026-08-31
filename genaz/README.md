# ⚡ GenAz Programming Language (`.gaz`)

**GenAz** is a modern, high-performance, and developer-friendly programming language designed to combine **Python's clean syntax**, **Rust's memory safety**, and **Go's effortless concurrency**.

---

## 🌟 Key Features

- **⚡ Blazing Fast VM**: Stack-based bytecode virtual machine with direct opcode dispatch.
- **🛡️ Static Type Inference**: Optional type annotations with automatic Hindley-Milner type inference.
- **🚀 Native Concurrency**: Go-style `spawn` green threads and thread-safe channels (`chan <- val`, `<- chan`).
- **🧮 AI & Matrix Ready**: Built-in tensor mathematics, matrix multiplication, and vector operations.
- **💻 Interactive REPL**: Real-time evaluation shell with color output.

---

## 🛠️ Quickstart

```bash
# Start Interactive REPL
python genaz/src/main.py repl

# Run an example program
python genaz/src/main.py run genaz/examples/01_hello.gaz
python genaz/src/main.py run genaz/examples/02_fibonacci.gaz
python genaz/src/main.py run genaz/examples/03_concurrency.gaz
python genaz/src/main.py run genaz/examples/04_ai_tensors.gaz
```

---

## 📖 Syntax Overview

### Variables & Mutability
```rust
let name = "Aviral"       // Immutable
let mut counter: i64 = 0  // Mutable with explicit type
```

### Functions
```rust
fn add(a: i64, b: i64) -> i64 {
    return a + b
}
```

### Concurrency with Channels
```rust
fn worker(id: i64, c: chan) {
    c <- id * 10
}

let c = chan(5)
spawn worker(1, c)
let result = <- c
```

---

## 🧪 Running Tests
```bash
python -m unittest discover -s genaz/tests
```

---
Crafted with care by **Aviral Dewangan**  
Licensed under the **MIT License**.
