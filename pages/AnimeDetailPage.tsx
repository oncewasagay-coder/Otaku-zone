
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, Check, List, ArrowDownUp } from 'lucide-react';
import { Anime } from '../types';
import { ImageWithLoader } from '../components/ImageWithLoader';
import { useAppStore } from '../stores/useAppStore';
import { api } from '../services/api';
import { EpisodeList } from '../components/EpisodeList';

interface AnimeDetailPageProps {
  slug: string;
}

export const AnimeDetailPage: React.FC<AnimeDetailPageProps> = ({ slug }) => {
  const [anime, setAnime] = useState<Anime | null>(null);
  const { user, library, addToLibrary, setView } = useAppStore();
  
  useEffect(() => {
    const fetchAnime = async () => {
      const { data } = await api.getAnimeBySlug(slug);
      setAnime(data);
    };
    fetchAnime();
  }, [slug]);

  if (!anime) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" style={{borderColor: 'var(--brand)', borderTopColor: 'transparent'}}></div>
      </div>
    );
  }

  const getTitle = (a: Anime) => user?.settings.titleLang === 'JP' && a.titleJP ? a.titleJP : a.titleEN;

  const libraryEntry = library.find(item => item.animeId === anime.id);
  const isInLibrary = !!libraryEntry;

  return (
    <main>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[450px]"
      >
        <ImageWithLoader src={anime.banner || anime.poster} alt={anime.titleEN} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-transparent" />
      </motion.div>

      <div className="p-4 sm:p-6 -mt-32 relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-48 flex-shrink-0">
            <ImageWithLoader src={anime.poster} alt={anime.titleEN} className="rounded-lg aspect-[2/3] shadow-lg" />
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{getTitle(anime)}</h1>
            {user?.settings.titleLang === 'EN' && anime.titleJP && <p className="text-text-secondary mb-4">{anime.titleJP}</p>}
            
            <div className="flex flex-wrap gap-2 mb-6">
              {anime.genres.map(g => (
                <span key={g} className="text-xs bg-white/5 text-text-secondary py-1 px-3 rounded-full">{g}</span>
              ))}
            </div>
            
            <p className="text-text-secondary leading-relaxed mb-6 line-clamp-4">{anime.synopsis}</p>
            
            <div className="flex items-center gap-4">
              <motion.button 
                onClick={() => setView({type: 'watch', slug: anime.slug, ep: anime.episodes[0].slug})}
                className="flex items-center gap-2 py-3 px-6 bg-brand text-white font-bold rounded-lg"
                style={{ backgroundColor: 'var(--brand)'}}
                whileHover={{ scale: 1.05 }}
              >
                <Play className="w-5 h-5" /> Watch Now
              </motion.button>
              <motion.button 
                onClick={() => addToLibrary(anime.id, 'Plan to Watch')}
                className={`flex items-center gap-2 py-3 px-6 rounded-lg font-bold border ${
                    isInLibrary ? 'bg-accent/20 border-accent text-accent' : 'bg-white/5 border-border text-text-primary'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {isInLibrary ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {isInLibrary ? libraryEntry.folder : 'Add to Library'}
              </motion.button>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-12">
            <EpisodeList anime={anime} />
        </motion.div>
      </div>
    </main>
  );
};
