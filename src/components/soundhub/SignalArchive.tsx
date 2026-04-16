import CategoryModule from './CategoryModule';
import { Category } from '../../types/soundHub';

export default function SignalArchive({ categories, filterQuery }: { categories: Category[], filterQuery: string }) {
  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(filterQuery.toLowerCase()) || 
    c.modality.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <section>
      <div className="mb-4">
        <h4 className="font-mono text-[11px] text-ash tracking-mono uppercase">SIGNAL ARCHIVE</h4>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map(cat => (
          <CategoryModule key={cat.slug} category={cat} />
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="h-[140px] border border-border-hairline flex items-center justify-center text-ash font-mono text-[12px] uppercase tracking-mono border-dashed">
          NO SIGNALS MATCHING "{filterQuery}"
        </div>
      )}
    </section>
  );
}
