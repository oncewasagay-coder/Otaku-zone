import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Play, Plus, Star } from 'lucide-react';
import { Anime } from '../types';
import { ImageWithLoader } from './ImageWithLoader';
import { useAuth } from '../contexts/AuthContext';

interface FeaturedHeroProps {
  anime: Anime;
  onWatch: (anime: Anime) => void;
  onAddToWatchList: (animeId: number) => void;
  getAnimeTitle: (anime: Anime) => string;
}

export const FeaturedHero: React.FC<FeaturedHeroProps> = ({ anime, onWatch, onAddToWatchList, getAnimeTitle }) => {
  const { isAuthenticated } = useAuth();

  if (!anime) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative h-[450px] rounded-2xl overflow-hidden mb-8 cursor-pointer group"
      onClick={() => onWatch(anime)}
    >
      <div className="absolute inset-0">
        <ImageWithLoader 
            src={anime.banner} 
            alt={anime.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      </div>
      
      <div className="relative z-10 h-full flex items-center p-8">
        <div className="max-w-lg">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-4 font-semibold text-amber-400"
          >
            <Flame className="w-5 h-5 text-red-500" />
            <span>Featured Anime</span>
          </motion.div>
          
          <motion.h2
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight"
          >
            {getAnimeTitle(anime)}
          </motion.h2>
          
          <motion.p
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 mb-6 line-clamp-3 text-base sm:text-lg"
          >
            {anime.description}
          </motion.p>
          
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 mb-6 text-sm text-gray-400"
          >
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-current" />
              <span>{anime.rating}</span>
            </div>
            <span className="text-gray-600">•</span>
            <span>{anime.year}</span>
            <span className="text-gray-600">•</span>
            <span>{anime.episodes} episodes</span>
          </motion.div>
          
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              className="bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-8 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
              whileHover={{ scale: 1.05, background: 'linear-gradient(to right, #dc2626, #b91c1c)' }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onWatch(anime); }}
            >
              <Play className="w-5 h-5" />
              Watch Now
            </motion.button>
            {isAuthenticated && (
              <motion.button
                className="bg-gray-700/80 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(75, 85, 99, 0.8)' }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); onAddToWatchList(anime.id); }}
              >
                <Plus className="w-5 h-5" />
                Add to List
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
