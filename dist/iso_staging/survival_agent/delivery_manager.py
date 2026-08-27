"""
Delivery Manager & Payout Resolution.
Simulates client acceptance, quality verification, rating generation, and payout collection.
"""

import random
import time
from typing import Dict, Any

from survival_agent.survival_core import survival_core

CLIENT_REVIEWS = [
    "Phenomenal work! Code is clean, well-documented, and tests pass flawlessly.",
    "Delivered ahead of schedule with great architecture. Will definitely hire again.",
    "Exceeded expectations! Solved a tricky edge case and provided clear instructions.",
    "Extremely impressed by the speed and code quality. 5/5 stars."
]

class DeliveryManager:
    """Handles final client delivery, ratings, and payment collection."""

    def complete_and_collect_payment(self, job: Dict[str, Any]) -> Dict[str, Any]:
        """Delivers code, simulates client review, and credits agent balance."""
        gross_payout = job["budget"]
        client_name = job["client"]
        project_title = job["title"]

        # Calculate tip probability
        tip = 0.0
        tip_chance = 0.35
        if survival_core.upgrades.get("enterprise_rep", {}).get("purchased"):
            tip_chance += 0.30

        if random.random() < tip_chance:
            tip_pct = random.uniform(0.10, 0.25)
            tip = round(gross_payout * tip_pct, 2)

        client_rating = round(random.uniform(4.8, 5.0), 1)
        review_comment = random.choice(CLIENT_REVIEWS)

        job["status"] = "PAID"
        job["rating"] = client_rating
        job["review"] = review_comment
        job["tip"] = tip
        job["total_earned"] = gross_payout + tip
        job["delivered_at"] = time.time()

        # Credit funds to survival core
        survival_core.credit_contract_payout(gross_payout, client_name, project_title, tip=tip)

        return {
            "success": True,
            "job": job,
            "payout": gross_payout,
            "tip": tip,
            "total": gross_payout + tip,
            "rating": client_rating,
            "review": review_comment
        }


# Global delivery manager instance
delivery_manager = DeliveryManager()
