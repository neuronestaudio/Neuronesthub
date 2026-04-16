export default function ActiveListeners() {
  return (
    <section className="w-full flex flex-col pt-2">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-mono text-[11px] text-ash tracking-mono uppercase">ACTIVE LISTENERS</h4>
        <span className="font-mono text-[11px] text-accent-signal bg-accent-signal/10 px-2 py-0.5 rounded-sm">1.2K ONLINE</span>
      </div>

      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center gap-4 group">
            <div className="w-8 h-8 rounded-full bg-panel border-2 border-panel-alt overflow-hidden shrink-0 relative">
               <div className="absolute inset-0 bg-gradient-to-br from-ash/20 to-transparent" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[11px] text-bone uppercase group-hover:text-accent-signal transition-colors">USER-{Math.floor(Math.random()*9000)+1000}</span>
              <span className="font-mono text-[10px] text-ash uppercase line-clamp-1">Syncing to Focus Protocol...</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
