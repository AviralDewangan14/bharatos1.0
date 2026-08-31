import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light';
export type Language = 'en' | 'hi';
export type FontSize = 'small' | 'medium' | 'large';

export interface UserProfile {
  id: string;
  name: string;
  avatarColor: string;
  role: 'Admin' | 'Standard';
  pin?: string;
  bio?: string;
}

interface SettingsStore {
  theme: Theme;
  accentColor: string;
  language: Language;
  fontSize: FontSize;
  userName: string;

  // Sound Effects & Audio
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  outputDevice: string;

  // Screen Brightness & Night Shift
  brightness: number; // 10 to 100
  nightShift: boolean;

  // Wi-Fi Connection
  wifiEnabled: boolean;
  wifiConnectedSsid: string;

  // System Power State
  isPowerOff: boolean;

  // Lock Screen Customization
  lockScreenWallpaper: string;
  lockScreenGreeting: string;
  lockScreenClockFormat: '12h' | '24h';
  lockScreenBlur: boolean;

  // Multi-User Management
  users: UserProfile[];
  activeUserId: string;

  // Actions
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: string) => void;
  setLanguage: (lang: Language) => void;
  setFontSize: (size: FontSize) => void;
  setUserName: (name: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  setOutputDevice: (dev: string) => void;
  setBrightness: (b: number) => void;
  setNightShift: (ns: boolean) => void;
  setWifiEnabled: (enabled: boolean) => void;
  setWifiConnectedSsid: (ssid: string) => void;
  setIsPowerOff: (off: boolean) => void;
  setLockScreenWallpaper: (url: string) => void;
  setLockScreenGreeting: (greeting: string) => void;
  setLockScreenClockFormat: (format: '12h' | '24h') => void;
  setLockScreenBlur: (blur: boolean) => void;
  addUser: (user: Omit<UserProfile, 'id'>) => void;
  removeUser: (id: string) => void;
  setActiveUser: (id: string) => void;
  updateUser: (id: string, updates: Partial<UserProfile>) => void;
}

const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'user-admin',
    name: 'Aviral Dewangan',
    avatarColor: 'from-amber-500 to-orange-600',
    role: 'Admin',
    pin: '1234',
    bio: 'Primary Developer & System Administrator'
  },
  {
    id: 'user-guest',
    name: 'Guest User',
    avatarColor: 'from-blue-500 to-indigo-600',
    role: 'Standard',
    pin: '',
    bio: 'Standard User Profile'
  }
];

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      accentColor: '#e67e22',
      language: 'en',
      fontSize: 'medium',
      userName: 'Aviral Dewangan',

      soundEnabled: true,
      soundVolume: 0.7,
      outputDevice: 'Built-in HD Speakers',

      brightness: 100,
      nightShift: false,

      wifiEnabled: true,
      wifiConnectedSsid: 'BharatNet-5G Ultra',

      isPowerOff: false,

      lockScreenWallpaper: '/wallpapers/ladakh_pangong.jpg',
      lockScreenGreeting: 'Welcome to BharatOS',
      lockScreenClockFormat: '12h',
      lockScreenBlur: true,

      users: DEFAULT_USERS,
      activeUserId: 'user-admin',

      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setLanguage: (language) => set({ language }),
      setFontSize: (fontSize) => set({ fontSize }),
      setUserName: (userName) => set({ userName }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setSoundVolume: (soundVolume) => set({ soundVolume }),
      setOutputDevice: (outputDevice) => set({ outputDevice }),
      setBrightness: (brightness) => set({ brightness }),
      setNightShift: (nightShift) => set({ nightShift }),
      setWifiEnabled: (wifiEnabled) => set({ wifiEnabled }),
      setWifiConnectedSsid: (wifiConnectedSsid) => set({ wifiConnectedSsid }),
      setIsPowerOff: (isPowerOff) => set({ isPowerOff }),
      setLockScreenWallpaper: (lockScreenWallpaper) => set({ lockScreenWallpaper }),
      setLockScreenGreeting: (lockScreenGreeting) => set({ lockScreenGreeting }),
      setLockScreenClockFormat: (lockScreenClockFormat) => set({ lockScreenClockFormat }),
      setLockScreenBlur: (lockScreenBlur) => set({ lockScreenBlur }),

      addUser: (user) => set((state) => {
        const newUser: UserProfile = {
          ...user,
          id: `user-${Date.now()}`
        };
        return { users: [...state.users, newUser] };
      }),

      removeUser: (id) => set((state) => {
        if (state.users.length <= 1) return state;
        const filtered = state.users.filter(u => u.id !== id);
        const newActive = state.activeUserId === id ? filtered[0].id : state.activeUserId;
        const activeUser = filtered.find(u => u.id === newActive);
        return {
          users: filtered,
          activeUserId: newActive,
          userName: activeUser ? activeUser.name : state.userName
        };
      }),

      setActiveUser: (id) => set((state) => {
        const active = state.users.find(u => u.id === id);
        return {
          activeUserId: id,
          userName: active ? active.name : state.userName
        };
      }),

      updateUser: (id, updates) => set((state) => {
        const updated = state.users.map(u => u.id === id ? { ...u, ...updates } : u);
        const active = updated.find(u => u.id === state.activeUserId);
        return {
          users: updated,
          userName: active ? active.name : state.userName
        };
      })
    }),
    {
      name: 'bharatos-settings',
    }
  )
);
