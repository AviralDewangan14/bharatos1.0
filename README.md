# ☸️ BharatOS 1.0 — Sovereign Web Desktop Environment

![BharatOS Desktop](public/assets/bharatos_banner.jpg)

> **"I want to build an OS for Bharat so that India becomes independent in the OS sector, ensuring that major proprietary OS failures will never affect our nation's computing infrastructure."**  
> — *Aviral Dewangan (@AviralDewangan14)*

---

## 🇮🇳 Why I Built BharatOS
Recent global incidents (like major Windows outages and vendor lock-ins) proved that relying entirely on foreign proprietary operating systems leaves critical infrastructure vulnerable. 

I built **BharatOS 1.0** as a step towards digital self-reliance (*Atmanirbhar Bharat*). My goal was to create a sovereign, fast, lightweight desktop operating system that **runs directly inside any modern web browser with zero external libraries and zero cloud tracking**. Whether on a budget laptop, a school computer, or a Raspberry Pi, BharatOS delivers a complete, clean computing experience that belongs to the user.

---

## 🌟 What I Am Most Proud Of
1. **Zero External Libraries**: Built 100% from scratch using pure Vanilla ES6 JavaScript, HTML5 Canvas, Web Audio API, and CSS. No heavy frameworks or external dependencies.
2. **100% Client-Side Privacy**: Absolutely 0.00% telemetry or tracking data leaves your device.
3. **Clean & Minimal UI/UX**: Designed a distraction-free, modern glassmorphic interface inspired by natural Indian landscapes (Ladakh, Kashmir, Varanasi, and Thar).

---

## 🎨 My Favorite App: Chitram Paint Studio
My personal favorite application in BharatOS is the **Paint Studio** (`js/apps/paint.js`). I focused on crafting a minimal and responsive drawing tool using the HTML5 Canvas 2D context:
- **Smooth Brush & Eraser Engine**: Real-time cursor stroke smoothing.
- **Color Palette & Swatches**: Cyan, Coral Red, Emerald Green, Amber, Purple, and White.
- **One-Click PNG Export**: Instant local artwork export (`canvas.toDataURL()`).

---

## 🛠️ Built-in Flagship Applications

| Application | Description | Tech Used |
|---|---|---|
| 🎨 **Paint Studio** | Vector drawing canvas with brush, eraser & PNG export | HTML5 Canvas 2D Context |
| 💻 **Terminal** | Interactive CLI (`help`, `ls`, `cat`, `calc`, `snake`, `date`) | Custom Command Parser |
| 📝 **Notes** | Real-time text editor with automatic `localStorage` saving | Browser Local Storage API |
| 🧮 **Calculator** | Scientific calculator with full physical keyboard support | Pure JavaScript Math Engine |
| 🎵 **Synthesizer** | 8-Channel piano synthesizer with harmonic waveforms | Native Web Audio API (`AudioContext`) |
| 🐍 **Snake Game** | Classic arcade game with real-time score tracking | HTML5 Canvas Game Loop |
| ⚙️ **Settings & About** | Wallpaper switcher, accent colors & system info | Custom DOM Event Manager |

---

## 🪟 Custom Window Manager Architecture
The window manager (`js/window.js`) was engineered from scratch:
- **Dynamic Viewport Dragging**: Uses `mousedown`, `mousemove`, and `mouseup` math to smoothly reposition windows while preventing them from going off-screen.
- **Traffic Light Controls ("Three Gems")**:
  - 🔴 **Close (✕)**: Closes window and un-highlights active dock icon.
  - 🟡 **Minimize (−)**: Minimizes window to taskbar.
  - 🟢 **Maximize (⤢)**: Expands window to fill desktop workspace and restores previous dimensions on click.
- **Z-Index Stacking**: Automatically elevates clicked windows to the top of the stack.

---

## 🚀 Live Demo & Testing Guide

- **Live URL:** [https://bharatos1-0.vercel.app/os](https://bharatos1-0.vercel.app/os)
- **Lock Screen Passcode:** `1234` (or click **⚡ UNLOCK**)

### 2-Minute Reviewer Walkthrough:
1. **Unlock Screen**: Click **⚡ UNLOCK** (or enter PIN `1234`). Note how the frosted glass displays the wallpaper underneath.
2. **Test Paint Studio**: Click the 🎨 icon in the dock. Select a color, draw a sketch, and click **Save PNG** to download your artwork.
3. **Test Terminal**: Click 💻 in the dock. Type `help`, `ls`, `cat welcome.txt`, or `calc 125 * 8`.
4. **Test Traffic Lights**: Click the Green (⤢) gem to maximize, then click it again to restore.
5. **Change Wallpaper**: Open ⚙️ **Settings**, click on *Kashmir* or *Varanasi*, and observe it updating both your desktop and lock screen.

---

## 💻 Running Locally

```bash
# Clone repository
git clone https://github.com/AviralDewangan14/bharatos1.0.git
cd bharatos1.0

# Start lightweight Python web server
python -m http.server 8000
```
Open `http://localhost:8000/public/index.html` in your web browser.

---

## 👤 Author
- **Developer:** Aviral Dewangan
- **GitHub:** [@AviralDewangan14](https://github.com/AviralDewangan14)
- **Discord:** `@AviralDewangan`
