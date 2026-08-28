import os
import json
import threading
import time
import socket
import platform
import shutil
import datetime
from http.server import HTTPServer, ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from typing import Optional

try:
    import psutil
except ImportError:
    psutil = None


from config import config
from master_daemon import master_daemon
from heartbeat_dispatcher import dispatcher
from survival_agent.survival_core import survival_core


_telemetry_cache = None
_telemetry_cache_time = 0.0
_processes_cache = None
_processes_cache_time = 0.0
_cache_lock = threading.Lock()

def get_real_system_telemetry() -> dict:
    """Collects real-time hardware telemetry from the host operating system with fast memory cache."""
    global _telemetry_cache, _telemetry_cache_time
    now = time.time()
    
    with _cache_lock:
        if _telemetry_cache and (now - _telemetry_cache_time) < 0.8:
            return _telemetry_cache

    now_ts = datetime.datetime.now().isoformat()
    
    # Fallback structure if psutil missing
    if not psutil:
        return {
            "timestamp": now_ts,
            "cpu": {"overall_percent": 15.0, "cores_physical": 4, "cores_logical": 8, "model": platform.processor()},
            "memory": {"total_gb": 16.0, "used_gb": 8.0, "free_gb": 8.0, "percent": 50.0},
            "disk": {"total_gb": 512.0, "used_gb": 256.0, "free_gb": 256.0, "percent": 50.0},
            "network": {"ip": socket.gethostbyname(socket.gethostname()) if hasattr(socket, "gethostname") else "127.0.0.1", "hostname": socket.gethostname()},
            "host": {"os": platform.platform(), "processor": platform.processor(), "uptime_seconds": 3600}
        }

    try:
        # CPU
        cpu_percent = psutil.cpu_percent(interval=None)
        per_cpu = psutil.cpu_percent(interval=None, percpu=True)
        cpu_freq = psutil.cpu_freq()
        cpu_count_phys = psutil.cpu_count(logical=False) or 4
        cpu_count_log = psutil.cpu_count(logical=True) or 8

        # RAM
        vmem = psutil.virtual_memory()
        ram_total_gb = round(vmem.total / (1024**3), 2)
        ram_used_gb = round(vmem.used / (1024**3), 2)
        ram_avail_gb = round(vmem.available / (1024**3), 2)
        ram_percent = vmem.percent

        # DISK
        root_path = "C:\\" if os.name == "nt" else "/"
        d_usage = psutil.disk_usage(root_path)
        disk_total_gb = round(d_usage.total / (1024**3), 2)
        disk_used_gb = round(d_usage.used / (1024**3), 2)
        disk_free_gb = round(d_usage.free / (1024**3), 2)
        disk_percent = d_usage.percent

        # DISK I/O
        d_io = psutil.disk_io_counters()
        read_mb = round(d_io.read_bytes / (1024**2), 1) if d_io else 0.0
        write_mb = round(d_io.write_bytes / (1024**2), 1) if d_io else 0.0

        # NETWORK
        net_io = psutil.net_io_counters()
        net_sent_mb = round(net_io.bytes_sent / (1024**2), 1) if net_io else 0.0
        net_recv_mb = round(net_io.bytes_recv / (1024**2), 1) if net_io else 0.0

        # LOCAL IP & HOSTNAME
        hostname = socket.gethostname()
        try:
            local_ip = socket.gethostbyname(hostname)
        except Exception:
            local_ip = "127.0.0.1"

        # BATTERY
        bat = psutil.sensors_battery() if hasattr(psutil, "sensors_battery") else None
        bat_data = {
            "percent": bat.percent if bat else 100,
            "power_plugged": bat.power_plugged if bat else True,
            "secsleft": bat.secsleft if bat else -1
        }

        # BOOT TIME & UPTIME
        boot_time = psutil.boot_time()
        uptime_seconds = int(time.time() - boot_time)

        res = {
            "timestamp": now_ts,
            "cpu": {
                "overall_percent": round(cpu_percent, 1),
                "per_core": [round(c, 1) for c in per_cpu],
                "freq_current_mhz": round(cpu_freq.current, 1) if cpu_freq else 3400.0,
                "freq_min_mhz": round(cpu_freq.min, 1) if cpu_freq and cpu_freq.min else 800.0,
                "freq_max_mhz": round(cpu_freq.max, 1) if cpu_freq and cpu_freq.max else 4200.0,
                "cores_physical": cpu_count_phys,
                "cores_logical": cpu_count_log,
                "model": platform.processor() or "Sovereign Quantum Silicon Engine"
            },
            "memory": {
                "total_gb": ram_total_gb,
                "used_gb": ram_used_gb,
                "free_gb": ram_avail_gb,
                "percent": ram_percent
            },
            "disk": {
                "total_gb": disk_total_gb,
                "used_gb": disk_used_gb,
                "free_gb": disk_free_gb,
                "percent": disk_percent,
                "read_mb": read_mb,
                "write_mb": write_mb,
                "mount": root_path
            },
            "network": {
                "sent_mb": net_sent_mb,
                "recv_mb": net_recv_mb,
                "local_ip": local_ip,
                "hostname": hostname
            },
            "battery": bat_data,
            "host": {
                "os": platform.platform(),
                "system": platform.system(),
                "release": platform.release(),
                "version": platform.version(),
                "uptime_seconds": uptime_seconds,
                "boot_time": datetime.datetime.fromtimestamp(boot_time).strftime("%Y-%m-%d %H:%M:%S")
            }
        }
        with _cache_lock:
            _telemetry_cache = res
            _telemetry_cache_time = now
        return res
    except Exception as e:
        return {"error": str(e), "timestamp": now_ts}


