// Desktop Settings — Wallpapers, Language, Dark Mode
const WALLPAPERS = {
    'ladakh_pangong': 'wallpapers/ladakh_pangong.jpg',
    'kashmir_dal': 'wallpapers/kashmir_dal.jpg',
    'varanasi_dawn': 'wallpapers/varanasi_dawn.jpg',
    'thar_twilight': 'wallpapers/thar_twilight.jpg'
};

function setWallpaper(key) {
    const wall = document.getElementById('desktop-wallpaper');
    const src = WALLPAPERS[key] || 'wallpapers/ladakh_pangong.jpg';
    if (wall) {
        wall.style.backgroundImage = `url('${src}')`;
    }
}

const I18N = {
    'hi': {
        'chanakya': 'चाणक्य AI', 'sangeet': 'सुर संगीत', 'chitram': 'चित्रम कला',
        'aryabhata': 'आर्यभट्ट गणित', 'code': 'इंडिक कोड', 'quick_unlock': '⚡ त्वरित अनलॉक'
    },
    'sa': {
        'chanakya': 'चाणक्य मतिः', 'sangeet': 'स्वर सङ्गीतम्', 'chitram': 'चित्रम् कलाशाला',
        'aryabhata': 'आर्यभट गणितम्', 'code': 'इण्डिक सङ्गणकम्', 'quick_unlock': '⚡ झटिति उद्घाटय'
    },
    'en': {
        'chanakya': 'Chanakya AI', 'sangeet': 'Sur Sangeet', 'chitram': 'Chitram Paint',
        'aryabhata': 'Aryabhata Math', 'code': 'Indic Studio', 'quick_unlock': '⚡ QUICK UNLOCK'
    }
};

function switchLanguage(lang) {
    const dict = I18N[lang] || I18N['en'];
    const select = document.getElementById('topbar-lang-select');
    if (select) select.value = lang;

    const quickBtn = document.getElementById('quick-unlock-btn');
    if (quickBtn && dict['quick_unlock']) quickBtn.textContent = dict['quick_unlock'];
}
