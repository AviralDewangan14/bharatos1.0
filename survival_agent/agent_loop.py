"""
Autonomous Agent Survival Loop.
Orchestrates life-support clock, opportunity hunting, bidding, building, and revenue collection.
"""

import time
import threading
from typing import Dict, Any, List, Optional

from survival_agent.config import config
from survival_agent.survival_core import survival_core
from survival_agent.job_hunter import job_hunter
from survival_agent.proposal_engine import proposal_engine
from survival_agent.project_builder import project_builder
from survival_agent.delivery_manager import delivery_manager

class AutonomousAgentLoop:
    """Continuous 24/7 autonomous loop driving the survival agent."""

    def __init__(self):
        self.is_running: bool = False
        self.is_paused: bool = False
        self._thread: Optional[threading.Thread] = None
        self._stop_event = threading.Event()
        self.active_contracts: List[Dict[str, Any]] = []
        self.last_tick_time: float = time.time()

    def start(self) -> None:
        """Starts the autonomous life loop."""
        if self.is_running:
            return
        self.is_running = True
        self.is_paused = False
        self._stop_event.clear()
        self.last_tick_time = time.time()
        self._thread = threading.Thread(target=self._run_loop, daemon=True, name="PrometheusSurvivalLoop")
        self._thread.start()
        survival_core.add_thought("⚡ Autonomous Survival Agent loop activated. Initiating freelance job scans...", "SYSTEM")

    def pause(self) -> None:
        self.is_paused = True
        survival_core.add_thought("Agent operations paused by user.", "STATUS")

    def resume(self) -> None:
        self.is_paused = False
        survival_core.add_thought("Agent operations resumed.", "STATUS")

    def stop(self) -> None:
        self.is_running = False
        self._stop_event.set()

    def step_once(self) -> Dict[str, Any]:
        """Performs a single discrete step in the survival lifecycle."""
        if not survival_core.is_alive:
            return {"status": "DEAD"}

        # 1. Deduct life support burn
        now = time.time()
        elapsed = now - self.last_tick_time
        self.last_tick_time = now
        survival_core.deduct_burn(elapsed)

        if not survival_core.is_alive:
            return {"status": "DEAD"}

        # 2. Check for contracts under review -> Deliver & collect payment
        for job in self.active_contracts:
            if job["status"] == "REVIEW":
                res = delivery_manager.complete_and_collect_payment(job)
                return {"action": "DELIVERED", "job": job, "payout": res["total"]}

        # 3. Check for won contracts -> Build code
        for job in self.active_contracts:
            if job["status"] == "WON":
                res = project_builder.build_contract(job)
                return {"action": "BUILT", "job": job, "lines": res["total_lines"]}

        # 4. Check for scouted jobs -> Bid on best opportunity
        max_concurrent = config.get("max_concurrent_contracts", 3)
        ongoing_count = len([j for j in self.active_contracts if j["status"] in ["WON", "BUILDING", "REVIEW"]])
        
        if ongoing_count < max_concurrent:
            best_job = job_hunter.select_best_contract_to_bid()
            if best_job:
                bid_res = proposal_engine.draft_and_submit_bid(best_job)
                if best_job not in self.active_contracts:
                    self.active_contracts.append(best_job)
                return {"action": "BID", "job": best_job, "won": bid_res["won"]}

        # 5. If no active viable jobs, scout fresh batch
        if len([j for j in self.active_contracts if j["status"] in ["SCOUTED", "WON", "BUILDING", "REVIEW"]]) < 2:
            new_jobs = job_hunter.scout_opportunities()
            self.active_contracts = [j for j in self.active_contracts if j["status"] not in ["LOST", "PAID"]] + new_jobs
            return {"action": "SCOUTED", "count": len(new_jobs)}

        # 6. Strategic Upgrade Automation: If cash is abundant (> $250), buy next unpurchased upgrade
        if survival_core.balance > 250.0:
            for upg_id, upg_data in survival_core.upgrades.items():
                if not upg_data["purchased"] and survival_core.balance > (upg_data["cost"] + 80.0): # leave runway
                    buy_res = survival_core.buy_upgrade(upg_id)
                    if buy_res.get("success"):
                        return {"action": "UPGRADE", "upgrade": upg_id}

        return {"action": "IDLE"}

    def _run_loop(self) -> None:
        """Background continuous execution loop."""
        while not self._stop_event.is_set():
            if self.is_paused or not survival_core.is_alive:
                time.sleep(1)
                continue

            try:
                self.step_once()
            except Exception as err:
                survival_core.add_thought(f"Unexpected error in agent loop: {err}", "ERROR")

            # Tick delay (2 to 4 seconds)
            time.sleep(config.get("burn_tick_seconds", 3.0))


# Global agent loop instance
agent_loop = AutonomousAgentLoop()
