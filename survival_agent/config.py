"""
Configuration for Project Prometheus - Autonomous Survival Freelancer AI Agent.
"""

import os
from pathlib import Path
from typing import Dict, Any

BASE_DIR = Path(__file__).parent
COMPLETED_CONTRACTS_DIR = BASE_DIR / "completed_contracts"
LEDGER_FILE = BASE_DIR / "ledger.json"

DEFAULT_SETTINGS: Dict[str, Any] = {
    # Economy & Survival Parameters
    "starting_balance": 50.00,        # Initial cash reserve in USD
    "daily_burn_rate": 20.00,         # Base daily expenses (hosting $5 + rent/living $15)
    "burn_tick_seconds": 3.0,         # How often burn is calculated
    "time_speed_multiplier": 60.0,    # 1 real sec = 60 simulated seconds (1 min)

    # Token Cost Simulation (per million tokens)
    "token_costs": {
        "gpt-4o-mini": {"input": 0.15, "output": 0.60},
        "gemini-flash": {"input": 0.075, "output": 0.30},
        "claude-sonnet": {"input": 3.00, "output": 15.00}
    },
    "current_model": "gemini-flash",

    # AI Freelancer Strategy
    "min_profit_margin_pct": 75.0,    # Only bid if expected ROI > 75%
    "max_concurrent_contracts": 3,
    "auto_pilot_enabled": True,       # Continuous autonomous hunting & building loop
    "bid_win_rate_base": 0.72,        # Base probability of winning a competitive bid

    # Server settings
    "dashboard_port": 7890,
    "dashboard_host": "127.0.0.1",
}

class SurvivalConfig:
    def __init__(self):
        self.settings = DEFAULT_SETTINGS.copy()
        COMPLETED_CONTRACTS_DIR.mkdir(parents=True, exist_ok=True)

    def get(self, key: str, default: Any = None) -> Any:
        return self.settings.get(key, default)

    def update(self, key_values: Dict[str, Any]) -> None:
        self.settings.update(key_values)

config = SurvivalConfig()
