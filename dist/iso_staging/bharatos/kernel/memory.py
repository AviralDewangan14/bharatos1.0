"""
BharatOS Kernel Memory Management & Power/Battery Subsystem.
Provides live metrics for Virtual Memory, Physical Page Frame Allocator,
Slab Allocations, Page Cache, and Power Profiles.
"""

import time
import math
from typing import Dict, Any, List

class MemorySubsystem:
    """Manages virtual memory paging, physical RAM frames, and slab caches."""

    def __init__(self, total_ram_mb: int = 16384):
        self.total_ram_mb = total_ram_mb
        self.total_frames = (total_ram_mb * 1024 * 1024) // 4096  # 4M 4KB frames for 16GB
        self.kernel_heap_mb = 12.4
        self.page_cache_mb = 18.2
        self.apps_memory_mb = 24.8
        self.swap_total_mb = 4096
        self.swap_used_mb = 0
        self.power_profile = "BALANCED"  # HIGH_PERFORMANCE, BALANCED, BATTERY_SAVER
        self.battery_level = 94.0
        self.is_charging = True
        self.battery_health = 98.5

    def get_memory_stats(self) -> Dict[str, Any]:
        used_mb = round(self.kernel_heap_mb + self.page_cache_mb + self.apps_memory_mb, 2)
        free_mb = round(self.total_ram_mb - used_mb, 2)
        used_pct = round((used_mb / self.total_ram_mb) * 100, 1)

        return {
            "total_ram_mb": self.total_ram_mb,
            "used_ram_mb": used_mb,
            "free_ram_mb": free_mb,
            "used_percent": used_pct,
            "kernel_heap_mb": self.kernel_heap_mb,
            "page_cache_mb": self.page_cache_mb,
            "apps_memory_mb": self.apps_memory_mb,
            "swap_total_mb": self.swap_total_mb,
            "swap_used_mb": self.swap_used_mb,
            "page_size_kb": 4,
            "paging_mode": "4-Level 64-bit PML4"
        }

    def get_battery_stats(self) -> Dict[str, Any]:
        return {
            "level": self.battery_level,
            "is_charging": self.is_charging,
            "health": self.battery_health,
            "power_profile": self.power_profile,
            "time_remaining_minutes": 520 if not self.is_charging else "Charging (Full in 28 mins)"
        }

    def set_power_profile(self, profile: str) -> bool:
        if profile in ["HIGH_PERFORMANCE", "BALANCED", "BATTERY_SAVER"]:
            self.power_profile = profile
            return True
        return False

    def purge_page_cache(self) -> float:
        """Frees page cache blocks."""
        freed = self.page_cache_mb * 0.7
        self.page_cache_mb = round(self.page_cache_mb * 0.3, 2)
        return round(freed, 2)


# Global instance
memory_subsystem = MemorySubsystem()
