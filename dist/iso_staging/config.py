"""
Configuration manager for the 24/7 Hackatime Coding Bot.
Automatically loads credentials from ~/.wakatime.cfg and merges with config.json.
"""

import os
import json
import configparser
from pathlib import Path
from typing import Dict, Any, Optional

DEFAULT_CONFIG_PATH = Path(__file__).parent / "config.json"
WAKATIME_CFG_PATH = Path(os.path.expanduser("~/.wakatime.cfg"))

DEFAULT_SETTINGS: Dict[str, Any] = {
    "api_url": "https://hackatime.hackclub.com/api/hackatime/v1",
    "api_key": "",
    "pulse_interval_min": 45,       # seconds
    "pulse_interval_max": 85,       # seconds
    "ghost_mode_api": True,         # Send heartbeats directly to cloud API
    "physical_workspace_mode": True,# Generate/edit physical files in workspace
    "prevent_system_sleep": True,   # Keep Windows awake for 24/7 uptime
    "web_dashboard_port": 5678,
    "web_dashboard_host": "127.0.0.1",
    "active_projects": [
        {
            "name": "arcade-solaris-engine",
            "languages": ["Rust", "C++", "GLSL"],
            "branch": "main",
            "categories": ["coding", "debugging", "building"]
        },
        {
            "name": "lumina-ai-studio",
            "languages": ["TypeScript", "React", "CSS", "HTML"],
            "branch": "feature/specular-glass",
            "categories": ["coding", "designing"]
        },
        {
            "name": "neural-symphony-ai",
            "languages": ["Python", "CUDA", "Markdown"],
            "branch": "experiment/diffusion-v3",
            "categories": ["coding", "researching", "building"]
        },
        {
            "name": "nebula-distributed-db",
            "languages": ["Go", "Docker", "SQL", "YAML"],
            "branch": "refactor/raft-consensus",
            "categories": ["coding", "debugging"]
        }
    ],
    "editors": ["VS Code", "Cursor", "Neovim", "IntelliJ IDEA"],
    "operating_systems": ["Windows", "Linux", "Mac"]
}


class ConfigManager:
    """Manages bot configuration, merging default, ~/.wakatime.cfg and config.json."""

    def __init__(self, config_file: Optional[Path] = None):
        self.config_file = config_file or DEFAULT_CONFIG_PATH
        self.settings: Dict[str, Any] = DEFAULT_SETTINGS.copy()
        self.load()

    def _read_wakatime_cfg(self) -> Dict[str, str]:
        """Extracts api_key and api_url from ~/.wakatime.cfg if available."""
        result: Dict[str, str] = {}
        if WAKATIME_CFG_PATH.exists():
            try:
                parser = configparser.ConfigParser()
                parser.read(str(WAKATIME_CFG_PATH), encoding="utf-8")
                if parser.has_section("settings"):
                    if "api_key" in parser["settings"] and parser["settings"]["api_key"]:
                        result["api_key"] = parser["settings"]["api_key"].strip()
                    if "api_url" in parser["settings"] and parser["settings"]["api_url"]:
                        result["api_url"] = parser["settings"]["api_url"].strip()
            except Exception as err:
                print(f"[Config] Warning: Failed to parse ~/.wakatime.cfg: {err}")
        return result

    def load(self) -> Dict[str, Any]:
        """Loads configuration from file and overrides with ~/.wakatime.cfg credentials."""
        # 1. Start with defaults
        data = DEFAULT_SETTINGS.copy()

        # 2. Check ~/.wakatime.cfg
        waka_cfg = self._read_wakatime_cfg()
        if waka_cfg.get("api_key"):
            data["api_key"] = waka_cfg["api_key"]
        if waka_cfg.get("api_url"):
            data["api_url"] = waka_cfg["api_url"]

        # 3. Check local config.json
        if self.config_file.exists():
            try:
                with open(self.config_file, "r", encoding="utf-8") as f:
                    file_data = json.load(f)
                    data.update(file_data)
            except Exception as err:
                print(f"[Config] Warning: Failed to read {self.config_file}: {err}")

        # 4. Check Environment Variables
        if os.environ.get("HACKATIME_API_KEY"):
            data["api_key"] = os.environ["HACKATIME_API_KEY"]
        if os.environ.get("HACKATIME_API_URL"):
            data["api_url"] = os.environ["HACKATIME_API_URL"]

        self.settings = data
        return self.settings

    def save(self) -> bool:
        """Saves current settings to config.json."""
        try:
            with open(self.config_file, "w", encoding="utf-8") as f:
                json.dump(self.settings, f, indent=2)
            return True
        except Exception as err:
            print(f"[Config] Error saving config to {self.config_file}: {err}")
            return False

    def update(self, key_values: Dict[str, Any]) -> bool:
        """Updates settings in memory and persists to disk."""
        self.settings.update(key_values)
        return self.save()

    def get(self, key: str, default: Any = None) -> Any:
        return self.settings.get(key, default)


# Global singleton instance
config = ConfigManager()
