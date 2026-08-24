"""
Advanced Developer Simulation Engine.
Generates production-grade, highly sophisticated code architectures across
Rust, TypeScript, Python, Go, CSS, and Markdown to maintain top-tier activity metrics.
"""

import random
import time
from typing import Dict, List, Any, Optional

CODE_TEMPLATES: Dict[str, List[str]] = {
    "Rust": [
        """// Advanced Spatial Hash Grid & 2D Physics Collider Engine
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Vector2D {
    pub x: f32,
    pub y: f32,
}

impl Vector2D {
    pub fn new(x: f32, y: f32) -> Self { Self { x, y } }
    pub fn dot(&self, other: &Self) -> f32 { self.x * other.x + self.y * other.y }
    pub fn magnitude_squared(&self) -> f32 { self.dot(self) }
    pub fn normalize(&self) -> Self {
        let mag = self.magnitude_squared().sqrt();
        if mag > 0.0001 { Self::new(self.x / mag, self.y / mag) } else { *self }
    }
}

#[derive(Clone, Debug)]
pub struct RigidBody {
    pub id: u64,
    pub position: Vector2D,
    pub velocity: Vector2D,
    pub radius: f32,
    pub mass: f32,
    pub is_static: bool,
}

pub struct SpatialHashGrid {
    cell_size: f32,
    grid: HashMap<(i32, i32), Vec<u64>>,
}

impl SpatialHashGrid {
    pub fn new(cell_size: f32) -> Self {
        Self { cell_size, grid: HashMap::new() }
    }

    fn hash_coords(&self, pos: &Vector2D) -> (i32, i32) {
        ((pos.x / self.cell_size).floor() as i32, (pos.y / self.cell_size).floor() as i32)
    }

    pub fn insert(&mut self, body: &RigidBody) {
        let key = self.hash_coords(&body.position);
        self.grid.entry(key).or_default().push(body.id);
    }

    pub fn query_potential_collisions(&self, body: &RigidBody) -> Vec<u64> {
        let (cx, cy) = self.hash_coords(&body.position);
        let mut candidates = Vec::new();
        for dx in -1..=1 {
            for dy in -1..=1 {
                if let Some(ids) = self.grid.get(&(cx + dx, cy + dy)) {
                    candidates.extend(ids.iter().filter(|&&id| id != body.id));
                }
            }
        }
        candidates
    }
}
""",
        """// Asynchronous High-Throughput Event Streaming Core
use tokio::sync::mpsc;
use std::sync::atomic::{AtomicU64, Ordering};

#[derive(Debug, Clone)]
pub struct TelemetryPacket {
    pub sequence_number: u64,
    pub timestamp_epoch_ms: u64,
    pub source_node: [u8; 16],
    pub payload: Vec<u8>,
}

pub struct StreamProcessingPipeline {
    tx: mpsc::Sender<TelemetryPacket>,
    processed_counter: AtomicU64,
}

impl StreamProcessingPipeline {
    pub fn new(capacity: usize) -> (Self, mpsc::Receiver<TelemetryPacket>) {
        let (tx, rx) = mpsc::channel(capacity);
        (Self { tx, processed_counter: AtomicU64::new(0) }, rx)
    }

    pub async fn emit_telemetry(&self, payload: Vec<u8>, source: [u8; 16]) -> Result<(), &'static str> {
        let seq = self.processed_counter.fetch_add(1, Ordering::SeqCst);
        let packet = TelemetryPacket {
            sequence_number: seq,
            timestamp_epoch_ms: std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap_or_default()
                .as_millis() as u64,
            source_node: source,
            payload,
        };
        self.tx.send(packet).await.map_err(|_| "Pipeline channel saturated")
    }
}
"""
    ],
    "TypeScript": [
        """// High-Performance Specular Shader & WebGL Audio Visualizer Canvas
import React, { useRef, useEffect, useCallback, useMemo } from 'react';

export interface VisualizerSpectrumProps {
    fftSize?: number;
    smoothingTimeConstant?: number;
    colorPalette?: 'cyan-emerald' | 'amber-violet' | 'aurora-borealis';
    onFrameRender?: (avgEnergy: number) => void;
}

export const ShaderSpectrumVisualizer: React.FC<VisualizerSpectrumProps> = ({
    fftSize = 256,
    smoothingTimeConstant = 0.85,
    colorPalette = 'cyan-emerald',
    onFrameRender,
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animFrameRef = useRef<number>(0);

    const initAudioGraph = useCallback(async () => {
        if (!audioContextRef.current) {
            const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            const analyser = ctx.createAnalyser();
            analyser.fftSize = fftSize;
            analyser.smoothingTimeConstant = smoothingTimeConstant;
            audioContextRef.current = ctx;
            analyserRef.current = analyser;
        }
    }, [fftSize, smoothingTimeConstant]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = fftSize / 2;
        const dataArray = new Uint8Array(bufferLength);

        const renderLoop = () => {
            animFrameRef.current = requestAnimationFrame(renderLoop);
            if (analyserRef.current) {
                analyserRef.current.getByteFrequencyData(dataArray);
            }

            ctx.fillStyle = 'rgba(8, 12, 20, 0.25)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.2;
            let x = 0;
            let sumEnergy = 0;

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;
                sumEnergy += dataArray[i];

                const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
                gradient.addColorStop(0, '#00e5ff');
                gradient.addColorStop(1, '#10b981');

                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
                x += barWidth;
            }

            onFrameRender?.(sumEnergy / bufferLength);
        };

        renderLoop();
        return () => cancelAnimationFrame(animFrameRef.current);
    }, [fftSize, onFrameRender]);

    return (
        <div className="relative rounded-2xl overflow-hidden bg-slate-950/80 border border-slate-800 p-2 shadow-2xl backdrop-blur-xl">
            <canvas ref={canvasRef} width={800} height={260} className="w-full h-auto rounded-xl" />
        </div>
    );
};
""",
        """// Strict Quaternion Math Engine & 3D Orientation Filter
export class Quaternion {
    constructor(
        public w: number = 1,
        public x: number = 0,
        public y: number = 0,
        public z: number = 0
    ) {}

    public static fromEuler(pitch: number, yaw: number, roll: number): Quaternion {
        const c1 = Math.cos(pitch / 2);
        const c2 = Math.cos(yaw / 2);
        const c3 = Math.cos(roll / 2);
        const s1 = Math.sin(pitch / 2);
        const s2 = Math.sin(yaw / 2);
        const s3 = Math.sin(roll / 2);

        return new Quaternion(
            c1 * c2 * c3 - s1 * s2 * s3,
            s1 * c2 * c3 + c1 * s2 * s3,
            c1 * s2 * c3 - s1 * c2 * s3,
            c1 * c2 * s3 + s1 * s2 * c3
        );
    }

    public multiply(q: Quaternion): Quaternion {
        return new Quaternion(
            this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z,
            this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
            this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
            this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w
        );
    }

    public normalize(): Quaternion {
        const len = Math.hypot(this.w, this.x, this.y, this.z);
        if (len < 1e-6) return new Quaternion(1, 0, 0, 0);
        return new Quaternion(this.w / len, this.x / len, this.y / len, this.z / len);
    }
}
"""
    ],
    "Python": [
        """# Multi-Head Latent Attention with RoPE Rotary Positional Embeddings
import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Optional, Tuple

class RotaryPositionalEmbedding(nn.Module):
    \"\"\"Rotary Positional Embeddings (RoPE) for invariant token distance modeling.\"\"\"

    def __init__(self, dim: int, max_seq_len: int = 8192, base: float = 10000.0):
        super().__init__()
        self.dim = dim
        inv_freq = 1.0 / (base ** (torch.arange(0, dim, 2).float() / dim))
        self.register_buffer("inv_freq", inv_freq)
        self._build_cache(max_seq_len)

    def _build_cache(self, seq_len: int):
        t = torch.arange(seq_len, dtype=torch.float32)
        freqs = torch.outer(t, self.inv_freq)
        emb = torch.cat((freqs, freqs), dim=-1)
        self.register_buffer("cos_cached", emb.cos(), persistent=False)
        self.register_buffer("sin_cached", emb.sin(), persistent=False)

    def forward(self, x: torch.Tensor, seq_len: int) -> Tuple[torch.Tensor, torch.Tensor]:
        return self.cos_cached[:seq_len, :], self.sin_cached[:seq_len, :]

class MultiHeadLatentAttention(nn.Module):
    def __init__(self, d_model: int = 1024, n_heads: int = 16, d_latent: int = 256):
        super().__init__()
        self.n_heads = n_heads
        self.head_dim = d_model // n_heads
        self.q_proj = nn.Linear(d_model, d_latent, bias=False)
        self.kv_proj = nn.Linear(d_model, d_latent * 2, bias=False)
        self.out_proj = nn.Linear(d_model, d_model, bias=False)
        self.rope = RotaryPositionalEmbedding(self.head_dim)

    def forward(self, x: torch.Tensor, mask: Optional[torch.Tensor] = None) -> torch.Tensor:
        B, S, D = x.shape
        q = self.q_proj(x).view(B, S, self.n_heads, -1).transpose(1, 2)
        kv = self.kv_proj(x)
        k, v = torch.chunk(kv, 2, dim=-1)
        k = k.view(B, S, self.n_heads, -1).transpose(1, 2)
        v = v.view(B, S, self.n_heads, -1).transpose(1, 2)

        scores = torch.matmul(q, k.transpose(-2, -1)) / (self.head_dim ** 0.5)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        weights = F.softmax(scores, dim=-1)
        out = torch.matmul(weights, v).transpose(1, 2).contiguous().view(B, S, -1)
        return self.out_proj(out)
""",
        """# Asynchronous Distributed Raft Consensus Finite State Machine
import asyncio
import time
import logging
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any

@dataclass
class LogEntry:
    term: int
    index: int
    command: Dict[str, Any]
    timestamp: float = field(default_factory=time.time)

class RaftStateMachine:
    \"\"\"Replicated in-memory key-value state machine with atomic linearizability.\"\"\"

    def __init__(self, node_id: str):
        self.node_id = node_id
        self.current_term: int = 0
        self.voted_for: Optional[str] = None
        self.log: List[LogEntry] = []
        self.commit_index: int = 0
        self.last_applied: int = 0
        self.state_store: Dict[str, Any] = {}
        self.is_leader: bool = False

    def apply_log_entry(self, entry: LogEntry) -> Any:
        cmd = entry.command
        op = cmd.get("op")
        key = cmd.get("key")
        val = cmd.get("value")

        if op == "SET":
            self.state_store[key] = val
            return val
        elif op == "DELETE":
            return self.state_store.pop(key, None)
        return self.state_store.get(key)
"""
    ],
    "Go": [
        """package consensus

import (
	"context"
	"fmt"
	"sync"
	"time"
)

type NodeRole string

const (
	RoleFollower  NodeRole = "FOLLOWER"
	RoleCandidate NodeRole = "CANDIDATE"
	RoleLeader    NodeRole = "LEADER"
)

type RaftNode struct {
	mu          sync.RWMutex
	nodeID      string
	currentTerm uint64
	role        NodeRole
	peers       []string
	heartbeatCh chan struct{}
}

func NewRaftNode(id string, peers []string) *RaftNode {
	return &RaftNode{
		nodeID:      id,
		currentTerm: 0,
		role:        RoleFollower,
		peers:       peers,
		heartbeatCh: make(chan struct{}, 16),
	}
}

func (r *RaftNode) RunElectionTimer(ctx context.Context) {
	for {
		select {
		case <-ctx.Done():
			return
		case <-time.After(150 * time.Millisecond):
			r.mu.Lock()
			if r.role != RoleLeader {
				r.role = RoleCandidate
				r.currentTerm++
				go r.startElection()
			}
			r.mu.Unlock()
		case <-r.heartbeatCh:
			// Reset timer upon valid leader heartbeat
		}
	}
}

func (r *RaftNode) startElection() {
	// RequestVotes RPC dispatch to cluster peers
}
"""
    ]
}

