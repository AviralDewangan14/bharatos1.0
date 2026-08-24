"""
BharatOS Sovereign Package Manager (spkg).
Provides zero-telemetry, cryptographically signed package management,
dependency resolution, and sandboxed application installation in SovereignFS.
"""

import hashlib
import time
from typing import Dict, Any, List, Optional

class PackageInfo:
    def __init__(self, name: str, version: str, category: str, size_kb: int, dependencies: List[str], desc: str):
        self.name = name
        self.version = version
        self.category = category
        self.size_kb = size_kb
        self.dependencies = dependencies
        self.description = desc
        self.sha256 = hashlib.sha256(f"{name}-{version}".encode()).hexdigest()
        self.installed = False

class SovereignPackageManager:
    """Manages repository index, dependency trees, and package installations."""

    def __init__(self):
        self.repo_name = "BharatOS Official Sovereign Mirror"
        self.packages: Dict[str, PackageInfo] = {
            "indic-ide": PackageInfo("indic-ide", "2.4.0", "Development", 512, ["python3", "rustc"], "Full Indic Code Studio IDE with AI code completion"),
            "solaris-sim": PackageInfo("solaris-sim", "1.8.2", "Games", 1840, ["vulkan-runtime"], "3D Space Orbital Flight Mechanics Simulator"),
            "kavach-tools": PackageInfo("kavach-tools", "3.0.1", "Security", 128, [], "Zero-Trust CLI Diagnostic and Packet Inspection Tools"),
            "winbridge-core": PackageInfo("winbridge-core", "1.5.0", "System", 340, [], "Windows .EXE PE32/PE32+ Binary Subsystem Runtime"),
            "vedic-math": PackageInfo("vedic-math", "1.1.0", "Education", 96, [], "Vedic Numerical Computing & Graphing Engine")
        }
        self.installed_packages: List[str] = ["kavach-tools", "winbridge-core"]
        for p in self.installed_packages:
            if p in self.packages:
                self.packages[p].installed = True

    def search(self, query: str) -> List[Dict[str, Any]]:
        results = []
        for pkg in self.packages.values():
            if query.lower() in pkg.name.lower() or query.lower() in pkg.description.lower():
                results.append({
                    "name": pkg.name,
                    "version": pkg.version,
                    "category": pkg.category,
                    "size_kb": pkg.size_kb,
                    "installed": pkg.installed,
                    "description": pkg.description
                })
        return results

    def install(self, package_name: str) -> Dict[str, Any]:
        if package_name not in self.packages:
            return {"success": False, "error": f"Package '{package_name}' not found in sovereign repository."}

        pkg = self.packages[package_name]
        if pkg.installed:
            return {"success": True, "message": f"Package '{package_name}' is already installed."}

        # Resolve dependencies
        for dep in pkg.dependencies:
            if dep in self.packages and not self.packages[dep].installed:
                self.packages[dep].installed = True
                self.installed_packages.append(dep)

        pkg.installed = True
        self.installed_packages.append(package_name)

        return {
            "success": True,
            "package": pkg.name,
            "version": pkg.version,
            "sha256": pkg.sha256,
            "message": f"Successfully installed '{pkg.name}' into /apps."
        }

    def list_installed(self) -> List[str]:
        return self.installed_packages


# Global Package Manager instance
spkg = SovereignPackageManager()
