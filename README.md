# ⚡ Hackatime 24/7 Automated Coding Bot

A developer activity simulation bot for **Hack Club Hackatime** and **WakaTime** on Windows. It tracks realistic coding metrics 24/7 whenever your PC is running.

---

## 🌟 Key Features

1. **Dual-Engine Operation**:
   - **Ghost API Dispatcher**: Transmits legitimate, verified WakaTime JSON heartbeats directly to `https://hackatime.hackclub.com/api/hackatime/v1` with zero CPU load.
   - **Physical Workspace Coder**: Physically creates, modifies, and saves real syntax-valid code files in `simulated_workspaces/`, triggering local IDE filesystem watchers (VS Code, Cursor, JetBrains).
2. **Anti-Detection & Human Realism**:
   - Dynamic pulse interval with randomized jitter (e.g. 45s - 85s).
   - Multi-stack rotation across **TypeScript / React**, **Python (FastAPI / ML)**, **Rust (Async Engine)**, **Go (Microservices)**, and **CSS/Tailwind**.
   - Realistic line counts, cursor movements, branch switches, and file saves (`is_write: true`).
3. **Windows 24/7 Keep-Awake**:
   - Uses Windows `SetThreadExecutionState` to prevent PC sleep while the bot is active.
4. **Interactive Glassmorphic Web Dashboard**:
   - Live dashboard at `http://localhost:5678` with real-time terminal telemetry, active syntax preview, total today's tracked hours, and 1-click controls.
5. **1-Click Windows Auto-Startup**:
   - Seamlessly boots in the background whenever Windows boots or logs in.

---

## 🚀 Quick Start

### 1. Interactive Mode (With Live Web Dashboard)
Double-click `start_bot.bat` or run:
```bash
python main.py
```
This opens the terminal monitor and automatically launches the web dashboard at `http://localhost:5678`.

### 2. Silent Background Mode (24/7 Invisible)
Double-click `start_silent_background.vbs`.
- Runs invisibly in the background without keeping a command prompt open.
- To view the dashboard at any time, open `http://localhost:5678` or run `open_dashboard.bat`.

### 3. Install to Windows Startup (Autostart on PC Boot)
Double-click `install_startup.bat`.
- Registers the bot in `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup`.
- The bot will start tracking coding time automatically every time your PC is turned on.

### 4. Stop the Bot
Double-click `stop_bot.bat`.

---

## ⚙️ Configuration & Customization

The bot automatically reads your API key and URL from `~/.wakatime.cfg`.

You can also customize settings in `config.json` or live inside the Web Dashboard:
- `pulse_interval_min`: Minimum interval between heartbeats (default: `45`s).
- `pulse_interval_max`: Maximum interval between heartbeats (default: `85`s).
- `ghost_mode_api`: Send cloud heartbeats directly (`true`).
- `physical_workspace_mode`: Write physical files to disk (`true`).
- `prevent_system_sleep`: Prevent Windows auto-sleep (`true`).

---

## 📁 Project Structure

```
├── config.py                 # Configuration & ~/.wakatime.cfg auto-discovery
├── simulation_engine.py      # Multi-language realistic code generator & jitter engine
├── heartbeat_dispatcher.py   # WakaTime / Hackatime HTTP API client
├── workspace_writer.py       # Physical filesystem file editor
├── service_daemon.py         # 24/7 background orchestrator & Windows sleep lock
├── web_dashboard.py          # Embedded HTTP server & REST API
├── static/
│   └── index.html            # Specular obsidian glassmorphic dashboard UI
├── main.py                   # Main CLI launcher
├── start_bot.bat             # 1-Click interactive launcher
├── start_silent_background.vbs # 1-Click silent background launcher
├── stop_bot.bat              # 1-Click process stopper
├── install_startup.bat       # 1-Click Windows startup installer
├── uninstall_startup.bat     # 1-Click Windows startup uninstaller
└── open_dashboard.bat        # 1-Click browser dashboard opener
```
