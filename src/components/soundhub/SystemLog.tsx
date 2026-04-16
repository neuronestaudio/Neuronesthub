import { LogEntry } from '../../types/soundHub';

export default function SystemLog({ entries }: { entries: LogEntry[] }) {
  const recentEntries = entries.slice(0, 6); // Last 6

  return (
    <section className="bg-panel p-6 w-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-mono text-[11px] text-ash tracking-mono uppercase">SYSTEM LOG</h4>
        <button className="font-mono text-[10px] text-ash hover:text-bone uppercase tracking-mono">
          [ FILTER VIEW ]
        </button>
      </div>

      <div className="flex flex-col gap-3 font-mono text-[12px]">
        {recentEntries.map((log, i) => (
          <div key={i} className="flex gap-4 border-l-2 border-border-hairline pl-3 hover:border-accent-signal transition-colors group">
            <span className="text-ash w-[70px] shrink-0">{log.timestamp}</span>
            <span className="text-bone truncate group-hover:text-accent-signal transition-colors">{log.event}</span>
            <span className="text-ash/50 ml-auto hidden sm:block shrink-0">{log.source}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
