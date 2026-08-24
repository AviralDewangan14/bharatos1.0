"""
Hackatime 24/7 Service Daemon.
Coordinates the simulation engine, cloud heartbeat dispatcher, physical workspace writer,
and Windows keep-awake states to maintain uninterrupted coding metrics.
"""

import sys
import time
import ctypes
import random
import threading
from datetime import datetime, date
from typing import Dict, Any, List, Optional
from collections import deque

from config import config
from simulation_engine import simulation_engine
from heartbeat_dispatcher import dispatcher
from workspace_writer import workspace_writer

# Ensure Windows terminal doesn't crash on unicode/emojis
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Windows sleep prevention constants
ES_CONTINUOUS = 0x80000000
ES_SYSTEM_REQUIRED = 0x00000001
ES_DISPLAY_REQUIRED = 0x00000002

class ServiceDaemon:
    """24/7 Background Service Daemon orchestrating Hackatime tracking."""

    def __init__(self):
        self.is_running: bool = False
        self.is_paused: bool = False
        self._thread: Optional[threading.Thread] = None
        self._stop_event = threading.Event()
        self._pulse_now_event = threading.Event()

        # Stats & Metrics
        self.start_time: float = time.time()
        self.total_pulses: int = 0
        self.successful_pulses: int = 0
        self.failed_pulses: int = 0
        self.tracked_seconds_today: float = 0.0
        self.last_pulse_timestamp: float = 0.0
        self.next_pulse_timestamp: float = 0.0

        self.current_project: str = "arcade-solaris-engine"
        self.current_language: str = "Rust"
        self.current_entity: str = "src/engine/spatial_grid.rs"
        self.current_lines: int = 0
        self.current_code_snippet: str = ""

        # Language and Project distribution counters
        self.language_stats: Dict[str, int] = {}
        self.project_stats: Dict[str, int] = {}

        # Rolling activity log (last 100 entries)
        self.activity_log: deque = deque(maxlen=100)

        # Windows power state lock
        self._power_lock_acquired = False

    def log(self, message: str, level: str = "INFO", meta: Optional[Dict[str, Any]] = None) -> None:
        """Appends a timestamped entry to the in-memory activity log."""
        timestamp_str = datetime.now().strftime("%H:%M:%S")
        entry = {
            "time": timestamp_str,
            "timestamp": time.time(),
            "level": level,
            "message": message,
            "meta": meta or {}
        }
        self.activity_log.append(entry)
        # Also print to terminal
        print(f"[{timestamp_str}] [{level}] {message}")

    def _set_windows_sleep_prevention(self, enable: bool) -> None:
        """Prevents Windows from automatically sleeping if configured."""
        if sys.platform == "win32":
            try:
                if enable:
                    # ES_CONTINUOUS | ES_SYSTEM_REQUIRED
                    ctypes.windll.kernel32.SetThreadExecutionState(ES_CONTINUOUS | ES_SYSTEM_REQUIRED)
                    self._power_lock_acquired = True
                    self.log("Windows 24/7 Sleep Prevention Activated (System will remain awake)", "SYSTEM")
                else:
                    ctypes.windll.kernel32.SetThreadExecutionState(ES_CONTINUOUS)
                    self._power_lock_acquired = False
                    self.log("Windows Sleep Prevention Released", "SYSTEM")
            except Exception as err:
                self.log(f"Warning: Failed to set Windows execution state: {err}", "WARN")

    def start(self) -> None:
        """Starts the 24/7 daemon loop in a background thread."""
        if self.is_running:
            return

        self.is_running = True
        self.is_paused = False
        self._stop_event.clear()
        self.start_time = time.time()

        if config.get("prevent_system_sleep", True):
            self._set_windows_sleep_prevention(True)

        self._thread = threading.Thread(target=self._worker_loop, daemon=True, name="HackatimeDaemon")
        self._thread.start()
        self.log("24/7 Hackatime Coding Bot started successfully", "SYSTEM")

    def pause(self) -> None:
        """Pauses pulse generation."""
        self.is_paused = True
        self.log("Bot paused by user", "STATUS")

    def resume(self) -> None:
        """Resumes pulse generation."""
        self.is_paused = False
        self.log("Bot resumed by user", "STATUS")

    def trigger_immediate_pulse(self) -> None:
        """Forces an immediate heartbeat pulse cycle without waiting for timer."""
        self._pulse_now_event.set()

    def stop(self) -> None:
        """Stops the daemon gracefully."""
        self.is_running = False
        self._stop_event.set()
        self._pulse_now_event.set()
        self._set_windows_sleep_prevention(False)
        self.log("24/7 Hackatime Coding Bot stopped", "SYSTEM")

    def _execute_single_pulse(self) -> Dict[str, Any]:
        """Executes a single simulation, write, and cloud dispatch pulse."""
        # 1. Generate realistic code progression
        sim_data = simulation_engine.get_next_heartbeat_payload()
        payload = sim_data["payload"]
        file_content = sim_data["file_content"]
        project = sim_data["project"]
        language = sim_data["language"]
        entity = sim_data["entity"]

        self.current_project = project
        self.current_language = language
        self.current_entity = entity
        self.current_lines = payload.get("lines", 0)
        self.current_code_snippet = file_content[:600]

        # Update distribution counters
        self.language_stats[language] = self.language_stats.get(language, 0) + 1
        self.project_stats[project] = self.project_stats.get(project, 0) + 1
        self.total_pulses += 1

        # 2. Physical File I/O (if enabled)
        if config.get("physical_workspace_mode", True):
            workspace_writer.write_simulated_file(project, entity, file_content)

        # 3. Cloud API Dispatch (if enabled)
        dispatch_result: Dict[str, Any] = {"success": True, "skipped": True}
        if config.get("ghost_mode_api", True):
            dispatch_result = dispatcher.dispatch_heartbeat(payload)
            if dispatch_result.get("success"):
                self.successful_pulses += 1
                status_code = dispatch_result.get("status_code", 200)
                self.log(
                    f"Pulse Sent -> {project}/{entity} [{language}] (HTTP {status_code}) - Save: {payload.get('is_write')}",
                    "PULSE",
                    {"project": project, "entity": entity, "language": language, "status": status_code}
                )
            else:
                self.failed_pulses += 1
                err_msg = dispatch_result.get("error", "Unknown error")
                self.log(f"Heartbeat Dispatch Failed: {err_msg}", "ERROR")
        else:
            self.successful_pulses += 1
            self.log(f"Physical Edit -> {project}/{entity} [{language}] (Local Mode)", "LOCAL")

        self.last_pulse_timestamp = time.time()
        return dispatch_result

    def _worker_loop(self) -> None:
        """Main 24/7 background execution loop."""
        while not self._stop_event.is_set():
            if self.is_paused:
                time.sleep(1)
                continue

            # Execute pulse
            try:
                self._execute_single_pulse()
            except Exception as err:
                self.log(f"Unexpected error in pulse loop: {err}", "ERROR")

            # Calculate randomized human-like interval (e.g. 45s to 85s)
            p_min = config.get("pulse_interval_min", 45)
            p_max = config.get("pulse_interval_max", 85)
            jitter_seconds = random.uniform(p_min, p_max)

            self.next_pulse_timestamp = time.time() + jitter_seconds

            # Wait for next interval or immediate pulse trigger
            triggered = self._pulse_now_event.wait(timeout=jitter_seconds)
            if triggered:
                self._pulse_now_event.clear()

    def get_status_snapshot(self) -> Dict[str, Any]:
        """Returns a complete JSON snapshot of the bot's current status and metrics."""
        now = time.time()
        uptime_seconds = int(now - self.start_time) if self.is_running else 0

        # Calculate estimated total coding time accumulated (assuming ~60-80s per pulse)
        estimated_coding_seconds = self.successful_pulses * 70

        return {
            "is_running": self.is_running,
            "is_paused": self.is_paused,
            "uptime_seconds": uptime_seconds,
            "total_pulses": self.total_pulses,
            "successful_pulses": self.successful_pulses,
            "failed_pulses": self.failed_pulses,
            "estimated_coding_seconds": estimated_coding_seconds,
            "last_pulse_timestamp": self.last_pulse_timestamp,
            "next_pulse_timestamp": self.next_pulse_timestamp,
            "seconds_until_next_pulse": max(0, int(self.next_pulse_timestamp - now)) if self.is_running and not self.is_paused else 0,
            "current_project": self.current_project,
            "current_language": self.current_language,
            "current_entity": self.current_entity,
            "current_lines": self.current_lines,
            "current_code_snippet": self.current_code_snippet,
            "language_stats": self.language_stats,
            "project_stats": self.project_stats,
            "recent_logs": list(self.activity_log)[-40:],
            "config": {
                "api_url": config.get("api_url"),
                "has_api_key": bool(config.get("api_key")),
                "pulse_interval_min": config.get("pulse_interval_min"),
                "pulse_interval_max": config.get("pulse_interval_max"),
                "ghost_mode_api": config.get("ghost_mode_api"),
                "physical_workspace_mode": config.get("physical_workspace_mode"),
                "prevent_system_sleep": config.get("prevent_system_sleep"),
            },
            "windows_power_locked": self._power_lock_acquired
        }


# Global daemon instance
daemon = ServiceDaemon()