PROJECT_FILE_MAP = {
    "arcade-solaris-engine": [
        {"entity": "src/engine/spatial_grid.rs", "language": "Rust"},
        {"entity": "src/physics/collision_2d.rs", "language": "Rust"},
        {"entity": "src/core/math.rs", "language": "Rust"},
        {"entity": "Cargo.toml", "language": "TOML"},
        {"entity": "README.md", "language": "Markdown"}
    ],
    "lumina-ai-studio": [
        {"entity": "src/components/AudioVisualizer.tsx", "language": "TypeScript"},
        {"entity": "src/core/math/quaternion.ts", "language": "TypeScript"},
        {"entity": "src/styles/specular.css", "language": "CSS"},
        {"entity": "src/pages/index.tsx", "language": "TypeScript"},
        {"entity": "package.json", "language": "JSON"}
    ],
    "neural-symphony-ai": [
        {"entity": "core/attention/rope.py", "language": "Python"},
        {"entity": "core/models/transformer.py", "language": "Python"},
        {"entity": "core/training/scheduler.py", "language": "Python"},
        {"entity": "docs/architecture.md", "language": "Markdown"}
    ],
    "nebula-distributed-db": [
        {"entity": "pkg/consensus/raft_fsm.go", "language": "Go"},
        {"entity": "pkg/storage/wal_log.go", "language": "Go"},
        {"entity": "services/cluster_manager.py", "language": "Python"},
        {"entity": "deploy/docker-compose.yml", "language": "YAML"}
    ]
}


