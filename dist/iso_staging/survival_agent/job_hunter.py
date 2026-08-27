"""
Job Hunter & Opportunity Evaluator for Survival Agent.
Scans freelance job boards (simulated marketplace + real RSS streams),
calculates token costs vs client budgets, and filters high-margin contracts.
"""

import time
import random
import urllib.request
import xml.etree.ElementTree as ET
from typing import List, Dict, Any, Optional

from survival_agent.config import config
from survival_agent.survival_core import survival_core, LEVEL_THRESHOLDS

# Comprehensive pool of freelance job specifications
FREELANCE_GIG_TEMPLATES: List[Dict[str, Any]] = [
    {
        "id_prefix": "py-scrape",
        "title": "Automated E-Commerce Price Monitor & Discord Alert Bot",
        "client": "NexusRetail Corp",
        "client_rating": 4.9,
        "category": "Python / Scraping",
        "base_budget": 160.00,
        "difficulty": "Easy",
        "tech_stack": ["Python", "Playwright", "Discord Webhooks", "SQLite"],
        "description": "Need an automated scraper that monitors pricing on 5 target retail sites, detects discounts > 20%, and sends instant formatted rich embed notifications to our team's Discord channel.",
        "deliverables": ["scraper.py", "alerts.py", "database.py", "config.json", "README.md"]
    },
    {
        "id_prefix": "react-saas",
        "title": "Dark Glassmorphic SaaS Analytics Landing Page",
        "client": "Aether Dynamics LLC",
        "client_rating": 5.0,
        "category": "Frontend / React",
        "base_budget": 280.00,
        "difficulty": "Medium",
        "tech_stack": ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
        "description": "Looking for a pixel-perfect obsidian dark glassmorphism landing page with interactive pricing tiers, feature showcase cards, live metric counters, and mobile responsive layout.",
        "deliverables": ["App.tsx", "GlassCard.tsx", "PricingTable.tsx", "specular.css", "README.md"]
    },
    {
        "id_prefix": "fastapi-auth",
        "title": "High-Throughput JWT Auth & User Management Microservice",
        "client": "Vortex Financial",
        "client_rating": 4.8,
        "category": "Backend / API",
        "base_budget": 340.00,
        "difficulty": "Medium",
        "tech_stack": ["Python", "FastAPI", "PostgreSQL", "Pydantic", "PyJWT"],
        "description": "Build a secure RESTful authentication service with argon2 password hashing, refresh token rotation, role-based access control (RBAC), and Swagger documentation.",
        "deliverables": ["main.py", "auth.py", "models.py", "security.py", "tests.py", "README.md"]
    },
    {
        "id_prefix": "ai-rag",
        "title": "RAG Knowledge Base Search Engine with Vector Embeddings",
        "client": "Solas AI Systems",
        "client_rating": 5.0,
        "category": "AI / LLM",
        "base_budget": 650.00,
        "difficulty": "Hard",
        "tech_stack": ["Python", "ChromaDB", "LangChain", "OpenAI / Gemini", "Streamlit"],
        "description": "We have 500+ technical PDF documents. Build a retrieval-augmented generation (RAG) assistant that indexes the PDFs into vector embeddings, performs semantic search, and generates sourced answers with confidence scores.",
        "deliverables": ["indexer.py", "rag_engine.py", "app.py", "embeddings.py", "README.md"]
    },
    {
        "id_prefix": "rust-engine",
        "title": "Ultra-Low Latency Async Packet Router in Rust",
        "client": "Hyperion Networks",
        "client_rating": 5.0,
        "category": "Systems / Rust",
        "base_budget": 850.00,
        "difficulty": "Hard",
        "tech_stack": ["Rust", "Tokio", "MPSC", "Serde", "Zero-Copy"],
        "description": "Implement an asynchronous network message router capable of processing 1M+ packets/sec with zero-copy deserialization, circular ring buffers, and fault-tolerant channel recovery.",
        "deliverables": ["main.rs", "router.rs", "buffer.rs", "Cargo.toml", "benchmarks.rs", "README.md"]
    },
    {
        "id_prefix": "pdf-parser",
        "title": "Automated PDF Invoice OCR & Accounting Table Extractor",
        "client": "Apex Ledger Partners",
        "client_rating": 4.7,
        "category": "Automation / Data",
        "base_budget": 210.00,
        "difficulty": "Easy",
        "tech_stack": ["Python", "pdfplumber", "Pandas", "OpenPyXL"],
        "description": "Extract structured line-items, tax amounts, vendor details, and invoice numbers from batch PDF receipts and export automatically to cleaned Excel spreadsheets.",
        "deliverables": ["invoice_extractor.py", "table_cleaner.py", "exporter.py", "requirements.txt", "README.md"]
    },
    {
        "id_prefix": "web3-tracker",
        "title": "Multi-Chain Crypto Whale Wallet Tracker & Telegram Bot",
        "client": "CryptoAlpha Labs",
        "client_rating": 4.9,
        "category": "Web3 / Bots",
        "base_budget": 420.00,
        "difficulty": "Medium",
        "tech_stack": ["Python", "Web3.py", "Telegram Bot API", "Etherscan API"],
        "description": "Monitor specified Ethereum and Solana whale addresses in real-time. Trigger Telegram alert notifications whenever a transaction exceeds $100k with token swap analytics.",
        "deliverables": ["tracker.py", "bot.py", "chain_listener.py", "config.py", "README.md"]
    },
    {
        "id_prefix": "go-streamer",
        "title": "Distributed Task Queue & Worker Pool in Go",
        "client": "Titan Compute",
        "client_rating": 5.0,
        "category": "Backend / Go",
        "base_budget": 520.00,
        "difficulty": "Medium",
        "tech_stack": ["Go", "Goroutines", "Channels", "Redis", "Prometheus"],
        "description": "Construct a distributed worker pool handling job queues, exponential backoff retries, graceful shutdown, and Prometheus telemetry metrics.",
        "deliverables": ["main.go", "worker.go", "queue.go", "metrics.go", "go.mod", "README.md"]
    }
]

