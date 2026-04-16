import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ResearchHub.css';

export default function ResearchHub() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const studies = [
    { title: "Enhancement of sleep slow waves", authors: "Bellesi M, Tononi G", cat: "Sleep", color: "#a78bfa" },
    { title: "Gamma entrainment offers neuroprotection", authors: "Tsai LH, et al (MIT)", cat: "Focus", color: "#8ea3ff" },
    { title: "Auditory beats in the brain", authors: "Oster G", cat: "Other", color: "#94a3b8" },
    { title: "Music structure determines HRV", authors: "Vickhoff B, et al", cat: "Calm", color: "#67e8f9" }
  ];

  return (
    <div className="research-hub-root min-h-screen pb-20">
      <header className="top-nav px-8 py-6 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur z-[100] border-b border-white/5">
        <Link to="/" className="font-bold tracking-tighter decoration-none">NEURONEST</Link>
        <div className="flex gap-6 text-[11px] uppercase tracking-widest font-bold">
          <Link to="/" className="opacity-60 hover:opacity-100">Home</Link>
          <Link to="/sound-hub" className="opacity-60 hover:opacity-100">Sound Hub</Link>
        </div>
      </header>

      <div className="hero">
        <video autoPlay loop muted playsinline className="absolute inset-0">
          <source src="/assets/hero_banner.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 px-6 max-w-[800px]">
          <h1 className="text-4xl md:text-7xl font-bold mb-4">Research Hub</h1>
          <p className="text-gray-300 text-lg">A deep-dive into the clinical studies and neuromodulation protocols that power the Neuronest engine.</p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 mt-20">
        <h2 className="text-3xl font-bold mb-10">Deep Research Insights</h2>
        <div className="flex flex-col gap-4">
          {studies.map((study, i) => (
            <div key={i} className="research-card">
              <div className="flex-1">
                <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-1 rounded bg-white/5 border border-white/10 mb-4 inline-block" style={{ color: study.color }}>{study.cat}</span>
                <h3 className="text-xl font-bold mb-2">{study.title}</h3>
                <p className="text-gray-500 text-sm">{study.authors}</p>
              </div>
              <div className="flex items-center text-accent text-sm font-bold tracking-widest uppercase">
                Read →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
