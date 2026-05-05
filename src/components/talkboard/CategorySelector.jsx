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
      className="flex gap-2 overflow-x-auto hide-scrollbar py-1"
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
              'flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-display font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer',
              isActive
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-text-secondary border border-border hover:border-text-secondary/30',
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
