"""
Proposal Generator & Bidding Strategist.
Crafts tailored, persuasive technical proposals, calculates win probabilities,
and manages contract bidding.
"""

import random
import time
from typing import Dict, Any

from survival_agent.config import config
from survival_agent.survival_core import survival_core

PROPOSAL_HOOKS = [
    "Hi there! I reviewed your project requirements for '{title}' and have architected similar production systems with {stack}.",
    "Greetings! I specialize in high-reliability {category} engineering and can deliver your '{title}' with clean code, full test coverage, and clear docs.",
    "Hello {client}! Your project requirements align perfectly with my capabilities in {stack}. Here is my technical implementation plan."
]

class ProposalEngine:
    """Generates technical proposals and resolves competitive bidding."""

    def draft_and_submit_bid(self, job: Dict[str, Any]) -> Dict[str, Any]:
        """Drafts a tailored proposal for the job and determines bid outcome."""
        survival_core.proposals_sent += 1
        job["status"] = "BIDDING"

        # 1. Deduct token cost for LLM reasoning & proposal drafting
        prompt_tokens = random.randint(450, 900)
        completion_tokens = random.randint(350, 700)
        token_fee = survival_core.deduct_token_cost(prompt_tokens, completion_tokens, f"Draft Proposal: {job['title'][:30]}")

        # 2. Generate customized proposal text
        stack_str = ", ".join(job["tech_stack"][:3])
        hook = random.choice(PROPOSAL_HOOKS).format(
            title=job["title"],
            stack=stack_str,
            category=job["category"],
            client=job["client"]
        )

        proposal_text = f"""{hook}

### Proposed Technical Architecture:
1. **Core Module Implementation**: High-performance modular architecture leveraging {stack_str}.
2. **Robust Error Handling**: Exponential backoff, structured exception handling, and input validation.
3. **Automated Verification**: End-to-end unit tests and verification scripts to ensure 100% contract compliance.
4. **Deliverables**: Full source code repository, configuration guides, and clean documentation.

• Bid Amount: ${job['budget']:.2f} USD
• Estimated Delivery: Rapid Turnaround
• Tech Stack: {', '.join(job['tech_stack'])}
"""
        job["proposal_text"] = proposal_text
        job["bid_amount"] = job["budget"]

        # 3. Calculate Win Probability
        base_win_rate = config.get("bid_win_rate_base", 0.72)
        if survival_core.upgrades.get("smart_bidding_model", {}).get("purchased"):
            base_win_rate += 0.18
        
        # High level gives reputation boost
        level_boost = (survival_core.level - 1) * 0.04
        effective_win_rate = min(0.96, base_win_rate + level_boost)

        is_won = random.random() < effective_win_rate

        if is_won:
            job["status"] = "WON"
            survival_core.contracts_won += 1
            survival_core.add_thought(
                f"🎯 BID ACCEPTED! Client '{job['client']}' awarded contract '${job['title']}' (${job['budget']:.2f}). Starting build phase...",
                "WON",
                {"job_id": job["id"], "budget": job["budget"]}
            )
            return {"won": True, "job": job, "token_fee": token_fee}
        else:
            job["status"] = "LOST"
            survival_core.add_thought(
                f"Client '{job['client']}' went with another bid for '${job['title']}'. Scouting next opportunity...",
                "LOST",
                {"job_id": job["id"]}
            )
            return {"won": False, "job": job, "token_fee": token_fee}


# Global proposal engine instance
proposal_engine = ProposalEngine()
