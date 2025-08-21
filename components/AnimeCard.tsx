import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Anime, AudioLang } from '../types';
import { ImageWithLoader } from './ImageWithLoader';
import { useAppStore } from '../stores/useAppStore';

interface AnimeCardProps {
  anime: Anime;
  index: number;
}

const AudioTag: React.FC<{ lang: AudioLang }> = ({ lang }) => {
    const langMap = { hi: 'HI', en: 'EN', ja: 'JA' };
    const colorMap = {
        hi: 'bg-orange-500/20 text-orange-400',
        en: 'bg-blue-500/20 text-blue-400',
        ja: 'bg-pink-500/20 text-pink-400',
    };
    return <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${colorMap[lang]}`}>{langMap[lang]}</span>
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, index }) => {
  const { setView, user } = useAppStore();
  
  const getTitle = () => {
      return user?.settings.titleLang === 'JP' && anime.titleJP ? anime.titleJP : anime.titleEN;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="cursor-pointer group"
      onClick={() => setView({ type: 'anime_detail', slug: anime.slug })}
      layout
    >
      <div className="relative rounded-xl overflow-hidden bg-bg-elevated border border-border transition-all duration-300 hover:border-brand/50 hover:-translate-y-1">
        <div className="aspect-[2/3] overflow-hidden">
          <ImageWithLoader 
            src={anime.poster} 
            alt={anime.titleEN} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 bg-brand/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="font-semibold text-text-primary truncate text-sm mb-1.5 group-hover:text-brand transition-colors">{getTitle()}</h3>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">{anime.type}</span>
            <div className="flex items-center gap-1.5">
                {anime.availableAudios.map(lang => <AudioTag key={lang} lang={lang} />)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
