use focusdefend::{FocusShield, AnalyticsEngine, ShieldMode};
use std::env;

fn print_banner() {
    println!("============================================================");
    println!(" FOCUSDEFEND v1.0 — Deep-Work Shield & Firewall");
    println!(" Sovereign Focus & Distraction Defense Engine for BharatOS");
    println!(" Author: Aviral Dewangan");
    println!("============================================================");
}

fn print_help() {
    print_banner();
    println!("Usage:");
    println!("  focusdefend status            - Show current shield status and rules");
    println!("  focusdefend start [mode]      - Engage shield (deepflow, pomodoro, rest)");
    println!("  focusdefend block <domain>    - Add a domain to the firewall blocklist");
    println!("  focusdefend stats             - Display today's focus metrics and streak");
    println!("  focusdefend check <domain>    - Test if a domain would be intercepted");
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let mut shield = FocusShield::new();
    let analytics = AnalyticsEngine::new();

    if args.len() < 2 {
        print_help();
        return;
    }

    match args[1].as_str() {
        "status" => {
            print_banner();
            let session = shield.get_session();
            println!("Shield Status: {}", if session.active { "ENGAGED (ACTIVE)" } else { "STANDBY" });
            println!("Active Rules Count: {}", shield.get_rules().len());
            println!("\nFirewall Blocklist:");
            for r in shield.get_rules() {
                println!("  - {:<20} [{}] ({} blocks)", r.domain, r.category, r.blocks_count);
            }
        }
        "start" => {
            let mode_str = args.get(2).map(|s| s.as_str()).unwrap_or("deepflow");
            let (mode, mins) = match mode_str {
                "pomodoro" => (ShieldMode::Pomodoro, 25),
                "rest" => (ShieldMode::RestBreak, 5),
                _ => (ShieldMode::DeepFlow, 90),
            };
            shield.start_session(mode, mins * 60);
            print_banner();
            println!("🛡️ Focus Shield ENGAGED for {} minutes ({} mode)", mins, mode_str);
            println!("Distraction Firewall is now active. All quarantined domains will be dropped.");
        }
        "block" => {
            if let Some(domain) = args.get(2) {
                shield.add_rule(domain, "Custom");
                println!("✅ Added '{}' to FocusDefend firewall rules.", domain);
            } else {
                println!("Error: Please provide a domain name (e.g. focusdefend block x.com)");
            }
        }
        "check" => {
            if let Some(domain) = args.get(2) {
                let intercepted = shield.check_intercept(domain);
                if intercepted {
                    println!("🛑 INTERCEPTED: '{}' matched an active firewall rule and was dropped.", domain);
                } else {
                    println!("🟢 PERMITTED: '{}' is allowed through the firewall.", domain);
                }
            }
        }
        "stats" => {
            print_banner();
            let metrics = analytics.get_metrics();
            println!("Today's Focus:       {} minutes", metrics.total_focus_minutes_today);
            println!("Active Streak:       {} consecutive days 🔥", metrics.current_streak_days);
            println!("Deep-Work Score:     {}%", metrics.deep_work_score);
            println!("Total Intercepts:    {} distraction attempts dropped", metrics.total_distractions_blocked);
            println!("\nWeekly Focus History:");
            for day in &metrics.weekly_history {
                println!("  {:<4}: {:>3} mins ({} sessions, {} blocks)", day.day, day.focus_minutes, day.sessions_count, day.intercepts_count);
            }
        }
        _ => {
            print_help();
        }
    }
}
