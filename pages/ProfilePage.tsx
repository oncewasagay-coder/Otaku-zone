import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, History, Heart, Bell, Settings, FileText, LogOut } from 'lucide-react';
import { EditProfilePage } from './EditProfilePage';
import { ContinueWatchingPage } from './ContinueWatchingPage';
import { WatchListPage } from './WatchListPage';
import { SettingsPage } from './SettingsPage';
import { NotificationsPage } from './NotificationsPage';
import { MalIntegrationPage } from './MalIntegrationPage';
import { Anime, WatchProgressDetail, WatchListStatus, UserSettings, User } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePageProps {
  onProfileSave: (profile: Partial<User>) => void;
  continueWatchingItems: { anime: Anime; progress: WatchProgressDetail }[];
  watchListItems: { anime: Anime; status: WatchListStatus }[];
  onSettingsSave: (settings: UserSettings) => void;
  getAnimeTitle: (anime: Anime) => string;
}

const profileTabs = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'watching', label: 'Continue Watching', icon: History },
  { id: 'watchlist', label: 'Watch List', icon: Heart },
  { id: 'notifications', label: 'Notification', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'mal', label: 'MAL', icon: FileText },
];

export const ProfilePage: React.FC<ProfilePageProps> = ({ onProfileSave, continueWatchingItems, watchListItems, onSettingsSave, getAnimeTitle }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) return null; // Should be protected by AuthGuard

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <EditProfilePage onSave={onProfileSave} />;
      case 'watching':
        return <ContinueWatchingPage items={continueWatchingItems} getAnimeTitle={getAnimeTitle} />;
      case 'watchlist':
        return <WatchListPage items={watchListItems} getAnimeTitle={getAnimeTitle} />;
      case 'settings':
        return <SettingsPage onSave={onSettingsSave} />;
      case 'notifications':
        return <NotificationsPage />;
      case 'mal':
        return <MalIntegrationPage />;
      default:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center h-64 text-gray-500 bg-gray-800/50 rounded-2xl"
          >
            <p>{profileTabs.find(t => t.id === activeTab)?.label} section coming soon.</p>
          </motion.div>
        );
    }
  };

  return (
    <main className="p-4 sm:p-6">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-6 text-white">Hi, {user.name}</h1>
            <button onClick={logout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
            
            <div className="relative border-b border-gray-700">
                <nav className="flex items-center gap-2 sm:gap-6 overflow-x-auto">
                    {profileTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative whitespace-nowrap flex items-center gap-2 py-4 px-2 text-sm sm:text-base font-medium transition-colors focus:outline-none ${
                                activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    className="absolute top-0 left-0 right-0 h-0.5 bg-pink-400 rounded-full"
                                    layoutId="profileTabIndicator"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}
                            <tab.icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${activeTab === tab.id ? 'text-pink-400' : ''}`} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </motion.div>
        
        {renderContent()}
    </main>
  );
};