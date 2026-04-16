import { motion } from 'framer-motion';
import { UPLOADED_TRACKS } from '../data/soundHub.mock';

interface TrackListViewProps {
  onPlayTrack: (id: string, title: string) => void;
}

export default function TrackListView({ onPlayTrack }: TrackListViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8"
    >
      <header className="flex flex-col border-b border-border-hairline pb-6">
         <div className="inline-block bg-accent-signal text-obsidian font-mono text-[10px] uppercase px-[10px] py-[6px] w-fit mb-4">
           NEURONEST UPLOADS
         </div>
         <h1 className="font-display text-[44px] leading-none uppercase">Latest Release</h1>
         <p className="font-sans text-[15px] text-ash max-w-[480px] mt-4">
           Seamless integration of 9 core stabilization tracks engineered for optimal cognitive recovery and calm down-regulation.
         </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {UPLOADED_TRACKS.map((track) => (
          <div 
            key={track.id} 
            onClick={() => onPlayTrack(track.id, track.title)}
            className="group flex flex-col bg-panel hover:bg-panel-alt transition-colors duration-200 cursor-pointer border border-transparent hover:border-accent-signal/50 h-auto overflow-hidden"
          >
            <div className="w-full aspect-video bg-[#18181c] relative overflow-hidden">
               <img src={track.thumb} alt={track.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500 ease-out" />
               <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent pointer-events-none" />
               <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-accent-signal text-obsidian flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
               </div>
            </div>
            <div className="p-4 flex flex-col">
              <span className="font-mono text-[10px] uppercase text-ash tracking-mono mb-2">{track.category} · ALBUM</span>
              <h4 className="font-sans text-[15px] font-medium text-bone group-hover:text-accent-signal transition-colors line-clamp-1">{track.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
