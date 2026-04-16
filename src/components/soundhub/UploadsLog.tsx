import { UPLOADED_TRACKS } from '../../data/soundHub.mock';
import { Link } from 'react-router-dom';

interface UploadsLogProps {
  onPlayTrack?: (id: string, title: string) => void;
}

export default function UploadsLog({ onPlayTrack }: UploadsLogProps) {
  return (
    <div className="flex flex-col bg-panel border-t border-border-hairline p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-mono text-[10px] uppercase text-ash tracking-brand">NEURONEST UPLOADS</h3>
        <Link to="/sound-hub/uploads" className="font-mono text-[10px] uppercase text-ash hover:text-bone tracking-brand transition-colors">
          [ FULL GALLERY ]
        </Link>
      </div>

      <div className="flex flex-col h-[200px] overflow-y-auto pr-2 gap-1 custom-scrollbar">
        {UPLOADED_TRACKS.map((track, i) => (
          <div 
            key={i} 
            onClick={() => onPlayTrack?.(track.id, track.title)}
            className="group flex justify-between items-center font-mono text-[11px] py-2 hover:bg-panel-alt transition-colors cursor-pointer border-b border-border-hairline/30 last:border-0"
          >
            <div className="flex items-center gap-4 min-w-0">
               <div className="w-10 h-6 bg-obsidian overflow-hidden border border-border-hairline group-hover:border-accent-signal transition-colors shrink-0">
                 <img src={track.thumb} alt={track.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
               </div>
               <span className="text-bone truncate group-hover:text-accent-signal transition-colors leading-none tracking-tight">
                 {track.title}
               </span>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-ash uppercase">{track.category}</span>
              <div className="w-6 h-6 rounded-full bg-obsidian text-ash flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }
      `}</style>
    </div>
  );
}
