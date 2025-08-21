import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Library, Settings, User } from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, setIsOpen }) => {
  const navItems = [
    { id: 'home' as ViewType, icon: Home, label: 'Home' },
    { id: 'library' as ViewType, icon: Library, label: 'My Library' },
    { id: 'profile' as ViewType, icon: User, label: 'Profile' }
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={() => setIsOpen(false)}
             className="fixed inset-0 bg-black/50 z-40 lg:hidden"
           />
        )}
      </AnimatePresence>
      <motion.div
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 z-50 h-screen w-64 bg-gray-900/95 backdrop-blur-xl border-r border-gray-700 flex flex-col lg:translate-x-0"
      >
        <div className="p-6">
          <motion.h1
            className="cursor-pointer text-3xl font-bold text-white mb-1"
            whileHover={{ scale: 1.05 }}
          >
            h!anime
          </motion.h1>
          <p className="text-gray-400 text-sm">Your anime destination.</p>
        </div>

        <nav className="px-4">
          {navItems.map(item => (
            <motion.button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 py-3 px-4 mb-2 rounded-xl text-gray-400 font-medium cursor-pointer transition-all duration-300 ${
                currentView === item.id 
                  ? 'bg-gradient-to-r from-red-500/20 to-purple-500/20 text-white border border-red-500/30' 
                  : 'hover:text-white hover:bg-gray-700/50'
              }`}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </motion.button>
          ))}
        </nav>
      </motion.div>
    </>
  );
};
