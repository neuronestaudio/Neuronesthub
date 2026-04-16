import { Protocol } from '../../types/soundHub';
import { Apple, Play } from 'lucide-react';

interface HeroPanelProps {
  protocol: Protocol;
  onExecute: () => void;
}

export default function HeroPanel({ protocol, onExecute }: HeroPanelProps) {
  return (
    <section className="relative w-full h-[400px] bg-obsidian p-12 overflow-hidden flex flex-col justify-center">
      {/* Background Video */}
      <video 
        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen mix-blend-luminosity"
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src="/assets/hero_banner.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/60 to-transparent" />

      <div className="relative z-10 max-w-[60%]">
        <div className="inline-block bg-accent-signal text-obsidian font-mono text-[10px] uppercase px-[10px] py-[6px] mb-6">
          {protocol.label}
        </div>
        
        <h1 className="font-display font-bold text-[44px] xl:text-[72px] leading-[0.95] uppercase mb-6 whitespace-pre-wrap">
          {protocol.title}
        </h1>
        
        <p className="text-[15px] font-sans text-ash max-w-[480px] mb-8 leading-relaxed line-clamp-3">
          {protocol.body}
        </p>

        <div className="flex items-center gap-6">
          <button 
            onClick={onExecute}
            className="h-[48px] px-8 bg-accent-signal text-obsidian font-mono text-[12px] uppercase font-bold hover:border-2 hover:border-obsidian focus:outline-none focus:ring-2 focus:ring-accent-signal focus:ring-offset-2 focus:ring-offset-panel transition-all shrink-0"
          >
            {protocol.ctaLabel}
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-obsidian/40 border border-border-hairline backdrop-blur-md hover:bg-panel transition-colors cursor-pointer group rounded-sm opacity-80 hover:opacity-100">
              <Apple size={20} className="text-bone group-hover:text-white transition-colors" />
              <div className="flex flex-col">
                <span className="text-[7px] text-ash tracking-widest uppercase leading-none font-mono mb-0.5">Download on the</span>
                <span className="text-[13px] text-bone font-sans font-semibold leading-none tracking-tight">App Store</span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2 bg-obsidian/40 border border-border-hairline backdrop-blur-md hover:bg-panel transition-colors cursor-pointer group rounded-sm opacity-80 hover:opacity-100">
              <Play size={18} className="text-bone group-hover:text-accent-signal transition-colors" />
              <div className="flex flex-col">
                <span className="text-[7px] text-ash tracking-widest uppercase leading-none font-mono mb-0.5">Get it on</span>
                <span className="text-[13px] text-bone font-sans font-semibold leading-none tracking-tight">Google Play</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
