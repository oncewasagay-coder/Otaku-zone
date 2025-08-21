
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { WatchPage } from './pages/WatchPage';
import { LibraryPage } from './pages/LibraryPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';
import { Toast } from './components/Toast';
import { useMediaQuery } from './hooks/useMediaQuery';
import { useAppStore } from './stores/useAppStore';
import { AnimeDetailPage } from './pages/AnimeDetailPage';
import { SettingsPage } from './pages/SettingsPage';

// Simple hash-based router
const useHashRouter = () => {
    const [hash, setHash] = useState(window.location.hash);

    useEffect(() => {
        const handleHashChange = () => setHash(window.location.hash);
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const path = hash.replace('#', '').split('/').filter(Boolean);
    const view = path[0] || 'home';
    const params = path.slice(1);
    
    return { view, params };
};


const AppContent: React.FC = () => {
  const { view, params } = useHashRouter();
  const { 
      isLoading, isAuthenticated, init,
      toasts, dismissToast,
      isFilterSidebarOpen, toggleFilterSidebar,
      showToast,
   } = useAppStore();

  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [isSidebarOpen, setSidebarOpen] = useState(isDesktop);

  useEffect(() => {
    init();
  }, [init]);
  
  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen w-full">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin" style={{borderColor: 'var(--brand)', borderTopColor: 'transparent'}}></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
        return <AuthPage showToast={showToast} />;
    }

    switch (view) {
        case 'anime':
            return <AnimeDetailPage slug={params[0]} />;
        case 'watch':
            return <WatchPage slug={params[0]} epSlug={params[1]} />;
        case 'library':
            return <LibraryPage />;
        case 'profile':
            return <ProfilePage />;
        case 'settings':
            return <SettingsPage />;
        case 'home':
        default:
            return <HomePage />;
    }
  };

  return (
    <div className="bg-bg min-h-screen text-text-primary flex">
      <AnimatePresence>
        {toasts.map(toast => (
            <Toast key={toast.id} {...toast} onDismiss={() => dismissToast(toast.id)} />
        ))}
      </AnimatePresence>
      
      {isAuthenticated && (
        <Sidebar 
            isOpen={isSidebarOpen}
            setIsOpen={setSidebarOpen}
        />
      )}
      
      <div className={`flex-1 transition-all duration-300 ${isAuthenticated ? (isFilterSidebarOpen ? 'lg:ml-64' : 'lg:ml-20') : ''}`}>
        {isAuthenticated && <Header onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />}
        <AnimatePresence mode="wait">
          <motion.div
            key={view + params.join('-')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const App: React.FC = () => <AppContent />;

export default App;
