"""
Unit & Integration Test Suite for Project Prometheus Survival Freelance AI.
"""

import sys
import io
import time
import json
import urllib.request
from pathlib import Path

# Add parent directory
sys.path.insert(0, str(Path(__file__).parent.parent))

if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from survival_agent.config import config
from survival_agent.survival_core import survival_core
from survival_agent.job_hunter import job_hunter
from survival_agent.proposal_engine import proposal_engine
from survival_agent.project_builder import project_builder
from survival_agent.delivery_manager import delivery_manager
from survival_agent.dashboard_server import survival_dashboard_server

def run_tests():
    print("========================================")
    print(" Testing Prometheus Survival Agent")
    print("========================================")

    # 1. Reset state
    survival_core.reset_game(100.00)
    print("\n[Test 1] Survival Core & Initial Balance")
    print(f" * Initial Balance: ${survival_core.balance:.2f}")
    assert survival_core.balance == 100.00
    assert survival_core.is_alive

    # Burn deduction
    survival_core.deduct_burn(5.0)
    print(f" * Balance after 5s burn: ${survival_core.balance:.4f}")
    assert survival_core.balance < 100.00

    # 2. Job Hunter
    print("\n[Test 2] Job Hunter & Opportunity Scoring")
    jobs = job_hunter.scout_opportunities()
    print(f" * Scouted {len(jobs)} jobs")
    assert len(jobs) > 0
    best_job = job_hunter.select_best_contract_to_bid()
    print(f" * Best Job Selected: '{best_job['title']}' (${best_job['budget']:.2f}, ROI: {best_job['roi_pct']}%)")
    assert best_job is not None

    # 3. Proposal Engine
    print("\n[Test 3] Proposal Engine & Bidding")
    initial_bal = survival_core.balance
    bid_res = proposal_engine.draft_and_submit_bid(best_job)
    print(f" * Bid Result: {'WON' if bid_res['won'] else 'LOST'}")
    print(f" * Token Cost Incurred: ${bid_res['token_fee']:.6f}")
    assert survival_core.balance < initial_bal, "Token fees should have been deducted"

    # Force job to WON for testing build phase
    best_job["status"] = "WON"

    # 4. Project Builder
    print("\n[Test 4] Project Builder (Code Synthesis)")
    build_res = project_builder.build_contract(best_job)
    print(f" * Project Dir: {build_res['project_dir']}")
    print(f" * Files Created: {len(build_res['files_created'])}")
    print(f" * Total Code Lines: {build_res['total_lines']}")
    assert Path(build_res["project_dir"]).exists()
    assert build_res["total_lines"] > 0
    assert best_job["status"] == "REVIEW"

    # 5. Delivery Manager & Payout
    print("\n[Test 5] Delivery & Payment Collection")
    pre_payout_bal = survival_core.balance
    delivery_res = delivery_manager.complete_and_collect_payment(best_job)
    print(f" * Client Rating: {delivery_res['rating']} / 5.0")
    print(f" * Client Review: {delivery_res['review']}")
    print(f" * Payout: ${delivery_res['payout']:.2f} + Tip: ${delivery_res['tip']:.2f} = Total ${delivery_res['total']:.2f}")
    print(f" * New Agent Balance: ${survival_core.balance:.2f}")
    assert survival_core.balance > pre_payout_bal, "Balance should have increased from client payout"
    assert best_job["status"] == "PAID"

    # 6. Dashboard Server & REST API
    print("\n[Test 6] Dashboard Server on Port 7890")
    url = survival_dashboard_server.start()
    time.sleep(0.5)

    req = urllib.request.Request(f"{url}/api/status")
    with urllib.request.urlopen(req, timeout=5) as resp:
        status_data = json.loads(resp.read().decode("utf-8"))
        print(f" * Status Endpoint: HTTP {resp.status}")
        print(f" * Vitality State: {status_data.get('vitality_state')}")
        print(f" * Reported Balance: ${status_data.get('balance')}")
        assert resp.status == 200

    survival_dashboard_server.stop()

    print("\n========================================")
    print(" ✅ ALL 6 SURVIVAL AGENT TESTS PASSED!")
    print("========================================")

if __name__ == "__main__":
    run_tests()
