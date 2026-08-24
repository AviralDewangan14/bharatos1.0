"""
Main Entry Point for 24/7 Hackatime Coding Bot.
Starts the background daemon, spins up the modern web dashboard,
and opens the browser control center.
"""

import sys
import time
import signal
import argparse
import webbrowser
from pathlib import Path

from config import config
from service_daemon import daemon
from web_dashboard import dashboard_server
from heartbeat_dispatcher import dispatcher

# Ensure Windows terminal doesn't crash on unicode/emojis
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

def print_banner(url: str):
    """Prints a styled terminal banner with connection status."""
    print("=" * 68)
    print("   ⚡ HACKATIME 24/7 DEVELOPER ACTIVITY BOT ⚡   ")
    print("=" * 68)
    print(f" • Web Dashboard URL:     {url}")
    print(f" • Target API Endpoint:   {config.get('api_url')}")
    print(f" • Pulse Cadence Jitter:  {config.get('pulse_interval_min')}s - {config.get('pulse_interval_max')}s")
    print(f" • Ghost API Mode:        {'ENABLED' if config.get('ghost_mode_api') else 'DISABLED'}")
    print(f" • Workspace Disk Writer: {'ENABLED' if config.get('physical_workspace_mode') else 'DISABLED'}")
    print(f" • Windows 24/7 Keep-Awake:{'ENABLED' if config.get('prevent_system_sleep') else 'DISABLED'}")
    print("=" * 68)
    print(" Press Ctrl+C at any time in this window to stop.")
    print("-" * 68)

def main():
    parser = argparse.ArgumentParser(description="24/7 Hackatime Coding Bot Daemon")
    parser.add_argument("--no-browser", action="store_true", help="Do not auto-open browser dashboard")
    parser.add_argument("--headless", action="store_true", help="Run without web dashboard")
    parser.add_argument("--test-only", action="store_true", help="Test Hackatime connection and exit")
    parser.add_argument("--port", type=int, default=5678, help="Web dashboard port (default: 5678)")
    args = parser.parse_args()

    # If test-only mode requested
    if args.test_only:
        print("[Test] Verifying Hackatime connection...")
        res = dispatcher.test_connection()
        print(f"[Test] Result: {res}")
        sys.exit(0 if res.get("success") else 1)

    # 1. Start Web Dashboard (if not headless)
    dashboard_url = ""
    if not args.headless:
        dashboard_server.port = args.port
        dashboard_url = dashboard_server.start()

    # 2. Start 24/7 Background Daemon
    daemon.start()

    # 3. Print CLI Banner
    if dashboard_url:
        print_banner(dashboard_url)
        if not args.no_browser:
            # Open browser after 1 second
            time.sleep(0.8)
            try:
                webbrowser.open(dashboard_url)
            except Exception:
                pass

    # 4. Graceful Shutdown Handler
    def shutdown_handler(signum, frame):
        print("\n[Shutdown] Stopping 24/7 Hackatime bot gracefully...")
        daemon.stop()
        dashboard_server.stop()
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown_handler)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, shutdown_handler)

    # 5. Keep main thread alive
    try:
        while True:
            time.sleep(1)
    except (KeyboardInterrupt, SystemExit):
        shutdown_handler(None, None)

if __name__ == "__main__":
    main()
