import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Search } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';

interface HeaderProps {
    onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { currentView, user, setFilter } = useAppStore();

  const getTitle = () => {
    switch (currentView.type) {
      case 'home': return "Discover";
      case 'library': return "My Library";
      case 'profile': return `Hi, ${user?.name || ''}`;
      case 'settings': return "Settings";
      case 'anime_detail': return "Details";
      case 'watch': return "Now Playing";
      default: return "Anime Bharat";
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-bg-elevated/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between p-4 sm:p-6">
          <div className="flex items-center gap-2">
            <button onClick={onToggleSidebar} className="p-2 -ml-2 text-text-secondary">
              <Menu className="w-6 h-6"/>
            </button>
            <h2 className="text-2xl font-bold text-text-primary">{getTitle()}</h2>
          </div>

          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search anime..."
              className="w-full py-2 pl-10 pr-4 bg-white/5 border border-border rounded-lg placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand/50"
              onChange={(e) => setFilter('query', e.target.value)}
            />
            <Search className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          </div>
      </div>
    </header>
  );
};