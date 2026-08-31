# 🇮🇳 BharatOS 1.0 — Web-Native Sovereign Operating System

<div align="center">
  <img src="public/assets/bharatos_banner.jpg" alt="BharatOS 1.0 Live Desktop Running" width="100%" style="border-radius: 14px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);" />
  <br /><br />
  <p><strong>A high-performance, zero-telemetry web desktop environment built entirely in modern Web standards.</strong></p>
  <p><em>Featuring an offline AI Copilot, Web Audio harmonic synthesizer, 2D vector paint canvas, scientific function grapher, and 8-language Indic localization.</em></p>
  
  <p>
    <a href="https://bharatos1-0.vercel.app/os"><strong>🌐 Launch Live Web OS</strong></a> •
    <a href="https://bharatos1-0.vercel.app/portfolio"><strong>💼 Engineering Portfolio</strong></a> •
    <a href="https://bharatos1-0.vercel.app/game"><strong>🎮 Solaris 3D Engine</strong></a>
  </p>
</div>

---

## 📖 Why I Built BharatOS

Operating systems today are increasingly bloated with non-consensual telemetry, background tracking daemons, and heavy resource overhead.

I built **BharatOS 1.0** as an engineering experiment to prove that a complete, multi-window desktop operating system with productive apps—audio synthesizers, vector illustration tools, math graphers, and offline AI assistants—can run **100% client-side in the browser** at silky 120 FPS with **zero external telemetry and zero data leakage**.

---

## ⚡ Key Applications & Features

| Application | Description | Tech Stack |
|---|---|---|
| **🤖 Chanakya AI Copilot** | Built-in offline assistant that parses natural language to change system settings, switch wallpapers, write code, and explain kernel concepts. | JavaScript ES6+ Regex/Intent Engine |
| **🎵 Sur Sangeet Synthesizer** | 8-Channel synthesizer with Solfeggio scale presets (396Hz to 963Hz), octave shifters, waveform selectors, and a real-time oscilloscope. | Web Audio API (`AudioContext`, `OscillatorNode`) |
| **🎨 Chitram Vector Paint** | Digital sketching suite with brush, eraser, geometry shapes (lines, rectangles, circles), stroke width controls, and 1-click PNG image exporter. | HTML5 Canvas 2D Rendering Context |
| **🧮 Aryabhata Math Suite** | Scientific calculator, programmer radix converter (Hex, Dec, Bin, Oct), and interactive 2D function grapher (`y = f(x)`). | Canvas Cartesian Math Plotter |
| **🌐 Indic Localization** | Instant multi-language UI translation across 8 Indian languages (Hindi, Sanskrit, Tamil, Telugu, Bengali, Marathi, Gujarati, English). | DOM Data-Attribute Translation Layer |
| **💻 Indic Code Studio** | In-browser code editor with integrated compiler sandbox and live terminal output. | Custom Sandboxed Execution Runtime |
| **🔐 Zero-Trust Lock Screen** | Streamlined authentication with default PIN `1234`, password visibility toggle, and instant 1-click Quick Unlock. | Hardware Enclave Simulation |

---

## 🏗️ Architectural Overview

```
+-----------------------------------------------------------------------+
|                             BHARATOS 1.0                              |
+-----------------------------------------------------------------------+
|  TOP BAR: Status Tickers • Kavach 100% • Language Switcher • Widgets  |
+-----------------------------------------------------------------------+
|                                                                       |
|   +-----------------------+               +-----------------------+   |
|   |  🎵 Sur Sangeet Synth |               |  🤖 Chanakya AI       |   |
|   |  - Web Audio Context  |               |  - Natural Intent     |   |
|   |  - 528Hz Solfeggio    |               |  - OS Automation      |   |
|   |  - Live Oscilloscope  |               |  - Code Generation    |   |
|   +-----------------------+               +-----------------------+   |
|                                                                       |
|   +-----------------------+               +-----------------------+   |
|   |  🎨 Chitram Paint     |               |  🧮 Aryabhata Math    |   |
|   |  - Canvas 2D Paths    |               |  - 2D Grapher Engine  |   |
|   |  - PNG Exporter       |               |  - Radix Converter    |   |
|   +-----------------------+               +-----------------------+   |
|                                                                       |
+-----------------------------------------------------------------------+
|   DOCK: Quick App Launchers • Running Task Indicators • Glassmorphism  |
+-----------------------------------------------------------------------+
|         CORE: Window Manager • Z-Index Stack • DOM Event Bus          |
+-----------------------------------------------------------------------+
```

