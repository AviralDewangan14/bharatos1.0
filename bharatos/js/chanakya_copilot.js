// Chanakya Sovereign AI Copilot Engine
// Client-side offline assistant for OS controls, kernel generation, and explanations

function askChanakyaPrompt(promptText) {
    const input = document.getElementById('chanakya-input');
    if (input) {
        input.value = promptText;
        sendChanakyaMessage();
    }
}

function sendChanakyaMessage() {
    const input = document.getElementById('chanakya-input');
    const msgBox = document.getElementById('chanakya-messages');
    if (!input || !msgBox) return;

    const query = input.value.trim();
    if (!query) return;

    // Append User Bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'flex justify-end';
    userBubble.innerHTML = `<div class="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-xs max-w-[85%] font-mono">${escapeHTML(query)}</div>`;
    msgBox.appendChild(userBubble);
    input.value = '';

    // Generate Response
    setTimeout(() => {
        const botBubble = document.createElement('div');
        botBubble.className = 'flex items-start space-x-2.5';
        
        let reply = '';
        const qLower = query.toLowerCase();

        if (qLower.includes('ladakh') || (qLower.includes('wallpaper') && qLower.includes('ladakh'))) {
            setWallpaper('ladakh_pangong');
            reply = '🏔️ Wallpaper set to **Ladakh Pangong Tso**. 4K nature view applied.';
        } else if (qLower.includes('kashmir')) {
            setWallpaper('kashmir_dal');
            reply = '🌸 Wallpaper set to **Kashmir Dal Lake**.';
        } else if (qLower.includes('varanasi')) {
            setWallpaper('varanasi_dawn');
            reply = '🕉️ Wallpaper set to **Varanasi Dawn Ghats**.';
        } else if (qLower.includes('hindi') || qLower.includes('हिन्दी')) {
            changeOSLanguage('hi');
            reply = '🇮🇳 भाषा को **हिन्दी (Hindi)** में सफलतापूर्वक बदल दिया गया है।';
        } else if (qLower.includes('sanskrit') || qLower.includes('संस्कृत')) {
            changeOSLanguage('sa');
            reply = '🕉️ भाषा **संस्कृतम्** प्रति परिवर्तिता।';
        } else if (qLower.includes('idt') || qLower.includes('c') || qLower.includes('kernel')) {
            reply = `💻 **Freestanding IDT Handler (C):**
<pre class="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-[10px] overflow-x-auto">
struct idt_entry {
    uint16_t base_low;
    uint16_t sel;
    uint8_t  always0;
    uint8_t  flags;
    uint16_t base_high;
} __attribute__((packed));

void idt_set_gate(uint8_t num, uint32_t base, uint16_t sel, uint8_t flags) {
    idt[num].base_low  = (base & 0xFFFF);
    idt[num].base_high = (base >> 16) & 0xFFFF;
    idt[num].sel       = sel;
    idt[num].always0   = 0;
    idt[num].flags     = flags;
}
</pre>`;
        } else if (qLower.includes('aryabhata') || qLower.includes('calc')) {
            openAppWindow('aryabhata-window', 'dock-aryabhata');
            reply = '🧮 Opened **Aryabhata Scientific Calculator & 2D Grapher**.';
        } else if (qLower.includes('sangeet') || qLower.includes('music') || qLower.includes('synth')) {
            openAppWindow('sangeet-window', 'dock-sangeet');
            reply = '🎵 Opened **Sur Sangeet 8-Channel DSP Synthesizer**.';
        } else if (qLower.includes('paint') || qLower.includes('draw')) {
            openAppWindow('chitram-window', 'dock-chitram');
            reply = '🎨 Opened **Chitram Vector Paint Studio**.';
        } else if (qLower.includes('code') || qLower.includes('ide')) {
            openAppWindow('code-window', 'dock-code');
            reply = '💻 Opened **Indic Code Studio IDE**.';
        } else {
            reply = `🤖 **Chanakya Response:** I processed your command "${escapeHTML(query)}". System state is stable at 0.00% external telemetry. Ask me to switch wallpapers, translate the OS, generate systems code, or open creative apps!`;
        }

        botBubble.innerHTML = `
            <div class="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center text-sm text-slate-950 font-bold shrink-0 shadow">🤖</div>
            <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 space-y-1.5 max-w-[85%]">
                <div class="text-xs leading-relaxed">${reply}</div>
            </div>`;
        msgBox.appendChild(botBubble);
        msgBox.scrollTop = msgBox.scrollHeight;
    }, 250);

    msgBox.scrollTop = msgBox.scrollHeight;
}

function clearChanakyaChat() {
    const msgBox = document.getElementById('chanakya-messages');
    if (msgBox) {
        msgBox.innerHTML = `
            <div class="flex items-start space-x-2.5">
                <div class="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center text-sm text-slate-950 font-bold shrink-0 shadow">🤖</div>
                <div class="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 space-y-1.5 max-w-[85%]">
                    <p class="font-semibold text-cyan-300">Namaste! Chanakya Copilot ready.</p>
                    <p class="text-slate-300 leading-relaxed">Ask me to control OS settings, write C/Rust code, or solve math problems.</p>
                </div>
            </div>`;
    }
}
