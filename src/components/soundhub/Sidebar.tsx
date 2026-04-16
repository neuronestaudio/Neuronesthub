import { Activity, Disc3, Settings, Shield, Brain, Lightbulb } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export default function Sidebar() {
  const { pathname } = useLocation();

  const primaryLinks = [
    { icon: Activity, path: '/sound-hub' },
    { icon: Disc3, path: '/sound-hub/archive' },
    { icon: Shield, path: '/sound-hub/security' },
    { icon: Brain, path: '/sound-hub/experiments', label: 'AI Studio' },
    { icon: Lightbulb, path: '/sound-hub/theory', label: 'Theory Engine' },
    { 
      icon: () => <div className="w-[18px] h-[18px] bg-accent-signal rounded-sm shadow-[0_0_8px_rgba(224,177,0,0.5)] group-hover:scale-110 transition-transform"></div>, 
      path: '/radio', 
      label: 'NeuroNest Radio'
    },
  ];

  return (
    <aside className="w-[64px] h-full bg-obsidian border-r border-border-hairline flex flex-col items-center justify-between py-6">
      <div className="flex flex-col gap-6 w-full items-center">
        {primaryLinks.map((link, i) => {
          const isActive = pathname === link.path || pathname.startsWith(link.path) && link.path !== '/sound-hub';
          const Icon = link.icon;
          const classes = `group relative flex items-center justify-center w-12 h-12 rounded hover:bg-panel transition-colors ${isActive ? 'text-bone' : 'text-ash hover:text-bone'}`;


          return (
            <Link 
              key={i} 
              to={link.path}
              title={link.label || link.path}
              aria-label={link.label || link.path}
              className={classes}
            >
              <Icon size={24} />
              {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-6 bg-accent-signal" />}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col gap-6 w-full items-center mb-8">
        <button aria-label="Settings" title="Settings" className="text-ash hover:text-bone transition-colors w-12 h-12 flex items-center justify-center hover:bg-panel rounded">
          <Settings size={24} />
        </button>
        <div className="w-8 h-8 rounded-full bg-panel border gap-4 border-border-hairline overflow-hidden cursor-pointer" aria-label="User Profile" title="User Profile">
          {/* Avatar image could go here */}
          <div className="w-full h-full bg-gradient-to-tr from-panel-alt to-ash opacity-50" />
        </div>
      </div>
    </aside>
  );
}
