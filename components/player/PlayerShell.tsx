import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, Settings, Minimize, Maximize, Languages, Server } from 'lucide-react';
import { Anime, Episode, AudioLang } from '../../types';
import { useAppStore } from '../../stores/useAppStore';

interface PlayerShellProps {
  anime: Anime;
  episode: Episode;
  onNextEpisode: () => void;
}

const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
};

export const PlayerShell: React.FC<PlayerShellProps> = ({ anime, episode, onNextEpisode }) => {
    const { user, updateWatchHistory } = useAppStore();
    const settings = user?.settings;

    const [isPlaying, setIsPlaying] = useState(settings?.autoPlay || false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(episode.durationSec || 1440);
    const [selectedAudio, setSelectedAudio] = useState<AudioLang>(settings?.preferredAudio || episode.availableAudios[0]);
    const [isFullScreen, setIsFullScreen] = useState(false);
    
    const progressInterval = useRef<number | null>(null);
    const historyUpdateInterval = useRef<number | null>(null);

    useEffect(() => {
        if (isPlaying) {
            progressInterval.current = setInterval(() => {
                setCurrentTime(prev => {
                    if (prev >= duration) {
                        setIsPlaying(false);
                        if (settings?.autoNext) onNextEpisode();
                        return duration;
                    }
                    return prev + 1;
                });
            }, 1000);
            
            historyUpdateInterval.current = setInterval(() => {
                updateWatchHistory({ animeId: anime.id, epId: episode.id, positionSec: currentTime });
            }, 5000); // Update history every 5 seconds
        } else {
            if (progressInterval.current) clearInterval(progressInterval.current);
            if (historyUpdateInterval.current) clearInterval(historyUpdateInterval.current);
        }
        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
            if (historyUpdateInterval.current) clearInterval(historyUpdateInterval.current);
        };
    }, [isPlaying, currentTime, duration, anime.id, episode.id, settings?.autoNext, onNextEpisode, updateWatchHistory]);

    const handlePlayPause = () => setIsPlaying(!isPlaying);
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => setCurrentTime(Number(e.target.value));
    
    return (
        <div className={`relative aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center text-white select-none group border border-border`}>
            {/* Mock Player Screen */}
            <div className="text-center">
                <h3 className="text-3xl font-bold">{anime.titleEN}</h3>
                <p className="text-xl text-text-secondary">Episode {episode.number}</p>
                <p className="mt-4 text-brand font-semibold">Playing in {selectedAudio.toUpperCase()} audio</p>
            </div>
            
            {/* Custom Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                {/* Top Controls */}
                <div></div>

                {/* Bottom Controls */}
                <div className="flex flex-col gap-2">
                    {/* Progress Bar */}
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand"
                        style={{'--accent-color': 'var(--brand)'} as React.CSSProperties}
                    />
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={handlePlayPause}>
                                {isPlaying ? <Pause className="w-6 h-6"/> : <Play className="w-6 h-6"/>}
                            </button>
                            <div className="flex items-center gap-2">
                                <Volume2 className="w-5 h-5"/>
                                <input type="range" min="0" max="1" step="0.1" className="w-20 h-0.5 accent-white" />
                            </div>
                            <span className="text-sm font-mono">{formatTime(currentTime)} / {formatTime(duration)}</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Server className="w-5 h-5 text-text-secondary"/>
                                <select className="bg-transparent text-sm focus:outline-none">
                                    <option>Server 1</option>
                                    <option>Server 2</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <Languages className="w-5 h-5 text-text-secondary"/>
                                <select 
                                    value={selectedAudio}
                                    onChange={(e) => setSelectedAudio(e.target.value as AudioLang)}
                                    className="bg-transparent text-sm focus:outline-none"
                                >
                                    {episode.availableAudios.map(lang => (
                                        <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                            <button><Settings className="w-5 h-5"/></button>
                            <button onClick={() => setIsFullScreen(!isFullScreen)}>
                                {isFullScreen ? <Minimize className="w-5 h-5"/> : <Maximize className="w-5 h-5"/>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
