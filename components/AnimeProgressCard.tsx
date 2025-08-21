
import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Anime, WatchProgressDetail } from '../types';
import { ImageWithLoader } from './ImageWithLoader';
import { useAppStore } from '../stores/useAppStore';

interface AnimeProgressCardProps {
  anime: Anime;
  progress: WatchProgressDetail;
  index: number;
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  return new Date(seconds * 1000).toISOString().substr(14, 5);
};

export const AnimeProgressCard: React.FC<AnimeProgressCardProps> = ({ anime, progress, index }) => {
  const { user } = useAppStore();
  const progressPercent = (progress.watchedTime / progress.totalTime) * 100;
  
  const getAnimeTitle = (anime: Anime) => {
      return user?.settings.titleLang === 'JP' && anime.titleJP ? anime.titleJP : anime.titleEN;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="cursor-pointer group"
      layout
    >
      <div className="relative rounded-2xl overflow-hidden bg-gray-800/50 border border-gray-700/50 transition-all duration-300 hover:border-pink-500/50 hover:-translate-y-1">
        <div className="aspect-[2/3] overflow-hidden">
          <ImageWithLoader 
            src={anime.poster} 
            alt={getAnimeTitle(anime)} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-12 h-12 text-white" />
          </div>
          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-bold py-1 px-2 rounded">
            EP {progress.watchedEpisodes}
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="font-semibold text-white truncate text-sm mb-2">{getAnimeTitle(anime)}</h3>
          <div className="w-full bg-gray-600 rounded-full h-1.5 mb-1">
            <div 
              className="bg-pink-500 h-1.5 rounded-full" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(progress.watchedTime)}</span>
            <span>{formatTime(progress.totalTime)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
