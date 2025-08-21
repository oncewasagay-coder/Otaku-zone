import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Menu } from 'lucide-react';
import { Anime, ViewType } from '../types';

interface HeaderProps {
    currentView: ViewType;
    onBack?: () => void;
    selectedAnime?: Anime | null;
    onToggleFavorite?: (id: number) => void;
    isFavorite?: boolean;
    onToggleSidebar: () => void;
    getAnimeTitle: (anime: Anime) => string;
}

export const Header: React.FC<HeaderProps> = ({ 
    currentView, onBack, selectedAnime, 
    onToggleFavorite, isFavorite, onToggleSidebar, getAnimeTitle 
}) => {

  const renderHeaderContent = () => {
    switch (currentView) {
      case 'watch':
        return (
          <div className="flex items-center justify-between w-full">
            <motion.button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors" whileHover={{ x: -4 }}>
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </motion.button>
            <div className="text-center absolute left-1/2 -translate-x-1/2 w-2/3 sm:w-auto">
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">{selectedAnime ? getAnimeTitle(selectedAnime) : ''}</h2>
              <p className="text-gray-400 text-sm">Episode 1</p>
            </div>
            {onToggleFavorite && selectedAnime && (
                <motion.button onClick={() => onToggleFavorite?.(selectedAnime!.id)} className={`p-3 rounded-xl transition-colors ${isFavorite ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-gray-700/50 text-gray-400 hover:text-white'}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </motion.button>
            )}
          </div>
        );
      case 'library':
        return <h2 className="text-2xl font-bold text-white">My Library</h2>;
      case 'profile':
        return <h2 className="text-2xl font-bold text-white">My Profile</h2>;
      case 'home':
      default:
        // Header is not rendered on home page
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-xl border-b border-gray-700">
      <div className="flex items-center p-4 sm:p-6">
          <button onClick={onToggleSidebar} className="lg:hidden p-2 mr-2 -ml-2 text-gray-300">
            <Menu className="w-6 h-6"/>
          </button>
          {renderHeaderContent()}
      </div>
    </header>
  );
};
