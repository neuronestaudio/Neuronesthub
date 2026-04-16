import { useState } from 'react';
import RadioSidebar from '../components/radio/RadioSidebar';
import SoundAtlas from '../components/radio/SoundAtlas';
import RadioPlayer from '../components/radio/RadioPlayer';

export default function RadioApp() {
  const [activeTrackId, setActiveTrackId] = useState<string>("5qap5aO4i9A");
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayTrack = (id: string) => {
    if (activeTrackId === id) {
      // Toggle play state on the same track
      setIsPlaying(prev => !prev);
    } else {
      setActiveTrackId(id);
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex bg-[#0A0A0A] text-white w-full h-screen overflow-hidden font-sans selection:bg-accent-signal selection:text-obsidian">
      {/* Sidebar: Fixed width to the left */}
      <RadioSidebar />

      {/* Main App Content */}
      <main className="flex-1 overflow-y-auto mb-[84px] p-6 lg:p-10 relative custom-scrollbar">
        {/* The background glow mirroring the thumbnail - purely aesthetic */}
        <div 
          className="absolute top-0 left-0 w-full h-[500px] pointer-events-none opacity-[0.15] z-0" 
          style={{ 
            background: 'radial-gradient(ellipse at top left, #38BDF8 0%, transparent 60%)' 
          }} 
        />
        
        <div className="relative z-10 max-w-[1400px] mx-auto w-full">
          <SoundAtlas currentTrackId={activeTrackId} isPlaying={isPlaying} onPlayTrack={handlePlayTrack} />
        </div>
      </main>

      {/* Player Bar: Fixed to the bottom */}
      <RadioPlayer activeTrackId={activeTrackId} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
    </div>
  );
}