class SimulatedProjectState:
    def __init__(self, project_name: str, file_list: List[Dict[str, str]]):
        self.project_name = project_name
        self.files = file_list
        self.file_states: Dict[str, Dict[str, Any]] = {}
        for f in file_list:
            lang = f["language"]
            templates = CODE_TEMPLATES.get(lang, CODE_TEMPLATES["TypeScript"])
            initial_content = random.choice(templates)
            lines = initial_content.splitlines()
            self.file_states[f["entity"]] = {
                "content": initial_content,
                "lines": len(lines),
                "lineno": random.randint(1, max(1, len(lines))),
                "cursorpos": random.randint(1, 40),
                "language": lang,
                "version": 1
            }

    def simulate_step(self, entity: str) -> Dict[str, Any]:
        state = self.file_states[entity]
        lang = state["language"]
        lines = state["content"].splitlines()

        action = random.choice(["edit_line", "add_comment", "append_block", "cursor_jump"])

        if action == "add_comment":
            comment_syntax = "#" if lang in ["Python", "YAML", "TOML"] else "//"
            comment = f" {comment_syntax} [Refactor: {time.strftime('%H:%M:%S')}] Optimized memory path"
            idx = random.randint(0, len(lines) - 1)
            lines.insert(idx, comment)
            state["lineno"] = idx + 1
            state["cursorpos"] = len(comment)
        elif action == "append_block":
            templates = CODE_TEMPLATES.get(lang, CODE_TEMPLATES["TypeScript"])
            extra = random.choice(templates).splitlines()[:random.randint(3, 8)]
            lines.extend(extra)
            state["lineno"] = len(lines)
            state["cursorpos"] = 12
        elif action == "edit_line":
            if lines:
                idx = random.randint(0, len(lines) - 1)
                lines[idx] = lines[idx] + f"  /* updated */" if lang != "Python" else lines[idx] + "  # updated"
                state["lineno"] = idx + 1
                state["cursorpos"] = len(lines[idx])
        else:
            state["lineno"] = random.randint(1, max(1, len(lines)))
            state["cursorpos"] = random.randint(1, 50)

        state["content"] = "\n".join(lines)
        state["lines"] = len(lines)
        state["version"] += 1
        return state


