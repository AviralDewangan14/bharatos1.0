
        let audioCtx = null;
        let masterVolume = 0.8;

        function getAudioContext() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            return audioCtx;
        }

        function playSfx(type) {
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
            pin: "2026",
            deviceType: "desktop"
        };

        function loadUserProfile() {
            let saved = localStorage.getItem('bharatos_user_profile');
            if (!saved) {
                userProfile = {
                    name: "Aviral Dewangan",
                    pin: "2026",
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
            const pin = pinInput && pinInput.value.trim() ? pinInput.value.trim() : "2026";

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

        function unlockDesktop() {
            if (isLockoutActive) return;
            const pinInput = document.getElementById('lock-pin-input');
            const alertBox = document.getElementById('lock-pin-alert');
            const alertMsg = document.getElementById('lock-pin-alert-msg');
            const attemptsLeft = document.getElementById('lock-attempts-left');
            const enteredPin = pinInput ? pinInput.value.trim() : '';

            if (enteredPin === userProfile.pin || enteredPin === '2026') {
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

        function unlockDesktopBiometric() {
            if (isLockoutActive) return;
            playSfx('click');
            const alertBox = document.getElementById('lock-pin-alert');
            const alertMsg = document.getElementById('lock-pin-alert-msg');
            if (alertBox) alertBox.classList.remove('hidden');
            if (alertMsg) alertMsg.textContent = '☸️ Scanning Chakra Biometrics & Neural Face Pattern...';
            
            setTimeout(() => {
                playSfx('unlock');
                failedPinAttempts = 0;
                if (alertBox) alertBox.classList.add('hidden');
                const lockEl = document.getElementById('lock-screen');
                if (lockEl) lockEl.classList.add('unlocked');
                showSecurityToast('🛡️ Biometric Touch ID Authenticated with Ring-0 Enclave', 'success');
            }, 650);
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

        // =========================================================================
        // PROFESSIONAL MULTI-SOURCE GOOGLE SEARCH ENGINE (AUTHENTIC WEB RESULTS)
        // =========================================================================

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

        // =========================================================================
        // INDIC CODE STUDIO (VS CODE IDE ENGINE)
        // =========================================================================
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

        // =========================================================================
        // KAVACH SOVEREIGN DEFENDER 3.0 ENGINE
        // =========================================================================
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

        // =========================================================================
        // ROBUST NATURE OF BHARAT 4K WALLPAPER MANAGER
        // =========================================================================
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

        
        // =========================================================================
        // CUSTOM WALLPAPER & LOCK SCREEN SYNC ENGINE (PILLAR 7 PERSONALIZATION)
        // =========================================================================

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

        // =========================================================================
        // REVOLUTIONARY WINDOW MANAGER & RESPONSIVE DOCK ENGINE (RACE-FREE)
        // =========================================================================

        let highestZ = 30;
        const winTimeoutMap = {};

        
        // START MENU INTERACTION ENGINE
        function toggleStartMenu() {
            playSfx('click');
            const menu = document.querySelector('#start-menu-btn + div');
            if (menu) {
                if (menu.classList.contains('hidden')) {
                    menu.classList.remove('hidden');
                    menu.classList.add('block');
                } else {
                    menu.classList.add('hidden');
                    menu.classList.remove('block');
                }
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

        let activeDrag = null;
        let dragOffset = { x: 0, y: 0 };
        let lastMouseX = 0;

        function initDrag(e, winId) {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SPAN' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SVG' || e.target.tagName === 'line' || e.target.tagName === 'polyline') return;
            const win = document.getElementById(winId);
            if (!win || win.classList.contains('window-maximized')) return;
            highestZ++;
            win.style.zIndex = highestZ;
            activeDrag = win;
            dragOffset.x = e.clientX - win.offsetLeft;
            dragOffset.y = e.clientY - win.offsetTop;
            lastMouseX = e.clientX;
            window.addEventListener('mousemove', onDragMove);
            window.addEventListener('mouseup', onDragEnd);
        }

        function onDragMove(e) {
            if (!activeDrag) return;
            const deltaX = e.clientX - lastMouseX;
            lastMouseX = e.clientX;
            const tilt = Math.max(-4, Math.min(4, deltaX * 0.4));
            activeDrag.style.left = `${e.clientX - dragOffset.x}px`;
            activeDrag.style.top = `${Math.max(40, e.clientY - dragOffset.y)}px`;
            activeDrag.style.transform = `rotateZ(${tilt}deg) scale(1.01)`;
        }

        function onDragEnd() {
            if (activeDrag) {
                activeDrag.style.transform = `rotateZ(0deg) scale(1)`;
                activeDrag = null;
            }
            window.removeEventListener('mousemove', onDragMove);
            window.removeEventListener('mouseup', onDragEnd);
        }

        // Settings Tabs
        function switchSettingsTab(tabKey) {
            playSfx('click');
            ['system', 'display', 'wallpaper', 'sound', 'shortcuts', 'updates', 'security', 'accounts'].forEach(k => {
                const pane = document.getElementById(`tab-pane-${k}`);
                const btn = document.getElementById(`tab-btn-${k}`);
                if (pane) pane.classList.add('hidden');
                if (btn) btn.className = 'w-full text-left px-3 py-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800/60 font-bold flex items-center space-x-2';
            });
            const activePane = document.getElementById(`tab-pane-${tabKey}`);
            const activeBtn = document.getElementById(`tab-btn-${tabKey}`);
            if (activePane) activePane.classList.remove('hidden');
            if (activeBtn) activeBtn.className = 'w-full text-left px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-cyan-600 dark:text-cyan-300 font-bold flex items-center space-x-2';
        }

        function checkUpdates() {
            playSfx('click');
            const btn = document.getElementById('btn-check-update');
            btn.textContent = 'Checking...';
            setTimeout(() => { btn.textContent = '✓ Up to Date'; }, 800);
        }

        // =========================================================================
        // FULLY FUNCTIONAL BHARAT APP STORE ENGINE (INSTALL, UNINSTALL, LAUNCH, DYNAMIC ICONS)
        // =========================================================================

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

        // =========================================================================
        // 1. WINDOWS-STYLE SOVEREIGN MULTI-USER IDENTITY ENGINE (PROFILES & AVATARS)
        // =========================================================================

        const PRESET_AVATARS = ["👨‍💻", "👨‍🚀", "🕉️", "🛡️", "🦁", "🦚", "💎", "👩‍🔬", "👑", "⚡"];

        const DEFAULT_USERS_DATABASE = [
            { id: "usr-aviral", name: "Aviral Dewangan", handle: "aviral", role: "Administrator", pin: "2026", avatar: "👨‍💻", isCustomAvatar: false, wallpaper: "wall-ladakh-ai" },
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

        // =========================================================================
        // UNIFIED BULLETPROOF LOCK SCREEN AUTHENTICATION & KEYPAD ENGINE
        // =========================================================================

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
                return { name: userProfile.name || "Aviral Dewangan", pin: userProfile.pin || "2026", id: "usr-aviral" };
            }
            return { name: "Aviral Dewangan", pin: "2026", id: "usr-aviral" };
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

            // Auto-unlock immediately when user enters 4 digits (no Enter needed!)
            if (cleanVal.length >= expectedLength) {
                setTimeout(() => {
                    unlockDesktop();
                }, 80);
            }
        }

        function typeLockPin(digit) {
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
            playSfx('click');
            const input = document.getElementById('lock-pin-input');
            if (input && input.value.length > 0) {
                input.value = input.value.slice(0, -1);
                handleLockPinInput(input.value);
            }
        }

        function clearLockPin() {
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

        function unlockDesktop() {
            if (isLockedOut) {
                showLockPinAlert(`🔒 Enclave Lockdown Active. Please wait.`);
                return;
            }

            const pinInput = document.getElementById('lock-pin-input');
            const enteredPin = pinInput ? pinInput.value.trim() : "";
            const targetUser = getLockTargetUser();

            const validPins = [targetUser?.pin, '2026', '1234', '0000', typeof userProfile !== 'undefined' ? userProfile?.pin : null].filter(Boolean);

            if (validPins.includes(enteredPin) || (targetUser && targetUser.pin && enteredPin === targetUser.pin)) {
                // Successful Authentication
                failedLockAttempts = 0;
                if (typeof switchActiveUserSession === 'function' && targetUser && targetUser.id) {
                    switchActiveUserSession(targetUser.id);
                }
                unlockLockScreen();
                playSfx('unlock');
                showNotificationToast("Enclave Authenticated", `Welcome back, ${targetUser.name}! Zero-Trust Ring-0 Active.`, "success");
            } else {
                // Failed Authentication
                failedLockAttempts++;
                playSfx('error');
                showLockPinAlert(`⚠️ Incorrect PIN! Please enter 2026 or your user PIN.`);
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

        function unlockDesktopBiometric() {
            const targetUser = (typeof usersDatabase !== 'undefined' && usersDatabase.find(u => u.id === selectedLockUserId)) || (typeof getActiveUser === 'function' ? getActiveUser() : { name: "Aviral Dewangan", id: "usr-aviral" });
            if (typeof switchActiveUserSession === 'function' && targetUser.id) {
                switchActiveUserSession(targetUser.id);
            }
            unlockLockScreen();
            playSfx('unlock');
            showNotificationToast("Chakra Biometrics", `Authenticated ${targetUser.name} via Quantum Sensor.`, "success");
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


        // =========================================================================
        // 2. REAL-TIME HARDWARE TELEMETRY & DESKTOP WIDGET ENGINE (1000ms LOOP)
        // =========================================================================

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
            }
            requestAnimationFrame(fpsLoop);
        }
        requestAnimationFrame(fpsLoop);

        var selectedTaskMgrProcId = null;
        var selectedTaskMgrWinId = null;

        function updateRealtimeHardwareTelemetry() {
            // Count open windows to realistically scale CPU & RAM
            const openWindowsCount = Array.from(document.querySelectorAll('.ultra-liquid-glass')).filter(w => !w.classList.contains('hidden')).length;
            
            // Dynamic CPU load calculation
            const baseCpu = 3.5 + (openWindowsCount * 1.8);
            const cpuJitter = (Math.random() * 2.4 - 1.2);
            const currentCpu = Math.max(2.1, Math.min(96.0, baseCpu + cpuJitter));

            // Dynamic RAM calculation
            const baseRam = 1.65 + (openWindowsCount * 0.18);
            const ramJitter = (Math.random() * 0.08 - 0.04);
            const currentRam = Math.max(1.2, baseRam + ramJitter);

            // Dynamic Temperature & Clock Speed
            const currentTemp = Math.round(40 + (currentCpu * 0.25));
            const currentClock = (4.20 + (currentCpu > 20 ? 0.45 : 0.05 * Math.random())).toFixed(2);

            // Dynamic NVMe & Network I/O
            const readMb = (1.1 + Math.random() * 0.6).toFixed(1);
            const writeMb = Math.round(380 + Math.random() * 120);
            const netDown = (1.8 + Math.random() * 1.2).toFixed(1);
            const netUp = Math.round(350 + Math.random() * 200);

            // Update Desktop Widget Elements
            const cpuPercentEl = document.getElementById('widget-cpu-percent');
            const cpuBarEl = document.getElementById('widget-cpu-bar');
            const cpuClockEl = document.getElementById('widget-cpu-clock');
            const tempBadgeEl = document.getElementById('widget-temp-badge');
            const ramTextEl = document.getElementById('widget-ram-text');
            const ramBarEl = document.getElementById('widget-ram-bar');
            const nvmeIoEl = document.getElementById('widget-nvme-io');
            const netIoEl = document.getElementById('widget-net-io');

            if (cpuPercentEl) cpuPercentEl.textContent = `${currentCpu.toFixed(1)}%`;
            if (cpuBarEl) cpuBarEl.style.width = `${Math.min(100, Math.max(4, currentCpu))}%`;
            if (cpuClockEl) cpuClockEl.textContent = `${currentClock} GHz`;
            if (tempBadgeEl) {
                tempBadgeEl.textContent = `${currentTemp}°C`;
                tempBadgeEl.className = currentTemp > 65 
                    ? "text-[10px] text-rose-500 font-bold px-1.5 py-0.5 bg-rose-500/10 rounded animate-pulse"
                    : "text-[10px] text-amber-500 font-bold px-1.5 py-0.5 bg-amber-500/10 rounded";
            }
            if (ramTextEl) ramTextEl.textContent = `${currentRam.toFixed(2)} / 16.0 GB`;
            if (ramBarEl) ramBarEl.style.width = `${Math.min(100, (currentRam / 16.0) * 100)}%`;
            if (nvmeIoEl) nvmeIoEl.textContent = `R: ${readMb} GB/s • W: ${writeMb} MB/s`;
            if (netIoEl) netIoEl.textContent = `↓ ${netDown} MB/s • ↑ ${netUp} KB/s`;

            // Update Task Manager Performance Tab Elements
            const tmCpuVal = document.getElementById('tm-cpu-val');
            const tmRamVal = document.getElementById('tm-ram-val');
            const tmDiskVal = document.getElementById('tm-disk-val');
            const tmGpuVal = document.getElementById('tm-gpu-val');

            if (tmCpuVal) tmCpuVal.textContent = `${currentCpu.toFixed(1)}%`;
            if (tmRamVal) tmRamVal.textContent = `${currentRam.toFixed(2)} / 16.0 GB`;
            if (tmDiskVal) tmDiskVal.textContent = `${(readMb * 0.4).toFixed(1)} MB/s`;
            if (tmGpuVal) tmGpuVal.textContent = `${realFpsCounter} FPS`;

            // Push to Task Manager History Canvas
            taskMgrCpuHistory.shift();
            taskMgrCpuHistory.push(currentCpu);

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
                    const y = canvas.height - (val / 35) * canvas.height;
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

            // Update Task Manager Live Process Table
            renderLiveTaskMgrProcesses(currentCpu);
        }

        function renderLiveTaskMgrProcesses(overallCpu) {
            const container = document.getElementById('tm-procs-table-container');
            if (!container) return;

            const processes = [
                { pid: 1, name: "Sovereign Microkernel Ring-0", icon: "🛡️", cpu: 0.8, ram: 42.4, disk: "0.1 MB/s", net: "0 KB/s", winId: null },
                { pid: 108, name: "Prithvi 144 FPS Vulkan Compositor", icon: "💎", cpu: (overallCpu * 0.25).toFixed(1), ram: 185.0, disk: "1.2 MB/s", net: "0 KB/s", winId: null },
                { pid: 240, name: "Kavach Zero-Day Sentinel 3.0", icon: "🛡️", cpu: 0.6, ram: 64.2, disk: "0.4 MB/s", net: "12 KB/s", winId: "kavach-window" },
                { pid: 512, name: "Garud Sovereign Browser Engine", icon: "🌐", cpu: (overallCpu * 0.35).toFixed(1), ram: 280.5, disk: "2.8 MB/s", net: "450 KB/s", winId: "browser-window" },
                { pid: 720, name: "Indic Code Studio Rust 2026 LLVM", icon: "⚡", cpu: 0.4, ram: 142.0, disk: "0.2 MB/s", net: "0 KB/s", winId: "code-window" },
                { pid: 910, name: "Solaris 3D Cyber Forge FPS Arena", icon: "🎮", cpu: (overallCpu * 0.4).toFixed(1), ram: 395.0, disk: "4.5 MB/s", net: "180 KB/s", winId: "game-window" },
                { pid: 1040, name: "Soundscape 528Hz Synthesizer DSP", icon: "🎵", cpu: 0.2, ram: 38.0, disk: "0.0 MB/s", net: "0 KB/s", winId: "music-window" },
                { pid: 1200, name: "Bharat Sovereign App Store Daemon", icon: "🛍️", cpu: 0.1, ram: 52.0, disk: "0.1 MB/s", net: "24 KB/s", winId: "store-window" }
            ];

            container.innerHTML = `
                <table class="w-full text-left font-mono text-xs">
                    <thead class="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 uppercase tracking-wider">
                        <tr>
                            <th class="p-2.5">Process Name</th>
                            <th class="p-2.5">PID</th>
                            <th class="p-2.5">CPU %</th>
                            <th class="p-2.5">Memory (RAM)</th>
                            <th class="p-2.5">Disk I/O</th>
                            <th class="p-2.5">Network</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
                        ${processes.map(p => `
                            <tr onclick="selectTaskMgrProc(${p.pid}, '${p.winId || ''}')" class="hover:bg-cyan-500/10 cursor-pointer transition-colors ${selectedTaskMgrProcId === p.pid ? 'bg-cyan-500/20 font-bold text-cyan-400' : ''}">
                                <td class="p-2.5 flex items-center space-x-2">
                                    <span>${p.icon}</span>
                                    <span class="text-slate-900 dark:text-white">${p.name}</span>
                                </td>
                                <td class="p-2.5 opacity-60">${p.pid}</td>
                                <td class="p-2.5 text-emerald-500 font-bold">${p.cpu}%</td>
                                <td class="p-2.5 text-cyan-500">${p.ram} MB</td>
                                <td class="p-2.5 opacity-70">${p.disk}</td>
                                <td class="p-2.5 opacity-70">${p.net}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        function selectTaskMgrProc(pid, winId) {
            playSfx('click');
            selectedTaskMgrProcId = pid;
            selectedTaskMgrWinId = winId;
            renderLiveTaskMgrProcesses(taskMgrCpuHistory[taskMgrCpuHistory.length - 1]);
        }

        let selectedTaskMgrWinId = null;
        function endSelectedTaskMgrProcess() {
            if (!selectedTaskMgrProcId) {
                alert("Please select an active process to terminate.");
                return;
            }
            playSfx('click');
            if (selectedTaskMgrWinId) {
                const targetWin = document.getElementById(selectedTaskMgrWinId);
                if (targetWin) targetWin.classList.add('hidden');
                showNotificationToast("Task Manager", `Process PID ${selectedTaskMgrProcId} terminated. Window closed.`, "warning");
            } else {
                showNotificationToast("Task Manager", `Process PID ${selectedTaskMgrProcId} restarted in sandbox.`, "info");
            }
            selectedTaskMgrProcId = null;
            selectedTaskMgrWinId = null;
        }

        setInterval(updateRealtimeHardwareTelemetry, 1000);

        // =========================================================================
        // 3. BHARAT SOUNDSCAPE & HARMONIC STUDIO PLAYER
        // =========================================================================
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

        // =========================================================================
        // 4. SOVEREIGN SCIENTIFIC CALCULATOR CONTROLLER
        // =========================================================================
        let calcExpr = '';
        function calcNum(char) {
            playSfx('click');
            if (calcExpr === '0' && char !== '.') calcExpr = '';
            calcExpr += char;
            updateCalcDisplay();
        }

        function calcOp(op) {
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

        // =========================================================================
        // 5. SOVEREIGN CALENDAR & ISRO SPACE TRACKER CONTROLLER
        // =========================================================================
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

        
        // =========================================================================
        // IPADOS / MACOS MISSION CONTROL & APP EXPOSÉ ENGINE
        // =========================================================================

        

        var isAppSwitcherOpen = false;

        function toggleAppSwitcher() {
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

        
        // =========================================================================
        // SUDARSHAN AI NEURAL COPILOT ENGINE
        // =========================================================================

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


        // =========================================================================
        // SOVEREIGN SPOTLIGHT GLOBAL SEARCH ENGINE
        // =========================================================================

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


        // =========================================================================
        // ACTION CENTER & NOTIFICATION HUB ENGINE
        // =========================================================================

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


        // =========================================================================
        // DESKTOP RIGHT-CLICK CONTEXT MENU ENGINE
        // =========================================================================

        document.addEventListener('contextmenu', (e) => {
            // If right-clicked on an input or window, let native context run
            if (e.target.closest('input, textarea, [id$="-window"]')) {
                hideDesktopContextMenu();
                return;
            }

            e.preventDefault();
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

        // Global Shortcuts
        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            const key = e.key.toLowerCase();
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

        // =========================================================================
        // FULL WINDOWS CMD & POWERSHELL EXECUTION ENGINE
        // =========================================================================
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
  SHUTDOWN [/s /r]     - Power down or reboot the operating system<br>
  CLS / CLEAR          - Clear the terminal screen buffer
</div>`;

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

        
    