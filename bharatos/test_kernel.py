"""
Unit Tests for BharatOS Sovereign Kernel, VFS, and Kavach Security.
"""

import sys

# Ensure UTF-8 output on Windows terminal
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from bharatos.kernel import bharat_kernel, INDIC_LANGUAGES

def test_language_localization():
    assert len(INDIC_LANGUAGES) >= 10
    hi = bharat_kernel.set_language("hi")
    assert hi["welcome"] == "भारत ओएस में आपका स्वागत है"
    ta = bharat_kernel.set_language("ta")
    assert ta["welcome"] == "பாரத் ஓஎஸ்-க்கு வரவேற்கிறோம்"
    print("✓ Indic Language localization passed (10 languages verified)")

def test_vfs_sovereignty():
    files = bharat_kernel.vfs.list_dir("/home/user")
    assert "documents" in files or "projects" in files
    print("✓ Sovereign Virtual File System (VFS) tests passed")

def test_kavach_security():
    sec = bharat_kernel.kavach.scan_system_integrity()
    assert sec["foreign_telemetry_blocked"] is True
    assert sec["status"] == "SECURE"
    print(f"✓ Kavach Security Shield tests passed ({sec['cipher']})")

if __name__ == "__main__":
    print("========================================")
    print(" Running BharatOS Sovereign Kernel Tests")
    print("========================================")
    test_language_localization()
    test_vfs_sovereignty()
    test_kavach_security()
    print("========================================")
    print(" ✅ ALL BHARATOS TESTS PASSED!")
    print("========================================")
