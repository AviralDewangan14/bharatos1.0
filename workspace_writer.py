"""
Physical Workspace Writer.
Maintains realistic local files and directories on disk, updating them continuously
to trigger local filesystem watchers, VS Code WakaTime extensions, and Git trees.
"""

import os
from pathlib import Path
from typing import Dict, Any, Optional

BASE_WORKSPACE_DIR = Path(__file__).parent / "simulated_workspaces"

class WorkspaceWriter:
    """Manages physical code files on the local filesystem."""

    def __init__(self, workspace_root: Optional[Path] = None):
        self.workspace_root = workspace_root or BASE_WORKSPACE_DIR
        self.workspace_root.mkdir(parents=True, exist_ok=True)
        self.total_physical_writes: int = 0
        self.last_written_file: Optional[str] = None

    def write_simulated_file(self, project: str, relative_entity_path: str, content: str) -> Path:
        """Writes the simulated code content to disk inside the project workspace directory."""
        project_dir = self.workspace_root / project
        target_file = project_dir / relative_entity_path

        # Ensure parent directories exist
        target_file.parent.mkdir(parents=True, exist_ok=True)

        try:
            with open(target_file, "w", encoding="utf-8") as f:
                f.write(content)
            self.total_physical_writes += 1
            self.last_written_file = str(target_file)
            return target_file
        except Exception as err:
            print(f"[WorkspaceWriter] Error writing to {target_file}: {err}")
            return target_file


# Global workspace writer instance
workspace_writer = WorkspaceWriter()
