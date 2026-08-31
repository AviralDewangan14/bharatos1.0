// Chanakya Offline Copilot — Client-side OS Assistant
function sendChanakyaPrompt(prompt) {
    const input = document.getElementById('chanakya-input');
    if (input) {
        input.value = prompt;
        submitChanakya();
    }
}

function submitChanakya() {
    const input = document.getElementById('chanakya-input');
    const container = document.getElementById('chanakya-chat-box');
    if (!input || !container) return;

    const text = input.value.trim();
    if (!text) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'flex justify-end my-2';
    userMsg.innerHTML = `<div class="bg-cyan-500/20 border border-cyan-500/30 text-cyan-200 px-3.5 py-2 rounded-xl text-xs max-w-[85%] font-mono">${escapeText(text)}</div>`;
    container.appendChild(userMsg);
    input.value = '';

    setTimeout(() => {
        let reply = '';
        const q = text.toLowerCase();

        if (q.includes('ladakh') || q.includes('wallpaper')) {
            setWallpaper('ladakh_pangong');
            reply = '🏔️ Changed desktop wallpaper to **Ladakh Pangong Tso**.';
        } else if (q.includes('kashmir')) {
            setWallpaper('kashmir_dal');
            reply = '🌸 Changed desktop wallpaper to **Kashmir Dal Lake**.';
        } else if (q.includes('varanasi')) {
            setWallpaper('varanasi_dawn');
            reply = '🕉️ Changed desktop wallpaper to **Varanasi Dawn Ghats**.';
        } else if (q.includes('hindi') || q.includes('हिन्दी')) {
            switchLanguage('hi');
            reply = '🇮🇳 भाषा **हिन्दी** में परिवर्तित की गई।';
        } else if (q.includes('sanskrit') || q.includes('संस्कृत')) {
            switchLanguage('sa');
            reply = '🕉️ भाषा **संस्कृतम्** प्रति परिवर्तिता।';
        } else if (q.includes('synth') || q.includes('music')) {
            openWindow('win-sangeet', 'dock-sangeet');
            reply = '🎵 Opened **Sur Sangeet 8-Channel Synthesizer**.';
        } else if (q.includes('calc') || q.includes('math')) {
            openWindow('win-aryabhata', 'dock-aryabhata');
            reply = '🧮 Opened **Aryabhata Calculator & Grapher**.';
        } else if (q.includes('paint') || q.includes('draw')) {
            openWindow('win-chitram', 'dock-chitram');
            reply = '🎨 Opened **Chitram Paint Studio**.';
        } else if (q.includes('idt') || q.includes('c') || q.includes('kernel')) {
            reply = `💻 **C IDT Handler:**\n<pre class="bg-slate-950 p-2 rounded text-cyan-300 text-[10px] mt-1 font-mono">void idt_set_gate(uint8_t n, uint32_t base, uint16_t sel, uint8_t flags) {\n    idt[n].base_low = (base & 0xFFFF);\n    idt[n].base_high = (base >> 16) & 0xFFFF;\n    idt[n].sel = sel;\n    idt[n].flags = flags;\n}</pre>`;
        } else {
            reply = `🤖 **Chanakya:** Command processed: "${escapeText(text)}". System is running at 0.00% external telemetry. Try asking to change wallpaper, switch language, or open apps!`;
        }

        const botMsg = document.createElement('div');
        botMsg.className = 'flex items-start gap-2.5 my-2';
        botMsg.innerHTML = `
            <div class="w-6 h-6 rounded-lg bg-cyan-400 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0">🤖</div>
            <div class="bg-slate-900 border border-slate-800 text-slate-200 px-3.5 py-2.5 rounded-xl text-xs max-w-[85%] leading-relaxed">${reply}</div>
        `;
        container.appendChild(botMsg);
        container.scrollTop = container.scrollHeight;
    }, 200);

    container.scrollTop = container.scrollHeight;
}

function escapeText(str) {
    return String(str).replace(/[&<>'"]/g, tag => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[tag] || tag));
}
