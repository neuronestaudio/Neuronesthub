import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

export default function LandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="landing-page-root min-h-screen">
      <header className="top-nav z-[100]">
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold tracking-tighter no-underline">NEURONEST</Link>
          <nav className="flex gap-8 items-center">
            <Link to="/research-hub" className="text-[12px] uppercase tracking-widest no-underline opacity-70 hover:opacity-100 transition-opacity">Research Hub</Link>
            <Link to="/sound-hub" className="text-[12px] uppercase tracking-widest no-underline opacity-70 hover:opacity-100 transition-opacity">Sound Hub</Link>
            <Link to="/radio" className="px-5 py-2 border border-white/20 rounded-full text-[10px] uppercase font-bold tracking-[2px] transition-all hover:bg-white hover:text-black">Radio App</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <video className="hero-video" autoPlay loop muted playsinline>
            <source src="/assets/hero_banner.mp4" type="video/mp4" />
          </video>
          <div className="relative z-10 px-6">
            <h1 className="font-display">TRANSCEND<br />THROUGH SOUND</h1>
            <p className="font-sans">The world's first neuro-orchestrated audio environment platform designed to modulate cognitive state and enhance human potential.</p>
            <div className="flex justify-center gap-4 mt-10">
              <Link to="/sound-hub" className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-[11px] rounded transition-transform hover:scale-105">Enter Sound Hub</Link>
              <Link to="/radio" className="px-8 py-3 border border-white/30 text-white font-bold uppercase tracking-widest text-[11px] rounded transition-all hover:bg-white/10">Launch Radio</Link>
            </div>
          </div>
        </section>

        {/* Community / Form Section (Simplified restoration) */}
        <section className="section-block bg-black">
          <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-accent text-[11px] font-mono tracking-widest uppercase mb-4 block">Our Mission</span>
              <h2 className="text-4xl md:text-6xl font-bold leading-none mb-8">Pioneering the Future of Auditory Neuroscience.</h2>
              <p className="text-gray-400 leading-relaxed mb-6">Neuronest is dedicated to creating immersive, research-backed sound environments that help people focus, sleep, and heal. Our proprietary algorithms interleave specific frequencies tailored to your brain's natural rhythms.</p>
            </div>
            <div className="bg-[#0A0A0A] p-10 border border-white/10 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Join the Community</h3>
              <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Name</label>
                  <input type="text" className="bg-black border border-white/10 p-3 rounded text-sm focus:outline-none focus:border-accent" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Email</label>
                  <input type="email" className="bg-black border border-white/10 p-3 rounded text-sm focus:outline-none focus:border-accent" />
                </div>
                <button type="button" className="bg-white text-black font-bold p-3 rounded mt-4 uppercase tracking-widest text-[12px]">Submit</button>
              </form>
            </div>
          </div>
        </section>

        <section className="footer-banner">
          <video className="footer-banner-video" autoPlay loop muted playsinline>
            <source src="/assets/footer_animation.mp4" type="video/mp4" />
          </video>
          <div className="footer-banner-text relative z-10 px-6">
            EXPLORE YOUR POTENTIAL WITH<br />NEUROSCIENCE BACKED SOUNDSCAPES
          </div>
        </section>
      </main>

      <footer className="py-20 bg-black border-t border-white/10 text-center">
        <h4 className="text-[120px] font-bold leading-[0.8] opacity-10 mb-10 select-none">FLOW<br />STATE</h4>
        <div className="flex justify-center gap-6 mb-8 text-gray-500">
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-white transition-colors">YouTube</a>
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
        </div>
        <p className="text-gray-600 text-[10px] uppercase tracking-widest">NeuroNest Hub Australia &copy; 2025</p>
      </footer>
    </div>
  );
}
