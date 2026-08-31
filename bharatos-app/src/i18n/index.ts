import { useSettingsStore } from '../stores/settingsStore';
import { en } from './en';
import { hi } from './hi';

const translations = { en, hi };

export const t = (key: string): string => {
  // Safe grab of language, fallback to 'en'
  const lang = useSettingsStore.getState().language || 'en';
  
  const dictionary = translations[lang as keyof typeof translations] || en;
  
  // Cast to any to allow dynamic string lookup without rigid type complaints
  return (dictionary as any)[key] || key;
};
