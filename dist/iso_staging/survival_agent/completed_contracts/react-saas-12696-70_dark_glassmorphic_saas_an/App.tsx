// Dark Glassmorphic SaaS Landing Page
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
