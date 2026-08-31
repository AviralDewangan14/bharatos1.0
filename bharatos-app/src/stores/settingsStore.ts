import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light';
type Language = 'en' | 'hi';
type FontSize = 'small' | 'medium' | 'large';

interface SettingsStore {
  theme: Theme;
  accentColor: string;
  language: Language;
  fontSize: FontSize;
  userName: string;
  
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: string) => void;
  setLanguage: (lang: Language) => void;
  setFontSize: (size: FontSize) => void;
  setUserName: (name: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      accentColor: '#e67e22',
      language: 'en',
      fontSize: 'medium',
      userName: 'User',
      
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setLanguage: (language) => set({ language }),
      setFontSize: (fontSize) => set({ fontSize }),
      setUserName: (userName) => set({ userName }),
    }),
    {
      name: 'bharatos-settings',
    }
  )
);
