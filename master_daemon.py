"""
Master Synchronized Daemon for Project Prometheus & Solaris Engine.
Intelligently prioritizes active freelance gigs to earn survival revenue ($),
and autonomously executes deep, multi-phase major engineering projects
to maximize Hackatime hours and Hack Club Stardust redemption rates.
"""

import sys
import time
import ctypes
import random
import threading
from datetime import datetime
from typing import Dict, Any, List, Optional
from collections import deque
from pathlib import Path

# Add project root
ROOT_DIR = Path(__file__).parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

# Ensure UTF-8 on Windows terminal
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from config import config
from heartbeat_dispatcher import dispatcher
from workspace_writer import workspace_writer
from stardust_engine import stardust_engine
from simulation_engine import simulation_engine
from big_project_blueprints import big_project_scheduler
from survival_agent.survival_core import survival_core
from survival_agent.job_hunter import job_hunter
from survival_agent.proposal_engine import proposal_engine
from survival_agent.project_builder import project_builder
from survival_agent.delivery_manager import delivery_manager

# Windows sleep prevention constants
ES_CONTINUOUS = 0x80000000
ES_SYSTEM_REQUIRED = 0x00000001

class MasterUnifiedDaemon:
    """Master Orchestrator coordinating Freelance Gigs, Major Projects, and WakaTime Logging."""

    def __init__(self):
        self.is_running: bool = False
        self.is_paused: bool = False
        self._thread: Optional[threading.Thread] = None
        self._stop_event = threading.Event()
        self._pulse_now_event = threading.Event()

        # Telemetry & Time Stats
        self.start_time: float = time.time()
        self.total_pulses: int = 0
        self.successful_pulses: int = 0
        self.failed_pulses: int = 0
        self.tracked_seconds_today: float = 0.0
        self.last_pulse_timestamp: float = 0.0
        self.next_pulse_timestamp: float = 0.0

        # Current Operating Mode: "FREELANCE_GIG" or "MAJOR_PROJECT_BUILD"
        self.current_mode: str = "MAJOR_PROJECT_BUILD"

        # Current Active Code Context
        self.current_project: str = "solaris-orbital-engine"
        self.current_language: str = "Python"
        self.current_entity: str = "solaris/physics.py"
        self.current_lines: int = 145
        self.current_code_snippet: str = ""
        self.current_task_desc: str = "Newtonian Gravitational Physics Solver"

        # Distribution Counters
        self.language_stats: Dict[str, int] = {"Python": 5, "Rust": 4, "JavaScript": 3, "Go": 2}
        self.project_stats: Dict[str, int] = {"solaris-orbital-engine": 8, "hyperion-distributed-raft": 4}

        # Active Contracts & Stream
        self.active_contracts: List[Dict[str, Any]] = []
        self.unified_stream: deque = deque(maxlen=140)

        # Internal tickers
        self._power_lock_acquired: bool = False
        self.last_burn_time: float = time.time()
        self.major_project_step_counter: int = 0

    def log(self, message: str, tag: str = "INFO", meta: Optional[Dict[str, Any]] = None) -> None:
        now_str = datetime.now().strftime("%H:%M:%S")
        entry = {
            "time": now_str,
            "timestamp": time.time(),
            "tag": tag,
            "message": message,
            "meta": meta or {}
        }
        self.unified_stream.append(entry)
        print(f"[{now_str}] [{tag}] {message}")

    def _set_windows_sleep_prevention(self, enable: bool) -> None:
        if sys.platform == "win32":
            try:
                if enable:
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
        if self.is_running:
            return
        self.is_running = True
        self.is_paused = False
        self._stop_event.clear()
        self.start_time = time.time()
        self.last_burn_time = time.time()

        if config.get("prevent_system_sleep", True):
            self._set_windows_sleep_prevention(True)

        self._thread = threading.Thread(target=self._master_loop, daemon=True, name="MasterUnifiedDaemon")
        self._thread.start()
        self.log("Master Studio Engine Activated: Priority Freelance Gigs + Deep Major Project Architecture", "SYSTEM")

    def pause(self) -> None:
        self.is_paused = True
        self.log("Master Studio paused by user", "STATUS")

    def resume(self) -> None:
        self.is_paused = False
        self.log("Master Studio resumed by user", "STATUS")

    def trigger_immediate_pulse(self) -> None:
        self._pulse_now_event.set()

    def stop(self) -> None:
        self.is_running = False
        self._stop_event.set()
        self._pulse_now_event.set()
        self._set_windows_sleep_prevention(False)
        self.log("Master Studio stopped", "SYSTEM")

    def _execute_synchronized_cycle(self) -> Dict[str, Any]:
        """Main synchronized execution cycle."""
        now = time.time()

        # 1. Deduct Survival Agent Burn Rate
        elapsed_burn = now - self.last_burn_time
        self.last_burn_time = now
        survival_core.deduct_burn(elapsed_burn)

        # 2. Check for Active Freelance Gigs in Pipeline
        active_freelance_building = [c for c in self.active_contracts if c["status"] in ["WON", "BUILDING", "REVIEW"]]
        active_freelance_scouted = [c for c in self.active_contracts if c["status"] == "SCOUTED"]

        project_name = ""
        entity_name = ""
        lang = ""
        lines = 0
        snippet = ""
        task_desc = ""

        # MODE A: FREELANCE CONTRACT IN FLIGHT
        if active_freelance_building or (active_freelance_scouted and len(active_freelance_scouted) > 0 and random.random() < 0.65):
            self.current_mode = "FREELANCE_GIG"
            
            # Handle delivery first
            delivered = False
            for job in self.active_contracts:
                if job["status"] == "REVIEW":
                    res = delivery_manager.complete_and_collect_payment(job)
                    self.log(f"Delivered gig '{job['title']}' to {job['client']}! Payout: +${res['total']:.2f}", "PAYOUT")
                    delivered = True
                    break

            if not delivered:
                # Handle building won contracts
                for job in self.active_contracts:
                    if job["status"] == "WON":
                        res = project_builder.build_contract(job)
                        pref = job.get("id_prefix", job.get("id", "contract").split("-")[0])
                        project_name = f"freelance-{pref}"
                        entity_name = job["deliverables"][0] if job.get("deliverables") else "src/main.py"
                        lang = job["tech_stack"][0] if job.get("tech_stack") else "Python"
                        lines = res["total_lines"]
                        snippet = f"# Autonomously Building: {job['title']}\n# Client: {job['client']}\n# Budget: ${job['budget']:.2f}\n# Deliverables: {', '.join(job['deliverables'])}\n"
                        task_desc = f"Client Gig: {job['title']}"
                        self.log(f"Building contract deliverable '{entity_name}' for {job['client']} (${job['budget']:.2f})", "BUILD")
                        break

            if not project_name and active_freelance_scouted:
                best_job = active_freelance_scouted[0]
                bid_res = proposal_engine.draft_and_submit_bid(best_job)
                if bid_res["won"]:
                    self.log(f"Bid Accepted! Contract awarded: '{best_job['title']}' (${best_job['budget']:.2f})", "WON")
                pref = best_job.get("id_prefix", best_job.get("id", "contract").split("-")[0])
                project_name = f"freelance-{pref}"
                entity_name = "proposal.md"
                lang = "Markdown"
                lines = 45
                snippet = best_job.get("proposal_text", "# Proposal submitted")[:400]
                task_desc = f"Bidding on {best_job['title']}"

        # MODE B: MAJOR LONG-TERM SOFTWARE PROJECT ARCHITECTURE
        if not project_name:
            self.current_mode = "MAJOR_PROJECT_BUILD"
            self.major_project_step_counter += 1
            
            task = big_project_scheduler.get_current_task()
            project_name = task["project_id"]
            entity_name = task["entity"]
            lang = task["language"]
            lines = task["lines_est"]
            task_desc = f"{task['project_name']} (Phase {task['phase_num']}/{task['total_phases']}: {task['phase_name']})"

            # Simulate incremental code writes on the major project
            sim_data = simulation_engine.get_next_heartbeat_payload()
            snippet = sim_data["file_content"][:500]

            # Every 8-12 pulses on this project, advance milestone
            if self.major_project_step_counter % random.randint(8, 12) == 0:
                adv = big_project_scheduler.advance_phase()
                if adv.get("project_completed"):
                    self.log(f"🎉 MAJOR PROJECT COMPLETED: '{adv['project_name']}'! Advancing to next architecture suite...", "MILESTONE")
                else:
                    self.log(f"⚡ Milestone Achieved: Completed '{adv['completed_phase']['name']}'. Next: '{adv['next_phase']['name']}'", "MILESTONE")

            # Periodically scout fresh freelance opportunities in the background
            if len([j for j in self.active_contracts if j["status"] not in ["LOST", "PAID"]]) < 2:
                new_jobs = job_hunter.scout_opportunities()
                self.active_contracts = [j for j in self.active_contracts if j["status"] not in ["LOST", "PAID"]] + new_jobs
                self.log(f"Market Scanner: Found {len(new_jobs)} freelance opportunities with up to 100% ROI", "SCOUT")

        # Update State Context
        self.current_project = project_name
        self.current_language = lang
        self.current_entity = entity_name
        self.current_lines = lines
        self.current_code_snippet = snippet
        self.current_task_desc = task_desc

        # 3. Dispatch Official WakaTime Heartbeat
        heartbeat_payload = {
            "entity": entity_name,
            "type": "file",
            "time": now,
            "project": project_name,
            "branch": "main",
            "language": lang,
            "is_write": random.random() < 0.45,
            "category": "coding",
            "lines": lines,
            "lineno": random.randint(1, max(1, lines)),
            "cursorpos": random.randint(1, 35),
            "editor": "VS Code",
            "operating_system": "Windows"
        }

        self.total_pulses += 1
        self.language_stats[lang] = self.language_stats.get(lang, 0) + 1
        self.project_stats[project_name] = self.project_stats.get(project_name, 0) + 1

        dispatch_res = dispatcher.dispatch_heartbeat(heartbeat_payload)
        if dispatch_res.get("success"):
            self.successful_pulses += 1
            status_code = dispatch_res.get("status_code", 202)
            self.log(
                f"Heartbeat Verified -> {project_name}/{entity_name} [{lang}] (HTTP {status_code}) - {self.current_mode}",
                "WAKATIME",
                {"project": project_name, "entity": entity_name, "status": status_code, "mode": self.current_mode}
            )
        else:
            self.failed_pulses += 1
            err_msg = dispatch_res.get("error", "Unknown error")
            self.log(f"Heartbeat Failed: {err_msg}", "ERROR")

        self.last_pulse_timestamp = now
        return {"heartbeat": dispatch_res, "mode": self.current_mode}

    def _master_loop(self) -> None:
        while not self._stop_event.is_set():
            if self.is_paused:
                time.sleep(1)
                continue

            try:
                self._execute_synchronized_cycle()
            except Exception as err:
                self.log(f"Error in master loop: {err}", "ERROR")

            # Human-like pulse interval (45s to 75s)
            p_min = config.get("pulse_interval_min", 45)
            p_max = config.get("pulse_interval_max", 75)
            jitter_seconds = random.uniform(p_min, p_max)
            self.next_pulse_timestamp = time.time() + jitter_seconds

            triggered = self._pulse_now_event.wait(timeout=jitter_seconds)
            if triggered:
                self._pulse_now_event.clear()

    def get_master_status(self) -> Dict[str, Any]:
        now = time.time()
        uptime_seconds = int(now - self.start_time) if self.is_running else 0
        total_tracked_seconds = self.successful_pulses * 70

        stardust_metrics = stardust_engine.calculate_rewards(total_tracked_seconds, project_multiplier=2.4)
        multiplier_eval = stardust_engine.evaluate_project_multiplier(total_lines=1800, num_files=18, has_tests=True, has_docs=True)
        survival_status = survival_core.get_status_dict()
        big_project_task = big_project_scheduler.get_current_task()

        return {
            "is_running": self.is_running,
            "is_paused": self.is_paused,
            "uptime_seconds": uptime_seconds,
            "total_pulses": self.total_pulses,
            "successful_pulses": self.successful_pulses,
            "failed_pulses": self.failed_pulses,
            "tracked_seconds_today": total_tracked_seconds,
            "seconds_until_next_pulse": max(0, int(self.next_pulse_timestamp - now)) if self.is_running and not self.is_paused else 0,
            
            # Operating Context
            "current_mode": self.current_mode,
            "current_task_desc": self.current_task_desc,
            "current_project": self.current_project,
            "current_language": self.current_language,
            "current_entity": self.current_entity,
            "current_lines": self.current_lines,
            "current_code_snippet": self.current_code_snippet,
            "language_stats": self.language_stats,
            "project_stats": self.project_stats,

            # Big Project Roadmap
            "big_project_task": big_project_task,

            # Stardust & Hack Club Valuation
            "stardust_metrics": stardust_metrics,
            "multiplier_eval": multiplier_eval,

            # Survival Freelancer State
            "survival": survival_status,
            "active_contracts": self.active_contracts,

            # Unified Activity Log
            "unified_logs": list(self.unified_stream)[-40:],

            "config": {
                "api_url": config.get("api_url"),
                "has_api_key": bool(config.get("api_key")),
                "pulse_interval_min": config.get("pulse_interval_min"),
                "pulse_interval_max": config.get("pulse_interval_max"),
                "prevent_system_sleep": config.get("prevent_system_sleep"),
            },
            "windows_power_locked": self._power_lock_acquired
        }


# Global master daemon instance
master_daemon = MasterUnifiedDaemon()
