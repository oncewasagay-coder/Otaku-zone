import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Anime, Episode } from '../types';
import { useAppStore } from '../stores/useAppStore';
import { api } from '../services/api';
import { PlayerShell } from '../components/player/PlayerShell';
import { EpisodeList } from '../components/EpisodeList';

interface WatchPageProps {
  slug: string;
  epSlug: string;
}

export const WatchPage: React.FC<WatchPageProps> = ({ slug, epSlug }) => {
  const [anime, setAnime] = useState<Anime | null>(null);
  const { user, setView } = useAppStore();

  useEffect(() => {
    const fetchAnime = async () => {
      const { data } = await api.getAnimeBySlug(slug);
      setAnime(data);
    };
    fetchAnime();
  }, [slug]);

  const currentEpisode = useMemo(() => {
    return anime?.episodes.find(e => e.slug === epSlug);
  }, [anime, epSlug]);

  const handleNextEpisode = () => {
      if (!anime || !currentEpisode) return;
      const nextEpIndex = anime.episodes.findIndex(e => e.id === currentEpisode.id) + 1;
      if (nextEpIndex < anime.episodes.length) {
          const nextEp = anime.episodes[nextEpIndex];
          setView({ type: 'watch', slug: anime.slug, ep: nextEp.slug });
      }
  };

  if (!anime || !currentEpisode) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" style={{borderColor: 'var(--brand)', borderTopColor: 'transparent'}}></div>
      </div>
    );
  }
  
  const getTitle = (a: Anime) => user?.settings.titleLang === 'JP' && a.titleJP ? a.titleJP : a.titleEN;

  return (
    <main className="p-4 sm:p-6 max-w-full">
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 xl:w-2/3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <PlayerShell 
                anime={anime}
                episode={currentEpisode}
                onNextEpisode={handleNextEpisode}
             />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 bg-bg-elevated rounded-2xl p-6 border border-border">
              <h1 className="text-2xl font-bold">{getTitle(anime)}</h1>
              <h2 className="text-lg text-brand font-semibold mt-1">Episode {currentEpisode.number} {currentEpisode.title ? `- ${currentEpisode.title}` : ''}</h2>
              <p className="text-text-secondary mt-4 text-sm leading-relaxed line-clamp-3">{anime.synopsis}</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="w-full xl:w-1/3">
           <EpisodeList anime={anime} />
        </motion.div>
      </div>
    </main>
  );
};
