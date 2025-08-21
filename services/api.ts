import { User, UserSettings, WatchListItem, WatchProgress } from '../types';
import { animeDatabase } from '../constants';

// --- MOCK DATABASE ---
const initialWatchProgress: WatchProgress = {
    "1": { watchedEpisodes: 20, totalEpisodes: 87, watchedTime: 854, totalTime: 1440 },
    "2": { watchedEpisodes: 10, totalEpisodes: 44, watchedTime: 330, totalTime: 1380 },
    "3": { watchedEpisodes: 540, totalEpisodes: 1075, watchedTime: 1210, totalTime: 1440 },
};

const initialWatchList: WatchListItem[] = [
    { animeId: 3, status: 'Watching' },
    { animeId: 1, status: 'Completed' },
    { animeId: 4, status: 'Plan to Watch' },
];

const initialSettings: UserSettings = {
    autoNext: true,
    autoPlay: true,
    autoSkipIntro: true,
    enableDub: true,
    playOriginalAudio: false,
    animeNameLanguage: 'English',
    showCommentsAtHome: true,
    publicWatchList: true,
    notificationIgnoreFolders: ['On-Hold', 'Plan to Watch', 'Dropped', 'Completed'],
    notificationIgnoreLanguage: 'None'
};

const initialUsers: User[] = [
    {
        id: 'user-1',
        name: 'Shinji',
        email: 'user@example.com',
        emailVerified: true,
        avatar: 'https://picsum.photos/seed/shinji-avatar/200/200',
        joinDate: '2024-01-15',
        favorites: [1, 4, 9],
        watchList: initialWatchList,
        watchProgress: initialWatchProgress,
        settings: initialSettings,
    }
];

// --- API SIMULATION ---
const DB = {
    users: JSON.parse(localStorage.getItem('hanime_users') || '[]') as User[],
    passwords: JSON.parse(localStorage.getItem('hanime_passwords') || '{}') as Record<string, string>,
};

if (DB.users.length === 0) {
    DB.users = initialUsers;
    DB.passwords['user-1'] = 'password123';
    localStorage.setItem('hanime_users', JSON.stringify(DB.users));
    localStorage.setItem('hanime_passwords', JSON.stringify(DB.passwords));
}

const saveDb = () => {
    localStorage.setItem('hanime_users', JSON.stringify(DB.users));
    localStorage.setItem('hanime_passwords', JSON.stringify(DB.passwords));
};

const simulateDelay = (ms = 500) => new Promise(res => setTimeout(res, ms));

// --- API METHODS ---
export const api = {
    async login(email: string, password: string): Promise<User | null> {
        await simulateDelay();
        const user = DB.users.find(u => u.email === email);
        if (user && DB.passwords[user.id] === password) {
            localStorage.setItem('hanime_token', user.id);
            return user;
        }
        return null;
    },

    async register(name: string, email: string, password: string): Promise<User | null> {
        await simulateDelay();
        if (DB.users.some(u => u.email === email)) {
            return null; // Email already exists
        }
        const newUser: User = {
            id: `user-${Date.now()}`,
            name,
            email,
            emailVerified: false,
            avatar: `https://picsum.photos/seed/${name}/200/200`,
            joinDate: new Date().toISOString().split('T')[0],
            favorites: [],
            watchList: [],
            watchProgress: {},
            settings: initialSettings,
        };
        DB.users.push(newUser);
        DB.passwords[newUser.id] = password;
        saveDb();
        localStorage.setItem('hanime_token', newUser.id);
        return newUser;
    },

    logout() {
        localStorage.removeItem('hanime_token');
    },

    async getCurrentUser(): Promise<User | null> {
        await simulateDelay(200);
        const userId = localStorage.getItem('hanime_token');
        if (!userId) return null;
        return DB.users.find(u => u.id === userId) || null;
    },

    async updateProfile(userId: string, data: Partial<User>): Promise<boolean> {
        await simulateDelay();
        const userIndex = DB.users.findIndex(u => u.id === userId);
        if (userIndex > -1) {
            DB.users[userIndex] = { ...DB.users[userIndex], ...data };
            saveDb();
            return true;
        }
        return false;
    }
};
