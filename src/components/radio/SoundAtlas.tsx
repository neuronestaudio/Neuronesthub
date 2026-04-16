import { Play, MoreHorizontal } from 'lucide-react';
import { UPLOADED_TRACKS } from '../../data/soundHub.mock';

interface SoundAtlasProps {
  currentTrackId: string;
  isPlaying: boolean;
  onPlayTrack: (id: string) => void;
}

export default function SoundAtlas({ currentTrackId, isPlaying, onPlayTrack }: SoundAtlasProps) {
  
  const handlePlayClick = (id: string) => {
    onPlayTrack(id);
  };

  return (
    <div className="flex flex-col w-full h-full text-white">
      {/* Top Filter Pills */}
      <div className="flex items-center gap-3 mb-10 sticky top-0 bg-[#0A0A0A]/90 backdrop-blur pb-4 pt-2 z-20">
        <button className="bg-white text-black font-semibold px-4 py-1.5 rounded-full text-sm">All Regions</button>
        <button className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] transition-colors font-medium px-4 py-1.5 rounded-full text-sm">Focus</button>
        <button className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] transition-colors font-medium px-4 py-1.5 rounded-full text-sm">Sleep</button>
        <button className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] transition-colors font-medium px-4 py-1.5 rounded-full text-sm">Calm</button>
      </div>

      {/* Hero Header */}
      <div className="flex items-end gap-6 lg:gap-8 mb-12">
        {/* Cover Art Wrapper */}
        <div className="w-[180px] h-[180px] lg:w-[220px] lg:h-[220px] rounded-lg overflow-hidden shrink-0 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          <img 
            src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop" 
            alt="Sound Atlas Abstract Art"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex flex-col">
          <span className="text-[12px] font-mono tracking-[0.2em] text-[#A0A0A0] uppercase mb-2">Public Pathway</span>
          <h1 className="text-5xl lg:text-[76px] font-bold tracking-tight mb-4 leading-none font-display">NeuroNest Sound Atlas</h1>
          <p className="text-[#A0A0A0] max-w-[600px] text-[15px] leading-relaxed">
            A curated collection of scientifically informed audio environments designed to modulate autonomic state, enhance concentration, and promote rest.
          </p>
        </div>
      </div>

      {/* Action Bar (Play big button) */}
      <div className="mb-8">
        <button className="w-14 h-14 bg-accent-signal rounded-full flex items-center justify-center hover:scale-105 transition-transform">
          <Play size={24} className="text-black ml-1" fill="currentColor" />
        </button>
      </div>

      {/* Track List Table Header */}
      <div className="grid grid-cols-[60px_4fr_2fr_100px] text-[#A0A0A0] font-medium text-xs mb-4 border-b border-[#1f1f1f] pb-2 uppercase tracking-wide">
        <div className="text-center">#</div>
        <div>Title</div>
        <div>Category</div>
        <div className="text-right pr-6">Action</div>
      </div>

      {/* Tracks */}
      <div className="flex flex-col gap-1 pb-10">
        {UPLOADED_TRACKS.map((track, i) => {
          const isActive = track.id === currentTrackId;
          const isFocus = track.category.toLowerCase().includes('focus');
          const isSleep = track.category.toLowerCase().includes('sleep');
          
          let badgeColorStyle = 'border-[#38BDF8] text-[#38BDF8]'; // calm default
          if (isFocus) badgeColorStyle = 'border-[#60D385] text-[#60D385]';
          if (isSleep) badgeColorStyle = 'border-[#A78BFA] text-[#A78BFA]';

          return (
            <div 
              key={track.id} 
              className={`group grid grid-cols-[60px_4fr_2fr_100px] items-center py-2 rounded-md transition-colors hover:bg-[#1a1a1a] ${isActive ? 'bg-[#1a1a1a]' : ''}`}
            >
              {/* Number or Play btn */}
              <div className="flex justify-center items-center w-full relative">
                <span className={`text-[15px] ${isActive ? 'text-accent-signal' : 'text-[#A0A0A0] group-hover:opacity-0'}`}>
                  {isActive && isPlaying ? (
                     <div className="flex items-center gap-1 h-[14px]">
                       <div className="w-1 bg-accent-signal h-full animate-[pulse_0.4s_infinite]" />
                       <div className="w-1 bg-accent-signal h-1/2 animate-[pulse_0.6s_infinite]" />
                       <div className="w-1 bg-accent-signal h-3/4 animate-[pulse_0.5s_infinite]" />
                     </div>
                  ) : isActive && !isPlaying ? (
                     <span className="text-accent-signal">▶</span>
                  ) : (
                     i + 1
                  )}
                </span>
                {!isActive && (
                  <button 
                    onClick={() => handlePlayClick(track.id)}
                    className="absolute opacity-0 group-hover:opacity-100 text-white flex items-center justify-center p-1"
                  >
                    <Play size={16} fill="currentColor" />
                  </button>
                )}
                {isActive && !isPlaying && (
                  <button 
                    onClick={() => handlePlayClick(track.id)}
                    className="absolute opacity-0 group-hover:opacity-100 text-white flex items-center justify-center p-1"
                  >
                    <Play size={16} fill="currentColor" />
                  </button>
                )}
              </div>

              {/* Title col */}
              <div className="flex items-center gap-4">
                <img src={track.thumb} alt="" className="w-10 h-10 rounded opacity-80" />
                <div className="flex flex-col justify-center">
                  <span className={`font-medium ${isActive ? 'text-accent-signal' : 'text-white'}`}>
                    {track.title}
                  </span>
                  <span className="text-[#A0A0A0] text-[13px] truncate max-w-[340px]">
                    Optimized auditory frequency targeting
                  </span>
                </div>
              </div>

              {/* Category Pill */}
              <div>
                <span className={`inline-block px-3 py-[2px] rounded-full border text-[11px] font-mono uppercase tracking-wiest ${badgeColorStyle} bg-black/20`}>
                  {track.category}
                </span>
              </div>

              {/* Actions */}
              <div className="text-right pr-6 text-[#A0A0A0] opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="hover:text-white"><MoreHorizontal size={20} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
