use serde::{Deserialize, Serialize};
use std::collections::HashSet;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ShieldMode {
    DeepFlow,
    Pomodoro,
    RestBreak,
    StrictLockdown,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FirewallRule {
    pub domain: String,
    pub category: String,
    pub blocks_count: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ShieldSession {
    pub mode: ShieldMode,
    pub duration_secs: u64,
    pub elapsed_secs: u64,
    pub active: bool,
    pub intercepts: u64,
}

pub struct FocusShield {
    rules: Vec<FirewallRule>,
    blocked_set: HashSet<String>,
    session: ShieldSession,
}

impl FocusShield {
    pub fn new() -> Self {
        let mut shield = Self {
            rules: Vec::new(),
            blocked_set: HashSet::new(),
            session: ShieldSession {
                mode: ShieldMode::DeepFlow,
                duration_secs: 90 * 60,
                elapsed_secs: 0,
                active: false,
                intercepts: 0,
            },
        };

        // Seed default distraction blocklist
        shield.add_rule("instagram.com", "Social");
        shield.add_rule("x.com", "Social");
        shield.add_rule("reddit.com", "Social");
        shield.add_rule("youtube.com", "Entertainment");
        shield.add_rule("netflix.com", "Entertainment");
        shield.add_rule("tiktok.com", "Social");

        shield
    }

    pub fn add_rule(&mut self, domain: &str, category: &str) {
        let clean = domain.trim().to_lowercase();
        if !self.blocked_set.contains(&clean) {
            self.blocked_set.insert(clean.clone());
            self.rules.push(FirewallRule {
                domain: clean,
                category: category.to_string(),
                blocks_count: 0,
            });
        }
    }

    pub fn check_intercept(&mut self, request_domain: &str) -> bool {
        if !self.session.active {
            return false;
        }

        let clean = request_domain.trim().to_lowercase();
        for rule in &mut self.rules {
            if clean.contains(&rule.domain) || rule.domain.contains(&clean) {
                rule.blocks_count += 1;
                self.session.intercepts += 1;
                return true;
            }
        }
        false
    }

    pub fn start_session(&mut self, mode: ShieldMode, duration_secs: u64) {
        self.session.mode = mode;
        self.session.duration_secs = duration_secs;
        self.session.elapsed_secs = 0;
        self.session.active = true;
    }

    pub fn tick_second(&mut self) -> bool {
        if self.session.active && self.session.elapsed_secs < self.session.duration_secs {
            self.session.elapsed_secs += 1;
            if self.session.elapsed_secs >= self.session.duration_secs {
                self.session.active = false;
                return true; // Completed
            }
        }
        false
    }

    pub fn get_rules(&self) -> &[FirewallRule] {
        &self.rules
    }

    pub fn get_session(&self) -> &ShieldSession {
        &self.session
    }
}
