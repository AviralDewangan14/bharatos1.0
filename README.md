# ☸️ BharatOS 1.0 — Technical Architecture & Engineering Documentation

![BharatOS Desktop](public/assets/bharatos_banner.jpg)

> **Developer:** Aviral Dewangan ([@AviralDewangan14](https://github.com/AviralDewangan14))  
> **Repository:** [https://github.com/AviralDewangan14/bharatos1.0](https://github.com/AviralDewangan14/bharatos1.0)  
> **Live Demo:** [https://bharatos1-0.vercel.app/os](https://bharatos1-0.vercel.app/os) *(Lock Passcode: `1234` or click ⚡ UNLOCK)*

---

## 🇮🇳 1. Engineering Motivation & Architectural Principles

I built **BharatOS 1.0** from the ground up as a fully independent, zero-dependency web desktop operating system. Following recent global IT disruptions and vendor lock-in incidents, my goal was to demonstrate that a resilient, sovereign computing environment can run directly inside any modern web browser without relying on external CDNs, bloated frameworks, or proprietary cloud telemetry.

### Core Architectural Decisions:
1. **100% Vanilla ES6 & Native Web APIs**: Zero dependencies (no React, no Vue, no jQuery, no Electron). Pure standard ECMAScript modules, HTML5 Canvas 2D, Web Audio API, and CSS Custom Properties.
2. **Zero-Telemetry Sandbox**: All data (notes, drawing exports, system settings, high scores, wallpapers) is contained entirely in the client-side `localStorage` and memory buffers.
3. **Samsung One UI 8 Design Language**: Clean minimalist surfaces, generous squircle radii (`24px`), floating pill status capsules, and low-overhead backdrop filters (`blur(28px)`).

---

## 📂 2. Directory Structure & Modular Breakdown

```
bharatos/
├── css/
│   └── style.css            # One UI 8 design tokens, glassmorphism, squircle layout
├── js/
│   ├── window.js            # Viewport drag math, focus stacking, traffic light controls
│   ├── main.js              # Event loop, clock intervals, dock profile launcher & boot
│   └── apps/
│       ├── paint.js         # Canvas 2D vector brush & PNG rasterizer
│       ├── terminal.js      # Custom CLI shell, command parser & terminal buffer
│       ├── notes.js         # Text editor with real-time localStorage persistence
│       ├── calculator.js    # Scientific math parser with physical keyboard bindings
│       ├── synth.js         # Web Audio API oscillator synthesis & pitch mapping
│       ├── snake.js         # Canvas arcade game loop with grid collision detection
│       └── settings.js      # Dual-screen wallpaper state machine & accent switcher
├── wallpapers/              # High-definition landscape assets (Ladakh, Kashmir, etc.)
└── index.html               # Semantic, readable desktop markup (~260 lines)
```

---

## 🔬 3. Deep-Dive Frontend Technical Implementation

### A. Custom Window Manager (`js/window.js`)
I avoided third-party drag-and-drop libraries by writing native mouse coordinate math:

- **Dynamic Viewport Dragging**:
  When `mousedown` fires on `.window-header`, we compute the initial offset between the cursor and the element's bounding rect:
  $$\text{offset}_x = e.\text{clientX} - \text{rect}.\text{left}, \quad \text{offset}_y = e.\text{clientY} - \text{rect}.\text{top}$$
  During `mousemove`, positions are updated with screen boundary clamping:
  $$x = \max(0, \min(\text{window.innerWidth} - 80, e.\text{clientX} - \text{offset}_x))$$
  $$y = \max(38, \min(\text{window.innerHeight} - 80, e.\text{clientY} - \text{offset}_y))$$
- **Event Isolation on Traffic Lights ("Three Gems")**:
  To prevent window drag handlers from capturing click events on the window control buttons (🔴 Close, 🟡 Minimize, 🟢 Maximize), `startDrag` checks `if (e.target.closest('.window-controls')) return;` and control buttons execute `event.stopPropagation()`.
- **Z-Index Elevation**:
  Maintains a global `highestZ` integer counter incremented on every `focusWindow()` invocation to dynamically layer the active application on top.

---

### B. Chitram Paint Studio (`js/apps/paint.js`)
Built using the native HTML5 Canvas 2D Rendering Context:
- **Stroke Interpolation**: Listens to `mousedown`, `mousemove`, and `mouseup` to draw continuous bezier/line segments (`ctx.beginPath()`, `ctx.moveTo()`, `ctx.lineTo()`, `ctx.stroke()`).
- **Eraser Compositing**: Switches `ctx.strokeStyle = '#020617'` and dynamically adjusts stroke width for seamless erasing against the canvas dark substrate.
- **Client-Side Image Serialization**: Exports drawing buffer directly to PNG format using `canvas.toDataURL('image/png')`, generating an in-memory virtual link trigger for instant local download.

---

### C. Web Audio Synthesizer (`js/apps/synth.js`)
Audio engine built with the browser's hardware-accelerated **Web Audio API**:
- **Pitch Frequency Calculation**: Maps piano keys (C4 through C5) to exact acoustic frequencies calculated using the 12-tone equal temperament scale ($f = 440 \times 2^{(n - 49) / 12}$):
  - $C_4 \approx 261.63\text{ Hz}$, $D_4 \approx 293.66\text{ Hz}$, $E_4 \approx 329.63\text{ Hz}$, $A_4 = 440.00\text{ Hz}$, $C_5 \approx 523.25\text{ Hz}$.
- **Oscillator Nodes & Waveforms**: Supports dynamic waveform switching between `sine`, `triangle`, `sawtooth`, and `square` nodes.
- **Audio Envelope Shaping**: Connects `OscillatorNode` $\rightarrow$ `GainNode` $\rightarrow$ `AudioContext.destination` with gain ramping to eliminate clicks during note attack/release cycles.

---

### D. Interactive Terminal CLI (`js/apps/terminal.js`)
An interactive command prompt shell with full ANSI-style output parsing:
- **Command Dispatcher**: Parses whitespace-delimited tokens from input. Built-in command registry:
  - `help`: Outputs formatted command manual.
  - `ls`: Lists virtual sovereign system filesystem directories and config files.
  - `cat <file>`: Displays file contents (e.g. `cat welcome.txt`, `cat system.cfg`).
  - `calc <expr>`: Evaluates mathematical expressions directly within shell.
  - `snake` / `synth`: Launches graphical desktop apps from command line.
  - `date`, `clear`, `about`: System utilities.
- **History Navigation**: Tracks command history array with `ArrowUp` and `ArrowDown` cursor position index restoration.

---

### E. Grid Calculator (`js/apps/calculator.js`)
- **Mathematical Tokenizer**: Supports floating-point arithmetic, parenthesis grouping, operator precedence, and divide-by-zero protection.
- **Physical Keyboard Integration**: Listens to global `window.addEventListener('keydown')`, safely mapping physical number keys (`0-9`), operators (`+`, `-`, `*`, `/`), `Enter` (equals), and `Backspace`/`Escape` (clear).

---

### F. Snake Arcade Game Engine (`js/apps/snake.js`)
- **Game Loop**: Discrete 100ms interval canvas render loop on a $20 \times 17$ tile matrix.
- **Collision Matrix**: Real-time evaluation of snake head coordinates against wall boundaries and self-intersecting body segments array.
- **RNG Food Spawner**: Generates random food coordinates outside the current snake body segment set.
- **High-Score State**: Persists highest score in browser `localStorage.getItem('bharatos_snake_best')`.

---

### G. Dual-Screen Wallpaper & Appearance Engine (`js/apps/settings.js`)
- **Independent Targeting**: A state machine variable (`selectedTarget = 'home' | 'lock' | 'both'`) allows the user to apply different wallpapers for the **Home Screen Desktop** vs **Lock Screen**.
- **CSS Variable Accent Dispatcher**: Dynamically updates the desktop theme accent color via `document.documentElement.style.setProperty('--accent-cyan', hex)` in real-time.

---

## 🔒 4. Lock Screen & Security Architecture

- **Frosted Glass Blur**: Uses dedicated `#lockscreen-bg` and `#lockscreen-overlay` layers with `backdrop-filter: blur(28px)` to project the lock screen wallpaper underneath without leaking desktop window content.
- **Passcode Verification**: Verifies user PIN (`1234`) with instant unlock bypass button for rapid evaluation.

---

## ⚡ 5. How to Test & Review (2-Minute Walkthrough)

1. **Open Live Demo**: Navigate to [https://bharatos1-0.vercel.app/os](https://bharatos1-0.vercel.app/os).
2. **Unlock Screen**: Click **⚡ UNLOCK** (or type PIN `1234`).
3. **Test Paint Studio**: Click 🎨 in the dock. Draw a vector sketch, change colors, and click **Save PNG** to test local export.
4. **Test Terminal**: Click 💻 in the dock. Type `help`, `ls`, or `calc (25 * 4) + 15`.
5. **Test Traffic Light Controls**: Click 🟢 (Maximize) on any window to expand, then click again to restore. Click 🔴 (Close) to close.
6. **Test Dock Profile Hub**: Click the **AD** avatar on the left of the dock to toggle the quick launcher.
7. **Test Dual Wallpapers**: Open ⚙️ **Settings ➔ Wallpapers**. Pick *Kashmir* for Home Screen and *Varanasi* for Lock Screen, then click **🔒 Lock Screen** to see the lock screen wallpaper.

---

## 💻 6. Running Locally

```bash
# 1. Clone repository
git clone https://github.com/AviralDewangan14/bharatos1.0.git
cd bharatos1.0

# 2. Launch zero-dependency local web server
python -m http.server 8000
```
Open `http://localhost:8000/public/index.html` in any browser.

---

## 👤 Author
- **Developer:** Aviral Dewangan
- **GitHub:** [@AviralDewangan14](https://github.com/AviralDewangan14)
- **Discord:** `@AviralDewangan`
