import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock, CheckCircle } from 'lucide-react';
import { Anime, WatchProgress } from '../types';
import { AnimeCard } from '../components/AnimeCard';

interface LibraryPageProps {
  favoriteAnime: Anime[];
  favorites: number[];
  watchProgress: WatchProgress;
  onWatch: (anime: Anime) => void;
  onToggleFavorite: (animeId: number) => void;
}

const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: string, description: string, className: string }> = ({ icon, title, value, description, className }) => (
    <motion.div
      className={`p-6 rounded-2xl border ${className}`}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <div className="flex items-center gap-4 mb-4">
        {icon}
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <p className="text-4xl font-extrabold text-white mb-1">{value}</p>
      <p className="text-gray-400">{description}</p>
    </motion.div>
);

export const LibraryPage: React.FC<LibraryPageProps> = ({ favoriteAnime, favorites, watchProgress, onWatch, onToggleFavorite }) => {
  const watchingCount = Object.values(watchProgress).filter(p => p.watchedEpisodes > 0 && p.watchedEpisodes < p.totalEpisodes).length;
  const completedCount = Object.values(watchProgress).filter(p => p.watchedEpisodes === p.totalEpisodes).length;

  return (
    <main className="p-4 sm:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<Heart className="w-8 h-8 text-red-400" />} title="Favorites" value={favoriteAnime.length.toString()} description="Anime in your list" className="bg-gradient-to-br from-red-500/10 to-gray-900 border-red-500/20" />
          <StatCard icon={<Clock className="w-8 h-8 text-blue-400" />} title="Watching" value={watchingCount.toString()} description="Currently in progress" className="bg-gradient-to-br from-blue-500/10 to-gray-900 border-blue-500/20" />
          <StatCard icon={<CheckCircle className="w-8 h-8 text-green-400" />} title="Completed" value={completedCount.toString()} description="Finished series" className="bg-gradient-to-br from-green-500/10 to-gray-900 border-green-500/20" />
      </div>

      <section>
        <h3 className="text-xl font-bold text-white mb-4">My Favorite Anime</h3>
        {favoriteAnime.length > 0 ? (
           <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {favoriteAnime.map((anime, index) => (
                  <AnimeCard key={anime.id} anime={anime} index={index} onWatch={onWatch} isFavorite={favorites.includes(anime.id)} onToggleFavorite={onToggleFavorite} />
              ))}
          </motion.div>
        ) : (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-gray-800/50 rounded-2xl">
            <h3 className="text-lg text-gray-400 mb-2">Your list is empty</h3>
            <p className="text-gray-500">Add some anime to your favorites to see them here.</p>
          </motion.div>
        )}
      </section>
    </main>
  );
};
