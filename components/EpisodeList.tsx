import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { List, ArrowDownUp, Play } from 'lucide-react';
import { Anime } from '../types';
import { useAppStore } from '../stores/useAppStore';

interface EpisodeListProps {
    anime: Anime;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({ anime }) => {
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('oldest');
    const { user, setView } = useAppStore();

    const sortedEpisodes = [...anime.episodes].sort((a, b) => {
        return sortOrder === 'newest' ? b.number - a.number : a.number - b.number;
    });
    
    // Mock progress for UI demo
    const history = user?.watchHistory || [];
    const watchedEpisodes = new Set(history.filter(h => h.animeId === anime.id).map(h => h.epId));

    return (
        <div className="bg-bg-elevated rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <List className="w-6 h-6 text-brand" />
                    <h2 className="text-2xl font-bold">Episodes ({anime.episodes.length})</h2>
                </div>
                <motion.button
                    onClick={() => setSortOrder(s => s === 'newest' ? 'oldest' : 'newest')}
                    className="flex items-center gap-2 py-2 px-3 bg-white/5 border border-border rounded-lg text-text-secondary font-medium"
                    whileHover={{ scale: 1.05 }}
                >
                    <ArrowDownUp className="w-4 h-4" />
                    <span>{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
                </motion.button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {sortedEpisodes.map(ep => {
                    const isWatched = watchedEpisodes.has(ep.id);
                    return (
                        <motion.div
                            key={ep.id}
                            onClick={() => setView({ type: 'watch', slug: anime.slug, ep: ep.slug })}
                            className={`p-4 rounded-lg cursor-pointer transition-colors flex items-center gap-4 ${isWatched ? 'bg-white/5' : 'bg-white/[0.02] hover:bg-white/5'}`}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="w-10 h-10 flex-shrink-0 bg-brand/10 text-brand font-bold flex items-center justify-center rounded-md">
                                {ep.number}
                            </div>
                            <div className="flex-1 truncate">
                                <p className={`font-semibold truncate ${isWatched ? 'text-text-secondary' : 'text-text-primary'}`}>Episode {ep.number}</p>
                                {ep.title && <p className="text-xs text-text-secondary truncate">{ep.title}</p>}
                            </div>
                            {!isWatched && <Play className="w-5 h-5 text-text-secondary" />}
                        </motion.div>
                    )
                })}
            </div>
        </div>
    );
};
