import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Flame, Heart, ArrowLeft, Menu } from 'lucide-react';
import { Anime, ViewType } from '../types';

interface HeaderProps {
    currentView: ViewType;
    onSetCurrentView: (view: ViewType) => void;
    onBack?: () => void;
    selectedAnime?: Anime | null;
    onToggleFavorite?: (id: number) => void;
    isFavorite?: boolean;
    onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onSetCurrentView, onBack, selectedAnime, onToggleFavorite, isFavorite, onToggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('trending');
  
  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'featured', label: 'Featured', icon: Flame },
    { id: 'favorites', label: 'My List', icon: Heart }
  ];

  const renderHeaderContent = () => {
    switch (currentView) {
      case 'watch':
        return (
          <div className="flex items-center justify-between w-full">
            <motion.button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors" whileHover={{ x: -4 }}>
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Home</span>
            </motion.button>
            <div className="text-center absolute left-1/2 -translate-x-1/2 w-2/3 sm:w-auto">
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">{selectedAnime?.title}</h2>
              <p className="text-gray-400 text-sm">Episode 1</p>
            </div>
            <motion.button onClick={() => onToggleFavorite?.(selectedAnime!.id)} className={`p-3 rounded-xl transition-colors ${isFavorite ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-gray-700/50 text-gray-400 hover:text-white'}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </motion.button>
          </div>
        );
      case 'library':
        return <h2 className="text-2xl font-bold text-white">My Library</h2>;
      case 'home':
      default:
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-6">
              <h2 className="text-2xl font-bold text-white hidden sm:block">Discover</h2>
              <div className="hidden md:flex items-center gap-2 relative">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 py-2 px-4 rounded-xl font-semibold transition z-10 ${
                      activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
                <motion.div
                  layoutId="activeTab"
                  className="absolute h-full bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-xl border border-red-500/30"
                  style={{
                      width: activeTab === 'trending' ? '120px' : activeTab === 'featured' ? '120px' : '105px',
                      x: activeTab === 'trending' ? 0 : activeTab === 'featured' ? 128 : 256
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 sm:w-48 md:w-80 py-3 pl-12 pr-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white text-sm transition placeholder:text-gray-400 focus:outline-none focus:border-red-500/50 focus:bg-gray-700/80"
              />
            </div>
          </div>
        );
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
