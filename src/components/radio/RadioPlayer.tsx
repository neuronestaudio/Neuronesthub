import { Play, Pause, SkipBack, SkipForward, Volume2, Mic2, ListMusic } from 'lucide-react';
import YoutubeAudioPlayer from '../soundhub/YoutubeAudioPlayer';
import { UPLOADED_TRACKS } from '../../data/soundHub.mock';

interface RadioPlayerProps {
  activeTrackId: string;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export default function RadioPlayer({ activeTrackId, isPlaying, setIsPlaying }: RadioPlayerProps) {
  
  const currentTrack = UPLOADED_TRACKS.find(t => t.id === activeTrackId) || UPLOADED_TRACKS[0];

  return (
    <div className="fixed bottom-0 left-0 w-full h-[84px] bg-[#181818] border-t border-[#282828] flex items-center justify-between px-4 z-50">
      
      {/* Invisible YouTube Player */}
      <YoutubeAudioPlayer 
        videoId={activeTrackId} 
        isPlaying={isPlaying} 
        onStateChange={(state) => {
          if (state === 'ended') setIsPlaying(false);
          if (state === 'playing') setIsPlaying(true);
        }} 
      />

      {/* Track Info (Left) */}
      <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
        <img 
          src={currentTrack.thumb} 
          alt="Track art" 
          className="w-14 h-14 rounded shadow"
        />
        <div className="flex flex-col">
          <span className="text-white text-[14px] hover:underline cursor-pointer line-clamp-1">{currentTrack.title}</span>
          <span className="text-[#A0A0A0] text-[12px] hover:underline cursor-pointer">NeuroNest Atlas</span>
        </div>
      </div>

      {/* Playback Controls (Center) */}
      <div className="flex flex-col items-center justify-center w-[40%] max-w-[700px] gap-2">
        <div className="flex items-center gap-6">
          <button className="text-[#A0A0A0] hover:text-white transition-colors">
            <SkipBack size={20} fill="currentColor" />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause size={16} fill="currentColor" className="text-black" />
            ) : (
              <Play size={16} fill="currentColor" className="text-black ml-0.5" />
            )}
          </button>
          
          <button className="text-[#A0A0A0] hover:text-white transition-colors">
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>
        
        {/* Fake progress bar */}
        <div className="flex items-center gap-2 w-full max-w-[500px]">
          <span className="text-[11px] text-[#A0A0A0] font-mono">2:14</span>
          <div className="h-1 flex-1 bg-[#4D4D4D] rounded-full overflow-hidden group cursor-pointer relative">
            <div className="absolute left-0 top-0 h-full w-[40%] bg-white group-hover:bg-accent-signal transition-colors group-hover:rounded-r-full" />
          </div>
          <span className="text-[11px] text-[#A0A0A0] font-mono">45:00</span>
        </div>
      </div>

      {/* Extra Controls (Right) */}
      <div className="flex items-center justify-end gap-4 w-[30%] min-w-[180px] text-[#A0A0A0]">
        <button className="hover:text-white transition-colors"><Mic2 size={16} /></button>
        <button className="hover:text-white transition-colors"><ListMusic size={16} /></button>
        <div className="flex items-center gap-2 group cursor-pointer w-[100px]">
          <Volume2 size={18} className="hover:text-white transition-colors" />
          <div className="h-1 flex-1 bg-[#4D4D4D] rounded-full overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full w-[70%] bg-white group-hover:bg-accent-signal transition-colors" />
          </div>
        </div>
      </div>
      
    </div>
  );
}
