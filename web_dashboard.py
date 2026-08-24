"""
Unified Master Web Dashboard Server.
Serves the unified Solaris Prometheus Command Center on http://localhost:5678,
handling REST telemetry endpoints, playable game routes, and interactive controls.
"""

import os
import json
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from typing import Optional

from config import config
from master_daemon import master_daemon
from heartbeat_dispatcher import dispatcher
from survival_agent.survival_core import survival_core

STATIC_DIR = Path(__file__).parent / "static"
SOLARIS_DIR = Path(__file__).parent / "solaris"
BHARATOS_DIR = Path(__file__).parent / "bharatos"

class MasterDashboardHandler(SimpleHTTPRequestHandler):
    """Custom HTTP request handler with unified REST API and static asset routing."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def _send_json_response(self, data: dict, status_code: int = 200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/status":
            self._send_json_response(master_daemon.get_master_status())
        elif self.path in ("/bharatos", "/os", "/bharat"):
            os_path = BHARATOS_DIR / "index.html"
            if os_path.exists():
                with open(os_path, "rb") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_error(404, "BharatOS HTML not found")
        elif self.path in ("/game", "/solaris", "/play"):
            game_path = SOLARIS_DIR / "index.html"
            if game_path.exists():
                with open(game_path, "rb") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_error(404, "Solaris Game HTML not found")
        elif self.path == "/" or self.path.startswith("/index"):
            index_path = STATIC_DIR / "index.html"
            if index_path.exists():
                with open(index_path, "rb") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_error(404, "Dashboard HTML not found")
        else:
            super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        req_body = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
        try:
            req_data = json.loads(req_body) if req_body else {}
        except Exception:
            req_data = {}

        action = req_data.get("action", "")

        if self.path == "/api/start":
            master_daemon.start()
            self._send_json_response({"success": True, "message": "Master daemon started"})
        elif self.path == "/api/pause":
            master_daemon.pause()
            self._send_json_response({"success": True, "message": "Master daemon paused"})
        elif self.path == "/api/resume":
            master_daemon.resume()
            self._send_json_response({"success": True, "message": "Master daemon resumed"})
        elif self.path == "/api/pulse":
            master_daemon.trigger_immediate_pulse()
            self._send_json_response({"success": True, "message": "Immediate pulse triggered"})
        elif self.path == "/api/test-connection":
            res = dispatcher.test_connection(
                api_url=req_data.get("api_url"),
                api_key=req_data.get("api_key")
            )
            self._send_json_response(res)
        elif self.path == "/api/action":
            if action == "buy_upgrade":
                upg_id = req_data.get("upgrade_id", "")
                res = survival_core.buy_upgrade(upg_id)
                self._send_json_response(res)
            elif action == "reset":
                survival_core.reset_game(float(req_data.get("starting_cash", 50.00)))
                master_daemon.active_contracts.clear()
                self._send_json_response({"success": True, "message": "Survival economy reset"})
            else:
                self._send_json_response({"success": True})
        elif self.path == "/api/config":
            updates = {}
            for key in ["pulse_interval_min", "pulse_interval_max", "prevent_system_sleep", "api_url", "api_key"]:
                if key in req_data:
                    updates[key] = req_data[key]
            
            if updates:
                config.update(updates)
                if "prevent_system_sleep" in updates and master_daemon.is_running:
                    master_daemon._set_windows_sleep_prevention(updates["prevent_system_sleep"])
            self._send_json_response({"success": True, "updated": updates, "config": config.settings})
        else:
            self.send_error(404, "Endpoint not found")

    def log_message(self, format, *args):
        pass


class UnifiedDashboardServer:
    """Manages the lifecycle of the unified web dashboard server."""

    def __init__(self, host: Optional[str] = None, port: Optional[int] = None):
        self.host = host or "0.0.0.0"
        self.port = port or config.get("web_dashboard_port", 5678)
        self.httpd: Optional[HTTPServer] = None
        self._thread: Optional[threading.Thread] = None

    def start(self) -> str:
        STATIC_DIR.mkdir(parents=True, exist_ok=True)
        server_address = (self.host, self.port)
        
        try:
            self.httpd = HTTPServer(server_address, MasterDashboardHandler)
        except OSError:
            self.port += 1
            server_address = (self.host, self.port)
            self.httpd = HTTPServer(server_address, MasterDashboardHandler)

        self._thread = threading.Thread(target=self.httpd.serve_forever, daemon=True, name="UnifiedDashboardServer")
        self._thread.start()
        url = f"http://localhost:{self.port}"
        print(f"[MasterStudio] Live Unified Command Center running at: {url}")
        return url

    def stop(self):
        if self.httpd:
            self.httpd.shutdown()
            self.httpd.server_close()


# Global server instance
dashboard_server = UnifiedDashboardServer()
