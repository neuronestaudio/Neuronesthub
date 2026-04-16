import { motion } from 'framer-motion';
import { useState } from 'react';
import notionArchive from '../data/notionArchive.json';

interface ArchiveViewProps {
  onPlayTrack?: (id: string, title: string) => void;
}

export default function ArchiveView({ onPlayTrack }: ArchiveViewProps) {
  const [query, setQuery] = useState('');
  
  const filtered = notionArchive.filter(track => 
    track.title.toLowerCase().includes(query.toLowerCase()) || 
    track.category.toLowerCase().includes(query.toLowerCase()) ||
    track.tags.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8"
    >
      <header className="flex flex-wrap justify-between items-end border-b border-border-hairline pb-6 gap-4">
        <div>
           <div className="inline-block bg-accent-signal/10 text-accent-signal font-mono text-[10px] uppercase px-[10px] py-[6px] mb-4 border border-accent-signal/20">
             DATABASE CONNECTION ESTABLISHED
           </div>
           <h1 className="font-display text-[44px] leading-none uppercase">Curated Selection</h1>
           <p className="font-sans text-[15px] text-ash max-w-[500px] mt-4">
             Explore our hand-picked repository of scientifically validated audio environments drawn directly from the Notion knowledge base.
           </p>
        </div>
        <input 
          type="text" 
          placeholder="Filter by tags, category..." 
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="bg-panel border border-border-hairline py-3 px-4 font-mono text-[12px] text-bone focus:outline-none focus:ring-1 focus:ring-accent-signal max-w-[240px] w-full"
        />
      </header>

      <div className="flex flex-col gap-0 border border-border-hairline bg-panel/30">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-6 px-6 py-4 border-b border-border-hairline bg-obsidian text-ash font-mono text-[10px] uppercase tracking-mono sticky top-0 z-10">
           <div className="w-10">PLAY</div>
           <div>SIGNAL INFO</div>
           <div className="hidden md:block w-[180px]">MODALITY</div>
           <div className="w-[80px] text-right">RUNTIME</div>
        </div>

        {filtered.map((track, i) => (
          <div 
            key={i} 
            className="group grid grid-cols-[auto_1fr_auto_auto] gap-6 px-6 py-5 border-b border-border-hairline hover:bg-panel transition-colors items-center cursor-pointer"
            onClick={() => {
              if (onPlayTrack && track.youtubeId) {
                onPlayTrack(track.youtubeId, track.title);
              }
            }}
          >
            {/* Play Button Col */}
            <div className="w-10 flex justify-start items-center">
              <button className="w-8 h-8 rounded-full border border-border-hairline group-hover:border-accent-signal text-ash group-hover:text-accent-signal flex justify-center items-center transition-all bg-obsidian group-hover:bg-accent-signal/10">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </button>
            </div>

            {/* Info Col */}
            <div className="flex flex-col gap-1 pr-6 min-w-0">
               <h4 className="font-sans text-[14px] font-medium text-bone group-hover:text-accent-signal transition-colors line-clamp-1">{track.title}</h4>
               <p className="font-mono text-[10px] text-ash line-clamp-1 truncate">{track.author} • {track.tags}</p>
            </div>

            {/* Modality Col */}
            <div className="hidden md:flex w-[180px] flex-col items-start gap-2">
               <span className="font-mono text-[10px] uppercase border border-border-hairline group-hover:border-accent-signal/50 px-2 py-0.5 rounded-sm text-ash mix-blend-plus-lighter transition-colors whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                 {track.category || "UNCLASSIFIED"}
               </span>
            </div>

            {/* Duration Col */}
            <div className="w-[80px] text-right font-mono text-[12px] text-ash group-hover:text-bone transition-colors">
               {track.duration || "N/A"}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center font-mono text-[12px] text-ash uppercase tracking-mono">
            NO RECORDS FOUND FOR "{query}"
          </div>
        )}
      </div>
    </motion.div>
  );
}
