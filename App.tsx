import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { WatchPage } from './pages/WatchPage';
import { LibraryPage } from './pages/LibraryPage';
import { Anime, ViewType, WatchProgress } from './types';
import { animeDatabase } from './constants';
import { useMediaQuery } from './hooks/useMediaQuery';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [favorites, setFavorites] = useState<number[]>([1, 4]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('trending');
  
  // Mock watch progress data
  const [watchProgress, setWatchProgress] = useState<WatchProgress>({
    2: { watchedEpisodes: 10, totalEpisodes: 44 },
    6: { watchedEpisodes: 220, totalEpisodes: 220 },
  });

  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [isSidebarOpen, setSidebarOpen] = useState(isDesktop);

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const trendingAnime = useMemo(() => animeDatabase.filter(anime => anime.trending), []);
  const featuredAnime = useMemo(() => animeDatabase.filter(anime => anime.featured), []);
  const favoriteAnime = useMemo(() => animeDatabase.filter(anime => favorites.includes(anime.id)), [favorites]);

  const toggleFavorite = (animeId: number) => {
    setFavorites(prev =>
      prev.includes(animeId)
        ? prev.filter(id => id !== animeId)
        : [...prev, animeId]
    );
  };

  const watchAnime = (anime: Anime) => {
    setSelectedAnime(anime);
    setCurrentView('watch');
  };

  const backToHome = () => {
    setCurrentView('home');
    setSelectedAnime(null);
  }

  const handleSetCurrentView = (view: ViewType) => {
      setSelectedAnime(null);
      setCurrentView(view);
  }

  const renderView = () => {
    switch (currentView) {
      case 'watch':
        return selectedAnime && (
          <motion.div
            key="watch"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <WatchPage anime={selectedAnime} />
          </motion.div>
        );
      case 'library':
        return (
          <motion.div
            key="library"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <LibraryPage 
              favoriteAnime={favoriteAnime} 
              favorites={favorites}
              watchProgress={watchProgress}
              onWatch={watchAnime}
              onToggleFavorite={toggleFavorite}
            />
          </motion.div>
        );
      case 'home':
      default:
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <HomePage 
              allAnime={animeDatabase}
              trendingAnime={trendingAnime}
              featuredAnime={featuredAnime}
              favorites={favorites}
              onWatch={watchAnime}
              onToggleFavorite={toggleFavorite}
              searchQuery={searchQuery}
              activeTab={activeTab}
            />
          </motion.div>
        );
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white flex">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={handleSetCurrentView} 
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 lg:ml-64">
        <Header 
            currentView={currentView}
            onSetCurrentView={handleSetCurrentView}
            onBack={backToHome}
            selectedAnime={selectedAnime}
            onToggleFavorite={toggleFavorite}
            isFavorite={selectedAnime ? favorites.includes(selectedAnime.id) : false}
            onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        />
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
