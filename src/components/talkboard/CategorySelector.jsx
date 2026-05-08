import { useRef } from 'react';
import { useTranslation } from '../../data/i18n';

export default function CategorySelector({ categories, active, onSelect }) {
  const { t } = useTranslation();
  const scrollRef = useRef(null);

  const handleSelect = (cat) => {
    onSelect(cat);
    const btn = scrollRef.current?.querySelector(`[data-id="${cat.id}"]`);
    btn?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto hide-scrollbar pt-1 pb-2"
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
            className={[
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-display font-extrabold whitespace-nowrap shrink-0 transition-all cursor-pointer border-2',
              isActive
                ? 'text-white shadow-[0_3px_0_rgba(0,0,0,0.2)]'
                : 'bg-surface text-text-secondary border-border hover:border-white/20',
            ].join(' ')}
            style={isActive ? { backgroundColor: cat.color, borderColor: cat.color } : undefined}
          >
            <span className="text-lg">{cat.icon}</span>
            <span>{t(cat.i18nKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
