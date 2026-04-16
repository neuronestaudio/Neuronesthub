import { Link, useLocation } from 'react-router-dom';
import { Home, Music, BookOpen, Info } from 'lucide-react';

export default function RadioSidebar() {
  const { pathname } = useLocation();

  const links = [
    { icon: Home, label: 'Home', path: '/sound-hub' },
    { icon: Music, label: 'Sound Hub', path: '/sound-hub' },
    { icon: BookOpen, label: 'Research Hub', path: '/research-hub' },
    { icon: Info, label: 'Learn More', path: '#' },
  ];

  const pathways = [
    { color: 'bg-[#60D385]', label: 'Focus' },
    { color: 'bg-[#A78BFA]', label: 'Sleep' },
    { color: 'bg-[#38BDF8]', label: 'Calm' },
  ];

  return (
    <aside className="w-[260px] h-full bg-[#050505] overflow-y-auto flex flex-col shrink-0 border-r border-[#1a1a1a]">
      {/* Brand */}
      <div className="p-6 pb-8">
        <Link to="/sound-hub" className="flex items-center gap-3 no-underline group">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#A3B8FA] to-[#697BF6] flex-shrink-0 group-hover:scale-105 transition-transform" />
          <span className="font-bold text-white tracking-wide text-xl font-display">NeuroNest</span>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="px-3 mb-8 flex flex-col gap-1">
        {links.map((link, i) => {
          const isActive = pathname === link.path;
          const Icon = link.icon;
          return (
            <Link
              key={i}
              to={link.path}
              className={`flex items-center gap-4 px-3 py-[10px] rounded hover:bg-[#1A1A1A] transition-colors ${
                isActive ? 'text-white bg-[#1a1a1a]/50' : 'text-[#888888] hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : ''} />
              <span className="font-medium text-[14px]">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Pathways */}
      <div className="px-6 mb-4">
        <h4 className="text-[11px] font-mono tracking-[0.15em] text-[#666666] mb-3">YOUR PATHWAYS</h4>
        <div className="flex flex-col gap-1">
          {pathways.map((path, i) => (
            <div 
              key={i} 
              className="flex items-center gap-3 py-2 cursor-pointer hover:bg-[#1A1A1A] px-2 -mx-2 rounded transition-colors group"
            >
              <div className={`w-2 h-2 rounded-full ${path.color} group-hover:scale-125 transition-transform`} />
              <span className="text-[14px] text-[#A0A0A0] group-hover:text-white font-medium">{path.label}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
