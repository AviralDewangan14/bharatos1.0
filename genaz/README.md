# GenAz Programming Language

GenAz is a lightweight, compiled programming language that compiles to binary bytecode and executes on a stack-based virtual machine runtime. It includes a built-in type checker, bytecode disassembler, standard library, interactive REPL, and desktop IDE.

---

## Architecture & Components

### 1. Lexer & Parser (`genaz/src/lexer.py`, `genaz/src/parser.py`)
- Hand-written recursive descent parser generating an Abstract Syntax Tree (AST).
- Syntax features: variables (`let`, `let mut`), control flow (`if`/`else`, `for`/`while`), functions (`fn`), data structures (`lists`, `maps`), and concurrency primitives (`spawn`, `chan`, `<-`).

### 2. Type Checker (`genaz/src/type_checker.py`)
- Performs compile-time validation and static type inference before bytecode generation.
- Suggests fixes for misspelled identifiers and catches type mismatches early.

### 3. Bytecode Compiler & Binary Format (`genaz/src/compiler.py`, `genaz/src/binary_format.py`)
- Emits instruction opcodes into custom `.gbc` binary files with magic header verification (`0x47415A01`), constant pool serialization, and function symbol tables.

### 4. Stack Virtual Machine (`genaz/src/vm.py`)
- Executes compiled bytecode instructions against an evaluation stack.
- Built-in standard library functions:
  - **I/O & Filesystem**: `read_file`, `write_file`, `append_file`, `file_exists`
  - **Data Processing**: `json_encode`, `json_decode`, `split`, `join`, `trim`
  - **Math & Statistics**: `sin`, `cos`, `tan`, `sqrt`, `pow`, `mean`, `median`, `variance`, `std_dev`
  - **Linear Algebra**: `matmul`, `transpose`, `dot`, `zeros`, `ones`, `eye`
  - **Concurrency**: `spawn` green threads with thread-safe FIFO channels (`chan`)

---

## CLI Usage

```bash
# Run a source script directly
python genaz/src/main.py run genaz/examples/01_hello.gaz

# Compile source to binary bytecode (.gbc)
python genaz/src/main.py build genaz/examples/02_fibonacci.gaz -o fib.gbc

# Execute compiled bytecode
python genaz/src/main.py run fib.gbc

# Disassemble bytecode to inspect opcodes
python genaz/src/main.py dis genaz/examples/01_hello.gaz

# Launch the interactive REPL
python genaz/src/main.py repl

# Launch the desktop IDE
python genaz/src/main.py gui
```

---

## Examples

### 1. Data Statistics & Linear Algebra
```genaz
let dataset = [12.5, 18.2, 25.0, 31.4, 42.1, 55.8, 67.2, 80.0];

println("Count:   " + str(len(dataset)));
println("Mean:    " + str(mean(dataset)));
println("Median:  " + str(median(dataset)));
println("Std Dev: " + str(round(std_dev(dataset), 2)));

let weights = [0.2, 0.3, 0.5];
let inputs  = [10.0, 20.0, 30.0];
println("Weighted Score: " + str(dot(weights, inputs)));
```

### 2. File I/O & JSON Data Processing
```genaz
let config = {
    service: "GenAz Gateway",
    port: 8080,
    production: true
};

let json_str = json_encode(config);
write_file("config.json", json_str);

let loaded = read_file("config.json");
let parsed = json_decode(loaded);
println("Loaded service: " + parsed.service);
```

### 3. Concurrency with Channels
```genaz
fn compute(ch, id) {
    let mut total = 0;
    for i in range(1, 50) {
        total += i;
    }
    ch <- total;
}

let c = chan(5);
spawn compute(c, 1);
spawn compute(c, 2);

println("Result 1: " + str(<-c));
println("Result 2: " + str(<-c));
```

---

## Project Structure

```text
genaz/
├── bin/                     # Platform execution wrappers
│   ├── genaz.bat            # Windows batch launcher
│   ├── genaz.cmd            # Windows CMD runner
│   └── genaz                # POSIX shell script
├── src/                     # Compiler & VM pipeline
│   ├── lexer.py             # Lexical tokenizer
│   ├── parser.py            # AST parser
│   ├── type_checker.py      # Type inference
│   ├── compiler.py          # Bytecode emitter
│   ├── binary_format.py     # Binary bytecode format (.gbc)
│   ├── vm.py                # Virtual machine runtime & stdlib
│   ├── disassembler.py      # Bytecode disassembler
│   ├── repl.py              # Interactive REPL
│   ├── gui.py               # Tkinter desktop GUI
│   └── main.py              # Unified CLI
├── examples/                # Example scripts (.gaz)
└── tests/                   # Test suite
```

---

## Author
Aviral Dewangan  
GitHub: [@AviralDewangan14](https://github.com/AviralDewangan14)
