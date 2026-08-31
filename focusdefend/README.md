# FocusDefend

FocusDefend is a deep-work shield, distraction firewall, and focus analytics engine designed for BharatOS.

## Core Features

- **Distraction Firewall**: Blocks high-dopamine domains (social feeds, video streaming, custom sites) during active focus cycles.
- **Precision Flow Timers**: Supports Deep Flow (90 min), Pomodoro Sprint (25 min / 5 min rest), and custom sessions.
- **Procedural Focus Audio Engine**: Synthesizes real-time 14Hz binaural alpha waves, pink rain, and cosmic drones via Web Audio API.
- **Focus Telemetry & Streaks**: Computes daily deep-work scores, session streaks, and distraction intercept counts.

## Architecture

- **BharatOS Desktop App**: Integrated React application located in `bharatos-app/src/apps/focusdefend/FocusDefendApp.tsx`.
- **Rust Core & CLI**: High-performance Rust library and CLI in `focusdefend/src/`.

## CLI Usage

```bash
# Check shield status and active blocklist
cargo run -- status

# Engage 90-minute Deep Flow shield
cargo run -- start deepflow

# Add a custom domain to the firewall
cargo run -- block reddit.com

# Check today's productivity score & streaks
cargo run -- stats
```

## Author

Developed by **Aviral Dewangan** (<aviral.dewangan14@gmail.com>).