class SimulationEngine:
    def __init__(self, active_projects: Optional[List[Dict[str, Any]]] = None):
        self.projects: Dict[str, SimulatedProjectState] = {}
        for name, files in PROJECT_FILE_MAP.items():
            self.projects[name] = SimulatedProjectState(name, files)

        self.current_project_name = list(self.projects.keys())[0]
        self.current_entity_idx = 0
        self.step_counter = 0

    def get_next_heartbeat_payload(self) -> Dict[str, Any]:
        self.step_counter += 1

        if self.step_counter % random.randint(12, 20) == 0:
            self.current_project_name = random.choice(list(self.projects.keys()))
            self.current_entity_idx = 0

        project_state = self.projects[self.current_project_name]
        files = project_state.files

        if random.random() < 0.35:
            self.current_entity_idx = random.randint(0, len(files) - 1)

        file_info = files[self.current_entity_idx]
        entity = file_info["entity"]
        file_state = project_state.simulate_step(entity)

        is_write = random.random() < 0.45
        now = time.time()
        branch = random.choice(["main", "feature/spatial-optimization", "refactor/simd-acceleration"])

        payload = {
            "entity": entity,
            "type": "file",
            "time": now,
            "project": self.current_project_name,
            "branch": branch,
            "language": file_state["language"],
            "is_write": is_write,
            "category": "coding",
            "lines": file_state["lines"],
            "lineno": file_state["lineno"],
            "cursorpos": file_state["cursorpos"],
            "editor": "VS Code",
            "operating_system": "Windows"
        }

        return {
            "payload": payload,
            "file_content": file_state["content"],
            "entity": entity,
            "project": self.current_project_name,
            "language": file_state["language"]
        }


simulation_engine = SimulationEngine()
