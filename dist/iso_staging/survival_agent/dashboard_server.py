"""
Survival Agent Dashboard Server & REST API.
Serves the Cyberpunk Glassmorphic UI and handles simulation controls.
"""

import os
import json
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from typing import Optional

from survival_agent.config import config
from survival_agent.survival_core import survival_core
from survival_agent.agent_loop import agent_loop
from survival_agent.job_hunter import job_hunter

STATIC_DIR = Path(__file__).parent / "static"

class SurvivalDashboardHandler(SimpleHTTPRequestHandler):
    """Custom HTTP handler for Prometheus Survival Agent."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def _send_json(self, data: dict, status_code: int = 200):
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
            status_data = survival_core.get_status_dict()
            status_data["is_running"] = agent_loop.is_running
            status_data["is_paused"] = agent_loop.is_paused
            status_data["active_contracts"] = agent_loop.active_contracts
            status_data["config"] = config.settings
            self._send_json(status_data)
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
                self.send_error(404, "Survival Dashboard HTML not found")
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

        if self.path == "/api/action":
            if action == "step":
                res = agent_loop.step_once()
                self._send_json({"success": True, "result": res})
            elif action == "toggle_pause":
                if agent_loop.is_paused:
                    agent_loop.resume()
                else:
                    agent_loop.pause()
                self._send_json({"success": True, "is_paused": agent_loop.is_paused})
            elif action == "scout":
                jobs = job_hunter.scout_opportunities()
                agent_loop.active_contracts = [j for j in agent_loop.active_contracts if j["status"] not in ["LOST", "PAID"]] + jobs
                self._send_json({"success": True, "scouted_count": len(jobs)})
            elif action == "buy_upgrade":
                upg_id = req_data.get("upgrade_id", "")
                res = survival_core.buy_upgrade(upg_id)
                self._send_json(res)
            elif action == "reset":
                starting_cash = float(req_data.get("starting_cash", 50.00))
                survival_core.reset_game(starting_cash)
                agent_loop.active_contracts.clear()
                self._send_json({"success": True, "message": "Game reset successfully"})
            else:
                self.send_error(400, "Unknown action")
        else:
            self.send_error(404, "Endpoint not found")

    def log_message(self, format, *args):
        pass


class SurvivalDashboardServer:
    """Manages the lifecycle of the Prometheus Survival Dashboard server."""

    def __init__(self, host: Optional[str] = None, port: Optional[int] = None):
        self.host = host or "0.0.0.0"
        self.port = port or config.get("dashboard_port", 7890)
        self.httpd: Optional[HTTPServer] = None
        self._thread: Optional[threading.Thread] = None

    def start(self) -> str:
        STATIC_DIR.mkdir(parents=True, exist_ok=True)
        server_address = (self.host, self.port)
        
        try:
            self.httpd = HTTPServer(server_address, SurvivalDashboardHandler)
        except OSError:
            self.port += 1
            server_address = (self.host, self.port)
            self.httpd = HTTPServer(server_address, SurvivalDashboardHandler)

        self._thread = threading.Thread(target=self.httpd.serve_forever, daemon=True, name="PrometheusDashboard")
        self._thread.start()
        url = f"http://{self.host}:{self.port}"
        print(f"[Prometheus] Survival Agent Web UI running at: {url}")
        return url

    def stop(self):
        if self.httpd:
            self.httpd.shutdown()
            self.httpd.server_close()


# Global server instance
survival_dashboard_server = SurvivalDashboardServer()
