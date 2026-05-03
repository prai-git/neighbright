import { useRef } from 'react';
import { useTranslation } from '../../data/i18n';

export default function CategorySelector({ categories, active, onSelect }) {
  const { t } = useTranslation();
  const scrollRef = useRef(null);

  const handleSelect = (cat) => {
    onSelect(cat);
    // Scroll selected button into view
    const btn = scrollRef.current?.querySelector(`[data-id="${cat.id}"]`);
    btn?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto px-4 py-3 scroll-smooth"
      style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
      role="tablist"
      aria-label="Categories"
    >
      {categories.map((cat) => {
        const isActive = active?.id === cat.id;
        return (
          <button
            key={cat.id}
            data-id={cat.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => handleSelect(cat)}
            style={isActive ? { backgroundColor: `${cat.color}33`, borderColor: cat.color } : {}}
            className={[
              'flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-display font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer',
              isActive ? 'shadow-sm' : 'border-gray-200 bg-surface text-text-secondary hover:border-gray-300',
            ].join(' ')}
          >
            <span className="text-base">{cat.icon}</span>
            <span>{t(cat.i18nKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
