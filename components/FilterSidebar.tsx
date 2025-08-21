
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import { animeDatabase } from '../constants';

const allGenres = [...new Set(animeDatabase.flatMap(a => a.genres))];
const allYears = [...new Set(animeDatabase.map(a => a.year?.toString()).filter(Boolean))].sort((a,b) => parseInt(b, 10) - parseInt(a, 10));
const allStatuses = ['Ongoing', 'Completed'];
const allTypes = ['TV Series', 'Movie', 'OVA', 'ONA', 'Special'];
const allAudios = [{id: 'hi', label: 'Hindi'}, {id: 'en', label: 'English'}, {id: 'ja', label: 'Japanese'}];

const FilterSection = ({ title, children }) => (
    <div className="py-4 border-b border-border">
        <h4 className="font-semibold text-text-primary mb-3">{title}</h4>
        {children}
    </div>
);

const Tag = ({ label, isSelected, onClick }) => (
    <motion.button
        onClick={onClick}
        className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
            isSelected ? 'bg-brand/20 border-brand text-brand' : 'bg-white/5 border-border text-text-secondary hover:border-text-secondary'
        }`}
        whileTap={{ scale: 0.95 }}
    >
        {label}
    </motion.button>
);

export const FilterSidebar = () => {
    const { filters, setFilter, isFilterSidebarOpen, toggleFilterSidebar } = useAppStore();

    const handleMultiSelect = (filter, value) => {
        const current = filters[filter] || [];
        const newValue = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
        setFilter(filter, newValue);
    };

    const handleSingleSelect = (filter, value) => {
        const current = filters[filter];
        const newValue = current === value ? '' : value;
        setFilter(filter, newValue);
    };

    const content = (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-brand" />
                    <h3 className="text-xl font-bold">Filters</h3>
                </div>
                <button onClick={toggleFilterSidebar} className="p-2 lg:hidden">
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <FilterSection title="Genre">
                <div className="flex flex-wrap gap-2">
                    {allGenres.map(genre => <Tag key={genre} label={genre} isSelected={filters.genre.includes(genre)} onClick={() => handleMultiSelect('genre', genre)} />)}
                </div>
            </FilterSection>

             <FilterSection title="Available Audio">
                <div className="flex flex-wrap gap-2">
                    {allAudios.map(audio => <Tag key={audio.id} label={audio.label} isSelected={filters.audio.includes(audio.id)} onClick={() => handleMultiSelect('audio', audio.id)} />)}
                </div>
            </FilterSection>
            
            <FilterSection title="Year">
                <div className="flex flex-wrap gap-2">
                    {allYears.map(year => <Tag key={year} label={year} isSelected={filters.year === year} onClick={() => handleSingleSelect('year', year)} />)}
                </div>
            </FilterSection>
            
            <FilterSection title="Status">
                <div className="flex flex-wrap gap-2">
                    {allStatuses.map(status => <Tag key={status} label={status} isSelected={filters.status === status} onClick={() => handleSingleSelect('status', status)} />)}
                </div>
            </FilterSection>

            <FilterSection title="Type">
                <div className="flex flex-wrap gap-2">
                    {allTypes.map(type => <Tag key={type} label={type} isSelected={filters.type === type} onClick={() => handleSingleSelect('type', type)} />)}
                </div>
            </FilterSection>
        </div>
    );
    
    return (
        <>
            <div className="hidden lg:block w-64 bg-bg-elevated border-r border-border h-screen sticky top-0 overflow-y-auto">
                {content}
            </div>
            <AnimatePresence>
                {isFilterSidebarOpen && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed top-0 left-0 h-screen w-64 bg-bg-elevated border-r border-border z-50 lg:hidden overflow-y-auto"
                    >
                       {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
