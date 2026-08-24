"""
Web Dashboard Server for 24/7 Hackatime Coding Bot.
Provides an interactive local HTTP server & REST API to inspect metrics,
control simulation modes, and configure parameters in real time.
"""

import os
import json
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from typing import Optional

from config import config
from service_daemon import daemon
from heartbeat_dispatcher import dispatcher

STATIC_DIR = Path(__file__).parent / "static"

class DashboardRequestHandler(SimpleHTTPRequestHandler):
    """Custom HTTP request handler with REST API and static asset routing."""

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
            self._send_json_response(daemon.get_status_snapshot())
        elif self.path in ("/game", "/solaris", "/play"):
            game_path = Path(__file__).parent / "solaris" / "index.html"
            if game_path.exists():
                with open(game_path, "rb") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(content)))
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_error(404, "Game HTML not found")
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
            # Fallback to serving static files
            super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        req_body = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
        try:
            req_data = json.loads(req_body) if req_body else {}
        except Exception:
            req_data = {}

        if self.path == "/api/start":
            daemon.start()
            self._send_json_response({"success": True, "message": "Bot daemon started"})
        elif self.path == "/api/pause":
            daemon.pause()
            self._send_json_response({"success": True, "message": "Bot daemon paused"})
        elif self.path == "/api/resume":
            daemon.resume()
            self._send_json_response({"success": True, "message": "Bot daemon resumed"})
        elif self.path == "/api/pulse":
            daemon.trigger_immediate_pulse()
            self._send_json_response({"success": True, "message": "Immediate pulse triggered"})
        elif self.path == "/api/test-connection":
            res = dispatcher.test_connection(
                api_url=req_data.get("api_url"),
                api_key=req_data.get("api_key")
            )
            self._send_json_response(res)
        elif self.path == "/api/config":
            updates = {}
            for key in ["pulse_interval_min", "pulse_interval_max", "ghost_mode_api",
                        "physical_workspace_mode", "prevent_system_sleep", "api_url", "api_key"]:
                if key in req_data:
                    updates[key] = req_data[key]
            
            if updates:
                config.update(updates)
                if "prevent_system_sleep" in updates and daemon.is_running:
                    daemon._set_windows_sleep_prevention(updates["prevent_system_sleep"])
            self._send_json_response({"success": True, "updated": updates, "config": config.settings})
        else:
            self.send_error(404, "Endpoint not found")

    def log_message(self, format, *args):
        # Suppress noisy HTTP access logs in terminal
        pass


class WebDashboardServer:
    """Manages the lifecycle of the web dashboard HTTP server."""

    def __init__(self, host: Optional[str] = None, port: Optional[int] = None):
        self.host = host or "0.0.0.0"
        self.port = port or config.get("web_dashboard_port", 5678)
        self.httpd: Optional[HTTPServer] = None
        self._thread: Optional[threading.Thread] = None

    def start(self) -> str:
        """Starts the Web Dashboard in a background thread and returns the URL."""
        STATIC_DIR.mkdir(parents=True, exist_ok=True)
        server_address = (self.host, self.port)
        
        try:
            self.httpd = HTTPServer(server_address, DashboardRequestHandler)
        except OSError:
            # If port is occupied, try fallback port
            self.port += 1
            server_address = (self.host, self.port)
            self.httpd = HTTPServer(server_address, DashboardRequestHandler)

        self._thread = threading.Thread(target=self.httpd.serve_forever, daemon=True, name="WebDashboard")
        self._thread.start()
        url = f"http://{self.host}:{self.port}"
        print(f"[WebDashboard] Live Interactive Dashboard running at: {url}")
        return url

    def stop(self):
        if self.httpd:
            self.httpd.shutdown()
            self.httpd.server_close()


# Global server instance
dashboard_server = WebDashboardServer()
