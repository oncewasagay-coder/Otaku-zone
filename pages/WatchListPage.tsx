
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Anime, WatchListStatus } from '../types';
import { WatchListCard } from '../components/WatchListCard';
import { useAppStore } from '../stores/useAppStore';
import { animeDatabase } from '../constants';

interface WatchListPageProps {}

const filterTabs: WatchListStatus[] = ['All', 'Watching', 'On-Hold', 'Plan to Watch', 'Dropped', 'Completed'];

export const WatchListPage: React.FC<WatchListPageProps> = () => {
    const { user, library, updateUserSettings } = useAppStore();
    const [activeFilter, setActiveFilter] = useState<WatchListStatus>('All');

    const handlePublicToggle = () => {
        if (user) {
            updateUserSettings({ ...user.settings, publicWatchList: !user.settings.publicWatchList });
        }
    };

    const items = useMemo(() => {
        const animeMap = new Map(animeDatabase.map(a => [a.id, a]));
        return library.map(libItem => ({
            anime: animeMap.get(libItem.animeId)!,
            status: libItem.folder,
        })).filter(item => item.anime);
    }, [library]);

    const filteredItems = useMemo(() => {
        if (activeFilter === 'All') return items;
        return items.filter(item => item.status === activeFilter);
    }, [items, activeFilter]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Heart className="w-8 h-8 text-gray-300" />
                    <h2 className="text-3xl font-bold text-white">Watch List</h2>
                </div>
                {user && (
                    <div className="flex items-center gap-3 bg-gray-800/50 p-1 rounded-full">
                        <span className="text-sm font-medium text-gray-300 ml-2">Public</span>
                        <button onClick={handlePublicToggle} className="relative w-12 h-6 rounded-full bg-gray-700 transition">
                            <motion.div 
                                className="w-5 h-5 bg-white rounded-full absolute top-0.5" 
                                animate={{ x: user.settings.publicWatchList ? 22 : 2 }}
                                transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                            />
                        </button>
                    </div>
                )}
            </div>

            <div className="mb-8">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {filterTabs.map(tab => (
                        <motion.button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            className={`relative whitespace-nowrap py-2 px-4 rounded-lg text-sm font-semibold transition ${
                                activeFilter === tab ? 'text-white' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {activeFilter === tab && (
                                <motion.div
                                    layoutId="watchListFilter"
                                    className="absolute inset-0 bg-white/10 rounded-lg"
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                />
                            )}
                            <span className="relative z-10">{tab}</span>
                        </motion.button>
                    ))}
                </div>
            </div>

            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                <AnimatePresence>
                    {filteredItems.map(({ anime }, index) => (
                        <WatchListCard key={anime.id} anime={anime} index={index} />
                    ))}
                </AnimatePresence>
            </motion.div>
            {filteredItems.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-64 text-gray-500 bg-gray-800/50 rounded-2xl"
                >
                    <p className="text-lg">No anime in this category.</p>
                    <p className="text-sm">Add some anime to your list to see them here.</p>
                </motion.div>
            )}
        </motion.div>
    );
};
