// Indic Multi-Language Localization Engine
const INDIC_TRANSLATIONS = {
    'hi': {
        'garud': 'गरुड़ वेब', 'indic_studio': 'इंडिक कोड स्टूडियो',
        'chitram': 'चित्रम कला', 'aryabhata': 'आर्यभट्ट गणित',
        'sangeet': 'सुर संगीत', 'chanakya': 'चाणक्य AI',
        'quick_unlock': '⚡ त्वरित अनलॉक', 'passcode': 'पासकोड: 1234'
    },
    'sa': {
        'garud': 'गरुड जालम्', 'indic_studio': 'इण्डिक सङ्गणकम्',
        'chitram': 'चित्रम् कलाशाला', 'aryabhata': 'आर्यभट गणितम्',
        'sangeet': 'स्वर सङ्गीतम्', 'chanakya': 'चाणक्य मतिः',
        'quick_unlock': '⚡ झटिति उद्घाटय', 'passcode': 'कूटशब्दः: 1234'
    },
    'ta': {
        'garud': 'கருடன் வலை', 'indic_studio': 'இண்டிக் ஸ்டுடியோ',
        'chitram': 'சித்திரம்', 'aryabhata': 'ஆர்யபட்டா கணிதம்',
        'sangeet': 'சுர சங்கீதம்', 'chanakya': 'சாணக்யா AI',
        'quick_unlock': '⚡ விரைவு திறத்தல்', 'passcode': 'கடவுக்குறியீடு: 1234'
    },
    'te': {
        'garud': 'గరుడ వెబ్', 'indic_studio': 'ఇండిక్ కోడ్ స్టూడియో',
        'chitram': 'చిత్రం ఆర్ట్', 'aryabhata': 'ఆర్యభట గణితం',
        'sangeet': 'స్వర సంగీతం', 'chanakya': 'చాణక్య AI',
        'quick_unlock': '⚡ త్వరిత అన్‌లాక్', 'passcode': 'పాస్‌కోడ్: 1234'
    },
    'bn': {
        'garud': 'গরুড় ওয়েব', 'indic_studio': 'ইন্ডিকে কোড স্টুডিও',
        'chitram': 'চিত্রকলা', 'aryabhata': 'আর্যভট্ট গণিত',
        'sangeet': 'সুর সঙ্গীত', 'chanakya': 'চাণক্য AI',
        'quick_unlock': '⚡ দ্রুত আনলক', 'passcode': 'পাসকোড: 1234'
    },
    'mr': {
        'garud': 'गरुड वेब', 'indic_studio': 'इंडिक कोड स्टुडिओ',
        'chitram': 'चित्रम आर्ट', 'aryabhata': 'आर्यभट्ट गणित',
        'sangeet': 'सूर संगीत', 'chanakya': 'चाणक्य AI',
        'quick_unlock': '⚡ जलद अनलॉक', 'passcode': 'पासकोड: 1234'
    },
    'gu': {
        'garud': 'ગરુડ વેબ', 'indic_studio': 'ઇન્ડિક કોડ સ્ટુડિયો',
        'chitram': 'ચિત્રમ આર્ટ', 'aryabhata': 'આર્યભટ્ટ ગણિત',
        'sangeet': 'સૂર સંગીત', 'chanakya': 'ચાણક્ય AI',
        'quick_unlock': '⚡ ઝડપી અનલોક', 'passcode': 'પાસકોડ: 1234'
    },
    'en': {
        'garud': 'Garud Web', 'indic_studio': 'Indic Studio',
        'chitram': 'Chitram Paint', 'aryabhata': 'Aryabhata Math',
        'sangeet': 'Sur Sangeet', 'chanakya': 'Chanakya AI',
        'quick_unlock': '⚡ QUICK UNLOCK', 'passcode': 'Passcode: 1234'
    }
};

function changeOSLanguage(lang) {
    const dict = INDIC_TRANSLATIONS[lang] || INDIC_TRANSLATIONS['en'];
    const select = document.getElementById('topbar-language-select');
    if (select) select.value = lang;

    const quickBtn = document.getElementById('quick-unlock-text');
    if (quickBtn && dict['quick_unlock']) quickBtn.textContent = dict['quick_unlock'];

    const passNote = document.getElementById('passcode-hint-text');
    if (passNote && dict['passcode']) passNote.textContent = dict['passcode'];
}
