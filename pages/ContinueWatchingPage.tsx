import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History } from 'lucide-react';
import { Anime, WatchProgressDetail } from '../types';
import { AnimeProgressCard } from '../components/AnimeProgressCard';

interface ContinueWatchingPageProps {
    items: { anime: Anime; progress: WatchProgressDetail }[];
    getAnimeTitle: (anime: Anime) => string;
}

const ITEMS_PER_PAGE = 25;

const Pagination: React.FC<{ currentPage: number, totalPages: number, onPageChange: (page: number) => void }> = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    const getPageNumbers = () => {
        if (totalPages <= 7) return pageNumbers;
        
        if (currentPage <= 4) {
            return [...pageNumbers.slice(0, 5), '...', totalPages];
        }
        if (currentPage > totalPages - 4) {
            return [1, '...', ...pageNumbers.slice(totalPages - 5)];
        }
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };
    
    const displayPages = getPageNumbers();

    return (
        <nav className="flex justify-center items-center gap-2 mt-8">
            {displayPages.map((page, index) =>
                typeof page === 'string' ? (
                    <span key={`ellipsis-${index}`} className="px-4 py-2 text-gray-400">...</span>
                ) : (
                    <motion.button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                            currentPage === page ? 'bg-pink-500 text-white' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {page}
                    </motion.button>
                )
            )}
        </nav>
    );
};


export const ContinueWatchingPage: React.FC<ContinueWatchingPageProps> = ({ items, getAnimeTitle }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    const currentItems = items.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex items-center gap-4 mb-8">
                <History className="w-8 h-8 text-gray-300" />
                <h2 className="text-3xl font-bold text-white">Continue Watching</h2>
            </div>
            
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                <AnimatePresence>
                    {currentItems.map(({ anime, progress }, index) => (
                        <AnimeProgressCard 
                            key={anime.id} 
                            anime={anime} 
                            progress={progress} 
                            index={index} 
                            getAnimeTitle={getAnimeTitle}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            {totalPages > 1 && (
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </motion.div>
    );
};
