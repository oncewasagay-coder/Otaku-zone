import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { Anime } from '../types';
import { AnimeCard } from '../components/AnimeCard';

interface HomePageProps {
  allAnime: Anime[];
  onWatch: (anime: Anime) => void;
  onAddToWatchList: (animeId: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  getAnimeTitle: (anime: Anime) => string;
}

const navLinks = ['Home', 'Movies', 'TV Series', 'Most Popular', 'Top Airing'];
const topSearches = ['One Piece', 'Demon Slayer', 'Dan Da Dan Season 2', 'Kaiju No. 8 Season 2', 'The Fragrant Flower...', 'Sakamoto Days Part 2', 'Attack on Titan'];

export const HomePage: React.FC<HomePageProps> = ({ allAnime, onWatch, onAddToWatchList, searchQuery, setSearchQuery, getAnimeTitle }) => {
  const [activeNav, setActiveNav] = useState('Home');

  const filteredAnime = useMemo(() => {
    let animeList = [...allAnime];

    if (searchQuery) {
        return animeList.filter(anime =>
            anime.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            anime.japanese.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    switch (activeNav) {
        case 'Movies':
            animeList = animeList.filter(a => a.type === 'Movie');
            break;
        case 'TV Series':
            animeList = animeList.filter(a => a.type === 'TV Series');
            break;
        case 'Most Popular':
            animeList.sort((a, b) => b.rating - a.rating);
            break;
        case 'Top Airing':
            animeList = animeList.filter(a => a.status === 'Ongoing');
            break;
        case 'Home':
        default:
            // No filter, use original list
            break;
    }
    return animeList;
  }, [allAnime, searchQuery, activeNav]);

  const heroAnime = allAnime.find(a => a.featured);

  return (
    <main className="bg-[#030712]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-[500px] p-6 sm:p-8 lg:p-12 rounded-b-3xl overflow-hidden flex flex-col justify-between bg-[#14141c]"
        style={{
            background: `
                linear-gradient(90deg, #14141c 40%, rgba(20, 20, 28, 0.7) 60%, rgba(20, 20, 28, 0.2) 100%), 
                url('https://picsum.photos/seed/fmab-banner/1200/400') no-repeat right 20% center/35%,
                url('https://picsum.photos/seed/jjk-banner/1200/400') no-repeat right top/50%
            `,
            backgroundColor: '#14141c'
        }}
      >
        {/* Header */}
        <header className="flex items-center justify-between">
            <div></div>
            <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
                <button 
                    key={link}
                    onClick={() => setActiveNav(link)}
                    className={`text-sm font-medium transition-colors ${activeNav === link ? 'text-white font-semibold' : 'text-gray-400 hover:text-white'}`}
                >
                    {link}
                </button>
            ))}
          </div>
        </header>

        {/* Hero Content */}
        <div className="max-w-xl text-white">
          <h1 className="text-5xl font-extrabold mb-4">h!anime</h1>
          
          <div className="relative mb-4">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anime..."
              className="w-full py-4 pl-6 pr-16 bg-white/90 text-gray-900 rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button className="absolute top-1/2 right-3 -translate-y-1/2 p-2 bg-pink-400 text-white rounded-md hover:bg-pink-500 transition-colors">
                <Search className="w-5 h-5" />
            </button>
          </div>
          
          <div className="text-xs text-gray-300 mb-6">
              <span className="font-semibold">Top search:</span>
              <span className="text-gray-400 ml-2">
                  {topSearches.slice(0, 7).join(', ')}...
              </span>
          </div>

          <motion.button 
            onClick={() => heroAnime && onWatch(heroAnime)}
            className="flex items-center gap-3 py-3 px-6 bg-pink-400 text-black font-bold rounded-lg hover:bg-pink-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Watch anime <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
        <div /> {/* Spacer */}
      </motion.div>

      <section className="p-4 sm:p-6">
        <h3 className="text-xl font-bold text-white mb-4">{searchQuery ? `Results for "${searchQuery}"` : activeNav}</h3>
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          <AnimatePresence>
            {filteredAnime.map((anime, index) => (
              <AnimeCard key={anime.id} anime={anime} index={index} onWatch={onWatch} onAddToWatchList={onAddToWatchList} getAnimeTitle={getAnimeTitle} />
            ))}
          </AnimatePresence>
        </motion.div>
        {filteredAnime.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <h3 className="text-lg text-gray-400 mb-2">No anime found</h3>
            <p className="text-gray-500">Try a different search or filter.</p>
          </motion.div>
        )}
      </section>
    </main>
  );
};