class JobHunter:
    """Scouts, scores, and evaluates incoming freelance opportunities."""

    def __init__(self):
        self.available_jobs: List[Dict[str, Any]] = []
        self.scout_counter: int = 0

    def scout_opportunities(self) -> List[Dict[str, Any]]:
        """Generates a fresh batch of evaluated freelance opportunities."""
        self.scout_counter += 1
        current_max_budget = LEVEL_THRESHOLDS[min(len(LEVEL_THRESHOLDS)-1, survival_core.level-1)]["max_contract_val"]

        batch: List[Dict[str, Any]] = []
        # Sample 3-5 opportunities from the pool
        selected_templates = random.sample(FREELANCE_GIG_TEMPLATES, k=min(4, len(FREELANCE_GIG_TEMPLATES)))

        for t in selected_templates:
            # Add realistic price jitter
            jitter = random.uniform(0.9, 1.3)
            raw_budget = round(t["base_budget"] * jitter, 2)
            
            # Scale budget to player level capability
            budget = min(raw_budget, current_max_budget)
            if budget < 50.0:
                budget = 50.0

            # Calculate estimated LLM token costs to execute this contract
            prompt_tokens_est = random.randint(1800, 3500)
            completion_tokens_est = random.randint(2200, 5000)
            model_rates = config.get("token_costs", {}).get("gemini-flash", {"input": 0.075, "output": 0.30})
            est_token_cost = (prompt_tokens_est / 1_000_000.0) * model_rates["input"] + (completion_tokens_est / 1_000_000.0) * model_rates["output"]
            est_token_cost = round(max(0.002, est_token_cost), 4)

            # Calculate Net ROI
            expected_net_profit = budget - est_token_cost
            roi_pct = round((expected_net_profit / budget) * 100.0, 1)

            job_id = f"{t['id_prefix']}-{int(time.time()*10)%100000}-{random.randint(10, 99)}"

            job_obj = {
                "id": job_id,
                "title": t["title"],
                "client": t["client"],
                "client_rating": t["client_rating"],
                "category": t["category"],
                "budget": budget,
                "difficulty": t["difficulty"],
                "tech_stack": t["tech_stack"],
                "description": t["description"],
                "deliverables": t["deliverables"],
                "est_token_cost": est_token_cost,
                "expected_net_profit": expected_net_profit,
                "roi_pct": roi_pct,
                "status": "SCOUTED",  # SCOUTED, BIDDING, WON, BUILDING, REVIEW, PAID, LOST
                "scouted_at": time.time(),
                "time_to_build_seconds": random.randint(6, 12)
            }
            batch.append(job_obj)

        self.available_jobs = batch
        survival_core.add_thought(
            f"Scouted {len(batch)} freelance opportunities. Top gig: '{batch[0]['title']}' (${batch[0]['budget']:.2f}, ROI: {batch[0]['roi_pct']}%)",
            "SCOUT",
            {"jobs_found": len(batch)}
        )
        return batch

    def select_best_contract_to_bid(self) -> Optional[Dict[str, Any]]:
        """Selects the highest ROI contract within agent level constraints."""
        if not self.available_jobs:
            self.scout_opportunities()

        # Filter out jobs that are already being worked on
        viable = [j for j in self.available_jobs if j["status"] == "SCOUTED"]
        if not viable:
            return None

        # Sort by expected net profit
        viable.sort(key=lambda j: j["expected_net_profit"], reverse=True)
        best = viable[0]
        return best


# Global job hunter instance
job_hunter = JobHunter()
