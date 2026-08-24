"""
BharatOS Sovereign Kernel & System Services Package.
Zero-telemetry, privacy-hardened, multilingual operating system abstraction for PCs.
"""

import sys
import time
import json
from typing import Dict, Any, List, Optional
from pathlib import Path

# Ensure UTF-8 on Windows terminal
if sys.platform == "win32" and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

INDIC_LANGUAGES = {
    "en": {"name": "English", "welcome": "Welcome to BharatOS", "status": "Secure"},
    "hi": {"name": "हिन्दी (Hindi)", "welcome": "भारत ओएस में आपका स्वागत है", "status": "सुरक्षित"},
    "ta": {"name": "தமிழ் (Tamil)", "welcome": "பாரத் ஓஎஸ்-க்கு வரவேற்கிறோம்", "status": "பாதுகாப்பானது"},
    "te": {"name": "తెలుగు (Telugu)", "welcome": "భారత్ ఓఎస్‌కు స్వాగతం", "status": "సురక్షితం"},
    "bn": {"name": "বাংলা (Bengali)", "welcome": "ভারত ওএস-এ স্বাগতম", "status": "সুরক্ষিত"},
    "mr": {"name": "मराठी (Marathi)", "welcome": "भारत ओएस मध्ये आपले स्वागत आहे", "status": "सुरक्षित"},
    "gu": {"name": "ગુજરાતી (Gujarati)", "welcome": "ભારત ઓએસમાં આપનું સ્વાગત છે", "status": "સુરક્ષિત"},
    "kn": {"name": "ಕನ್ನಡ (Kannada)", "welcome": "ಭಾರತ್ ಓಎಸ್‌ಗೆ ಸುಸ್ವಾಗತ", "status": "ಸುರಕ್ಷಿತ"},
    "ml": {"name": "മലയാളം (Malayalam)", "welcome": "ഭാരത് ഒഎസിലേക്ക് സ്വാഗതം", "status": "സുരക്ഷിതം"},
    "pa": {"name": "ਪੰਜਾਬੀ (Punjabi)", "welcome": "ਭਾਰਤ ਓਐਸ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ", "status": "ਸੁਰੱਖਿਅਤ"}
}

class SovereignVFS:
    """Virtual File System with zero-telemetry local sandboxing."""
    def __init__(self):
        self.root: Dict[str, Any] = {
            "root": {
                "system": {
                    "kernel.sys": "[BharatOS Microkernel v3.2.0-Sovereign]",
                    "kavach.cfg": '{"telemetry": "DISABLED", "encryption": "AES-256-GCM", "sovereign_mode": true}'
                },
                "home": {
                    "user": {
                        "documents": {
                            "readme.txt": "Welcome to BharatOS - India's Independent Sovereign PC Operating System.\n100% Zero Foreign Telemetry."
                        },
                        "projects": {
                            "solaris_orbital": "N-Body Orbital Physics Simulator Engine",
                            "indic_ai": "Multilingual Indic Natural Language Core"
                        },
                        "games": {
                            "solaris.app": "Solaris Space Flight Simulator",
                            "chakra.app": "Chakra Cyber Runner"
                        }
                    }
                },
                "apps": {
                    "terminal.app": "Bharat Sovereign Terminal v2.4",
                    "code_studio.app": "Indic Code Studio IDE",
                    "kavach_shield.app": "Kavach Zero-Trust Security Firewall",
                    "gaming_hub.app": "144 FPS Vulkan Game Hub"
                }
            }
        }

    def list_dir(self, path: str = "/home/user") -> List[str]:
        parts = [p for p in path.strip("/").split("/") if p]
        curr = self.root["root"]
        for p in parts:
            if isinstance(curr, dict) and p in curr:
                curr = curr[p]
            else:
                return []
        if isinstance(curr, dict):
            return list(curr.keys())
        return [str(curr)]


class KavachSecurityEngine:
    """Kavach Zero-Trust Security Shield."""
    def __init__(self):
        self.telemetry_blocked_count: int = 4280
        self.sovereign_firewall_active: bool = True
        self.encryption_cipher: str = "AES-256-GCM + ChaCha20-Poly1305"

    def scan_system_integrity(self) -> Dict[str, Any]:
        return {
            "status": "SECURE",
            "foreign_telemetry_blocked": True,
            "telemetry_probes_neutralized": self.telemetry_blocked_count,
            "data_residency": "100% Local (Bharat Sovereignty Guaranteed)",
            "firewall_mode": "Zero-Trust Sovereign Enclave",
            "cipher": self.encryption_cipher
        }


class BharatOSKernel:
    """Master Kernel orchestrating processes, multilingual UI, and Kavach Security."""
    def __init__(self):
        self.os_version: str = "BharatOS 2026.1 LTS 'Swaraj'"
        self.active_language: str = "hi"
        self.vfs = SovereignVFS()
        self.kavach = KavachSecurityEngine()
        self.running_processes: List[Dict[str, Any]] = [
            {"pid": 1, "name": "sovereign_init", "cpu": 0.2, "mem_mb": 12.4, "status": "RUNNING"},
            {"pid": 2, "name": "kavach_firewall", "cpu": 0.4, "mem_mb": 18.2, "status": "GUARDING"},
            {"pid": 3, "name": "liquid_compositor", "cpu": 1.2, "mem_mb": 42.0, "status": "ACTIVE (144 FPS)"},
            {"pid": 4, "name": "winbridge_runtime", "cpu": 0.3, "mem_mb": 24.0, "status": "IDLE"}
        ]

    def switch_language(self, lang_code: str) -> Dict[str, str]:
        if lang_code in INDIC_LANGUAGES:
            self.active_language = lang_code
            return INDIC_LANGUAGES[lang_code]
        return INDIC_LANGUAGES["hi"]

    def set_language(self, lang_code: str) -> Dict[str, str]:
        return self.switch_language(lang_code)

    def get_system_status(self) -> Dict[str, Any]:
        return {
            "os": self.os_version,
            "arch": "x86_64 Long Mode (4-Level Paging)",
            "language": INDIC_LANGUAGES[self.active_language]["name"],
            "welcome_message": INDIC_LANGUAGES[self.active_language]["welcome"],
            "security": self.kavach.scan_system_integrity(),
            "uptime_seconds": 12480,
            "processes_count": len(self.running_processes)
        }


# Global Bharat Kernel instance
bharat_kernel = BharatOSKernel()
