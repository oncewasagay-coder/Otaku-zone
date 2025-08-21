export interface Anime {
  id: number;
  title: string;
  japanese: string;
  poster: string;
  banner: string;
  rating: number;
  year: number;
  status: string;
  episodes: number;
  duration: string;
  genre: string[];
  description: string;
  trending: boolean;
  featured: boolean;
  subs: number;
  dubs: number;
  type: 'TV Series' | 'Movie';
}

export type ViewType = 'home' | 'watch' | 'library' | 'profile' | 'settings';

export interface WatchProgressDetail {
    watchedEpisodes: number;
    totalEpisodes: number;
    watchedTime: number; // in seconds for the current episode
    totalTime: number; // in seconds for the current episode
}

export interface WatchProgress {
  [animeId: string]: WatchProgressDetail;
}

export type WatchListStatus = 'All' | 'Watching' | 'On-Hold' | 'Plan to Watch' | 'Dropped' | 'Completed';

export interface WatchListItem {
  animeId: number;
  status: WatchListStatus;
}

export interface UserSettings {
  autoNext: boolean;
  autoPlay: boolean;
  autoSkipIntro: boolean;
  enableDub: boolean;
  playOriginalAudio: boolean;
  animeNameLanguage: 'English' | 'Japanese';
  showCommentsAtHome: boolean;
  publicWatchList: boolean;
  notificationIgnoreFolders: WatchListStatus[];
  notificationIgnoreLanguage: 'None' | 'SUB' | 'DUB';
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  avatar: string;
  joinDate: string;
  favorites: number[];
  watchList: WatchListItem[];
  watchProgress: WatchProgress;
  settings: UserSettings;
}
