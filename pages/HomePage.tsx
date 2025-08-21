import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
import { animeDatabase } from '../constants';
import { AnimeCard } from '../components/AnimeCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { useAppStore } from '../stores/useAppStore';

const HeroSection = ({ onWatch }) => {
    const heroAnime = animeDatabase.find(a => a.id === "4"); // Jujutsu Kaisen
    if (!heroAnime) return null;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[400px] rounded-2xl overflow-hidden p-8 flex flex-col justify-end"
            style={{
                background: `linear-gradient(to top, rgba(17, 24, 39, 1) 10%, rgba(17, 24, 39, 0.5) 50%, transparent), url(${heroAnime.banner})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <h1 className="text-4xl font-bold text-white mb-2">{heroAnime.titleEN}</h1>
            <p className="max-w-xl text-text-secondary mb-4 line-clamp-2">{heroAnime.synopsis}</p>
            <motion.button 
                onClick={() => onWatch(heroAnime)}
                className="flex items-center gap-3 py-3 px-6 bg-brand text-white font-bold rounded-lg w-fit"
                style={{ backgroundColor: 'var(--brand)'}}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Watch Now <ArrowRight className="w-5 h-5" />
            </motion.button>
        </motion.div>
    )
}

export const HomePage: React.FC = () => {
  const { filters, setView, toggleFilterSidebar } = useAppStore();

  const filteredAnime = useMemo(() => {
    return animeDatabase.filter(anime => {
        const titleMatch = filters.query ? anime.titleEN.toLowerCase().includes(filters.query.toLowerCase()) || anime.titleJP?.toLowerCase().includes(filters.query.toLowerCase()) : true;
        const genreMatch = filters.genre.length > 0 ? filters.genre.every(g => anime.genres.includes(g)) : true;
        const yearMatch = filters.year ? anime.year === parseInt(filters.year, 10) : true;
        const statusMatch = filters.status ? anime.status === filters.status : true;
        const typeMatch = filters.type ? anime.type === filters.type : true;
        const audioMatch = filters.audio.length > 0 ? filters.audio.every(a => anime.availableAudios.includes(a)) : true;
        
        return titleMatch && genreMatch && yearMatch && statusMatch && typeMatch && audioMatch;
    });
  }, [filters]);

  const handleWatch = (anime) => {
    setView({ type: 'anime_detail', slug: anime.slug });
  };
  
  return (
    <main className="flex">
      <FilterSidebar />
      <div className="flex-1 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Discover</h2>
            <button onClick={toggleFilterSidebar} className="p-2 rounded-md bg-bg-elevated border border-border lg:hidden">
                <SlidersHorizontal className="w-5 h-5" />
            </button>
        </div>

        <HeroSection onWatch={handleWatch} />
        
        <section className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Trending Now</h3>
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                <AnimatePresence>
                    {filteredAnime.map((anime, index) => (
                    <AnimeCard key={anime.id} anime={anime} index={index} />
                    ))}
                </AnimatePresence>
            </motion.div>
            {filteredAnime.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 rounded-2xl bg-bg-elevated mt-4">
                <h3 className="text-lg text-text-secondary mb-2">No anime found</h3>
                <p className="text-text-secondary/70">Try adjusting your filters.</p>
            </motion.div>
            )}
        </section>
      </div>
    </main>
  );
};