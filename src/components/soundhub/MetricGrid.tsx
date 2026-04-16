import { Metric } from '../../types/soundHub';

export function MetricCard({ metric }: { metric: Metric }) {
  const isDiagnostic = metric.id === 'm-4';

  if (isDiagnostic) {
    return (
      <div className="h-[160px] bg-accent-signal p-6 flex flex-col justify-between focus-within:ring-2 focus-within:ring-white">
        <p className="font-mono text-[11px] text-obsidian uppercase">DIAGNOSTIC</p>
        <button className="border border-obsidian bg-transparent hover:bg-obsidian hover:text-accent-signal text-obsidian font-mono text-[12px] uppercase tracking-mono pr-4 pl-4 py-2 mt-auto w-fit transition-colors focus:outline-none">
          RUN NOW
        </button>
      </div>
    );
  }

  return (
    <div className={`h-[160px] bg-panel p-6 border-t ${metric.highlighted ? 'border-accent-signal' : 'border-border-hairline'} flex flex-col justify-between`}>
      <p className="font-mono text-[11px] text-ash uppercase">{metric.label}</p>
      
      <div className="flex items-baseline gap-1 mt-2 mb-auto">
        <span className="font-display text-[36px]">{metric.value}</span>
        {metric.unit && <span className="text-ash">{metric.unit}</span>}
      </div>

      <div className="flex items-center gap-2 font-mono text-[11px]">
        {metric.state === 'optimal' && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
        {metric.state === 'warn' && <span className="w-2 h-2 rounded-full bg-danger"></span>}
        <span className={metric.state === 'optimal' ? 'text-green-500' : metric.state === 'warn' ? 'text-danger' : 'text-ash'}>
          {metric.state === 'optimal' ? 'Optimal' : metric.state === 'syncing' ? 'Synchronising...' : metric.state === 'warn' ? 'Warning' : 'Last 7 days'}
        </span>
      </div>
    </div>
  );
}

export default function MetricGrid({ metrics }: { metrics: Metric[] }) {
  // Pad with diagnostic block
  const fullMetrics = [...metrics, { id: 'm-4', label: 'DIAGNOSTIC', value: '' }];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 mt-8">
      {fullMetrics.map((m, i) => (
        <MetricCard key={m.id} metric={m} />
      ))}
    </div>
  );
}
