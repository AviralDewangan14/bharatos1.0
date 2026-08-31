# BharatOS 1.0

A simple, lightweight web-based desktop environment written entirely by hand with pure HTML, CSS, and Vanilla JavaScript.

## Why I Built This
I wanted to challenge myself to build a functional desktop operating system interface that runs entirely inside a web browser without relying on any external frameworks (no React, no Vue, no Tailwind, no Electron). Everything is written from scratch using standard Web APIs.

## Built-in Apps
- **Paint Studio (`js/apps/paint.js`)**: A drawing canvas with brush, eraser, custom colors, and PNG export using HTML5 Canvas.
- **Terminal (`js/apps/terminal.js`)**: A command line prompt that supports commands like `help`, `ls`, `cat`, `calc`, `date`, `clear`, and `snake`.
- **Notes (`js/apps/notes.js`)**: A simple text editor that automatically saves your notes in `localStorage`.
- **Calculator (`js/apps/calculator.js`)**: A basic calculator that works with both mouse clicks and your physical keyboard.
- **Synthesizer (`js/apps/synth.js`)**: A playable piano synthesizer built using the native Web Audio API (`AudioContext` & oscillators).
- **Snake Game (`js/apps/snake.js`)**: A playable arcade snake game with arrow key controls and high-score saving.
- **Settings (`js/apps/settings.js`)**: Lets you switch wallpapers for the desktop.

## Window Management
The window manager (`js/window.js`) was written with plain mouse event listeners (`mousedown`, `mousemove`, `mouseup`):
- Windows can be dragged around the screen with boundary detection.
- Red, yellow, and green buttons allow closing, minimizing, and maximizing windows.
- Clicking any window elevates its z-index so it comes to the front.

## How to Run Locally
No build steps or dependencies required:

```bash
# Clone the repository
git clone https://github.com/AviralDewangan14/bharatos1.0.git
cd bharatos1.0

# Start a simple web server
python -m http.server 8000
```
Then open `http://localhost:8000/bharatos/index.html` in your browser.

Lock screen default PIN: `1234` (or click Unlock).

## Project Structure
```
bharatos/
├── css/
│   └── style.css            # Handwritten stylesheet (zero frameworks)
├── js/
│   ├── window.js            # Window drag, focus, minimize/maximize
│   ├── main.js              # Clock timer and lock screen logic
│   └── apps/
│       ├── paint.js         # Canvas paint app
│       ├── terminal.js      # Terminal CLI
│       ├── notes.js         # Notepad
│       ├── calculator.js    # Calculator
│       ├── synth.js         # Web Audio synth
│       ├── snake.js         # Snake game
│       └── settings.js      # Wallpaper switcher
├── wallpapers/              # Background images
└── index.html               # Semantic HTML markup
```

## Author
Built by **Aviral Dewangan**  
GitHub: [@AviralDewangan14](https://github.com/AviralDewangan14)
