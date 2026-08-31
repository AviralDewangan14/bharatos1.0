# ☸️ BharatOS 1.0 — A Web-Based Desktop Environment

![BharatOS Desktop](public/assets/bharatos_banner.jpg)

Hey! I'm **Aviral Dewangan** (@AviralDewangan14).  
This is **BharatOS 1.0**, a web desktop environment that I built from scratch using HTML5, modern CSS, and vanilla JavaScript. Everything runs entirely in the browser with 0 external tracking or cloud telemetry.

---

## 🚀 Live Demo & Quick Testing
- **Live Desktop:** [https://bharatos1-0.vercel.app/os](https://bharatos1-0.vercel.app/os)
- **Lock Screen Passcode:** `1234` (or click **⚡ UNLOCK**)

---

## 🛠️ What I Built & How It Works

### 1. 🪟 Custom Window Manager (`js/window.js`)
- Hand-wrote a draggable window system without external UI libraries.
- Uses `mousedown`, `mousemove`, and `mouseup` event listeners to calculate dynamic viewport offsets and keep windows inside screen bounds.
- Tracks `highestZ` counter to bring clicked windows to the front when focused.
- Window controls for Minimize, Maximize, and Close with smooth CSS transitions.

### 2. 💻 Interactive Web Terminal (`js/apps/terminal.js`)
- Real interactive command prompt with history recall (`ArrowUp` / `ArrowDown`).
- Built-in commands: `help`, `ls`, `cat <file>`, `calc <expression>`, `date`, `clear`, `snake`, `synth`, and `about`.

### 3. 📝 Auto-Saving Notes App (`js/apps/notes.js`)
- Text editor that automatically saves your notes to browser `localStorage` in real-time.
- Live word counter and character counter.

### 4. 🎨 Canvas Paint Studio (`js/apps/paint.js`)
- HTML5 Canvas drawing tool with freehand Brush, Eraser, color palette selection, canvas clear, and instant PNG export (`canvas.toDataURL()`).

### 5. 🧮 Calculator with Keyboard Support (`js/apps/calculator.js`)
- Responsive grid calculator supporting addition, subtraction, multiplication, division, brackets, and full keyboard typing support.

### 6. 🎵 Web Audio Synthesizer (`js/apps/synth.js`)
- Native Web Audio API (`AudioContext` & `OscillatorNode`) synthesizer.
- Supports 4 waveforms (Sine, Triangle, Sawtooth, Square) and interactive piano keys spanning note frequencies from C4 to C5.

### 7. 🐍 Snake Arcade Game (`js/apps/snake.js`)
- Playable classic Snake game rendered on HTML5 Canvas.
- Arrow key steering, real-time collision detection, food spawning, score tracking, and persistent high score.

---

## 📂 Project Structure

```
bharatos/
├── css/
│   └── style.css            # Custom CSS variables, glassmorphism & layout
├── js/
│   ├── window.js            # Drag, focus, maximize/minimize window manager
│   ├── main.js              # Initialization, clock, and lockscreen handler
│   └── apps/
│       ├── terminal.js      # Interactive command shell
│       ├── notes.js         # Notepad with localStorage saving
│       ├── paint.js         # Canvas drawing tool with PNG download
│       ├── calculator.js    # Scientific calculator with keyboard support
│       ├── synth.js         # Web Audio piano synth
│       ├── snake.js         # Playable Snake arcade game
│       └── settings.js      # Wallpaper switcher
├── wallpapers/              # High-resolution landscape wallpapers
└── index.html               # Semantic HTML desktop markup (~250 lines)
```

---

## 💻 Running Locally

No build tools or heavy dependencies required:

```bash
# Clone the repository
git clone https://github.com/AviralDewangan14/bharatos1.0.git
cd bharatos1.0

# Open in any browser or launch a local server:
python -m http.server 8000
```
Then open `http://localhost:8000/public/index.html` or `http://localhost:8000/bharatos/index.html`.

---

## 👤 Author & Contact
- **Developer:** Aviral Dewangan
- **GitHub:** [@AviralDewangan14](https://github.com/AviralDewangan14)
- **Discord:** `@AviralDewangan` (Available in `#ask-the-shipwrights`)
- **Reviewer Note:** If you have any feedback or questions, please feel free to reach out!
