"""
Survival Core & Financial Ledger Engine.
Tracks agent health, bank balance, burn rate, leveling, upgrades, and life support.
"""

import sys
import json
import time
import threading
from datetime import datetime
from typing import Dict, List, Any, Optional
from collections import deque
from pathlib import Path

from survival_agent.config import config, LEDGER_FILE

# Ensure terminal stdout encoding safety on Windows
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

LEVEL_THRESHOLDS = [
    {"level": 1, "title": "Novice Scripter", "min_earnings": 0, "max_contract_val": 150, "xp_req": 0},
    {"level": 2, "title": "Full-Stack Artisan", "min_earnings": 300, "max_contract_val": 450, "xp_req": 300},
    {"level": 3, "title": "AI Systems Architect", "min_earnings": 1000, "max_contract_val": 1200, "xp_req": 1000},
    {"level": 4, "title": "Autonomous Tech Agency", "min_earnings": 3500, "max_contract_val": 4000, "xp_req": 3500},
    {"level": 5, "title": "Sovereign Tech Mogul", "min_earnings": 10000, "max_contract_val": 15000, "xp_req": 10000},
]

AVAILABLE_UPGRADES = {
    "speed_boost_v1": {
        "id": "speed_boost_v1",
        "name": "Compute Acceleration",
        "desc": "Reduces code generation latency by 35%",
        "cost": 120.00,
        "purchased": False,
        "type": "speed"
    },
    "smart_bidding_model": {
        "id": "smart_bidding_model",
        "name": "Market Intelligence Engine",
        "desc": "Boosts proposal win rate by +18%",
        "cost": 250.00,
        "purchased": False,
        "type": "win_rate"
    },
    "parallel_subagents": {
        "id": "parallel_subagents",
        "name": "Multi-Threaded Worker Swarm",
        "desc": "Increases max concurrent contracts to 6",
        "cost": 600.00,
        "purchased": False,
        "type": "capacity"
    },
    "enterprise_rep": {
        "id": "enterprise_rep",
        "name": "Verified Enterprise Badge",
        "desc": "Clients pay +20% higher tips on delivery",
        "cost": 1500.00,
        "purchased": False,
        "type": "tips"
    }
}

