import { Category } from '../../types/soundHub';

export default function CategoryModule({ category }: { category: Category }) {
  return (
    <div className="h-[140px] bg-panel p-5 flex flex-col justify-between border border-transparent hover:border-accent-signal transition-colors duration-150 cursor-pointer">
      <h3 className="font-display text-[18px] uppercase tracking-normal">{category.name}</h3>
      
      <div className="my-auto">
        <span className="font-mono text-[10px] uppercase border border-border-hairline px-2 py-1 rounded-sm text-ash mix-blend-plus-lighter">
          {category.modality}
        </span>
      </div>

      <div className="font-mono text-[10px] text-ash uppercase tracking-mono mt-auto flex items-center justify-between">
        <span>{category.trackCount} TRACKS · {category.durationMin} MIN</span>
        <span className="opacity-60 border-l border-border-hairline pl-2">
          EVIDENCE L{category.evidenceLevel}
        </span>
      </div>
    </div>
  );
}
