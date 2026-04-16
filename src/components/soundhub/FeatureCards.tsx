import { Link } from 'react-router-dom';

export default function FeatureCards() {
  const cards = [
    {
      id: 'latest',
      title: 'LATEST RELEASE',
      subtitle: 'Newest Upload',
      description: 'Alpha-Theta Interleave Sequence (v2.1)',
      isHighlight: false,
      link: '/sound-hub/uploads'
    },
    {
      id: 'curated',
      title: 'CURATED SELECTION',
      subtitle: 'From Database',
      description: 'The core tracks engineered for peak flow state.',
      isHighlight: false,
      link: '/sound-hub/archive'
    },
    {
      id: 'news',
      title: 'NEUROSCIENCE NEWS',
      subtitle: 'Research Feed',
      description: 'Explore the latest findings in auditory cognitive stimulation.',
      isHighlight: true,
      link: '/neuroscience-news.html',
      isExternal: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-8">
      {cards.map((card) => (
        <div 
          key={card.id} 
          className={`h-[160px] p-6 flex flex-col justify-between transition-all cursor-pointer hover:-translate-y-1 ${
            card.isHighlight 
              ? 'bg-accent-signal text-obsidian focus-within:ring-2 focus-within:ring-white border border-transparent' 
              : 'bg-panel text-bone border-t border-border-hairline hover:border-accent-signal'
          }`}
        >
          <div className="flex flex-col gap-1">
            <p className={`font-mono text-[11px] uppercase ${card.isHighlight ? 'text-obsidian' : 'text-ash'}`}>
              {card.subtitle}
            </p>
            <h3 className={`font-display text-[22px] font-bold leading-tight uppercase ${card.isHighlight ? 'text-obsidian' : 'text-bone'}`}>
              {card.title}
            </h3>
          </div>
          
          <p className={`font-sans text-[13px] line-clamp-2 ${card.isHighlight ? 'text-obsidian/80' : 'text-ash'}`}>
            {card.description}
          </p>
          
          {card.isExternal ? (
            <a href={card.link} className={`mt-auto w-fit font-mono text-[10px] uppercase tracking-mono flex items-center gap-2 transition-colors ${
              card.isHighlight ? 'text-obsidian hover:text-white' : 'text-accent-signal hover:text-white'
            }`}>
              ACCESS MODULE <span className="text-[12px]">→</span>
            </a>
          ) : (
            <Link to={card.link} className={`mt-auto w-fit font-mono text-[10px] uppercase tracking-mono flex items-center gap-2 transition-colors ${
              card.isHighlight ? 'text-obsidian hover:text-white' : 'text-accent-signal hover:text-white'
            }`}>
              ACCESS MODULE <span className="text-[12px]">→</span>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
