use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DailyStat {
    pub day: String,
    pub focus_minutes: u32,
    pub sessions_count: u32,
    pub intercepts_count: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FocusMetrics {
    pub total_focus_minutes_today: u32,
    pub current_streak_days: u32,
    pub deep_work_score: u32, // Percentage 0-100
    pub total_distractions_blocked: u64,
    pub weekly_history: Vec<DailyStat>,
}

pub struct AnalyticsEngine {
    metrics: FocusMetrics,
}

impl AnalyticsEngine {
    pub fn new() -> Self {
        Self {
            metrics: FocusMetrics {
                total_focus_minutes_today: 145,
                current_streak_days: 7,
                deep_work_score: 96,
                total_distractions_blocked: 80,
                weekly_history: vec![
                    DailyStat { day: "Mon".to_string(), focus_minutes: 180, sessions_count: 2, intercepts_count: 14 },
                    DailyStat { day: "Tue".to_string(), focus_minutes: 210, sessions_count: 3, intercepts_count: 19 },
                    DailyStat { day: "Wed".to_string(), focus_minutes: 120, sessions_count: 2, intercepts_count: 8 },
                    DailyStat { day: "Thu".to_string(), focus_minutes: 240, sessions_count: 3, intercepts_count: 22 },
                    DailyStat { day: "Fri".to_string(), focus_minutes: 195, sessions_count: 2, intercepts_count: 11 },
                    DailyStat { day: "Sat".to_string(), focus_minutes: 90, sessions_count: 1, intercepts_count: 3 },
                    DailyStat { day: "Sun".to_string(), focus_minutes: 145, sessions_count: 2, intercepts_count: 3 },
                ],
            },
        }
    }

    pub fn record_session(&mut self, minutes: u32, intercepts: u64) {
        self.metrics.total_focus_minutes_today += minutes;
        self.metrics.total_distractions_blocked += intercepts;
        self.metrics.deep_work_score = std::cmp::min(100, 85 + (self.metrics.total_focus_minutes_today / 15));
    }

    pub fn get_metrics(&self) -> &FocusMetrics {
        &self.metrics
    }
}
