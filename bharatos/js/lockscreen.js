// Lock Screen & Authentication Engine
function checkUnlockPasscode() {
    const input = document.getElementById('passcode-input');
    const errText = document.getElementById('lock-error-msg');
    if (!input) return;

    if (input.value === '1234' || input.value === '') {
        unlockDesktop();
    } else {
        if (errText) errText.textContent = 'Incorrect PIN. Try: 1234';
        input.value = '';
    }
}

function quickUnlock() {
    const input = document.getElementById('passcode-input');
    if (input) input.value = '1234';
    unlockDesktop();
}

function unlockDesktop() {
    const lock = document.getElementById('lock-screen');
    if (lock) {
        lock.style.opacity = '0';
        lock.style.transform = 'scale(1.05)';
        setTimeout(() => {
            lock.style.display = 'none';
        }, 400);
    }
}

function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    const dateStr = now.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

    const topClock = document.getElementById('topbar-clock');
    if (topClock) topClock.textContent = `${timeStr} IST`;

    const lockClock = document.getElementById('lock-clock-time');
    if (lockClock) lockClock.textContent = timeStr;

    const lockDate = document.getElementById('lock-clock-date');
    if (lockDate) lockDate.textContent = dateStr;
}

setInterval(updateClock, 1000);