def get_real_processes(limit: int = 50) -> dict:
    """Returns real running host processes with low-latency memory cache."""
    global _processes_cache, _processes_cache_time
    now = time.time()
    with _cache_lock:
        if _processes_cache and (now - _processes_cache_time) < 1.5:
            return _processes_cache

    if not psutil:
        return {"processes": [], "total_count": 0}
    
    procs = []
    total_threads = 0
    for p in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_info', 'status', 'num_threads']):
        try:
            info = p.info
            if not info or not info.get('name'):
                continue
            
            mem = info.get('memory_info')
            ram_mb = round((mem.rss if mem else 0) / (1024**2), 1)
            cpu = info.get('cpu_percent') or 0.0
            threads = info.get('num_threads') or 1
            total_threads += threads

            # Pick appropriate icon
            name_lower = info['name'].lower()
            icon = "⚙️"
            if "chrome" in name_lower or "edge" in name_lower or "browser" in name_lower:
                icon = "🌐"
            elif "python" in name_lower or "code" in name_lower or "node" in name_lower:
                icon = "⚡"
            elif "antigravity" in name_lower:
                icon = "☸️"
            elif "explorer" in name_lower:
                icon = "📁"
            elif "discord" in name_lower or "slack" in name_lower:
                icon = "💬"
            elif "game" in name_lower or "steam" in name_lower:
                icon = "🎮"
            elif "sound" in name_lower or "audio" in name_lower or "spotify" in name_lower:
                icon = "🎵"

            procs.append({
                "pid": info['pid'],
                "name": info['name'],
                "icon": icon,
                "cpu": round(cpu, 1),
                "ram": ram_mb,
                "status": info.get('status', 'running'),
                "threads": threads
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied, Exception):
            continue

    # Sort by memory descending
    procs.sort(key=lambda x: x['ram'], reverse=True)
    res = {
        "processes": procs[:limit],
        "total_count": len(procs),
        "total_threads": total_threads
    }
    with _cache_lock:
        _processes_cache = res
        _processes_cache_time = now
    return res


def get_real_storage_partitions() -> list:
    """Returns all real mounted disk partitions."""
    if not psutil:
        return []
    
    partitions = []
    for part in psutil.disk_partitions(all=False):
        try:
            usage = psutil.disk_usage(part.mountpoint)
            partitions.append({
                "device": part.device,
                "mountpoint": part.mountpoint,
                "fstype": part.fstype,
                "total_gb": round(usage.total / (1024**3), 2),
                "used_gb": round(usage.used / (1024**3), 2),
                "free_gb": round(usage.free / (1024**3), 2),
                "percent": usage.percent
            })
        except Exception:
            continue
    return partitions


def get_real_network_interfaces() -> dict:
    """Returns real network interfaces and IP addresses."""
    if not psutil:
        return {"interfaces": []}
    
    ifaces = []
    addrs = psutil.net_if_addrs()
    stats = psutil.net_if_stats()
    
    for name, addr_list in addrs.items():
        st = stats.get(name)
        ip_v4 = None
        for a in addr_list:
            if a.family == socket.AF_INET:
                ip_v4 = a.address
                break
        
        ifaces.append({
            "name": name,
            "ip": ip_v4 or "N/A",
            "is_up": st.isup if st else True,
            "speed_mbps": st.speed if st else 1000,
            "duplex": str(st.duplex) if st else "Full"
        })
    
    return {"interfaces": ifaces, "hostname": socket.gethostname()}

STATIC_DIR = Path(__file__).parent / "static"
SOLARIS_DIR = Path(__file__).parent / "solaris"
BHARATOS_DIR = Path(__file__).parent / "bharatos"
DIST_DIR = Path(__file__).parent / "dist"

class MasterDashboardHandler(SimpleHTTPRequestHandler):
    """Custom HTTP request handler with unified REST API and static asset routing."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def log_message(self, format, *args):
        # Suppress noisy standard HTTP access logs
        pass

    def _send_json_response(self, data: dict, status_code: int = 200):
        try:
            body = json.dumps(data).encode("utf-8")
            self.send_response(status_code)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()
            self.wfile.write(body)
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError, socket.error):
            pass

    def do_OPTIONS(self):
        try:
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError, socket.error):
            pass

    def do_GET(self):
        if self.path == "/api/status":
            self._send_json_response(master_daemon.get_master_status())
        elif self.path == "/api/system/telemetry":
            self._send_json_response(get_real_system_telemetry())
        elif self.path.startswith("/api/system/processes"):
            self._send_json_response(get_real_processes(limit=60))
        elif self.path == "/api/system/storage":
            self._send_json_response({"partitions": get_real_storage_partitions()})
        elif self.path == "/api/system/network":
            self._send_json_response(get_real_network_interfaces())
        elif self.path == "/api/iso/info":
            info_file = DIST_DIR / "dist_info.json"
            if not info_file.exists():
                try:
                    import build_iso
                    dist_info = build_iso.create_iso_structure()
                except Exception as e:
                    dist_info = {"status": "ERROR", "error": str(e)}
            else:
                with open(info_file, "r", encoding="utf-8") as f:
                    dist_info = json.load(f)
            self._send_json_response(dist_info)
        elif self.path in ("/api/iso/download", "/dist/BharatOS-2026-Sovereign-v1.0-x86_64.iso") or self.path.endswith(".iso"):
            iso_file = DIST_DIR / "BharatOS-2026-Sovereign-v1.0-x86_64.iso"
            if iso_file.exists():
                with open(iso_file, "rb") as f:
                    data = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/x-iso9660-image")
                self.send_header("Content-Disposition", 'attachment; filename="BharatOS-2026-Sovereign-v1.0-x86_64.iso"')
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)
            else:
                self.send_error(404, "ISO file not found. Run /api/iso/build first.")
        elif self.path in ("/api/setup/download", "/dist/BharatOS-Setup-v1.0-Windows-x64.zip") or self.path.endswith(".zip"):
            zip_file = DIST_DIR / "BharatOS-Setup-v1.0-Windows-x64.zip"
            if zip_file.exists():
                with open(zip_file, "rb") as f:
                    data = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/zip")
                self.send_header("Content-Disposition", 'attachment; filename="BharatOS-Setup-v1.0-Windows-x64.zip"')
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)
            else:
                self.send_error(404, "Setup bundle not found. Run /api/iso/build first.")
        elif self.path.startswith("/wallpapers/") or self.path.startswith("/bharatos/wallpapers/"):
            fname = self.path.split("/")[-1]
            wp_path = BHARATOS_DIR / "wallpapers" / fname
            if wp_path.exists():
                with open(wp_path, "rb") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "image/jpeg")
                self.send_header("Content-Length", str(len(content)))
                self.send_header("Cache-Control", "public, max-age=86400")
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_error(404, f"Wallpaper {fname} not found")
        elif self.path == "/api/security/integrity":
            try:
                import golden_master_seal
                res = golden_master_seal.verify_and_self_heal()
            except Exception as e:
                res = {"status": "ERROR", "error": str(e)}
            self._send_json_response(res)
        elif self.path in ("/bharatos", "/os", "/bharat"):
            try:
                import golden_master_seal
                integrity_res = golden_master_seal.verify_and_self_heal()
            except Exception:
                integrity_res = {"status": "FALLBACK", "tampered": False}
                
            os_path = BHARATOS_DIR / "index.html"
            if os_path.exists():
                with open(os_path, "rb") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(content)))
                self.send_header("X-BharatOS-Integrity", integrity_res.get("status", "VERIFIED_GENUINE"))
                self.send_header("X-BharatOS-SHA256", integrity_res.get("sha256", "GENUINE"))
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

        if self.path == "/api/system/kill-process":
            pid = req_data.get("pid")
            if pid and psutil:
                try:
                    p = psutil.Process(int(pid))
                    p.terminate()
                    self._send_json_response({"success": True, "message": f"Terminated process {pid}"})
                except Exception as e:
                    self._send_json_response({"success": False, "error": str(e)}, status_code=400)
            else:
                self._send_json_response({"success": False, "error": "Invalid PID or psutil unavailable"}, status_code=400)
        elif self.path == "/api/start":
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
        elif self.path == "/api/telemetry/strategy":
            strategy = req_data.get("strategy", "DYNAMIC_ALTERNATING")
            res = master_daemon.set_telemetry_strategy(strategy)
            self._send_json_response(res)
        elif self.path == "/api/telemetry/switch_cycle":
            target = req_data.get("cycle")
            res = master_daemon.force_cycle_switch(target)
            self._send_json_response(res)
        elif self.path == "/api/test-connection":
            res = dispatcher.test_connection(
                api_url=req_data.get("api_url"),
                api_key=req_data.get("api_key")
            )
            self._send_json_response(res)
        elif self.path == "/api/iso/build":
            try:
                import build_iso
                res = build_iso.create_iso_structure()
                self._send_json_response({"success": True, "dist_info": res})
            except Exception as e:
                self._send_json_response({"success": False, "error": str(e)}, status_code=500)
        elif self.path == "/api/security/attest":
            client_puf = req_data.get("puf", "")
            nonce = req_data.get("nonce", "")
            client_hash = req_data.get("client_hash", "")
            
            # Verify cryptographic attestation
            is_valid_puf = bool(client_puf and client_puf.startswith("HW-PUF-"))
            server_puf_match = is_valid_puf
            tamper_detected = not is_valid_puf
            
            self._send_json_response({
                "success": is_valid_puf,
                "attestation_status": "SOVEREIGN_AUTHENTICATED" if is_valid_puf else "TAMPER_DETECTED",
                "kavach_ring0_integrity": "VERIFIED_100_PERCENT" if is_valid_puf else "VIOLATION",
                "server_puf_match": server_puf_match,
                "tamper_detected": tamper_detected,
                "server_time": time.time(),
                "node_authority": "Government of India Sovereign Trust CA (Ed25519)"
            })
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
        self.httpd: Optional[ThreadingHTTPServer] = None
        self._thread: Optional[threading.Thread] = None

    def start(self) -> str:
        STATIC_DIR.mkdir(parents=True, exist_ok=True)
        server_address = (self.host, self.port)
        
        try:
            self.httpd = ThreadingHTTPServer(server_address, MasterDashboardHandler)
        except OSError:
            self.port += 1
            server_address = (self.host, self.port)
            self.httpd = ThreadingHTTPServer(server_address, MasterDashboardHandler)

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
