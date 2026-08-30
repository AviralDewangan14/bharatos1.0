// ==============================================================================
// FOCUSDEFEND: SOVEREIGN DEEP-WORK SHIELD & DISTRACTION INTERCEPTOR
// Developer: Aviral Dewangan | Architecture: High-Performance Rust Core
// ==============================================================================

use std::collections::HashSet;
use std::sync::Arc;
use tokio::sync::RwLock;
use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ShieldRule {
    pub domain_or_process: String,
    pub is_wildcard: bool,
    pub category: String, // "social_media", "video_streaming", "gaming", "custom"
    pub total_blocks_count: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ShieldState {
    pub is_active: bool,
    pub mode: String, // "STRICT_LOCKDOWN", "POMODORO_GUARD", "FLOW_STATE"
    pub active_session_started: Option<DateTime<Utc>>,
    pub total_intercepts: u64,
    pub blocked_domains: Vec<String>,
    pub blocked_processes: Vec<String>,
}

pub struct FocusShieldCore {
    state: Arc<RwLock<ShieldState>>,
    blacklist_domains: Arc<RwLock<HashSet<String>>>,
    blacklist_processes: Arc<RwLock<HashSet<String>>>,
}

impl FocusShieldCore {
    pub fn new() -> Self {
        let mut default_domains = HashSet::new();
        for d in &[
            "youtube.com", "instagram.com", "x.com", "twitter.com",
            "facebook.com", "reddit.com", "tiktok.com", "netflix.com",
            "twitch.tv", "discord.com", "steamcommunity.com"
        ] {
            default_domains.insert(d.to_string());
        }

        let mut default_procs = HashSet::new();
        for p in &["steam.exe", "discord.exe", "epicgameslauncher.exe", "spotify.exe"] {
            default_procs.insert(p.to_string());
        }

        let initial_state = ShieldState {
            is_active: true,
            mode: "FLOW_STATE".to_string(),
            active_session_started: Some(Utc::now()),
            total_intercepts: 0,
            blocked_domains: default_domains.iter().cloned().collect(),
            blocked_processes: default_procs.iter().cloned().collect(),
        };

        Self {
            state: Arc::new(RwLock::new(initial_state)),
            blacklist_domains: Arc::new(RwLock::new(default_domains)),
            blacklist_processes: Arc::new(RwLock::new(default_procs)),
        }
    }

    /// Evaluates whether an outgoing connection / DNS query or process execution should be intercepted
    pub async fn check_and_intercept(&self, target: &str) -> bool {
        let domains = self.blacklist_domains.read().await;
        let procs = self.blacklist_processes.read().await;
        let mut state = self.state.write().await;

        if !state.is_active {
            return false;
        }

        let lower_target = target.to_lowercase();
        let should_block = domains.iter().any(|d| lower_target.contains(d)) 
            || procs.iter().any(|p| lower_target.contains(p));

        if should_block {
            state.total_intercepts += 1;
            println!("🛡️ [FOCUSDEFEND INTERCEPT] Blocked distracting attempt: {}", target);
        }

        should_block
    }

    pub async fn toggle_shield(&self, enable: bool, mode: Option<&str>) -> ShieldState {
        let mut state = self.state.write().await;
        state.is_active = enable;
        if let Some(m) = mode {
            state.mode = m.to_string();
        }
        if enable && state.active_session_started.is_none() {
            state.active_session_started = Some(Utc::now());
        } else if !enable {
            state.active_session_started = None;
        }
        state.clone()
    }

    pub async fn get_state(&self) -> ShieldState {
        self.state.read().await.clone()
    }
}
