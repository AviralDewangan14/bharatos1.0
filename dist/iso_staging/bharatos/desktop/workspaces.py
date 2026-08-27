"""
BharatOS Virtual Workspaces & 3D Spatial Window Tiling Manager.
Manages multi-monitor virtual desktops, window quadrant snapping, and spatial transitions.
"""

from typing import Dict, Any, List, Optional, Tuple

class WorkspaceManager:
    """Manages virtual desktops and window snapping layouts."""

    def __init__(self):
        self.workspaces = [
            {
                "id": 1,
                "name": "Workspace 1: Swaraj Core",
                "icon": "☸️",
                "active_apps": ["files-window", "terminal-window", "appstore-window"]
            },
            {
                "id": 2,
                "name": "Workspace 2: Vulkan 144 FPS Gaming",
                "icon": "🎮",
                "active_apps": ["gaming-window", "solaris-window"]
            },
            {
                "id": 3,
                "name": "Workspace 3: Indic Code Studio",
                "icon": "💻",
                "active_apps": ["ide-window", "terminal-window", "taskmanager-window"]
            },
            {
                "id": 4,
                "name": "Workspace 4: Sovereign Productivity",
                "icon": "📝",
                "active_apps": ["notes-window", "calculator-window", "panchang-window"]
            }
        ]
        self.active_workspace_id = 1
        self.snap_layouts = [
            "HALF_LEFT",
            "HALF_RIGHT",
            "QUAD_TOP_LEFT",
            "QUAD_TOP_RIGHT",
            "QUAD_BOTTOM_LEFT",
            "QUAD_BOTTOM_RIGHT",
            "FULL_MAXIMIZE",
            "CENTER_FOCUS",
            "THREE_COLUMN_LEFT",
            "THREE_COLUMN_CENTER",
            "THREE_COLUMN_RIGHT"
        ]

    def switch_workspace(self, workspace_id: int) -> Dict[str, Any]:
        """Switches current active virtual desktop."""
        target = next((w for w in self.workspaces if w["id"] == workspace_id), None)
        if target:
            self.active_workspace_id = workspace_id
            return {
                "success": True,
                "current_workspace": self.active_workspace_id,
                "name": target["name"],
                "icon": target["icon"],
                "active_apps": target["active_apps"]
            }
        return {"success": False, "error": f"Workspace {workspace_id} not found."}

    def assign_app_to_workspace(self, app_id: str, workspace_id: int) -> Dict[str, Any]:
        """Assigns an application window to a specific virtual workspace."""
        for ws in self.workspaces:
            if app_id in ws["active_apps"]:
                ws["active_apps"].remove(app_id)
        
        target = next((w for w in self.workspaces if w["id"] == workspace_id), None)
        if target:
            target["active_apps"].append(app_id)
            return {"success": True, "app_id": app_id, "workspace_id": workspace_id}
        return {"success": False, "error": f"Workspace {workspace_id} not found."}

    def calculate_tiling_bounds(self, layout: str, screen_w: int = 1920, screen_h: int = 1080, margin: int = 16, top_bar: int = 48, bottom_bar: int = 56) -> Dict[str, int]:
        """Calculates pixel bounds for 3D liquid glass snapping presets."""
        usable_w = screen_w - (margin * 2)
        usable_h = screen_h - top_bar - bottom_bar - (margin * 2)
        start_y = top_bar + margin
        start_x = margin

        half_w = int(usable_w / 2) - int(margin / 2)
        half_h = int(usable_h / 2) - int(margin / 2)

        if layout == "HALF_LEFT":
            return {"left": start_x, "top": start_y, "width": half_w, "height": usable_h}
        elif layout == "HALF_RIGHT":
            return {"left": start_x + half_w + margin, "top": start_y, "width": half_w, "height": usable_h}
        elif layout == "QUAD_TOP_LEFT":
            return {"left": start_x, "top": start_y, "width": half_w, "height": half_h}
        elif layout == "QUAD_TOP_RIGHT":
            return {"left": start_x + half_w + margin, "top": start_y, "width": half_w, "height": half_h}
        elif layout == "QUAD_BOTTOM_LEFT":
            return {"left": start_x, "top": start_y + half_h + margin, "width": half_w, "height": half_h}
        elif layout == "QUAD_BOTTOM_RIGHT":
            return {"left": start_x + half_w + margin, "top": start_y + half_h + margin, "width": half_w, "height": half_h}
        elif layout == "CENTER_FOCUS":
            center_w = int(usable_w * 0.7)
            center_h = int(usable_h * 0.8)
            return {"left": start_x + int((usable_w - center_w) / 2), "top": start_y + int((usable_h - center_h) / 2), "width": center_w, "height": center_h}
        else: # FULL_MAXIMIZE
            return {"left": start_x, "top": start_y, "width": usable_w, "height": usable_h}

    def get_status(self) -> Dict[str, Any]:
        return {
            "active_id": self.active_workspace_id,
            "workspaces": self.workspaces,
            "snap_layouts": self.snap_layouts
        }


# Global instance
workspace_manager = WorkspaceManager()
