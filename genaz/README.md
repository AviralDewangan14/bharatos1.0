# GenAz Programming Language

A fast, expressive, and easy-to-learn native programming language designed for real-world software engineering, scientific data analytics, AI matrix computation, and high-concurrency network services.

## Key Features

1. **Easy to Learn & Highly Expressive**:
   - Clean, readable syntax without boilerplate.
   - Hindley-Milner static type inference catches bugs at compile-time without demanding manual type annotations.
   - Helpful error messages with automatic typo suggestions (e.g. *Did you mean 'println'?*).

2. **Real-World Standard Library**:
   - **File System & I/O**: `read_file`, `write_file`, `append_file`, `file_exists`.
   - **JSON & Data Serialization**: `json_encode`, `json_decode`.
   - **Advanced Mathematics**: `sin`, `cos`, `tan`, `sqrt`, `pow`, `exp`, `log`, `gcd`, `factorial`, `clamp`.
   - **Data Science & Statistics**: `mean`, `median`, `variance`, `std_dev`, `sum`, `min`, `max`.
   - **Linear Algebra & AI Tensors**: `matmul` (matrix multiplication), `transpose`, `dot` (dot products), `zeros`, `ones`, `eye`.
   - **String Utilities**: `split`, `join`, `trim`, `replace`, `to_upper`, `to_lower`, `contains`, `starts_with`, `ends_with`.
   - **HTTP Networking**: `http_get`, `http_post`.
   - **Concurrency**: `spawn` lightweight green threads, and thread-safe typed channels (`chan`).

3. **Fast Native Bytecode Virtual Machine**:
   - Compiles `.gaz` source code into standalone `.gbc` binary bytecode files.
   - Stack-based bytecode runtime with 25+ specialized opcodes.

4. **Native Desktop IDE**:
   - Built-in desktop development environment (`genaz gui`) featuring code editing, live disassembly, and execution output.

---

## 🚀 Quick Start & CLI Commands

```bash
# 1. Run a GenAz script
python genaz/src/main.py run genaz/examples/06_data_statistics.gaz

# 2. Compile to native binary bytecode (.gbc)
python genaz/src/main.py build genaz/examples/02_fibonacci.gaz -o fib.gbc

# 3. Execute the binary bytecode directly
python genaz/src/main.py run fib.gbc

# 4. Disassemble bytecode into readable assembly
python genaz/src/main.py dis genaz/examples/01_hello.gaz

# 5. Interactive REPL prompt
python genaz/src/main.py repl

# 6. Launch Native Desktop GUI IDE
python genaz/src/main.py gui
```

---

## 📝 Code Examples

### 1. Data Statistics & Linear Algebra
```genaz
let dataset = [12.5, 18.2, 25.0, 31.4, 42.1, 55.8, 67.2, 80.0];

println("Count:   " + str(len(dataset)));
println("Mean:    " + str(mean(dataset)));
println("Median:  " + str(median(dataset)));
println("Std Dev: " + str(round(std_dev(dataset), 2)));

// Dot product
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

### 3. Lightweight Concurrency & Channels
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

## 📂 Project Structure

```
genaz/
├── bin/
│   ├── genaz.bat            # Windows command line runner
│   ├── genaz.cmd            # Windows Batch executable
│   └── genaz                # Unix / macOS shell script
├── src/
│   ├── lexer.py             # Lexical tokenizer
│   ├── parser.py            # Recursive descent AST parser
│   ├── type_checker.py      # Type inference engine
│   ├── compiler.py          # Stack bytecode compiler
│   ├── binary_format.py     # Binary bytecode (.gbc) serializer
│   ├── vm.py                # Virtual machine runtime with full stdlib
│   ├── disassembler.py      # Bytecode disassembler
│   ├── repl.py              # Interactive REPL
│   ├── gui.py               # Native Desktop Tkinter IDE
│   └── main.py              # Universal CLI entrypoint
├── ide/
│   └── index.html           # Web playground interface
├── examples/                # 7 complete real-world examples (.gaz)
└── tests/                   # Automated unit test suite
```

---

## 👤 Author
Created by **Aviral Dewangan**  
GitHub: [@AviralDewangan14](https://github.com/AviralDewangan14)
