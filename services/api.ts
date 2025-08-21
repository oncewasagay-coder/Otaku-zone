
import { User, Settings, LibraryEntry, HistoryItem, ListFolder, Anime, Episode } from '../types';
import { animeDatabase } from '../constants';

// --- MOCK API Contract ---
// A small wrapper to simulate network responses
const mockResponse = <T>(data: T, ok = true, status = 200) => ({
    ok,
    status,
    data,
    error: ok ? null : 'An error occurred',
});

// --- MOCK DATABASE ---
const DB = {
    users: JSON.parse(localStorage.getItem('ab_users') || '[]') as User[],
    passwords: JSON.parse(localStorage.getItem('ab_passwords') || '{}') as Record<string, string>,
    libraries: JSON.parse(localStorage.getItem('ab_libraries') || '{}') as Record<string, LibraryEntry[]>,
    histories: JSON.parse(localStorage.getItem('ab_histories') || '{}') as Record<string, HistoryItem[]>,
};

// Seed initial user if DB is empty
if (DB.users.length === 0) {
    const initialSettings: Settings = {
        autoPlay: true,
        autoNext: true,
        autoSkipIntro: false,
        titleLang: 'EN',
        preferredAudio: 'hi',
        enableDub: true,
        playOriginalAudio: false,
        animeNameLanguage: 'English',
        showCommentsAtHome: true,
        publicWatchList: true,
        notificationIgnoreFolders: [],
        notificationIgnoreLanguage: 'None',
    };
    const initialUser: User = {
        id: 'user-1',
        email: 'user@animebharat.com',
        name: 'Rohan',
        avatar: `https://picsum.photos/seed/rohan-avatar/200/200`,
        verified: true,
        publicLibrary: true,
        settings: initialSettings,
        watchHistory: [],
    };
    DB.users.push(initialUser);
    DB.passwords['user-1'] = 'password123';
    DB.libraries['user-1'] = [{ animeId: '1', folder: 'Watching', addedAt: new Date().toISOString() }];
    DB.histories['user-1'] = [
      { animeId: '1', epId: 'aot-ep-1', positionSec: 300, updatedAt: new Date().toISOString() },
      { animeId: '2', epId: 'ds-ep-1', positionSec: 120, updatedAt: new Date().toISOString() }
    ];
}

const saveDb = () => {
    localStorage.setItem('ab_users', JSON.stringify(DB.users));
    localStorage.setItem('ab_passwords', JSON.stringify(DB.passwords));
    localStorage.setItem('ab_libraries', JSON.stringify(DB.libraries));
    localStorage.setItem('ab_histories', JSON.stringify(DB.histories));
};
saveDb(); // Initial save

const simulateDelay = (ms = 300) => new Promise(res => setTimeout(res, ms));

