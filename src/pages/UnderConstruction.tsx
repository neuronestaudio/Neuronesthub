import { motion } from 'framer-motion';

export default function UnderConstruction({ title }: { title: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-[60vh] flex flex-col items-center justify-center border border-dashed border-border-hairline bg-panel/30"
    >
        <div className="w-12 h-12 bg-accent-signal text-obsidian flex items-center justify-center mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <h2 className="font-display text-[24px] uppercase tracking-wide mb-2">{title}</h2>
        <p className="font-mono text-[12px] text-ash uppercase tracking-mono">Access Restricted / Module Offline</p>
    </motion.div>
  );
}
