import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/soundhub/Sidebar';
import HeroPanel from '../components/soundhub/HeroPanel';
import FeatureCards from '../components/soundhub/FeatureCards';
import UploadsLog from '../components/soundhub/UploadsLog';
import SignalArchive from '../components/soundhub/SignalArchive';
import ActiveListeners from '../components/soundhub/ActiveListeners';
import ResearchFeed from '../components/soundhub/ResearchFeed';
import YoutubeAudioPlayer from '../components/soundhub/YoutubeAudioPlayer';
import ArchiveView from './ArchiveView';
import UnderConstruction from './UnderConstruction';
import TrackListView from './TrackListView';
import TheoryView from './TheoryView';
import { MOCK_PROTOCOL, MOCK_CATEGORIES } from '../data/soundHub.mock';
import { useLocation } from 'react-router-dom';

// Hook for searching with debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
}

export default function SoundHub() {
  const { pathname } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrackId, setActiveTrackId] = useState<string>("5qap5aO4i9A");
  const debouncedQuery = useDebounce(searchQuery, 150);

  // Keyboard shortcut listener to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
      } else if (e.key === 'Escape') {
        setSearchQuery('');
        document.querySelector<HTMLInputElement>('input[type="text"]')?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExecute = () => {
    setIsPlaying(prev => !prev);
    console.log(`Audio protocol ${isPlaying ? 'PAUSED' : 'EXECUTED'}`);
  };

  const handlePlayTrack = (id: string, title: string) => {
    setActiveTrackId(id);
    setIsPlaying(true);
    console.log(`Now playing: ${title}`);
  };

  return (
    <div className="flex h-screen bg-obsidian text-bone w-full overflow-hidden antialiased selection:bg-accent-signal selection:text-obsidian flex-col md:flex-row">
      {/* Mobile topbar/sidebar collapsing could be customized further in Topbar/Sidebar */}
      
      {/* Desktop Layout - Sidebar remains 64px fixed */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-[72px] border-b border-border-hairline flex items-center justify-between px-6 xl:px-8 bg-obsidian shrink-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-accent-signal hidden md:block"></div>
            <span className="font-mono text-[12px] text-ash tracking-brand uppercase font-bold">
              NEURONEST / SOUND HUB
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Query signal archive..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search categories"
              className="w-full md:w-[320px] bg-panel border border-border-hairline py-2 px-4 font-mono text-[12px] text-bone placeholder:text-ash focus:outline-none focus:ring-2 focus:ring-accent-signal focus:border-transparent transition-all"
            />
            <button 
              aria-label="Notifications" 
              className="w-8 h-8 shrink-0 border border-border-hairline flex items-center justify-center text-ash hover:text-bone hover:border-accent-signal transition-colors focus:outline-none focus:ring-2 focus:ring-accent-signal focus:ring-offset-2 focus:ring-offset-obsidian"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto w-full relative z-10">
          <div className="w-full max-w-[1200px] mx-auto p-6 md:p-8 flex flex-col">
            
            {pathname.includes('/archive') ? (
               <ArchiveView onPlayTrack={handlePlayTrack} />
            ) : pathname.includes('/uploads') ? (
               <TrackListView onPlayTrack={handlePlayTrack} />
            ) : pathname.includes('/theory') ? (
               <TheoryView />
            ) : pathname.includes('/security') ? (
               <UnderConstruction title="Security Protocols" />
            ) : pathname.includes('/experiments') ? (
               <UnderConstruction title="Experiment Bay" />
            ) : (
              <>
                {/* Hero */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <HeroPanel protocol={MOCK_PROTOCOL} onExecute={handleExecute} />
                </motion.div>

                {/* 3 Feature Boxes */}
                <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ duration: 0.3, delay: 0.08 }}
                >
                  <FeatureCards />
                </motion.div>

                {/* Grid Area */}
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 lg:gap-[24px]">
                  <div className="flex flex-col gap-6">
                    <UploadsLog onPlayTrack={handlePlayTrack} />
                    <SignalArchive categories={MOCK_CATEGORIES} filterQuery={debouncedQuery} />
                  </div>

                  <div className="flex flex-col gap-6 lg:border-l lg:border-border-hairline lg:pl-[24px]">
                    <ActiveListeners />
                    <ResearchFeed />
                  </div>
                </div>
              </>
            )}

          </div>
        </main>
      </div>

      {/* Mobile NavBar placeholder */}
      <div className="md:hidden h-[56px] border-t border-border-hairline bg-obsidian w-full fixed bottom-0 left-0 flex items-center justify-around z-50">
         {/* Simplified active bar for mobile layout */}
         <div className="text-accent-signal"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></div>
         <div className="text-ash"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg></div>
         <div className="text-ash"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
      </div>
      
      <YoutubeAudioPlayer 
        videoId={activeTrackId} 
        isPlaying={isPlaying} 
        onStateChange={(state) => {
          if (state === 'ended') setIsPlaying(false);
          // Optional: handle syncing stats in MOCK_METRICS based on state playing!
        }} 
      />
    </div>
  );
}