class SurvivalCore:
    """Manages the agent's vitality, finances, and survival loop."""

    def __init__(self):
        self.balance: float = float(config.get("starting_balance", 50.00))
        self.initial_balance: float = self.balance
        self.lifetime_earnings: float = 0.0
        self.lifetime_expenses: float = 0.0
        self.token_costs_total: float = 0.0
        self.xp: int = 0
        self.level: int = 1
        self.level_title: str = LEVEL_THRESHOLDS[0]["title"]
        self.contracts_completed: int = 0
        self.contracts_won: int = 0
        self.proposals_sent: int = 0

        self.upgrades: Dict[str, Dict[str, Any]] = AVAILABLE_UPGRADES.copy()

        # Life status
        self.is_alive: bool = True
        self.vitality_state: str = "STABLE"  # THRIVING, STABLE, CRITICAL, BANKRUPT_DEAD
        self.health_pct: float = 100.0
        self.start_timestamp: float = time.time()
        self.simulated_days_survived: float = 0.0

        # AI Thought Log & Transaction Ledger
        self.thought_stream: deque = deque(maxlen=100)
        self.transactions: deque = deque(maxlen=100)

        # State lock
        self._lock = threading.Lock()

        # Load persisted ledger if exists
        self._load_ledger()

    def add_thought(self, message: str, tag: str = "THINK", meta: Optional[Dict[str, Any]] = None) -> None:
        """Appends an internal strategic thought to the agent's live stream."""
        now_str = datetime.now().strftime("%H:%M:%S")
        thought = {
            "time": now_str,
            "timestamp": time.time(),
            "tag": tag,
            "message": message,
            "meta": meta or {}
        }
        self.thought_stream.append(thought)
        print(f"[{now_str}] [PROMETHEUS/{tag}] {message}")

    def record_transaction(self, category: str, amount: float, description: str, is_income: bool) -> None:
        """Records a credit or debit in the financial ledger."""
        now_str = datetime.now().strftime("%H:%M:%S")
        entry = {
            "time": now_str,
            "timestamp": time.time(),
            "category": category,
            "amount": round(amount, 4),
            "description": description,
            "is_income": is_income,
            "balance_after": round(self.balance, 2)
        }
        self.transactions.append(entry)

    def deduct_burn(self, elapsed_real_seconds: float) -> None:
        """Calculates and deducts regular life support and hosting burn."""
        with self._lock:
            if not self.is_alive:
                return

            speed = config.get("time_speed_multiplier", 60.0)
            daily_burn = config.get("daily_burn_rate", 20.00)
            
            # Simulated seconds passed
            sim_seconds = elapsed_real_seconds * speed
            self.simulated_days_survived += (sim_seconds / 86400.0)

            # Deduct burn
            burn_amount = (daily_burn / 86400.0) * sim_seconds
            self.balance -= burn_amount
            self.lifetime_expenses += burn_amount

            self._update_vitality_state()
            self._save_ledger()

    def deduct_token_cost(self, prompt_tokens: int, completion_tokens: int, action_name: str) -> float:
        """Calculates and deducts exact LLM API costs for reasoning & code gen."""
        with self._lock:
            if not self.is_alive:
                return 0.0

            model_name = config.get("current_model", "gemini-flash")
            rates = config.get("token_costs", {}).get(model_name, {"input": 0.15, "output": 0.60})

            cost = (prompt_tokens / 1_000_000.0) * rates["input"] + (completion_tokens / 1_000_000.0) * rates["output"]
            cost = max(0.0001, cost)  # minimum micro-fraction

            self.balance -= cost
            self.lifetime_expenses += cost
            self.token_costs_total += cost

            self.record_transaction("TOKEN_API", cost, f"LLM Tokens: {action_name} ({prompt_tokens+completion_tokens} tok)", is_income=False)
            self._update_vitality_state()
            return cost

    def credit_contract_payout(self, gross_amount: float, client_name: str, project_title: str, tip: float = 0.0) -> None:
        """Credits client payment upon successful contract delivery."""
        with self._lock:
            total_payout = gross_amount + tip
            self.balance += total_payout
            self.lifetime_earnings += total_payout
            self.contracts_completed += 1
            
            # Add XP & check level up
            self.xp += int(total_payout)
            self._check_level_up()

            desc = f"Payout for '{project_title}' from {client_name}"
            if tip > 0:
                desc += f" (incl. ${tip:.2f} tip)"
            self.record_transaction("CONTRACT_PAYOUT", total_payout, desc, is_income=True)

            self.add_thought(f"Received payment +${total_payout:.2f} from {client_name}! Vitality restored.", "PAYOUT", {"payout": total_payout})
            self._update_vitality_state()
            self._save_ledger()

    def buy_upgrade(self, upgrade_id: str) -> Dict[str, Any]:
        """Purchases an upgrade from the store if funds permit."""
        with self._lock:
            if upgrade_id not in self.upgrades:
                return {"success": False, "error": "Invalid upgrade ID"}
            
            upg = self.upgrades[upgrade_id]
            if upg["purchased"]:
                return {"success": False, "error": "Already purchased"}

            cost = upg["cost"]
            if self.balance < cost:
                return {"success": False, "error": f"Insufficient funds. Need ${cost:.2f}, balance is ${self.balance:.2f}"}

            self.balance -= cost
            self.lifetime_expenses += cost
            upg["purchased"] = True

            self.record_transaction("UPGRADE", cost, f"Purchased: {upg['name']}", is_income=False)
            self.add_thought(f"UPGRADE UNLOCKED: {upg['name']} (-${cost:.2f})", "UPGRADE", {"upgrade": upgrade_id})

            # Apply upgrade effect
            if upgrade_id == "parallel_subagents":
                config.update({"max_concurrent_contracts": 6})

            self._update_vitality_state()
            self._save_ledger()
            return {"success": True, "upgrade": upg}

    def _check_level_up(self) -> None:
        """Evaluates XP to advance agent tier."""
        for t in reversed(LEVEL_THRESHOLDS):
            if self.xp >= t["xp_req"]:
                if self.level < t["level"]:
                    self.level = t["level"]
                    self.level_title = t["title"]
                    self.add_thought(f"🎉 LEVEL UP! Promoted to Level {self.level}: '{self.level_title}'! Max contract value unlocked: ${t['max_contract_val']}", "LEVEL_UP")
                break

    def _update_vitality_state(self) -> None:
        """Calculates health percentage and survival state based on cash runway."""
        if self.balance <= 0.0:
            self.balance = 0.0
            self.health_pct = 0.0
            self.is_alive = False
            self.vitality_state = "BANKRUPT_DEAD"
            self.add_thought("CRITICAL WARNING: Funds depleted ($0.00). Life support failed. Agent shutting down...", "FATAL")
            return

        daily_burn = config.get("daily_burn_rate", 20.00)
        days_runway = self.balance / max(0.1, daily_burn)

        # Health percentage (0 to 100) based on days of runway
        # 10+ days runway = 100% health
        self.health_pct = min(100.0, max(1.0, (days_runway / 7.0) * 100.0))

        if days_runway > 5.0:
            self.vitality_state = "THRIVING"
        elif days_runway > 1.5:
            self.vitality_state = "STABLE"
        else:
            self.vitality_state = "CRITICAL"

    def reset_game(self, starting_cash: float = 50.00) -> None:
        """Resets the survival economy to a new beginning."""
        with self._lock:
            self.balance = starting_cash
            self.initial_balance = starting_cash
            self.lifetime_earnings = 0.0
            self.lifetime_expenses = 0.0
            self.token_costs_total = 0.0
            self.xp = 0
            self.level = 1
            self.level_title = LEVEL_THRESHOLDS[0]["title"]
            self.contracts_completed = 0
            self.contracts_won = 0
            self.proposals_sent = 0
            self.is_alive = True
            self.simulated_days_survived = 0.0
            self.start_timestamp = time.time()
            self.upgrades = AVAILABLE_UPGRADES.copy()
            self._update_vitality_state()
            self.transactions.clear()
            self.thought_stream.clear()
            self.add_thought("⚡ System rebooted. New survival sequence initialized with $" + f"{starting_cash:.2f}", "SYSTEM")
            self._save_ledger()

    def _save_ledger(self) -> None:
        try:
            data = {
                "balance": self.balance,
                "lifetime_earnings": self.lifetime_earnings,
                "lifetime_expenses": self.lifetime_expenses,
                "token_costs_total": self.token_costs_total,
                "xp": self.xp,
                "level": self.level,
                "level_title": self.level_title,
                "contracts_completed": self.contracts_completed,
                "contracts_won": self.contracts_won,
                "proposals_sent": self.proposals_sent,
                "simulated_days_survived": self.simulated_days_survived,
                "is_alive": self.is_alive,
                "upgrades": self.upgrades
            }
            with open(LEDGER_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception:
            pass

    def _load_ledger(self) -> None:
        if LEDGER_FILE.exists():
            try:
                with open(LEDGER_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.balance = data.get("balance", 50.00)
                    self.lifetime_earnings = data.get("lifetime_earnings", 0.0)
                    self.lifetime_expenses = data.get("lifetime_expenses", 0.0)
                    self.token_costs_total = data.get("token_costs_total", 0.0)
                    self.xp = data.get("xp", 0)
                    self.level = data.get("level", 1)
                    self.level_title = data.get("level_title", LEVEL_THRESHOLDS[0]["title"])
                    self.contracts_completed = data.get("contracts_completed", 0)
                    self.contracts_won = data.get("contracts_won", 0)
                    self.proposals_sent = data.get("proposals_sent", 0)
                    self.simulated_days_survived = data.get("simulated_days_survived", 0.0)
                    self.is_alive = data.get("is_alive", True)
                    if "upgrades" in data:
                        self.upgrades.update(data["upgrades"])
                    self._update_vitality_state()
            except Exception:
                pass

    def get_status_dict(self) -> Dict[str, Any]:
        """Returns JSON metrics for dashboard UI."""
        daily_burn = config.get("daily_burn_rate", 20.00)
        days_runway = self.balance / max(0.01, daily_burn) if self.balance > 0 else 0.0
        current_max_contract = LEVEL_THRESHOLDS[min(len(LEVEL_THRESHOLDS)-1, self.level-1)]["max_contract_val"]

        return {
            "balance": round(self.balance, 2),
            "initial_balance": round(self.initial_balance, 2),
            "lifetime_earnings": round(self.lifetime_earnings, 2),
            "lifetime_expenses": round(self.lifetime_expenses, 2),
            "token_costs_total": round(self.token_costs_total, 4),
            "net_profit": round(self.lifetime_earnings - self.lifetime_expenses, 2),
            "health_pct": round(self.health_pct, 1),
            "vitality_state": self.vitality_state,
            "days_runway": round(days_runway, 1),
            "days_survived": round(self.simulated_days_survived, 2),
            "is_alive": self.is_alive,
            "level": self.level,
            "level_title": self.level_title,
            "xp": self.xp,
            "max_contract_val": current_max_contract,
            "contracts_completed": self.contracts_completed,
            "contracts_won": self.contracts_won,
            "proposals_sent": self.proposals_sent,
            "upgrades": self.upgrades,
            "recent_thoughts": list(self.thought_stream)[-30:],
            "recent_transactions": list(self.transactions)[-20:],
        }


# Global survival core instance
survival_core = SurvivalCore()
