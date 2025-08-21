import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Flame, Heart } from 'lucide-react';
import { Anime } from '../types';
import { FeaturedHero } from '../components/FeaturedHero';
import { AnimeCard } from '../components/AnimeCard';

interface HomePageProps {
  allAnime: Anime[];
  trendingAnime: Anime[];
  featuredAnime: Anime[];
  favorites: number[];
  onWatch: (anime: Anime) => void;
  onToggleFavorite: (animeId: number) => void;
  searchQuery: string;
  activeTab: string;
}

export const HomePage: React.FC<HomePageProps> = ({ allAnime, trendingAnime, featuredAnime, favorites, onWatch, onToggleFavorite, searchQuery, activeTab }) => {
  const filteredAnime = allAnime.filter(anime =>
    anime.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    anime.japanese.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDisplayAnime = () => {
    if (searchQuery) return filteredAnime;
    if (activeTab === 'trending') return trendingAnime;
    if (activeTab === 'featured') return featuredAnime;
    if (activeTab === 'favorites') return allAnime.filter(anime => favorites.includes(anime.id));
    return allAnime;
  };
  
  const displayAnime = getDisplayAnime();
  const heroAnime = featuredAnime[0];

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'featured', label: 'Featured', icon: Flame },
    { id: 'favorites', label: 'My List', icon: Heart }
  ];

  const getSectionTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    const activeTabData = tabs.find(t => t.id === activeTab);
    return (
      <span className="flex items-center gap-2">
        {activeTabData && <activeTabData.icon className="w-5 h-5" />}
        {activeTabData?.label} Now
      </span>
    );
  };
  
  return (
    <main className="p-4 sm:p-6">
      {!searchQuery && activeTab !== 'favorites' && heroAnime && (
        <FeaturedHero anime={heroAnime} onWatch={onWatch} isFavorite={favorites.includes(heroAnime.id)} onToggleFavorite={onToggleFavorite} />
      )}
      
      <section>
        <h3 className="text-xl font-bold text-white mb-4">{getSectionTitle()}</h3>
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          <AnimatePresence>
            {displayAnime.map((anime, index) => (
              <AnimeCard key={anime.id} anime={anime} index={index} onWatch={onWatch} isFavorite={favorites.includes(anime.id)} onToggleFavorite={onToggleFavorite} />
            ))}
          </AnimatePresence>
        </motion.div>
        {displayAnime.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <h3 className="text-lg text-gray-400 mb-2">No anime found</h3>
            <p className="text-gray-500">Try a different search or filter.</p>
          </motion.div>
        )}
      </section>
    </main>
  );
};
