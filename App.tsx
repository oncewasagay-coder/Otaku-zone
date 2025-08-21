import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { WatchPage } from './pages/WatchPage';
import { LibraryPage } from './pages/LibraryPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { Toast } from './components/Toast';
import { Anime, ViewType, WatchProgress, WatchListItem, UserSettings, User } from './types';
import { animeDatabase } from './constants';
import { useMediaQuery } from './hooks/useMediaQuery';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { api } from './services/api';

const AppContent: React.FC = () => {
  const { user, updateUser, updateSettings, isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  // States that now depend on the authenticated user
  const [favorites, setFavorites] = useState<number[]>([]);
  const [watchList, setWatchList] = useState<WatchListItem[]>([]);
  const [watchProgress, setWatchProgress] = useState<WatchProgress>({});
  
  useEffect(() => {
    if (isAuthenticated && user) {
      setFavorites(user.favorites);
      setWatchList(user.watchList);
      setWatchProgress(user.watchProgress);
    } else {
      setFavorites([]);
      setWatchList([]);
      setWatchProgress({});
    }
  }, [isAuthenticated, user]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [isSidebarOpen, setSidebarOpen] = useState(isDesktop);

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const favoriteAnime = useMemo(() => animeDatabase.filter(anime => favorites.includes(anime.id)), [favorites]);

  const continueWatchingItems = useMemo(() => {
    if (!user) return [];
    return Object.entries(watchProgress)
      .map(([animeId, progress]) => {
          const anime = animeDatabase.find(a => a.id === parseInt(animeId));
          if (anime && progress.watchedEpisodes < progress.totalEpisodes) {
              return { anime, progress };
          }
          return null;
      })
      .filter(item => item !== null)
      .sort((a, b) => b!.anime.id - a!.anime.id);
  }, [watchProgress, user]);

  const watchListItems = useMemo(() => {
    if (!user) return [];
    return watchList
      .map(item => {
        const anime = animeDatabase.find(a => a.id === item.animeId);
        if (anime) return { anime, status: item.status };
        return null;
      })
      .filter(item => item !== null);
  }, [watchList, user]);

  const toggleFavorite = async (animeId: number) => {
    if (!user) return;
    const newFavorites = favorites.includes(animeId)
      ? favorites.filter(id => id !== animeId)
      : [...favorites, animeId];
    
    const success = await api.updateProfile(user.id, { favorites: newFavorites });
    if (success) {
      setFavorites(newFavorites);
      updateUser({ ...user, favorites: newFavorites });
      showToast(newFavorites.includes(animeId) ? 'Added to favorites.' : 'Removed from favorites.');
    } else {
      showToast('Failed to update favorites.', 'error');
    }
  };
  
  const addToWatchList = async (animeId: number) => {
    if (!user) {
      showToast('You must be logged in to add to a watchlist.', 'error');
      return;
    }
    if (watchList.some(item => item.animeId === animeId)) {
      showToast('This anime is already in your Watch List.', 'error');
      return;
    }
    const newWatchListItem = { animeId, status: 'Plan to Watch' as const };
    const newWatchList = [...watchList, newWatchListItem];

    const success = await api.updateProfile(user.id, { watchList: newWatchList });
    if (success) {
        setWatchList(newWatchList);
        updateUser({ ...user, watchList: newWatchList });
        showToast('This anime has been added to Watch List.');
    } else {
        showToast('Failed to add to watchlist.', 'error');
    }
  };

  const watchAnime = (anime: Anime) => {
    setSelectedAnime(anime);
    setCurrentView('watch');
  };

  const backToHome = () => {
    setCurrentView('home');
    setSelectedAnime(null);
  };

  const handleSetCurrentView = (view: ViewType) => {
    if (!isAuthenticated && (view === 'library' || view === 'profile')) {
      setCurrentView('home'); // Redirect to home, AuthPage will be shown
      return;
    }
    setSelectedAnime(null);
    setCurrentView(view);
  };
  
  const handleSettingsSave = (newSettings: UserSettings) => {
    updateSettings(newSettings);
    showToast('Settings saved successfully!');
  };

  const handleProfileSave = (newProfile: Partial<User>) => {
    if(user) {
      const updatedUser = { ...user, ...newProfile };
      updateUser(updatedUser);
      showToast('Profile updated successfully!');
    }
  };
  
  const getAnimeTitle = (anime: Anime) => {
      return user?.settings.animeNameLanguage === 'Japanese' ? anime.japanese : anime.title;
  };
  
  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthPage showToast={showToast} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'watch':
        return selectedAnime && (
          <motion.div key="watch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <WatchPage anime={selectedAnime} getAnimeTitle={getAnimeTitle} />
          </motion.div>
        );
      case 'library':
        return (
          <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LibraryPage 
              favoriteAnime={favoriteAnime}
              watchProgress={watchProgress}
              onWatch={watchAnime}
              onAddToWatchList={addToWatchList}
              getAnimeTitle={getAnimeTitle}
            />
          </motion.div>
        );
      case 'profile':
        return (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProfilePage 
              onProfileSave={handleProfileSave}
              continueWatchingItems={continueWatchingItems}
              watchListItems={watchListItems}
              onSettingsSave={handleSettingsSave}
              getAnimeTitle={getAnimeTitle}
            />
          </motion.div>
        );
      case 'home':
      default:
        return (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HomePage 
              allAnime={animeDatabase}
              onWatch={watchAnime}
              onAddToWatchList={addToWatchList}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              getAnimeTitle={getAnimeTitle}
            />
          </motion.div>
        );
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white flex">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>
      <Sidebar 
        currentView={currentView} 
        setCurrentView={handleSetCurrentView} 
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className={`flex-1 transition-all duration-300 ${currentView === 'home' ? '' : 'lg:ml-64'}`}>
        {currentView !== 'home' && (
            <Header 
                currentView={currentView}
                onBack={backToHome}
                selectedAnime={selectedAnime}
                onToggleFavorite={toggleFavorite}
                isFavorite={selectedAnime ? favorites.includes(selectedAnime.id) : false}
                onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                getAnimeTitle={getAnimeTitle}
            />
        )}
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
