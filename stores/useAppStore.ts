import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { User, Settings, View, Toast, ToastType, LibraryEntry, HistoryItem, ListFolder } from '../types';
import { api } from '../services/api';

type AppState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  library: LibraryEntry[];
  currentView: View;
  toasts: Toast[];
  filters: {
    query: string;
    genre: string[];
    year: string;
    status: string;
    type: string;
    audio: string[];
  };
  isFilterSidebarOpen: boolean;
};

type AppActions = {
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserSettings: (settings: Partial<Settings>) => Promise<void>;
  updateUserProfile: (profile: Partial<{ name: string; avatar: string }>) => Promise<void>;
  
  // Library Actions
  addToLibrary: (animeId: string, folder: ListFolder) => Promise<void>;
  removeFromLibrary: (animeId: string) => Promise<void>;
  
  // History Actions
  updateWatchHistory: (item: { animeId: string; epId: string; positionSec: number }) => Promise<void>;

  // Navigation
  setView: (view: View) => void;
  
  // UI Actions
  showToast: (message: string, type: ToastType) => void;
  dismissToast: (id: number) => void;
  setFilter: (filter: keyof AppState['filters'], value: any) => void;
  toggleFilterSidebar: () => void;
};

export const useAppStore = create<AppState & AppActions>()(
  immer((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    library: [],
    currentView: { type: 'home' },
    toasts: [],
    filters: {
      query: '',
      genre: [],
      year: '',
      status: '',
      type: '',
      audio: [],
    },
    isFilterSidebarOpen: false,

    init: async () => {
      const { data: user } = await api.getMe();
      if (user) {
        set({ user, isAuthenticated: true });
        const { data: library } = await api.getLibrary();
        if (library) set({ library });
      }
      set({ isLoading: false });
    },

    login: async (email, password) => {
      const { ok, data: user } = await api.login(email, password);
      if (ok && user) {
        set({ user, isAuthenticated: true });
        const { data: library } = await api.getLibrary();
        if (library) set({ library });
        return true;
      }
      return false;
    },
    
    register: async (name, email, password) => {
        const { ok, data: user } = await api.register(name, email, password);
        if (ok && user) {
            set({ user, isAuthenticated: true, library: [] });
            return true;
        }
        return false;
    },

    logout: () => {
      api.logout();
      set({ user: null, isAuthenticated: false, library: [] });
    },

    updateUserSettings: async (settings) => {
      if (!get().user) return;
      const { ok, data } = await api.updateUserSettings(settings);
      if (ok && data) {
        set(state => {
          if (state.user) {
            state.user.settings = { ...state.user.settings, ...data };
          }
        });
        get().showToast('Settings updated', 'success');
      } else {
        get().showToast('Failed to update settings', 'error');
      }
    },

    updateUserProfile: async (profile) => {
      if (!get().user) return;
      const { ok, data } = await api.updateUserProfile(profile);
      if (ok && data) {
          set(state => {
              if(state.user) {
                  state.user.name = data.name ?? state.user.name;
                  state.user.avatar = data.avatar ?? state.user.avatar;
              }
          });
          get().showToast('Profile updated', 'success');
      } else {
        get().showToast('Failed to update profile', 'error');
      }
    },
    
    addToLibrary: async (animeId, folder) => {
        if (!get().isAuthenticated) {
            get().showToast('Please log in to add to your library', 'info');
            return;
        }
        const { ok } = await api.addToLibrary(animeId, folder);
        if (ok) {
            const { data: library } = await api.getLibrary();
            if (library) set({ library });
            get().showToast('Added to library', 'success');
        } else {
            get().showToast('Failed to add to library', 'error');
        }
    },

    removeFromLibrary: async (animeId) => {
        const { ok } = await api.removeFromLibrary(animeId);
        if (ok) {
            set(state => {
                state.library = state.library.filter(item => item.animeId !== animeId);
            });
            get().showToast('Removed from library', 'success');
        } else {
            get().showToast('Failed to remove from library', 'error');
        }
    },
    
    updateWatchHistory: async (item) => {
      if(!get().isAuthenticated) return;
      await api.updateWatchHistory(item);
      // We can optionally refresh history here, or assume it's updated optimistically
    },

    setView: (view) => {
      set({ currentView: view });
    },

    showToast: (message, type = 'info') => {
      const id = Date.now();
      set(state => {
        state.toasts.push({ id, message, type });
      });
      setTimeout(() => get().dismissToast(id), 5000);
    },

    dismissToast: (id) => {
      set(state => {
        state.toasts = state.toasts.filter(t => t.id !== id);
      });
    },

    setFilter: (filter, value) => {
      set(state => {
        state.filters[filter] = value;
      });
    },

    toggleFilterSidebar: () => {
      set(state => {
        state.isFilterSidebarOpen = !state.isFilterSidebarOpen;
      });
    },
  }))
);