### 1. Window Management System
- **Z-Index Layering**: Active windows automatically elevate their `z-index` when clicked or dragged.
- **Hardware Acceleration**: Windows use CSS `transform: translateZ(0)` and `backface-visibility: hidden` to utilize GPU rasterization, keeping frame rates at a steady 60–120 FPS even on low-end hardware.
- **Drag & Resize Math**: Mouse events calculate relative offsets from window headers to prevent cursor snapping.

### 2. Audio DSP Engine (`Sur Sangeet`)
- Utilizes the browser's native `AudioContext` without external audio libraries.
- Frequencies are calculated dynamically using standard chromatic intervals:
  $$	ext{Frequency} = 	ext{BaseFreq} 	imes 2^{	ext{Octave} - 4}$$
- Custom gain nodes apply exponential decay curves to eliminate harsh clicking artifacts on note release.

### 3. Vector Canvas Pipeline (`Chitram`)
- Implements smooth sub-pixel freehand path interpolation with `lineCap = 'round'` and `lineJoin = 'round'`.
- Geometric previews (rectangles, circles, lines) use a snapshot-and-restore buffer (`getImageData` / `putImageData`) for seamless real-time previewing during active drag.

---

## 🧪 Reviewer & Testing Guide (How to Test in 2 Minutes)

1. **Unlock Desktop**:
   - On the lock screen, enter PIN **`1234`** (or click the green **`⚡ QUICK UNLOCK`** button).
2. **Test Chanakya AI Copilot**:
   - Click **`🤖 Chanakya AI`** in the top bar.
   - Click the prompt chip **`🏔️ Ladakh Wall`** (watches wallpaper change instantly).
   - Click **`💻 Write IDT in C`** to see kernel code generation.
3. **Test Sur Sangeet Synthesizer**:
   - Click the **`🎵 Sur Sangeet`** icon on the dock.
   - Click the **`528 Hz (DNA Resonance)`** Solfeggio preset button.
   - Click piano keys (Sa, Re, Ga, Ma...) and observe the live oscilloscope waveform.
4. **Test Aryabhata Math & Grapher**:
   - Open **`🧮 Aryabhata`** from the dock or desktop.
   - Switch to the **`2D Function Grapher`** tab and click **Plot** to render `f(x) = sin(2x) * cos(x)`.
5. **Test Multi-Language Localization**:
   - Select **`🇮🇳 हिन्दी (Hindi)`** or **`🕉️ संस्कृतम् (Sanskrit)`** from the top bar dropdown.
   - Notice all desktop icons, tooltips, and app titles localize dynamically without reloading.

---

## 🛠️ Local Development Setup

No complex build tools or heavy node dependencies required. Everything runs cleanly via standard HTTP:

```bash
# 1. Clone the repository
git clone https://github.com/AviralDewangan14/bharatos1.0.git
cd bharatos1.0

# 2. Start the local server
python main.py

# 3. Open in your browser
# Navigate to: http://localhost:5678/bharatos
```

---

## 📁 Repository Structure

```
├── bharatos/                  # Core BharatOS Source Files
│   ├── index.html             # Master Single-File Sovereign Desktop
│   ├── kernel.py              # Microkernel & VFS process emulator
│   ├── core_kernel/           # Freestanding C interrupt handlers (IDT/GDT)
│   ├── ocr/                   # AVX2 binarization OCR engine
│   ├── graphics/              # Vulkan/Direct3D compositor bridges
│   └── wallpapers/            # 4K Indian landscape wallpapers
├── public/                    # Vercel Zero-Config Production Distribution
│   ├── index.html             # BharatOS Sovereign Web Desktop
│   ├── portfolio.html         # Engineering Consultancy Studio
│   ├── project_dashboard.html # Project Milestone & Escrow Specs
│   ├── game.html              # Solaris 3D Spatial Grid Engine
│   └── assets/                # Real running screenshots & banners
├── vercel.json                # Edge rewrite & routing configuration
└── README.md                  # Project documentation & technical specs
```

---

## 👨‍💻 Author & Engineering Credits

Crafted with care by **Aviral Dewangan**  
- **GitHub**: [@AviralDewangan14](https://github.com/AviralDewangan14)  
- **Email**: aviral.dewangan14@gmail.com  

Licensed under the **MIT License**.
