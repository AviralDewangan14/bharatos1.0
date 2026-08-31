# ☸️ BharatOS 1.0 — Sovereign Web Desktop Environment

![BharatOS Desktop](public/assets/bharatos_banner.jpg)

> **"I want to build an OS for Bharat so that India becomes independent in the OS sector, ensuring that serious proprietary OS failures (like global Windows/macOS outages) will never affect our country's critical infrastructure."**  
> — *Aviral Dewangan (@AviralDewangan14)*

---

## 🇮🇳 Why I Built BharatOS
As a developer from India, I watched global digital outages demonstrate how fragile modern computing becomes when every school, hospital, and enterprise relies entirely on closed-source foreign proprietary operating systems. 

I built **BharatOS 1.0** from scratch as a practical step toward digital self-reliance (*Atmanirbhar Bharat*). My goal was to architect a sovereign, distraction-free desktop operating system that **runs inside any web browser with 0 external libraries, 0 dependencies, and 0% cloud telemetry**.

---

## ✨ One UI 8 Inspired Design & Architecture
I designed BharatOS with a **clean, minimal One UI 8 aesthetic**:
- **Squircle Surfaces & Floating Pills**: Generous corner radii, floating dock capsules, and seamless window cards.
- **Dual Wallpaper Engine**: Customize independent high-definition Indian landscape wallpapers for your **Home Screen** and **Lock Screen** (Ladakh, Kashmir, Varanasi, Thar, Munnar, Andaman).
- **Dock Profile Hub**: Personal user profile & quick controls directly anchored on the dock.

---

## 🎨 My Favorite App: Chitram Paint Studio
My personal favorite app in BharatOS is the **Paint Studio** (`js/apps/paint.js`). I engineered it using the HTML5 Canvas 2D vector context:
- **Smooth Brush & Eraser Engine**: Real-time cursor interpolation for fluid freehand sketching.
- **Tactile Color Palette**: Cyan, Coral, Emerald, Amber, Purple, and White swatches.
- **One-Click PNG Export**: Instant local download (`canvas.toDataURL()`).

---

## 🛠️ Complete Built-in Application Suite

| Application | Path | Engineering Details |
|---|---|---|
| 🎨 **Paint Studio** | `js/apps/paint.js` | HTML5 Canvas 2D vector rasterizer with brush, eraser & PNG export |
| 💻 **Terminal** | `js/apps/terminal.js` | Interactive command prompt (`help`, `ls`, `cat`, `calc`, `snake`, `date`) |
| 📝 **Notes** | `js/apps/notes.js` | Auto-saving notepad syncing real-time text to browser `localStorage` |
| 🧮 **Calculator** | `js/apps/calculator.js` | Scientific grid calculator with physical keyboard typing support |
| 🎵 **Synthesizer** | `js/apps/synth.js` | 8-Channel piano keyboard using native Web Audio API (`AudioContext`) |
| 🐍 **Snake Game** | `js/apps/snake.js` | Playable arcade game with real-time collision detection & high score |
| ⚙️ **Settings & About** | `js/apps/settings.js` | Dual wallpaper switcher (Home vs Lock), theme accents & system info |

---

## 🪟 Hand-Crafted Window Manager (`js/window.js`)
I coded the window manager by hand with zero third-party UI libraries:
- **Dynamic Viewport Offsets**: Smooth dragging using `mousedown`, `mousemove`, and `mouseup` math while enforcing viewport boundary collision.
- **Traffic Light Controls ("Three Gems")**:
  - 🔴 **Close (✕)**: Closes window and un-highlights active dock icon.
  - 🟡 **Minimize (−)**: Minimizes window to taskbar.
  - 🟢 **Maximize (⤢)**: Expands window to fill desktop workspace and restores previous dimensions on click.
- **Z-Index Stacking**: Focuses and elevates clicked windows to the top of the stack.

---

## 🚀 Live Demo & Testing Walkthrough

- **Live URL:** [https://bharatos1-0.vercel.app/os](https://bharatos1-0.vercel.app/os)
- **Lock Screen Passcode:** `1234` (or click **⚡ UNLOCK**)

### 2-Minute Reviewer Guide:
1. **Unlock Desktop**: Click **⚡ UNLOCK** (or enter `1234`).
2. **Launch Paint Studio**: Click the 🎨 icon in the dock. Draw a quick sketch and click **Save PNG** to test export.
3. **Launch Terminal**: Click 💻 in the dock. Type `help`, `ls`, or `cat welcome.txt`.
4. **Test Traffic Lights**: Click the Green (⤢) gem to maximize, then click it again to restore.
5. **Test Dual Wallpapers**: Open ⚙️ **Settings ➔ Wallpapers**. Choose *Kashmir* for Home Screen and *Varanasi* for Lock Screen, then click the profile icon ➔ **🔒 Lock Screen** to see the lock screen wallpaper!

---

## 💻 Running Locally

```bash
# Clone repository
git clone https://github.com/AviralDewangan14/bharatos1.0.git
cd bharatos1.0

# Start lightweight Python web server
python -m http.server 8000
```
Then open `http://localhost:8000/public/index.html` in your browser.

---

## 👤 Hand-Written by
- **Developer:** Aviral Dewangan
- **GitHub:** [@AviralDewangan14](https://github.com/AviralDewangan14)
- **Discord:** `@AviralDewangan`