// --- API METHODS ---
export const api = {
    // Anime Data
    async getAnime(filters: any) {
        await simulateDelay();
        let results = [...animeDatabase];
        // Apply filters... (omitted for brevity, can be implemented if needed)
        return mockResponse(results);
    },
    async getAnimeBySlug(slug: string) {
        await simulateDelay();
        const anime = animeDatabase.find(a => a.slug === slug);
        return anime ? mockResponse(anime) : mockResponse(null, false, 404);
    },

    // Auth
    async login(email: string, password: string) {
        await simulateDelay();
        const user = DB.users.find(u => u.email === email);
        if (user && DB.passwords[user.id] === password) {
            localStorage.setItem('ab_token', user.id);
            return mockResponse(user);
        }
        return mockResponse(null, false, 401);
    },
    async register(name: string, email: string, password: string) {
        await simulateDelay();
        if (DB.users.some(u => u.email === email)) return mockResponse(null, false, 409);
        const newUser: User = {
            id: `user-${Date.now()}`,
            email, name, verified: false, publicLibrary: true,
            avatar: `https://picsum.photos/seed/${name}/200/200`,
            settings: { 
                autoPlay: true, 
                autoNext: true, 
                autoSkipIntro: false, 
                titleLang: 'EN', 
                preferredAudio: 'hi',
                enableDub: true,
                playOriginalAudio: false,
                animeNameLanguage: 'English',
                showCommentsAtHome: true,
                publicWatchList: true,
                notificationIgnoreFolders: [],
                notificationIgnoreLanguage: 'None',
            },
            watchHistory: [],
        };
        DB.users.push(newUser);
        DB.passwords[newUser.id] = password;
        DB.libraries[newUser.id] = [];
        DB.histories[newUser.id] = [];
        saveDb();
        localStorage.setItem('ab_token', newUser.id);
        return mockResponse(newUser);
    },
    logout() {
        localStorage.removeItem('ab_token');
    },
    async getMe() {
        await simulateDelay(100);
        const userId = localStorage.getItem('ab_token');
        if (!userId) return mockResponse(null, false);
        const user = DB.users.find(u => u.id === userId);
        return user ? mockResponse(user) : mockResponse(null, false);
    },

    // User Profile & Settings
    async updateUserProfile(profile: Partial<{ name: string, avatar: string }>) {
        await simulateDelay();
        const { data: user } = await this.getMe();
        if (!user) return mockResponse(null, false, 401);
        const userIndex = DB.users.findIndex(u => u.id === user.id);
        if (userIndex > -1) {
            DB.users[userIndex] = { ...DB.users[userIndex], ...profile };
            saveDb();
            return mockResponse(DB.users[userIndex]);
        }
        return mockResponse(null, false);
    },
    async updateUserSettings(settings: Partial<Settings>) {
        await simulateDelay();
        const { data: user } = await this.getMe();
        if (!user) return mockResponse(null, false, 401);
        const userIndex = DB.users.findIndex(u => u.id === user.id);
        if (userIndex > -1) {
            DB.users[userIndex].settings = { ...DB.users[userIndex].settings, ...settings };
            saveDb();
            return mockResponse(DB.users[userIndex].settings);
        }
        return mockResponse(null, false);
    },

    // Library
    async getLibrary() {
        await simulateDelay();
        const { data: user } = await this.getMe();
        if (!user) return mockResponse([], false, 401);
        return mockResponse(DB.libraries[user.id] || []);
    },
    async addToLibrary(animeId: string, folder: ListFolder) {
        await simulateDelay();
        const { data: user } = await this.getMe();
        if (!user) return mockResponse(null, false, 401);
        const library = DB.libraries[user.id] || [];
        const existing = library.find(item => item.animeId === animeId);
        if (existing) existing.folder = folder;
        else library.push({ animeId, folder, addedAt: new Date().toISOString() });
        DB.libraries[user.id] = library;
        saveDb();
        return mockResponse({ success: true });
    },
    async removeFromLibrary(animeId: string) {
        await simulateDelay();
        const { data: user } = await this.getMe();
        if (!user) return mockResponse(null, false, 401);
        DB.libraries[user.id] = (DB.libraries[user.id] || []).filter(item => item.animeId !== animeId);
        saveDb();
        return mockResponse({ success: true });
    },

    // History
    async getHistory() {
        await simulateDelay();
        const { data: user } = await this.getMe();
        if (!user) return mockResponse([], false, 401);
        return mockResponse(DB.histories[user.id] || []);
    },
    async updateWatchHistory(item: { animeId: string; epId: string; positionSec: number }) {
        // This is a fire-and-forget in the UI, so no delay needed for optimistic update
        const { data: user } = await this.getMe();
        if (!user) return mockResponse(null, false, 401);
        const history = DB.histories[user.id] || [];
        const existingIndex = history.findIndex(h => h.epId === item.epId);
        if (existingIndex > -1) {
            history[existingIndex] = { ...item, updatedAt: new Date().toISOString() };
        } else {
            history.push({ ...item, updatedAt: new Date().toISOString() });
        }
        DB.histories[user.id] = history.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        saveDb();
        return mockResponse({ success: true });
    },
};
