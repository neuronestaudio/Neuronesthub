import { Bell } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="h-[72px] border-b border-border-hairline flex items-center justify-between px-8 bg-obsidian">
      {/* Left - Neuronest Radio Link */}
      <a href="/radio.html" className="group flex items-center gap-3 cursor-pointer">
        <div className="w-6 h-6 bg-accent-signal ml-[-32px] md:ml-[0px] transition-shadow duration-300 shadow-[0_0_0_rgba(224,177,0,0)] group-hover:shadow-[0_0_12px_rgba(224,177,0,0.4)]"></div>
        <div className="relative font-mono text-[12px] tracking-brand uppercase hidden md:block w-[180px]">
           <span className="text-ash absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-0 whitespace-nowrap">
             NEURONEST / SOUND HUB
           </span>
           <span className="text-accent-signal transition-opacity duration-300 opacity-0 group-hover:opacity-100 whitespace-nowrap flex items-center gap-1">
             NEURONEST RADIO <span>→</span>
           </span>
        </div>
      </a>

      {/* Right */}
      <div className="flex items-center gap-3">
        <input 
          type="text" 
          placeholder="Query signal archive..." 
          aria-label="Search"
          className="w-[320px] bg-panel border-hairline py-2 px-4 font-mono text-[12px] text-bone placeholder:text-ash focus:outline-none focus:ring-2 focus:ring-accent-signal focus:border-transparent transition-shadow hidden md:block"
        />
        <button 
          aria-label="Notifications" 
          className="w-8 h-8 border border-border-hairline flex items-center justify-center text-ash hover:text-bone hover:border-accent-signal transition-colors focus:outline-none focus:ring-2 focus:ring-accent-signal focus:ring-offset-2 focus:ring-offset-obsidian"
        >
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}
