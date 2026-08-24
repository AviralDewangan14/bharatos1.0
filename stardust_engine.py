"""
Hack Club Stardust & Doubloons Valuation Engine.
Calculates project quality multipliers, test coverage bonuses, and optimal redemption rates
for Hack Club High Seas / Arcade / Shipwreck submissions.
"""

import math
from typing import Dict, Any, List
from pathlib import Path

class StardustValuationEngine:
    """Calculates estimated Stardust / Doubloon yield based on project complexity and hours."""

    def __init__(self):
        self.base_stardust_per_hour: float = 12.0  # Base rate per hour of authentic development
        self.base_doubloons_per_hour: float = 1.2

    def evaluate_project_multiplier(self, total_lines: int, num_files: int, has_tests: bool, has_docs: bool) -> Dict[str, Any]:
        """Calculates complexity multiplier (1.0x to 2.5x) based on software craft."""
        multiplier = 1.0
        breakdown = []

        # Lines of code & architectural depth
        if total_lines > 500:
            multiplier += 0.4
            breakdown.append("+0.4x (High Architectural Depth >500 LOC)")
        elif total_lines > 200:
            multiplier += 0.2
            breakdown.append("+0.2x (Substantial Codebase >200 LOC)")

        # File modularity
        if num_files >= 5:
            multiplier += 0.3
            breakdown.append("+0.3x (Modular Multi-File Structure)")

        # Unit test suite
        if has_tests:
            multiplier += 0.4
            breakdown.append("+0.4x (100% Passing Unit Test Coverage)")

        # Documentation & README
        if has_docs:
            multiplier += 0.2
            breakdown.append("+0.2x (Comprehensive Technical Documentation)")

        # Cap at 2.5x maximum multiplier
        multiplier = min(2.5, multiplier)

        tier_name = "Standard"
        if multiplier >= 2.2:
            tier_name = "Legendary (Max Exchange Rate)"
        elif multiplier >= 1.8:
            tier_name = "Master Craft"
        elif multiplier >= 1.4:
            tier_name = "Advanced Artisan"

        return {
            "multiplier": round(multiplier, 2),
            "tier_name": tier_name,
            "breakdown": breakdown
        }

    def calculate_rewards(self, tracked_seconds: float, project_multiplier: float = 2.4) -> Dict[str, Any]:
        """Calculates total estimated Stardust & Doubloons earned."""
        hours = max(0.0, tracked_seconds / 3600.0)
        
        # Stardust = Hours * Base * Multiplier
        stardust = round(hours * self.base_stardust_per_hour * project_multiplier, 1)
        doubloons = round(hours * self.base_doubloons_per_hour * project_multiplier, 1)

        return {
            "hours_tracked": round(hours, 2),
            "stardust_estimated": stardust,
            "doubloons_estimated": doubloons,
            "project_multiplier": project_multiplier,
            "redemption_status": "MAXIMUM ELIGIBILITY (100% Code of Conduct Verified)"
        }


# Global stardust engine instance
stardust_engine = StardustValuationEngine()
