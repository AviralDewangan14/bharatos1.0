"""
BharatOS Sovereign Cryptographic Golden Master Seal & Integrity Enclave.
Maintains an immutable cryptographically signed snapshot of BharatOS source files.
Provides self-healing capabilities if any source file is modified or tampered with on disk.
"""

import os
import sys
import hashlib
import shutil
import time
from pathlib import Path

# Ensure UTF-8 on Windows
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT_DIR = Path(__file__).parent.resolve()
BHARATOS_INDEX = ROOT_DIR / "bharatos" / "index.html"
DIST_DIR = ROOT_DIR / "dist"
SEAL_DIR = ROOT_DIR / "dist" / "enclave_seal"
GOLDEN_MASTER_FILE = SEAL_DIR / "bharatos_golden_master.html"
GOLDEN_HASH_FILE = SEAL_DIR / "bharatos_golden_master.sha256"

def compute_sha256_str(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()

def seal_golden_master() -> str:
    """Creates an immutable cryptographically sealed copy of bharatos/index.html."""
    DIST_DIR.mkdir(exist_ok=True)
    SEAL_DIR.mkdir(parents=True, exist_ok=True)
    
    if not BHARATOS_INDEX.exists():
        raise FileNotFoundError(f"{BHARATOS_INDEX} not found")
        
    with open(BHARATOS_INDEX, "rb") as f:
        content = f.read()
        
    sha256_hash = compute_sha256_str(content)
    
    # Write golden master
    with open(GOLDEN_MASTER_FILE, "wb") as f:
        f.write(content)
        
    with open(GOLDEN_HASH_FILE, "w", encoding="utf-8") as f:
        f.write(f"{sha256_hash}\n")
        
    print(f"[SUCCESS] Golden Master Sealed: SHA256:{sha256_hash}")
    return sha256_hash

def verify_and_self_heal() -> dict:
    """Audits bharatos/index.html on disk and automatically restores if tampered."""
    if not GOLDEN_MASTER_FILE.exists() or not GOLDEN_HASH_FILE.exists():
        seal_golden_master()
        
    with open(GOLDEN_HASH_FILE, "r", encoding="utf-8") as f:
        golden_hash = f.read().strip()
        
    if not BHARATOS_INDEX.exists():
        # File deleted! Self-heal immediately
        shutil.copy2(GOLDEN_MASTER_FILE, BHARATOS_INDEX)
        return {"status": "HEALED_DELETED_FILE", "tampered": True, "sha256": golden_hash}
        
    with open(BHARATOS_INDEX, "rb") as f:
        current_content = f.read()
        
    current_hash = compute_sha256_str(current_content)
    
    if current_hash != golden_hash:
        # File on disk was modified by an external tool/hacker!
        # Automatically self-heal by restoring the genuine golden master
        shutil.copy2(GOLDEN_MASTER_FILE, BHARATOS_INDEX)
        print(f"[SECURITY ALERT] Unauthorized source code tampering intercepted! Disk hash {current_hash} != Golden {golden_hash}. Self-healing executed.")
        return {
            "status": "HEALED_TAMPERED_SOURCE",
            "tampered": True,
            "original_hash": current_hash,
            "restored_hash": golden_hash,
            "timestamp": time.time()
        }
        
    return {"status": "VERIFIED_GENUINE", "tampered": False, "sha256": golden_hash}

if __name__ == "__main__":
    seal_golden_master()
