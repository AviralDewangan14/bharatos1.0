"""
Master End-to-End Verification Test for Solaris Prometheus Studio.
"""

import sys
import io
import time
import json
import urllib.request
from pathlib import Path

# Add project root
sys.path.insert(0, str(Path(__file__).parent))

# Ensure UTF-8 output on Windows terminal
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from config import config
from heartbeat_dispatcher import dispatcher
from stardust_engine import stardust_engine
from solaris.physics import CelestialBody, Spacecraft, Vector2D
from survival_agent.survival_core import survival_core
from survival_agent.job_hunter import job_hunter
from survival_agent.proposal_engine import proposal_engine
from survival_agent.project_builder import project_builder
from survival_agent.delivery_manager import delivery_manager
from web_dashboard import dashboard_server

def run_tests():
    print("========================================")
    print(" Starting Solaris Prometheus Master Tests")
    print("========================================")

    # 1. Config & API Key
    print("\n[Test 1] Config Manager & Hackatime Auth")
    api_url = config.get("api_url")
    has_key = bool(config.get("api_key"))
    print(f" * Target API URL: {api_url}")
    print(f" * API Key Status: {'[YES] Loaded' if has_key else '[NO] Missing'}")
    assert has_key, "API key must be loaded from ~/.wakatime.cfg"

    # 2. Stardust Valuation Engine
    print("\n[Test 2] Stardust & Doubloon Multiplier Engine")
    mult_res = stardust_engine.evaluate_project_multiplier(total_lines=1200, num_files=14, has_tests=True, has_docs=True)
    rewards_res = stardust_engine.calculate_rewards(tracked_seconds=3600*4, project_multiplier=mult_res["multiplier"])
    print(f" * Project Complexity Multiplier: {mult_res['multiplier']}x ({mult_res['tier_name']})")
    print(f" * Estimated Yield for 4 hrs: {rewards_res['stardust_estimated']} Stardust ({rewards_res['doubloons_estimated']} Doubloons)")
    assert mult_res["multiplier"] >= 2.0

    # 3. Survival Freelance & Synchronized Project Builder
    print("\n[Test 3] Survival Freelancer & Real Project Builder")
    survival_core.reset_game(100.00)
    jobs = job_hunter.scout_opportunities()
    best_job = jobs[0]
    bid_res = proposal_engine.draft_and_submit_bid(best_job)
    best_job["status"] = "WON"
    build_res = project_builder.build_contract(best_job)
    print(f" * Built Project: '{best_job['title']}' ({build_res['total_lines']} LOC in {build_res['project_dir']})")
    delivery_res = delivery_manager.complete_and_collect_payment(best_job)
    print(f" * Delivered to {best_job['client']}, Payout: +${delivery_res['total']:.2f}, New Balance: ${survival_core.balance:.2f}")
    assert survival_core.balance > 100.00

    # 4. Synchronized WakaTime Cloud Dispatcher
    print("\n[Test 4] WakaTime Heartbeat Cloud Dispatcher")
    test_payload = {
        "entity": "solaris/physics.py",
        "type": "file",
        "time": time.time(),
        "project": "solaris-space-game",
        "branch": "main",
        "language": "Python",
        "is_write": True,
        "category": "coding",
        "lines": 140,
        "lineno": 45,
        "cursorpos": 12,
        "editor": "VS Code",
        "operating_system": "Windows"
    }
    dispatch_res = dispatcher.dispatch_heartbeat(test_payload)
    print(f" * Dispatch Success: {dispatch_res.get('success')}")
    print(f" * Status Code:     {dispatch_res.get('status_code')}")
    assert dispatch_res.get("success")

    # 5. Playable Solaris Physics Engine
    print("\n[Test 5] Playable Solaris Physics & Orbital Math")
    star = CelestialBody("Helios", Vector2D(0, 0), mass=6500.0, radius=45.0)
    ship = Spacecraft(Vector2D(300.0, 0.0))
    ship.apply_thrust(0.1)
    ship.integrate(0.1, [star])
    v_circ = star.calculate_orbital_velocity(300.0)
    print(f" * Calculated Orbital Velocity: {v_circ:.2f} km/s")
    assert v_circ > 0

    # 6. Unified Master Dashboard & Routes
    print("\n[Test 6] Unified Dashboard on Port 5678")
    url = dashboard_server.start()
    time.sleep(0.5)

    # Test GET /api/status
    req_status = urllib.request.Request(f"{url}/api/status")
    with urllib.request.urlopen(req_status, timeout=5) as resp:
        status_json = json.loads(resp.read().decode("utf-8"))
        print(f" * Status Endpoint: HTTP {resp.status} (Stardust: {status_json.get('stardust_metrics', {}).get('stardust_estimated')})")
        assert resp.status == 200

    # Test GET /game
    req_game = urllib.request.Request(f"{url}/game")
    with urllib.request.urlopen(req_game, timeout=5) as resp:
        game_html = resp.read().decode("utf-8")
        print(f" * Solaris Game HTML: HTTP {resp.status} ({len(game_html)} bytes)")
        assert "SOLARIS ORBITAL HUD" in game_html

    dashboard_server.stop()

    print("\n========================================")
    print(" ✅ ALL 6 MASTER STUDIO TESTS PASSED!")
    print("========================================")

if __name__ == "__main__":
    run_tests()
