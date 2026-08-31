// BharatOS Bootstrapping & Event Initializer
window.addEventListener('DOMContentLoaded', () => {
    setWallpaper('ladakh_pangong');
    updateClock();
    setTimeout(() => {
        initPaintCanvas();
        plotGraph();
    }, 400);
});
