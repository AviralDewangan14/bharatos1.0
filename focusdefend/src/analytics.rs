// ==============================================================================
// FOCUSDEFEND: FOCUS SCORE & ERGONOMIC FLOW ANALYTICS
// Developer: Aviral Dewangan | Architecture: High-Performance Rust Core
// ==============================================================================

use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FocusMetrics {
    pub focus_score: f32,          // 0.0 to 100.0
    pub current_streak_mins: u32,
    pub total_focus_hours_today: f32,
    pub distractions_defended: u64,
    pub eye_strain_warning: bool,
    pub flow_state_tier: String,   // "DEEP_ALPHA", "HIGH_BETA", "WARMUP"
    pub last_updated: DateTime<Utc>,
}

pub struct FocusAnalyticsEngine {
    session_start: DateTime<Utc>,
    last_defended_count: u64,
}

impl FocusAnalyticsEngine {
    pub fn new() -> Self {
        Self {
            session_start: Utc::now(),
            last_defended_count: 0,
        }
    }

    pub fn compute_metrics(&mut self, total_intercepts: u64, elapsed_seconds: f64) -> FocusMetrics {
        let elapsed_mins = (elapsed_seconds / 60.0) as u32;
        let hours_today = (elapsed_seconds / 3600.0) as f32;

        // Focus Score calculation: base 92.0 + bonus for long streaks, minus penalty for recent distractions
        let streak_bonus = (elapsed_mins as f32 * 0.15).min(8.0);
        let penalty = ((total_intercepts.saturating_sub(self.last_defended_count)) as f32 * 1.5).min(15.0);
        let score = (92.0 + streak_bonus - penalty).clamp(65.0, 99.8);

        let tier = if score >= 95.0 {
            "DEEP_ALPHA (Ultra Flow State)".to_string()
        } else if score >= 85.0 {
            "HIGH_BETA (High Concentration)".to_string()
        } else {
            "WARMUP (Active Focus)".to_string()
        };

        // 20-20-20 rule check (warn every 20 mins of continuous focus)
        let eye_warning = (elapsed_mins > 0) && (elapsed_mins % 20 == 0);

        FocusMetrics {
            focus_score: score,
            current_streak_mins: elapsed_mins,
            total_focus_hours_today: hours_today,
            distractions_defended: total_intercepts,
            eye_strain_warning: eye_warning,
            flow_state_tier: tier,
            last_updated: Utc::now(),
        }
    }
}
