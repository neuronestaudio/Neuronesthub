export default function ResearchFeed() {
  const feed = [
    { title: 'Alpha Entrainment Protocol V.2 Results', source: 'Internal', date: '04.16.26' },
    { title: 'Cortical Tracking in Brown Noise', source: 'Journal of Neurosci', date: '04.12.26' },
    { title: 'HRV Up-regulation via Phase Locked Tones', source: 'PsychoPhy', date: '04.09.26' },
    { title: 'Parasympathetic Reset Baseline Adjustment', source: 'Internal', date: '04.01.26' },
  ];

  return (
    <section className="w-full flex flex-col pt-8">
      <div className="mb-6 mb-6">
        <h4 className="font-mono text-[11px] text-ash tracking-mono uppercase">RESEARCH FEED</h4>
      </div>

      <div className="flex flex-col gap-5 border-t border-border-hairline pt-4">
        {feed.map((item, i) => (
          <a key={i} href="#" className="group">
            <h5 className="text-[13px] text-bone font-medium mb-1 group-hover:text-accent-signal transition-colors group-hover:underline underline-offset-2">{item.title}</h5>
            <div className="flex gap-2 font-mono text-[10px] text-ash uppercase">
              <span>{item.source}</span>
              <span>·</span>
              <span>{item.date}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
