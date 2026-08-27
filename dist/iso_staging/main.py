"""
Master Entry Point for Solaris Prometheus Studio.
Launches the synchronized 24/7 WakaTime + Survival Freelancer engine
and opens the unified Command Center.
"""

import sys
import time
import signal
import argparse
import webbrowser
from pathlib import Path

# Add project root
sys.path.insert(0, str(Path(__file__).parent))

# Ensure Windows terminal doesn't crash on unicode/emojis
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from config import config
from master_daemon import master_daemon
from web_dashboard import dashboard_server
from heartbeat_dispatcher import dispatcher

def print_banner(url: str):
    print("=" * 70)
    print("   ⚡ SOLARIS PROMETHEUS — MASTER PROJECT & STARDUST STUDIO ⚡   ")
    print("=" * 70)
    print(f" • Master Command Center:  {url}")
    print(f" • Playable Solaris Game:  {url}/game")
    print(f" • Stardust Multiplier:    2.4x (Master Craft Tier)")
    print(f" • Target API Endpoint:    {config.get('api_url')}")
    print(f" • 24/7 Windows Keep-Awake:ACTIVE")
    print("=" * 70)
    print(" Press Ctrl+C at any time in this window to stop.")
    print("-" * 70)

def main():
    parser = argparse.ArgumentParser(description="Solaris Prometheus Master Studio")
    parser.add_argument("--no-browser", action="store_true", help="Do not auto-open browser dashboard")
    parser.add_argument("--headless", action="store_true", help="Run without web dashboard")
    parser.add_argument("--test-only", action="store_true", help="Test Hackatime connection and exit")
    parser.add_argument("--port", type=int, default=5678, help="Web dashboard port (default: 5678)")
    args = parser.parse_args()

    if args.test_only:
        print("[Test] Verifying Hackatime connection...")
        res = dispatcher.test_connection()
        print(f"[Test] Result: {res}")
        sys.exit(0 if res.get("success") else 1)

    # 1. Start Unified Web Dashboard
    dashboard_url = ""
    if not args.headless:
        dashboard_server.port = args.port
        dashboard_url = dashboard_server.start()

    # 2. Start Master Synchronized Daemon
    master_daemon.start()

    # 3. Print CLI Banner
    if dashboard_url:
        print_banner(dashboard_url)
        if not args.no_browser:
            time.sleep(0.8)
            try:
                webbrowser.open(dashboard_url)
            except Exception:
                pass

    # 4. Graceful Shutdown Handler
    def shutdown_handler(signum, frame):
        print("\n[Shutdown] Stopping Master Studio gracefully...")
        master_daemon.stop()
        dashboard_server.stop()
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown_handler)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, shutdown_handler)

    # Keep alive
    try:
        while True:
            time.sleep(1)
    except (KeyboardInterrupt, SystemExit):
        shutdown_handler(None, None)

if __name__ == "__main__":
    main()
