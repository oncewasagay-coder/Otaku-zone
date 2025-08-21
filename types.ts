
export type AudioLang = 'hi' | 'en' | 'ja';

export interface Episode {
  id: string;
  number: number;
  title?: string;
  slug: string;
  durationSec?: number;
  mediaId: string;
  availableAudios: AudioLang[];
}

export interface Anime {
  id:string;
  slug: string;
  titleEN: string;
  titleJP?: string;
  synopsis: string;
  poster: string;
  banner?: string;
  genres: string[];
  year?: number;
  status: 'Ongoing' | 'Completed';
  type: 'TV Series' | 'Movie' | 'OVA' | 'ONA' | 'Special';
  availableAudios: AudioLang[];
  episodes: Episode[];
}

export type ListFolder = 'Watching' | 'On-Hold' | 'Plan to Watch' | 'Dropped' | 'Completed';
export type WatchListStatus = 'All' | ListFolder;


export interface HistoryItem {
  animeId: string;
  epId: string;
  positionSec: number;
  updatedAt: string;
}

export interface WatchProgressDetail {
  watchedTime: number;
  totalTime: number;
  watchedEpisodes: number;
  totalEpisodes: number;
}

export type WatchProgress = {
  [animeId: string]: WatchProgressDetail;
};

export interface Settings {
  autoPlay: boolean;
  autoNext: boolean;
  autoSkipIntro: boolean;
  titleLang: 'EN' | 'JP';
  preferredAudio: AudioLang;
  enableDub: boolean;
  playOriginalAudio: boolean;
  animeNameLanguage: 'English' | 'Japanese';
  showCommentsAtHome: boolean;
  publicWatchList: boolean;
  notificationIgnoreFolders: ListFolder[];
  notificationIgnoreLanguage: 'None' | 'SUB' | 'DUB';
}

export interface User {
  id: string;
  email: string;
  name:string;
  avatar?: string;
  verified: boolean;
  publicLibrary: boolean;
  settings: Settings;
  watchHistory: HistoryItem[];
}

export interface LibraryEntry {
  animeId: string;
  folder: ListFolder;
  addedAt: string;
}

export type View =
  | { type: 'home' }
  | { type: 'auth' }
  | { type: 'anime_detail'; slug: string }
  | { type: 'watch'; slug: string; ep: string }
  | { type: 'library' }
  | { type: 'continue_watching' }
  | { type: 'profile' }
  | { type: 'settings' }
  | { type: 'notifications' }
  | { type: 'mal' };
  
export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}
