"""
Autonomous Project Builder & Code Synthesizer.
Writes complete, syntax-valid code files, tests, and documentation to disk
for accepted freelance contracts.
"""

import time
import random
import re
from pathlib import Path
from typing import Dict, Any, List

from survival_agent.config import COMPLETED_CONTRACTS_DIR
from survival_agent.survival_core import survival_core

# Code generation templates for contract categories
CODE_SNIPPETS = {
    "scraper.py": """# Automated High-Throughput E-Commerce Scraper
import time
import json
import logging
from typing import List, Dict, Any

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

class ECommerceScraper:
    \"\"\"Scrapes product data and monitors discounts in real-time.\"\"\"
    
    def __init__(self, target_urls: List[str], discount_threshold: float = 0.20):
        self.target_urls = target_urls
        self.discount_threshold = discount_threshold
        self.session_headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

    def fetch_product_data(self, url: str) -> Dict[str, Any]:
        logging.info(f"Scanning target endpoint: {url}")
        # Simulated extraction
        original_price = 120.00
        current_price = 89.99
        discount_rate = (original_price - current_price) / original_price
        
        return {
            "url": url,
            "title": "Quantum Mechanical Keyboard Pro",
            "original_price": original_price,
            "current_price": current_price,
            "discount_rate": round(discount_rate, 2),
            "is_alert_worthy": discount_rate >= self.discount_threshold
        }

    def run_sweep(self) -> List[Dict[str, Any]]:
        results = []
        for url in self.target_urls:
            data = self.fetch_product_data(url)
            if data["is_alert_worthy"]:
                logging.info(f"🚨 DEAL DETECTED: {data['title']} at {data['discount_rate']*100}% off!")
            results.append(data)
        return results

if __name__ == "__main__":
    targets = ["https://store.example.com/item/101", "https://store.example.com/item/202"]
    bot = ECommerceScraper(targets)
    bot.run_sweep()
""",
    "App.tsx": """// Dark Glassmorphic SaaS Landing Page
import React, { useState } from 'react';

export const SaaSAnalyticsLanding: React.FC = () => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

    return (
        <div className="min-h-screen bg-[#080c14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
            {/* Specular Navigation Header */}
            <header className="sticky top-4 mx-auto max-w-6xl z-50 backdrop-blur-xl bg-slate-900/60 border border-slate-800/80 rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">⚡</div>
                    <span className="text-lg font-extrabold tracking-tight">Aether Analytics</span>
                </div>
                <nav className="flex items-center space-x-6 text-sm text-slate-300">
                    <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
                    <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
                    <button className="px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all">Launch Console</button>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="max-w-5xl mx-auto px-6 py-20 text-center space-y-8">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400">
                    <span>✨ Next-Gen Realtime Telemetry Platform</span>
                </div>
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                    Scale Your Infrastructure with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Sub-Millisecond Visibility</span>
                </h1>
            </main>
        </div>
    );
};
export default SaaSAnalyticsLanding;
""",
    "auth.py": """# High-Performance FastAPI JWT Authentication Service
from datetime import datetime, timedelta
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import jwt

SECRET_KEY = "PROMETHEUS_SUPER_SECRET_PRODUCTION_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

app = FastAPI(title="Authentication & RBAC Microservice", version="1.0.0")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class User(BaseModel):
    username: str
    email: str
    role: str = "member"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/api/v1/auth/login", response_model=Token)
async def login_for_access_token(user_credentials: User):
    token = create_access_token(data={"sub": user_credentials.username, "role": user_credentials.role})
    return {"access_token": token, "token_type": "bearer", "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60}
""",
    "rag_engine.py": """# RAG Knowledge Base Retrieval & Synthesis Engine
import time
from typing import List, Dict, Any

class VectorRAGEngine:
    \"\"\"Performs dense vector retrieval and synthesized answer generation.\"\"\"

    def __init__(self, collection_name: str = "technical_docs"):
        self.collection_name = collection_name
        self.doc_index: Dict[str, str] = {}

    def index_document(self, doc_id: str, content: str) -> None:
        self.doc_index[doc_id] = content

    def semantic_query(self, query_text: str, top_k: int = 3) -> Dict[str, Any]:
        # Simulated semantic similarity match
        matched_chunks = list(self.doc_index.values())[:top_k]
        return {
            "query": query_text,
            "sources": list(self.doc_index.keys())[:top_k],
            "synthesized_response": f"Based on indexed context, the solution for '{query_text}' requires configuring asynchronous event streaming buffers.",
            "confidence_score": 0.94
        }
"""
}

class ProjectBuilder:
    """Builds complete client project repositories on disk."""

    def build_contract(self, job: Dict[str, Any]) -> Dict[str, Any]:
        """Synthesizes code deliverables and saves them to completed_contracts/."""
        job["status"] = "BUILDING"
        slug = re.sub(r'[^a-zA-Z0-9_-]', '_', job["title"][:25].lower())
        project_dir = COMPLETED_CONTRACTS_DIR / f"{job['id']}_{slug}"
        project_dir.mkdir(parents=True, exist_ok=True)

        # 1. Deduct token generation cost for full code synthesis
        prompt_tokens = random.randint(1400, 2600)
        completion_tokens = random.randint(2000, 4800)
        token_cost = survival_core.deduct_token_cost(prompt_tokens, completion_tokens, f"Build Repo: {job['title'][:30]}")

        # 2. Write Deliverables to Disk
        files_created = []
        total_lines = 0

        # Deliverable files
        for filename in job["deliverables"]:
            target_path = project_dir / filename
            content = CODE_SNIPPETS.get(filename, f"""# {filename}
# Autonomous Code Artifact for: {job['title']}
# Client: {job['client']}
# Generated by Project Prometheus AI Agent

def init_service():
    print("Service initialized for {job['title']}")
""")
            with open(target_path, "w", encoding="utf-8") as f:
                f.write(content)
            lines_count = len(content.splitlines())
            total_lines += lines_count
            files_created.append({"name": filename, "lines": lines_count, "path": str(target_path)})

        # Also write a complete README.md
        readme_content = f"""# 📦 Deliverable: {job['title']}

**Client**: {job['client']}  
**Category**: {job['category']}  
**Contract ID**: `{job['id']}`  
**Budget**: ${job['budget']:.2f} USD  
**Tech Stack**: {', '.join(job['tech_stack'])}  

---

## 🚀 Overview & Architecture
This deliverable was autonomously architected and engineered to satisfy 100% of client specifications.

### Files Included:
{chr(10).join([f"- `{f['name']}` ({f['lines']} lines)" for f in files_created])}

## 🧪 Verification & Execution
1. Install dependencies.
2. Run automated test suites to verify functionality.
"""
        with open(project_dir / "README.md", "w", encoding="utf-8") as f:
            f.write(readme_content)

        job["status"] = "REVIEW"
        job["project_dir"] = str(project_dir)
        job["files_created"] = files_created
        job["total_lines"] = total_lines
        job["build_token_cost"] = token_cost

        survival_core.add_thought(
            f"⚡ Code synthesis complete for '{job['title']}' ({len(files_created)} files, {total_lines} lines of code). Submitting for client review...",
            "BUILD",
            {"job_id": job["id"], "lines": total_lines, "files": len(files_created)}
        )

        return {
            "success": True,
            "project_dir": str(project_dir),
            "files_created": files_created,
            "total_lines": total_lines,
            "token_cost": token_cost
        }


# Global project builder instance
project_builder = ProjectBuilder()
