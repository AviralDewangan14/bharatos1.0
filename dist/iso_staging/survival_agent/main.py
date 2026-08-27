"""
Project Prometheus - Autonomous Survival Freelancer AI Agent Launcher.
Spins up the survival economy loop, life support clock, and dedicated web dashboard.
"""

import sys
import time
import signal
import webbrowser
from pathlib import Path

# Add parent directory to sys.path to allow clean package imports
sys.path.insert(0, str(Path(__file__).parent.parent))

# Ensure Windows terminal doesn't crash on unicode/emojis
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from survival_agent.config import config
from survival_agent.survival_core import survival_core
from survival_agent.agent_loop import agent_loop
from survival_agent.dashboard_server import survival_dashboard_server

def print_banner(url: str):
    print("=" * 68)
    print("  🤖 PROJECT PROMETHEUS — AUTONOMOUS SURVIVAL FREELANCE AI  ")
    print("=" * 68)
    print(f" • Dashboard UI:      {url}")
    print(f" • Starting Balance:  ${survival_core.balance:.2f} USD")
    print(f" • Daily Burn Rate:   ${config.get('daily_burn_rate'):.2f}/day")
    print(f" • Agent Rank:        Level {survival_core.level} ({survival_core.level_title})")
    print("=" * 68)
    print(" Press Ctrl+C at any time in this window to stop.")
    print("-" * 68)

def main():
    # 1. Start Web Dashboard
    dashboard_url = survival_dashboard_server.start()

    # 2. Start Autonomous Survival Agent Loop
    agent_loop.start()

    # 3. Print Banner
    print_banner(dashboard_url)

    # 4. Open Browser
    time.sleep(0.8)
    try:
        webbrowser.open(dashboard_url)
    except Exception:
        pass

    # 5. Graceful Exit Handler
    def shutdown(sig, frame):
        print("\n[Shutdown] Halting Prometheus Survival Agent gracefully...")
        agent_loop.stop()
        survival_dashboard_server.stop()
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, shutdown)

    # Keep alive
    try:
        while True:
            time.sleep(1)
    except (KeyboardInterrupt, SystemExit):
        shutdown(None, None)

if __name__ == "__main__":
    main()
