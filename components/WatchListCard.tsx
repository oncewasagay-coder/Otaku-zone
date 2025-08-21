
import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Tv, Calendar } from 'lucide-react';
import { Anime } from '../types';
import { ImageWithLoader } from './ImageWithLoader';
import { useAppStore } from '../stores/useAppStore';

interface WatchListCardProps {
  anime: Anime;
  index: number;
}

export const WatchListCard: React.FC<WatchListCardProps> = ({ anime, index }) => {
  const { user } = useAppStore();

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
      <div className="relative rounded-xl overflow-hidden bg-gray-800/50 border border-transparent hover:border-pink-500/50 transition-colors">
        <div className="aspect-[2/3] overflow-hidden">
          <ImageWithLoader 
            src={anime.poster} 
            alt={getAnimeTitle(anime)} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        </div>
        
        <motion.button
          className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white/70 hover:text-white transition-colors z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </motion.button>

        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-white truncate text-sm mb-1 group-hover:text-pink-400 transition-colors">{getAnimeTitle(anime)}</h3>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs text-gray-400 mb-2">
            <div className="flex items-center gap-1"><Tv size={12}/><span>{anime.type}</span></div>
            {anime.year && <><span className="text-gray-600">•</span><div className="flex items-center gap-1"><Calendar size={12}/><span>{anime.year}</span></div></>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
