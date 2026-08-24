"""
End-to-End Verification Test for Hackatime 24/7 Coding Bot.
"""

import urllib.request
import json
import time
from config import config
from simulation_engine import simulation_engine
from workspace_writer import workspace_writer
from heartbeat_dispatcher import dispatcher
from service_daemon import daemon
from web_dashboard import dashboard_server

import sys
import io

# Ensure UTF-8 output on Windows terminal
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

def run_tests():
    print("========================================")
    print(" Starting Bot Verification Tests")
    print("========================================")

    # Test 1: Config
    print("\n[Test 1] Config Manager")
    api_url = config.get("api_url")
    has_key = bool(config.get("api_key"))
    print(f" * Target API URL: {api_url}")
    print(f" * Loaded API Key: {'[YES] Loaded' if has_key else '[NO] Missing'}")
    assert has_key, "API Key must be present"

    # Test 2: Simulation Engine
    print("\n[Test 2] Simulation Engine")
    sim = simulation_engine.get_next_heartbeat_payload()
    print(f" • Generated Project: {sim['project']}")
    print(f" • Generated Entity:  {sim['entity']}")
    print(f" • Language:          {sim['language']}")
    print(f" • Lines:             {sim['payload']['lines']}")
    assert sim["payload"]["lines"] > 0
    assert sim["language"]

    # Test 3: Workspace Writer
    print("\n[Test 3] Workspace Physical File Writer")
    target_path = workspace_writer.write_simulated_file(sim["project"], sim["entity"], sim["file_content"])
    print(f" • Written file to disk: {target_path}")
    assert target_path.exists(), "Target file must exist on disk"
    assert target_path.stat().st_size > 0

    # Test 4: Heartbeat Dispatcher
    print("\n[Test 4] Heartbeat Dispatcher (Cloud API Test)")
    dispatch_res = dispatcher.dispatch_heartbeat(sim["payload"])
    print(f" • Dispatch Success: {dispatch_res.get('success')}")
    print(f" • Status Code:     {dispatch_res.get('status_code')}")
    print(f" • Server Response: {dispatch_res.get('response', '')[:120]}...")
    assert dispatch_res.get("success"), "Heartbeat dispatch should succeed"

    # Test 5: Web Dashboard & REST API
    print("\n[Test 5] Web Dashboard & REST API")
    url = dashboard_server.start()
    time.sleep(0.5)
    
    # Test GET /api/status
    req = urllib.request.Request(f"{url}/api/status")
    with urllib.request.urlopen(req, timeout=5) as resp:
        status_data = json.loads(resp.read().decode("utf-8"))
        print(f" • Status Endpoint: HTTP {resp.status}")
        print(f" • Total Pulses:    {status_data.get('total_pulses')}")
        print(f" • Current Project: {status_data.get('current_project')}")
        assert resp.status == 200

    # Test GET / (HTML)
    req_html = urllib.request.Request(f"{url}/")
    with urllib.request.urlopen(req_html, timeout=5) as resp_html:
        html_content = resp_html.read().decode("utf-8")
        print(f" • Index HTML:      HTTP {resp_html.status} ({len(html_content)} bytes)")
        assert "Hackatime 24/7 Bot" in html_content

    dashboard_server.stop()

    print("\n========================================")
    print(" ✅ ALL 5 VERIFICATION TESTS PASSED!")
    print("========================================")

if __name__ == "__main__":
    run_tests()
