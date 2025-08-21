import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Library, Play, Star, Users } from 'lucide-react';
import { Anime } from '../types';
import { ImageWithLoader } from '../components/ImageWithLoader';

interface WatchPageProps {
  anime: Anime;
  getAnimeTitle: (anime: Anime) => string;
}

export const WatchPage: React.FC<WatchPageProps> = ({ anime, getAnimeTitle }) => {
  const [currentEpisode, setCurrentEpisode] = useState(1);

  return (
    <main className="p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-gray-800/50 backdrop-blur rounded-2xl overflow-hidden mb-6 border border-gray-700/50"
        >
          <div className="aspect-video bg-black flex items-center justify-center relative text-white">
            <Play className="w-12 h-12 sm:w-20 sm:h-20 opacity-50" />
            <div className="absolute bottom-4 left-4 text-left">
                <p className="text-lg font-semibold">{getAnimeTitle(anime)}</p>
                <p className="text-sm text-gray-300">Episode {currentEpisode}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.2 }} 
              className="lg:col-span-2 bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700/50"
          >
            <div className="flex flex-col sm:flex-row gap-6">
              <ImageWithLoader src={anime.poster} alt={anime.title} className="w-32 h-48 object-cover rounded-xl flex-shrink-0 mx-auto sm:mx-0" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">{getAnimeTitle(anime)}</h1>
                <p className="text-gray-400 mb-4">{getAnimeTitle(anime) === anime.title ? anime.japanese : anime.title}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-400"><Star className="w-4 h-4 fill-current" /> {anime.rating}</div>
                  <div className="flex items-center gap-1.5 text-gray-300"><Calendar className="w-4 h-4 text-gray-400" /> {anime.year}</div>
                  <div className="flex items-center gap-1.5 text-gray-300"><Clock className="w-4 h-4 text-gray-400" /> {anime.duration}</div>
                  <div className="flex items-center gap-1.5 text-gray-300"><Users className="w-4 h-4 text-gray-400" /> {anime.status}</div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {anime.genre.map(g => <span key={g} className="text-xs font-semibold bg-gradient-to-r from-red-500/20 to-purple-500/20 text-red-300 py-1 px-3 rounded-full border border-red-500/30">{g}</span>)}
                </div>
                <p className="text-gray-300 leading-relaxed mb-6">{anime.description}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.3 }} 
              className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700/50"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Library className="w-5 h-5 text-purple-400" /> Episodes</h3>
            <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
              {Array.from({ length: anime.episodes }, (_, i) => {
                const episodeNum = i + 1;
                const isPlaying = episodeNum === currentEpisode;
                return (
                  <motion.div 
                    key={i} 
                    className={`relative flex items-center justify-between p-4 rounded-xl transition-colors cursor-pointer ${isPlaying ? 'bg-red-500/10' : 'bg-gray-700/30 hover:bg-gray-700/50'}`} 
                    whileHover={{ scale: 1.02, x: 4 }} 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentEpisode(episodeNum)}
                  >
                     {isPlaying && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl" />}
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 flex items-center justify-center rounded-md font-bold text-sm flex-shrink-0 ${isPlaying ? 'bg-red-500/20 border border-red-500/30 text-white' : 'bg-gradient-to-br from-red-500/20 to-purple-500/20 border border-red-500/30'}`}>{episodeNum}</div>
                      <div>
                        <h4 className="font-semibold text-white">Episode {episodeNum}</h4>
                        <p className="text-xs text-gray-400">24 min</p>
                      </div>
                    </div>
                    <Play className={`w-5 h-5 flex-shrink-0 ${isPlaying ? 'text-red-400' : 'text-gray-400'}`} />
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};
