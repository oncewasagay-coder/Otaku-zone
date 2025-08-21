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
}

export type ViewType = 'home' | 'watch' | 'library' | 'profile' | 'settings';

export interface WatchProgress {
  [animeId: number]: {
    watchedEpisodes: number;
    totalEpisodes: number;
  }
}
