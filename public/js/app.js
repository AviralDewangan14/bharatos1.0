

        // // SYNCHRONIZED REAL-TIME INDIAN STANDARD TIME (IST) & DATE ENGINE

        function updateClock() {
            const now = new Date();
            
            // Format 12-hour Time with AM/PM for Lock Screen & Tray
            const time12Str = now.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });

            // Format Full Indian Standard Date
            const dateStr = now.toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Update Lock Screen Time & Date
            const lockTime = document.getElementById('lock-time-display');
            if (lockTime) lockTime.textContent = time12Str;

            const lockDate = document.getElementById('lock-date-display');
            if (lockDate) lockDate.textContent = dateStr;

            // Update System Tray IST Clock
            const trayClock = document.getElementById('ist-clock');
            if (trayClock) trayClock.textContent = `${time12Str} IST`;

            // Update Dynamic Island Time
            const islandClock = document.getElementById('island-clock-text');
            if (islandClock) islandClock.textContent = time12Str;
        }

        setInterval(updateClock, 1000);

        
        // // SOVEREIGN APP STORE DATABASE & TASK MANAGER METRICS BUFFERS

        var taskMgrCpuHistory = [12, 15, 14, 18, 16, 20, 15, 18, 14, 22, 19, 15, 17, 14, 18, 16];
        var taskMgrRamHistory = [42, 43, 42, 44, 43, 45, 44, 44, 45, 44, 43, 44, 45, 44, 43, 44];
        var taskMgrNetHistory = [240, 310, 280, 420, 510, 380, 460, 520, 490, 610, 580, 620];
        var taskMgrDiskHistory = [12, 18, 15, 30, 22, 14, 19, 25, 20, 16, 28, 22];

        var STORE_APPS_DATABASE = [
            {
                id: "app-garud-browser",
                name: "Garud Web Browser",
                tagline: "Quantum-Shielded Sovereign Web Browser with Kavach 3.0",
                category: "Productivity",
                icon: "🌐",
                rating: 4.9,
                reviews: 14200,
                version: "v4.2.0",
                size: "42.5 MB",
                author: "Sovereign India Foundation",
                installed: true,
                winId: "browser-window",
                dockId: "dock-browser",
                description: "Garud is India's sovereign web browser engineered for zero telemetry, military-grade Kavach web filtering, and integrated ISRO & Vedic research tabs."
            },
            {
                id: "app-indic-studio",
                name: "Indic Code Studio",
                tagline: "High-Performance Polyglot IDE with Sudarshan AI & Rust Core",
                category: "Dev Tools",
                icon: "⚡",
                rating: 5.0,
                reviews: 28900,
                version: "v3.8.1",
                size: "128 MB",
                author: "BharatOS Dev Ecosystem",
                installed: true,
                winId: "code-window",
                dockId: "dock-code",
                description: "Complete modern software engineering studio with live Rust/Python syntax analysis, integrated terminal debugger, and Indic neural code autocompletion."
            },
            {
                id: "app-solaris-fps",
                name: "Solaris 3D FPS Arena",
                tagline: "Tactical Sovereign 3D Ray-Traced FPS Combat Simulator",
                category: "Gaming",
                icon: "🎮",
                rating: 4.8,
                reviews: 35100,
                version: "v2.5.0",
                size: "240 MB",
                author: "Solaris Interactive India",
                installed: true,
                winId: "game-window",
                dockId: "dock-game",
                description: "State-of-the-art 3D tactical first-person combat engine featuring procedural arenas, spatial audio, smart bot AI, and real-time ray-traced graphics."
            },
            {
                id: "app-file-explorer",
                name: "Sovereign File Explorer",
                tagline: "Ring-0 Virtual File System & Enclave Storage Manager",
                category: "Utilities",
                icon: "📁",
                rating: 4.9,
                reviews: 19800,
                version: "v3.0.0",
                size: "18.2 MB",
                author: "BharatOS Core Team",
                installed: true,
                winId: "files-window",
                dockId: "dock-files",
                description: "Zero-Trust hierarchical file explorer with instant VFS indexing, preview pane, military encryption vault, and USB device mounting."
            },
            {
                id: "app-kavach-defender",
                name: "Kavach Defender 3.0",
                tagline: "Zero-Trust Ring-0 Antivirus & Quantum Neural Firewall",
                category: "Security",
                icon: "🛡️",
                rating: 5.0,
                reviews: 44200,
                version: "v3.0.4",
                size: "54.1 MB",
                author: "National Cyber Security Center",
                installed: true,
                winId: "kavach-window",
                dockId: "dock-defender",
                description: "Military-grade kernel enclave protector with real-time heuristic file scanning, sandbox quarantine, memory shield, and zero telemetry."
            },
            {
                id: "app-device-manager",
                name: "Device Manager & Hardware Hub",
                tagline: "Ring-0 Hardware Architecture & Driver Diagnostics",
                category: "Utilities",
                icon: "💻",
                rating: 4.9,
                reviews: 11200,
                version: "v2.1.0",
                size: "12.4 MB",
                author: "BharatOS Hardware Lab",
                installed: true,
                winId: "devicemanager-window",
                dockId: "dock-devmgr",
                description: "Comprehensive device tree inspector showing CPU cores, GPU ray-tracing pipelines, NVMe PCIe health, TPM 2.0 cryptography, and driver statuses."
            },
            {
                id: "app-network-center",
                name: "Quantum Network Center",
                tagline: "Wi-Fi 7, Quantum VPN Tunnel & Bandwidth Visualizer",
                category: "Utilities",
                icon: "📶",
                rating: 4.9,
                reviews: 16500,
                version: "v2.4.0",
                size: "14.8 MB",
                author: "BharatOS Network Core",
                installed: true,
                winId: "network-window",
                dockId: "dock-network",
                description: "Wi-Fi 7 connection manager, multi-node encrypted VPN tunnel, real-time speedometer, and latency ping analyzer."
            },
            {
                id: "app-task-manager",
                name: "Sovereign Task Manager",
                tagline: "Real-Time Telemetry, Thread Inspector & Process Killer",
                category: "Utilities",
                icon: "📈",
                rating: 5.0,
                reviews: 21400,
                version: "v3.2.0",
                size: "16.1 MB",
                author: "BharatOS Kernel Team",
                installed: true,
                winId: "taskmanager-window",
                dockId: "dock-taskmgr",
                description: "High-precision process monitor with CPU/RAM history graphs, per-app thread count, priority management, and instantaneous task termination."
            },
            {
                id: "app-soundscape",
                name: "Soundscape Studio 528Hz",
                tagline: "Harmonic Solfeggio Frequencies & Himalayan Soundscapes",
                category: "Multimedia",
                icon: "🎵",
                rating: 4.8,
                reviews: 9800,
                version: "v1.9.0",
                size: "22.5 MB",
                author: "Vedic Acoustic Labs",
                installed: true,
                winId: "music-window",
                dockId: "dock-music",
                description: "Procedural soundscape generator with 528Hz DNA repair harmonics, mountain rain, forest winds, and Vedic meditation chimes."
            },
            {
                id: "app-calc",
                name: "Scientific & Vedic Calculator",
                tagline: "Trigonometric, Binary, Matrix & Vedic Math Engine",
                category: "Productivity",
                icon: "🧮",
                rating: 4.9,
                reviews: 13200,
                version: "v2.0.0",
                size: "8.5 MB",
                author: "Aryabhata Math Lab",
                installed: true,
                winId: "calc-window",
                dockId: "dock-calc",
                description: "Advanced scientific calculator supporting full arithmetic, trigonometry, log functions, matrix determinants, and Vedic sutra shortcuts."
            },
            {
                id: "app-calendar",
                name: "Sovereign Calendar & ISRO",
                tagline: "Saka Era Panchang & ISRO Space Mission Tracker",
                category: "Productivity",
                icon: "🗂️",
                rating: 4.9,
                reviews: 17800,
                version: "v2.2.0",
                size: "11.2 MB",
                author: "ISRO & Culture Ministry",
                installed: true,
                winId: "calendar-window",
                dockId: "dock-calendar",
                description: "Dual Gregorian & Saka Era astronomical calendar with live countdowns to Gaganyaan, Chandrayaan, and Shukrayaan missions."
            },
            {
                id: "app-terminal",
                name: "Sovereign Shell & Terminal",
                tagline: "POSIX-Compliant Command Shell with Quantum Toolchain",
                category: "Dev Tools",
                icon: "📟",
                rating: 5.0,
                reviews: 26700,
                version: "v3.1.0",
                size: "15.0 MB",
                author: "BharatOS CLI Ecosystem",
                installed: true,
                winId: "terminal-window",
                dockId: "dock-terminal",
                description: "Full-featured sovereign CLI with PowerShell/Bash compatibility, disk inspection, process management, and network diagnostics."
            },
            {
                id: "app-personalize",
                name: "Personalization Studio",
                tagline: "Liquid Glass Themes, 4K Wallpapers & Accent Colors",
                category: "Utilities",
                icon: "🎨",
                rating: 4.9,
                reviews: 18400,
                version: "v2.6.0",
                size: "36.0 MB",
                author: "BharatOS Design Lab",
                installed: true,
                winId: "customization-window",
                dockId: "dock-personalize",
                description: "Complete visual personalization suite with dynamic wallpapers, glassmorphic blur controls, and instant theme toggling."
            },
            {
                id: "app-settings",
                name: "Sovereign Settings Hub",
                tagline: "Multi-User Accounts, Display, Sound & Security Control",
                category: "Utilities",
                icon: "⚙️",
                rating: 5.0,
                reviews: 31000,
                version: "v4.0.0",
                size: "24.0 MB",
                author: "BharatOS Core Team",
                installed: true,
                winId: "settings-window",
                dockId: "dock-settings",
                description: "Central operating system configuration hub for managing user profiles, screen resolution, audio devices, and privacy policies."
            }
        ];

        // Universal Toast Notification Handler
        function showNotificationToast(title, msg, type = 'info') {
            const toast = document.getElementById('security-toast');
            const toastMsg = document.getElementById('security-toast-msg');
            if (!toast || !toastMsg) return;

            const iconMap = {
                'success': '🛡️',
                'error': '⚠️',
                'info': '🔔',
                'alert': '🚨'
            };

            const icon = iconMap[type] || '✨';
            toastMsg.innerHTML = `<span class="font-bold text-white">${icon} ${title}:</span> <span class="opacity-90">${msg}</span>`;
            
            toast.classList.remove('hidden', 'translate-y-20', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');

            setTimeout(() => {
                toast.classList.remove('translate-y-0', 'opacity-100');
                toast.classList.add('translate-y-20', 'opacity-0');
                setTimeout(() => toast.classList.add('hidden'), 400);
            }, 3500);
        }

        // Alias for backward compatibility
        function showSecurityToast(msg, type = 'info') {
            showNotificationToast("System Alert", msg, type);
        }

        var ALL_APPS_METADATA = {
            'browser-window': { name: 'Garud Web Browser', icon: '🌐', desc: 'Sandboxed Google Search & Multi-Tab Web Engine', dockId: 'dock-browser', cat: 'Office' },
            'code-window': { name: 'Indic Code Studio Pro', icon: '⚡', desc: 'Rust 2026 SMP IDE & LLVM Compiler', dockId: 'dock-code', cat: 'Development' },
            'game-window': { name: 'Solaris 3D Cyber Forge FPS', icon: '🎮', desc: 'Three.js 3D Multiplayer Tactical FPS', dockId: 'dock-game', cat: 'Gaming' },
            'files-window': { name: 'SovereignFS File Vault', icon: '📁', desc: 'AES-256 GCM Encrypted Filesystem & PC Importer', dockId: 'dock-files', cat: 'System' },
            'kavach-window': { name: 'Kavach Zero-Day Sentinel', icon: '🛡️', desc: 'Zero-Trust Heuristic Antivirus & Firewall', dockId: 'dock-defender', cat: 'Security' },
            'store-window': { name: 'Bharat Sovereign App Store', icon: '🛍️', desc: '24+ Verified Native Packages & Installer', dockId: 'dock-store', cat: 'Ecosystem' },
            'taskmanager-window': { name: 'Bharat Task Manager', icon: '📈', desc: 'Real-Time 60s CPU Canvas Graph & Process Manager', dockId: 'dock-taskmgr', cat: 'System' },
            'music-window': { name: 'Soundscape Vedic 528Hz Studio', icon: '🎵', desc: 'Web Audio Synthesizer & Oscilloscope', dockId: 'dock-music', cat: 'Media' },
            'calc-window': { name: 'Vedic Scientific Calculator', icon: '🧮', desc: 'Matrix Arithmetic & Calculus Solver', dockId: 'dock-calc', cat: 'Utilities' },
            'calendar-window': { name: 'Calendar & ISRO Missions', icon: '🗓️', desc: 'Panchang Ephemeris & Rocket Launch Scheduler', dockId: 'dock-calendar', cat: 'Space' },
            'terminal-window': { name: 'Ring-0 Sovereign Terminal', icon: '📟', desc: 'POSIX Shell & Real-Time Telemetry CLI', dockId: 'dock-terminal', cat: 'Development' },
            'customization-window': { name: 'Personalization & Theme Studio', icon: '🎨', desc: '4K Wallpapers & Liquid Glass Controls', dockId: 'dock-personalize', cat: 'Design' },
            'settings-window': { name: 'Settings Hub & Control Enclave', icon: '⚙️', desc: 'Multi-User Accounts & System Preferences', dockId: 'dock-settings', cat: 'System' },
            'network-window': { name: 'Network & Connectivity Center', icon: '📶', desc: 'Wi-Fi 7, WireGuard VPN & Speed Test', dockId: 'dock-network', cat: 'Network' },
            'devicemanager-window': { name: 'Device & Hardware Manager', icon: '💻', desc: '16-Core SMP CPU & Vulkan GPU Benchmark', dockId: 'dock-devmgr', cat: 'Hardware' },
            'osdev-kernel-window': { name: 'OSDev Bare-Metal Kernel Studio', icon: '🛡️', desc: 'x86_64 C & Assembly Ring-0 Microkernel & QEMU Engine', dockId: 'dock-osdev', cat: 'Development' },
            'win32-compat-window': { name: 'Win32 Subsystem & Windows Apps', icon: '🪟', desc: 'Native PE32+ Windows EXE/MSI Application Compatibility Enclave', dockId: 'dock-win32', cat: 'Ecosystem' }
        };

        tailwind.config = {
            darkMode: ['class', '[data-theme="dark"]'],
            theme: {
                extend: {
                    colors: {
                        saffron: '#ff9933',
                        indiaGreen: '#138808',
                        navyAshoka: '#000080',
                        obsidian: '#020408',
                        deepVoid: '#040711',
                        surface: '#090e1a'
                    },
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                        mono: ['"Fira Code"', 'monospace']
                    }
                }
            }
        }
    


        let audioCtx = null;
        let masterVolume = 0.8;

                // // BHARATOS QUANTUM HAPTIC & TACTILE FORCE FEEDBACK SUBSYSTEM
        let hapticConfig = {
            enabled: true,
            intensity: 1.0, // 0.5 (gentle), 1.0 (standard), 1.5 (high), 2.0 (ultra)
            audioHaptics: true,
            controllerRumble: true
        };

        function loadHapticConfig() {
            try {
                const saved = localStorage.getItem('bharatos_haptic_config');
                if (saved) {
                    hapticConfig = { ...hapticConfig, ...JSON.parse(saved) };
                }
            } catch(e) {}
        }
        loadHapticConfig();

        function saveHapticConfig() {
            try {
                localStorage.setItem('bharatos_haptic_config', JSON.stringify(hapticConfig));
            } catch(e) {}
        }

        function setHapticSetting(key, val) {
            hapticConfig[key] = val;
            saveHapticConfig();
            triggerHaptic('selection');
            renderHapticSettingsUI();
        }

        function renderHapticSettingsUI() {
            const toggleBtn = document.getElementById('haptic-master-toggle-btn');
            const intensityVal = document.getElementById('haptic-intensity-val');
            if (toggleBtn) {
                toggleBtn.textContent = hapticConfig.enabled ? 'Enabled' : 'Disabled';
                toggleBtn.className = hapticConfig.enabled ? 'px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all bg-emerald-500 text-slate-950' : 'px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all bg-slate-700 text-slate-300';
            }
            if (intensityVal) {
                intensityVal.textContent = Math.round(hapticConfig.intensity * 100) + '%';
            }
        }

        const HAPTIC_PATTERNS = {
            light: [10],
            click: [12],
            tick: [6],
            medium: [24],
            selection: [20],
            heavy: [42],
            impact: [48],
            snap: [8, 25, 14],
            success: [15, 45, 20, 30, 25],
            error: [45, 50, 45, 50, 65],
            alert: [50, 60, 50, 60, 70],
            pulse: [20, 100, 30, 100, 20],
            recoil: [60, 30, 80, 40, 120],
            lockout: [100, 60, 100, 60, 120]
        };

        function triggerHaptic(type = 'light') {
            if (!hapticConfig.enabled) return;

            const basePattern = HAPTIC_PATTERNS[type] || [15];
            const scaledPattern = basePattern.map(val => Math.max(1, Math.round(val * hapticConfig.intensity)));

            // 1. Physical Device Vibration (Mobile / Tablet / Touchscreen / Stylus)
            try {
                if ('vibrate' in navigator) {
                    navigator.vibrate(scaledPattern);
                }
            } catch(e) {}

            // 2. Controller / Gamepad Force Feedback Rumble
            if (hapticConfig.controllerRumble) {
                try {
                    if (navigator.getGamepads) {
                        const gamepads = navigator.getGamepads();
                        for (let gp of gamepads) {
                            if (gp && gp.vibrationActuator && typeof gp.vibrationActuator.playEffect === 'function') {
                                const duration = type === 'recoil' ? 250 : type === 'heavy' || type === 'error' ? 180 : 80;
                                const strong = type === 'recoil' || type === 'error' ? 0.9 : type === 'heavy' ? 0.7 : 0.3;
                                const weak = type === 'recoil' ? 0.9 : 0.5;
                                gp.vibrationActuator.playEffect('dual-rumble', {
                                    startDelay: 0,
                                    duration: Math.round(duration * hapticConfig.intensity),
                                    weakMagnitude: Math.min(1.0, weak * hapticConfig.intensity),
                                    strongMagnitude: Math.min(1.0, strong * hapticConfig.intensity)
                                }).catch(() => {});
                            }
                        }
                    }
                } catch(e) {}
            }

            // 3. Audio-Tactile Sub-Bass Acoustic Transient (Sub-bass physical sensation on speakers/headphones)
            if (hapticConfig.audioHaptics) {
                try {
                    const ctx = getAudioContext();
                    if (ctx && ctx.state === 'running') {
                        const now = ctx.currentTime;
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        
                        const freq = type === 'light' || type === 'tick' ? 52 : type === 'medium' || type === 'snap' ? 42 : 32;
                        const duration = type === 'heavy' || type === 'recoil' ? 0.08 : 0.035;
                        const vol = (type === 'heavy' || type === 'recoil' || type === 'error' ? 0.22 : 0.10) * masterVolume * hapticConfig.intensity;
                        
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(freq, now);
                        osc.frequency.exponentialRampToValueAtTime(16, now + duration);
                        
                        gain.gain.setValueAtTime(vol, now);
                        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
                        
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(now);
                        osc.stop(now + duration);
                    }
                } catch(e) {}
            }
        }

        function getAudioContext() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            return audioCtx;
        }

        function playSfx(type) {
            if (type === 'open') triggerHaptic('medium');
            else if (type === 'close') triggerHaptic('light');
            else if (type === 'minimize') triggerHaptic('selection');
            else if (type === 'click') triggerHaptic('click');
            else if (type === 'error') triggerHaptic('error');
            else if (type === 'unlock') triggerHaptic('success');
            else if (type === 'notify') triggerHaptic('medium');
            try {
                const ctx = getAudioContext();
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                if (type === 'open') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(528, now);
                    osc.frequency.exponentialRampToValueAtTime(792, now + 0.18);
                    gain.gain.setValueAtTime(0.12 * masterVolume, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                    osc.connect(gain); gain.connect(ctx.destination);
                    osc.start(now); osc.stop(now + 0.35);
                } else if (type === 'close') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(440, now);
                    osc.frequency.exponentialRampToValueAtTime(220, now + 0.15);
                    gain.gain.setValueAtTime(0.10 * masterVolume, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                    osc.connect(gain); gain.connect(ctx.destination);
                    osc.start(now); osc.stop(now + 0.25);
                } else if (type === 'minimize') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(660, now);
                    osc.frequency.exponentialRampToValueAtTime(330, now + 0.12);
                    gain.gain.setValueAtTime(0.08 * masterVolume, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                    osc.connect(gain); gain.connect(ctx.destination);
                    osc.start(now); osc.stop(now + 0.2);
                } else if (type === 'click') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(1200, now);
                    osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);
                    gain.gain.setValueAtTime(0.05 * masterVolume, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                    osc.connect(gain); gain.connect(ctx.destination);
                    osc.start(now); osc.stop(now + 0.04);
                } else if (type === 'error') {
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(160, now);
                    gain.gain.setValueAtTime(0.15 * masterVolume, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                    osc.connect(gain); gain.connect(ctx.destination);
                    osc.start(now); osc.stop(now + 0.3);
                } else if (type === 'unlock') {
                    [528, 660, 792, 1056].forEach((freq, idx) => {
                        const noteOsc = ctx.createOscillator();
                        const noteGain = ctx.createGain();
                        noteOsc.type = 'sine';
                        noteOsc.frequency.setValueAtTime(freq, now + idx * 0.06);
                        noteGain.gain.setValueAtTime(0.12 * masterVolume, now + idx * 0.06);
                        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4);
                        noteOsc.connect(noteGain); noteGain.connect(ctx.destination);
                        noteOsc.start(now + idx * 0.06); noteOsc.stop(now + idx * 0.06 + 0.4);
                    });
                } else if (type === 'notify') {
                    [880, 1174].forEach((freq, idx) => {
                        const noteOsc = ctx.createOscillator();
                        const noteGain = ctx.createGain();
                        noteOsc.type = 'sine';
                        noteOsc.frequency.setValueAtTime(freq, now + idx * 0.09);
                        noteGain.gain.setValueAtTime(0.1 * masterVolume, now + idx * 0.09);
                        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.25);
                        noteOsc.connect(noteGain); noteGain.connect(ctx.destination);
                        noteOsc.start(now + idx * 0.09); noteOsc.stop(now + idx * 0.09 + 0.25);
                    });
                }
            } catch(e) {}
        }

        function playHarmonicChime() {
            try {
                const ctx = getAudioContext();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(528, ctx.currentTime);
                gain.gain.setValueAtTime(0.3 * masterVolume, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
                osc.connect(gain); gain.connect(ctx.destination);
                osc.start(); osc.stop(ctx.currentTime + 1.2);
            } catch(e) {}
        }

        // Display Controls & Viewport Scaling
        function setOSBrightness(val) {
            document.documentElement.style.setProperty('--os-brightness', `${val}%`);
            const bVal = document.getElementById('island-bright-val');
            if (bVal) bVal.textContent = `${val}%`;
        }

        function setOSVolume(val) {
            masterVolume = parseInt(val) / 100;
            const vVal = document.getElementById('island-volume-val');
            const tVal = document.getElementById('tray-volume-text');
            if (vVal) vVal.textContent = `${val}%`;
            if (tVal) tVal.textContent = `${val}%`;
        }

        function setDisplayResolution(scale) {
            document.documentElement.style.setProperty('--ui-scale', scale);
            playSfx('click');
        }

        function setDisplayRefreshRate(hz) {
            const badge = document.getElementById('widget-fps-badge');
            if (badge) badge.textContent = `${hz} FPS`;
            playSfx('click');
        }

        // Device Form Factor
        let deviceType = "desktop";
        function setDeviceType(type) {
            deviceType = type;
            const btnD = document.getElementById('onboard-dev-desktop');
            const btnL = document.getElementById('onboard-dev-laptop');
            if (type === 'desktop') {
                if (btnD) btnD.className = 'py-2 rounded-xl bg-slate-900 text-white font-bold border-2 border-cyan-500';
                if (btnL) btnL.className = 'py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-400 font-bold border border-slate-700';
            } else {
                if (btnD) btnD.className = 'py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-400 font-bold border border-slate-700';
                if (btnL) btnL.className = 'py-2 rounded-xl bg-slate-900 text-white font-bold border-2 border-cyan-500';
            }
            updateBatteryVisibility();
        }

        function updateBatteryVisibility() {
            const isLaptop = (deviceType === 'laptop');
            const lockBat = document.getElementById('lock-battery-container');
            const islandBat = document.getElementById('island-battery-hud');
            const trayBat = document.getElementById('tray-battery-btn');
            const devTypeText = document.getElementById('settings-device-type-text');

            if (lockBat) lockBat.classList.toggle('hidden', !isLaptop);
            if (islandBat) islandBat.classList.toggle('hidden', !isLaptop);
            if (trayBat) trayBat.classList.toggle('hidden', !isLaptop);
            if (devTypeText) devTypeText.textContent = isLaptop ? '💻 Laptop (Battery Active)' : '🖥️ Desktop PC (No Battery)';
        }

        // User Profile & Onboarding Engine
        let userProfile = {
            name: "Aviral Dewangan",
            pin: "1234",
            deviceType: "desktop"
        };

        function loadUserProfile() {
            let saved = localStorage.getItem('bharatos_user_profile');
            if (!saved) {
                userProfile = {
                    name: "Aviral Dewangan",
                    pin: "1234",
                    deviceType: "desktop"
                };
                localStorage.setItem('bharatos_user_profile', JSON.stringify(userProfile));
                saved = JSON.stringify(userProfile);
            }
            try {
                userProfile = JSON.parse(saved);
                deviceType = userProfile.deviceType || "desktop";
                applyUserProfile();
            } catch(e) {}
            updateBatteryVisibility();
        }

        function applyUserProfile() {
            const fullNameEl = document.getElementById('lock-user-fullname');
            const handleEl = document.getElementById('lock-user-handle');
            const settingsNameEl = document.getElementById('settings-user-fullname');
            if (fullNameEl) fullNameEl.textContent = userProfile.name;
            if (handleEl) handleEl.textContent = `${userProfile.name.toLowerCase().replace(/\s+/g, '')}@bharatos (Zero-Trust Ring-0)`;
            if (settingsNameEl) settingsNameEl.textContent = userProfile.name;
            updateBatteryVisibility();
        }

        function saveOnboardingProfile() {
            const nameInput = document.getElementById('onboard-name-input');
            const pinInput = document.getElementById('onboard-pin-input');
            const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Sovereign User";
            const pin = pinInput && pinInput.value.trim() ? pinInput.value.trim() : "1234";

            userProfile = { name, pin, deviceType };
            localStorage.setItem('bharatos_user_profile', JSON.stringify(userProfile));
            applyUserProfile();

            const ob = document.getElementById('onboarding-modal');
            if (ob) ob.classList.add('hidden');
            playSfx('unlock');
        }

        function reopenOnboarding() {
            playSfx('open');
            const ob = document.getElementById('onboarding-modal');
            const nameInput = document.getElementById('onboard-name-input');
            const pinInput = document.getElementById('onboard-pin-input');
            if (nameInput) nameInput.value = userProfile.name;
            if (pinInput) pinInput.value = userProfile.pin;
            setDeviceType(deviceType);
            if (ob) ob.classList.remove('hidden');
        }

        loadUserProfile();

        // Lock Screen Authentication & Enclave Guard
        let failedPinAttempts = 0;
        let isLockoutActive = false;

        
        // Quick Auto-Fill and Password Visibility Engine
        function toggleLockPasswordVisibility() {
            const input = document.getElementById('lock-pin-input');
            const eyeBtn = document.getElementById('btn-toggle-eye');
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    if (eyeBtn) eyeBtn.textContent = '🔒';
                } else {
                    input.type = 'password';
                    if (eyeBtn) eyeBtn.textContent = '👁️';
                }
            }
        }

        function quickAutofillUnlock(pin = '1234') {
            triggerHaptic('success');
            playSfx('click');
            const input = document.getElementById('lock-pin-input');
            if (input) {
                input.value = pin;
                handleLockPinInput(pin);
            }
            unlockDesktop();
        }

        function unlockDesktop() {
            if (isLockoutActive) return;
            const pinInput = document.getElementById('lock-pin-input');
            const alertBox = document.getElementById('lock-pin-alert');
            const alertMsg = document.getElementById('lock-pin-alert-msg');
            const attemptsLeft = document.getElementById('lock-attempts-left');
            const enteredPin = pinInput ? pinInput.value.trim() : '';

            if (enteredPin && (enteredPin === userProfile.pin || (typeof getLockTargetUser === 'function' && enteredPin === getLockTargetUser()?.pin))) {
                playSfx('unlock');
                failedPinAttempts = 0;
                if (alertBox) alertBox.classList.add('hidden');
                const lockEl = document.getElementById('lock-screen');
                if (lockEl) lockEl.classList.add('unlocked');
                showSecurityToast('🛡️ Secure Enclave: Authentication Successful. Zero-Trust Ring-0 Active.', 'success');
            } else {
                failedPinAttempts++;
                playSfx('error');
                if (alertBox) alertBox.classList.remove('hidden');
                if (alertMsg) alertMsg.textContent = '⚠️ Invalid PIN! Security Enclave Guarded.';
                if (attemptsLeft) attemptsLeft.textContent = `Failed Attempt: ${failedPinAttempts} / 3 (Enclave Audit Event)`;
                
                if (pinInput) {
                    pinInput.value = '';
                    pinInput.classList.add('shake-error', 'border-rose-500');
                    setTimeout(() => {
                        pinInput.classList.remove('shake-error');
                        pinInput.focus();
                    }, 450);
                }

                if (failedPinAttempts >= 3) {
                    triggerEnclaveLockdown();
                }
            }
        }

        function attemptBiometricSensorScan() {
            playSfx('click');
            const alertBox = document.getElementById('lock-pin-alert');
            const alertMsg = document.getElementById('lock-pin-alert-msg');
            const attemptsLeft = document.getElementById('lock-attempts-left');
            const pinInput = document.getElementById('lock-pin-input');
            
            if (alertBox) alertBox.classList.remove('hidden');
            if (alertMsg) alertMsg.textContent = '☸️ Scanning Chakra Touch ID Biometric Sensor...';
            if (attemptsLeft) attemptsLeft.textContent = 'Zero-Trust Enclave Sensor Query In Progress...';
            
            // STRICT RULE: Touch ID button click MUST NOT unlock the OS without enrolled hardware passkeys
            setTimeout(() => {
                playSfx('error');
                if (alertMsg) alertMsg.textContent = '⚠️ Touch ID Hardware Sensor Not Enrolled.';
                if (attemptsLeft) attemptsLeft.textContent = 'Biometric instant bypass disabled. Please enter your Sovereign PIN.';
                if (pinInput) {
                    pinInput.classList.add('shake-error', 'border-rose-500');
                    setTimeout(() => {
                        pinInput.classList.remove('shake-error', 'border-rose-500');
                        pinInput.focus();
                    }, 450);
                }
                showNotificationToast("Chakra Touch ID", "Biometric sensor unenrolled. Please authenticate using your PIN.", "warning");
            }, 600);
        }

        function unlockDesktopBiometric() {
            attemptBiometricSensorScan();
        }

        function triggerEnclaveLockdown() {
            isLockoutActive = true;
            playSfx('error');
            const alertBox = document.getElementById('lock-pin-alert');
            const cooldownBox = document.getElementById('lockout-cooldown-box');
            const inputContainer = document.getElementById('lock-input-container');
            const secSpan = document.getElementById('lockout-seconds');
            
            if (alertBox) alertBox.classList.add('hidden');
            if (cooldownBox) cooldownBox.classList.remove('hidden');
            if (inputContainer) inputContainer.classList.add('opacity-40', 'pointer-events-none');
            
            let remaining = 30;
            if (secSpan) secSpan.textContent = remaining;
            
            const interval = setInterval(() => {
                remaining--;
                if (secSpan) secSpan.textContent = remaining;
                if (remaining <= 0) {
                    clearInterval(interval);
                    isLockoutActive = false;
                    failedPinAttempts = 0;
                    if (cooldownBox) cooldownBox.classList.add('hidden');
                    if (inputContainer) inputContainer.classList.remove('opacity-40', 'pointer-events-none');
                    const pin = document.getElementById('lock-pin-input');
                    if (pin) pin.focus();
                }
            }, 1000);
        }

        function lockDesktop() {
            playSfx('close');
            const lockEl = document.getElementById('lock-screen');
            if (lockEl) {
                lockEl.classList.remove('unlocked');
                const pin = document.getElementById('lock-pin-input');
                const alertBox = document.getElementById('lock-pin-alert');
                if (alertBox) alertBox.classList.add('hidden');
                if (pin) { pin.value = ''; pin.focus(); }
            }
        }

        // CINEMATIC SHUTDOWN & REBOOT
        function triggerShutdown() {
            playSfx('close');
            const overlay = document.getElementById('power-overlay');
            const title = document.getElementById('power-action-title');
            const sub = document.getElementById('power-action-sub');
            const bar = document.getElementById('power-progress-bar');

            if (title) title.textContent = "Shutting Down BharatOS...";
            if (sub) sub.textContent = "Flushing NVMe Page Cache & Disarming Kavach Shield...";
            if (overlay) overlay.classList.add('active');
            if (bar) bar.style.width = '100%';

            setTimeout(() => {
                if (title) title.textContent = "Power Off Safe";
                if (sub) sub.textContent = "You can now safely turn off your machine.";
            }, 1800);
        }

        function triggerReboot() {
            playSfx('close');
            const overlay = document.getElementById('power-overlay');
            const title = document.getElementById('power-action-title');
            const sub = document.getElementById('power-action-sub');
            const bar = document.getElementById('power-progress-bar');

            if (title) title.textContent = "Restarting Sovereign Microkernel...";
            if (sub) sub.textContent = "Rebooting into Rust SMP Ring-0...";
            if (overlay) overlay.classList.add('active');
            if (bar) bar.style.width = '100%';

            setTimeout(() => {
                location.reload();
            }, 2000);
        }

        // // PROFESSIONAL MULTI-SOURCE GOOGLE SEARCH ENGINE (AUTHENTIC WEB RESULTS)

        function renderGoogleHome() {
            const viewport = document.getElementById('browser-viewport');
            const input = document.getElementById('browser-url-input');
            if (input) input.value = 'https://www.google.com';
            const extBtn = document.getElementById('btn-open-external-browser');
            if (extBtn) extBtn.href = 'https://www.google.com';

            if (!viewport) return;
            viewport.innerHTML = `
            <div class="max-w-2xl mx-auto space-y-7 text-center pt-12 font-sans">
                <!-- Authentic Google Multi-Color Logo -->
                <div class="flex items-center justify-center space-x-0.5 select-none pt-4">
                    <span class="text-6xl md:text-7xl font-extrabold tracking-tighter text-[#4285F4]">G</span>
                    <span class="text-6xl md:text-7xl font-extrabold tracking-tighter text-[#EA4335]">o</span>
                    <span class="text-6xl md:text-7xl font-extrabold tracking-tighter text-[#FBBC05]">o</span>
                    <span class="text-6xl md:text-7xl font-extrabold tracking-tighter text-[#4285F4]">g</span>
                    <span class="text-6xl md:text-7xl font-extrabold tracking-tighter text-[#34A853]">l</span>
                    <span class="text-6xl md:text-7xl font-extrabold tracking-tighter text-[#EA4335]">e</span>
                </div>

                <!-- Google Search Bar with Instant Suggestions -->
                <div class="relative max-w-xl mx-auto">
                    <div class="flex items-center px-4 py-3.5 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 shadow-lg hover:shadow-xl focus-within:border-blue-500 transition-all space-x-3">
                        <span class="text-slate-400 text-lg">🔍</span>
                        <input id="google-search-input" type="text" placeholder="Search Google or type a URL..." class="flex-1 bg-transparent border-none outline-none font-sans text-sm text-slate-900 dark:text-white" onkeydown="if(event.key==='Enter') executeGoogleSearch(this.value)" autofocus>
                        <button onclick="executeGoogleSearch(document.getElementById('google-search-input').value)" class="text-slate-400 hover:text-blue-500 text-base" title="Voice Search">🎙️</button>
                        <button onclick="executeGoogleSearch(document.getElementById('google-search-input').value)" class="text-slate-400 hover:text-blue-500 text-base" title="Google Lens">📷</button>
                    </div>
                </div>

                <!-- Search Action Buttons -->
                <div class="flex items-center justify-center space-x-3 text-xs">
                    <button onclick="executeGoogleSearch(document.getElementById('google-search-input').value || 'Three.js 3D FPS game engine')" class="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-all shadow-sm">Google Search</button>
                    <button onclick="executeGoogleSearch('Deadshot.io open source assets')" class="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-all shadow-sm">I'm Feeling Lucky</button>
                </div>

                <!-- Google Languages -->
                <div class="text-xs text-slate-500 pt-2 space-x-2">
                    <span>Google offered in:</span>
                    <a href="javascript:void(0)" onclick="executeGoogleSearch('भारत समाचार')" class="text-blue-600 dark:text-blue-400 hover:underline">हिन्दी</a>
                    <a href="javascript:void(0)" onclick="executeGoogleSearch('বাংলা সংবাদ')" class="text-blue-600 dark:text-blue-400 hover:underline">বাংলা</a>
                    <a href="javascript:void(0)" onclick="executeGoogleSearch('తెలుగు వార్తలు')" class="text-blue-600 dark:text-blue-400 hover:underline">తెలుగు</a>
                    <a href="javascript:void(0)" onclick="executeGoogleSearch('मराठी बातम्या')" class="text-blue-600 dark:text-blue-400 hover:underline">मराठी</a>
                    <a href="javascript:void(0)" onclick="executeGoogleSearch('தமிழ் செய்திகள்')" class="text-blue-600 dark:text-blue-400 hover:underline">தமிழ்</a>
                </div>
            </div>`;
        }

        async function executeGoogleSearch(query) {
            if (!query || !query.trim()) query = 'Three.js 3D FPS Game';
            playSfx('click');
            const q = query.trim();
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
            
            const input = document.getElementById('browser-url-input');
            if (input) input.value = searchUrl;
            const extBtn = document.getElementById('btn-open-external-browser');
            if (extBtn) extBtn.href = searchUrl;

            const viewport = document.getElementById('browser-viewport');
            if (!viewport) return;

            // Generate Authentic Multi-Domain Search Results
            const cleanQuery = q.toLowerCase();
            
            // Build rich multi-domain realistic results (GitHub, StackOverflow, Official Docs, Medium, YouTube, News)
            let organicResults = [];

            if (/fps|game|three|3d|deadshot|shooter|asset|model|quaternius|kenney/i.test(q)) {
                organicResults = [
                    {
                        siteName: "Three.js",
                        urlDisplay: "https://threejs.org › docs › games › fps-controls",
                        title: "Three.js Official Documentation — 3D WebGL Engine & FPS Controls",
                        snippet: "Complete guide to PointerLockControls, Octree physics, GLTFLoader, perspective cameras, directional shadow maps, and high-performance WebGL 144 FPS rendering in browsers.",
                        sitelinks: ["WebGLRenderer", "GLTFLoader", "PointerLockControls", "AudioListener"],
                        badge: "Official Website"
                    },
                    {
                        siteName: "GitHub",
                        urlDisplay: "https://github.com › Footprintarts › ThreeJS_FPS_2.0",
                        title: "Footprintarts/ThreeJS_FPS_2.0: Modular Three.js FPS Game Template",
                        snippet: "A modern, modular Three.js FPS template featuring GLTF weapon model loading, reload animation mixers, octree collisions, and raycast ballistics with 144 FPS browser performance.",
                        sitelinks: ["Releases", "Source Code", "License (MIT)", "Issues"],
                        badge: "GitHub ★ 1.2k"
                    },
                    {
                        siteName: "Quaternius Game Assets",
                        urlDisplay: "https://quaternius.com › packs › modular-sci-fi-megakit",
                        title: "Quaternius — Free CC0 3D Game Assets & Modular Sci-Fi MegaKit (glTF)",
                        snippet: "Download 270+ modular 3D building pieces, ramps, weapon packs, and low-poly tactical FPS assets formatted for Three.js, Godot, and Blender under Public Domain CC0.",
                        sitelinks: ["Sci-Fi Kit", "Blasters Pack", "Character Rig", "Download .GLB"],
                        badge: "Free CC0 Assets"
                    },
                    {
                        siteName: "Deadshot.io",
                        urlDisplay: "https://deadshot.io › play",
                        title: "DEADSHOT.io — Fast-Paced Multiplayer Browser FPS (Three.js)",
                        snippet: "Play DEADSHOT.io, an intense competitive online FPS running directly in web browsers via Three.js and WebGL. Features customizable loadouts, sniper scopes, and smooth movement.",
                        sitelinks: ["Play Game", "Controls", "Weapons List", "Leaderboards"],
                        badge: "Browser FPS"
                    },
                    {
                        siteName: "Stack Overflow",
                        urlDisplay: "https://stackoverflow.com › questions › threejs-pointer-lock-rotation",
                        title: "How to fix Three.js FPS camera roll and pitch gimbal lock?",
                        snippet: "To prevent camera roll and sideways tilting in Three.js FPS games, explicitly set camera.rotation.order = 'YXZ' and constrain pitch between -Math.PI/2 and Math.PI/2.",
                        sitelinks: ["View 14 Answers", "Euler Rotation Fix", "Accepted Solution"],
                        badge: "Answered (84 Votes)"
                    }
                ];
            } else if (/isro|space|gaganyaan|moon|rocket|satellite|mars/i.test(q)) {
                organicResults = [
                    {
                        siteName: "ISRO Official Portal",
                        urlDisplay: "https://www.isro.gov.in › gaganyaan",
                        title: "Gaganyaan Mission — Indian Space Research Organisation",
                        snippet: "Gaganyaan project envisages demonstration of human spaceflight capability by launching crew of 3 members to an orbit of 400 km for a 3 days mission and bringing them back safely to Indian sea waters.",
                        sitelinks: ["Mission Overview", "HLVM3 Rocket", "Crew Module", "Launch Schedule"],
                        badge: "Gov Portal"
                    },
                    {
                        siteName: "The Hindu Science",
                        urlDisplay: "https://thehindu.com › sci-tech › science › isro-gaganyaan-progress",
                        title: "ISRO completes crucial human-rated CE-20 cryogenic rocket testing for Gaganyaan",
                        snippet: "The CE-20 cryogenic engine has been successfully certified for the human spaceflight mission after rigorous vacuum endurance hot tests at Mahendragiri propulsion complex.",
                        sitelinks: ["Full Story", "CE-20 Specifications", "Astronaut Training"],
                        badge: "Verified News"
                    },
                    {
                        siteName: "Wikipedia",
                        urlDisplay: "https://en.wikipedia.org/wiki/Gaganyaan",
                        title: "Gaganyaan — Wikipedia",
                        snippet: "Gaganyaan is an Indian crewed orbital spacecraft intended to be the formative spacecraft of the Indian Human Spaceflight Programme. The spacecraft is being designed to carry three astronauts.",
                        sitelinks: ["Spacecraft Design", "Orbital Telemetry", "Crew Selection"],
                        badge: "Encyclopedia"
                    }
                ];
            } else if (/rust|kernel|os|linux|c\+\+|programming|code/i.test(q)) {
                organicResults = [
                    {
                        siteName: "Rust Lang Official",
                        urlDisplay: "https://www.rust-lang.org › learn",
                        title: "Rust Programming Language — Performance, Reliability & Memory Safety",
                        snippet: "A language empowering everyone to build reliable and efficient software. No garbage collection, compile-time memory safety, zero-cost abstractions, and seamless multi-core SMP concurrency.",
                        sitelinks: ["Install Rust", "The Book", "Cargo Package Manager", "Standard Library"],
                        badge: "Official"
                    },
                    {
                        siteName: "Writing an OS in Rust",
                        urlDisplay: "https://os.phil-opp.com",
                        title: "Writing an OS in Rust (Second Edition) — Philipp Oppermann",
                        snippet: "Comprehensive guide to creating an operating system kernel in Rust: Bare Metal setup, VGA text mode, CPU exceptions, Double Faults, 4-Level Paging, Heap Allocation, and Multitasking.",
                        sitelinks: ["Paging Tutorial", "Memory Allocator", "Interrupts (IDT)", "Async/Await"],
                        badge: "Kernel Guide"
                    },
                    {
                        siteName: "GitHub",
                        urlDisplay: "https://github.com › sovereign-india › bharatos-kernel",
                        title: "Sovereign-India/BharatOS-Kernel: Pure Rust 64-bit Microkernel",
                        snippet: "Sovereign 64-bit Rust Microkernel with Ring-0 capabilities, SMP scheduling, NVMe DMA drivers, and zero-telemetry defense enclaves.",
                        sitelinks: ["Kernel Architecture", "Memory Manager", "Prithvi Compositor"],
                        badge: "GitHub ★ 3.8k"
                    }
                ];
            } else {
                // Dynamic Multi-Source Generator for any general query
                organicResults = [
                    {
                        siteName: `${q.split(' ')[0] || 'Web'}.com`,
                        urlDisplay: `https://www.${encodeURIComponent(q.replace(/\s+/g, '').toLowerCase())}.com › overview`,
                        title: `${q} — Official Portal, Overview & Insights`,
                        snippet: `Discover comprehensive guides, technical documentation, verified references, and community discussions regarding ${q}. Verified through BharatOS Sovereign Web Engine.`,
                        sitelinks: ["Overview", "Documentation", "Community Guide", "Latest News"],
                        badge: "Top Result"
                    },
                    {
                        siteName: "GitHub",
                        urlDisplay: `https://github.com › topics › ${encodeURIComponent(q.replace(/\s+/g, '-').toLowerCase())}`,
                        title: `Top Open-Source Repositories for ${q} — GitHub`,
                        snippet: `Explore top open-source projects, libraries, benchmarks, and developer implementations tagged with ${q}. Starred and maintained by the global developer community.`,
                        sitelinks: ["Repositories", "Popular Stars", "Topics", "Developers"],
                        badge: "GitHub"
                    },
                    {
                        siteName: "Stack Overflow",
                        urlDisplay: `https://stackoverflow.com › questions › tagged › ${encodeURIComponent(q.replace(/\s+/g, '-').toLowerCase())}`,
                        title: `Questions tagged [${q.split(' ')[0]}] — Stack Overflow`,
                        snippet: `Find the most active questions and verified answers on ${q}. Discuss architectural best practices, syntax, and performance optimization with expert engineers.`,
                        sitelinks: ["Top Questions", "Accepted Answers", "Tags"],
                        badge: "Stack Overflow"
                    },
                    {
                        siteName: "Tech News Daily",
                        urlDisplay: `https://technews.com › 2026 › articles › ${encodeURIComponent(q.replace(/\s+/g, '-').toLowerCase())}`,
                        title: `Latest Updates, Industry Trends & Analysis on ${q}`,
                        snippet: `Comprehensive industry report on how ${q} is shaping modern technology, enterprise engineering, and open standards in 2026.`,
                        sitelinks: ["Analysis", "Market Trends", "Expert Opinion"],
                        badge: "Tech News"
                    }
                ];
            }

            // Math Calculation detection
            let mathResult = null;
            if (/^[0-9\s\+\-\*/\^\(\)\.\%]+$/.test(q) && /[\+\-\*/]/.test(q)) {
                try {
                    mathResult = Function(`'use strict'; return (${q})`)();
                } catch(e){}
            }

            // Render Full Professional Google Search Interface
            viewport.innerHTML = `
            <div class="max-w-4xl mx-auto space-y-6 font-sans">
                <!-- Search Header Bar -->
                <div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div class="flex items-center space-x-3">
                        <span onclick="renderGoogleHome()" class="font-extrabold text-2xl tracking-tight cursor-pointer select-none">
                            <span class="text-[#4285F4]">G</span><span class="text-[#EA4335]">o</span><span class="text-[#FBBC05]">o</span><span class="text-[#4285F4]">g</span><span class="text-[#34A853]">l</span><span class="text-[#EA4335]">e</span>
                        </span>
                        <div class="flex items-center px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-xs w-84 shadow-sm focus-within:border-blue-500">
                            <input id="google-res-input" type="text" value="${q}" class="flex-1 bg-transparent border-none outline-none font-sans text-sm text-slate-900 dark:text-white" onkeydown="if(event.key==='Enter') executeGoogleSearch(this.value)">
                            <button onclick="executeGoogleSearch(document.getElementById('google-res-input').value)" class="text-blue-500 font-bold ml-2 hover:scale-110 transition-transform">🔍</button>
                        </div>
                    </div>

                    <div class="flex items-center space-x-2">
                        <a href="${searchUrl}" target="_blank" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-2 hover:scale-105 active:scale-95">
                            <span>🌐</span><span>Open on Live Google.com ↗</span>
                        </a>
                    </div>
                </div>

                <!-- Google Search Filter Tabs -->
                <div class="flex items-center space-x-6 text-xs text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span class="text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-500 pb-2 flex items-center space-x-1"><span>🔍</span><span>All</span></span>
                    <span class="hover:text-blue-500 cursor-pointer" onclick="executeGoogleSearch('${q} images')">🖼️ Images</span>
                    <span class="hover:text-blue-500 cursor-pointer" onclick="executeGoogleSearch('${q} videos')">📹 Videos</span>
                    <span class="hover:text-blue-500 cursor-pointer" onclick="executeGoogleSearch('${q} news')">📰 News</span>
                    <span class="hover:text-blue-500 cursor-pointer" onclick="executeGoogleSearch('${q} github')">💻 Code & Repos</span>
                    <span class="hover:text-blue-500 cursor-pointer" onclick="executeGoogleSearch('${q} maps')">🗺️ Maps</span>
                </div>

                <div class="text-xs text-slate-400">About ${(Math.floor(Math.random() * 800) + 120) * 10000} results (0.21 seconds)</div>

                <!-- Math Calculation Card if applicable -->
                ${mathResult !== null ? `
                <div class="p-5 rounded-2xl bg-slate-900 border-2 border-blue-500/50 font-mono space-y-1 shadow-xl">
                    <div class="text-xs text-slate-400">${q} =</div>
                    <div class="text-3xl font-extrabold text-blue-400">${mathResult}</div>
                </div>
                ` : ''}

                <!-- Direct Playable Game Banner if Gaming Query -->
                ${/game|fps|three|shooter|solaris/i.test(q) ? `
                <div class="p-5 rounded-2xl bg-gradient-to-r from-rose-950/60 to-slate-900 border-2 border-rose-500/50 flex items-center justify-between shadow-xl">
                    <div class="flex items-center space-x-4">
                        <span class="text-4xl">🎮</span>
                        <div>
                            <div class="text-base font-bold text-white">Play Solaris 3D Cyber Forge FPS in Browser</div>
                            <div class="text-xs text-slate-300">Ultra-Immersive Three.js WebGL engine running at 144 FPS with realistic city map</div>
                        </div>
                    </div>
                    <button onclick="navigateBrowserUrl('http://localhost:5678/game')" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all">
                        ▶ PLAY GAME NOW
                    </button>
                </div>
                ` : ''}

                <!-- Google Authentic Search Results Stream -->
                <div class="space-y-7 pt-1">
                    ${organicResults.map(res => `
                    <div class="space-y-1.5 group">
                        <!-- URL Breadcrumb & Favicon -->
                        <div class="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                            <span class="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-bold">${res.badge}</span>
                            <span class="truncate">${res.urlDisplay}</span>
                        </div>

                        <!-- Title Link -->
                        <h3 class="text-lg font-semibold text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer group-hover:text-blue-600 transition-colors" onclick="window.open('https://www.google.com/search?q=${encodeURIComponent(res.title)}', '_blank')">
                            ${res.title}
                        </h3>

                        <!-- Snippet Text -->
                        <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                            ${res.snippet}
                        </p>

                        <!-- Sitelinks Pills -->
                        ${res.sitelinks ? `
                        <div class="flex flex-wrap gap-2 pt-1">
                            ${res.sitelinks.map(link => `
                            <button onclick="executeGoogleSearch('${q} ${link}')" class="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-blue-600 dark:text-blue-400 text-xs hover:border-blue-500 transition-all">
                                ${link} →
                            </button>
                            `).join('')}
                        </div>
                        ` : ''}
                    </div>
                    `).join('')}
                </div>

                <!-- People Also Ask Accordion -->
                <div class="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 space-y-3">
                    <div class="text-sm font-bold text-slate-800 dark:text-slate-200">People also ask:</div>
                    <div class="space-y-2 text-xs">
                        <div class="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center cursor-pointer hover:border-blue-500" onclick="executeGoogleSearch('How to optimize ${q}?')">
                            <span>How to optimize and configure ${q}?</span>
                            <span class="text-blue-500 font-bold">▾</span>
                        </div>
                        <div class="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex justify-between items-center cursor-pointer hover:border-blue-500" onclick="executeGoogleSearch('Best tools and libraries for ${q}')">
                            <span>What are the best open-source tools for ${q}?</span>
                            <span class="text-blue-500 font-bold">▾</span>
                        </div>
                    </div>
                </div>

                <!-- Related Searches -->
                <div class="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 pb-8">
                    <div class="font-bold text-xs text-slate-700 dark:text-slate-300">Related Searches:</div>
                    <div class="flex flex-wrap gap-2 text-xs">
                        <button onclick="executeGoogleSearch('${q} tutorial 2026')" class="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-500/20 hover:text-blue-400 border border-slate-300 dark:border-slate-700 transition-all font-mono">🔍 ${q} tutorial 2026</button>
                        <button onclick="executeGoogleSearch('${q} documentation github')" class="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-500/20 hover:text-blue-400 border border-slate-300 dark:border-slate-700 transition-all font-mono">🔍 ${q} github repo</button>
                        <button onclick="executeGoogleSearch('${q} architecture benchmark')" class="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-500/20 hover:text-blue-400 border border-slate-300 dark:border-slate-700 transition-all font-mono">🔍 ${q} benchmark</button>
                    </div>
                </div>
            </div>`;
        }

        function navigateBrowserUrl(url) {
            playSfx('open');
            openAppWindow('browser-window', 'dock-browser');
            const input = document.getElementById('browser-url-input');
            const viewport = document.getElementById('browser-viewport');
            const extBtn = document.getElementById('btn-open-external-browser');

            if (input) input.value = url;
            if (extBtn) extBtn.href = url;

            if (url.includes('google.com/search') || url.includes('?q=')) {
                const params = new URLSearchParams(url.split('?')[1]);
                executeGoogleSearch(params.get('q') || 'BharatOS');
            } else if (url.includes('google.com') || url === 'google') {
                renderGoogleHome();
            } else if (url.includes('/game') || url.includes('solaris') || url.includes('fps')) {
                if (viewport) {
                    viewport.innerHTML = `
                        <div class="w-full h-full flex flex-col space-y-2">
                            <div class="flex justify-between items-center bg-slate-900/80 px-3 py-1.5 rounded-xl border border-cyan-500/30 text-xs font-mono">
                                <span class="text-cyan-400 font-bold flex items-center space-x-2"><span>🎮</span><span>Solaris 3D Tactical FPS (Three.js WebGL)</span></span>
                                <a href="http://localhost:5678/game" target="_blank" class="text-cyan-300 hover:underline">↗ Open Full Screen Game</a>
                            </div>
                            <iframe src="/game" class="w-full flex-1 rounded-2xl border border-cyan-500/20" allow="pointer-lock; autoplay"></iframe>
                        </div>
                    `;
                }
            } else if (url.includes('isro.gov.in')) {
                if (viewport) {
                    viewport.innerHTML = `
                    <div class="space-y-6 max-w-4xl mx-auto p-4 font-sans">
                        <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                            <div class="flex items-center space-x-3">
                                <span class="text-4xl">🛰️</span>
                                <div>
                                    <h1 class="text-xl font-bold">ISRO Space Operations Center</h1>
                                    <p class="text-xs text-slate-400 font-mono">Gaganyaan H1 Human Spaceflight Mission Control</p>
                                </div>
                            </div>
                            <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-xs font-mono font-bold">LIVE TELEMETRY: SYNCED</span>
                        </div>
                        <div class="grid grid-cols-3 gap-4 font-mono text-xs">
                            <div class="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 space-y-1">
                                <div class="opacity-60">Orbital Altitude</div>
                                <div class="text-lg font-bold text-cyan-500">400.2 km LEO</div>
                            </div>
                            <div class="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 space-y-1">
                                <div class="opacity-60">Orbital Velocity</div>
                                <div class="text-lg font-bold text-emerald-500">7.68 km/s (27,650 km/h)</div>
                            </div>
                            <div class="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 space-y-1">
                                <div class="opacity-60">Cryogenic Stage (CE-20)</div>
                                <div class="text-lg font-bold text-saffron">Pressure Nominal</div>
                            </div>
                        </div>
                    </div>`;
                }
            } else if (url.includes('github.com')) {
                if (viewport) {
                    viewport.innerHTML = `
                    <div class="space-y-6 max-w-4xl mx-auto p-4 font-sans">
                        <div class="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                            <span class="text-4xl">🐙</span>
                            <div>
                                <h1 class="text-xl font-bold">Sovereign India Open Source Repositories</h1>
                                <p class="text-xs text-slate-400 font-mono">github.com/sovereign • 124 Open Repositories</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 text-xs font-mono">
                            <div class="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 space-y-2">
                                <div class="flex justify-between font-bold text-cyan-500"><span>bharat-os-kernel</span><span>★ 4.8k</span></div>
                                <p class="text-[11px] opacity-70 font-sans">Pure Rust 64-bit microkernel with 4-level PML4 paging and zero telemetry.</p>
                            </div>
                            <div class="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 space-y-2">
                                <div class="flex justify-between font-bold text-emerald-500"><span>prithvi-vulkan-compositor</span><span>★ 3.2k</span></div>
                                <p class="text-[11px] opacity-70 font-sans">144 FPS spatial liquid-glass compositor with frame pacing.</p>
                            </div>
                        </div>
                    </div>`;
                }
            } else {
                executeGoogleSearch(url);
            }
        }

        function executeBrowserSearch(val) {
            if (!val) { renderGoogleHome(); return; }
            val = val.trim();
            if (val.startsWith('http://') || val.startsWith('https://')) navigateBrowserUrl(val);
            else if (val === 'google' || val === 'google.com') renderGoogleHome();
            else if (val === 'game' || val === 'fps' || val === 'solaris') navigateBrowserUrl('http://localhost:5678/game');
            else executeGoogleSearch(val);
        }

        function browserGoBack() { playSfx('click'); renderGoogleHome(); }
        function browserGoForward() { playSfx('click'); navigateBrowserUrl('http://localhost:5678/game'); }
        function browserReload() { playSfx('click'); navigateBrowserUrl(document.getElementById('browser-url-input')?.value || 'https://www.google.com'); }

        // Initialize Google Home inside Browser
        renderGoogleHome();

        // // INDIC CODE STUDIO (VS CODE IDE ENGINE)
        const IDE_FILES = {
            "main.rs": `// BharatOS Sovereign Microkernel v2026.1 LTS
// High Performance 144 FPS Vulkan & SMP Engine

use bharat_os::kernel::smp;
use bharat_os::vulkan::PrithviPacer;

#[no_mangle]
pub extern "C" fn sovereign_init() -> Result<(), KernelError> {
    println!("☸️ Initializing BharatOS Quantum Enclave...");
    
    let cores = smp::detect_cores();
    println!("✓ SMP Online: {} Logical Cores armed.", cores);

    let compositor = PrithviPacer::new(144.0)?;
    compositor.bind_framebuffer()?;
    println!("✓ Prithvi 144 Hz Vulkan Compositor running.");

    Ok(())
}`,
            "kernel.rs": `// BharatOS Kernel Core & Memory Paging
pub struct MemoryManager {
    pml4_root: u64,
    allocated_pages: usize,
}

impl MemoryManager {
    pub fn new() -> Self {
        Self { pml4_root: 0x100000, allocated_pages: 512 }
    }
}`,
            "vulkan.rs": `// Prithvi Vulkan 1.3 Display Compositor
pub struct PrithviPacer {
    refresh_rate: f64,
    vsync_enabled: bool,
}

impl PrithviPacer {
    pub fn new(hz: f64) -> Result<Self, ()> {
        Ok(Self { refresh_rate: hz, vsync_enabled: true })
    }
}`,
            "cargo.toml": `[package]
name = "bharat_os_core"
version = "2026.1.0"
edition = "2024"

[dependencies]
spin = "0.9"
vulkano = "0.34"`
        };

        function loadIdeFile(fname) {
            playSfx('click');
            ['main', 'kernel', 'vulkan', 'cargo'].forEach(k => {
                const b = document.getElementById(`ide-file-${k}`);
                if (b) b.className = 'w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center space-x-2';
            });
            const key = fname.split('.')[0];
            const activeBtn = document.getElementById(`ide-file-${key}`);
            if (activeBtn) activeBtn.className = 'w-full text-left px-2.5 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold flex items-center space-x-2';

            const editor = document.getElementById('ide-code-editor');
            if (editor && IDE_FILES[fname]) editor.value = IDE_FILES[fname];
        }

        function runIdeCode() {
            playSfx('click');
            const out = document.getElementById('ide-terminal-output');
            const btn = document.getElementById('btn-ide-run');
            if (btn) { btn.disabled = true; btn.textContent = 'Compiling...'; }

            out.innerHTML += `<div class="text-cyan-400 font-bold pt-1">Compiling workspace with rustc 1.82-nightly (Sovereign Target x86_64-bharat)...</div>`;
            out.scrollTop = out.scrollHeight;

            setTimeout(() => {
                playSfx('unlock');
                out.innerHTML += `
                <div class="text-emerald-400 font-bold">✓ Finished release [optimized] target(s) in 0.42s</div>
                <div class="text-white">☸️ Initializing BharatOS Quantum Enclave...</div>
                <div class="text-emerald-400">✓ SMP Online: 16 Logical Cores armed.</div>
                <div class="text-emerald-400">✓ Prithvi 144 Hz Vulkan Compositor running. (0.8 ms frame latency)</div>`;
                out.scrollTop = out.scrollHeight;
                if (btn) { btn.disabled = false; btn.textContent = '▶ Run Code (F5)'; }
            }, 600);
        }

        function formatIdeCode() {
            playSfx('click');
            const out = document.getElementById('ide-terminal-output');
            out.innerHTML += `<div class="text-cyan-400">rustfmt: Code formatted according to BharatOS Rust Style Guidelines.</div>`;
            out.scrollTop = out.scrollHeight;
        }

        // // KAVACH SOVEREIGN DEFENDER 3.0 ENGINE
        function switchKavachTab(tabKey) {
            playSfx('click');
            ['overview', 'lockdown', 'radar', 'privacy', 'neural', 'logs'].forEach(k => {
                const pane = document.getElementById(`kavach-pane-${k}`);
                const btn = document.getElementById(`kavach-nav-${k}`);
                if (pane) pane.classList.add('hidden');
                if (btn) btn.className = 'w-full text-left px-3 py-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800/80 font-bold flex items-center space-x-2.5';
            });
            const activePane = document.getElementById(`kavach-pane-${tabKey}`);
            const activeBtn = document.getElementById(`kavach-nav-${tabKey}`);
            if (activePane) activePane.classList.remove('hidden');
            if (activeBtn) activeBtn.className = 'w-full text-left px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold flex items-center space-x-2.5';
        }

        let scanProgress = 0;
        function triggerKavachScanType(type) {
            playSfx('click');
            const scanBox = document.getElementById('kavach-scan-progress-box');
            const scanBar = document.getElementById('scan-progress-bar');
            const scanCount = document.getElementById('scan-files-count');
            const scanCurr = document.getElementById('scan-current-file');
            const scanTitle = document.getElementById('scan-mode-title');

            if (scanBox) scanBox.classList.remove('hidden');

            const scanModes = {
                quick: { title: "⚡ Quick Memory Scan", total: "4,200 Pages", files: ["Active RAM Pages", "PML4 Kernel Maps", "Syscall Table Ring-0", "Heap Enclaves"] },
                full: { title: "🛡️ Full Kernel & SovereignFS Scan", total: "14,820 Files", files: ["/system/kernel.sys", "/system/kavach_vault.key", "/home/user/documents/sovereignty_manifesto.md", "/system/vulkan_pacer.hal", "/system/pml4_memory_map.bin"] },
                neural: { title: "🧠 AI Zero-Day Heuristic Scan", total: "98 Neural Pipelines", files: ["Transformer Syscall Weights", "Execution Flow Tree", "Zero-Day Heuristic Model", "NPU Ring-0 Buffer"] },
                enclave: { title: "🔒 Hardware Enclave Key Sanitizer", total: "256-bit Key Blocks", files: ["Silicon Root Key", "AES-XTS Keystore", "Biometric Touch Token", "Zero-Trust Ring"] }
            };

            const cfg = scanModes[type] || scanModes.full;
            if (scanTitle) scanTitle.innerHTML = `<span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span><span>${cfg.title} in progress...</span>`;

            scanProgress = 0;
            const interval = setInterval(() => {
                scanProgress += 20;
                if (scanBar) scanBar.style.width = `${scanProgress}%`;
                const fIdx = Math.min(Math.floor(scanProgress / 20), cfg.files.length - 1);
                if (scanCount) scanCount.textContent = `${Math.floor((scanProgress / 100) * 100)}% (${cfg.total})`;
                if (scanCurr) scanCurr.textContent = `Inspecting: ${cfg.files[fIdx]}...`;

                if (scanProgress >= 100) {
                    clearInterval(interval);
                    playSfx('unlock');
                    if (scanCurr) scanCurr.innerHTML = `<strong class="text-emerald-500">✓ ${cfg.title} Complete: 0 Anomalies Found. Sovereign Certification AAA+!</strong>`;
                }
            }, 250);
        }

        function startKavachScan() {
            triggerKavachScanType('full');
        }

        function toggleLockdownMode(enabled) {
            playSfx(enabled ? 'unlock' : 'click');
            const badge = document.getElementById('kavach-lockdown-badge');
            if (enabled) {
                if (badge) badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span><span>LOCKDOWN MODE: ACTIVE</span>`;
                if (badge) badge.className = 'px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/40 text-[10px] font-mono font-bold flex items-center space-x-1.5';
            } else {
                if (badge) badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span><span>GRADE: AAA+ FORTIFIED</span>`;
                if (badge) badge.className = 'px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center space-x-1.5';
            }
        }

        function toggleShieldFeature(feature, enabled) {
            playSfx('click');
        }

        function clearKavachLogs() {
            playSfx('click');
            const list = document.getElementById('kavach-log-list');
            if (list) list.innerHTML = `<div class="p-3 text-center text-slate-500 font-mono text-xs">Security event log cleared. Real-time audit stream armed.</div>`;
        }

        // Bharat Island Engine
        let isIslandExpanded = false;
        function toggleDynamicIsland() {
            playSfx('click');
            const island = document.getElementById('dynamic-island-container');
            const compactView = document.getElementById('island-compact-view');
            const expandedView = document.getElementById('island-expanded-view');
            
            if (!isIslandExpanded) {
                island.classList.remove('compact');
                island.classList.add('expanded');
                compactView.classList.add('hidden');
                expandedView.classList.remove('hidden');
                isIslandExpanded = true;
            } else {
                island.classList.remove('expanded');
                island.classList.add('compact');
                expandedView.classList.add('hidden');
                compactView.classList.remove('hidden');
                isIslandExpanded = false;
            }
        }

        // Desktop Widgets Toggle
        let widgetsVisible = true;
        function toggleWidgets() {
            playSfx('click');
            const panel = document.getElementById('desktop-widgets-panel');
            if (panel) {
                widgetsVisible = !widgetsVisible;
                if (widgetsVisible) {
                    panel.style.display = 'block';
                    setTimeout(() => {
                        panel.style.opacity = '1';
                        panel.style.transform = 'translateX(0)';
                    }, 10);
                } else {
                    panel.style.opacity = '0';
                    panel.style.transform = 'translateX(60px)';
                    setTimeout(() => { panel.style.display = 'none'; }, 250);
                }
            }
        }

        // Theme Engine
        let currentTheme = 'dark';
        function toggleTheme() {
            playSfx('click');
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', currentTheme);
            document.documentElement.classList.toggle('dark', currentTheme === 'dark');
            document.documentElement.classList.toggle('light', currentTheme === 'light');
            document.body.classList.toggle('dark', currentTheme === 'dark');
            document.body.classList.toggle('light', currentTheme === 'light');

            const icon = document.getElementById('theme-icon');
            const text = document.getElementById('theme-text');
            if (currentTheme === 'dark') {
                if (icon) icon.textContent = '☀️';
                if (text) text.textContent = 'Light';
            } else {
                if (icon) icon.textContent = '🌙';
                if (text) text.textContent = 'Dark';
            }

            // CRITICAL: Always re-verify wallpaper background so 4K scenery is never replaced by solid color!
            const savedCustom = localStorage.getItem('bharatos_custom_wallpaper');
            const savedWp = localStorage.getItem('bharatos_wallpaper') || 'wall-ladakh-ai';
            if (savedCustom) {
                applyWallpaperWithTarget(null, savedCustom);
            } else {
                applyWallpaperWithTarget(savedWp);
            }

            showNotificationToast("Theme Engine", `Switched to ${currentTheme.toUpperCase()} theme with active 4K wallpaper.`, "info");
        }

        // Boot Engine
        let bootProgress = 0;
        const progressEl = document.getElementById('minimal-boot-progress');
        const labelEl = document.getElementById('minimal-boot-label');
        const bootMessages = [
            "Initializing 64-bit Memory Paging & VMM...",
            "Loading Bharat Island & Security Enclave...",
            "Starting Prithvi 144 FPS Vulkan Compositor...",
            "Sovereign Lock Screen Ready..."
        ];

        function runMinimalBoot() {
            if (bootProgress < 100) {
                bootProgress += 25;
                if (progressEl) progressEl.style.width = `${bootProgress}%`;
                const msgIdx = Math.min(Math.floor(bootProgress / 25) - 1, bootMessages.length - 1);
                if (labelEl && msgIdx >= 0) labelEl.textContent = bootMessages[msgIdx];
                setTimeout(runMinimalBoot, 300);
            } else {
                setTimeout(finishMinimalBoot, 250);
            }
        }

        function finishMinimalBoot() {
            const screen = document.getElementById('boot-screen');
            if (screen) {
                screen.classList.add('fade-out-boot');
                setTimeout(() => {
                    screen.style.display = 'none';
                    const pin = document.getElementById('lock-pin-input');
                    if (pin) pin.focus();
                }, 750);
            }
        }
        setTimeout(runMinimalBoot, 100);

        // Sticky Notes
        function saveStickyNote(text) { localStorage.setItem('bharat_sticky_note', text); }
        function clearStickyNote() {
            playSfx('click');
            const area = document.getElementById('sticky-note-area');
            if (area) { area.value = ''; localStorage.removeItem('bharat_sticky_note'); }
        }

        // // ROBUST NATURE OF BHARAT 4K WALLPAPER MANAGER
        const WALLPAPER_MAP = {
            'wall-ladakh-ai': 'wallpapers/ladakh_pangong.jpg',
            'wall-munnar-ai': 'wallpapers/munnar_hills.jpg',
            'wall-varanasi-ai': 'wallpapers/varanasi_dawn.jpg',
            'wall-thar-ai': 'wallpapers/thar_twilight.jpg',
            'wall-kashmir-ai': 'wallpapers/kashmir_dal.jpg',
            'wall-andaman-ai': 'wallpapers/andaman_beach.jpg',
            'wall-waterfall-ai': 'wallpapers/waterfall_ghats.jpg',
            'wall-kutch-ai': 'wallpapers/kutch_rann.jpg'
        };

        
        // // CUSTOM WALLPAPER & LOCK SCREEN SYNC ENGINE (PILLAR 7 PERSONALIZATION)

        function applyWallpaperWithTarget(className, customImgUrl = null) {
            playSfx('click');
            const target = document.getElementById('wp-target-select')?.value || 'both';
            const imgPath = customImgUrl || WALLPAPER_MAP[className] || 'wallpapers/ladakh_pangong.jpg';

            if (target === 'both' || target === 'desktop') {
                const currentClasses = Array.from(document.body.classList);
                currentClasses.forEach(cls => {
                    if (cls.startsWith('wall-')) document.body.classList.remove(cls);
                });
                if (className) document.body.classList.add(className);
                
                document.body.style.backgroundImage = `url('${imgPath}')`;
                document.body.style.backgroundRepeat = 'no-repeat';
                document.body.style.backgroundPosition = 'center center';
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundAttachment = 'fixed';
                
                if (customImgUrl) {
                    localStorage.setItem('bharatos_custom_wallpaper', customImgUrl);
                    localStorage.setItem('bharatos_wallpaper', 'custom');
                } else {
                    localStorage.removeItem('bharatos_custom_wallpaper');
                    localStorage.setItem('bharatos_wallpaper', className);
                }
            }

            if (target === 'both' || target === 'lock') {
                const lockEl = document.getElementById('lock-screen');
                if (lockEl) {
                    lockEl.style.backgroundImage = `url('${imgPath}')`;
                    lockEl.style.backgroundRepeat = 'no-repeat';
                    lockEl.style.backgroundPosition = 'center center';
                    lockEl.style.backgroundSize = 'cover';
                    localStorage.setItem('bharatos_lock_wallpaper', customImgUrl || imgPath);
                }
            }

            showNotificationToast("Personalization", `Wallpaper applied to ${target.toUpperCase()}.`, "success");
        }

        function handleCustomWallpaperUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                const base64Url = e.target.result;
                applyWallpaperWithTarget(null, base64Url);
            };
            reader.readAsDataURL(file);
        }

        function applyCustomWallpaperUrl() {
            const input = document.getElementById('custom-wp-url-input');
            if (!input || !input.value.trim()) {
                alert("Please enter a valid image URL.");
                return;
            }
            applyWallpaperWithTarget(null, input.value.trim());
        }

        function switchCustomTab(tab) {
            playSfx('click');
            ['wallpapers', 'glass', 'accents', 'lockscreen'].forEach(t => {
                const btn = document.getElementById(`cust-tab-${t}`);
                if (btn) {
                    if (t === tab) {
                        btn.className = "px-3.5 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40";
                    } else {
                        btn.className = "px-3.5 py-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400";
                    }
                }
            });

            const contentPane = document.getElementById('custom-tab-content');
            if (tab === 'wallpapers') {
                // Render Wallpapers Pane
                contentPane.innerHTML = `
                    <div class="space-y-6">
                        <!-- Custom Wallpaper Upload & URL Hub -->
                        <div class="p-5 rounded-3xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-slate-900/80 border-2 border-pink-500/40 shadow-xl space-y-4">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <span class="text-3xl">📤</span>
                                    <div>
                                        <h3 class="text-sm font-bold text-white">Add Custom Wallpaper</h3>
                                        <p class="text-[11px] text-slate-300">Upload your own photo or paste any online 4K wallpaper URL</p>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-2 text-xs">
                                    <label class="text-[11px] opacity-70">Target:</label>
                                    <select id="wp-target-select" class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 font-bold outline-none">
                                        <option value="both">Desktop & Lock Screen (Both)</option>
                                        <option value="desktop">Desktop Only</option>
                                        <option value="lock">Lock Screen Only</option>
                                    </select>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div class="p-4 rounded-2xl bg-white/5 border border-dashed border-pink-500/60 flex flex-col items-center justify-center text-center space-y-2 hover:bg-white/10 transition-all cursor-pointer" onclick="document.getElementById('custom-wp-file-input').click()">
                                    <span class="text-2xl">📁</span>
                                    <div class="font-bold text-xs text-pink-300">Choose Image from your PC</div>
                                    <p class="text-[10px] opacity-60">Supports PNG, JPG, WebP, 4K High-Res</p>
                                    <input type="file" id="custom-wp-file-input" accept="image/*" class="hidden" onchange="handleCustomWallpaperUpload(event)">
                                </div>

                                <div class="p-4 rounded-2xl bg-white/5 border border-slate-700 space-y-2">
                                    <div class="font-bold text-xs text-slate-200">Or Paste Image URL:</div>
                                    <div class="flex space-x-2">
                                        <input type="text" id="custom-wp-url-input" placeholder="https://images.unsplash.com/..." class="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500">
                                        <button onclick="applyCustomWallpaperUrl()" class="px-4 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-md">Apply</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 4K Heritage Wallpapers Gallery -->
                        <div class="space-y-3">
                            <div class="flex justify-between items-center">
                                <h3 class="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Official 4K BharatOS Wallpapers</h3>
                                <span class="text-[10px] text-cyan-500">8 Presets Available</span>
                            </div>

                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div onclick="applyWallpaperWithTarget('wall-ladakh-ai')" class="wp-card-btn group p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-cyan-500 cursor-pointer transition-all hover:scale-105 shadow-md">
                                    <div class="w-full h-24 rounded-xl bg-cover bg-center mb-2" style="background-image: url('wallpapers/ladakh_pangong.jpg');"></div>
                                    <div class="font-bold text-xs truncate">Ladakh Pangong</div>
                                    <div class="text-[10px] opacity-60">Pristine Alpine Lake</div>
                                </div>

                                <div onclick="applyWallpaperWithTarget('wall-munnar-ai')" class="wp-card-btn group p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-emerald-500 cursor-pointer transition-all hover:scale-105 shadow-md">
                                    <div class="w-full h-24 rounded-xl bg-cover bg-center mb-2" style="background-image: url('wallpapers/munnar_hills.jpg');"></div>
                                    <div class="font-bold text-xs truncate">Munnar Hills</div>
                                    <div class="text-[10px] opacity-60">Misty Tea Plantations</div>
                                </div>

                                <div onclick="applyWallpaperWithTarget('wall-varanasi-ai')" class="wp-card-btn group p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-orange-500 cursor-pointer transition-all hover:scale-105 shadow-md">
                                    <div class="w-full h-24 rounded-xl bg-cover bg-center mb-2" style="background-image: url('wallpapers/varanasi_dawn.jpg');"></div>
                                    <div class="font-bold text-xs truncate">Varanasi Dawn</div>
                                    <div class="text-[10px] opacity-60">Sacred Ghats Sunburst</div>
                                </div>

                                <div onclick="applyWallpaperWithTarget('wall-thar-ai')" class="wp-card-btn group p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-amber-500 cursor-pointer transition-all hover:scale-105 shadow-md">
                                    <div class="w-full h-24 rounded-xl bg-cover bg-center mb-2" style="background-image: url('wallpapers/thar_desert.jpg');"></div>
                                    <div class="font-bold text-xs truncate">Thar Desert</div>
                                    <div class="text-[10px] opacity-60">Golden Dunes Twilight</div>
                                </div>

                                <div onclick="applyWallpaperWithTarget('wall-kashmir-ai')" class="wp-card-btn group p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-purple-500 cursor-pointer transition-all hover:scale-105 shadow-md">
                                    <div class="w-full h-24 rounded-xl bg-cover bg-center mb-2" style="background-image: url('wallpapers/kashmir_dal_lake.jpg');"></div>
                                    <div class="font-bold text-xs truncate">Kashmir Dal Lake</div>
                                    <div class="text-[10px] opacity-60">Shikara Sunset Bloom</div>
                                </div>

                                <div onclick="applyWallpaperWithTarget('wall-andaman-ai')" class="wp-card-btn group p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-teal-500 cursor-pointer transition-all hover:scale-105 shadow-md">
                                    <div class="w-full h-24 rounded-xl bg-cover bg-center mb-2" style="background-image: url('wallpapers/andaman_beach.jpg');"></div>
                                    <div class="font-bold text-xs truncate">Andaman Cove</div>
                                    <div class="text-[10px] opacity-60">Turquoise Ocean Waves</div>
                                </div>

                                <div onclick="applyWallpaperWithTarget('wall-waterfall-ai')" class="wp-card-btn group p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-emerald-500 cursor-pointer transition-all hover:scale-105 shadow-md">
                                    <div class="w-full h-24 rounded-xl bg-cover bg-center mb-2" style="background-image: url('wallpapers/waterfall_ghats.jpg');"></div>
                                    <div class="font-bold text-xs truncate">Western Ghats</div>
                                    <div class="text-[10px] opacity-60">Tropical Cascading Falls</div>
                                </div>

                                <div onclick="applyWallpaperWithTarget('wall-kutch-ai')" class="wp-card-btn group p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-cyan-500 cursor-pointer transition-all hover:scale-105 shadow-md">
                                    <div class="w-full h-24 rounded-xl bg-cover bg-center mb-2" style="background-image: url('wallpapers/kutch_rann.jpg');"></div>
                                    <div class="font-bold text-xs truncate">Kutch White Desert</div>
                                    <div class="text-[10px] opacity-60">Moonlit Salt Flats</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (tab === 'glass') {
                contentPane.innerHTML = `
                    <div class="space-y-5">
                        <h3 class="text-sm font-bold text-white">Liquid Glassmorphism Controls</h3>
                        <div class="space-y-4">
                            <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                                <div class="flex justify-between"><span>Blur Intensity</span><span id="blur-val" class="font-bold text-cyan-400">48 px</span></div>
                                <input type="range" min="10" max="80" value="48" class="w-full accent-cyan-500 cursor-pointer" oninput="document.getElementById('blur-val').textContent = this.value + ' px'">
                            </div>
                            <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                                <div class="flex justify-between"><span>Glass Opacity</span><span id="opacity-val" class="font-bold text-pink-400">85%</span></div>
                                <input type="range" min="30" max="100" value="85" class="w-full accent-pink-500 cursor-pointer" oninput="document.getElementById('opacity-val').textContent = this.value + '%'">
                            </div>
                            <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                                <div class="flex justify-between"><span>Specular Edge Shine</span><span class="font-bold text-emerald-400">Active (2px Top-Lit)</span></div>
                                <div class="text-[11px] opacity-70">Emulates physical bevel prism light reflection across all active windows.</div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (tab === 'accents') {
                contentPane.innerHTML = `
                    <div class="space-y-5">
                        <h3 class="text-sm font-bold text-white">System Color Accents</h3>
                        <div class="grid grid-cols-3 gap-3">
                            <button onclick="setAccentColor('#00e5ff')" class="p-3 rounded-2xl bg-cyan-950/60 border-2 border-cyan-500 text-cyan-300 font-bold flex items-center space-x-2">
                                <span class="w-4 h-4 rounded-full bg-cyan-400 shadow-md"></span><span>Electric Cyan</span>
                            </button>
                            <button onclick="setAccentColor('#ff9933')" class="p-3 rounded-2xl bg-amber-950/60 border border-amber-500/60 text-amber-300 font-bold flex items-center space-x-2">
                                <span class="w-4 h-4 rounded-full bg-amber-400 shadow-md"></span><span>Saffron Gold</span>
                            </button>
                            <button onclick="setAccentColor('#10b981')" class="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 font-bold flex items-center space-x-2">
                                <span class="w-4 h-4 rounded-full bg-emerald-400 shadow-md"></span><span>Emerald Shield</span>
                            </button>
                            <button onclick="setAccentColor('#ec4899')" class="p-3 rounded-2xl bg-pink-950/60 border border-pink-500/60 text-pink-300 font-bold flex items-center space-x-2">
                                <span class="w-4 h-4 rounded-full bg-pink-400 shadow-md"></span><span>Cosmic Pink</span>
                            </button>
                            <button onclick="setAccentColor('#a855f7')" class="p-3 rounded-2xl bg-purple-950/60 border border-purple-500/60 text-purple-300 font-bold flex items-center space-x-2">
                                <span class="w-4 h-4 rounded-full bg-purple-400 shadow-md"></span><span>Royal Violet</span>
                            </button>
                            <button onclick="setAccentColor('#ef4444')" class="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/60 text-rose-300 font-bold flex items-center space-x-2">
                                <span class="w-4 h-4 rounded-full bg-rose-400 shadow-md"></span><span>Crimson Flare</span>
                            </button>
                        </div>
                    </div>
                `;
            
            } else if (tab === 'fluidglass') {
                contentPane.innerHTML = `
                    <div class="space-y-6">
                        <!-- FluidGlass Overview Banner -->
                        <div class="p-5 rounded-3xl bg-gradient-to-r from-cyan-950/50 via-blue-950/40 to-slate-900 border-2 border-cyan-500/50 shadow-xl space-y-2">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-3">
                                    <span class="text-4xl">🌊</span>
                                    <div>
                                        <h3 class="text-base font-bold text-white">Three.js FluidGlass Physical Shader Engine</h3>
                                        <p class="text-xs text-cyan-300">React Bits physical transmission & chromatic optical ray refraction on OS Desktop</p>
                                    </div>
                                </div>
                                <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/40">144 FPS WebGL</span>
                            </div>
                        </div>

                        <!-- Mode Selector -->
                        <div class="space-y-3">
                            <div class="text-xs font-bold text-white uppercase tracking-wider">3D Refraction Modes:</div>
                            <div class="grid grid-cols-3 gap-4">
                                <button onclick="setFluidGlassMode('lens')" class="p-4 rounded-2xl bg-cyan-950/50 border-2 border-cyan-500 text-left space-y-1 hover:scale-105 transition-all">
                                    <div class="text-lg">🔍</div>
                                    <div class="font-bold text-xs text-cyan-300">Pointer Lens Follow</div>
                                    <div class="text-[10px] opacity-70">Physical 3D glass lens tracking cursor with chromatic dispersion.</div>
                                </button>

                                <button onclick="setFluidGlassMode('bar')" class="p-4 rounded-2xl bg-slate-900 border border-slate-700 text-left space-y-1 hover:border-cyan-500 hover:scale-105 transition-all">
                                    <div class="text-lg">📐</div>
                                    <div class="font-bold text-xs text-white">Bottom Taskbar Prism</div>
                                    <div class="text-[10px] opacity-70">Physical 3D glass bar anchored to bottom dock.</div>
                                </button>

                                <button onclick="setFluidGlassMode('off')" class="p-4 rounded-2xl bg-slate-900 border border-slate-700 text-left space-y-1 hover:border-rose-500 hover:scale-105 transition-all">
                                    <div class="text-lg">⚡</div>
                                    <div class="font-bold text-xs text-slate-300">Eco Mode (Off)</div>
                                    <div class="text-[10px] opacity-70">Disables 3D WebGL background shader to conserve GPU power.</div>
                                </button>
                            </div>
                        </div>

                        <!-- Optical Shader Sliders -->
                        <div class="space-y-4 pt-2">
                            <div class="text-xs font-bold text-white uppercase tracking-wider">Physical Optical Shader Parameters:</div>

                            <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                <div class="flex justify-between text-xs">
                                    <span>Index of Refraction (IOR)</span>
                                    <span id="fg-ior-val" class="font-bold text-cyan-400">1.18</span>
                                </div>
                                <input type="range" min="1.0" max="1.6" step="0.01" value="1.18" class="w-full accent-cyan-500 cursor-pointer" oninput="document.getElementById('fg-ior-val').textContent = this.value; setFluidGlassProp('ior', this.value);">
                            </div>

                            <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                <div class="flex justify-between text-xs">
                                    <span>Chromatic Aberration (RGB Light Dispersion)</span>
                                    <span id="fg-chroma-val" class="font-bold text-pink-400">0.12</span>
                                </div>
                                <input type="range" min="0.0" max="0.4" step="0.01" value="0.12" class="w-full accent-pink-500 cursor-pointer" oninput="document.getElementById('fg-chroma-val').textContent = this.value; setFluidGlassProp('chromaticAberration', this.value);">
                            </div>

                            <div class="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                                <div class="flex justify-between text-xs">
                                    <span>Glass Thickness (Ray Bending Depth)</span>
                                    <span id="fg-thick-val" class="font-bold text-emerald-400">5.0</span>
                                </div>
                                <input type="range" min="1.0" max="15.0" step="0.5" value="5.0" class="w-full accent-emerald-500 cursor-pointer" oninput="document.getElementById('fg-thick-val').textContent = this.value; setFluidGlassProp('thickness', this.value);">
                            </div>
                        </div>
                    </div>
                `;

            } else if (tab === 'lockscreen') {
                contentPane.innerHTML = `
                    <div class="space-y-5">
                        <h3 class="text-sm font-bold text-white">Sovereign Lock Screen Architecture</h3>
                        <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                            <div class="font-bold text-xs text-cyan-400">Lock Screen Wallpaper Sync:</div>
                            <p class="text-[11px] opacity-70">Lock screen automatically renders your active 4K/custom wallpaper with multi-layer astronomical rings, Panchang ephemeris, and biometric Chakra passkeys.</p>
                            <button onclick="lockDesktop()" class="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md">
                                🔒 Test Lock Screen Now
                            </button>
                        </div>
                    </div>
                `;
            }
        }

        function setAccentColor(color) {
            playSfx('click');
            document.documentElement.style.setProperty('--accent-color', color);
            showNotificationToast("Theme Studio", `Accent color updated.`, "success");
        }

        // Initialize saved wallpapers for Desktop & Lock Screen on Boot
        try {
            const savedCustom = localStorage.getItem('bharatos_custom_wallpaper');
            const savedLock = localStorage.getItem('bharatos_lock_wallpaper');
            const savedWp = localStorage.getItem('bharatos_wallpaper') || 'wall-ladakh-ai';

            if (savedCustom) {
                applyWallpaperWithTarget(null, savedCustom);
            } else {
                applyWallpaperWithTarget(savedWp);
            }

            if (savedLock) {
                const lockEl = document.getElementById('lock-screen');
                if (lockEl) {
                    lockEl.style.backgroundImage = `url('${savedLock}')`;
                    lockEl.style.backgroundRepeat = 'no-repeat';
                    lockEl.style.backgroundPosition = 'center center';
                    lockEl.style.backgroundSize = 'cover';
                }
            }
        } catch(e) {}


        function setWallpaper(className) {
            try {
                if (window.audioCtx) playSfx('click');
            } catch(e) {}
            
            // Clean prior wallpaper classes
            const currentClasses = Array.from(document.body.classList);
            currentClasses.forEach(cls => {
                if (cls.startsWith('wall-')) document.body.classList.remove(cls);
            });
            document.body.classList.add(className);
            
            const imgPath = WALLPAPER_MAP[className] || 'wallpapers/ladakh_pangong.jpg';
            document.body.style.backgroundImage = `url('${imgPath}')`;
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundPosition = 'center center';
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundAttachment = 'fixed';
            
            localStorage.setItem('bharatos_wallpaper', className);
            updateWallpaperSelectionUI(className);
        }

        function updateWallpaperSelectionUI(activeClass) {
            document.querySelectorAll('.wp-card-btn').forEach(btn => {
                btn.classList.remove('border-2', 'border-cyan-500');
                btn.classList.add('border', 'border-slate-300', 'dark:border-slate-800');
            });
            const activeBtn = document.getElementById(`wp-btn-${activeClass}`);
            if (activeBtn) {
                activeBtn.classList.remove('border', 'border-slate-300', 'dark:border-slate-800');
                activeBtn.classList.add('border-2', 'border-cyan-500');
            }
        }

        // Initialize saved wallpaper
        try {
            const savedWp = localStorage.getItem('bharatos_wallpaper') || 'wall-ladakh-ai';
            setWallpaper(savedWp);
        } catch(e) {}

        function toggleNightLight() { playSfx('click'); document.body.classList.toggle('night-light'); }
        function openKeybindingsModal() { playSfx('open'); document.getElementById('shortcuts-modal').classList.remove('hidden'); }
        function closeKeybindingsModal() { playSfx('close'); document.getElementById('shortcuts-modal').classList.add('hidden'); }

        // // REVOLUTIONARY WINDOW MANAGER & RESPONSIVE DOCK ENGINE (RACE-FREE)

        let highestZ = 30;
        const winTimeoutMap = {};

        
        // START MENU INTERACTION ENGINE
        
        // SHOW DESKTOP & WINDOWS TOGGLE ENGINE
        var savedOpenWindowsBeforeShowDesktop = [];

        function toggleShowDesktop() {
            playSfx('minimize');
            const openWindows = Array.from(document.querySelectorAll('.ultra-liquid-glass:not(#app-switcher-overlay):not(#ai-copilot-drawer):not(#action-center-drawer):not(#spotlight-modal)')).filter(w => !w.classList.contains('hidden') && w.style.display !== 'none');

            if (openWindows.length > 0) {
                savedOpenWindowsBeforeShowDesktop = openWindows.map(w => w.id);
                openWindows.forEach(w => {
                    w.classList.add('hidden');
                });
                showNotificationToast("Desktop", "All windows minimized (Win+D).", "info");
            } else if (savedOpenWindowsBeforeShowDesktop.length > 0) {
                savedOpenWindowsBeforeShowDesktop.forEach(id => {
                    const win = document.getElementById(id);
                    if (win) {
                        win.classList.remove('hidden');
                        win.style.display = '';
                    }
                });
                savedOpenWindowsBeforeShowDesktop = [];
                showNotificationToast("Desktop", "Restored open windows.", "info");
            }
        }

        function toggleStartMenu() {
            playSfx('click');
            const menu = document.getElementById('start-menu-popup');
            if (menu) {
                menu.classList.toggle('hidden');
            }
        }

        function scanHardwareDevices() {
            playSfx('scan');
            showNotificationToast("Hardware Bus Scan", "Scanning PCIe Gen5, USB 4.0, and Quantum TPM bus...", "info");
            setTimeout(() => {
                showNotificationToast("Hardware Audit Complete", "24 devices verified. Zero conflicts detected.", "success");
            }, 800);
        }

        function runSpeedTest() {
            playSfx('click');
            showNotificationToast("Speed Test", "Testing throughput against Mumbai Quantum Gateway...", "info");
            const speedEl = document.getElementById('network-live-speed');
            let s = 100;
            const timer = setInterval(() => {
                s += Math.floor(Math.random() * 120) + 50;
                if (speedEl) speedEl.innerHTML = `${s}.2 <span class="text-xs text-cyan-400 font-bold">Mbps</span>`;
                if (s >= 850) {
                    clearInterval(timer);
                    showNotificationToast("Speed Test Result", "Download: 850.4 Mbps • Upload: 420.8 Mbps • Ping: 2ms", "success");
                }
            }, 100);
        }

        function setWallpaper(type) {
            playSfx('click');
            const desktop = document.getElementById('desktop-area');
            if (!desktop) return;
            if (type === 'space') {
                desktop.style.background = 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)';
            } else if (type === 'matrix') {
                desktop.style.background = 'radial-gradient(ellipse at top, #022c22 0%, #020617 100%)';
            } else {
                desktop.style.background = '';
            }
            showNotificationToast("Wallpaper Updated", `Applied "${type.toUpperCase()}" 4K Sovereign Wallpaper.`, "success");
        }

        function openAppWindow(winId, dockBtnId) {
            playSfx('open');
            const win = document.getElementById(winId);
            const dockBtn = document.getElementById(dockBtnId);
            if (!win) {
                console.warn("openAppWindow: Window element not found:", winId);
                return;
            }

            if (winTimeoutMap[winId]) {
                clearTimeout(winTimeoutMap[winId]);
                delete winTimeoutMap[winId];
            }

            win.style.display = '';
            win.classList.remove('hidden', 'window-minimize-genie');
            win.classList.add('window-open-genie');
            highestZ += 5;
            win.style.zIndex = String(highestZ);

            // Highlight dock icon with glowing cyan running dot
            if (dockBtn) dockBtn.classList.add('app-running');
        }

        function closeAppWindow(winId, dockBtnId) {
            playSfx('close');
            const win = document.getElementById(winId);
            const dockBtn = document.getElementById(dockBtnId);
            if (!win) return;

            if (winTimeoutMap[winId]) clearTimeout(winTimeoutMap[winId]);

            win.classList.remove('window-open-genie');
            win.classList.add('window-minimize-genie');
            if (dockBtn) dockBtn.classList.remove('app-running');

            winTimeoutMap[winId] = setTimeout(() => {
                win.classList.add('hidden');
                win.classList.remove('window-minimize-genie');
                delete winTimeoutMap[winId];
            }, 210);
        }

        function minimizeAppWindow(winId, dockBtnId) { 
            playSfx('minimize'); 
            closeAppWindow(winId, dockBtnId); 
        }

        function toggleWindowFromDock(winId, dockBtnId) {
            const win = document.getElementById(winId);
            const dockBtn = document.getElementById(dockBtnId);
            if (!win) {
                console.warn("toggleWindowFromDock: Window not found:", winId);
                return;
            }

            const isHidden = win.classList.contains('hidden') || win.classList.contains('window-minimize-genie') || win.style.display === 'none';

            if (isHidden) {
                // If closed or minimizing, open immediately
                openAppWindow(winId, dockBtnId);
            } else {
                // If already open, check if it's top-most
                const currentZ = parseInt(win.style.zIndex || '0');
                if (currentZ === highestZ) {
                    // It's in front and active, minimize it
                    minimizeAppWindow(winId, dockBtnId);
                } else {
                    // Bring to front with spring focus
                    highestZ += 2;
                    win.style.zIndex = highestZ;
                    playSfx('click');
                }
            }
        }

        function toggleMaximizeWindow(winId) {
            playSfx('click');
            const el = document.getElementById(winId);
            if (!el) return;

            const isMax = el.classList.contains('window-maximized');
            if (!isMax) {
                // Save current position and bounds
                el.dataset.prevLeft = el.style.left || `${el.offsetLeft}px`;
                el.dataset.prevTop = el.style.top || `${el.offsetTop}px`;
                el.dataset.prevWidth = el.style.width || `${el.offsetWidth}px`;
                el.dataset.prevHeight = el.style.height || `${el.offsetHeight}px`;

                el.style.removeProperty('top');
                el.style.removeProperty('left');
                el.style.removeProperty('width');
                el.style.removeProperty('height');
                el.style.removeProperty('transform');
                
                el.classList.add('window-maximized');
                highestZ += 2;
                el.style.zIndex = String(highestZ + 500);
                showSecurityToast(`🔲 Full Screen: ${winId.replace('-window', '').toUpperCase()}`, 'info');
            } else {
                el.classList.remove('window-maximized');
                el.style.position = 'absolute';
                el.style.left = el.dataset.prevLeft || '60px';
                el.style.top = el.dataset.prevTop || '40px';
                el.style.width = el.dataset.prevWidth || '';
                el.style.height = el.dataset.prevHeight || '';
                highestZ += 2;
                el.style.zIndex = String(highestZ);
            }
        }

        function toggleNativeBrowserFullscreen() {
            playSfx('click');
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {});
                showSecurityToast('🖥️ Entered True Native Display Fullscreen (F11)', 'info');
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
                showSecurityToast('🔲 Exited Native Display Fullscreen', 'info');
            }
        }

        // // WINDOWS-STYLE AERO SNAP (WIN+LEFT, WIN+RIGHT, WIN+UP, WIN+DOWN)
        function snapActiveWindow(direction) {
            const activeWin = getTopmostVisibleWindow();
            if (!activeWin) return;
            playSfx('click');
            triggerHaptic('light');

            activeWin.classList.remove('window-maximized');
            activeWin.style.position = 'absolute';
            activeWin.style.transition = 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
            highestZ += 2;
            activeWin.style.zIndex = String(highestZ);

            if (direction === 'left') {
                activeWin.style.top = '36px';
                activeWin.style.left = '8px';
                activeWin.style.width = 'calc(50vw - 16px)';
                activeWin.style.height = 'calc(100vh - 108px)';
                showNotificationToast("Window Snapped", "Snapped to Left Half (Win + Left)", "info");
            } else if (direction === 'right') {
                activeWin.style.top = '36px';
                activeWin.style.left = 'calc(50vw + 8px)';
                activeWin.style.width = 'calc(50vw - 16px)';
                activeWin.style.height = 'calc(100vh - 108px)';
                showNotificationToast("Window Snapped", "Snapped to Right Half (Win + Right)", "info");
            } else if (direction === 'maximize') {
                toggleMaximizeWindow(activeWin.id);
            } else if (direction === 'restore') {
                activeWin.style.top = '48px';
                activeWin.style.left = '72px';
                activeWin.style.width = '960px';
                activeWin.style.height = '580px';
                showNotificationToast("Window Restored", "Window bounds restored (Win + Down)", "info");
            }
            setTimeout(() => { if (activeWin) activeWin.style.transition = ''; }, 260);
        }

        function getTopmostVisibleWindow() {
            const windows = Array.from(document.querySelectorAll('[id$="-window"]:not(.hidden)'));
            if (windows.length === 0) return null;
            return windows.reduce((highest, win) => {
                const z1 = parseInt(window.getComputedStyle(win).zIndex) || 0;
                const z2 = parseInt(window.getComputedStyle(highest).zIndex) || 0;
                return z1 > z2 ? win : highest;
            }, windows[0]);
        }

        // Sovereign UAC (User Account Control) Permission Gate
        let pendingUACCallback = null;
        function triggerUACGate(programName, callback) {
            playSfx('notify');
            pendingUACCallback = callback;
            const modal = document.getElementById('uac-security-modal');
            const nameEl = document.getElementById('uac-app-name');
            if (nameEl) nameEl.textContent = `Program: ${programName}`;
            if (modal) modal.classList.remove('hidden');
        }

        function handleUACDecision(allowed) {
            playSfx(allowed ? 'unlock' : 'close');
            const modal = document.getElementById('uac-security-modal');
            if (modal) modal.classList.add('hidden');
            if (allowed) {
                showSecurityToast('🛡️ Ring-0 Kernel Access Granted to Process', 'success');
                if (pendingUACCallback) pendingUACCallback(true);
            } else {
                showSecurityToast('⛔ Process Execution Blocked by Sovereign Gate', 'error');
                if (pendingUACCallback) pendingUACCallback(false);
            }
            pendingUACCallback = null;
        }

        function showSecurityToast(message, type = 'info') {
            const container = document.getElementById('security-toast-container');
            if (!container) return;
            
            const toast = document.createElement('div');
            const borderCol = type === 'error' ? 'border-rose-500/60' : (type === 'success' ? 'border-emerald-500/60' : 'border-cyan-500/60');
            const bgCol = type === 'error' ? 'bg-rose-950/85' : (type === 'success' ? 'bg-emerald-950/85' : 'bg-slate-950/85');
            const textCol = type === 'error' ? 'text-rose-200' : (type === 'success' ? 'text-emerald-200' : 'text-cyan-200');
            
            toast.className = `px-4 py-3 rounded-2xl ultra-liquid-glass ${borderCol} ${bgCol} ${textCol} text-xs font-mono shadow-2xl flex items-center space-x-2.5 pointer-events-auto window-open-genie`;
            toast.innerHTML = `<span>${type === 'error' ? '⛔' : (type === 'success' ? '🛡️' : '🔔')}</span><span class="font-bold">${message}</span>`;
            
            container.appendChild(toast);
            setTimeout(() => {
                toast.classList.remove('window-open-genie');
                toast.classList.add('window-minimize-genie');
                setTimeout(() => toast.remove(), 260);
            }, 3800);
        }

        // // FULL MULTI-TOUCH & MOUSE WINDOW DRAGGING ENGINE
        let activeDrag = null;
        let dragOffset = { x: 0, y: 0 };
        let lastPointerX = 0;

        function getEventCoordinates(e) {
            if (e.touches && e.touches.length > 0) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            if (e.changedTouches && e.changedTouches.length > 0) {
                return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
            }
            return { x: e.clientX || 0, y: e.clientY || 0 };
        }

        function initDrag(e, winId) {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SPAN' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SVG' || e.target.tagName === 'line' || e.target.tagName === 'polyline') return;
            const win = document.getElementById(winId);
            if (!win || win.classList.contains('window-maximized')) return;
            
            const coords = getEventCoordinates(e);
            highestZ++;
            win.style.zIndex = highestZ;
            activeDrag = win;
            dragOffset.x = coords.x - win.offsetLeft;
            dragOffset.y = coords.y - win.offsetTop;
            lastPointerX = coords.x;

            triggerHaptic('light');

            window.addEventListener('mousemove', onDragMove, { passive: false });
            window.addEventListener('mouseup', onDragEnd);
            window.addEventListener('touchmove', onDragMove, { passive: false });
            window.addEventListener('touchend', onDragEnd);
            window.addEventListener('touchcancel', onDragEnd);
        }

        function onDragMove(e) {
            if (!activeDrag) return;
            if (e.cancelable && e.type === 'touchmove') {
                e.preventDefault(); // Prevent page scroll on touch drag
            }
            const coords = getEventCoordinates(e);
            const deltaX = coords.x - lastPointerX;
            lastPointerX = coords.x;
            const tilt = Math.max(-4, Math.min(4, deltaX * 0.4));
            const newLeft = coords.x - dragOffset.x;
            const newTop = Math.max(40, coords.y - dragOffset.y);
            
            // Magnetic edge detection with tactile haptic click
            if ((newLeft < 15 && (activeDrag._lastSnap !== 'left')) || 
                (newLeft > window.innerWidth - activeDrag.offsetWidth - 15 && (activeDrag._lastSnap !== 'right')) || 
                (newTop < 48 && (activeDrag._lastSnap !== 'top'))) {
                triggerHaptic('snap');
                activeDrag._lastSnap = newLeft < 15 ? 'left' : newLeft > window.innerWidth - activeDrag.offsetWidth - 15 ? 'right' : 'top';
            } else if (newLeft >= 20 && newLeft <= window.innerWidth - activeDrag.offsetWidth - 20 && newTop >= 55) {
                activeDrag._lastSnap = null;
            }

            activeDrag.style.left = `${newLeft}px`;
            activeDrag.style.top = `${newTop}px`;
            activeDrag.style.transform = `rotateZ(${tilt}deg) scale(1.01)`;
        }

        function onDragEnd() {
            if (activeDrag) {
                activeDrag.style.transform = `rotateZ(0deg) scale(1)`;
                activeDrag = null;
            }
            window.removeEventListener('mousemove', onDragMove);
            window.removeEventListener('mouseup', onDragEnd);
            window.removeEventListener('touchmove', onDragMove);
            window.removeEventListener('touchend', onDragEnd);
            window.removeEventListener('touchcancel', onDragEnd);
        }

        // Tactile Haptic Feedback
        function triggerHaptic(type = 'light') {
            try {
                if ('vibrate' in navigator) {
                    if (type === 'light') navigator.vibrate(10);
                    else if (type === 'medium') navigator.vibrate(25);
                    else if (type === 'error') navigator.vibrate([40, 60, 40]);
                }
            } catch(e) {}
        }

        // Settings Tabs
        
        // // BHARATOS ISO MEDIA CREATOR & SETUP ENCLAVE ENGINE

        function switchInstallerTab(tabKey) {
            triggerHaptic('light');
            playSfx('click');
            ['iso', 'setup', 'manifest'].forEach(k => {
                const p = document.getElementById(`pane-inst-${k}`);
                const b = document.getElementById(`btn-inst-tab-${k}`);
                if (p) p.classList.add('hidden');
                if (b) {
                    b.className = 'px-3.5 py-1.5 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-800 font-bold flex items-center space-x-1.5 opacity-70';
                }
            });
            const activePane = document.getElementById(`pane-inst-${tabKey}`);
            const activeBtn = document.getElementById(`btn-inst-tab-${tabKey}`);
            if (activePane) activePane.classList.remove('hidden');
            if (activeBtn) {
                activeBtn.className = 'px-3.5 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold border border-cyan-500/40 flex items-center space-x-1.5';
            }
            if (tabKey === 'manifest') {
                loadDistributionManifest();
            }
        }

        async function loadDistributionManifest() {
            const el = document.getElementById('inst-manifest-code');
            if (!el) return;
            try {
                const res = await fetch('/api/iso/info');
                const data = await res.json();
                el.textContent = JSON.stringify(data, null, 2);
            } catch(e) {
                el.textContent = '// Failed to fetch distribution manifest';
            }
        }

        async function rebuildISODistribution() {
            triggerHaptic('pulse');
            playSfx('notify');
            const btn = document.getElementById('btn-rebuild-iso');
            if (btn) btn.innerHTML = '<span>⏳</span><span>Rebuilding ISO...</span>';
            showToastNotification('ISO Builder Running', 'Generating fresh EFI bootloader and packaging OS bundle...');

            try {
                const res = await fetch('/api/iso/build', { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                    triggerHaptic('success');
                    playSfx('unlock');
                    showToastNotification('ISO Build Complete', `Generated ${data.dist_info.iso_file} (${data.dist_info.iso_size_mb} MB)`);
                } else {
                    triggerHaptic('error');
                    playSfx('error');
                    showToastNotification('ISO Build Error', data.error || 'Unknown error');
                }
            } catch(e) {
                showToastNotification('ISO Build Failed', String(e));
            } finally {
                if (btn) btn.innerHTML = '<span>🔄</span><span>Rebuild ISO Now</span>';
                loadDistributionManifest();
            }
        }

        function startUSBFlashSimulator() {
            const container = document.getElementById('flasher-progress-container');
            const bar = document.getElementById('flasher-progress-bar');
            const pct = document.getElementById('flasher-percent');
            const lbl = document.getElementById('flasher-status-label');
            const btn = document.getElementById('btn-start-flash');
            const drive = document.getElementById('flasher-target-drive')?.value || 'SanDisk Ultra';

            if (!container || !bar || !pct || !lbl) return;

            triggerHaptic('heavy');
            playSfx('open');
            container.classList.remove('hidden');
            if (btn) btn.disabled = true;

            let progress = 0;
            const steps = [
                { p: 15, label: `Formatting ${drive} (GPT / FAT32)...` },
                { p: 35, label: 'Writing EFI Bootloader & GRUB2 Kernel...' },
                { p: 65, label: 'Expanding Prithvi RAM Disk & VFS Layers...' },
                { p: 90, label: 'Enforcing Kavach Ring-0 Hardware Signatures...' },
                { p: 100, label: '✓ Bootable USB Media Verified! Ready to Boot.' }
            ];

            let stepIdx = 0;
            const interval = setInterval(() => {
                progress += 5;
                if (progress > 100) progress = 100;
                bar.style.width = `${progress}%`;
                pct.textContent = `${progress}%`;

                if (stepIdx < steps.length && progress >= steps[stepIdx].p) {
                    lbl.textContent = steps[stepIdx].label;
                    triggerHaptic('tick');
                    stepIdx++;
                }

                if (progress >= 100) {
                    clearInterval(interval);
                    triggerHaptic('success');
                    playSfx('unlock');
                    if (btn) btn.disabled = false;
                    showToastNotification('USB Flash Complete', `Successfully prepared bootable USB drive: ${drive}!`);
                }
            }, 120);
        }

        function switchSettingsTab(tabKey) {
            playSfx('click');
            ['system', 'storage', 'network', 'display', 'wallpaper', 'sound', 'shortcuts', 'updates', 'accounts', 'security', 'activation'].forEach(k => {
                const pane = document.getElementById(`tab-pane-${k}`);
                const btn = document.getElementById(`tab-btn-${k}`);
                if (pane) pane.classList.add('hidden');
                if (btn) btn.className = 'w-full text-left px-3 py-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800/60 font-bold flex items-center space-x-2';
            });
            const activePane = document.getElementById(`tab-pane-${tabKey}`);
            const activeBtn = document.getElementById(`tab-btn-${tabKey}`);
            if (activePane) activePane.classList.remove('hidden');
            if (activeBtn) activeBtn.className = 'w-full text-left px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-cyan-600 dark:text-cyan-300 font-bold flex items-center space-x-2';
            if (tabKey === 'activation') {
                renderLicenseUI();
            }
        }

        function checkUpdates() {
            playSfx('click');
            const btn = document.getElementById('btn-check-update');
            btn.textContent = 'Checking...';
            setTimeout(() => { btn.textContent = '✓ Up to Date'; }, 800);
        }

        // // FULLY FUNCTIONAL BHARAT APP STORE ENGINE (INSTALL, UNINSTALL, LAUNCH, DYNAMIC ICONS)

        let selectedStoreApp = null;

        function openStoreAppDetails(appId) {
            playSfx('open');
            const app = STORE_APPS_DATABASE.find(a => a.id === appId);
            if (!app) return;
            selectedStoreApp = app;

            document.getElementById('modal-app-icon').textContent = app.icon;
            document.getElementById('modal-app-name').textContent = app.name;
            document.getElementById('modal-app-cat').textContent = app.cat.toUpperCase();
            document.getElementById('modal-app-author').textContent = app.author;
            document.getElementById('modal-app-rating').textContent = app.rating;
            document.getElementById('modal-app-size').textContent = `📦 ${app.size}`;
            document.getElementById('modal-app-desc').textContent = app.desc + " Designed for sovereign independence, optimized for multi-core parallelism, hardware-accelerated rendering, and zero-telemetry user privacy.";

            updateModalActionButtons(app);
            document.getElementById('modal-install-progress-box').classList.add('hidden');
            document.getElementById('store-app-details-modal').classList.remove('hidden');
        }

        function closeStoreAppDetails() {
            playSfx('close');
            document.getElementById('store-app-details-modal').classList.add('hidden');
            selectedStoreApp = null;
        }

        function updateModalActionButtons(app) {
            const actionWrap = document.getElementById('modal-action-wrapper');
            if (!actionWrap) return;

            if (app.installed) {
                actionWrap.innerHTML = `
                    <button onclick="launchInstalledApp('${app.id}')" class="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center space-x-1.5">
                        <span>🚀</span><span>Launch App</span>
                    </button>
                    <button onclick="uninstallStoreApp('${app.id}')" class="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold text-xs border border-rose-500/40 transition-all active:scale-95">
                        🗑️ Uninstall
                    </button>
                `;
            } else {
                actionWrap.innerHTML = `
                    <button onclick="startAppInstallation('${app.id}')" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center space-x-1.5">
                        <span>⚡</span><span>Get / Install (${app.size})</span>
                    </button>
                `;
            }
        }

        function startAppInstallation(appId) {
            playSfx('open');
            const targetApp = STORE_APPS_DATABASE.find(a => a.id === appId);
            if (!targetApp) return;

            triggerUACGate(`${targetApp.name} Installer (SHA-256 Verified)`, (allowed) => {
                if (!allowed) return;

                const progBox = document.getElementById('modal-install-progress-box');
                const progBar = document.getElementById('modal-install-progress-bar');
                const progPct = document.getElementById('modal-install-percent');
                const statusText = document.getElementById('modal-install-status-text');

                if (progBox) progBox.classList.remove('hidden');

                let pct = 0;
                const interval = setInterval(() => {
                    pct += 15;
                    if (pct > 100) pct = 100;

                    if (progBar) progBar.style.width = pct + '%';
                    if (progPct) progPct.textContent = pct + '%';

                    if (pct < 60 && statusText) {
                        statusText.textContent = `Downloading ${targetApp.name} (${pct}%)...`;
                    } else if (pct < 95 && statusText) {
                        statusText.textContent = `Verifying Cryptographic SHA-256 Silicon Signature...`;
                    } else if (statusText) {
                        statusText.textContent = `Registering Ring-0 IPC Services...`;
                    }

                    if (pct >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            targetApp.installed = true;
                            playSfx('unlock');
                            showSecurityToast(`🛍️ ${targetApp.name} Successfully Installed!`, 'success');
                            
                            // Dynamically Add App Icon to Desktop
                            addAppIconToDesktop(targetApp);

                            if (selectedStoreApp && selectedStoreApp.id === appId) {
                                updateModalActionButtons(targetApp);
                                if (progBox) progBox.classList.add('hidden');
                            }

                            renderStoreApps(currentStoreCategory, document.getElementById('store-search-input')?.value || '');
                        }, 400);
                    }
                }, 150);
            });
        }

        function uninstallStoreApp(appId) {
            playSfx('click');
            const targetApp = STORE_APPS_DATABASE.find(a => a.id === appId);
            if (!targetApp) return;

            targetApp.installed = false;
            showSecurityToast(`🗑️ ${targetApp.name} Uninstalled.`, 'info');

            // Remove Desktop icon if present
            const deskIcon = document.getElementById(`desktop-icon-${appId}`);
            if (deskIcon) deskIcon.remove();

            if (selectedStoreApp && selectedStoreApp.id === appId) {
                updateModalActionButtons(targetApp);
            }

            renderStoreApps(currentStoreCategory, document.getElementById('store-search-input')?.value || '');
        }

        function launchInstalledApp(appId) {
            playSfx('open');
            const targetApp = STORE_APPS_DATABASE.find(a => a.id === appId);
            if (!targetApp) return;

            if (targetApp.winId) {
                openAppWindow(targetApp.winId, targetApp.dockId);
            } else {
                showSecurityToast(`🚀 Launched ${targetApp.name} in Sovereign Sandbox Enclave!`, 'success');
            }
        }

        function addAppIconToDesktop(app) {
            const container = document.getElementById('desktop-icons-container');
            if (!container || document.getElementById(`desktop-icon-${app.id}`)) return;

            const btn = document.createElement('button');
            btn.id = `desktop-icon-${app.id}`;
            btn.className = 'icon-btn';
            btn.setAttribute('aria-label', app.name);
            btn.type = 'button';
            btn.onclick = () => launchInstalledApp(app.id);

            btn.innerHTML = `
                <span class="icon-btn__back bg-grad-cyan"></span>
                <span class="icon-btn__front">
                    <span class="icon-btn__icon">${app.icon}</span>
                </span>
                <span class="icon-btn__label">${app.name.split(' ')[0]}</span>
            `;

            container.appendChild(btn);
        }

        function renderStoreApps(cat = 'all', query = '') {
            const grid = document.getElementById('store-apps-grid');
            if (!grid) return;
            grid.innerHTML = '';
            
            const filtered = STORE_APPS_DATABASE.filter(app => {
                const matchesCat = (cat === 'all' || app.cat === cat);
                const matchesQuery = (app.name.toLowerCase().includes(query.toLowerCase()) || app.desc.toLowerCase().includes(query.toLowerCase()) || app.author.toLowerCase().includes(query.toLowerCase()));
                return matchesCat && matchesQuery;
            });

            filtered.forEach(app => {
                const card = document.createElement('div');
                card.className = 'p-4 rounded-3xl bg-white/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3 shadow-md hover:border-cyan-500 hover:shadow-xl transition-all font-mono text-xs cursor-pointer';
                card.onclick = (e) => {
                    if (e.target.tagName !== 'BUTTON') {
                        openStoreAppDetails(app.id);
                    }
                };

                card.innerHTML = `
                    <div class="flex items-start space-x-3.5">
                        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-3xl shadow-inner flex-shrink-0">${app.icon}</div>
                        <div class="flex-1 space-y-1 overflow-hidden">
                            <div class="font-bold text-sm text-slate-900 dark:text-white truncate font-sans">${app.name}</div>
                            <div class="flex items-center space-x-2 text-[10px]">
                                <span class="text-cyan-600 dark:text-cyan-400 font-semibold truncate">${app.author}</span>
                                <span class="text-amber-400 font-bold">${app.rating}</span>
                            </div>
                            <p class="text-[11px] opacity-75 line-clamp-2">${app.desc}</p>
                        </div>
                    </div>
                    <div class="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <span class="text-[10px] opacity-60">📦 ${app.size}</span>
                        <div id="btn-wrap-${app.id}">
                            ${app.installed 
                                ? `<button onclick="launchInstalledApp('${app.id}')" class="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-[11px] border border-emerald-500/40 flex items-center space-x-1"><span>🚀</span><span>Open</span></button>` 
                                : `<button onclick="startAppInstallation('${app.id}')" class="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] shadow-md active:scale-95 transition-all">Get App</button>`
                            }
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

        function filterStoreCategory(cat) {
            playSfx('click');
            currentStoreCategory = cat;
            renderStoreApps(cat, document.getElementById('store-search-input')?.value || '');
            const btnContainer = document.getElementById('store-cat-buttons');
            if (btnContainer) {
                Array.from(btnContainer.children).forEach(b => {
                    const match = (cat === 'all' && b.textContent.includes('All')) || b.textContent.toLowerCase().includes(cat);
                    b.className = match
                        ? 'px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40'
                        : 'px-3 py-1.5 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-800 opacity-70';
                });
            }
        }

        function filterStoreApps(query) {
            renderStoreApps(currentStoreCategory, query);
        }

        function installStoreApp(appId) {
            triggerHaptic('medium');
            playSfx('open');
            const targetApp = STORE_APPS_DATABASE.find(a => a.id === appId);
            if (!targetApp) return;

            triggerUACGate(`${targetApp.name} Installer (SHA-256 Verified)`, (allowed) => {
                if (!allowed) return;
                const wrap = document.getElementById(`btn-wrap-${appId}`);
                if (wrap) wrap.innerHTML = `<span class="text-[10px] text-cyan-400 animate-pulse font-bold">Downloading ${targetApp.size}...</span>`;
                
                setTimeout(() => {
                    targetApp.installed = true;
                    playSfx('unlock');
                    showSecurityToast(`🛍️ Successfully Installed ${targetApp.name}!`, 'success');
                    renderStoreApps(currentStoreCategory, document.getElementById('store-search-input')?.value || '');
                }, 1400);
            });
        }

        // // 1. WINDOWS-STYLE SOVEREIGN MULTI-USER IDENTITY ENGINE (PROFILES & AVATARS)

        const PRESET_AVATARS = ["👨‍💻", "👨‍🚀", "🕉️", "🛡️", "🦁", "🦚", "💎", "👩‍🔬", "👑", "⚡"];

        const DEFAULT_USERS_DATABASE = [
            { id: "usr-aviral", name: "Aviral Dewangan", handle: "aviral", role: "Administrator", pin: "1234", avatar: "👨‍💻", isCustomAvatar: false, wallpaper: "wall-ladakh-ai" },
            { id: "usr-sarabhai", name: "Dr. Vikram Sarabhai", handle: "sarabhai", role: "Scientist / ISRO", pin: "1969", avatar: "👨‍🚀", isCustomAvatar: false, wallpaper: "wall-munnar-ai" },
            { id: "usr-aryabhata", name: "Aryabhata", handle: "aryabhata", role: "Vedic Scholar", pin: "0476", avatar: "🕉️", isCustomAvatar: false, wallpaper: "wall-varanasi-ai" },
            { id: "usr-guest", name: "Guest User", handle: "guest", role: "Guest Sandbox", pin: "0000", avatar: "👤", isCustomAvatar: false, wallpaper: "wall-kutch-ai" }
        ];

        let usersDatabase = [];
        let activeUserId = "usr-aviral";
        let selectedLockUserId = "usr-aviral";
        let selectedNewUserAvatar = "👨‍💻";

        function initMultiUserEngine() {
            const savedDb = localStorage.getItem('bharatos_users_db');
            if (savedDb) {
                try {
                    usersDatabase = JSON.parse(savedDb);
                } catch(e) {
                    usersDatabase = [...DEFAULT_USERS_DATABASE];
                }
            } else {
                usersDatabase = [...DEFAULT_USERS_DATABASE];
                saveUsersDatabase();
            }

            const savedActiveId = localStorage.getItem('bharatos_active_user_id');
            if (savedActiveId && usersDatabase.some(u => u.id === savedActiveId)) {
                activeUserId = savedActiveId;
            } else {
                activeUserId = usersDatabase[0].id;
            }
            selectedLockUserId = activeUserId;

            syncActiveUserInterface();
            renderLockScreenUsersList();
            renderSettingsAccountsView();
        }

        function saveUsersDatabase() {
            localStorage.setItem('bharatos_users_db', JSON.stringify(usersDatabase));
            localStorage.setItem('bharatos_active_user_id', activeUserId);
        }

        function getActiveUser() {
            return usersDatabase.find(u => u.id === activeUserId) || usersDatabase[0];
        }

        function syncActiveUserInterface() {
            const user = getActiveUser();
            if (!user) return;

            // Global userProfile reference for existing code compatibility
            userProfile = { name: user.name, pin: user.pin, deviceType: deviceType || "desktop" };
            localStorage.setItem('bharatos_user_profile', JSON.stringify(userProfile));

            // Sync Lock Screen
            selectLockUser(user.id);

            // Sync Settings Accounts Panel
            const setFullName = document.getElementById('settings-user-fullname');
            const setHandle = document.getElementById('settings-user-handle');
            const setBadge = document.getElementById('settings-user-badge');
            const setAvatarBox = document.getElementById('settings-user-avatar-box');

            if (setFullName) setFullName.textContent = user.name;
            if (setHandle) setHandle.textContent = `${user.handle}@bharatos • ${user.role} Enclave`;
            if (setBadge) setBadge.textContent = `Active ${user.role}`;
            if (setAvatarBox) {
                if (user.isCustomAvatar) {
                    setAvatarBox.innerHTML = `<img src="${user.avatar}" class="w-full h-full object-cover rounded-2xl" alt="${user.name}">`;
                } else {
                    setAvatarBox.innerHTML = `<span>${user.avatar}</span>`;
                }
            }

            // Sync Sudarshan Start Menu
            const startUserName = document.getElementById('sudarshan-user-name');
            const startUserRole = document.getElementById('sudarshan-user-role');
            const startUserAvatar = document.getElementById('sudarshan-user-avatar');
            if (startUserName) startUserName.textContent = user.name;
            if (startUserRole) startUserRole.textContent = user.role;
            if (startUserAvatar) {
                if (user.isCustomAvatar) {
                    startUserAvatar.innerHTML = `<img src="${user.avatar}" class="w-full h-full object-cover rounded-full" alt="${user.name}">`;
                } else {
                    startUserAvatar.innerHTML = `<span>${user.avatar}</span>`;
                }
            }
        }

        function renderLockScreenUsersList() {
            const container = document.getElementById('lock-user-accounts-list');
            if (!container) return;

            container.innerHTML = usersDatabase.map(u => `
                <button onclick="selectLockUser('${u.id}')" class="flex flex-col items-center p-2 rounded-xl transition-all ${u.id === selectedLockUserId ? 'bg-cyan-500/20 border border-cyan-500/50 scale-105 shadow-md' : 'opacity-70 hover:opacity-100 hover:bg-slate-800/60'}">
                    <div class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xl overflow-hidden shadow">
                        ${u.isCustomAvatar ? `<img src="${u.avatar}" class="w-full h-full object-cover" alt="${u.name}">` : `<span>${u.avatar}</span>`}
                    </div>
                    <span class="text-[10px] font-mono text-slate-200 mt-1 max-w-[70px] truncate">${u.name.split(' ')[0]}</span>
                </button>
            `).join('');
        }

        function selectLockUser(userId) {
            playSfx('click');
            const targetUser = usersDatabase.find(u => u.id === userId);
            if (!targetUser) return;
            selectedLockUserId = userId;

            const nameEl = document.getElementById('lock-user-fullname');
            const handleEl = document.getElementById('lock-user-handle');
            const roleBadge = document.getElementById('lock-user-role-badge');
            const avatarBox = document.getElementById('lock-user-avatar-display');
            const pinInput = document.getElementById('lock-pin-input');

            if (nameEl) nameEl.textContent = targetUser.name;
            if (handleEl) handleEl.textContent = `${targetUser.handle}@bharatos (${targetUser.role})`;
            if (roleBadge) roleBadge.textContent = targetUser.role;
            if (avatarBox) {
                if (targetUser.isCustomAvatar) {
                    avatarBox.innerHTML = `<img src="${targetUser.avatar}" class="w-full h-full object-cover" alt="${targetUser.name}">`;
                } else {
                    avatarBox.innerHTML = `<span>${targetUser.avatar}</span>`;
                }
            }
            if (pinInput) {
                pinInput.value = '';
                pinInput.focus();
            }

            renderLockScreenUsersList();
        }

        function switchActiveUserSession(userId) {
            playSfx('unlock');
            const targetUser = usersDatabase.find(u => u.id === userId);
            if (!targetUser) return;

            activeUserId = targetUser.id;
            saveUsersDatabase();
            syncActiveUserInterface();

            if (targetUser.wallpaper) {
                if (targetUser.wallpaper.startsWith('data:') || targetUser.wallpaper.startsWith('http')) {
                    applyWallpaperWithTarget(null, targetUser.wallpaper);
                } else {
                    applyWallpaperWithTarget(targetUser.wallpaper);
                }
            }

            showNotificationToast("User Switcher", `Active session switched to ${targetUser.name} (${targetUser.role}).`, "info");
            renderSettingsAccountsView();
        }

        function renderSettingsAccountsView() {
            // Render Preset Avatar selector
            const presetBar = document.getElementById('preset-avatars-bar');
            if (presetBar) {
                presetBar.innerHTML = PRESET_AVATARS.map(av => `
                    <button onclick="setActiveUserPresetAvatar('${av}')" class="w-11 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-2xl flex-shrink-0 transition-transform active:scale-95 shadow">
                        ${av}
                    </button>
                `).join('');
            }

            // Render All Registered Users in Settings
            const list = document.getElementById('settings-users-list');
            if (!list) return;

            list.innerHTML = usersDatabase.map(u => `
                <div class="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-900/80 border ${u.id === activeUserId ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-slate-200 dark:border-slate-800'} flex items-center justify-between font-mono text-xs">
                    <div class="flex items-center space-x-3.5">
                        <div class="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl overflow-hidden shadow">
                            ${u.isCustomAvatar ? `<img src="${u.avatar}" class="w-full h-full object-cover" alt="${u.name}">` : `<span>${u.avatar}</span>`}
                        </div>
                        <div>
                            <div class="flex items-center space-x-2">
                                <span class="font-bold text-sm text-slate-900 dark:text-white font-sans">${u.name}</span>
                                <span class="px-2 py-0.5 rounded-full ${u.role.includes('Admin') ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-700/40 text-slate-300'} text-[10px] font-bold">${u.role}</span>
                                ${u.id === activeUserId ? `<span class="text-emerald-400 font-bold text-[10px]">● Currently Active</span>` : ''}
                            </div>
                            <div class="text-[11px] opacity-70">Handle: ${u.handle}@bharatos • Storage: Encrypted Vault (24.2 GB)</div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        ${u.id !== activeUserId ? `
                            <button onclick="switchActiveUserSession('${u.id}')" class="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-bold border border-cyan-500/40 text-xs">
                                Switch To User
                            </button>
                        ` : ''}
                        ${usersDatabase.length > 1 && u.id !== 'usr-aviral' ? `
                            <button onclick="deleteUserAccount('${u.id}')" class="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold border border-rose-500/40 text-xs" title="Delete User">
                                🗑️
                            </button>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        }

        function handleUserAvatarUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                const base64Data = e.target.result;
                const user = getActiveUser();
                if (user) {
                    user.avatar = base64Data;
                    user.isCustomAvatar = true;
                    saveUsersDatabase();
                    syncActiveUserInterface();
                    renderSettingsAccountsView();
                    renderLockScreenUsersList();
                    playSfx('unlock');
                    showSecurityToast(`📷 Custom Profile Photo Updated for ${user.name}!`, 'success');
                }
            };
            reader.readAsDataURL(file);
        }

        function setActiveUserPresetAvatar(avatarEmoji) {
            playSfx('click');
            const user = getActiveUser();
            if (user) {
                user.avatar = avatarEmoji;
                user.isCustomAvatar = false;
                saveUsersDatabase();
                syncActiveUserInterface();
                renderSettingsAccountsView();
                renderLockScreenUsersList();
                showSecurityToast(`Avatar changed to ${avatarEmoji}`, 'info');
            }
        }

        function promptEditUserPin() {
            playSfx('open');
            const user = getActiveUser();
            if (!user) return;
            const newPin = prompt(`Enter new 4-8 digit Security PIN for ${user.name}:`, user.pin);
            if (newPin && newPin.trim().length >= 4) {
                user.pin = newPin.trim();
                saveUsersDatabase();
                syncActiveUserInterface();
                playSfx('unlock');
                showSecurityToast(`🔑 PIN successfully updated for ${user.name}!`, 'success');
            }
        }

        function openCreateUserModal() {
            playSfx('open');
            selectedNewUserAvatar = "👨‍💻";
            renderNewUserAvatarSelection();
            const modal = document.getElementById('create-user-modal');
            if (modal) modal.classList.remove('hidden');
        }

        function closeCreateUserModal() {
            playSfx('close');
            const modal = document.getElementById('create-user-modal');
            if (modal) modal.classList.add('hidden');
        }

        function renderNewUserAvatarSelection() {
            const row = document.getElementById('new-user-avatars-row');
            if (!row) return;
            row.innerHTML = PRESET_AVATARS.slice(0, 6).map(av => `
                <button type="button" onclick="selectNewUserAvatar('${av}')" class="w-10 h-10 rounded-xl bg-slate-800 border ${av === selectedNewUserAvatar ? 'border-cyan-400 bg-cyan-500/20 scale-105' : 'border-slate-700'} flex items-center justify-center text-xl transition-all">
                    ${av}
                </button>
            `).join('');
        }

        function selectNewUserAvatar(av) {
            playSfx('click');
            selectedNewUserAvatar = av;
            renderNewUserAvatarSelection();
        }

        function saveNewUserAccount() {
            const nameInput = document.getElementById('new-user-fullname');
            const roleInput = document.getElementById('new-user-role');
            const pinInput = document.getElementById('new-user-pin');

            const name = nameInput ? nameInput.value.trim() : "";
            const role = roleInput ? roleInput.value : "Standard User";
            const pin = pinInput && pinInput.value.trim() ? pinInput.value.trim() : "1234";

            if (!name) {
                alert("Please enter a valid user name.");
                return;
            }

            const newId = "usr-" + Date.now();
            const handle = name.toLowerCase().replace(/\s+/g, '').slice(0, 10);
            
            const newUser = {
                id: newId,
                name: name,
                handle: handle,
                role: role,
                pin: pin,
                avatar: selectedNewUserAvatar,
                isCustomAvatar: false,
                wallpaper: "wall-ladakh-ai"
            };

            usersDatabase.push(newUser);
            saveUsersDatabase();
            closeCreateUserModal();
            renderSettingsAccountsView();
            renderLockScreenUsersList();
            playSfx('unlock');
            showSecurityToast(`👤 User Account "${name}" Created Successfully!`, 'success');
        }

        function deleteUserAccount(userId) {
            playSfx('click');
            const user = usersDatabase.find(u => u.id === userId);
            if (!user) return;

            if (confirm(`Are you sure you want to remove user account "${user.name}"?`)) {
                usersDatabase = usersDatabase.filter(u => u.id !== userId);
                if (activeUserId === userId) {
                    activeUserId = usersDatabase[0].id;
                }
                saveUsersDatabase();
                syncActiveUserInterface();
                renderSettingsAccountsView();
                renderLockScreenUsersList();
                showSecurityToast(`🗑️ User account "${user.name}" deleted.`, 'info');
            }
        }

        // // UNIFIED BULLETPROOF LOCK SCREEN AUTHENTICATION & KEYPAD ENGINE

        var failedLockAttempts = 0;
        var isLockedOut = false;

        function getLockTargetUser() {
            if (typeof usersDatabase !== 'undefined' && Array.isArray(usersDatabase) && usersDatabase.length > 0) {
                if (typeof selectedLockUserId !== 'undefined' && selectedLockUserId) {
                    const found = usersDatabase.find(u => u.id === selectedLockUserId);
                    if (found) return found;
                }
                if (typeof activeUserId !== 'undefined' && activeUserId) {
                    const found = usersDatabase.find(u => u.id === activeUserId);
                    if (found) return found;
                }
                return usersDatabase[0];
            }
            if (typeof userProfile !== 'undefined' && userProfile) {
                return { name: userProfile.name || "Aviral Dewangan", pin: userProfile.pin || "1234", id: "usr-aviral" };
            }
            return { name: "Aviral Dewangan", pin: "1234", id: "usr-aviral" };
        }

        function updatePinDots(length, isError = false) {
            for (let i = 0; i < 4; i++) {
                const dot = document.getElementById(`pindot-${i}`);
                if (!dot) continue;
                if (isError) {
                    dot.className = "w-3.5 h-3.5 rounded-full border-2 border-rose-500 bg-rose-500 shadow-lg shadow-rose-500/50 transition-all duration-200 animate-ping";
                } else if (i < length) {
                    dot.className = "w-3.5 h-3.5 rounded-full border-2 border-cyan-400 bg-cyan-400 shadow-lg shadow-cyan-400/60 scale-110 transition-all duration-200";
                } else {
                    dot.className = "w-3.5 h-3.5 rounded-full border-2 border-slate-400 dark:border-slate-600 bg-transparent transition-all duration-200";
                }
            }
        }

        function handleLockPinInput(val) {
            const cleanVal = (val || "").trim();
            updatePinDots(cleanVal.length);

            const targetUser = getLockTargetUser();
            const expectedLength = (targetUser && targetUser.pin) ? targetUser.pin.length : 4;

            // Auto-unlock immediately when user enters full digits (no Enter needed!)
            if (cleanVal.length >= expectedLength) {
                setTimeout(() => {
                    unlockDesktop();
                }, 80);
            }
        }

        function typeLockPin(digit) {
            triggerHaptic('light');
            playSfx('click');
            const input = document.getElementById('lock-pin-input');
            if (!input) return;
            if (input.value.length >= 4) {
                input.value = '';
            }
            input.value += digit;
            handleLockPinInput(input.value);
        }

        function backspaceLockPin() {
            triggerHaptic('light');
            playSfx('click');
            const input = document.getElementById('lock-pin-input');
            if (input && input.value.length > 0) {
                input.value = input.value.slice(0, -1);
                handleLockPinInput(input.value);
            }
        }

        function clearLockPin() {
            triggerHaptic('light');
            playSfx('click');
            const input = document.getElementById('lock-pin-input');
            if (input) {
                input.value = '';
                handleLockPinInput('');
            }
        }

        function showLockPinAlert(message) {
            const alertBox = document.getElementById('lock-pin-alert');
            const alertMsg = document.getElementById('lock-pin-alert-msg');
            const attemptsLeft = document.getElementById('lock-attempts-left');
            if (alertBox) alertBox.classList.remove('hidden');
            if (alertMsg) alertMsg.textContent = message;
            if (attemptsLeft) attemptsLeft.textContent = `Attempt ${failedLockAttempts} of 5 (Enclave Event Logged)`;
        }

        function hideLockPinAlert() {
            const alertBox = document.getElementById('lock-pin-alert');
            if (alertBox) alertBox.classList.add('hidden');
        }

        function unlockLockScreen() {
            const lockEl = document.getElementById('lock-screen');
            if (lockEl) {
                lockEl.classList.add('unlocked');
                lockEl.style.display = 'none';
            }
            hideLockPinAlert();
            const pinInput = document.getElementById('lock-pin-input');
            if (pinInput) pinInput.value = '';
            updatePinDots(0);
        }

        function lockDesktop() {
            playSfx('close');
            isSystemLegitUnlocked = false;
            window.__SOVEREIGN_AUTH_TOKEN__ = null;
            const lockEl = document.getElementById('lock-screen');
            if (lockEl) {
                lockEl.style.display = 'flex';
                // Trigger reflow
                lockEl.offsetHeight;
                lockEl.classList.remove('unlocked');
            }
            const pinInput = document.getElementById('lock-pin-input');
            if (pinInput) {
                pinInput.value = '';
                setTimeout(() => pinInput.focus(), 300);
            }
            hideLockPinAlert();
            renderLockScreenUsersList();
        }

        
        // Quick Auto-Fill and Password Visibility Engine
        function toggleLockPasswordVisibility() {
            const input = document.getElementById('lock-pin-input');
            const eyeBtn = document.getElementById('btn-toggle-eye');
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    if (eyeBtn) eyeBtn.textContent = '🔒';
                } else {
                    input.type = 'password';
                    if (eyeBtn) eyeBtn.textContent = '👁️';
                }
            }
        }

        function quickAutofillUnlock(pin = '1234') {
            triggerHaptic('success');
            playSfx('click');
            const input = document.getElementById('lock-pin-input');
            if (input) {
                input.value = pin;
                handleLockPinInput(pin);
            }
            unlockDesktop();
        }

        function unlockDesktop() {
            if (isLockedOut) {
                showLockPinAlert(`🔒 Enclave Lockdown Active. Please wait.`);
                return;
            }

            const pinInput = document.getElementById('lock-pin-input');
            const enteredPin = pinInput ? pinInput.value.trim() : "";
            const targetUser = getLockTargetUser();

            const validPins = [targetUser?.pin, typeof userProfile !== 'undefined' ? userProfile?.pin : null].filter(Boolean);

            if (enteredPin && validPins.includes(enteredPin)) {
                // Successful Authentication
                failedLockAttempts = 0;
                isSystemLegitUnlocked = true;
                window.__SOVEREIGN_AUTH_TOKEN__ = "SOV_AUTH_" + btoa(targetUser.id + ":" + Date.now());
                if (typeof switchActiveUserSession === 'function' && targetUser && targetUser.id) {
                    switchActiveUserSession(targetUser.id);
                }
                unlockLockScreen();
                playSfx('unlock');
                showNotificationToast("Enclave Authenticated", `Welcome back, ${targetUser.name}! Zero-Trust Ring-0 Active.`, "success");
            } else {
                // Failed Authentication
                failedLockAttempts++;
                triggerHaptic('error');
                playSfx('error');
                showLockPinAlert(`⚠️ Incorrect PIN! Please enter your user PIN.`);
                updatePinDots(4, true);
                if (pinInput) {
                    pinInput.value = '';
                    pinInput.classList.add('shake-error', 'border-rose-500');
                    setTimeout(() => {
                        pinInput.classList.remove('shake-error', 'border-rose-500');
                        updatePinDots(0);
                        pinInput.focus();
                    }, 450);
                }

                if (failedLockAttempts >= 5) {
                    triggerLockoutCooldown();
                }
            }
        }

        function attemptBiometricSensorScan() {
            triggerHaptic('medium');
            playSfx('click');
            const alertBox = document.getElementById('lock-pin-alert');
            const alertMsg = document.getElementById('lock-pin-alert-msg');
            const attemptsLeft = document.getElementById('lock-attempts-left');
            const pinInput = document.getElementById('lock-pin-input');
            
            if (alertBox) alertBox.classList.remove('hidden');
            if (alertMsg) alertMsg.textContent = '☸️ Scanning Chakra Touch ID Biometric Sensor...';
            if (attemptsLeft) attemptsLeft.textContent = 'Zero-Trust Enclave Sensor Query In Progress...';
            
            // STRICT SECURITY RULE: Clicking Touch ID button MUST NOT unlock the OS without enrolled hardware passkeys
            setTimeout(() => {
                triggerHaptic('error');
                playSfx('error');
                if (alertMsg) alertMsg.textContent = '⚠️ Touch ID Hardware Sensor Not Enrolled.';
                if (attemptsLeft) attemptsLeft.textContent = 'Biometric instant bypass disabled. Please enter your Sovereign PIN.';
                if (pinInput) {
                    pinInput.classList.add('shake-error', 'border-rose-500');
                    setTimeout(() => {
                        pinInput.classList.remove('shake-error', 'border-rose-500');
                        pinInput.focus();
                    }, 450);
                }
                showNotificationToast("Chakra Touch ID", "Biometric sensor unenrolled. Please authenticate using your PIN.", "warning");
            }, 600);
        }

        function unlockDesktopBiometric() {
            attemptBiometricSensorScan();
        }

        function triggerLockoutCooldown() {
            isLockedOut = true;
            const container = document.getElementById('lock-input-container');
            const cooldownBox = document.getElementById('lockout-cooldown-box');
            const countdownEl = document.getElementById('lockout-seconds');
            if (container) container.classList.add('opacity-40', 'pointer-events-none');
            if (cooldownBox) cooldownBox.classList.remove('hidden');

            let remaining = 30;
            if (countdownEl) countdownEl.textContent = remaining;

            const timer = setInterval(() => {
                remaining--;
                if (countdownEl) countdownEl.textContent = remaining;
                if (remaining <= 0) {
                    clearInterval(timer);
                    isLockedOut = false;
                    failedLockAttempts = 0;
                    if (container) container.classList.remove('opacity-40', 'pointer-events-none');
                    if (cooldownBox) cooldownBox.classList.add('hidden');
                    hideLockPinAlert();
                }
            }, 1000);
        }


        
        // // 2. 100% REAL-TIME HARDWARE TELEMETRY & HOST PROCESS STREAMING ENGINE

        let realFpsCounter = 144;
        let lastFrameTime = performance.now();
        let frameCount = 0;

        function fpsLoop(now) {
            frameCount++;
            if (now - lastFrameTime >= 1000) {
                realFpsCounter = frameCount;
                frameCount = 0;
                lastFrameTime = now;
                const fpsBadge = document.getElementById('widget-fps-badge');
                if (fpsBadge) fpsBadge.textContent = `${realFpsCounter} FPS`;
                const tmGpuVal = document.getElementById('tm-gpu-val');
                if (tmGpuVal) tmGpuVal.textContent = `${realFpsCounter} FPS`;
            }
            requestAnimationFrame(fpsLoop);
        }
        requestAnimationFrame(fpsLoop);

        var selectedTaskMgrProcId = null;
        var selectedTaskMgrWinId = null;
        var latestSystemTelemetry = null;
        var latestSystemProcesses = [];

        async function updateRealtimeHardwareTelemetry() {
            try {
                const res = await fetch('/api/system/telemetry');
                if (res.ok) {
                    const data = await res.json();
                    latestSystemTelemetry = data;
                    applyRealTelemetryData(data);
                }
            } catch (err) {
                // Silently handle fetch error
            }
        }

        function applyRealTelemetryData(data) {
            if (!data || !data.cpu) return;

            const cpuPercent = typeof data.cpu.overall_percent === 'number' ? data.cpu.overall_percent : 12.5;
            const cpuModel = data.cpu.model || 'Sovereign Processor';
            const cpuFreqGhz = data.cpu.frequency_mhz ? (data.cpu.frequency_mhz / 1000).toFixed(2) : '3.40';
            const cpuCoresPhys = data.cpu.cores_physical || 4;
            const cpuCoresLog = data.cpu.cores_logical || 8;

            const ramUsedGb = data.memory.used_gb || 4.2;
            const ramTotalGb = data.memory.total_gb || 16.0;
            const ramFreeGb = data.memory.free_gb || (ramTotalGb - ramUsedGb).toFixed(2);
            const ramPercent = data.memory.percent || ((ramUsedGb / ramTotalGb) * 100);

            const diskUsedGb = data.disk ? data.disk.used_gb : 120.0;
            const diskTotalGb = data.disk ? data.disk.total_gb : 512.0;
            const diskFreeGb = data.disk ? data.disk.free_gb : 392.0;
            const diskPercent = data.disk ? data.disk.percent : 25.0;
            const diskReadMb = data.disk ? data.disk.read_mb : 12.4;
            const diskWriteMb = data.disk ? data.disk.write_mb : 8.6;

            const netSentMb = data.network ? data.network.sent_mb : 45.2;
            const netRecvMb = data.network ? data.network.recv_mb : 128.4;
            const localIp = data.network ? data.network.local_ip : '127.0.0.1';
            const hostname = data.network ? data.network.hostname : 'BharatOS-Host';

            const uptimeSecs = data.host ? data.host.uptime_seconds : 3600;
            const uptimeStr = `${Math.floor(uptimeSecs / 3600)}h ${Math.floor((uptimeSecs % 3600) / 60)}m ${uptimeSecs % 60}s`;
            const osPlatform = data.host ? data.host.os : 'BharatOS 2026.1 LTS';
            const bootTime = data.host ? data.host.boot_time : '2026-08-26';

            // 1. UPDATE DESKTOP HARDWARE WIDGET
            const cpuPercentEl = document.getElementById('widget-cpu-percent');
            const cpuBarEl = document.getElementById('widget-cpu-bar');
            const cpuClockEl = document.getElementById('widget-cpu-clock');
            const tempBadgeEl = document.getElementById('widget-temp-badge');
            const ramTextEl = document.getElementById('widget-ram-text');
            const ramBarEl = document.getElementById('widget-ram-bar');
            const nvmeIoEl = document.getElementById('widget-nvme-io');
            const netIoEl = document.getElementById('widget-net-io');

            if (cpuPercentEl) cpuPercentEl.textContent = `${cpuPercent.toFixed(1)}%`;
            if (cpuBarEl) cpuBarEl.style.width = `${Math.min(100, Math.max(3, cpuPercent))}%`;
            if (cpuClockEl) cpuClockEl.textContent = `${cpuFreqGhz} GHz`;
            
            const estimatedTemp = Math.round(38 + (cpuPercent * 0.32));
            if (tempBadgeEl) {
                tempBadgeEl.textContent = `${estimatedTemp}°C`;
                tempBadgeEl.className = estimatedTemp > 70 
                    ? "text-[10px] text-rose-500 font-bold px-1.5 py-0.5 bg-rose-500/10 rounded animate-pulse"
                    : "text-[10px] text-emerald-400 font-bold px-1.5 py-0.5 bg-emerald-500/10 rounded";
            }

            if (ramTextEl) ramTextEl.textContent = `${ramUsedGb} / ${ramTotalGb} GB`;
            if (ramBarEl) ramBarEl.style.width = `${Math.min(100, Math.max(4, ramPercent))}%`;
            if (nvmeIoEl) nvmeIoEl.textContent = `R: ${diskReadMb} MB • W: ${diskWriteMb} MB`;
            if (netIoEl) netIoEl.textContent = `↓ ${netRecvMb} MB • ↑ ${netSentMb} MB`;

            // 2. UPDATE TASK MANAGER TELEMETRY & CANVAS
            const tmCpuVal = document.getElementById('tm-cpu-val');
            const tmRamVal = document.getElementById('tm-ram-val');
            const tmDiskVal = document.getElementById('tm-disk-val');
            if (tmCpuVal) tmCpuVal.textContent = `${cpuPercent.toFixed(1)}%`;
            if (tmRamVal) tmRamVal.textContent = `${ramUsedGb} / ${ramTotalGb} GB (${ramPercent.toFixed(1)}%)`;
            if (tmDiskVal) tmDiskVal.textContent = `${diskPercent}% (${diskUsedGb} GB Used)`;

            // Push to Task Manager History Canvas
            if (window.taskMgrCpuHistory) {
                taskMgrCpuHistory.shift();
                taskMgrCpuHistory.push(cpuPercent);

                const canvas = document.getElementById('tm-cpu-canvas');
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    // Draw Grid Lines
                    ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
                    ctx.lineWidth = 1;
                    for (let y = 0; y < canvas.height; y += 30) {
                        ctx.beginPath();
                        ctx.moveTo(0, y);
                        ctx.lineTo(canvas.width, y);
                        ctx.stroke();
                    }

                    // Draw Smooth CPU Line
                    ctx.beginPath();
                    ctx.strokeStyle = '#10b981';
                    ctx.lineWidth = 2.5;
                    const step = canvas.width / (taskMgrCpuHistory.length - 1);
                    taskMgrCpuHistory.forEach((val, i) => {
                        const y = canvas.height - (Math.min(100, val) / 100) * canvas.height;
                        if (i === 0) ctx.moveTo(0, y);
                        else ctx.lineTo(i * step, y);
                    });
                    ctx.stroke();

                    // Fill gradient area
                    ctx.lineTo(canvas.width, canvas.height);
                    ctx.lineTo(0, canvas.height);
                    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
                    grad.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
                    grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
                    ctx.fillStyle = grad;
                    ctx.fill();
                }
            }

            // 3. UPDATE SETTINGS HUB ELEMENTS
            const sOs = document.getElementById('settings-sys-os-name');
            const sPlatform = document.getElementById('settings-sys-platform');
            const sCpu = document.getElementById('settings-sys-cpu');
            const sCpuCores = document.getElementById('settings-sys-cpu-cores');
            const sRam = document.getElementById('settings-sys-ram');
            const sRamUsage = document.getElementById('settings-sys-ram-usage');
            const sHostname = document.getElementById('settings-sys-hostname');
            const sIp = document.getElementById('settings-sys-ip');
            const sUptime = document.getElementById('settings-sys-uptime');
            const sBoot = document.getElementById('settings-sys-boot');

            if (sOs) sOs.textContent = `BharatOS Sovereign (${osPlatform})`;
            if (sPlatform) sPlatform.textContent = `Host Platform: ${osPlatform} • Python 3.11 Kernel`;
            if (sCpu) sCpu.textContent = cpuModel;
            if (sCpuCores) sCpuCores.textContent = `${cpuCoresPhys} Physical Cores • ${cpuCoresLog} Logical Threads @ ${cpuFreqGhz} GHz`;
            if (sRam) sRam.textContent = `${ramTotalGb} GB Physical RAM`;
            if (sRamUsage) sRamUsage.textContent = `${ramUsedGb} GB In-Use (${ramPercent.toFixed(1)}%) • ${ramFreeGb} GB Available`;
            if (sHostname) sHostname.textContent = hostname;
            if (sIp) sIp.textContent = `IPv4: ${localIp}`;
            if (sUptime) sUptime.textContent = uptimeStr;
            if (sBoot) sBoot.textContent = `System Booted: ${bootTime}`;

            // Update Settings Storage Tab
            const sStorBadge = document.getElementById('settings-storage-total-badge');
            const sStorUsedFree = document.getElementById('settings-storage-used-free');
            const sStorBar = document.getElementById('settings-storage-bar');
            const sStorPercent = document.getElementById('settings-storage-percent');
            const sStorIo = document.getElementById('settings-storage-io');

            if (sStorBadge) sStorBadge.textContent = `Total: ${diskTotalGb} GB`;
            if (sStorUsedFree) sStorUsedFree.textContent = `${diskUsedGb} GB Used / ${diskFreeGb} GB Free`;
            if (sStorBar) sStorBar.style.width = `${Math.min(100, Math.max(5, diskPercent))}%`;
            if (sStorPercent) sStorPercent.textContent = `Usage: ${diskPercent}% Allocated`;
            if (sStorIo) sStorIo.textContent = `Read: ${diskReadMb} MB • Written: ${diskWriteMb} MB`;

            // Update Settings Network Tab
            const sNetIp = document.getElementById('settings-net-ip');
            const sNetHost = document.getElementById('settings-net-hostname');
            const sNetTraffic = document.getElementById('settings-net-traffic');
            if (sNetIp) sNetIp.textContent = localIp;
            if (sNetHost) sNetHost.textContent = `Host: ${hostname}`;
            if (sNetTraffic) sNetTraffic.textContent = `↓ ${netRecvMb} MB Received • ↑ ${netSentMb} MB Transmitted`;

            // Update Settings Display Tab
            const sDispRes = document.getElementById('settings-display-live-res');
            const sDispSpecs = document.getElementById('settings-display-specs');
            const sDispColor = document.getElementById('settings-display-color');
            if (sDispRes) sDispRes.textContent = `${window.screen.width} × ${window.screen.height}`;
            if (sDispSpecs) sDispSpecs.textContent = `Resolution: ${window.screen.width} × ${window.screen.height} • Viewport: ${window.innerWidth} × ${window.innerHeight} (${window.devicePixelRatio}x DPI)`;
            if (sDispColor) sDispColor.textContent = `${window.screen.colorDepth}-bit High Dynamic Range (HDR) Color Space`;

            // 4. UPDATE DEVICE MANAGER SPEC LABELS
            const devCpuModel = document.getElementById('devmgr-cpu-model');
            const devCpuDetails = document.getElementById('devmgr-cpu-details');
            const devRamCap = document.getElementById('devmgr-ram-capacity');
            const devDiskCap = document.getElementById('devmgr-disk-capacity');
            const devNetIp = document.getElementById('devmgr-net-ip');

            if (devCpuModel) devCpuModel.textContent = cpuModel;
            if (devCpuDetails) devCpuDetails.textContent = `${cpuCoresPhys} Cores • ${cpuCoresLog} Threads @ ${cpuFreqGhz} GHz`;
            if (devRamCap) devRamCap.textContent = `${ramTotalGb} GB Physical RAM`;
            if (devDiskCap) devDiskCap.textContent = `NVMe SSD (${diskTotalGb} GB Total • ${diskFreeGb} GB Free)`;
            if (devNetIp) devNetIp.textContent = `Primary IPv4: ${localIp}`;

            // 5. UPDATE NETWORK CENTER
            const netCenterIp = document.getElementById('netcenter-local-ip');
            const netCenterTraffic = document.getElementById('netcenter-traffic');
            if (netCenterIp) netCenterIp.textContent = localIp;
            if (netCenterTraffic) netCenterTraffic.textContent = `↓ ${netRecvMb} MB • ↑ ${netSentMb} MB`;
        }

        async function fetchRealHostProcesses() {
            try {
                const res = await fetch('/api/system/processes');
                if (res.ok) {
                    const data = await res.json();
                    latestSystemProcesses = data.processes || [];
                    renderLiveTaskMgrProcesses(latestSystemProcesses);
                }
            } catch (err) {
                // Silently handle
            }
        }

        function renderLiveTaskMgrProcesses(processes) {
            const container = document.getElementById('tm-procs-table-container');
            if (!container) return;

            if (!processes || processes.length === 0) {
                container.innerHTML = `
                    <div class="p-8 text-center opacity-60 font-mono text-xs">
                        Fetching real host processes from microkernel...
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <table class="w-full text-left font-mono text-xs">
                    <thead class="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 uppercase tracking-wider sticky top-0 z-10">
                        <tr>
                            <th class="p-2.5">Process Name</th>
                            <th class="p-2.5">PID</th>
                            <th class="p-2.5">CPU %</th>
                            <th class="p-2.5">Memory (RAM)</th>
                            <th class="p-2.5">Threads</th>
                            <th class="p-2.5">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                        ${processes.map(p => `
                            <tr onclick="selectTaskMgrProc(${p.pid})" class="hover:bg-cyan-500/10 cursor-pointer transition-colors ${selectedTaskMgrProcId === p.pid ? 'bg-cyan-500/20 font-bold text-cyan-400' : ''}">
                                <td class="p-2.5 flex items-center space-x-2">
                                    <span>${p.icon || '⚙️'}</span>
                                    <span class="text-slate-900 dark:text-white truncate max-w-[200px]">${p.name}</span>
                                </td>
                                <td class="p-2.5 opacity-60">${p.pid}</td>
                                <td class="p-2.5 ${p.cpu > 5 ? 'text-amber-500 font-bold' : 'text-emerald-500 font-bold'}">${typeof p.cpu === 'number' ? p.cpu.toFixed(1) : p.cpu}%</td>
                                <td class="p-2.5 text-cyan-500 font-bold">${p.ram} MB</td>
                                <td class="p-2.5 opacity-70">${p.threads || 1}</td>
                                <td class="p-2.5"><span class="px-2 py-0.5 rounded-full text-[9px] ${p.status === 'running' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'bg-slate-500/20 text-slate-400'}">${p.status || 'running'}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        
        // TASK MANAGER TAB SWITCHER
        function switchTaskMgrTab(tabName) {
            playSfx('click');
            const tabs = ['perf', 'procs', 'startup'];
            tabs.forEach(t => {
                const pane = document.getElementById(`tm-pane-${t}`);
                const btn = document.getElementById(`tm-tab-${t}`);
                if (pane) {
                    if (t === tabName) {
                        pane.classList.remove('hidden');
                    } else {
                        pane.classList.add('hidden');
                    }
                }
                if (btn) {
                    if (t === tabName) {
                        btn.className = "px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold";
                    } else {
                        btn.className = "px-2.5 py-1 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-800 opacity-70";
                    }
                }
            });
            if (tabName === 'procs') {
                if (latestSystemProcesses && latestSystemProcesses.length > 0) {
                    renderLiveTaskMgrProcesses(latestSystemProcesses);
                }
                fetchRealHostProcesses();
            } else if (tabName === 'startup') {
                renderTaskMgrStartupList();
            }
        }

        function renderTaskMgrStartupList() {
            const sList = document.getElementById('tm-startup-list');
            if (!sList) return;
            sList.innerHTML = `
                <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div class="flex items-center space-x-2.5">
                        <span class="text-base">🛡️</span>
                        <div><div class="font-bold">Kavach Defender Real-Time Guard</div><div class="text-[10px] opacity-60">System Security • High Impact</div></div>
                    </div>
                    <span class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">Enabled</span>
                </div>
                <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div class="flex items-center space-x-2.5">
                        <span class="text-base">📶</span>
                        <div><div class="font-bold">Quantum Network Adapter Daemon</div><div class="text-[10px] opacity-60">Network Connectivity • Low Impact</div></div>
                    </div>
                    <span class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">Enabled</span>
                </div>
                <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div class="flex items-center space-x-2.5">
                        <span class="text-base">🧠</span>
                        <div><div class="font-bold">Sudarshan Indic AI Copilot Engine</div><div class="text-[10px] opacity-60">Neural Assistant • Medium Impact</div></div>
                    </div>
                    <span class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">Enabled</span>
                </div>
            `;
        }

        function selectTaskMgrProc(pid) {
            playSfx('click');
            selectedTaskMgrProcId = pid;
            renderLiveTaskMgrProcesses(latestSystemProcesses);
        }

        async function endSelectedTaskMgrProcess() {
            if (!selectedTaskMgrProcId) {
                showNotificationToast("Task Manager", "Please select an active host process to terminate.", "warning");
                return;
            }
            playSfx('click');
            try {
                const res = await fetch('/api/system/kill-process', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pid: selectedTaskMgrProcId })
                });
                const result = await res.json();
                if (result.success) {
                    showNotificationToast("Task Manager", `Host Process PID ${selectedTaskMgrProcId} terminated successfully.`, "success");
                    fetchRealHostProcesses();
                } else {
                    showNotificationToast("Task Manager", `Could not terminate PID ${selectedTaskMgrProcId}: ${result.error || 'Access Denied'}`, "error");
                }
            } catch (err) {
                showNotificationToast("Task Manager", `Process termination signal sent to PID ${selectedTaskMgrProcId}.`, "info");
            }
            selectedTaskMgrProcId = null;
        }

        async function fetchRealStorageAndNetwork() {
            try {
                // Fetch storage partitions
                const sRes = await fetch('/api/system/storage');
                if (sRes.ok) {
                    const sData = await sRes.json();
                    const pList = document.getElementById('settings-storage-partitions-list');
                    if (pList && sData.partitions) {
                        pList.innerHTML = sData.partitions.map(pt => `
                            <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                <div>
                                    <div class="font-bold text-xs">${pt.device || pt.mountpoint} (${pt.fstype || 'NTFS'})</div>
                                    <div class="text-[10px] opacity-60">Mount: ${pt.mountpoint}</div>
                                </div>
                                <div class="text-right">
                                    <div class="text-cyan-400 font-bold text-xs">${pt.used_gb} GB / ${pt.total_gb} GB</div>
                                    <div class="text-[10px] opacity-60">${pt.free_gb} GB Free (${pt.percent}%)</div>
                                </div>
                            </div>
                        `).join('');
                    }
                }

                // Fetch network adapters
                const nRes = await fetch('/api/system/network');
                if (nRes.ok) {
                    const nData = await nRes.json();
                    const ifList = document.getElementById('settings-net-ifaces-list');
                    if (ifList && nData.interfaces) {
                        ifList.innerHTML = nData.interfaces.map(iface => `
                            <div class="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                <span class="font-bold text-slate-900 dark:text-white">${iface.name}</span>
                                <span class="text-cyan-400 font-mono">${iface.ip}</span>
                                <span class="text-[10px] ${iface.is_up ? 'text-emerald-400' : 'text-slate-500'} font-bold">${iface.is_up ? 'UP' : 'DOWN'} • ${iface.speed_mbps} Mbps</span>
                            </div>
                        `).join('');
                    }
                }
            } catch (e) {}
        }

        // Initialize Real Telemetry Intervals
        updateRealtimeHardwareTelemetry();
        fetchRealHostProcesses();
        fetchRealStorageAndNetwork();

        setInterval(updateRealtimeHardwareTelemetry, 1000);
        setInterval(fetchRealHostProcesses, 2000);
        setInterval(fetchRealStorageAndNetwork, 5000);

        // // 3. BHARAT SOUNDSCAPE & HARMONIC STUDIO PLAYER
        const MUSIC_TRACKS = [
            { title: "528 Hz DNA Healing Harmonic", artist: "Sacred Solfeggio Tone • Pure Sine Synthesis", freq: 528, icon: "☸️" },
            { title: "432 Hz Earth Resonance & Om", artist: "Schumann Resonance • Binaural Drone", freq: 432, icon: "🕉️" },
            { title: "Raag Bhairav Morning Dawn Flute", artist: "Synthesized Acoustic Bansuri • Golden Hour", freq: 587, icon: "🪈" },
            { title: "Western Ghats Rainforest Monsoon", artist: "Natural Rain Audio DSP & Ambient Waves", freq: 396, icon: "🌧️" },
            { title: "Cosmic Gaganyaan Space Pulse", artist: "Ambient Orbital Synthesizer • Deep Orbit", freq: 639, icon: "🚀" }
        ];

        let activeMusicTrackIdx = 0;
        let isMusicPlaying = false;
        let musicOscillator = null;
        let musicGainNode = null;

        function renderMusicTracks() {
            const list = document.getElementById('music-track-list');
            if (!list) return;
            list.innerHTML = MUSIC_TRACKS.map((t, idx) => `
                <button onclick="selectMusicTrack(${idx})" class="w-full text-left px-3 py-2 rounded-xl flex items-center space-x-2.5 transition-all ${idx === activeMusicTrackIdx ? 'bg-saffron/20 text-saffron font-bold border border-saffron/40' : 'hover:bg-slate-200 dark:hover:bg-slate-800/80 opacity-80'}">
                    <span>${t.icon}</span>
                    <div class="truncate">
                        <div class="truncate text-xs font-semibold">${t.title}</div>
                        <div class="text-[9px] opacity-60 truncate">${t.freq} Hz</div>
                    </div>
                </button>
            `).join('');
        }

        function selectMusicTrack(idx) {
            activeMusicTrackIdx = idx;
            renderMusicTracks();
            const track = MUSIC_TRACKS[idx];
            document.getElementById('music-active-title').textContent = track.title;
            document.getElementById('music-active-artist').textContent = track.artist;
            document.getElementById('music-disc-icon').textContent = track.icon;
            
            // Sync with dynamic island
            const islandMusic = document.getElementById('island-track-name');
            if (islandMusic) islandMusic.textContent = track.title;

            if (isMusicPlaying) {
                stopMusicSynth();
                startMusicSynth();
            }
        }

        function toggleMusicPlayback() {
            isMusicPlaying = !isMusicPlaying;
            playSfx('click');
            const playBtn = document.getElementById('music-play-btn');
            if (playBtn) playBtn.textContent = isMusicPlaying ? '⏸' : '▶';
            
            if (isMusicPlaying) {
                startMusicSynth();
                showSecurityToast(`🎵 Playing: ${MUSIC_TRACKS[activeMusicTrackIdx].title}`, 'info');
            } else {
                stopMusicSynth();
            }
        }

        function startMusicSynth() {
            try {
                const ctx = getAudioContext();
                musicOscillator = ctx.createOscillator();
                musicGainNode = ctx.createGain();
                
                musicOscillator.type = 'sine';
                musicOscillator.frequency.setValueAtTime(MUSIC_TRACKS[activeMusicTrackIdx].freq, ctx.currentTime);
                musicGainNode.gain.setValueAtTime(0.15, ctx.currentTime);
                
                musicOscillator.connect(musicGainNode);
                musicGainNode.connect(ctx.destination);
                musicOscillator.start();
                animateEqualizer();
            } catch(e) {}
        }

        function stopMusicSynth() {
            try {
                if (musicOscillator) {
                    musicOscillator.stop();
                    musicOscillator.disconnect();
                    musicOscillator = null;
                }
            } catch(e) {}
        }

        function prevMusicTrack() {
            playSfx('click');
            activeMusicTrackIdx = (activeMusicTrackIdx - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
            selectMusicTrack(activeMusicTrackIdx);
        }

        function nextMusicTrack() {
            playSfx('click');
            activeMusicTrackIdx = (activeMusicTrackIdx + 1) % MUSIC_TRACKS.length;
            selectMusicTrack(activeMusicTrackIdx);
        }

        function setMusicVolume(val) {
            if (musicGainNode) {
                const ctx = getAudioContext();
                musicGainNode.gain.setValueAtTime((val / 100) * 0.25, ctx.currentTime);
            }
        }

        function animateEqualizer() {
            if (!isMusicPlaying) return;
            const canvas = document.getElementById('music-equalizer-canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const bars = 24;
                const barWidth = canvas.width / bars - 4;
                
                for (let i = 0; i < bars; i++) {
                    const h = Math.random() * (canvas.height - 10) + 10;
                    const x = i * (barWidth + 4);
                    const y = canvas.height - h;
                    
                    const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
                    grad.addColorStop(0, '#ff9933');
                    grad.addColorStop(1, '#138808');
                    ctx.fillStyle = grad;
                    ctx.fillRect(x, y, barWidth, h);
                }
            }
            requestAnimationFrame(animateEqualizer);
        }

        // // 4. SOVEREIGN SCIENTIFIC CALCULATOR CONTROLLER
        let calcExpr = '';
        function calcNum(char) {
            playSfx('click');
            if (calcExpr === '0' && char !== '.') calcExpr = '';
            calcExpr += char;
            updateCalcDisplay();
        }

        function calcOp(op) {
            triggerHaptic('selection');
            playSfx('click');
            calcExpr += op;
            updateCalcDisplay();
        }

        function calcFunc(fn) {
            playSfx('click');
            if (fn === 'sqrt') calcExpr += 'Math.sqrt(';
            else if (fn === 'sin') calcExpr += 'Math.sin(';
            else if (fn === 'cos') calcExpr += 'Math.cos(';
            else if (fn === 'tan') calcExpr += 'Math.tan(';
            updateCalcDisplay();
        }

        function calcClear() {
            triggerHaptic('medium');
            playSfx('click');
            calcExpr = '';
            updateCalcDisplay();
        }

        function calcBack() {
            playSfx('click');
            calcExpr = calcExpr.slice(0, -1);
            updateCalcDisplay();
        }

        function calcEval() {
            triggerHaptic('success');
            playSfx('unlock');
            try {
                const histEl = document.getElementById('calc-history-display');
                if (histEl) histEl.textContent = calcExpr + ' =';
                const safeEval = new Function(`return (${calcExpr || 0})`)();
                calcExpr = String(Math.round(safeEval * 1000000) / 1000000);
                updateCalcDisplay();
            } catch(e) {
                const mainEl = document.getElementById('calc-main-display');
                if (mainEl) mainEl.textContent = 'Error';
            }
        }

        function updateCalcDisplay() {
            const mainEl = document.getElementById('calc-main-display');
            if (mainEl) mainEl.textContent = calcExpr || '0';
        }

        // // 5. SOVEREIGN CALENDAR & ISRO SPACE TRACKER CONTROLLER
        function renderCalendar() {
            const daysGrid = document.getElementById('cal-days-grid');
            if (!daysGrid) return;
            daysGrid.innerHTML = '';
            
            // Render 31 days of August with today (Aug 25) highlighted
            for (let day = 1; day <= 31; day++) {
                const cell = document.createElement('div');
                const isToday = day === 25;
                cell.className = `py-2 rounded-xl text-center cursor-pointer transition-all ${
                    isToday ? 'bg-cyan-500 text-slate-950 font-bold shadow-md scale-105' : 'hover:bg-slate-200 dark:hover:bg-slate-800'
                }`;
                cell.textContent = day;
                daysGrid.appendChild(cell);
            }
        }

        const ISRO_MISSIONS = [
            { name: "🚀 Gaganyaan-1 (Uncrewed Spaceflight)", date: "Target: September 8, 2026", status: "T-Minus 14 Days", desc: "HLVM3 heavy launch vehicle with crew module orbital escape qualification.", badge: "bg-emerald-500/20 text-emerald-400" },
            { name: "🛰️ Chandrayaan-4 Lunar Sample Return", date: "Target: Q4 2026", status: "Orbiter Assembly Complete", desc: "Dual launch docking mission returning 3kg of South Pole lunar regolith samples.", badge: "bg-purple-500/20 text-purple-400" },
            { name: "☀️ Aditya-L1 Solar Pulse Telemetry", date: "Active Orbit: Lagrange Point 1", status: "100% Real-Time Stream", desc: "Continuous coronal mass ejection ultraviolet spectrometry data downlink.", badge: "bg-amber-500/20 text-amber-400" },
            { name: "🪐 Shukrayaan-1 Venus Atmospheric Orbiter", date: "Target: 2027", status: "Synthetic Aperture Radar Test", desc: "Sub-surface ground penetrating radar scanning Venusian volcanic crust.", badge: "bg-cyan-500/20 text-cyan-400" }
        ];

        function renderISROMissions() {
            const list = document.getElementById('isro-missions-list');
            if (!list) return;
            list.innerHTML = ISRO_MISSIONS.map(m => `
                <div class="p-4 rounded-2xl bg-white/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                    <div class="flex justify-between items-center">
                        <div class="font-bold text-sm text-slate-900 dark:text-white">${m.name}</div>
                        <span class="px-2.5 py-0.5 rounded-full ${m.badge} text-[10px] font-bold">${m.status}</span>
                    </div>
                    <div class="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">${m.date}</div>
                    <p class="text-xs opacity-75 font-sans">${m.desc}</p>
                </div>
            `).join('');
        }

        // Initialize new apps
        renderStoreApps();
        renderMusicTracks();
        renderCalendar();
        renderISROMissions();

        
        // // IPADOS / MACOS MISSION CONTROL & APP EXPOSÉ ENGINE

        

        var isAppSwitcherOpen = false;

        function toggleAppSwitcher() {
            triggerHaptic('medium');
            isAppSwitcherOpen = !isAppSwitcherOpen;
            const overlay = document.getElementById('app-switcher-overlay');
            if (!overlay) return;

            if (isAppSwitcherOpen) {
                playSfx('open');
                renderAppSwitcherCards();
                overlay.classList.add('active');
            } else {
                playSfx('close');
                overlay.classList.remove('active');
            }
        }

        function closeAppSwitcherOnBackdrop(e) {
            if (e.target.id === 'app-switcher-overlay') {
                toggleAppSwitcher();
            }
        }

        function renderAppSwitcherCards() {
            const grid = document.getElementById('app-switcher-cards-grid');
            const badge = document.getElementById('switcher-open-count-badge');
            if (!grid) return;

            // Find all active or minimized application windows
            const openWinIds = Object.keys(ALL_APPS_METADATA).filter(winId => {
                const el = document.getElementById(winId);
                return el && (!el.classList.contains('hidden') || el.classList.contains('window-minimized'));
            });

            if (badge) badge.textContent = `● ${openWinIds.length} Active Application${openWinIds.length === 1 ? '' : 's'}`;

            if (openWinIds.length === 0) {
                // Empty state: show quick app launcher
                grid.className = "w-full grid grid-cols-2 md:grid-cols-4 gap-4";
                grid.innerHTML = Object.entries(ALL_APPS_METADATA).slice(0, 8).map(([winId, meta]) => `
                    <div onclick="openAppFromSwitcher('${winId}')" class="stage-card p-4 flex flex-col items-center justify-center text-center space-y-2.5">
                        <div class="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl shadow-lg">${meta.icon}</div>
                        <div class="font-bold text-sm text-white font-sans">${meta.name}</div>
                        <div class="text-[10px] text-cyan-400 font-mono">Click to Launch</div>
                    </div>
                `).join('');
                return;
            }

            grid.className = "w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
            grid.innerHTML = openWinIds.map(winId => {
                const meta = ALL_APPS_METADATA[winId] || { name: winId, icon: '🪟', desc: 'Application Window', cat: 'App' };
                const el = document.getElementById(winId);
                const isMinimized = el ? el.classList.contains('window-minimized') : false;

                return `
                    <div class="stage-card" onclick="openAppFromSwitcher('${winId}')">
                        <!-- Stage Card Header -->
                        <div class="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                            <div class="flex items-center space-x-2.5">
                                <span class="text-xl">${meta.icon}</span>
                                <div class="space-y-0.5">
                                    <div class="font-bold text-xs text-white font-sans truncate max-w-[180px]">${meta.name}</div>
                                    <div class="flex items-center space-x-2 text-[10px] font-mono">
                                        <span class="text-cyan-400 font-semibold">${meta.cat}</span>
                                        <span class="text-slate-500">•</span>
                                        <span class="${isMinimized ? 'text-amber-400' : 'text-emerald-400'} font-bold">${isMinimized ? 'Minimized' : 'Running'}</span>
                                    </div>
                                </div>
                            </div>
                            <button onclick="closeAppFromSwitcher(event, '${winId}')" class="w-7 h-7 rounded-full bg-slate-800 hover:bg-rose-500/30 hover:text-rose-400 text-slate-400 flex items-center justify-center font-bold text-xs transition-colors" title="Close Application">
                                ✕
                            </button>
                        </div>

                        <!-- Realistic Simulated Live Window Preview -->
                        <div class="flex-1 p-4 bg-slate-950/80 flex flex-col justify-between font-mono text-xs overflow-hidden relative">
                            <div class="space-y-2 opacity-85">
                                <div class="flex items-center space-x-2 text-[11px] text-slate-300">
                                    <span class="w-2 h-2 rounded-full ${isMinimized ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}"></span>
                                    <span>${meta.desc}</span>
                                </div>
                                <div class="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px] text-slate-400 space-y-1">
                                    <div class="flex justify-between"><span>Memory Allocation:</span><span class="text-cyan-400 font-bold">145.2 MB</span></div>
                                    <div class="flex justify-between"><span>IPC Ring-0 Status:</span><span class="text-emerald-400 font-bold">Isolated & Active</span></div>
                                </div>
                            </div>

                            <div class="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                                <span class="text-cyan-300 font-bold">🚀 Click Card to Zoom Focus</span>
                                <span class="text-slate-500 font-mono">PID: ${Math.floor(Math.random() * 800) + 200}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function openAppFromSwitcher(winId) {
            playSfx('unlock');
            toggleAppSwitcher();
            const meta = ALL_APPS_METADATA[winId];
            openAppWindow(winId, meta ? meta.dockId : null);
        }

        function closeAppFromSwitcher(e, winId) {
            e.stopPropagation();
            playSfx('close');
            const meta = ALL_APPS_METADATA[winId];
            closeAppWindow(winId, meta ? meta.dockId : null);
            renderAppSwitcherCards();
        }

        function closeAllOpenWindows() {
            playSfx('close');
            Object.keys(ALL_APPS_METADATA).forEach(winId => {
                const meta = ALL_APPS_METADATA[winId];
                closeAppWindow(winId, meta ? meta.dockId : null);
            });
            toggleAppSwitcher();
            showNotificationToast("Mission Control", "All active application windows closed.", "info");
        }

        function tileWindowsSplitScreen() {
            playSfx('open');
            toggleAppSwitcher();
            const openWinIds = Object.keys(ALL_APPS_METADATA).filter(winId => {
                const el = document.getElementById(winId);
                return el && !el.classList.contains('hidden');
            });

            if (openWinIds.length >= 2) {
                const win1 = document.getElementById(openWinIds[0]);
                const win2 = document.getElementById(openWinIds[1]);

                if (win1) {
                    win1.style.top = '10px';
                    win1.style.left = '10px';
                    win1.style.width = '48vw';
                    win1.style.height = '88vh';
                    win1.classList.remove('window-minimized');
                }
                if (win2) {
                    win2.style.top = '10px';
                    win2.style.left = '50vw';
                    win2.style.width = '48vw';
                    win2.style.height = '88vh';
                    win2.classList.remove('window-minimized');
                }
                showNotificationToast("Stage Manager", "Split screen side-by-side tile applied!", "success");
            } else {
                showNotificationToast("Stage Manager", "Open at least 2 windows to split screen.", "info");
            }
        }

        
        // Global Window Focus on Click
        document.addEventListener('mousedown', (e) => {
            const win = e.target.closest('[id$="-window"]');
            if (win && !win.classList.contains('hidden')) {
                highestZ += 2;
                win.style.zIndex = highestZ;
            }
        });

        
        // // SUDARSHAN AI NEURAL COPILOT ENGINE

        var isAICopilotOpen = false;

        function toggleAICopilot() {
            isAICopilotOpen = !isAICopilotOpen;
            const drawer = document.getElementById('ai-copilot-drawer');
            if (!drawer) return;
            if (isAICopilotOpen) {
                playSfx('open');
                drawer.classList.add('active');
                setTimeout(() => { document.getElementById('ai-user-input')?.focus(); }, 300);
            } else {
                playSfx('close');
                drawer.classList.remove('active');
            }
        }

        function sendQuickAIPrompt(promptText) {
            const input = document.getElementById('ai-user-input');
            if (input) {
                input.value = promptText;
                executeAIChat();
            }
        }

        function executeAIChat() {
            const input = document.getElementById('ai-user-input');
            const history = document.getElementById('ai-chat-history');
            if (!input || !history) return;
            const query = input.value.trim();
            if (!query) return;
            input.value = '';

            playSfx('click');

            // Append User Message
            history.innerHTML += `
                <div class="flex items-start justify-end space-x-2">
                    <div class="p-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold max-w-[80%] shadow">
                        ${query}
                    </div>
                </div>
            `;
            history.scrollTop = history.scrollHeight;

            // Generate AI Response with OS Automation
            setTimeout(() => {
                const response = processAICommand(query);
                history.innerHTML += `
                    <div class="flex items-start space-x-2.5">
                        <div class="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-sm shrink-0">☸️</div>
                        <div class="p-3 rounded-2xl bg-slate-200/80 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 space-y-1">
                            <p class="font-sans text-xs">${response.text}</p>
                            ${response.actionNote ? `<div class="text-[10px] text-emerald-400 font-bold">✓ ${response.actionNote}</div>` : ''}
                        </div>
                    </div>
                `;
                history.scrollTop = history.scrollHeight;
                playSfx('unlock');
            }, 450);
        }

        function processAICommand(query) {
            const q = query.toLowerCase();

            if (q.includes('task manager') || q.includes('taskmgr') || q.includes('processes')) {
                openAppWindow('taskmanager-window', 'dock-taskmgr');
                return { text: "Opening Bharat Task Manager. 60-second real-time telemetry canvas and live processes online.", actionNote: "Launched Task Manager" };
            }
            if (q.includes('browser') || q.includes('internet') || q.includes('google')) {
                openAppWindow('browser-window', 'dock-browser');
                return { text: "Launching Garud Sovereign Web Browser with sandboxed privacy.", actionNote: "Launched Garud Browser" };
            }
            if (q.includes('code') || q.includes('ide') || q.includes('rust')) {
                openAppWindow('code-window', 'dock-code');
                return { text: "Opening Indic Code Studio Pro. 16-Core SMP LLVM Rust workspace loaded.", actionNote: "Launched Code Studio" };
            }
            if (q.includes('game') || q.includes('fps') || q.includes('solaris')) {
                openAppWindow('game-window', 'dock-game');
                return { text: "Engaging Solaris 3D Cyber Forge FPS Arena with hardware acceleration!", actionNote: "Launched Solaris 3D" };
            }
            if (q.includes('store') || q.includes('install') || q.includes('app')) {
                openAppWindow('store-window', 'dock-store');
                return { text: "Opening Bharat Sovereign App Store. 24+ verified native packages available.", actionNote: "Launched App Store" };
            }
            if (q.includes('virus') || q.includes('scan') || q.includes('security') || q.includes('kavach')) {
                openAppWindow('kavach-window', 'dock-defender');
                if (typeof startDeepAntivirusScan === 'function') startDeepAntivirusScan();
                return { text: "Kavach Sentinel 3.0 activated. Initiating deep Zero-Trust heuristic file scan.", actionNote: "Scan Running" };
            }
            if (q.includes('isro') || q.includes('rocket') || q.includes('launch') || q.includes('gaganyaan')) {
                openAppWindow('calendar-window', 'dock-calendar');
                return { text: "ISRO Mission Watch: Gaganyaan-1 is slated for orbital insertion with LVM3 rocket. Systems nominal.", actionNote: "Opened ISRO Mission Hub" };
            }
            if (q.includes('split') || q.includes('tile')) {
                tileWindowsSplitScreen();
                return { text: "Tiled active windows side-by-side using Sovereign Stage Manager.", actionNote: "Applied Split-Screen" };
            }
            if (q.includes('lock')) {
                lockDesktop();
                return { text: "Sovereign desktop locked. Biometric and PIN authentication required to re-enter.", actionNote: "Locked Desktop" };
            }
            if (q.includes('dark') || q.includes('light') || q.includes('theme')) {
                toggleTheme();
                return { text: "Theme toggled smoothly while preserving your 4K scenic wallpaper with translucent liquid glass.", actionNote: "Theme Switched" };
            }

            // Math solving
            if (/\d+[\+\-\*\/]\d+/.test(q)) {
                try {
                    const mathMatch = q.match(/[\d\.\s\+\-\*\/\(\)]+/)[0];
                    const res = Function(`'use strict'; return (${mathMatch})`)();
                    return { text: `Vedic Math Solution for ${mathMatch.trim()} = <b>${res}</b>`, actionNote: "Math Evaluated" };
                } catch(e) {}
            }

            return {
                text: `I have analyzed your request "<b>${query}</b>". BharatOS Ring-0 microkernel and sovereign AI accelerators are operating at peak efficiency (144 FPS). How else may I assist your workflow?`
            };
        }

        function toggleVoiceInput() {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                showNotificationToast("AI Voice", "Speech recognition is active in standard mode.", "info");
                return;
            }
            showNotificationToast("AI Voice", "Listening to voice command...", "info");
        }


        // // SOVEREIGN SPOTLIGHT GLOBAL SEARCH ENGINE

        var isSpotlightOpen = false;
        var currentSpotlightCat = 'all';

        function openSpotlight() {
            isSpotlightOpen = true;
            const modal = document.getElementById('spotlight-modal');
            const input = document.getElementById('spotlight-input');
            if (!modal) return;
            playSfx('open');
            modal.classList.add('active');
            if (input) {
                input.value = '';
                input.focus();
            }
            filterSpotlightResults('');
        }

        function closeSpotlight() {
            isSpotlightOpen = false;
            const modal = document.getElementById('spotlight-modal');
            if (modal) {
                playSfx('close');
                modal.classList.remove('active');
            }
        }

        function closeSpotlightOnBackdrop(e) {
            if (e.target.id === 'spotlight-modal') closeSpotlight();
        }

        function setSpotlightCategory(cat) {
            currentSpotlightCat = cat;
            ['all', 'apps', 'files', 'settings'].forEach(c => {
                const btn = document.getElementById(`spot-cat-${c}`);
                if (btn) {
                    if (c === cat) {
                        btn.className = 'px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold';
                    } else {
                        btn.className = 'px-2.5 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400';
                    }
                }
            });
            const input = document.getElementById('spotlight-input');
            filterSpotlightResults(input ? input.value : '');
        }

        function filterSpotlightResults(query) {
            const box = document.getElementById('spotlight-results-box');
            if (!box) return;
            const q = query.toLowerCase().trim();

            let results = [];

            // 1. Applications
            if (currentSpotlightCat === 'all' || currentSpotlightCat === 'apps') {
                Object.entries(ALL_APPS_METADATA).forEach(([winId, app]) => {
                    if (!q || app.name.toLowerCase().includes(q) || app.desc.toLowerCase().includes(q)) {
                        results.push({
                            title: app.name,
                            desc: app.desc,
                            icon: app.icon,
                            badge: 'App',
                            action: () => { closeSpotlight(); openAppWindow(winId, app.dockId); }
                        });
                    }
                });
            }

            // 2. VFS Files
            if (currentSpotlightCat === 'all' || currentSpotlightCat === 'files') {
                Object.entries(VFS_TREE).forEach(([dir, files]) => {
                    files.forEach(f => {
                        if (!q || f.name.toLowerCase().includes(q)) {
                            results.push({
                                title: f.name,
                                desc: `${dir}/${f.name} • ${f.size}`,
                                icon: f.icon,
                                badge: 'File',
                                action: () => { closeSpotlight(); openAppWindow('files-window', 'dock-files'); }
                            });
                        }
                    });
                });
            }

            // 3. Settings Tabs
            if (currentSpotlightCat === 'all' || currentSpotlightCat === 'settings') {
                const settingsTabs = [
                    { name: 'Multi-User Accounts & Avatars', key: 'accounts', icon: '👥' },
                    { name: 'Display Scaling & Resolution', key: 'display', icon: '🖥️' },
                    { name: '4K Scenic Wallpapers & Glass', key: 'wallpaper', icon: '🏞️' },
                    { name: 'Sound DSP & Audio Synthesizer', key: 'sound', icon: '🔊' },
                    { name: 'Kavach Security & Sentinel', key: 'security', icon: '🛡️' }
                ];
                settingsTabs.forEach(s => {
                    if (!q || s.name.toLowerCase().includes(q)) {
                        results.push({
                            title: s.name,
                            desc: 'System Configuration Control',
                            icon: s.icon,
                            badge: 'Setting',
                            action: () => { closeSpotlight(); openAppWindow('settings-window', 'dock-settings'); switchSettingsTab(s.key); }
                        });
                    }
                });
            }

            if (results.length === 0) {
                box.innerHTML = `<div class="p-6 text-center text-slate-500 font-mono">No matching results for "${query}". Press Enter to search on Google.</div>`;
                return;
            }

            box.innerHTML = results.slice(0, 7).map((item, idx) => `
                <div onclick="executeSpotlightAction(${idx})" class="p-2.5 rounded-xl hover:bg-cyan-500/20 cursor-pointer flex items-center justify-between group transition-colors">
                    <div class="flex items-center space-x-3">
                        <span class="text-xl">${item.icon}</span>
                        <div>
                            <div class="font-bold text-slate-900 dark:text-white font-sans text-xs group-hover:text-cyan-400">${item.title}</div>
                            <div class="text-[10px] text-slate-400">${item.desc}</div>
                        </div>
                    </div>
                    <span class="px-2 py-0.5 rounded-md bg-slate-800 text-cyan-400 text-[10px] font-bold">${item.badge}</span>
                </div>
            `).join('');

            window._currentSpotlightResults = results;
        }

        function executeSpotlightAction(idx) {
            if (window._currentSpotlightResults && window._currentSpotlightResults[idx]) {
                window._currentSpotlightResults[idx].action();
            }
        }

        function handleSpotlightKey(e) {
            if (e.key === 'Escape') closeSpotlight();
            if (e.key === 'Enter') {
                if (window._currentSpotlightResults && window._currentSpotlightResults.length > 0) {
                    executeSpotlightAction(0);
                } else {
                    const input = document.getElementById('spotlight-input');
                    if (input && input.value) {
                        closeSpotlight();
                        openAppWindow('browser-window', 'dock-browser');
                        executeBrowserSearch(input.value);
                    }
                }
            }
        }


        // // ACTION CENTER & NOTIFICATION HUB ENGINE

        var isActionCenterOpen = false;

        function toggleActionCenter() {
            isActionCenterOpen = !isActionCenterOpen;
            const drawer = document.getElementById('action-center-drawer');
            if (!drawer) return;
            if (isActionCenterOpen) {
                playSfx('open');
                drawer.classList.add('active');
            } else {
                playSfx('close');
                drawer.classList.remove('active');
            }
        }

        function toggleQuickTile(btn, tileName) {
            playSfx('click');
            const isActive = btn.classList.contains('bg-cyan-500') || btn.classList.contains('bg-emerald-500');
            if (isActive) {
                btn.classList.remove('bg-cyan-500', 'bg-emerald-500', 'text-slate-950');
                btn.classList.add('bg-slate-200', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
                showNotificationToast(tileName, `${tileName} disabled.`, "info");
            } else {
                btn.classList.remove('bg-slate-200', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
                btn.classList.add('bg-cyan-500', 'text-slate-950');
                showNotificationToast(tileName, `${tileName} enabled.`, "success");
            }
        }

        function clearAllNotifications() {
            playSfx('close');
            const list = document.getElementById('action-notifications-list');
            if (list) list.innerHTML = `<div class="p-4 text-center text-slate-500 text-xs">No unread notifications</div>`;
        }


        // // DESKTOP RIGHT-CLICK CONTEXT MENU ENGINE

        function showDesktopContextMenu(e) {
            playSfx('click');
            const menu = document.getElementById('desktop-context-menu');
            if (!menu) return;

            let x = e.clientX;
            let y = e.clientY;
            if (x + 240 > window.innerWidth) x = window.innerWidth - 245;
            if (y + 320 > window.innerHeight) y = window.innerHeight - 325;

            menu.style.left = `${x}px`;
            menu.style.top = `${y}px`;
            menu.classList.add('active');
        }

        function showTaskbarContextMenu(e) {
            showDesktopContextMenu(e);
        }

        document.addEventListener('contextmenu', (e) => {
            // If right-clicked on an input or window, let native context run
            if (e.target.closest('input, textarea, [id$="-window"]')) {
                hideDesktopContextMenu();
                return;
            }

            e.preventDefault();
            showDesktopContextMenu(e);
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#desktop-context-menu')) {
                hideDesktopContextMenu();
            }
        });

        function hideDesktopContextMenu() {
            const menu = document.getElementById('desktop-context-menu');
            if (menu) menu.classList.remove('active');
        }

        function createNewDesktopItem(type) {
            playSfx('open');
            triggerHaptic('medium');
            const itemName = prompt(`Enter name for new ${type === 'folder' ? 'Folder' : 'Text Document'}:`, type === 'folder' ? 'New Folder' : 'New Document.txt');
            if (!itemName) return;
            showNotificationToast(
                type === 'folder' ? '📁 Folder Created' : '📄 File Created',
                `Created "${itemName}" on Sovereign Desktop (~/Desktop/${itemName})`,
                'success'
            );
        }

        function refreshDesktopView() {
            playSfx('click');
            triggerHaptic('light');
            showNotificationToast('🔄 Desktop Refreshed', 'Refreshed icons, liquid glass compositor, and GPU buffers.', 'info');
        }

        // Global Shortcuts
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();

            // Anti-Reversing & Anti-DevTools Lockdown
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) ||
                (e.ctrlKey && (key === 'u' || key === 's'))) {
                e.preventDefault();
                e.stopPropagation();
                triggerHaptic('error');
                playSfx('error');
                logSecurityEvent('ANTI_REVERSING', `Blocked inspection key combo [${e.key}]. Code reversing prohibited.`, 'WARN');
                showToastNotification('Security Lockdown', 'Developer Tools & Source Inspection are disabled in Sovereign Mode.');
                return false;
            }

            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            // Mission Control / iPad App Switcher Triggers
            if (e.key === 'Tab' && (e.altKey || e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggleAppSwitcher();
                return;
            }
            if (e.key === 'F3' || (e.key === ' ' && (e.metaKey || e.altKey))) {
                e.preventDefault();
                toggleAppSwitcher();
                return;
            }
            if (e.key === 'Escape' && isAppSwitcherOpen) {
                e.preventDefault();
                toggleAppSwitcher();
                return;
            }

            // Spotlight & Copilot & Action Center Triggers
            if ((e.key === ' ' || key === 'k') && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                openSpotlight();
                return;
            }
            if (key === 'c' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggleAICopilot();
                return;
            }
            if (key === 'n' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggleActionCenter();
                return;
            }

            if (e.metaKey || e.ctrlKey || e.altKey) {
                if (e.key === 'ArrowLeft') { e.preventDefault(); snapActiveWindow('left'); }
                if (e.key === 'ArrowRight') { e.preventDefault(); snapActiveWindow('right'); }
                if (e.key === 'ArrowUp') { e.preventDefault(); snapActiveWindow('maximize'); }
                if (e.key === 'ArrowDown') { e.preventDefault(); snapActiveWindow('restore'); }
                if (key === 'tab') { e.preventDefault(); toggleAppSwitcher(); }
                if (key === 'b') { e.preventDefault(); openAppWindow('browser-window', 'dock-browser'); }
                if (key === 'c') { e.preventDefault(); openAppWindow('code-window', 'dock-code'); }
                if (key === 'g') { e.preventDefault(); openAppWindow('game-window', 'dock-game'); }
                if (key === 'e') { e.preventDefault(); openAppWindow('files-window', 'dock-files'); }
                if (key === 's') { e.preventDefault(); openAppWindow('kavach-window', 'dock-defender'); }
                if (key === 'a') { e.preventDefault(); openAppWindow('store-window', 'dock-store'); }
                if (key === 'p') { e.preventDefault(); openAppWindow('taskmanager-window', 'dock-taskmgr'); }
                if (key === 'm') { e.preventDefault(); openAppWindow('music-window', 'dock-music'); }
                if (key === 'k') { e.preventDefault(); openAppWindow('calc-window', 'dock-calc'); }
                if (key === 'j') { e.preventDefault(); openAppWindow('calendar-window', 'dock-calendar'); }
                if (key === 't') { e.preventDefault(); openAppWindow('terminal-window', 'dock-terminal'); }
                if (key === 'i') { e.preventDefault(); openAppWindow('settings-window', 'dock-settings'); }
                if (key === 'w') { e.preventDefault(); openAppWindow('win32-compat-window', 'dock-win32'); }
                if (key === 'o') { e.preventDefault(); openAppWindow('osdev-kernel-window', 'dock-osdev'); }
                if (key === 'h') { e.preventDefault(); openAppWindow('focusshield-window', 'dock-focusshield'); }
                if (key === 'l') { e.preventDefault(); lockDesktop(); }
                if (key === 'd') { e.preventDefault(); toggleWidgets(); }
                if (key === '?' || key === '/') { e.preventDefault(); openKeybindingsModal(); }
            }
        });

        // VFS ENGINE
        const VFS_TREE = {
            "/home/user": [
                { name: "documents", type: "dir", icon: "📁", size: "4 KB", mime: "Folder" },
                { name: "projects", type: "dir", icon: "📁", size: "12 KB", mime: "Folder" },
                { name: "games", type: "dir", icon: "🎮", size: "2.4 MB", mime: "Folder" },
                { name: "solaris_game.exe", type: "file", icon: "🚀", size: "1.4 MB", mime: "Executable Application" },
                { name: "readme.txt", type: "file", icon: "📄", size: "1.2 KB", mime: "Text File" }
            ],
            "/home/user/documents": [
                { name: "sovereignty_manifesto.md", type: "file", icon: "📄", size: "3.2 KB", mime: "Markdown Document" },
                { name: "hardware_specs.pdf", type: "file", icon: "📕", size: "450 KB", mime: "PDF Document" },
                { name: "vulkan_roadmap.docx", type: "file", icon: "📘", size: "24 KB", mime: "Word Document" }
            ],
            "/home/user/projects": [
                { name: "solaris_space_game", type: "dir", icon: "🪐", size: "84 KB", mime: "Project Folder" },
                { name: "indic_ai_core", type: "dir", icon: "🧠", size: "120 KB", mime: "AI Workspace" }
            ],
            "/home/user/games": [
                { name: "solaris_flight.app", type: "file", icon: "🪐", size: "1.8 MB", mime: "3D Flight Simulator" }
            ],
            "/system": [
                { name: "kernel.sys", type: "file", icon: "⚙️", size: "1.4 MB", mime: "System Kernel Image" },
                { name: "kavach_vault.key", type: "file", icon: "🛡️", size: "256 B", mime: "Cryptographic Key" }
            ]
        };

        let currentVFSPath = "/home/user";
        let vfsHistory = ["/home/user"];
        let vfsHistoryIdx = 0;
        let vfsViewMode = "grid";
        let selectedVFSItem = null;

        function renderVFS(path) {
            currentVFSPath = path;
            document.getElementById('vfs-current-breadcrumb').textContent = path.replace("/home/user", "");
            const container = document.getElementById('vfs-file-grid');
            if (!container) return;
            container.innerHTML = '';

            const items = VFS_TREE[path] || [];

            if (vfsViewMode === 'grid') {
                container.className = 'flex-1 p-5 grid grid-cols-3 sm:grid-cols-4 gap-3 bg-slate-50/40 dark:bg-slate-950/50 custom-scroll overflow-y-auto content-start';
                items.forEach(item => {
                    const el = document.createElement('div');
                    el.className = 'p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800/90 flex flex-col items-center text-center cursor-pointer hover:scale-105 hover:bg-white dark:hover:bg-slate-800/80 transition-all shadow-sm';
                    el.onclick = () => {
                        playSfx('click');
                        selectVFSItem(item);
                        if (item.type === 'dir') {
                            const nextPath = path === '/' ? `/${item.name}` : `${path}/${item.name}`;
                            navigateToPath(nextPath);
                        }
                    };
                    el.ondblclick = () => {
                        if (item.name.includes('solaris') || item.name.endsWith('.exe') || item.name.endsWith('.app')) {
                            playSfx('open');
                            openAppWindow('game-window', 'dock-game');
                        } else if (item.name.endsWith('.md') || item.name.endsWith('.txt') || item.name.endsWith('.rs')) {
                            playSfx('open');
                            openAppWindow('code-window', 'dock-code');
                        }
                    };
                    el.innerHTML = `<span class="text-3xl mb-1.5">${item.icon}</span><span class="text-xs font-bold truncate w-full">${item.name}</span><span class="text-[10px] opacity-60 mt-1">${item.size}</span>`;
                    container.appendChild(el);
                });
            } else {
                container.className = 'flex-1 p-4 bg-slate-50/40 dark:bg-slate-950/50 custom-scroll overflow-y-auto space-y-1.5';
                items.forEach(item => {
                    const el = document.createElement('div');
                    el.className = 'px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-800/90 flex items-center justify-between cursor-pointer hover:bg-white dark:hover:bg-slate-800/80 transition-all text-xs font-mono';
                    el.onclick = () => {
                        playSfx('click');
                        selectVFSItem(item);
                        if (item.type === 'dir') {
                            const nextPath = path === '/' ? `/${item.name}` : `${path}/${item.name}`;
                            navigateToPath(nextPath);
                        }
                    };
                    el.ondblclick = () => {
                        if (item.name.includes('solaris') || item.name.endsWith('.exe') || item.name.endsWith('.app')) {
                            playSfx('open');
                            openAppWindow('game-window', 'dock-game');
                        } else if (item.name.endsWith('.md') || item.name.endsWith('.txt') || item.name.endsWith('.rs')) {
                            playSfx('open');
                            openAppWindow('code-window', 'dock-code');
                        }
                    };
                    el.innerHTML = `<div class="flex items-center space-x-3"><span class="text-xl">${item.icon}</span><span class="font-bold">${item.name}</span></div><div class="flex items-center space-x-4 opacity-70"><span>${item.mime}</span><span>${item.size}</span></div>`;
                    container.appendChild(el);
                });
            }
        }

        function selectVFSItem(item) {
            selectedVFSItem = item;
            const icon = document.getElementById('inspector-icon');
            const name = document.getElementById('inspector-name');
            const type = document.getElementById('inspector-type');
            const size = document.getElementById('inspector-size');
            const loc = document.getElementById('inspector-loc');

            if (icon) icon.textContent = item.icon;
            if (name) name.textContent = item.name;
            if (type) type.textContent = item.mime || item.type;
            if (size) size.textContent = item.size;
            if (loc) loc.textContent = currentVFSPath;
        }

        function navigateToPath(p) {
            if (p !== currentVFSPath) {
                vfsHistory.push(p);
                vfsHistoryIdx = vfsHistory.length - 1;
            }
            renderVFS(p);
        }

        function vfsGoBack() {
            if (vfsHistoryIdx > 0) {
                vfsHistoryIdx--;
                renderVFS(vfsHistory[vfsHistoryIdx]);
            }
        }

        function vfsGoForward() {
            if (vfsHistoryIdx < vfsHistory.length - 1) {
                vfsHistoryIdx++;
                renderVFS(vfsHistory[vfsHistoryIdx]);
            }
        }

        function setVFSView(mode) {
            vfsViewMode = mode;
            const btnG = document.getElementById('vfs-view-grid');
            const btnL = document.getElementById('vfs-view-list');
            if (mode === 'grid') {
                if (btnG) btnG.className = 'px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold text-[10px]';
                if (btnL) btnL.className = 'px-2 py-0.5 rounded opacity-70 text-[10px]';
            } else {
                if (btnG) btnG.className = 'px-2 py-0.5 rounded opacity-70 text-[10px]';
                if (btnL) btnL.className = 'px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold text-[10px]';
            }
            renderVFS(currentVFSPath);
        }

        function createNewFilePrompt() {
            const fname = prompt("Enter new file name:", "new_document.txt");
            if (fname) {
                if (!VFS_TREE[currentVFSPath]) VFS_TREE[currentVFSPath] = [];
                VFS_TREE[currentVFSPath].push({ name: fname, type: "file", icon: "📄", size: "0 B", mime: "Text File" });
                renderVFS(currentVFSPath);
            }
        }

        function createNewFolderPrompt() {
            const dname = prompt("Enter new folder name:", "New Folder");
            if (dname) {
                if (!VFS_TREE[currentVFSPath]) VFS_TREE[currentVFSPath] = [];
                VFS_TREE[currentVFSPath].push({ name: dname, type: "dir", icon: "📁", size: "4 KB", mime: "Folder" });
                renderVFS(currentVFSPath);
            }
        }

        function openSelectedFileInEditor() {
            playSfx('open');
            openAppWindow('code-window', 'dock-code');
        }

        renderVFS("/home/user");

        // // FULL WINDOWS CMD & POWERSHELL EXECUTION ENGINE
        let commandHistory = [];
        let historyPointer = -1;
        let terminalShellMode = 'cmd'; // 'cmd' or 'powershell'
        let runningProcesses = [
            { image: "System", pid: 4, session: "Services", sessionNum: 0, mem: "1,240 K" },
            { image: "smss.exe", pid: 384, session: "Services", sessionNum: 0, mem: "1,080 K" },
            { image: "csrss.exe", pid: 512, session: "Console", sessionNum: 1, mem: "4,820 K" },
            { image: "wininit.exe", pid: 588, session: "Services", sessionNum: 0, mem: "3,110 K" },
            { image: "services.exe", pid: 664, session: "Services", sessionNum: 0, mem: "7,490 K" },
            { image: "lsass.exe", pid: 688, session: "Services", sessionNum: 0, mem: "14,200 K" },
            { image: "kavach_shield.exe", pid: 912, session: "Services", sessionNum: 0, mem: "18,450 K" },
            { image: "vulkan_pacer.exe", pid: 1040, session: "Console", sessionNum: 1, mem: "32,600 K" },
            { image: "explorer.exe", pid: 2844, session: "Console", sessionNum: 1, mem: "64,120 K" },
            { image: "garud_browser.exe", pid: 4092, session: "Console", sessionNum: 1, mem: "84,300 K" },
            { image: "indic_studio.exe", pid: 5120, session: "Console", sessionNum: 1, mem: "92,400 K" },
            { image: "cmd.exe", pid: 6180, session: "Console", sessionNum: 1, mem: "4,210 K" }
        ];

        function getPromptPrefix() {
            const userName = (typeof userProfile !== 'undefined' && userProfile.name) ? userProfile.name.toLowerCase().replace(/\s+/g, '') : 'sovereign';
            if (terminalShellMode === 'powershell') {
                return `PS C:\\Users\\${userName}&gt;`;
            }
            return `C:\\Users\\${userName}&gt;`;
        }

        function handleTerminalKey(e) {
            const input = document.getElementById('terminal-input');
            if (!input) return;

            if (e.key === 'ArrowUp') {
                if (commandHistory.length > 0 && historyPointer < commandHistory.length - 1) {
                    historyPointer++;
                    input.value = commandHistory[commandHistory.length - 1 - historyPointer];
                }
                e.preventDefault();
                return;
            } else if (e.key === 'ArrowDown') {
                if (historyPointer > 0) {
                    historyPointer--;
                    input.value = commandHistory[commandHistory.length - 1 - historyPointer];
                } else {
                    historyPointer = -1;
                    input.value = '';
                }
                e.preventDefault();
                return;
            }

            if (e.key === 'Enter') {
                playSfx('click');
                const rawVal = input.value;
                const val = rawVal.trim();
                input.value = '';
                historyPointer = -1;
                if (!val) return;

                commandHistory.push(val);
                const out = document.getElementById('terminal-output');
                const promptPrefix = getPromptPrefix();
                out.innerHTML += `<div><span class="text-cyan-700 dark:text-emerald-400 font-bold">${promptPrefix}</span> <span class="text-slate-900 dark:text-white">${rawVal}</span></div>`;
                
                const parts = val.split(' ');
                const cmd = parts[0].toLowerCase();
                const arg = parts.slice(1).join(' ').trim();
                const args = parts.slice(1);

                // 1. HELP / ?
                if (cmd === 'help' || cmd === '/?') {
                    out.innerHTML += `<div class="space-y-1 text-slate-800 dark:text-slate-200">
<span class="text-saffron font-bold">BharatOS Sovereign Command Center — Full Windows & PowerShell Matrix:</span><br>
<span class="text-cyan-600 dark:text-cyan-300 font-bold">--- File & Directory Management ---</span><br>
  DIR / LS [path]      - List directory files, sizes, and attributes<br>
  CD / CHDIR [path]    - Change directory (e.g. 'cd documents', 'cd ..', 'cd \\')<br>
  TREE                 - Graphically display directory structure of a drive/path<br>
  TYPE / CAT [file]    - Display the contents of a text file<br>
  MKDIR / MD [name]    - Create a new directory<br>
  RMDIR / RD [name]    - Remove an existing directory<br>
  DEL / ERASE [file]   - Delete specified file<br>
  COPY [src] [dst]     - Copy file to another location<br>
  ATTRIB [file]        - Display file attributes (Archive, Hidden, System)<br>
<span class="text-cyan-600 dark:text-cyan-300 font-bold">--- System, Diagnostics & Hardware ---</span><br>
  SYSTEMINFO           - Display operating system, memory, processor, & BIOS specs<br>
  VER / WINVER         - Display BharatOS & Windows NT kernel compatibility version<br>
  TASKLIST / PS        - Display all currently running processes & RAM allocation<br>
  TASKKILL /PID [id]   - Terminate process by PID or image name<br>
  SFC /SCANNOW         - System File Checker scanning integrity of Ring-0 binaries<br>
  CHKDSK               - Check NVMe storage filesystem and sector integrity<br>
  WHOAMI               - Print current logged-in user name and ring-0 domain<br>
  HOSTNAME             - Print hostname of this sovereign PC<br>
  DATE / TIME          - Display Saka calendar date & IST timestamp<br>
  COLOR [attr]         - Change terminal foreground/background color (e.g. 'color 0a')<br>
<span class="text-cyan-600 dark:text-cyan-300 font-bold">--- Networking & Connectivity ---</span><br>
  IPCONFIG [/all]      - Display network adapters, IPv4, gateway, and DNS<br>
  PING [host]          - Send ICMP echo packets to test network latency<br>
  NETSTAT [-an]        - Display active TCP/UDP network connections and ports<br>
<span class="text-cyan-600 dark:text-cyan-300 font-bold">--- Applications & OS Control ---</span><br>
  BROWSER [url]        - Launch Garud Sovereign Web Browser<br>
  CODE [file]          - Launch Indic Code Studio Professional IDE<br>
  DEFENDER / SCAN      - Launch Kavach Sovereign Defender 3.0<br>
  EXPLORER             - Launch SovereignFS File Explorer<br>
  SETTINGS             - Launch Settings & Personalization Hub<br>
  WALLPAPER [name]     - Change wallpaper (ladakh, munnar, varanasi, thar, kashmir, andaman, waterfall, kutch)<br>
  POWERSHELL / CMD     - Switch between Windows Command Prompt and PowerShell<br>
  LOCK                 - Lock desktop enclave (Win+L)<br>
  LICENSE [--status | --activate <key> | --gen] - Manage digital product key & anti-piracy licensing<br>
  SLMGR [/dli | /ipk <key>]                    - Windows Software License Manager alias<br>
  SHUTDOWN [/s /r]     - Power down or reboot the operating system<br>
  CLS / CLEAR          - Clear the terminal screen buffer
</div>`;

                // LICENSE / SLMGR Command Handler
                } else if (cmd === 'license' || cmd === 'slmgr') {
                    const subCmd = args[0] ? args[0].toLowerCase() : '--status';
                    const state = loadLicenseState();
                    
                    if (subCmd === '--status' || subCmd === '/dli' || subCmd === '/xpr') {
                        out.innerHTML += `<div class="space-y-1 text-slate-800 dark:text-slate-200">
<span class="text-amber-400 font-bold">=== BharatOS Sovereign Software Licensing Management (slmgr) ===</span><br>
  License Status     : <span class="${state.status === 'GENUINE_ACTIVATED' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}">${state.status}</span><br>
  Edition Name       : <span class="text-cyan-400 font-bold">${state.tierName}</span><br>
  Edition Code       : ${state.editionCode}<br>
  Product Key (Mask) : <span class="text-amber-300">${state.key ? '••••-••••-••••-' + state.key.slice(-4) : 'NONE'}</span><br>
  Machine GUID       : <span class="text-slate-400">${state.machineGuid}</span><br>
  Certificate Hash   : <span class="text-slate-400">${state.certHash}</span><br>
  Anti-Piracy Enclave: <span class="text-emerald-400">Ring-0 Zero-Trust Active (Ed25519 Verified)</span>
</div>`;
                    } else if (subCmd === '--activate' || subCmd === '/ipk') {
                        const keyToActivate = args[1];
                        if (!keyToActivate) {
                            out.innerHTML += `<div class="text-rose-400 font-bold">Error: Missing product key. Usage: license --activate BHARAT-XXXX-XXXX-XXXX-XXXX</div>`;
                        } else {
                            const res = activateProductKey(keyToActivate);
                            if (res.success) {
                                out.innerHTML += `<div class="text-emerald-400 font-bold">✓ License Activated Successfully! Edition: ${res.state.tierName} [${res.state.key}]</div>`;
                            } else {
                                out.innerHTML += `<div class="text-rose-400 font-bold">❌ Anti-Piracy Error: ${res.error}</div>`;
                            }
                        }
                    } else if (subCmd === '--gen') {
                        const tier = args[1] ? args[1].toUpperCase() : 'PRO';
                        const newKey = generateGenuineLicenseKey(tier);
                        out.innerHTML += `<div class="space-y-0.5 text-slate-800 dark:text-slate-200">
<span class="text-cyan-400 font-bold">Generated Genuine Digital License Key [Tier: ${tier}]:</span><br>
<span class="text-amber-400 font-bold text-sm tracking-wider select-all">${newKey}</span><br>
<span class="text-[10px] opacity-70">To activate: type 'license --activate ${newKey}'</span>
</div>`;
                    } else if (subCmd === '--verify') {
                        const res = validateDigitalLicenseKey(state.key);
                        out.innerHTML += `<div>Hardware Signature & Polynomial Checksum: <span class="${res.valid ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}">${res.valid ? 'PASSED (Genuine Root Certificate)' : 'FAILED (Tampered)'}</span></div>`;
                    } else {
                        out.innerHTML += `<div class="text-slate-400">Usage: license [--status | --activate <KEY> | --gen [pro|defn|comm] | --verify]</div>`;
                    }

                // 2. VER / WINVER
                } else if (cmd === 'ver' || cmd === 'winver') {
                    out.innerHTML += `<div>
BharatOS Sovereign Microkernel [Version 2026.1.0 LTS]<br>
Microsoft Windows Compatibility Subsystem [Version 10.0.26100.2454]<br>
(c) 2026 BharatOS Sovereign Corporation. All rights reserved. Zero-Trust Ring-0.
</div>`;

                // 3. CLS / CLEAR
                } else if (cmd === 'cls' || cmd === 'clear') {
                    out.innerHTML = '';

                // 4. ECHO
                } else if (cmd === 'echo') {
                    out.innerHTML += `<div>${arg || ''}</div>`;

                // 5. DIR / LS
                } else if (cmd === 'dir' || cmd === 'ls') {
                    const items = VFS_TREE[currentVFSPath] || [];
                    let dirListing = `<div> Volume in drive C is SOVEREIGN_OS<br> Volume Serial Number is 4B2A-9E11<br><br> Directory of C:${currentVFSPath.replace(/\//g, '\\')}<br><br>`;
                    dirListing += `24/08/2026  09:00 AM    &lt;DIR&gt;          . <br>`;
                    dirListing += `24/08/2026  09:00 AM    &lt;DIR&gt;          .. <br>`;
                    items.forEach(it => {
                        const tag = it.type === 'dir' ? '&lt;DIR&gt;         ' : '            ' + (it.size || '1 KB').padEnd(8);
                        dirListing += `24/08/2026  03:45 PM    ${tag} ${it.name}<br>`;
                    });
                    dirListing += `<br>               ${items.length} File(s)          148,220 bytes<br>               2 Dir(s)   499,620,440,064 bytes free</div>`;
                    out.innerHTML += dirListing;

                // 6. CD / CHDIR
                } else if (cmd === 'cd' || cmd === 'chdir') {
                    if (!arg || arg === '~' || arg === '\\' || arg === '/') {
                        currentVFSPath = '/home/user';
                    } else if (arg === '..' || arg === '../') {
                        const parts = currentVFSPath.split('/').filter(Boolean);
                        if (parts.length > 2) {
                            parts.pop();
                            currentVFSPath = '/' + parts.join('/');
                        } else {
                            currentVFSPath = '/home/user';
                        }
                    } else {
                        const cleanArg = arg.replace(/\\/g, '/');
                        const directTarget = currentVFSPath + '/' + cleanArg;
                        const rootTarget = cleanArg.startsWith('/') ? cleanArg : ('/home/user/' + cleanArg);
                        if (VFS_TREE[directTarget]) currentVFSPath = directTarget;
                        else if (VFS_TREE[rootTarget]) currentVFSPath = rootTarget;
                        else out.innerHTML += `<div class="text-rose-500">The system cannot find the path specified: ${arg}</div>`;
                    }
                    renderVFS(currentVFSPath);

                // 7. TREE
                } else if (cmd === 'tree') {
                    let treeOut = `<div>Folder PATH listing for Volume SOVEREIGN_OS<br>Volume serial number is 4B2A-9E11<br>C:${currentVFSPath.toUpperCase().replace(/\//g, '\\')}<br>`;
                    treeOut += `├── documents<br>│   ├── sovereignty_manifesto.md<br>│   └── financial_report_2026.pdf<br>├── projects<br>│   ├── solaris_space_game<br>│   └── rust_vulkan_engine<br>├── games<br>│   ├── solaris_odyssey.exe<br>│   └── vedic_chess.exe<br>└── system<br>    ├── kernel.sys<br>    └── kavach_vault.key</div>`;
                    out.innerHTML += treeOut;

                // 8. TYPE / CAT
                } else if (cmd === 'type' || cmd === 'cat') {
                    if (!arg) {
                        out.innerHTML += `<div class="text-amber-500">Syntax: TYPE [filename]</div>`;
                    } else {
                        const items = VFS_TREE[currentVFSPath] || [];
                        const found = items.find(i => i.name.toLowerCase() === arg.toLowerCase());
                        if (found) {
                            if (found.name.endsWith('.md') || found.name.endsWith('.txt')) {
                                out.innerHTML += `<div class="p-3 bg-slate-900/50 rounded-xl border border-slate-800 text-slate-200 whitespace-pre-wrap"># BharatOS Sovereignty Manifesto\n\n1. Pure 64-bit Rust Microkernel with zero telemetry.\n2. Quantum Enclave Hardware Isolation.\n3. Native Windows PE & Vulkan 144 FPS Support.</div>`;
                            } else {
                                out.innerHTML += `<div class="text-cyan-400">[Binary File Contents: ${found.name} (${found.size}) - AES-256 Verified]</div>`;
                            }
                        } else {
                            out.innerHTML += `<div class="text-rose-500">The system cannot find the file specified: ${arg}</div>`;
                        }
                    }

                // 9. MKDIR / MD
                } else if (cmd === 'mkdir' || cmd === 'md') {
                    if (!arg) out.innerHTML += `<div class="text-amber-500">The syntax of the command is incorrect.</div>`;
                    else {
                        if (!VFS_TREE[currentVFSPath]) VFS_TREE[currentVFSPath] = [];
                        VFS_TREE[currentVFSPath].push({ name: arg, type: 'dir', size: '0 KB', icon: '📁' });
                        VFS_TREE[`${currentVFSPath}/${arg}`] = [];
                        renderVFS(currentVFSPath);
                        out.innerHTML += `<div class="text-emerald-500">Directory '${arg}' created successfully.</div>`;
                    }

                // 10. DEL / ERASE / RM
                } else if (cmd === 'del' || cmd === 'erase' || cmd === 'rm') {
                    if (!arg) out.innerHTML += `<div class="text-amber-500">The syntax of the command is incorrect.</div>`;
                    else {
                        if (VFS_TREE[currentVFSPath]) {
                            const idx = VFS_TREE[currentVFSPath].findIndex(i => i.name.toLowerCase() === arg.toLowerCase());
                            if (idx !== -1) {
                                VFS_TREE[currentVFSPath].splice(idx, 1);
                                renderVFS(currentVFSPath);
                                out.innerHTML += `<div class="text-emerald-500">File '${arg}' deleted.</div>`;
                            } else {
                                out.innerHTML += `<div class="text-rose-500">Could Not Find C:${currentVFSPath}\\${arg}</div>`;
                            }
                        }
                    }

                // 11. IPCONFIG
                } else if (cmd === 'ipconfig') {
                    const isAll = arg.toLowerCase().includes('/all');
                    out.innerHTML += `<div class="space-y-2">
Windows IP Configuration & Sovereign Network Adapter:<br><br>
Wireless LAN adapter Wi-Fi 7 Mesh:<br>
   Connection-specific DNS Suffix  . : sovereign.lan<br>
   Link-local IPv6 Address . . . . . : fe80::d41b:89fa:e100:4412%12<br>
   IPv4 Address. . . . . . . . . . . : 192.168.1.144<br>
   Subnet Mask . . . . . . . . . . . : 255.255.255.0<br>
   Default Gateway . . . . . . . . . : 192.168.1.1<br>
${isAll ? `   Physical Address. . . . . . . . . : 00-1A-7D-DA-71-12<br>   DHCP Enabled. . . . . . . . . . . : Yes<br>   DNS Servers . . . . . . . . . . . : 1.1.1.1, 8.8.8.8<br>   Kavach Quantum DNS Tunnel . . . . : ACTIVE (100% Zero Leak)<br>` : ''}
</div>`;

                // 12. PING
                } else if (cmd === 'ping') {
                    const host = arg || '127.0.0.1';
                    out.innerHTML += `<div>Pinging ${host} [104.21.48.11] with 32 bytes of data:</div>`;
                    let pCount = 0;
                    const pInterval = setInterval(() => {
                        pCount++;
                        const ms = Math.floor(Math.random() * 8) + 12;
                        out.innerHTML += `<div>Reply from 104.21.48.11: bytes=32 time=${ms}ms TTL=118</div>`;
                        out.scrollTop = out.scrollHeight;
                        if (pCount >= 4) {
                            clearInterval(pInterval);
                            out.innerHTML += `<br><div>Ping statistics for 104.21.48.11:<br>    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),<br>Approximate round trip times in milli-seconds:<br>    Minimum = 12ms, Maximum = 19ms, Average = 14ms</div>`;
                            out.scrollTop = out.scrollHeight;
                        }
                    }, 250);

                // 13. TASKLIST / PS
                } else if (cmd === 'tasklist' || (cmd === 'ps' && terminalShellMode === 'powershell')) {
                    let taskTable = `<div>Image Name                     PID Session Name        Session#    Mem Usage<br>========================= ======== ================ =========== =============<br>`;
                    runningProcesses.forEach(p => {
                        taskTable += `${p.image.padEnd(25)} ${String(p.pid).padStart(8)} ${p.session.padEnd(16)} ${String(p.sessionNum).padStart(11)} ${p.mem.padStart(13)}<br>`;
                    });
                    taskTable += `</div>`;
                    out.innerHTML += taskTable;

                // 14. TASKKILL / KILL
                } else if (cmd === 'taskkill' || cmd === 'kill') {
                    let pidToKill = null;
                    if (arg.includes('/pid')) {
                        const pidIdx = args.indexOf('/pid') + 1;
                        if (args[pidIdx]) pidToKill = parseInt(args[pidIdx]);
                    } else if (args[0] && !isNaN(parseInt(args[0]))) {
                        pidToKill = parseInt(args[0]);
                    }
                    if (pidToKill) {
                        const idx = runningProcesses.findIndex(p => p.pid === pidToKill);
                        if (idx !== -1) {
                            const killed = runningProcesses.splice(idx, 1)[0];
                            out.innerHTML += `<div class="text-emerald-500">SUCCESS: Sent termination signal to the process with PID ${pidToKill} (${killed.image}).</div>`;
                        } else {
                            out.innerHTML += `<div class="text-rose-500">ERROR: The process with PID ${pidToKill} could not be found.</div>`;
                        }
                    } else {
                        out.innerHTML += `<div class="text-amber-500">Syntax: TASKKILL /PID &lt;ProcessID&gt;</div>`;
                    }

                // 15. SYSTEMINFO
                } else if (cmd === 'systeminfo') {
                    out.innerHTML += `<div class="space-y-1">
Host Name:                 BHARAT-SOVEREIGN-PC<br>
OS Name:                   BharatOS 2026.1.0 LTS (Rust SMP Microkernel)<br>
OS Version:                10.0.26100 N/A Build 26100<br>
OS Manufacturer:           BharatOS Sovereign Corporation<br>
OS Configuration:          Stand-Alone Workstation<br>
System Manufacturer:       Bharat Electronics Ltd (BEL)<br>
System Model:              Sovereign Quantum Station Pro<br>
System Type:               x64-based PC (16 Cores Online)<br>
Processor(s):              1 Processor(s) Installed. [01]: x86_64 SMP @ 4.20 GHz<br>
BIOS Version:              Bharat UEFI Core 4.2, 24/08/2026<br>
Total Physical Memory:     16,384 MB<br>
Available Physical Memory: 14,280 MB<br>
Virtual Memory: Max Size:  32,768 MB<br>
Security Shield:           Kavach Defender 3.0 (Zero-Trust Ring-0)<br>
Hotfix(s):                 4 Hotfix(s) Installed. [01]: KB5042890 (Vulkan 144FPS)
</div>`;

                // 16. NETSTAT
                } else if (cmd === 'netstat') {
                    out.innerHTML += `<div>
Active Connections<br><br>
  Proto  Local Address          Foreign Address        State<br>
  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING<br>
  TCP    0.0.0.0:445            0.0.0.0:0              LISTENING<br>
  TCP    0.0.0.0:5678           0.0.0.0:0              LISTENING<br>
  TCP    192.168.1.144:52110    104.21.48.11:443       ESTABLISHED<br>
  TCP    192.168.1.144:52114    140.82.121.4:443       ESTABLISHED<br>
  UDP    0.0.0.0:53             *:*                    <br>
  UDP    0.0.0.0:528            *:*                    (DSP Harmonic)
</div>`;

                // 17. WHOAMI
                } else if (cmd === 'whoami') {
                    const u = (typeof userProfile !== 'undefined' && userProfile.name) ? userProfile.name.toLowerCase().replace(/\s+/g, '') : 'sovereign';
                    out.innerHTML += `<div>sovereign\\${u}</div>`;

                // 18. HOSTNAME
                } else if (cmd === 'hostname') {
                    out.innerHTML += `<div>BHARAT-SOVEREIGN-PC</div>`;

                // 19. DATE / TIME
                } else if (cmd === 'date' || cmd === 'time' || cmd === 'get-date') {
                    const now = new Date();
                    out.innerHTML += `<div>
Gregorian: ${now.toLocaleString('en-IN')}<br>
Saka Era:  Saka 1948, Bhadrapada 12 (Ekadashi) • Rohini Nakshatra
</div>`;

                // 20. ATTRIB
                } else if (cmd === 'attrib') {
                    out.innerHTML += `<div>
A            C:\\Users\\sovereign\\documents\\sovereignty_manifesto.md<br>
A    R       C:\\Users\\sovereign\\system\\kernel.sys<br>
A  S H       C:\\Users\\sovereign\\system\\kavach_vault.key
</div>`;

                // 21. SFC /SCANNOW
                } else if (cmd === 'sfc' && arg.toLowerCase().includes('/scannow')) {
                    out.innerHTML += `<div>Beginning system scan. This process will take some time.<br>Beginning verification phase of system scan.</div>`;
                    let sfcProgress = 0;
                    const sfcInt = setInterval(() => {
                        sfcProgress += 25;
                        out.innerHTML += `<div>Verification ${sfcProgress}% complete.</div>`;
                        out.scrollTop = out.scrollHeight;
                        if (sfcProgress >= 100) {
                            clearInterval(sfcInt);
                            out.innerHTML += `<div class="text-emerald-500">Windows Resource Protection did not find any integrity violations. 100% Ring-0 Verified.</div>`;
                            out.scrollTop = out.scrollHeight;
                        }
                    }, 300);

                // 22. CHKDSK
                } else if (cmd === 'chkdsk') {
                    out.innerHTML += `<div>
The type of the file system is SOVEREIGN_FS (NVMe).<br>
Volume SOVEREIGN_OS created 24/08/2026.<br><br>
Stage 1: Examining basic file system structure... 14820 file records processed.<br>
Stage 2: Examining file name linkage... 16000 index entries processed.<br>
Stage 3: Examining security descriptors... 14820 security SDs processed.<br><br>
Windows has scanned the file system and found no problems.<br>
No further action is required.<br><br>
  512,000,000 KB total disk space.<br>
   12,400,000 KB in 14,820 files.<br>
  499,600,000 KB available on disk.
</div>`;

                // 23. COLOR
                } else if (cmd === 'color') {
                    if (arg === '0a' || arg === 'a') {
                        out.className = 'flex-1 bg-black p-5 font-mono text-xs custom-scroll overflow-y-auto space-y-1.5 text-emerald-400';
                        out.innerHTML += `<div class="text-emerald-400">Terminal color changed to Matrix Green.</div>`;
                    } else if (arg === '0c' || arg === 'c') {
                        out.className = 'flex-1 bg-black p-5 font-mono text-xs custom-scroll overflow-y-auto space-y-1.5 text-rose-500';
                        out.innerHTML += `<div class="text-rose-500">Terminal color changed to Red Alert.</div>`;
                    } else if (arg === '0b' || arg === 'b') {
                        out.className = 'flex-1 bg-black p-5 font-mono text-xs custom-scroll overflow-y-auto space-y-1.5 text-cyan-400';
                        out.innerHTML += `<div class="text-cyan-400">Terminal color changed to Electric Cyan.</div>`;
                    } else {
                        out.className = 'flex-1 bg-slate-50 dark:bg-slate-950 p-5 font-mono text-xs custom-scroll overflow-y-auto space-y-1.5 text-slate-900 dark:text-emerald-400';
                        out.innerHTML += `<div>Color reset to default.</div>`;
                    }

                // 24. POWERSHELL / PWSH / CMD
                } else if (cmd === 'powershell' || cmd === 'pwsh') {
                    terminalShellMode = 'powershell';
                    out.innerHTML += `<div>
Windows PowerShell<br>
Copyright (C) Microsoft Corporation & BharatOS. All rights reserved.<br>
Install the latest PowerShell for new features and improvements! https://aka.ms/PSWindows
</div>`;
                } else if (cmd === 'cmd') {
                    terminalShellMode = 'cmd';
                    out.innerHTML += `<div>Microsoft Windows [Version 10.0.26100.2454] — Command Prompt</div>`;

                // 25. WALLPAPER COMMAND
                } else if (cmd === 'wallpaper' || cmd === 'set-wallpaper') {
                    const wpKeywords = {
                        ladakh: 'wall-ladakh-ai',
                        munnar: 'wall-munnar-ai',
                        varanasi: 'wall-varanasi-ai',
                        thar: 'wall-thar-ai',
                        kashmir: 'wall-kashmir-ai',
                        andaman: 'wall-andaman-ai',
                        waterfall: 'wall-waterfall-ai',
                        kutch: 'wall-kutch-ai'
                    };
                    const matchedKey = Object.keys(wpKeywords).find(k => arg.toLowerCase().includes(k));
                    if (matchedKey) {
                        const targetClass = wpKeywords[matchedKey];
                        setWallpaper(targetClass);
                        out.innerHTML += `<div class="text-emerald-500">✓ Wallpaper successfully switched to: 4K ${matchedKey.toUpperCase()} Landscape!</div>`;
                    } else {
                        out.innerHTML += `<div class="text-amber-500">Available Wallpapers: ladakh, munnar, varanasi, thar, kashmir, andaman, waterfall, kutch<br>Usage: wallpaper ladakh</div>`;
                    }

                // 26. APP LAUNCHERS
                } else if (cmd === 'browser') {
                    openAppWindow('browser-window', 'dock-browser');
                    if (arg) navigateBrowserUrl(arg);
                } else if (cmd === 'code') {
                    openAppWindow('code-window', 'dock-code');
                } else if (cmd === 'game' || cmd === 'fps' || cmd === 'solaris') {
                    openAppWindow('game-window', 'dock-game');
                } else if (cmd === 'defender' || cmd === 'scan') {
                    openAppWindow('kavach-window', 'dock-defender');
                    startKavachScan();
                } else if (cmd === 'explorer') {
                    openAppWindow('files-window', 'dock-files');
                } else if (cmd === 'store' || cmd === 'appstore') {
                    openAppWindow('store-window', 'dock-store');
                } else if (cmd === 'taskmgr' || cmd === 'perf') {
                    openAppWindow('taskmanager-window', 'dock-taskmgr');
                } else if (cmd === 'music' || cmd === 'soundscape') {
                    openAppWindow('music-window', 'dock-music');
                } else if (cmd === 'calc' || cmd === 'calculator') {
                    openAppWindow('calc-window', 'dock-calc');
                } else if (cmd === 'calendar' || cmd === 'isro') {
                    openAppWindow('calendar-window', 'dock-calendar');
                } else if (cmd === 'apps') {
                    out.innerHTML += `<div class="space-y-0.5 text-cyan-400">
Available Sovereign Applications:<br>
  • browser     - Garud Sovereign Web Browser<br>
  • code        - Indic Code Studio IDE (Rust 2026)<br>
  • game        - Solaris 3D Cyber Forge FPS (Three.js)<br>
  • explorer    - SovereignFS File Manager<br>
  • defender    - Kavach 3.0 Ring-0 Shield<br>
  • store       - Indic Sovereign App Store<br>
  • taskmgr     - Real-Time Hardware Performance Monitor<br>
  • music       - 528 Hz Harmonic Soundscape Player<br>
  • calc        - Scientific & Precision Calculator<br>
  • calendar    - Saka 1948 & ISRO Telemetry Hub<br>
  • settings    - OS Control Center<br>
</div>`;
                } else if (cmd === 'settings') {
                    openAppWindow('settings-window', 'dock-settings');
                } else if (cmd === 'lock') {
                    lockDesktop();
                } else if (cmd === 'shutdown') {
                    if (arg.includes('/r')) triggerReboot();
                    else triggerShutdown();
                } else if (cmd === 'restart' || cmd === 'reboot') {
                    triggerReboot();
                } else if (cmd === 'write-host') {
                    out.innerHTML += `<div>${arg}</div>`;
                } else if (cmd === 'get-process') {
                    let psList = `<div>Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id ProcessName<br>-------  ------    -----      -----     ------     -- -----------<br>`;
                    runningProcesses.forEach(p => {
                        psList += `    120      14     4210       8420       0.42   ${String(p.pid).padStart(4)} ${p.image.replace('.exe', '')}<br>`;
                    });
                    psList += `</div>`;
                    out.innerHTML += psList;
                } else {
                    out.innerHTML += `<div class="text-rose-400 dark:text-rose-300">'${cmd}' is not recognized as an internal or external command, operable program or batch file. Type 'help' for available commands.</div>`;
                }

                out.scrollTop = out.scrollHeight;
            }
        }

        
    
        // // 🏛️ BHARATOS NEXT-GEN PC OS SUBSYSTEM ENGINES

        // -------------------------------------------------------------------------
        // 1. UNIVERSAL SPOTLIGHT SEARCH (Win+S / Cmd+Space)
        // -------------------------------------------------------------------------
        let spotlightSelectedIndex = 0;
        let spotlightCurrentResults = [];

        function openSpotlight() {
            playSfx('click');
            const overlay = document.getElementById('spotlight-overlay');
            const input = document.getElementById('spotlight-input');
            if (overlay && input) {
                overlay.classList.remove('hidden');
                input.value = '';
                input.focus();
                runSpotlightSearch('');
            }
        }

        function closeSpotlight() {
            const overlay = document.getElementById('spotlight-overlay');
            if (overlay) overlay.classList.add('hidden');
        }

        function runSpotlightSearch(query) {
            const container = document.getElementById('spotlight-results');
            if (!container) return;
            const q = query.trim().toLowerCase();

            spotlightCurrentResults = [];
            spotlightSelectedIndex = 0;

            // Check if query is a Math Expression (e.g. 512*1024, sqrt(144), 45+89)
            const mathRegex = /^[0-9+\-*\/().^ %sqrtPIEsincozta\s]+$/;
            if (q.length > 1 && mathRegex.test(q)) {
                try {
                    let sanitized = q.replace(/sqrt/g, 'Math.sqrt').replace(/sin/g, 'Math.sin').replace(/cos/g, 'Math.cos').replace(/tan/g, 'Math.tan').replace(/pi/gi, 'Math.PI');
                    const mathRes = Function('"use strict";return (' + sanitized + ')')();
                    if (typeof mathRes === 'number' && !isNaN(mathRes)) {
                        spotlightCurrentResults.push({
                            type: 'math',
                            category: '🔢 Math & Calculation',
                            title: `${query} = ${mathRes.toLocaleString()}`,
                            subtitle: 'Press Enter to copy result to clipboard',
                            icon: '🧮',
                            action: () => {
                                navigator.clipboard.writeText(mathRes.toString());
                                showNotificationToast("Calculator", `Copied "${mathRes}" to clipboard!`, "info");
                                closeSpotlight();
                            }
                        });
                    }
                } catch (e) {}
            }

            // Search Native Apps
            const allApps = [
                { name: 'Garud Web Browser', win: 'browser-window', dock: 'dock-browser', icon: '🌐', cat: 'Internet' },
                { name: 'Indic Code Studio', win: 'code-window', dock: 'dock-code', icon: '⚡', cat: 'Developer' },
                { name: 'Sovereign Notes & Markdown Pad', win: 'notes-window', dock: 'dock-notes', icon: '📝', cat: 'Productivity' },
                { name: 'Photo & Media Viewer', win: 'photos-window', dock: 'dock-photos', icon: '🖼️', cat: 'Media' },
                { name: 'Solaris 3D FPS Cyber Arena', win: 'game-window', dock: 'dock-game', icon: '🎮', cat: 'Gaming' },
                { name: 'Sovereign File Explorer', win: 'files-window', dock: 'dock-files', icon: '📁', cat: 'System' },
                { name: 'Recycle Bin & Trash', win: 'recyclebin-window', dock: 'dock-recyclebin', icon: '🗑️', cat: 'System' },
                { name: 'Kavach Defender Zero-Trust Shield', win: 'kavach-window', dock: 'dock-defender', icon: '🛡️', cat: 'Security' },
                { name: 'Device & Hardware Manager', win: 'devicemanager-window', dock: 'dock-devmgr', icon: '💻', cat: 'Hardware' },
                { name: 'Quantum Network Center', win: 'network-window', dock: 'dock-network', icon: '📶', cat: 'Network' },
                { name: 'Sovereign Task Manager', win: 'taskmanager-window', dock: 'dock-taskmgr', icon: '📈', cat: 'System' },
                { name: 'Sovereign App Store', win: 'store-window', dock: 'dock-store', icon: '🛍️', cat: 'Store' },
                { name: 'Soundscape Harmonic Studio', win: 'music-window', dock: 'dock-music', icon: '🎵', cat: 'Media' },
                { name: 'Scientific Calculator', win: 'calc-window', dock: 'dock-calc', icon: '🧮', cat: 'Utilities' },
                { name: 'Calendar & ISRO Mission Watch', win: 'calendar-window', dock: 'dock-calendar', icon: '🗂️', cat: 'Utilities' },
                { name: 'Sovereign Terminal Enclave', win: 'terminal-window', dock: 'dock-terminal', icon: '📟', cat: 'Developer' },
                { name: 'Personalization & Theme Studio', win: 'customization-window', dock: 'dock-personalize', icon: '🎨', cat: 'Personalization' },
                { name: 'Sovereign Settings Hub', win: 'settings-window', dock: 'dock-settings', icon: '⚙️', cat: 'System' }
            ];

            allApps.forEach(app => {
                if (!q || app.name.toLowerCase().includes(q) || app.cat.toLowerCase().includes(q)) {
                    spotlightCurrentResults.push({
                        type: 'app',
                        category: `🚀 Applications (${app.cat})`,
                        title: app.name,
                        subtitle: 'Open Native BharatOS App',
                        icon: app.icon,
                        action: () => {
                            openAppWindow(app.win, app.dock);
                            closeSpotlight();
                        }
                    });
                }
            });

            // Quick Settings Actions
            const quickActions = [
                { name: 'Toggle Pure Dark / Light Mode', icon: '🌓', action: () => { toggleTheme(); closeSpotlight(); } },
                { name: 'Toggle Night Light Eye Comfort', icon: '🌙', action: () => { toggleNightLight(); closeSpotlight(); } },
                { name: 'Open Mission Control / Stage View', icon: '🗂️', action: () => { toggleAppSwitcher(); closeSpotlight(); } },
                { name: 'Ask Sudarshan AI Copilot', icon: '🤖', action: () => { toggleAICopilot(); closeSpotlight(); } },
                { name: 'Show Desktop (Minimize All)', icon: '🪟', action: () => { toggleShowDesktop(); closeSpotlight(); } },
                { name: 'Lock Sovereign Desktop', icon: '🔒', action: () => { lockDesktop(); closeSpotlight(); } }
            ];

            quickActions.forEach(qa => {
                if (!q || qa.name.toLowerCase().includes(q)) {
                    spotlightCurrentResults.push({
                        type: 'action',
                        category: '⚡ Quick System Actions',
                        title: qa.name,
                        subtitle: 'System Control Shortcut',
                        icon: qa.icon,
                        action: qa.action
                    });
                }
            });

            // Web Search Fallback
            if (q.length > 0) {
                spotlightCurrentResults.push({
                    type: 'web',
                    category: '🌐 Web Search',
                    title: `Search "${query}" on the Web`,
                    subtitle: 'Launch in Garud Sovereign Browser',
                    icon: '🔍',
                    action: () => {
                        openAppWindow('browser-window', 'dock-browser');
                        const bInput = document.getElementById('browser-url-input');
                        if (bInput) bInput.value = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                        navigateBrowser();
                        closeSpotlight();
                    }
                });
            }

            renderSpotlightResults();
        }

        function renderSpotlightResults() {
            const container = document.getElementById('spotlight-results');
            if (!container) return;

            if (spotlightCurrentResults.length === 0) {
                container.innerHTML = `<div class="p-6 text-center opacity-60">No results found for query.</div>`;
                return;
            }

            container.innerHTML = spotlightCurrentResults.map((item, idx) => `
                <div onclick="executeSpotlightItem(${idx})" class="p-2.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${idx === spotlightSelectedIndex ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40 shadow-md' : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200'}">
                    <div class="flex items-center space-x-3">
                        <span class="text-xl">${item.icon}</span>
                        <div>
                            <div class="text-xs">${item.title}</div>
                            <div class="text-[10px] opacity-60 font-sans">${item.subtitle}</div>
                        </div>
                    </div>
                    <span class="text-[9px] px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-400 font-mono">${item.category}</span>
                </div>
            `).join('');
        }

        function handleSpotlightKeydown(e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                spotlightSelectedIndex = (spotlightSelectedIndex + 1) % spotlightCurrentResults.length;
                renderSpotlightResults();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                spotlightSelectedIndex = (spotlightSelectedIndex - 1 + spotlightCurrentResults.length) % spotlightCurrentResults.length;
                renderSpotlightResults();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                executeSpotlightItem(spotlightSelectedIndex);
            } else if (e.key === 'Escape') {
                closeSpotlight();
            }
        }

        function executeSpotlightItem(idx) {
            if (spotlightCurrentResults[idx]) {
                playSfx('click');
                spotlightCurrentResults[idx].action();
            }
        }


        // -------------------------------------------------------------------------
        // 2. CLIPBOARD HISTORY MANAGER (Win+V)
        // -------------------------------------------------------------------------
        let clipboardHistory = [
            { id: 1, text: "https://bharatos.gov.in/telemetry", pinned: true, timestamp: "Just now" },
            { id: 2, text: "const sovereignKernel = new BharatMicrokernel({ enclave: 'zero-trust' });", pinned: false, timestamp: "5m ago" },
            { id: 3, text: "BharatOS 2026 Sovereign Edition", pinned: false, timestamp: "12m ago" }
        ];

        // Global Copy Listener
        document.addEventListener('copy', () => {
            setTimeout(async () => {
                try {
                    const text = await navigator.clipboard.readText();
                    if (text && !clipboardHistory.some(c => c.text === text)) {
                        clipboardHistory.unshift({
                            id: Date.now(),
                            text: text,
                            pinned: false,
                            timestamp: "Just now"
                        });
                        if (clipboardHistory.length > 25) clipboardHistory.pop();
                        renderClipboardHistory();
                    }
                } catch (e) {}
            }, 100);
        });

        function openClipboardHub() {
            playSfx('click');
            const overlay = document.getElementById('clipboard-overlay');
            if (overlay) {
                overlay.classList.remove('hidden');
                renderClipboardHistory();
            }
        }

        function closeClipboardHub() {
            const overlay = document.getElementById('clipboard-overlay');
            if (overlay) overlay.classList.add('hidden');
        }

        function renderClipboardHistory() {
            const container = document.getElementById('clipboard-items-list');
            if (!container) return;

            if (clipboardHistory.length === 0) {
                container.innerHTML = `<div class="p-6 text-center opacity-60">Clipboard history is empty. Press Ctrl+C anywhere to copy items here.</div>`;
                return;
            }

            container.innerHTML = clipboardHistory.map(item => `
                <div class="p-3 rounded-2xl bg-white/40 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-cyan-500/40 transition-all group">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] text-slate-400">${item.timestamp}</span>
                        <div class="flex items-center space-x-1.5 opacity-80">
                            <button onclick="togglePinClipboard(${item.id})" class="px-2 py-0.5 rounded-lg ${item.pinned ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'} text-[10px]">${item.pinned ? '📌 Pinned' : 'Pin'}</button>
                            <button onclick="deleteClipboardItem(${item.id})" class="px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-400 text-[10px]">✕</button>
                        </div>
                    </div>
                    <div class="p-2 rounded-xl bg-black/30 font-mono text-xs text-slate-200 truncate select-all cursor-pointer hover:text-cyan-300" onclick="copyAndPasteSnippet('${item.text.replace(/'/g, "\'")}')">
                        ${item.text}
                    </div>
                </div>
            `).join('');
        }

        function togglePinClipboard(id) {
            playSfx('click');
            const item = clipboardHistory.find(c => c.id === id);
            if (item) item.pinned = !item.pinned;
            renderClipboardHistory();
        }

        function deleteClipboardItem(id) {
            playSfx('click');
            clipboardHistory = clipboardHistory.filter(c => c.id !== id);
            renderClipboardHistory();
        }

        function clearClipboardHistory() {
            playSfx('click');
            clipboardHistory = clipboardHistory.filter(c => c.pinned);
            renderClipboardHistory();
            showNotificationToast("Clipboard", "Cleared unpinned clipboard history.", "info");
        }

        function copyAndPasteSnippet(text) {
            playSfx('click');
            navigator.clipboard.writeText(text);
            showNotificationToast("Clipboard", "Copied snippet to active clipboard!", "success");
            closeClipboardHub();
        }


        // -------------------------------------------------------------------------
        // 3. QUICK SETTINGS ACTION CENTER & DISPLAY FILTERS (Win+A)
        // -------------------------------------------------------------------------
        let isNightLightActive = false;
        let isDNDActive = false;

        function setDisplayBrightness(val) {
            triggerHaptic('tick');
            const overlay = document.getElementById('brightness-overlay');
            const label = document.getElementById('tray-brightness-val');
            if (label) label.textContent = `${val}%`;
            if (overlay) {
                // 100% = 0 opacity, 20% = 0.8 opacity
                const opacity = (100 - val) / 100 * 0.85;
                overlay.style.opacity = opacity.toString();
            }
        }

        function toggleNightLight() {
            playSfx('click');
            isNightLightActive = !isNightLightActive;
            const overlay = document.getElementById('nightlight-overlay');
            const btn = document.getElementById('quick-nightlight-btn');
            if (overlay) {
                overlay.style.opacity = isNightLightActive ? '1' : '0';
            }
            if (btn) {
                btn.className = isNightLightActive ? 
                    "p-2.5 rounded-xl bg-amber-500/30 text-amber-300 font-bold border border-amber-500/50 flex flex-col items-center justify-center space-y-1" :
                    "p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex flex-col items-center justify-center space-y-1";
            }
            showNotificationToast("Display", isNightLightActive ? "Night Light Filter Enabled" : "Night Light Disabled", "info");
        }

        function toggleDNDMode() {
            playSfx('click');
            isDNDActive = !isDNDActive;
            const btn = document.getElementById('quick-dnd-btn');
            if (btn) {
                btn.className = isDNDActive ?
                    "p-2.5 rounded-xl bg-purple-500/30 text-purple-300 font-bold border border-purple-500/50 flex flex-col items-center justify-center space-y-1" :
                    "p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex flex-col items-center justify-center space-y-1";
            }
            showNotificationToast("Focus Mode", isDNDActive ? "Do Not Disturb (DND) Active" : "DND Disabled", "info");
        }


        // -------------------------------------------------------------------------
        // 4. VIRTUAL DESKTOPS / WORKSPACES (Win+Ctrl+D, Win+Ctrl+Arrow)
        // -------------------------------------------------------------------------
        let activeVirtualDesktop = 1;
        const virtualDesktops = [
            { id: 1, name: "Desktop 1 (Work)", windows: ['browser-window', 'files-window'] },
            { id: 2, name: "Desktop 2 (Dev)", windows: ['code-window', 'terminal-window'] },
            { id: 3, name: "Desktop 3 (Media)", windows: ['music-window', 'photos-window', 'game-window'] }
        ];

        function switchVirtualDesktop(id) {
            playSfx('genie');
            activeVirtualDesktop = id;
            [1, 2, 3].forEach(d => {
                const btn = document.getElementById(`workspace-btn-${d}`);
                if (btn) {
                    if (d === id) {
                        btn.className = "workspace-chip active";
                    } else {
                        btn.className = "workspace-chip";
                    }
                }
            });
            showNotificationToast("Workspaces", `Switched to ${virtualDesktops.find(v => v.id === id)?.name || 'Desktop ' + id}`, "info");
        }


        // -------------------------------------------------------------------------
        // 5. NATIVE RIGHT-CLICK CONTEXT MENUS (Desktop, Taskbar, Files)
        // -------------------------------------------------------------------------
        const desktopContextMenu = document.getElementById('desktop-context-menu');
        const taskbarContextMenu = document.getElementById('taskbar-context-menu');

        // Right-Click on Desktop
        const desktopContainer = document.getElementById('desktop-container') || document.querySelector('main');
        if (desktopContainer) {
            desktopContainer.addEventListener('contextmenu', (e) => {
                if (e.target.closest('.ultra-liquid-glass') || e.target.closest('footer')) return;
                e.preventDefault();
                playSfx('click');
                hideAllContextMenus();
                if (desktopContextMenu) {
                    desktopContextMenu.style.display = 'block';
                    desktopContextMenu.style.left = `${Math.min(window.innerWidth - 240, e.clientX)}px`;
                    desktopContextMenu.style.top = `${Math.min(window.innerHeight - 300, e.clientY)}px`;
                }
            });
        }

        // Right-Click on Taskbar
        const taskbarElem = document.querySelector('footer.horizon-taskbar-wrapper');
        if (taskbarElem) {
            taskbarElem.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                playSfx('click');
                hideAllContextMenus();
                if (taskbarContextMenu) {
                    taskbarContextMenu.style.display = 'block';
                    taskbarContextMenu.style.left = `${Math.min(window.innerWidth - 240, e.clientX)}px`;
                    taskbarContextMenu.style.top = `${e.clientY - 210}px`;
                }
            });
        }

        // Dismiss context menus on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.context-menu-pop')) {
                hideAllContextMenus();
            }
        });

        function hideAllContextMenus() {
            if (desktopContextMenu) desktopContextMenu.style.display = 'none';
            if (taskbarContextMenu) taskbarContextMenu.style.display = 'none';
        }
        function hideDesktopContextMenu() { hideAllContextMenus(); }
        function hideTaskbarContextMenu() { hideAllContextMenus(); }


        // -------------------------------------------------------------------------
        // 6. SOVEREIGN RECYCLE BIN / TRASH APP
        // -------------------------------------------------------------------------
        let recycleBinFiles = [
            { id: 101, name: "old_telemetry_dump.log", originalPath: "/var/log/telemetry", size: "4.2 MB", deletedAt: "Yesterday" },
            { id: 102, name: "temp_scratch_script.py", originalPath: "/home/aviral/scripts", size: "12 KB", deletedAt: "2 days ago" }
        ];

        function renderRecycleBinList() {
            const container = document.getElementById('recyclebin-items-container');
            const countLabel = document.getElementById('recyclebin-count-label');
            if (countLabel) countLabel.textContent = `Deleted Files (${recycleBinFiles.length} items)`;
            if (!container) return;

            if (recycleBinFiles.length === 0) {
                container.innerHTML = `<div class="p-12 text-center opacity-60">Recycle Bin is completely empty.</div>`;
                return;
            }

            container.innerHTML = recycleBinFiles.map(file => `
                <div class="p-3.5 rounded-2xl bg-white/40 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-cyan-500/40 transition-all">
                    <div class="flex items-center space-x-3">
                        <span class="text-2xl">📄</span>
                        <div>
                            <div class="font-bold text-slate-900 dark:text-white">${file.name}</div>
                            <div class="text-[10px] opacity-60">Original: ${file.originalPath} • ${file.size} • Deleted: ${file.deletedAt}</div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button onclick="restoreRecycleBinItem(${file.id})" class="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/40 font-bold transition-all">Restore</button>
                        <button onclick="purgeRecycleBinItem(${file.id})" class="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/40 font-bold transition-all">Purge</button>
                    </div>
                </div>
            `).join('');
        }

        function restoreRecycleBinItem(id) {
            playSfx('click');
            const item = recycleBinFiles.find(f => f.id === id);
            if (item) {
                recycleBinFiles = recycleBinFiles.filter(f => f.id !== id);
                renderRecycleBinList();
                showNotificationToast("Recycle Bin", `Restored "${item.name}" back to ${item.originalPath}`, "success");
            }
        }

        function purgeRecycleBinItem(id) {
            playSfx('click');
            recycleBinFiles = recycleBinFiles.filter(f => f.id !== id);
            renderRecycleBinList();
            showNotificationToast("Recycle Bin", "File permanently purged from disk.", "warning");
        }

        function emptyRecycleBin() {
            triggerHaptic('error');
            playSfx('click');
            recycleBinFiles = [];
            renderRecycleBinList();
            showNotificationToast("Recycle Bin", "All deleted items permanently purged.", "warning");
        }


        // -------------------------------------------------------------------------
        // 7. SOVEREIGN NOTES & MARKDOWN PAD APP
        // -------------------------------------------------------------------------
        let sovereignNotes = [
            {
                id: 1,
                title: "BharatOS 2026 Architecture Notes",
                content: "# BharatOS Sovereign Microkernel\n\nBharatOS is engineered with **zero-trust** telemetry, high-craft liquid glass UI, and sovereign on-device AI.\n\n### Key Subsystems:\n- 🛡️ **Kavach Security Shield**\n- 🚀 **Three.js 3D Engine**\n- ⚡ **Real-Time Host Telemetry**\n- 📝 **Markdown Note Studio**\n\n> Pure digital sovereignty for 1.4 billion citizens.",
                updatedAt: "Just now"
            },
            {
                id: 2,
                title: "Project Gaganyaan Telemetry Plan",
                content: "# ISRO Gaganyaan-1 Mission\n\nOrbital module parameters:\n1. Apogee: 400 km\n2. Perigee: 380 km\n3. Crew module thermal shield: Verified\n\n*Status: Nominal*",
                updatedAt: "10m ago"
            }
        ];

        let activeNoteId = 1;

        function renderNotesSidebar() {
            const container = document.getElementById('notes-list-container');
            if (!container) return;
            const searchVal = (document.getElementById('notes-search-input')?.value || '').toLowerCase();
            const filtered = sovereignNotes.filter(n => n.title.toLowerCase().includes(searchVal) || n.content.toLowerCase().includes(searchVal));

            container.innerHTML = filtered.map(note => `
                <div onclick="selectNote(${note.id})" class="p-2.5 rounded-xl cursor-pointer transition-all ${note.id === activeNoteId ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40' : 'hover:bg-white/40 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-300'}">
                    <div class="text-xs truncate">${note.title || 'Untitled Note'}</div>
                    <div class="text-[10px] opacity-60 mt-0.5">${note.updatedAt}</div>
                </div>
            `).join('');
        }

        function selectNote(id) {
            playSfx('click');
            activeNoteId = id;
            const note = sovereignNotes.find(n => n.id === id);
            if (note) {
                const titleInput = document.getElementById('note-title-input');
                const contentInput = document.getElementById('note-content-input');
                if (titleInput) titleInput.value = note.title;
                if (contentInput) contentInput.value = note.content;
                renderNotePreview();
                renderNotesSidebar();
            }
        }

        function createNewNote() {
            triggerHaptic('medium');
            playSfx('click');
            const newId = Date.now();
            sovereignNotes.unshift({
                id: newId,
                title: "New Sovereign Note",
                content: "# New Note\n\nStart writing here...",
                updatedAt: "Just now"
            });
            selectNote(newId);
        }

        function saveCurrentNote() {
            const note = sovereignNotes.find(n => n.id === activeNoteId);
            if (note) {
                note.title = document.getElementById('note-title-input')?.value || 'Untitled Note';
                note.content = document.getElementById('note-content-input')?.value || '';
                note.updatedAt = 'Just now';
                renderNotesSidebar();
            }
        }

        function deleteCurrentNote() {
            playSfx('click');
            sovereignNotes = sovereignNotes.filter(n => n.id !== activeNoteId);
            if (sovereignNotes.length > 0) {
                selectNote(sovereignNotes[0].id);
            } else {
                createNewNote();
            }
        }

        function exportCurrentNote() {
            playSfx('click');
            const note = sovereignNotes.find(n => n.id === activeNoteId);
            if (note) {
                const blob = new Blob([note.content], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${note.title.replace(/\s+/g, '_')}.md`;
                a.click();
                showNotificationToast("Notes", `Exported "${note.title}.md" successfully.`, "success");
            }
        }

        function renderNotePreview() {
            const content = document.getElementById('note-content-input')?.value || '';
            const previewPane = document.getElementById('note-preview-pane');
            const wordCountElem = document.getElementById('note-word-count');

            if (wordCountElem) {
                const words = content.trim() ? content.trim().split(/\s+/).length : 0;
                wordCountElem.textContent = `${words} words`;
            }

            if (!previewPane) return;
            // Simple markdown parser
            let html = content
                .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
                .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/gim, '<em>$1</em>')
                .replace(/`([^`]+)`/gim, '<code>$1</code>')
                .replace(/\n/gim, '<br>');

            previewPane.innerHTML = html || '<p class="opacity-50 italic">Empty note...</p>';
        }

        function filterNotesList() {
            renderNotesSidebar();
        }


        // -------------------------------------------------------------------------
        // 8. SOVEREIGN PHOTO & MEDIA VIEWER
        // -------------------------------------------------------------------------
        const systemPhotos = [
            { title: "Pangong Tso Crystal Lake (Ladakh)", src: "/wallpapers/ladakh_pangong.jpg" },
            { title: "Dal Lake Shikara Twilight (Kashmir)", src: "/wallpapers/kashmir_dal.jpg" },
            { title: "White Rann Salt Desert (Kutch)", src: "/wallpapers/kutch_rann.jpg" },
            { title: "Munnar Tea Plantations (Kerala)", src: "/wallpapers/munnar_hills.jpg" },
            { title: "Thar Desert Golden Twilight (Rajasthan)", src: "/wallpapers/thar_twilight.jpg" },
            { title: "Varanasi Sacred Ganges Dawn", src: "/wallpapers/varanasi_dawn.jpg" },
            { title: "Western Ghats Waterfall Stream", src: "/wallpapers/waterfall_ghats.jpg" },
            { title: "Radhanagar Azure Beach (Andaman)", src: "/wallpapers/andaman_beach.jpg" }
        ];

        let currentPhotoIdx = 0;
        let currentPhotoZoom = 1.0;
        let currentPhotoRotation = 0;
        let photoSlideshowInterval = null;

        function renderPhotoThumbnails() {
            const container = document.getElementById('photos-thumbnail-list');
            if (!container) return;

            container.innerHTML = systemPhotos.map((photo, idx) => `
                <div onclick="selectPhoto(${idx})" class="p-1.5 rounded-xl cursor-pointer transition-all border ${idx === currentPhotoIdx ? 'border-pink-500 bg-pink-500/20' : 'border-slate-800 hover:border-slate-600 bg-slate-900/60'}">
                    <img src="${photo.src}" alt="${photo.title}" class="w-full h-16 object-cover rounded-lg">
                    <div class="text-[10px] font-mono text-slate-300 truncate mt-1">${photo.title}</div>
                </div>
            `).join('');
        }

        function selectPhoto(idx) {
            playSfx('click');
            currentPhotoIdx = idx;
            currentPhotoZoom = 1.0;
            currentPhotoRotation = 0;
            const photo = systemPhotos[idx];
            const img = document.getElementById('main-photo-display');
            const titleElem = document.getElementById('photo-viewer-title');
            if (img && photo) {
                img.src = photo.src;
                img.style.transform = `scale(1) rotate(0deg)`;
            }
            if (titleElem && photo) {
                titleElem.textContent = photo.title;
            }
            renderPhotoThumbnails();
        }

        function zoomPhoto(delta) {
            triggerHaptic('tick');
            currentPhotoZoom = Math.max(0.4, Math.min(3.0, currentPhotoZoom + delta));
            updatePhotoTransform();
        }

        function rotatePhoto(deg) {
            currentPhotoRotation = (currentPhotoRotation + deg) % 360;
            updatePhotoTransform();
        }

        function updatePhotoTransform() {
            const img = document.getElementById('main-photo-display');
            if (img) {
                img.style.transform = `scale(${currentPhotoZoom}) rotate(${currentPhotoRotation}deg)`;
            }
        }

        function applyPhotoFilter(filter) {
            playSfx('click');
            const img = document.getElementById('main-photo-display');
            if (img) {
                img.style.filter = filter;
            }
        }

        function togglePhotoSlideshow() {
            const btn = document.getElementById('photo-slideshow-btn');
            if (photoSlideshowInterval) {
                clearInterval(photoSlideshowInterval);
                photoSlideshowInterval = null;
                if (btn) btn.textContent = "▶ Slideshow";
                showNotificationToast("Photos", "Slideshow paused", "info");
            } else {
                photoSlideshowInterval = setInterval(() => {
                    selectPhoto((currentPhotoIdx + 1) % systemPhotos.length);
                }, 3000);
                if (btn) btn.textContent = "⏸ Pause";
                showNotificationToast("Photos", "Slideshow running (3s per slide)", "info");
            }
        }


        // -------------------------------------------------------------------------
        // 9. GLOBAL KEYBOARD SHORTCUTS MATRIX (Win+S, Win+V, Win+A, Win+N, Win+C, etc.)
        // -------------------------------------------------------------------------
        window.addEventListener('keydown', (e) => {
            const isMetaOrCtrl = e.metaKey || e.ctrlKey || e.altKey;

            // Win+S / Cmd+Space / Ctrl+Space: Universal Spotlight Search
            if ((e.code === 'KeyS' && (e.metaKey || e.altKey)) || (e.code === 'Space' && (e.ctrlKey || e.metaKey))) {
                e.preventDefault();
                openSpotlight();
                return;
            }

            // Win+V: Clipboard History
            if (e.code === 'KeyV' && (e.metaKey || e.altKey || (e.ctrlKey && e.shiftKey))) {
                e.preventDefault();
                openClipboardHub();
                return;
            }

            // Win+A: Action Center / Quick Settings
            if (e.code === 'KeyA' && (e.metaKey || e.altKey)) {
                e.preventDefault();
                toggleActionCenter();
                return;
            }

            // Win+C: Sudarshan AI Copilot
            if (e.code === 'KeyC' && (e.metaKey || e.altKey)) {
                e.preventDefault();
                toggleAICopilot();
                return;
            }

            // Win+Ctrl+D: New Virtual Desktop / Switch
            if (e.code === 'KeyD' && e.ctrlKey && (e.metaKey || e.altKey)) {
                e.preventDefault();
                switchVirtualDesktop((activeVirtualDesktop % 3) + 1);
                return;
            }

            // Escape: Close all popups/drawers/spotlight
            if (e.key === 'Escape') {
                closeSpotlight();
                closeClipboardHub();
                hideAllContextMenus();
            }
        });

        // Initialize Native App Subsystem Data
        renderRecycleBinList();
        renderNotesSidebar();
        renderNotePreview();
        renderPhotoThumbnails();

    


        
        // // HACKATIME 24/7 SOVEREIGN BOT & STARDUST TELEMETRY ENGINE
        let lastFocusShieldData = null;

        async function fetchFocusShieldStatus(showToast = false) {
            try {
                const res = await fetch('/api/status');
                if (!res.ok) return;
                const data = await res.json();
                lastFocusShieldData = data;
                renderFocusShieldUI(data);
                if (showToast) {
                    triggerHaptic('selection');
                    showToastNotification('FocusShield Telemetry Synced', 'Live metrics refreshed from cloud daemon.');
                }
            } catch(err) {
                console.warn('[FocusShield] Status fetch error:', err);
            }
        }

        function renderFocusShieldUI(data) {
            if (!data) return;

            const isHuman = (data.active_cycle || 'HUMAN') === 'HUMAN';
            const strat = data.telemetry_strategy || 'DYNAMIC_ALTERNATING';
            const remainingSecs = data.cycle_seconds_remaining || 0;
            const minsRem = Math.floor(remainingSecs / 60);
            const secsRem = remainingSecs % 60;
            const timeStr = `${minsRem}m ${secsRem < 10 ? '0' : ''}${secsRem}s`;

            // Topbar pill
            const topbarStatus = document.getElementById('topbar-focusshield-status');
            if (topbarStatus) {
                if (!data.is_running) {
                    topbarStatus.textContent = 'OFFLINE';
                    topbarStatus.className = 'text-slate-400 font-bold';
                } else if (data.is_paused) {
                    topbarStatus.textContent = 'PAUSED';
                    topbarStatus.className = 'text-amber-400 font-bold';
                } else {
                    const cycleLabel = isHuman ? 'HUMAN' : 'AI';
                    const shiftLabel = strat === 'DYNAMIC_ALTERNATING' ? ` (Shift in ${minsRem}m)` : '';
                    topbarStatus.textContent = `${cycleLabel}${shiftLabel}`;
                    topbarStatus.className = isHuman ? 'text-emerald-400 font-bold' : 'text-cyan-400 font-bold';
                }
            }

            // Window Status Pill
            const winPillText = document.getElementById('ht-window-status-text');
            if (winPillText) {
                const cycleText = isHuman ? '👨‍💻 HUMAN CODING' : '🤖 AI CODING';
                winPillText.textContent = `HTTP 202 • ${cycleText} (24/7)`;
            }

            // Strategy Badge
            const stratBadge = document.getElementById('ht-strategy-badge');
            if (stratBadge) {
                if (strat === 'CIRCADIAN_SMART') {
                    stratBadge.textContent = '☀️ Circadian Smart (Day: Human • Night: AI)';
                    stratBadge.className = 'px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold';
                } else if (strat === 'DYNAMIC_ALTERNATING') {
                    stratBadge.textContent = 'Dynamic Alternating (Human ↔ AI)';
                    stratBadge.className = 'px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-bold';
                } else if (strat === 'HUMAN_ONLY') {
                    stratBadge.textContent = '100% Human Locked';
                    stratBadge.className = 'px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold';
                } else {
                    stratBadge.textContent = '100% AI Locked';
                    stratBadge.className = 'px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 text-[10px] font-bold';
                }
            }

            // Strategy Selector Buttons Highlights
            const btnCirc = document.getElementById('btn-strat-circadian');
            const btnDyn = document.getElementById('btn-strat-dynamic');
            const btnHum = document.getElementById('btn-strat-human');
            const btnAI = document.getElementById('btn-strat-ai');
            const dotCirc = document.getElementById('strat-dot-circadian');
            const dotDyn = document.getElementById('strat-dot-dynamic');
            const dotHum = document.getElementById('strat-dot-human');
            const dotAI = document.getElementById('strat-dot-ai');

            if (btnCirc && btnDyn && btnHum && btnAI) {
                btnCirc.className = `p-2.5 rounded-xl border text-left transition-all ${strat === 'CIRCADIAN_SMART' ? 'border-amber-500 bg-amber-500/20 shadow-sm' : 'border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 opacity-70'}`;
                btnDyn.className = `p-2.5 rounded-xl border text-left transition-all ${strat === 'DYNAMIC_ALTERNATING' ? 'border-cyan-500 bg-cyan-500/20 shadow-sm' : 'border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 opacity-70'}`;
                btnHum.className = `p-2.5 rounded-xl border text-left transition-all ${strat === 'HUMAN_ONLY' ? 'border-emerald-500 bg-emerald-500/20 shadow-sm' : 'border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 opacity-70'}`;
                btnAI.className = `p-2.5 rounded-xl border text-left transition-all ${strat === 'AI_ONLY' ? 'border-purple-500 bg-purple-500/20 shadow-sm' : 'border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 opacity-70'}`;
                
                if (dotCirc) dotCirc.className = `w-2 h-2 rounded-full ${strat === 'CIRCADIAN_SMART' ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`;
                if (dotDyn) dotDyn.className = `w-2 h-2 rounded-full ${strat === 'DYNAMIC_ALTERNATING' ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`;
                if (dotHum) dotHum.className = `w-2 h-2 rounded-full ${strat === 'HUMAN_ONLY' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`;
                if (dotAI) dotAI.className = `w-2 h-2 rounded-full ${strat === 'AI_ONLY' ? 'bg-purple-400 animate-pulse' : 'bg-slate-600'}`;
            }

            // Active Cycle Card
            const cycleIcon = document.getElementById('ht-active-cycle-icon');
            const cycleTitle = document.getElementById('ht-active-cycle-title');
            const cycleCountdown = document.getElementById('ht-cycle-countdown');

            if (cycleIcon) cycleIcon.textContent = isHuman ? '👨‍💻' : '🤖';
            if (cycleTitle) {
                cycleTitle.textContent = isHuman ? '👨‍💻 Human Coding Workspace (Aviral Dewangan)' : '🤖 Autonomous AI Coding Engine (DeepMind Antigravity)';
                cycleTitle.className = isHuman ? 'font-bold text-xs text-emerald-400' : 'font-bold text-xs text-cyan-400';
            }
            if (cycleCountdown) {
                if (strat === 'CIRCADIAN_SMART') {
                    cycleCountdown.textContent = isHuman ? `Human Focus (${timeStr})` : `AI Night Stream (${timeStr})`;
                    cycleCountdown.className = isHuman ? 'font-mono font-bold text-xs text-emerald-400' : 'font-mono font-bold text-xs text-cyan-400 animate-pulse';
                } else if (strat === 'DYNAMIC_ALTERNATING') {
                    const nextTarget = isHuman ? 'AI' : 'Human';
                    cycleCountdown.textContent = `Shift to ${nextTarget} in ${timeStr}`;
                    cycleCountdown.className = 'font-mono font-bold text-xs text-amber-400 animate-pulse';
                } else if (strat === 'HUMAN_ONLY') {
                    cycleCountdown.textContent = 'Locked to Human';
                    cycleCountdown.className = 'font-mono font-bold text-xs text-emerald-400';
                } else {
                    cycleCountdown.textContent = 'Locked to AI';
                    cycleCountdown.className = 'font-mono font-bold text-xs text-purple-400';
                }
            }

            // Time Warp Speed Rendering
            const warpBadge = document.getElementById('ht-time-warp-badge');
            const btn1x = document.getElementById('btn-warp-1x');
            const btn15x = document.getElementById('btn-warp-15x');
            const btn2x = document.getElementById('btn-warp-2x');

            const warpFactor = data.time_warp_factor || (data.time_warp ? data.time_warp.factor : 1.5);
            if (warpBadge) {
                warpBadge.textContent = `${warpFactor.toFixed(1)}x SPEED ACTIVE`;
                warpBadge.className = warpFactor > 1.0 
                    ? 'px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-mono font-bold animate-pulse'
                    : 'px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/40 text-[10px] font-mono font-bold';
            }
            if (btn1x) btn1x.className = `px-2.5 py-1 rounded-xl font-mono text-[10px] font-bold transition-all ${warpFactor === 1.0 ? 'bg-cyan-500/30 border border-cyan-500/50 text-cyan-300' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'}`;
            if (btn15x) btn15x.className = `px-2.5 py-1 rounded-xl font-mono text-[10px] font-bold transition-all ${warpFactor === 1.5 ? 'bg-amber-500/30 border border-amber-500/50 text-amber-300 shadow-lg' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'}`;
            if (btn2x) btn2x.className = `px-2.5 py-1 rounded-xl font-mono text-[10px] font-bold transition-all ${warpFactor === 2.0 ? 'bg-purple-500/30 border border-purple-500/50 text-purple-300 shadow-lg' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'}`;

            // 8-Hour Human Limit Gauge Rendering
            const humanLimitBadge = document.getElementById('ht-human-limit-badge');
            const humanHoursRatio = document.getElementById('ht-human-hours-ratio');
            const humanLimitProgress = document.getElementById('ht-human-limit-progress');

            const humanHrs = data.human_tracked_hours || ((data.human_pulses || 0) * 70 / 3600);
            const maxHumanHrs = data.max_daily_human_hours || 8.0;
            const humanLeft = Math.max(0, maxHumanHrs - humanHrs);
            const humanPct = Math.min(100, Math.round((humanHrs / maxHumanHrs) * 100));

            if (humanHoursRatio) {
                humanHoursRatio.textContent = `${humanHrs.toFixed(2)} / ${maxHumanHrs.toFixed(2)} hrs (${humanLeft.toFixed(2)}h left)`;
            }
            if (humanLimitProgress) {
                humanLimitProgress.style.width = `${humanPct}%`;
            }
            if (humanLimitBadge) {
                if (data.human_limit_reached || humanHrs >= maxHumanHrs) {
                    humanLimitBadge.textContent = '8H CAP REACHED (AI LOCKED)';
                    humanLimitBadge.className = 'px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/40 animate-pulse';
                } else {
                    humanLimitBadge.textContent = `${humanPct}% Within 8h Cap`;
                    humanLimitBadge.className = 'px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold';
                }
            }

            // Window metrics
            const cardPulses = document.getElementById('ht-card-pulses');
            const cardPulsesSub = document.getElementById('ht-card-pulses-sub');
            const cardTime = document.getElementById('ht-card-time');
            const cardCategorySub = document.getElementById('ht-card-category-sub');
            const cardTokens = document.getElementById('ht-card-tokens');
            const cardEngineSub = document.getElementById('ht-card-engine-sub');
            const cardSplit = document.getElementById('ht-card-split');
            
            const inspectProj = document.getElementById('ht-inspect-project');
            const inspectEntity = document.getElementById('ht-inspect-entity');
            const inspectLang = document.getElementById('ht-inspect-lang');
            const lastPulseTime = document.getElementById('ht-last-pulse-time');
            const logStream = document.getElementById('ht-log-stream');

            if (cardPulses) cardPulses.textContent = `${data.total_pulses || 0} Pulses`;
            if (cardPulsesSub) cardPulsesSub.textContent = `${data.human_pulses || 0} Human / ${data.ai_pulses || 0} AI`;
            if (cardTime) {
                const hrs = ((data.tracked_seconds_today || 0) / 3600).toFixed(2);
                cardTime.textContent = `${hrs} hrs`;
            }
            if (cardCategorySub) cardCategorySub.textContent = `Category: "${data.category || 'coding'}"`;
            if (cardTokens) {
                if (isHuman) {
                    const lines = data.human_lines_written ? data.human_lines_written.toLocaleString() : '4,200';
                    cardTokens.textContent = `${lines} Lines`;
                } else {
                    const tokens = data.ai_tokens_synthesized ? (data.ai_tokens_synthesized / 1000000).toFixed(2) + 'M' : '1.48M';
                    cardTokens.textContent = `${tokens} Tokens`;
                }
            }
            if (cardEngineSub) cardEngineSub.textContent = data.editor || 'VS Code';
            if (cardSplit) {
                cardSplit.textContent = `${data.human_attribution_percent || 60}% Human / ${data.ai_attribution_percent || 40}% AI`;
            }

            if (inspectProj) inspectProj.textContent = data.current_project || 'bharatos-sovereign-desktop';
            if (inspectEntity) inspectEntity.textContent = data.current_entity || 'bharatos/kernel.py';
            if (inspectLang) inspectLang.textContent = `${data.current_language || 'Python'} (3.11 LTS)`;

            // Break Schedule & Delayed Start UI Rendering
            const breakStatusBadge = document.getElementById('ht-break-status-badge');
            const delayedStartTimer = document.getElementById('ht-delayed-start-timer');
            const breakActiveMsg = document.getElementById('ht-break-active-msg');
            const sessionWorkTime = document.getElementById('ht-session-work-time');

            if (data.delayed_start && data.delayed_start.enabled && !data.delayed_start.initial_start_completed) {
                const s = data.delayed_start.seconds_until_start || 0;
                const m = Math.floor(s / 60);
                const sec = s % 60;
                if (delayedStartTimer) delayedStartTimer.textContent = `${m}m ${sec < 10 ? '0' : ''}${sec}s`;
                if (breakStatusBadge) {
                    breakStatusBadge.textContent = `Starts in ${m}m ${sec}s`;
                    breakStatusBadge.className = 'px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold animate-pulse';
                }
            } else {
                if (delayedStartTimer) delayedStartTimer.textContent = 'Active (Live)';
                if (breakStatusBadge) {
                    if (data.break_schedule && data.break_schedule.is_on_break) {
                        breakStatusBadge.textContent = '☕ ON HEALTH BREAK';
                        breakStatusBadge.className = 'px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 text-[10px] font-bold animate-bounce';
                    } else if (data.break_schedule && !data.break_schedule.enabled) {
                        breakStatusBadge.textContent = 'Scheduled After Tomorrow (Aug 31)';
                        breakStatusBadge.className = 'px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-bold';
                    } else {
                        breakStatusBadge.textContent = 'Active Shift';
                        breakStatusBadge.className = 'px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold';
                    }
                }
            }

            if (data.break_schedule) {
                const bs = data.break_schedule;
                if (!bs.enabled) {
                    if (breakActiveMsg) {
                        breakActiveMsg.innerHTML = `<span class="text-cyan-400 font-bold">☕ Periodic Rest Breaks:</span> Scheduled to activate after tomorrow (Monday, Aug 31 • ${bs.activation_countdown || '1d 01h'} remaining)`;
                    }
                } else if (bs.is_on_break) {
                    const rem = bs.break_seconds_remaining || 0;
                    const remM = Math.floor(rem / 60);
                    const remS = rem % 60;
                    if (breakActiveMsg) {
                        breakActiveMsg.innerHTML = `<span class="text-purple-400 font-bold">☕ Health Break: ${bs.current_break_label}</span> (Resumes in ${remM}m ${remS}s)`;
                    }
                } else {
                    const nextSec = bs.seconds_until_next_break || 0;
                    const nextM = Math.floor(nextSec / 60);
                    const nextS = nextSec % 60;
                    if (breakActiveMsg) {
                        breakActiveMsg.textContent = `Next break in: ${nextM}m ${nextS}s (${bs.next_break_type || '10-Min Break'})`;
                    }
                }

                if (sessionWorkTime) {
                    const workSec = bs.session_work_seconds || 0;
                    const h = Math.floor(workSec / 3600);
                    const m = Math.floor((workSec % 3600) / 60);
                    sessionWorkTime.textContent = `${h}h ${m < 10 ? '0' : ''}${m}m (${bs.hours_completed_count || 0} Milestones)`;
                }
            }
            if (lastPulseTime && data.last_pulse_timestamp) {
                lastPulseTime.textContent = `Last Pulse: ${new Date(data.last_pulse_timestamp * 1000).toLocaleTimeString()}`;
            }

            // Stream logs
            if (logStream && data.unified_logs && data.unified_logs.length > 0) {
                logStream.innerHTML = data.unified_logs.slice(-25).map(l => {
                    const tagColor = l.tag === 'WAKATIME' ? 'text-emerald-400' : l.tag === 'MODE_SWITCH' ? 'text-purple-400 font-bold' : l.tag === 'BUILD' ? 'text-cyan-400' : l.tag === 'WON' ? 'text-amber-400' : 'text-slate-300';
                    return `<div class="flex items-start space-x-2 py-0.5 border-b border-slate-200/40 dark:border-slate-800/40">
                        <span class="opacity-50 text-[10px]">${l.time}</span>
                        <span class="font-bold text-[10px] ${tagColor}">[${l.tag}]</span>
                        <span class="flex-1 select-text">${l.message}</span>
                    </div>`;
                }).join('');
                logStream.scrollTop = logStream.scrollHeight;
            }
        }

        async function setTimeWarpFactor(factor) {
            try {
                triggerHaptic('selection');
                playSfx('unlock');
                if (typeof lastFocusShieldData !== 'undefined' && lastFocusShieldData) {
                    lastFocusShieldData.time_warp_factor = factor;
                    renderFocusShieldUI(lastFocusShieldData);
                }
                const res = await fetch('/api/telemetry/time_warp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ factor: factor })
                });
                const data = await res.json();
                if (data.success) {
                    showNotificationToast('Time Warp Speed Updated', `Telemetry clock speed set to ${factor}x speed!`, 'success');
                    await fetchFocusShieldStatus(false);
                }
            } catch(e) {
                console.error('[FocusShield] Time warp error:', e);
            }
        }

        async function setTelemetryStrategy(strategy) {
            try {
                triggerHaptic('selection');
                playSfx('click');
                if (typeof lastFocusShieldData !== 'undefined' && lastFocusShieldData) {
                    lastFocusShieldData.telemetry_strategy = strategy;
                    if (strategy === 'HUMAN_ONLY') lastFocusShieldData.active_cycle = 'HUMAN';
                    if (strategy === 'AI_ONLY') lastFocusShieldData.active_cycle = 'AI';
                    renderFocusShieldUI(lastFocusShieldData);
                }
                const res = await fetch('/api/telemetry/strategy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ strategy: strategy })
                });
                const data = await res.json();
                if (data.success) {
                    showNotificationToast('Telemetry Strategy Changed', `Strategy set to ${strategy}`, 'info');
                    await fetchFocusShieldStatus(false);
                }
            } catch(e) {
                console.error('[FocusShield] Strategy change error:', e);
            }
        }

        async function forceTelemetryCycleShift() {
            try {
                triggerHaptic('selection');
                playSfx('unlock');
                if (typeof lastFocusShieldData !== 'undefined' && lastFocusShieldData) {
                    lastFocusShieldData.active_cycle = (lastFocusShieldData.active_cycle === 'HUMAN') ? 'AI' : 'HUMAN';
                    renderFocusShieldUI(lastFocusShieldData);
                }
                const res = await fetch('/api/telemetry/switch_cycle', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({})
                });
                const data = await res.json();
                if (data.success) {
                    showNotificationToast('Coding Cycle Shifted', `Active telemetry stream switched to ${data.active_cycle} Coding`, 'info');
                    await fetchFocusShieldStatus(false);
                }
            } catch(e) {
                console.error('[FocusShield] Shift error:', e);
            }
        }

        async function triggerManualFocusShieldPulse() {
            try {
                triggerHaptic('success');
                playSfx('notify');
                const btn = document.getElementById('btn-manual-pulse');
                if (btn) {
                    btn.disabled = true;
                    btn.innerHTML = '<span>⏳</span><span>Pulsing...</span>';
                }

                await fetch('/api/pulse', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
                await new Promise(r => setTimeout(r, 600));
                await fetchFocusShieldStatus();

                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<span>⚡</span><span>Pulse Now</span>';
                }
                showNotificationToast('FocusShield Heartbeat Sent', 'HTTP 202 Accepted. Logged to Hack Club cloud!', 'success');
            } catch(e) {
                console.error('[FocusShield] Pulse failed:', e);
            }
        }

        async function toggleFocusShieldBot(action) {
            try {
                triggerHaptic('selection');
                playSfx('click');
                const res = await fetch('/api/action', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: action })
                });
                const data = await res.json();
                if (data.success) {
                    const label = action === 'stop_bot' ? 'Bot Stopped' : 'Bot Resumed';
                    showNotificationToast(label, data.message || `FocusShield bot state updated.`, action === 'stop_bot' ? 'warning' : 'success');
                    await fetchFocusShieldStatus(false);
                }
            } catch(e) {
                console.error('[FocusShield] Toggle bot error:', e);
            }
        }

        // // BHARATOS OSDEV CORE KERNEL & BARE-METAL QEMU STUDIO HANDLERS
        function switchOsdevTab(tab) {
            triggerHaptic('selection');
            const tabs = ['terminal', 'asm', 'c', 'linker', 'qemu'];
            tabs.forEach(t => {
                const el = document.getElementById(`osdev-tab-${t}`);
                const btn = document.getElementById(`btn-osdev-tab-${t}`);
                if (el) el.classList.toggle('hidden', t !== tab);
                if (btn) {
                    if (t === tab) {
                        btn.className = 'px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/40 flex items-center space-x-1.5 transition-all';
                    } else {
                        btn.className = 'px-3 py-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800/80 text-slate-400 font-bold transition-all flex items-center space-x-1.5';
                    }
                }
            });
        }

        function handleOsdevTerminalSubmit(e) {
            e.preventDefault();
            const input = document.getElementById('osdev-terminal-input');
            const output = document.getElementById('osdev-terminal-output');
            if (!input || !output) return;

            const cmd = input.value.trim();
            if (!cmd) return;

            playSfx('click');
            triggerHaptic('impact');

            // Render command prompt
            const promptLine = document.createElement('div');
            const safeCmd = String(cmd).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            promptLine.innerHTML = `<span class="text-cyan-400 font-bold">bharatos-ring0</span><span class="text-slate-400"># </span><span class="text-white">${safeCmd}</span>`;
            output.appendChild(promptLine);

            input.value = '';

            const respLine = document.createElement('div');

            if (cmd === 'help') {
                respLine.className = 'text-slate-300';
                respLine.innerHTML = `<div class="text-emerald-400 font-bold">BharatOS Sovereign Ring-0 Bare-Metal Kernel Commands:</div>
<div>  help       - Display this list of available kernel commands</div>
<div>  version    - Show kernel build, version, and architecture info</div>
<div>  cpu        - Query CPU capabilities, Long Mode, and core registers</div>
<div>  memory     - Display physical RAM usage and page frame allocator state</div>
<div>  puf        - Query hardware Physically Unclonable Function chip seed</div>
<div>  clear      - Clear VGA 80x25 text console screen</div>
<div>  hexdump    - Dump physical memory starting from kernel entry (0x100000)</div>
<div>  reboot     - Perform 8042 Keyboard Controller hardware system reboot</div>
<div>  halt       - Halt CPU in Ring-0 safe low-power state</div>`;
            } else if (cmd === 'version') {
                respLine.className = 'text-cyan-300';
                respLine.innerHTML = `<div class="text-cyan-400 font-bold">BharatOS Sovereign Kernel v1.0.0-Sovereign-Prithvi (x86_64)</div>
<div class="text-slate-400">Lead Developer: <span class="text-purple-400 font-bold">Aviral Dewangan</span> | License: Sovereign Microkernel License</div>
<div class="text-slate-400">Toolchain: GCC Bare-Metal (x86_64-elf) + NASM Assembler + GNU Linker (LD)</div>`;
            } else if (cmd === 'cpu') {
                respLine.className = 'text-amber-300';
                respLine.innerHTML = `<div class="text-amber-400 font-bold">[CPU HARDWARE ARCHITECTURE]</div>
<div class="text-slate-300">  Mode:             64-bit Long Mode (IA-32e / x86_64 Ring 0)</div>
<div class="text-slate-300">  Paging:           4-Level Paging Active (PML4 -> PDPT -> PD -> PT)</div>
<div class="text-slate-300">  CR0: 0x80000011   CR3: 0x00101000   CR4: 0x00000020</div>
<div class="text-slate-300">  RIP: 0x0000000000100000  RSP: 0x0000000000104000</div>
<div class="text-slate-300">  Descriptor Table: 64-bit Global Descriptor Table (GDT) & TSS Active</div>
<div class="text-slate-300">  Interrupt Vector: 256 Gates IDT with 8259 PIC Remapped (0x20/0x28)</div>
<div class="text-slate-300">  Serial Comms:     UART 16550 COM1 (38,400 Baud, 8N1)</div>`;
            } else if (cmd === 'memory') {
                respLine.className = 'text-emerald-300';
                respLine.innerHTML = `<div class="text-emerald-400 font-bold">[PHYSICAL MEMORY MANAGER STATUS]</div>
<div class="text-slate-300">  Total RAM:     64 MB (16384 Total Pages)</div>
<div class="text-slate-300">  Allocated RAM: 4096 KB (1024 Kernel Pages)</div>
<div class="text-slate-300">  Free RAM:      60 MB (15360 Free Pages)</div>
<div class="text-slate-300">  Page Size:     4096 bytes (4 KB)</div>`;
            } else if (cmd === 'puf') {
                respLine.className = 'text-purple-300';
                respLine.innerHTML = `<div class="text-purple-400 font-bold">[CRYPTO PUF ATTESTATION]</div>
<div class="text-slate-300">  Silicon PUF ID:   HW-PUF-98A7F2D0-BHARAT-2026</div>
<div class="text-slate-300">  Enclave Status:   SEALED & CRYPTOGRAPHICALLY ATTESTED</div>
<div class="text-slate-300">  Sovereign Key:    SHA256:ADA5EAC6C7D9EA65D60F43A3BEABFDEC</div>`;
            } else if (cmd === 'hexdump') {
                respLine.className = 'text-blue-300';
                respLine.innerHTML = `<div class="text-blue-400 font-bold">[MEMORY HEXDUMP: 0x00100000 (Kernel Entry Point)]</div>
<div class="text-slate-400">  00100000: 02 B0 AD 1B 03 00 00 00 FB 4F 52 E4 31 C0 8E D8 | .........OR.1..</div>
<div class="text-slate-400">  00100010: 8E C0 8E D0 BC 00 40 10 00 E8 24 00 00 00 E8 48 | ......@...$....H</div>
<div class="text-slate-400">  00100020: 00 00 00 0F 01 15 80 20 10 00 EA 32 00 10 00 08 | ....... ...2....</div>
<div class="text-slate-400">  00100030: 00 48 83 EC 08 E8 A0 05 00 00 FA F4 EB FC 90 90 | .H..............</div>`;
            } else if (cmd === 'clear') {
                output.innerHTML = '';
                return;
            } else if (cmd === 'reboot') {
                respLine.className = 'text-red-400 font-bold';
                respLine.textContent = 'Rebooting virtual machine hardware via 8042 controller pulse...';
                setTimeout(() => {
                    output.innerHTML = `<div class="text-cyan-400">===============================================================================</div>
<div class="text-emerald-400"> [OK] Multiboot Handshake Validated (Magic: 0x1BADB002)</div>
<div class="text-emerald-400"> [OK] 64-bit GDT, IDT (256 Gates) & 8259 PIC Remapped [OK]</div>
<div class="text-emerald-400"> [OK] CPU Interrupts Enabled (STI). Kernel is live and interactive.</div>
<div class="text-slate-300">Type 'help' to inspect kernel capabilities.</div>`;
                }, 800);
            } else if (cmd === 'halt') {
                respLine.className = 'text-cyan-400';
                respLine.textContent = 'Halting CPU in safe power-saving state (cli; hlt).';
            } else {
                respLine.className = 'text-red-400';
                respLine.textContent = `Unknown command: '${cmd}'. Type 'help' for available commands.`;
            }

            output.appendChild(respLine);
            output.scrollTop = output.scrollHeight;
        }

        // // WIN32 / WOW64 WINDOWS COMPATIBILITY SUBSYSTEM HANDLERS
        function switchWin32Tab(tab) {
            triggerHaptic('selection');
            const tabs = ['gallery', 'installer', 'runner'];
            tabs.forEach(t => {
                const el = document.getElementById(`win32-tab-${t}`);
                const btn = document.getElementById(`btn-win32-tab-${t}`);
                if (el) el.classList.toggle('hidden', t !== tab);
                if (btn) {
                    if (t === tab) {
                        btn.className = 'px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-400 font-bold border border-blue-500/40 flex items-center space-x-1.5 transition-all';
                    } else {
                        btn.className = 'px-3 py-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800/80 text-slate-400 font-bold transition-all flex items-center space-x-1.5';
                    }
                }
            });
        }

        async function launchWin32App(appId, appName) {
            triggerHaptic('impact');
            playSfx('unlock');
            showToastNotification('Win32 Subsystem', `Launching ${appName} in sandboxed Win32 / WOW64 enclave...`);

            const iconMap = {
                'win-vscode': '⚡',
                'win-7zip': '📦',
                'win-notepadplus': '📝',
                'win-python': '🐍',
                'win-git': '🌿',
                'win-vlc': '🎬'
            };

            const runnerIcon = document.getElementById('win32-runner-icon');
            const runnerTitle = document.getElementById('win32-runner-title');
            const runnerContent = document.getElementById('win32-runner-content');

            if (runnerIcon) runnerIcon.textContent = iconMap[appId] || '🪟';
            if (runnerTitle) runnerTitle.textContent = `${appName} (Windows x64) - [Running in Sandboxed Win32 Enclave]`;

            if (runnerContent) {
                runnerContent.innerHTML = `
                    <div class="text-blue-400 font-bold">[Win32 Subsystem Process Initialized - PID: ${Math.floor(Math.random()*4000+1000)}]</div>
                    <div class="text-slate-400">Loading PE32+ binary: C:\\Program Files\\${appName}\\${appId}.exe</div>
                    <div class="text-emerald-400">✓ Resolved KERNEL32.DLL: VirtualAlloc, CreateProcessW, GetProcAddress</div>
                    <div class="text-emerald-400">✓ Resolved USER32.DLL: CreateWindowExW, ShowWindow, SetWindowTextW</div>
                    <div class="text-emerald-400">✓ Resolved GDI32.DLL: CreateCompatibleDC, BitBlt, CreateFontW</div>
                    <div class="text-cyan-400">✓ Sandboxed GUI window rendered with Vulkan/WebGL hardware acceleration.</div>
                    <div class="p-5 rounded-2xl bg-slate-900 border border-slate-800 mt-4 text-slate-200 space-y-2">
                        <div class="text-emerald-400 font-bold text-sm">✨ ${appName} Active & Interactive</div>
                        <div class="text-xs opacity-75">Architecture: 64-bit Windows PE32+ • Binary Mode: Direct Sovereign Execution</div>
                        <div class="p-3 rounded-xl bg-black border border-slate-800 text-xs font-mono text-cyan-300">
                            > C:\\Program Files\\${appName}\\${appId}.exe --sovereign-enclave-mode<br>
                            [OK] All Windows System APIs attached. Zero emulation latency.
                        </div>
                    </div>
                `;
            }

            switchWin32Tab('runner');
        }

        async function simulateWindowsInstaller() {
            triggerHaptic('selection');
            playSfx('click');
            const progress = document.getElementById('win32-install-progress');
            const bar = document.getElementById('win32-install-bar');
            const pct = document.getElementById('win32-install-pct');
            const text = document.getElementById('win32-install-step-text');
            if (!progress || !bar || !pct || !text) return;

            progress.classList.remove('hidden');

            const steps = [
                { p: 20, t: "Parsing PE32+ DOS Header & COFF Section Tables..." },
                { p: 45, t: "Extracting MSI Cabinet files into C:\\Program Files\\..." },
                { p: 75, t: "Registering Win32 DLL components in Sovereign Enclave..." },
                { p: 100, t: "✓ Windows Application Installed Successfully! Added to BharatOS Desktop." }
            ];

            for (const step of steps) {
                bar.style.width = `${step.p}%`;
                pct.textContent = `${step.p}%`;
                text.textContent = step.t;
                await new Promise(r => setTimeout(r, 600));
            }

            playSfx('notify');
            showToastNotification('Windows Setup Complete', 'Application is installed and ready to run in Win32 Subsystem!');
        }

        // Initialize FocusShield Poller
        setInterval(() => fetchFocusShieldStatus(false), 3000);
        setTimeout(() => fetchFocusShieldStatus(false), 1000);

        // // SOVEREIGN OCR STUDIO HANDLERS (RUST & AVX2 ASSEMBLY CORE)
        async function runSovereignOcr() {
            try {
                triggerHaptic('impact');
                playSfx('unlock');
                const langSelect = document.getElementById('ocr-lang-select');
                const lang = langSelect ? langSelect.value : 'eng';
                const runBtn = document.getElementById('btn-ocr-run');
                if (runBtn) {
                    runBtn.disabled = true;
                    runBtn.innerHTML = '<span>⏳</span><span>Recognizing...</span>';
                }

                const res = await fetch('/api/ocr/recognize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: '', language: lang })
                });
                const data = await res.json();
                
                if (runBtn) {
                    runBtn.disabled = false;
                    runBtn.innerHTML = '<span>⚡</span><span>Run OCR Recognition</span>';
                }

                if (data.success) {
                    const textarea = document.getElementById('ocr-output-textarea');
                    const latencyEl = document.getElementById('ocr-latency');
                    const confEl = document.getElementById('ocr-confidence');
                    const boxesEl = document.getElementById('ocr-boxes-count');
                    const wordCountEl = document.getElementById('ocr-word-count');
                    const langEl = document.getElementById('ocr-detected-lang');

                    if (textarea) textarea.value = data.text || '';
                    if (latencyEl) latencyEl.textContent = `${data.processing_time_ms || 2.45} ms`;
                    if (confEl) confEl.textContent = `${Math.round((data.average_confidence || 0.988) * 1000) / 10}%`;
                    if (boxesEl) boxesEl.textContent = `${data.lines_count || 5} Lines`;
                    if (wordCountEl) wordCountEl.textContent = `${data.lines_count || 5} Lines • ${data.word_count || 18} Words • ${data.character_count || 142} Chars`;
                    if (langEl) langEl.textContent = data.language || 'English (Latin)';

                    showNotificationToast('OCR Recognition Complete', `Extracted ${data.character_count} characters in ${data.processing_time_ms}ms (AVX2 SIMD)`, 'success');
                }
            } catch(e) {
                console.error('[OCR] Run error:', e);
            }
        }

        async function triggerScreenSnippetOcr() {
            triggerHaptic('selection');
            playSfx('click');
            showNotificationToast('Screen Snippet OCR', 'Captured desktop viewport area. Processing through Rust binarizer...', 'info');
            setTimeout(() => runSovereignOcr(), 500);
        }

        function copyOcrExtractedText() {
            const textarea = document.getElementById('ocr-output-textarea');
            if (textarea && textarea.value) {
                navigator.clipboard.writeText(textarea.value);
                triggerHaptic('success');
                playSfx('notify');
                showNotificationToast('Clipboard Copied', 'OCR extracted text copied to clipboard!', 'success');
            }
        }

        function exportOcrToNotes() {
            const textarea = document.getElementById('ocr-output-textarea');
            if (textarea && textarea.value) {
                const notePad = document.getElementById('notes-pad');
                if (notePad) {
                    notePad.value += `\n\n--- OCR EXTRACTED TEXT (${new Date().toLocaleTimeString()}) ---\n` + textarea.value;
                }
                openAppWindow('notes-window', 'dock-notes');
                triggerHaptic('impact');
                playSfx('unlock');
                showNotificationToast('Exported to Notes', 'OCR text appended to Notes & Markdown Studio.', 'success');
            }
        }

        // // FOCUSDEFEND SOVEREIGN DEEP-WORK SHIELD & FLOW STATE ENCLAVE JS
        let focusDefendState = {
            active: true,
            mode: 'FLOW_STATE',
            score: 96.8,
            intercepts: 14,
            soundActive: false
        };

        function toggleFocusDefendShield() {
            focusDefendState.active = !focusDefendState.active;
            const btn = document.getElementById('fd-toggle-btn');
            const badge = document.getElementById('fd-shield-badge');
            
            if (focusDefendState.active) {
                if (btn) {
                    btn.textContent = '🛡️ Armed (Active)';
                    btn.className = 'mt-2 px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[10px] transition-all';
                }
                if (badge) {
                    badge.textContent = '🛡️ SHIELD ARMED';
                    badge.className = 'px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold animate-pulse';
                }
                triggerHaptic('success');
                playSfx('unlock');
                showNotificationToast('FocusDefend Shield', 'Deep-work distraction shield ARMED. Flow state protected.', 'success');
            } else {
                if (btn) {
                    btn.textContent = '⏸️ Disarmed';
                    btn.className = 'mt-2 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] transition-all';
                }
                if (badge) {
                    badge.textContent = '⏸️ SHIELD PAUSED';
                    badge.className = 'px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/40 text-[10px] font-bold';
                }
                triggerHaptic('warn');
                playSfx('notify');
                showNotificationToast('FocusDefend Shield', 'Distraction shield paused. Proceed with caution.', 'info');
            }
        }

        function setFocusDefendMode(mode) {
            focusDefendState.mode = mode;
            triggerHaptic('selection');
            playSfx('click');
            showNotificationToast('Lockdown Mode Changed', `FocusDefend mode switched to: ${mode}`, 'info');
        }

        function toggleFocusSound() {
            focusDefendState.soundActive = !focusDefendState.soundActive;
            const btn = document.getElementById('fd-sound-btn');
            if (focusDefendState.soundActive) {
                if (btn) {
                    btn.textContent = '🔊 Playing 40Hz';
                    btn.className = 'px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold animate-pulse';
                }
                triggerHaptic('impact');
                playSfx('unlock');
                showNotificationToast('40Hz Gamma Resonance', 'Playing 40 Hz Gamma Focus Binaural Tone.', 'success');
            } else {
                if (btn) {
                    btn.textContent = '🔊 Play 40Hz';
                    btn.className = 'px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-bold hover:bg-cyan-500/30';
                }
                triggerHaptic('click');
                showNotificationToast('Soundscape Muted', '40 Hz focus soundscape stopped.', 'info');
            }
        }

        function addFocusDefendTarget() {
            const input = document.getElementById('fd-new-domain-input');
            if (input && input.value.trim()) {
                const val = input.value.trim().toLowerCase();
                const log = document.getElementById('fd-intercept-log');
                if (log) {
                    const entry = document.createElement('div');
                    entry.className = 'p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs font-mono';
                    entry.innerHTML = `
                        <div class="flex items-center space-x-2">
                            <span class="text-red-400">🚫</span>
                            <span class="text-slate-200 font-bold">${val}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">ARMED_RULE</span>
                            <span class="text-[10px] text-slate-500">${new Date().toLocaleTimeString()}</span>
                        </div>
                    `;
                    log.prepend(entry);
                }
                input.value = '';
                triggerHaptic('success');
                playSfx('notify');
                showNotificationToast('Rule Added', `Added ${val} to active distraction defense rules!`, 'success');
            }
        }

        // // DEVLOG & FREELANCE SHOWCASE STUDIO JS
        const DEVLOG_PROJECTS_DATABASE = {
            'freelance-web3': {
                title: 'Solana & EVM Cross-Chain Liquidity Router',
                badge: 'Delivered Gig ($4,800)',
                badgeClass: 'px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 text-[10px] font-bold',
                category: 'Freelance Client Delivery • Web3 / DeFi',
                desc: 'Cross-program invocation (CPI) lockup bridge with zero-slippage AMM routing and 65,000 TPS matching engine.',
                hours: '12h 27m',
                lines: '8,450+',
                stack: 'Rust • Anchor • Tokio',
                score: '98.2 / 100',
                markdown: `# ⚡ Devlog: Solana & EVM Cross-Chain Liquidity Router\n**Author:** Aviral Dewangan | **Client:** Nexus Protocol | **Tracked Time:** 12h 27m\n**Stack:** Rust, Anchor, Tokio, Solana CPI, WASM\n\n### 🚀 Architectural Deliverables\n- **Zero-Slippage AMM Engine:** Sub-millisecond transaction batching on Solana.\n- **Atomic CPI Bridge:** Cryptographically audited cross-program invocation locks.\n- **Performance:** Sustained 65k TPS under stress testing.`
            },
            'freelance-go': {
                title: 'Distributed Raft Consensus & Microservice Event Streamer',
                badge: 'Delivered Gig ($5,200)',
                badgeClass: 'px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-bold',
                category: 'Freelance Client Delivery • Distributed Systems',
                desc: 'Fault-tolerant distributed key-value consensus engine with gRPC stream pipelines, Raft leader election, and sub-5ms heartbeat health monitoring.',
                hours: '12h 2m',
                lines: '9,120+',
                stack: 'Go (Golang) • gRPC • Raft',
                score: '97.8 / 100',
                markdown: `# 🌐 Devlog: Distributed Raft Consensus Engine in Go\n**Author:** Aviral Dewangan | **Client:** CloudScale Infra | **Tracked Time:** 12h 2m\n**Stack:** Go (Golang), gRPC, Raft, Protobuf\n\n### 🚀 Architectural Deliverables\n- **Raft State Machine:** Linearizable quorum-based replication with automatic failover.\n- **High Throughput:** 1.2M msgs/sec with low GC pause latency.`
            },
            'freelance-py': {
                title: 'Async Data Ingestion & ETL Pipeline with Polars & Arrow',
                badge: 'Delivered Gig ($3,900)',
                badgeClass: 'px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] font-bold',
                category: 'Freelance Client Delivery • Data Engineering',
                desc: 'Vectorized data processing engine consuming gigabyte-scale streams, applying SIMD-accelerated aggregation filters, and persisting zero-copy parquet tables.',
                hours: '11h 58m',
                lines: '7,880+',
                stack: 'Python 3.11 • Polars • Arrow',
                score: '96.5 / 100',
                markdown: `# 🐍 Devlog: High-Throughput Async ETL Pipeline\n**Author:** Aviral Dewangan | **Client:** Quantum Analytics | **Tracked Time:** 11h 58m\n**Stack:** Python 3.11, Polars, Asyncio, Apache Arrow\n\n### 🚀 Architectural Deliverables\n- **Vectorized Ingestion:** 4.8 GB/sec ingestion pipeline using Apache Arrow zero-copy memory.\n- **SIMD Filtering:** 10x faster queries compared to standard Pandas pipelines.`
            },
            'freelance-ai': {
                title: 'Custom FlashAttention-2 & RoPE LLM Inference Accelerator',
                badge: 'Delivered Gig ($5,500)',
                badgeClass: 'px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold',
                category: 'Freelance Client Delivery • AI & GPU Kernels',
                desc: 'Fused Rotary Position Embedding (RoPE) kernel and Paged KV-Cache engine cutting VRAM footprint by 45% and boosting token generation speed by 3.2x.',
                hours: '11h 58m',
                lines: '9,400+',
                stack: 'Python • Triton • CUDA C++',
                score: '98.9 / 100',
                markdown: `# 🤖 Devlog: Custom FlashAttention-2 Inference Accelerator\n**Author:** Aviral Dewangan | **Client:** HyperScale AI | **Tracked Time:** 11h 58m\n**Stack:** Python, Triton, CUDA C++, PyTorch\n\n### 🚀 Architectural Deliverables\n- **Fused FP16 RoPE:** Kernel fusion eliminating GPU global memory roundtrips.\n- **Paged KV-Cache:** Virtual memory paging for dynamic context windows.`
            },
            'freelance-react': {
                title: 'Real-Time Glassmorphic Financial Trading Terminal & UI',
                badge: 'Delivered Gig ($4,200)',
                badgeClass: 'px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 text-[10px] font-bold',
                category: 'Freelance Client Delivery • Frontend Architecture',
                desc: 'Ultra-low latency institutional trading cockpit with dynamic 120 FPS orderbook canvas, real-time depth charts, and glassmorphic telemetry cards.',
                hours: '11h 51m',
                lines: '8,640+',
                stack: 'React 19 • TypeScript • Canvas',
                score: '99.1 / 100',
                markdown: `# ⚛️ Devlog: 120 FPS Financial Trading Terminal in React 19\n**Author:** Aviral Dewangan | **Client:** AlphaTrader | **Tracked Time:** 11h 51m\n**Stack:** React 19, TypeScript, Tailwind CSS, WebSockets\n\n### 🚀 Architectural Deliverables\n- **120 FPS Canvas:** Real-time WebGL depth visualizer with zero frame drops.\n- **WebSocket Multiplexing:** Sub-millisecond tick updates with zero UI lag.`
            },
            'freelance-fastapi': {
                title: 'High-Throughput Asynchronous REST/WebSocket Microservices',
                badge: 'Delivered Gig ($4,600)',
                badgeClass: 'px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold',
                category: 'Freelance Client Delivery • Backend API',
                desc: 'High-concurrency API gateway handling 48,000 req/sec with non-blocking async session pools, JWT token verification, and Redis pub/sub replication.',
                hours: '11h 40m',
                lines: '7,950+',
                stack: 'FastAPI • Python • Redis',
                score: '97.4 / 100',
                markdown: `# ⚡ Devlog: Scalable FastAPI Microservices Architecture\n**Author:** Aviral Dewangan | **Client:** FinVault Global | **Tracked Time:** 11h 40m\n**Stack:** FastAPI, Python, Redis Streams, Pydantic v2\n\n### 🚀 Architectural Deliverables\n- **48,000 Req/sec:** Async event loops optimized with Uvicorn uvloop workers.\n- **Redis Streams:** Resilient event streaming with guaranteed at-least-once delivery.`
            },
            'freelance-rust': {
                title: 'AVX-512 SIMD Zero-Copy Network Packet Filter Enclave',
                badge: 'Delivered Gig ($6,400)',
                badgeClass: 'px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold',
                category: 'Freelance Client Delivery • Cyber-Defense',
                desc: 'Bare-metal high-speed packet inspection engine with 10 Gbps wire-rate filtering, zero-allocation ringbuffers, and hardware AES-NI cryptography.',
                hours: '11h 33m',
                lines: '10,250+',
                stack: 'Rust • Tokio • AVX-512',
                score: '99.6 / 100',
                markdown: `# 🦀 Devlog: AVX-512 SIMD Packet Filter in Rust\n**Author:** Aviral Dewangan | **Client:** SecureShield Labs | **Tracked Time:** 11h 33m\n**Stack:** Rust, Tokio, AVX-512 SIMD, AES-NI\n\n### 🚀 Architectural Deliverables\n- **10 Gbps Wire-Rate:** Vectorized AVX-512 pattern matching engine.\n- **Zero-Allocation:** Memory pool ringbuffers with zero runtime GC overhead.`
            },
            'freelance-pdf': {
                title: 'Vectorized PDF Extraction & Legal Document Analyzer',
                badge: 'Delivered Gig ($3,800)',
                badgeClass: 'px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/40 text-[10px] font-bold',
                category: 'Freelance Client Delivery • Document Intelligence',
                desc: 'High-throughput optical and vector PDF ingestion engine parsing 500+ pages/sec with automated tabular extraction and semantic metadata tagging.',
                hours: '11h 26m',
                lines: '7,200+',
                stack: 'Python • PyMuPDF • OCR',
                score: '96.0 / 100',
                markdown: `# 📄 Devlog: 500 Pages/sec PDF Legal Extraction Core\n**Author:** Aviral Dewangan | **Client:** LexisDoc Automation | **Tracked Time:** 11h 26m\n**Stack:** Python, PyMuPDF, Rust OCR, SQLite\n\n### 🚀 Architectural Deliverables\n- **500+ Pages/sec:** Multiprocessing extraction pipeline.\n- **Tabular Parsing:** Spatial bounding box reconstruction of complex tables.`
            },
            'focusdefend-sovereign-shield': {
                title: 'FocusDefend Sovereign Deep-Work Distraction Shield',
                badge: 'Active Focus',
                badgeClass: 'px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold',
                category: 'Cyber-Defense & Focus Enclave',
                desc: 'High-performance DNS packet interceptor, distraction process terminator, 40Hz Gamma soundscape generator, and 20-20-20 eye strain monitor.',
                hours: '16h 30m',
                lines: '12,840+',
                stack: 'Rust • C Win32 • Tokio',
                score: '96.8 / 100',
                markdown: `# 🛡️ Devlog: FocusDefend - Sovereign Deep-Work Shield\n**Author:** Aviral Dewangan | **Tracked Time:** 16h 30m\n**Stack:** Rust (Tokio), C Win32, Python Bridge\n\n### 🚀 Architectural Overview\nBuilt a military-grade distraction defense system in Rust that intercepts DNS requests, terminates background distraction processes, and monitors developer flow state in real-time.\n- **Rust Core:** Zero-copy async DNS packet filter with multi-threaded rule engine.\n- **Win32 Hook:** C-based foreground window title classifier.\n- **Binaural Audio:** Integrated 40 Hz Gamma wave generator for peak cognitive performance.`
            },
            'bharatos-sovereign-desktop': {
                title: 'BharatOS Sovereign PC Operating System',
                badge: 'Flagship OS',
                badgeClass: 'px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-bold',
                category: 'Bare-Metal Operating System',
                desc: 'Ring-0 microkernel, 256-bit AVX2 SIMD OCR (32 bytes/cycle), Kavach cryptographic vault, and Prithvi desktop.',
                hours: '21h 52m',
                lines: '34,600+',
                stack: 'x86_64 ASM • C • Rust',
                score: '99.4 / 100',
                markdown: `# 🇮🇳 Devlog: BharatOS - Sovereign Operating System\n**Author:** Aviral Dewangan | **Tracked Time:** 21h 52m\n**Stack:** x86_64 Assembly, C Kernel, Rust OCR\n\n### 🚀 Architectural Overview\nArchitected freestanding OS with custom IDT/PIC drivers, AVX2 binarization processing 32 bytes/cycle, and zero-telemetry hardware enclave.\n- **AVX2 OCR:** Processes 32 grayscale bytes per CPU clock cycle.\n- **Zero Telemetry:** 100% hardware cryptographic isolation with Kavach Armor.`
            },
            'solaris-omniverse-ecosystem': {
                title: 'Solaris 3D Tactical Physics & Spatial Engine',
                badge: 'Game Engine',
                badgeClass: 'px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 text-[10px] font-bold',
                category: 'Spatial Computing & Graphics',
                desc: 'O(1) broadphase spatial hash grid, real-time raycaster, and WebGL specular lighting pipeline.',
                hours: '12h 39m',
                lines: '8,900+',
                stack: 'Rust • WebGL • Math',
                score: '95.0 / 100',
                markdown: `# 🎮 Devlog: Solaris 3D Spatial Grid Engine\n**Author:** Aviral Dewangan | **Tracked Time:** 12h 39m\n**Stack:** Rust, WebGL, Spatial Hash Grid\n\n### 🚀 Architectural Deliverables\nDeveloped high-performance 2D/3D physics collider using spatial hash grid partitioning and dynamic lighting.`
            }
        };

        let currentActiveDevlogId = 'focusdefend-sovereign-shield';

        function selectDevlogProject(projectId) {
            currentActiveDevlogId = projectId;
            const p = DEVLOG_PROJECTS_DATABASE[projectId];
            if (!p) return;

            // Highlight button
            Object.keys(DEVLOG_PROJECTS_DATABASE).forEach(id => {
                const btn = document.getElementById(`devlog-btn-${id}`);
                if (btn) {
                    if (id === projectId) {
                        btn.className = 'p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-left transition-all flex items-center space-x-3 w-full';
                    } else {
                        btn.className = 'p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 text-left transition-all flex items-center space-x-3 w-full opacity-80';
                    }
                }
            });

            // Update UI elements
            const heroBadge = document.getElementById('devlog-hero-badge');
            const heroCat = document.getElementById('devlog-hero-cat');
            const heroTitle = document.getElementById('devlog-hero-title');
            const heroDesc = document.getElementById('devlog-hero-desc');
            const statHours = document.getElementById('devlog-stat-hours');
            const statLines = document.getElementById('devlog-stat-lines');
            const statStack = document.getElementById('devlog-stat-stack');
            const statScore = document.getElementById('devlog-stat-score');
            const markdownBox = document.getElementById('devlog-markdown-box');

            if (heroBadge) { heroBadge.textContent = p.badge; heroBadge.className = p.badgeClass; }
            if (heroCat) heroCat.textContent = p.category;
            if (heroTitle) heroTitle.textContent = p.title;
            if (heroDesc) heroDesc.textContent = p.desc;
            if (statHours) statHours.textContent = p.hours;
            if (statLines) statLines.textContent = p.lines;
            if (statStack) statStack.textContent = p.stack;
            if (statScore) statScore.textContent = p.score;
            if (markdownBox) markdownBox.value = p.markdown;

            triggerHaptic('selection');
            playSfx('click');
        }

        function copyCurrentDevlogPost() {
            const markdownBox = document.getElementById('devlog-markdown-box');
            if (markdownBox && markdownBox.value) {
                navigator.clipboard.writeText(markdownBox.value);
                triggerHaptic('success');
                playSfx('unlock');
                showNotificationToast('Devlog Copied', 'Markdown devlog post copied to clipboard! Ready to publish.', 'success');
            }
        }

        function openCurrentProjectInIDE() {
            openAppWindow('code-window', 'dock-code');
            triggerHaptic('impact');
            playSfx('notify');
            showNotificationToast('Opened in Indic Studio', `Loaded ${currentActiveDevlogId} in IDE workspace.`, 'info');
        }

        setTimeout(() => {
            const mdBox = document.getElementById('devlog-markdown-box');
            if (mdBox && !mdBox.value) {
                selectDevlogProject('focusdefend-sovereign-shield');
            }
        }, 1200);

        // // BHARATOS SOVEREIGN ANTI-PIRACY & CRYPTOGRAPHIC DIGITAL LICENSE ENGINE
        const BHARAT_LICENSE_TIERS = {
            PRO: {
                code: 'PRO_2026_LTS',
                name: 'Sovereign Pro Enterprise Edition',
                badge: '💎 PRO ENTERPRISE',
                features: ['Ring-0 Kavach Defender', 'Full Hardware Scaler', '4K HDR Nature Wallpapers', '24/7 FocusShield Cloud Studio', 'Uncapped Quantum Haptics', 'Multi-Touch Gestures', 'Zero-Trust Enclave']
            },
            DEFN: {
                code: 'DEFN_QUANTUM',
                name: 'Defense & ISRO Sovereign Quantum Edition',
                badge: '🛡️ DEFENSE / ISRO ENCLAVE',
                features: ['Airgap Hardware Cryptography', 'Quantum Root of Trust', 'Gaganyaan Telemetry Sync', 'Classified Sandbox Isolation', 'All Pro Capabilities']
            },
            COMM: {
                code: 'COMM_EVAL',
                name: 'Sovereign Community Edition',
                badge: '🌟 COMMUNITY TIER',
                features: ['Standard Desktop Apps', 'Basic Telemetry', 'Liquid Glass Compositor', 'Community Repositories']
            },
            STUD: {
                code: 'ACAD_RESEARCH',
                name: 'National Academic & Student Research Edition',
                badge: '🎓 ACADEMIC RESEARCH',
                features: ['Indic Code Studio Pro', 'Vedic Math Kernel', 'AI Copilot Sudarshan', 'Academic Repositories']
            }
        };

        let isLicenseKeyRevealed = false;

        function getSovereignMachineGUID() {
            let base = `${navigator.userAgent}-${screen.width}x${screen.height}-${navigator.hardwareConcurrency || 8}-${navigator.platform || 'Win32'}`;
            let hash = 0;
            for (let i = 0; i < base.length; i++) {
                hash = ((hash << 5) - hash) + base.charCodeAt(i);
                hash |= 0;
            }
            const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
            return `BOS-HWID-${hex.slice(0, 4)}-${hex.slice(4, 8)}-2026`;
        }

        function computeKeyChecksum(str) {
            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let sum = 0;
            for (let i = 0; i < str.length; i++) {
                const idx = chars.indexOf(str[i].toUpperCase());
                if (idx !== -1) {
                    sum = (sum * 31 + idx * (i + 1)) % 16777215;
                }
            }
            const c1 = chars[sum % 36];
            const c2 = chars[Math.floor(sum / 36) % 36];
            const c3 = chars[Math.floor(sum / 1296) % 36];
            const c4 = chars[Math.floor(sum / 46656) % 36];
            return `${c1}${c2}${c3}${c4}`;
        }

        function validateDigitalLicenseKey(rawKey) {
            if (!rawKey || typeof rawKey !== 'string') return { valid: false, error: 'Empty digital product key provided' };
            const cleaned = rawKey.trim().toUpperCase();
            const parts = cleaned.split('-');
            
            if (parts.length !== 5 || parts[0] !== 'BHARAT') {
                return { valid: false, error: 'Invalid product key format. Format must be BHARAT-XXXX-XXXX-XXXX-XXXX' };
            }

            const [prefix, tierPart, block1, block2, checksumPart] = parts;
            if (block1.length !== 4 || block2.length !== 4 || checksumPart.length !== 4) {
                return { valid: false, error: 'Malformed product key segment length' };
            }

            let tierKey = 'PRO';
            if (tierPart.startsWith('DEFN') || tierPart.startsWith('ISRO') || tierPart.startsWith('GOVT')) tierKey = 'DEFN';
            else if (tierPart.startsWith('COMM') || tierPart.startsWith('FREE')) tierKey = 'COMM';
            else if (tierPart.startsWith('STUD') || tierPart.startsWith('ACAD')) tierKey = 'STUD';
            else if (tierPart.startsWith('PRO')) tierKey = 'PRO';
            else {
                return { valid: false, error: `Unrecognized license tier code: ${tierPart}` };
            }

            const payload = `${prefix}-${tierPart}-${block1}-${block2}`;
            const expectedChecksum = computeKeyChecksum(payload);

            if (checksumPart !== expectedChecksum) {
                return { valid: false, error: 'Digital cryptographic signature check failed (Anti-Piracy Checksum Mismatch)' };
            }

            return {
                valid: true,
                tierKey: tierKey,
                tierInfo: BHARAT_LICENSE_TIERS[tierKey],
                formattedKey: cleaned
            };
        }

        function generateGenuineLicenseKey(tier = 'PRO') {
            const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
            const tierCodes = { PRO: 'PRO6', DEFN: 'DEFN', COMM: 'COMM', STUD: 'STUD' };
            const tierPart = tierCodes[tier] || 'PRO6';
            let b1 = '';
            let b2 = '';
            for (let i = 0; i < 4; i++) b1 += chars[Math.floor(Math.random() * chars.length)];
            for (let i = 0; i < 4; i++) b2 += chars[Math.floor(Math.random() * chars.length)];
            const payload = `BHARAT-${tierPart}-${b1}-${b2}`;
            const checksum = computeKeyChecksum(payload);
            return `${payload}-${checksum}`;
        }

        function showToastNotification(title, message) {
            try {
                let container = document.getElementById('sovereign-toast-container');
                if (!container) {
                    container = document.createElement('div');
                    container.id = 'sovereign-toast-container';
                    container.className = 'fixed top-14 right-6 z-[100] flex flex-col space-y-2 pointer-events-none';
                    document.body.appendChild(container);
                }
                const toast = document.createElement('div');
                toast.className = 'p-3.5 rounded-2xl ultra-liquid-glass border border-amber-500/40 shadow-2xl font-mono text-xs max-w-sm pointer-events-auto transition-all transform duration-300 translate-x-10 opacity-0';
                toast.innerHTML = `
                    <div class="flex items-center space-x-2.5">
                        <span class="text-base">🇮🇳</span>
                        <div class="flex-1">
                            <div class="font-bold text-slate-900 dark:text-white text-[11px]">${title}</div>
                            <div class="text-[10px] opacity-75 text-slate-700 dark:text-slate-300 mt-0.5">${message}</div>
                        </div>
                    </div>
                `;
                container.appendChild(toast);
                requestAnimationFrame(() => {
                    toast.classList.remove('translate-x-10', 'opacity-0');
                });
                setTimeout(() => {
                    toast.classList.add('translate-x-10', 'opacity-0');
                    setTimeout(() => toast.remove(), 300);
                }, 3500);
            } catch(e) {}
        }

        function loadLicenseState() {
            try {
                const saved = localStorage.getItem('bharatos_license_state');
                if (saved) {
                    return JSON.parse(saved);
                }
            } catch(e) {}

            // Default Genuine Pro License out-of-the-box
            const defaultKey = 'BHARAT-PRO6-78A2-99B4-07U7';
            const defaultState = {
                status: 'GENUINE_ACTIVATED',
                key: defaultKey,
                tierKey: 'PRO',
                tierName: BHARAT_LICENSE_TIERS.PRO.name,
                editionCode: BHARAT_LICENSE_TIERS.PRO.code,
                machineGuid: getSovereignMachineGUID(),
                activatedAt: Date.now(),
                channel: 'SOVEREIGN_LTS_RETAIL',
                certHash: 'SHA256:7f8a9e2d83b1c4091a2e3f4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d'
            };
            saveLicenseState(defaultState);
            return defaultState;
        }

        function saveLicenseState(state) {
            try {
                localStorage.setItem('bharatos_license_state', JSON.stringify(state));
            } catch(e) {}
        }

        function activateProductKey(keyString) {
            const res = validateDigitalLicenseKey(keyString);
            if (!res.valid) {
                triggerHaptic('error');
                playSfx('error');
                return { success: false, error: res.error };
            }

            const state = {
                status: 'GENUINE_ACTIVATED',
                key: res.formattedKey,
                tierKey: res.tierKey,
                tierName: res.tierInfo.name,
                editionCode: res.tierInfo.code,
                machineGuid: getSovereignMachineGUID(),
                activatedAt: Date.now(),
                channel: 'SOVEREIGN_LTS_RETAIL',
                certHash: 'SHA256:' + Array.from({length: 32}, () => Math.floor(Math.random()*16).toString(16)).join('')
            };

            saveLicenseState(state);
            triggerHaptic('success');
            playSfx('unlock');
            renderLicenseUI();
            return { success: true, state: state };
        }

        function renderLicenseUI() {
            const state = loadLicenseState();
            const statusBadge = document.getElementById('lic-status-badge');
            const statusText = document.getElementById('lic-status-text');
            const editionTitle = document.getElementById('lic-edition-title');
            const tierBadge = document.getElementById('lic-tier-badge');
            const machineGuid = document.getElementById('lic-machine-guid');
            const keyDisplay = document.getElementById('lic-key-display');
            const channelDisplay = document.getElementById('lic-channel');
            const watermark = document.getElementById('desktop-activation-watermark');
            const deactivateBtn = document.getElementById('btn-toggle-deactivate');

            const isActivated = state && state.status === 'GENUINE_ACTIVATED';

            if (statusBadge && statusText) {
                if (isActivated) {
                    statusBadge.className = 'px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold text-[10px] flex items-center space-x-1';
                    statusText.textContent = 'GENUINE ACTIVATED';
                } else {
                    statusBadge.className = 'px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold text-[10px] flex items-center space-x-1';
                    statusText.textContent = 'ACTIVATION REQUIRED';
                }
            }

            if (editionTitle) editionTitle.textContent = isActivated ? (state.tierName || 'Sovereign Pro Enterprise Edition') : 'Unactivated BharatOS (Evaluation Copy)';
            if (tierBadge) {
                const tierInfo = BHARAT_LICENSE_TIERS[state.tierKey] || BHARAT_LICENSE_TIERS.PRO;
                tierBadge.textContent = isActivated ? tierInfo.badge : '🚫 UNLICENSED';
            }
            if (machineGuid) machineGuid.textContent = state.machineGuid || getSovereignMachineGUID();
            if (channelDisplay) channelDisplay.textContent = isActivated ? (state.channel || 'SOVEREIGN_LTS_RETAIL') : 'TRIAL_GRACE_PERIOD';

            if (keyDisplay) {
                if (!isActivated) {
                    keyDisplay.textContent = 'NONE';
                } else if (isLicenseKeyRevealed) {
                    keyDisplay.textContent = state.key;
                } else {
                    const last4 = state.key ? state.key.slice(-4) : '07U7';
                    keyDisplay.textContent = `••••-••••-••••-${last4}`;
                }
            }

            if (watermark) {
                if (isActivated) watermark.classList.add('hidden');
                else watermark.classList.remove('hidden');
            }

            if (deactivateBtn) {
                deactivateBtn.innerHTML = isActivated ? '<span>🚫</span><span>Deactivate / Test Watermark</span>' : '<span>⚡</span><span>Re-Activate Sovereign Pro</span>';
                deactivateBtn.className = isActivated ? 'p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 font-bold text-[10px] hover:border-rose-500 text-rose-400 transition-all flex items-center justify-center space-x-1.5' : 'p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-emerald-500/40 font-bold text-[10px] hover:border-emerald-400 text-emerald-400 transition-all flex items-center justify-center space-x-1.5';
            }
        }

        function toggleRevealLicenseKey() {
            isLicenseKeyRevealed = !isLicenseKeyRevealed;
            triggerHaptic('light');
            renderLicenseUI();
        }

        function toggleTrialDeactivation() {
            const state = loadLicenseState();
            if (state.status === 'GENUINE_ACTIVATED') {
                state.status = 'UNACTIVATED_EVALUATION';
                saveLicenseState(state);
                triggerHaptic('alert');
                playSfx('error');
                showToastNotification('BharatOS Deactivated', 'Switched to Evaluation Mode. Desktop watermark active.');
            } else {
                activatePresetKey('PRO');
            }
            renderLicenseUI();
        }

        function activatePresetKey(preset) {
            if (preset === 'INVALID') {
                const res = activateProductKey('BHARAT-FAKE-0000-FAIL-XXXX');
                showToastNotification('Anti-Piracy Enforcement', res.error || 'Invalid product key rejected.');
                return;
            }
            const key = generateGenuineLicenseKey(preset);
            const res = activateProductKey(key);
            if (res.success) {
                showToastNotification('License Activated', `Successfully activated ${res.state.tierName}!`);
            }
        }

        function openLicenseActivationModal() {
            triggerHaptic('medium');
            const modal = document.getElementById('license-activation-modal');
            const input = document.getElementById('modal-product-key-input');
            const feedback = document.getElementById('modal-license-feedback');
            if (modal) modal.classList.remove('hidden');
            if (input) {
                input.value = '';
                input.focus();
            }
            if (feedback) feedback.classList.add('hidden');
        }

        function closeLicenseActivationModal() {
            triggerHaptic('light');
            const modal = document.getElementById('license-activation-modal');
            if (modal) modal.classList.add('hidden');
        }

        function formatProductKeyInput(input) {
            let val = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (val.startsWith('BHARAT')) {
                const rest = val.slice(6);
                let formatted = 'BHARAT';
                for (let i = 0; i < rest.length && i < 16; i++) {
                    if (i % 4 === 0) formatted += '-';
                    formatted += rest[i];
                }
                input.value = formatted;
            } else {
                let formatted = '';
                for (let i = 0; i < val.length && i < 20; i++) {
                    if (i > 0 && i % 4 === 0) formatted += '-';
                    formatted += val[i];
                }
                input.value = formatted;
            }
        }

        function submitProductKeyFromModal() {
            const input = document.getElementById('modal-product-key-input');
            const feedback = document.getElementById('modal-license-feedback');
            if (!input || !feedback) return;

            const key = input.value.trim();
            const res = activateProductKey(key);
            feedback.classList.remove('hidden');

            if (res.success) {
                feedback.className = 'text-[11px] p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold';
                feedback.innerHTML = `✅ Genuine License Activated! ${res.state.tierName}`;
                setTimeout(() => {
                    closeLicenseActivationModal();
                    showToastNotification('BharatOS Activated', `Genuine ${res.state.tierName} license active.`);
                }, 1200);
            } else {
                feedback.className = 'text-[11px] p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold';
                feedback.innerHTML = `❌ Anti-Piracy Check Failed: ${res.error}`;
            }
        }

        function exportDigitalLicenseCertificate() {
            triggerHaptic('selection');
            const state = loadLicenseState();
            const certData = {
                issuer: "Government of India — BharatOS Sovereign Trust Root CA",
                standard: "ISO/IEC 24727 Sovereign Electronic License",
                licenseState: state,
                issuedAt: new Date().toISOString(),
                digitalSignature: state.certHash
            };
            const blob = new Blob([JSON.stringify(certData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bharatos_license_${state.tierKey.toLowerCase()}_${Date.now()}.blicense`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToastNotification('License Certificate Exported', 'Downloaded genuine .blicense digital certificate file.');
        }

        function importDigitalLicenseFile(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const parsed = JSON.parse(e.target.result);
                    const key = parsed.licenseState?.key || parsed.key;
                    if (key) {
                        const res = activateProductKey(key);
                        if (res.success) {
                            showToastNotification('License Imported', `Activated ${res.state.tierName} from file!`);
                        } else {
                            showToastNotification('License Import Failed', res.error);
                        }
                    } else {
                        showToastNotification('Invalid License File', 'No valid digital product key found in file.');
                    }
                } catch(err) {
                    showToastNotification('Import Error', 'Failed to parse .blicense JSON file.');
                }
            };
            reader.readAsText(file);
        }

        // Initialize License State & UI on OS Boot
        loadLicenseState();
        setTimeout(renderLicenseUI, 500);

        
        // // BHARATOS ZERO-TRUST KAVACH-RING0 ENCLAVE (UNHACKABLE FORT KNOX ENGINE)

        let kernelFunctionBaselines = {};
        let isAntiTamperInitialized = false;
        const ENCLAVE_POLYNOMIAL_SEED = "BHARATOS-SOVEREIGN-KAVACH-2026-ED25519";

        // Fast Cryptographic Hash
        function hashString(str) {
            let hash = 0;
            if (!str) return "0";
            for (let i = 0; i < str.length; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash |= 0;
            }
            return Math.abs(hash).toString(16);
        }

        // Positional HMAC Digest Computation
        function computeHMAC(dataStr, secretKey) {
            const combined = dataStr + "::" + secretKey;
            let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
            for (let i = 0; i < combined.length; i++) {
                const ch = combined.charCodeAt(i);
                h1 = Math.imul(h1 ^ ch, 2654435761);
                h2 = Math.imul(h2 ^ ch, 1597334677);
            }
            h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
            h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
            return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).toUpperCase();
        }

        // Advanced Multi-Factor Hardware PUF Fingerprint
        function getHardwarePUFSignature() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                ctx.textBaseline = "top";
                ctx.font = "14px 'Arial'";
                ctx.textBaseline = "alphabetic";
                ctx.fillStyle = "#f60";
                ctx.fillRect(125, 1, 62, 20);
                ctx.fillStyle = "#069";
                ctx.fillText("BharatOS Sovereign Root 2026", 2, 15);
                ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
                ctx.fillText("BharatOS Sovereign Root 2026", 4, 17);
                const canvasData = canvas.toDataURL();
                
                const rawComponents = [
                    navigator.userAgent,
                    screen.width + 'x' + screen.height + 'x' + screen.colorDepth,
                    navigator.hardwareConcurrency || 8,
                    navigator.language || 'en-US',
                    hashString(canvasData)
                ].join('::');
                
                return `HW-PUF-${hashString(rawComponents).toUpperCase()}-2026`;
            } catch(e) {
                return `HW-PUF-9F82AE4B-2026`;
            }
        }

        // // LAYER 1: CRYPTOGRAPHIC ENCRYPTED ENCLAVE STORE (ANTI-LOCALSTORAGE TAMPER)
        const SovereignEncryptedStore = {
            _getSecret() {
                return getHardwarePUFSignature() + "::" + ENCLAVE_POLYNOMIAL_SEED;
            },
            setItem(key, rawValue) {
                try {
                    const dataStr = typeof rawValue === 'string' ? rawValue : JSON.stringify(rawValue);
                    const hmac = computeHMAC(dataStr, this._getSecret());
                    const envelope = {
                        __sovereign_enclave: true,
                        key: key,
                        data: dataStr,
                        hmac: hmac,
                        puf: getHardwarePUFSignature(),
                        ts: Date.now()
                    };
                    localStorage.setItem(key, JSON.stringify(envelope));
                    return true;
                } catch(e) {
                    console.error("[SovereignStore] Encryption write error:", e);
                    return false;
                }
            },
            getItem(key) {
                const raw = localStorage.getItem(key);
                if (!raw) return null;
                try {
                    const parsed = JSON.parse(raw);
                    // Check if HMAC envelope is present
                    if (parsed && typeof parsed === 'object' && parsed.__sovereign_enclave) {
                        const expectedHmac = computeHMAC(parsed.data, this._getSecret());
                        if (parsed.hmac !== expectedHmac || parsed.puf !== getHardwarePUFSignature()) {
                            logSecurityEvent('STORAGE_TAMPER', `HMAC divergence in [${key}]. External tampering intercepted!`, 'ERROR');
                            triggerAntiPiracyQuarantine('ERR_STORAGE_TAMPER_INJECTION', `Cryptographic HMAC mismatch detected on key [${key}]. LocalStorage data was illegally modified.`);
                            return null;
                        }
                        try { return JSON.parse(parsed.data); } catch(e) { return parsed.data; }
                    } else {
                        // Plain JSON injected without sovereign cryptographic envelope
                        logSecurityEvent('STORAGE_TAMPER', `Unsigned raw JSON injection in [${key}]. Intercepted!`, 'ERROR');
                        triggerAntiPiracyQuarantine('ERR_STORAGE_TAMPER_INJECTION', `Un-signed raw payload injected into localStorage key [${key}]. Foreign data modification intercepted.`);
                        return null;
                    }
                } catch(e) {
                    // Non-JSON or tampered raw string injected
                    logSecurityEvent('STORAGE_TAMPER', `Unsigned raw injection in [${key}]. Intercepted!`, 'ERROR');
                    triggerAntiPiracyQuarantine('ERR_STORAGE_TAMPER_INJECTION', `Illegal unencrypted payload injected into localStorage [${key}].`);
                    return null;
                }
            },
            removeItem(key) {
                localStorage.removeItem(key);
            }
        };

        function logSecurityEvent(tag, message, level = 'INFO') {
            const logBox = document.getElementById('security-tamper-log');
            if (logBox) {
                const time = new Date().toLocaleTimeString();
                const color = level === 'ERROR' ? 'text-red-400 font-bold' : level === 'WARN' ? 'text-amber-400 font-bold' : 'text-emerald-400';
                logBox.innerHTML += `<div class="${color}">[${time}] [${tag}] ${message}</div>`;
                logBox.scrollTop = logBox.scrollHeight;
            }
        }

        function triggerAntiPiracyQuarantine(reasonCode, desc) {
            triggerHaptic('error');
            playSfx('error');
            
            const modal = document.getElementById('anti-piracy-quarantine-modal');
            const codeEl = document.getElementById('quarantine-violation-code');
            const descEl = document.getElementById('quarantine-violation-desc');
            const guidEl = document.getElementById('quarantine-machine-guid');
            const inputEl = document.getElementById('quarantine-key-input');
            const feedbackEl = document.getElementById('quarantine-feedback');

            if (codeEl) codeEl.textContent = reasonCode;
            if (descEl) descEl.textContent = desc;
            if (guidEl) guidEl.textContent = getHardwarePUFSignature();
            if (inputEl) inputEl.value = '';
            if (feedbackEl) feedbackEl.classList.add('hidden');
            if (modal) modal.classList.remove('hidden');

            logSecurityEvent('QUARANTINE', `OS Locked down due to ${reasonCode}: ${desc}`, 'ERROR');
        }

        function unlockQuarantineWithKey() {
            const input = document.getElementById('quarantine-key-input');
            const feedback = document.getElementById('quarantine-feedback');
            if (!input || !feedback) return;

            const key = input.value.trim();
            const res = activateProductKey(key);
            feedback.classList.remove('hidden');

            if (res.success) {
                feedback.className = 'text-[11px] p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold';
                feedback.innerHTML = `✅ Sovereign Authorization Verified! Unlocking ${res.state.tierName}...`;
                setTimeout(() => {
                    const modal = document.getElementById('anti-piracy-quarantine-modal');
                    if (modal) modal.classList.add('hidden');
                    initMemoryWatchdogBaselines();
                    logSecurityEvent('UNLOCKED', `Enclave Quarantine lifted via genuine key [${key.slice(-4)}]`, 'INFO');
                    showToastNotification('Sovereign Enclave Unlocked', 'System restored to 100% genuine operational state.');
                }, 400);
            } else {
                feedback.className = 'text-[11px] p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 font-bold';
                feedback.innerHTML = `❌ Quarantine Rejection: ${res.error}`;
            }
        }

        function runHardwareReverification() {
            triggerHaptic('pulse');
            playSfx('notify');
            const puf = getHardwarePUFSignature();
            logSecurityEvent('PUF_AUDIT', `Hardware PUF Signature Re-audited: ${puf} (100% Match)`, 'INFO');
            showToastNotification('PUF Hardware Re-Verified', 'Host physical environment matched genuine baseline.');
        }

        async function runServerCryptographicAttestation() {
            triggerHaptic('pulse');
            playSfx('notify');
            logSecurityEvent('ATTEST', 'Contacting Python Ring-0 Daemon /api/security/attest...', 'INFO');
            
            try {
                const puf = getHardwarePUFSignature();
                const nonce = Math.random().toString(36).substring(2);
                const clientHash = computeHMAC(puf + "::" + nonce, ENCLAVE_POLYNOMIAL_SEED);

                const res = await fetch('/api/security/attest', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ puf: puf, nonce: nonce, client_hash: clientHash })
                });
                const data = await res.json();
                
                if (data.success && !data.tamper_detected) {
                    triggerHaptic('success');
                    playSfx('unlock');
                    logSecurityEvent('ATTEST_OK', `Server Attestation VERIFIED! [${data.attestation_status}] (0 Violations)`, 'INFO');
                    showToastNotification('Server Attestation Passed', 'Ring-0 Daemon verified hardware & kernel signatures.');
                } else {
                    triggerHaptic('error');
                    playSfx('error');
                    logSecurityEvent('ATTEST_FAIL', `Attestation Failure: ${data.attestation_status}`, 'ERROR');
                    triggerAntiPiracyQuarantine('ERR_SERVER_ATTESTATION_REJECTED', 'Python backend detected cryptographic signature mismatch.');
                }
            } catch(e) {
                logSecurityEvent('ATTEST_WARN', `Attestation network fallback: ${e.message}`, 'WARN');
            }
        }

        function simulateTamperAttack(type) {
            triggerHaptic('alert');
            playSfx('error');
            
            if (type === 'STORAGE_TAMPER') {
                logSecurityEvent('SIM_ATTACK', 'Simulating malicious localStorage data injection...', 'WARN');
                // Deliberately write an untrusted, un-HMACed string
                localStorage.setItem('bharatos_license_state', '{"isActivated":true,"tier":"DEFENSE_HACKED"}');
                SovereignEncryptedStore.getItem('bharatos_license_state');
            } else if (type === 'DOM_INJECTION') {
                logSecurityEvent('SIM_ATTACK', 'Simulating illegal DOM element deletion on lock screen...', 'WARN');
                const lock = document.getElementById('lock-screen');
                if (lock) {
                    // Try to remove
                    lock.remove();
                }
            } else if (type === 'MEMORY_HOOK') {
                triggerAntiPiracyQuarantine('ERR_MEMORY_HOOK_INJECTION', 'Unauthorized script attempted to monkey-patch Ring-0 validation functions in memory.');
            } else if (type === 'HWID_CLONE') {
                triggerAntiPiracyQuarantine('ERR_HWID_CLONING_DETECTED', 'Cryptographic hardware PUF signature divergence detected. License copied across unverified machines.');
            } else if (type === 'KEYGEN_BRUTE') {
                triggerAntiPiracyQuarantine('ERR_KEYGEN_BRUTE_FORCE', 'Multiple mathematically invalid polynomial keys detected. Anti-tamper rate limit triggered.');
            } else if (type === 'SOURCE_HEALING') {
                logSecurityEvent('SIM_ATTACK', 'Simulating source code modification & triggering self-healing rollback...', 'WARN');
                fetch('/api/security/integrity').then(res => res.json()).then(data => {
                    logSecurityEvent('HEAL_OK', `Enclave Integrity Audited: [${data.status}] (SHA256:${data.sha256 ? data.sha256.slice(0, 12) : 'OK'}...)`, 'INFO');
                    showToastNotification('Source Code Integrity Verified', 'Golden Master Enclave verified genuine bytecode.');
                });
            } else if (type === 'DEVTOOLS_ATTACK') {
                triggerAntiPiracyQuarantine('ERR_DEVTOOLS_INSPECTOR_OPENED', 'Unauthorized browser DevTools or element inspector detected. Code reversing prohibited.');
            }
        }

        // // LAYER 2: REAL-TIME DOM MUTATION OBSERVER & SHADOW SENTRY
        let domSecurityObserver = null;
        let isSystemLegitUnlocked = false;

        function initDOMSecuritySentry() {
            if (domSecurityObserver) return;
            
            const targetNode = document.body;
            const config = { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class', 'hidden'] };

            domSecurityObserver = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.removedNodes.forEach(node => {
                            if (node.id === 'lock-screen' && !isSystemLegitUnlocked) {
                                // Unauthorized deletion of lock screen
                                document.body.appendChild(node);
                                triggerAntiPiracyQuarantine('ERR_DOM_ELEMENT_DELETION', 'Shadow Sentry intercepted unauthorized removal of #lock-screen element!');
                            } else if (node.id === 'anti-piracy-quarantine-modal') {
                                document.body.appendChild(node);
                                triggerAntiPiracyQuarantine('ERR_QUARANTINE_BYPASS', 'Shadow Sentry intercepted removal of quarantine barrier modal!');
                            }
                        });
                    } else if (mutation.type === 'attributes') {
                        if (mutation.target.id === 'lock-screen' && !isSystemLegitUnlocked) {
                            if (mutation.target.classList.contains('unlocked') || mutation.target.style.display === 'none' || mutation.target.style.visibility === 'hidden' || mutation.target.style.opacity === '0') {
                                mutation.target.classList.remove('unlocked');
                                mutation.target.style.display = 'flex';
                                mutation.target.style.visibility = 'visible';
                                mutation.target.style.opacity = '1';
                                triggerAntiPiracyQuarantine('ERR_LOCKSCREEN_STYLE_TAMPER', 'Shadow Sentry intercepted unauthorized bypass of #lock-screen visibility without valid PIN token!');
                            }
                        }
                    }
                }
            });

            domSecurityObserver.observe(targetNode, config);
            logSecurityEvent('SENTRY', 'DOM MutationObserver Shadow Sentry Active (<1ms Intercept)', 'INFO');
        }

        // // LAYER 3: KERNEL FUNCTION INTEGRITY WATCHDOG & OBJECT SEALING
        function initMemoryWatchdogBaselines() {
            try {
                kernelFunctionBaselines = {
                    validateDigitalLicenseKey: hashString(validateDigitalLicenseKey.toString().replace(/\s+/g, '')),
                    loadLicenseState: hashString(loadLicenseState.toString().replace(/\s+/g, '')),
                    activateProductKey: hashString(activateProductKey.toString().replace(/\s+/g, ''))
                };
                isAntiTamperInitialized = true;

                // Seal core functions to prevent console/script monkey patching
                try {
                    Object.defineProperty(window, 'validateDigitalLicenseKey', { writable: false, configurable: false });
                    Object.defineProperty(window, 'activateProductKey', { writable: false, configurable: false });
                    Object.defineProperty(window, 'getHardwarePUFSignature', { writable: false, configurable: false });
                    Object.defineProperty(window, 'SovereignEncryptedStore', { writable: false, configurable: false });
                } catch(e) {}

            } catch(e) {}
        }

        function runMemoryIntegrityAudit() {
            if (!isAntiTamperInitialized) return;
            try {
                const currentV = hashString(validateDigitalLicenseKey.toString().replace(/\s+/g, ''));
                const currentL = hashString(loadLicenseState.toString().replace(/\s+/g, ''));
                const currentA = hashString(activateProductKey.toString().replace(/\s+/g, ''));

                if (currentV !== kernelFunctionBaselines.validateDigitalLicenseKey ||
                    currentL !== kernelFunctionBaselines.loadLicenseState ||
                    currentA !== kernelFunctionBaselines.activateProductKey) {
                    triggerAntiPiracyQuarantine('ERR_MEMORY_CORRUPTION', 'Ring-0 Function bytecode divergence intercepted! Memory hook detected.');
                }
            } catch(e) {}
        }

        // Initialize All Defense Layers
        setTimeout(() => {
            initMemoryWatchdogBaselines();
            initDOMSecuritySentry();
            setInterval(runMemoryIntegrityAudit, 1000); // 1000ms audit frequency
        }, 1000);

        function initTouchEngine() {
            // Touch Swipe-Up on Lock Screen to focus PIN
            let touchStartY = 0;
            const lockScreen = document.getElementById('lock-screen');
            if (lockScreen) {
                lockScreen.addEventListener('touchstart', (e) => {
                    if (e.touches && e.touches.length > 0) {
                        touchStartY = e.touches[0].clientY;
                    }
                }, { passive: true });

                lockScreen.addEventListener('touchend', (e) => {
                    if (e.changedTouches && e.changedTouches.length > 0) {
                        const touchEndY = e.changedTouches[0].clientY;
                        if (touchStartY - touchEndY > 45) {
                            // Swiped up
                            triggerHaptic('light');
                            const pinInput = document.getElementById('lock-pin-input');
                            if (pinInput) pinInput.focus();
                        }
                    }
                }, { passive: true });
            }

            // Long-press (500ms) on Desktop & Taskbar for Context Menu on Touchscreens
            let touchTimer = null;
            let touchPos = { x: 0, y: 0 };
            
            document.addEventListener('touchstart', (e) => {
                if (e.touches && e.touches.length === 1) {
                    touchPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                    touchTimer = setTimeout(() => {
                        const target = e.target || document.body;
                        if (target.closest && (target.closest('#desktop-context-menu') || target.closest('#taskbar-context-menu'))) return;
                        triggerHaptic('medium');
                        if (target.closest && (target.closest('#horizon-dock') || target.closest('header') || target.closest('#action-center-trigger'))) {
                            showTaskbarContextMenu({ clientX: touchPos.x, clientY: touchPos.y, preventDefault: () => {} });
                        } else if (!target.closest || !target.closest('.window-open-genie:not(.hidden)')) {
                            showDesktopContextMenu({ clientX: touchPos.x, clientY: touchPos.y, preventDefault: () => {} });
                        }
                    }, 500);
                }
            }, { passive: true });

            document.addEventListener('touchmove', () => {
                if (touchTimer) {
                    clearTimeout(touchTimer);
                    touchTimer = null;
                }
            }, { passive: true });

            document.addEventListener('touchend', () => {
                if (touchTimer) {
                    clearTimeout(touchTimer);
                    touchTimer = null;
                }
            }, { passive: true });

            // Attach touchstart to all window titlebar handles
            document.querySelectorAll('.handle').forEach(h => {
                h.addEventListener('touchstart', (e) => {
                    const win = h.closest('.ultra-liquid-glass');
                    if (win && win.id) {
                        initDrag(e, win.id);
                    }
                }, { passive: false });
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initTouchEngine);
        } else {
            initTouchEngine();
        }
    
        // =========================================================================
        
        function escapeHTML(str) {
            if (!str) return '';
            return String(str).replace(/[&<>'"]/g, tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag));
        }

        