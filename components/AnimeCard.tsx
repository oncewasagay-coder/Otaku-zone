import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Play, Star } from 'lucide-react';
import { Anime } from '../types';
import { ImageWithLoader } from './ImageWithLoader';
import { useAuth } from '../contexts/AuthContext';

interface AnimeCardProps {
  anime: Anime;
  index: number;
  onWatch: (anime: Anime) => void;
  onAddToWatchList: (animeId: number) => void;
  getAnimeTitle: (anime: Anime) => string;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, index, onWatch, onAddToWatchList, getAnimeTitle }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="cursor-pointer group"
      onClick={() => onWatch(anime)}
      layout
    >
      <div className="relative rounded-2xl overflow-hidden bg-gray-800/50 border border-gray-700/50 transition-all duration-300 hover:border-gray-500/50 hover:-translate-y-1">
        <div className="aspect-[2/3] overflow-hidden">
          <ImageWithLoader 
            src={anime.poster} 
            alt={anime.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        
        {isAuthenticated && (
          <motion.button
            className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full opacity-0 transition-all group-hover:opacity-100 z-10 text-white hover:text-pink-400"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToWatchList(anime.id);
            }}
            aria-label="Add to watch list"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        )}
        
        <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 transition-all duration-300 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
          <div className="bg-black/70 backdrop-blur-md rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2 text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-3 h-3 fill-current" />
                <span>{anime.rating}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300">{anime.year}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300">{anime.episodes} eps</span>
            </div>
            <motion.button
              className="w-full bg-gradient-to-r from-red-500 to-purple-500 text-white py-2 px-4 rounded-md font-semibold text-sm flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            >
              <Play className="w-4 h-4" />
              Watch Now
            </motion.button>
          </div>
        </div>

        <div className="p-4 transition-opacity group-hover:opacity-0">
          <h3 className="font-semibold text-white truncate">{getAnimeTitle(anime)}</h3>
          <p className="text-gray-400 text-sm truncate mb-2">{getAnimeTitle(anime) === anime.title ? anime.japanese : anime.title}</p>
          <div className="flex flex-wrap gap-1">
            {anime.genre.slice(0, 2).map(g => (
              <span key={g} className="text-xs bg-gray-700/50 text-gray-300 py-0.5 px-2 rounded-full">{g}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
