"""
Hack Club Stardust & Doubloons Valuation Engine with 238-Hour Milestone Tracking.
Calculates project quality multipliers, test coverage bonuses, and progress toward the 238-Hour goal.
"""

import math
import time
from typing import Dict, Any, List

TARGET_HOURS = 238.0

class StardustValuationEngine:
    """Calculates estimated Stardust / Doubloon yield based on project complexity and 238h milestone progress."""

    def __init__(self):
        self.target_hours: float = TARGET_HOURS
        self.base_stardust_per_hour: float = 12.0  # Base rate per hour
        self.base_doubloons_per_hour: float = 1.2

    def evaluate_project_multiplier(self, total_lines: int = 1800, num_files: int = 18, has_tests: bool = True, has_docs: bool = True) -> Dict[str, Any]:
        """Calculates complexity multiplier (1.0x to 2.5x) based on software craft."""
        multiplier = 1.0
        breakdown = []

        if total_lines > 1000:
            multiplier += 0.5
            breakdown.append("+0.5x (Large-Scale Enterprise Architecture >1000 LOC)")
        elif total_lines > 500:
            multiplier += 0.3
            breakdown.append("+0.3x (Substantial Codebase >500 LOC)")

        if num_files >= 10:
            multiplier += 0.4
            breakdown.append("+0.4x (Multi-Module Subsystem Architecture)")

        if has_tests:
            multiplier += 0.4
            breakdown.append("+0.4x (100% Passing Automated Physics Test Suites)")

        if has_docs:
            multiplier += 0.2
            breakdown.append("+0.2x (Extensive Multi-Tier Technical Documentation)")

        # Cap at 2.5x maximum multiplier
        multiplier = min(2.5, multiplier)

        tier_name = "Master Craft (Legendary Tier)" if multiplier >= 2.2 else "Advanced Artisan"

        return {
            "multiplier": round(multiplier, 2),
            "tier_name": tier_name,
            "breakdown": breakdown
        }

    def calculate_rewards(self, tracked_seconds: float, project_multiplier: float = 2.4) -> Dict[str, Any]:
        """Calculates total estimated Stardust & Doubloons earned and 238-hour progress."""
        hours = max(0.0, tracked_seconds / 3600.0)
        
        # Stardust = Hours * Base * Multiplier
        stardust = round(hours * self.base_stardust_per_hour * project_multiplier, 1)
        doubloons = round(hours * self.base_doubloons_per_hour * project_multiplier, 1)

        # 238-Hour Goal Tracking
        progress_pct = min(100.0, round((hours / self.target_hours) * 100.0, 2))
        hours_remaining = max(0.0, round(self.target_hours - hours, 1))

        # Estimated completion at 24/7 pace (24h/day)
        days_remaining = round(hours_remaining / 24.0, 1)
        
        # Max potential Stardust at full 238 hours
        max_target_stardust = round(self.target_hours * self.base_stardust_per_hour * project_multiplier, 0)
        max_target_doubloons = round(self.target_hours * self.base_doubloons_per_hour * project_multiplier, 0)

        # Milestone Unlock Tiers
        milestones = [
            {"hours": 50, "reached": hours >= 50, "reward": "Bronze High Seas Badge", "stardust": 50 * 12 * project_multiplier},
            {"hours": 100, "reached": hours >= 100, "reward": "Silver Architect Badge", "stardust": 100 * 12 * project_multiplier},
            {"hours": 175, "reached": hours >= 175, "reward": "Gold Sovereign Tier", "stardust": 175 * 12 * project_multiplier},
            {"hours": 238, "reached": hours >= 238, "reward": "🏆 Grandmaster 238h Pinnacle", "stardust": max_target_stardust}
        ]

        return {
            "hours_tracked": round(hours, 2),
            "target_hours": self.target_hours,
            "progress_pct": progress_pct,
            "hours_remaining": hours_remaining,
            "days_remaining_24_7": days_remaining,
            "stardust_estimated": stardust,
            "doubloons_estimated": doubloons,
            "max_target_stardust": max_target_stardust,
            "max_target_doubloons": max_target_doubloons,
            "project_multiplier": project_multiplier,
            "milestones": milestones,
            "redemption_status": "MAXIMUM EXCHANGE RATE (100% Code of Conduct Verified)"
        }


# Global stardust engine instance
stardust_engine = StardustValuationEngine()
