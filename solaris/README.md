# 🚀 Solaris Orbital Engine — 2D Space Flight & Orbital Physics Simulator

A high-craft, real-time space physics simulation and arcade game built with vanilla HTML5 Canvas, Web Audio API, and Python.

---

## 🌟 Overview & Features

1. **Newtonian N-Body Orbital Physics**:
   - Verlet integration for gravitational pull across multiple celestial bodies (Helios Prime, Terra Nova, Ares Outpost, Cronus Giant).
   - Circular orbital velocity formula: \(v = \sqrt{\frac{G \cdot M}{r}}\)
   - Escape velocity formula: \(v_{esc} = \sqrt{\frac{2 \cdot G \cdot M}{r}}\)
2. **Interactive Flight & Mission Mechanics**:
   - Dynamic thrusters with particle exhaust and fuel depletion.
   - Laser weapon plasma bursts with particle explosion physics.
   - Asteroid mining field with Stardust collection.
   - Precision space station docking protocol.
3. **Synthesized Web Audio Sound Engine**:
   - Zero external audio assets; real-time audio synthesis using oscillator frequency ramps and noise filters.
4. **Flight HUD & Trajectory Predictor**:
   - Real-time orbital speed, altitude from nearest gravity well, fuel/shield levels, and mission guidance.

---

## 🕹️ Controls

| Key | Action |
| :--- | :--- |
| **`W` / `↑`** | Engage Main Thrusters (Consumes fuel) |
| **`A` / `D` or `←` / `→`** | Rotate Spacecraft |
| **`S` / `↓` or `B`** | Engage Retro-Rockets / Orbital Brake |
| **`SPACE`** | Fire Plasma Laser Blaster |
| **`R`** | Stellar Refueling (Fly close to Helios Prime) |

---

## 🧪 Running Unit Tests

Run the physics test suite:
```bash
python -m solaris.test_physics
```

---

## 📁 Architecture

```
solaris/
├── index.html         # Complete playable HTML5 / WebGL Canvas Game
├── physics.py         # Newtonian gravity, vector math, and orbital mechanics
├── test_physics.py    # Unit tests for orbital and escape velocity calculations
└── README.md          # Project specification & documentation
```
