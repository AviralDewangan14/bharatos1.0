import { create } from 'zustand';
import type { AppDefinition, AppCategory } from '../types/app';

interface AppRegistryStore {
  apps: AppDefinition[];
  registerApp: (app: AppDefinition) => void;
  getApp: (id: string) => AppDefinition | undefined;
  getAppsByCategory: (category: AppCategory) => AppDefinition[];
  searchApps: (query: string) => AppDefinition[];
}

export const useAppRegistry = create<AppRegistryStore>((set, get) => ({
  apps: [],
  
  registerApp: (app) => set((state) => {
    // Avoid re-registering
    if (state.apps.some(a => a.id === app.id)) return state;
    
    return { 
      apps: [...state.apps, app].sort((a, b) => a.name.localeCompare(b.name)) 
    };
  }),
  
  getApp: (id) => get().apps.find(a => a.id === id),
  
  getAppsByCategory: (category) => get().apps.filter(a => a.category === category),
  
  searchApps: (query) => {
    const q = query.toLowerCase();
    return get().apps.filter(a => 
      a.name.toLowerCase().includes(q) || 
      a.description?.toLowerCase().includes(q)
    );
  }
}));
