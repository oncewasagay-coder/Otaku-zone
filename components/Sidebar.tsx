import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Library, Settings, User, LogOut, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem = ({ icon: Icon, label, href, isExpanded, isActive }) => (
    <a href={href} className="block">
        <motion.div
          className={`flex items-center gap-4 py-3 px-4 mb-2 rounded-xl text-text-secondary font-medium cursor-pointer transition-all duration-300 ${
            isActive 
              ? 'bg-brand/10 text-brand border border-brand/20' 
              : 'hover:text-text-primary hover:bg-white/5'
          }`}
          whileHover={{ scale: 1.02, x: isExpanded ? 4 : 0 }}
          whileTap={{ scale: 0.98 }}
        >
          <Icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-brand' : ''}`} />
          <AnimatePresence>
              {isExpanded && <motion.span initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="whitespace-nowrap">{label}</motion.span>}
          </AnimatePresence>
        </motion.div>
    </a>
)

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logout, currentView } = useAppStore();

  const navItems = [
    { href: '#home', icon: Home, label: 'Home' },
    { href: '#library', icon: Library, label: 'My Library' },
    { href: '#profile', icon: User, label: 'Profile' }
  ];

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
        animate={{ width: isOpen ? 256 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 z-50 h-screen bg-bg-elevated border-r border-border flex flex-col"
      >
        <div className={`flex items-center justify-between p-4 ${isOpen ? 'ml-2' : ''}`}>
          {isOpen && (
            <a href="#home" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand to-accent" style={{color: 'var(--brand)'}}>A-B</span>
              <h1 className="text-xl font-bold text-white">Anime Bharat</h1>
            </a>
          )}
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-text-secondary hover:text-text-primary">
            {isOpen ? <ChevronLeft /> : <Menu />}
          </button>
        </div>

        <nav className="flex-1 px-4 mt-8">
          {navItems.map(item => (
            <NavItem 
                key={item.href} {...item} 
                isExpanded={isOpen} 
                isActive={currentView.type === item.href.substring(1)}
            />
          ))}
        </nav>

        <div className="px-4 pb-6">
            <NavItem href="#settings" icon={Settings} label="Settings" isExpanded={isOpen} isActive={currentView.type === 'settings'} />
            <div onClick={logout}>
                <NavItem icon={LogOut} label="Logout" href="#" isExpanded={isOpen} isActive={false} />
            </div>
        </div>
      </motion.div>
    </>
  );
};