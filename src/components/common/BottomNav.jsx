import { NavLink } from 'react-router-dom';
import { useTranslation } from '../../data/i18n';

const navItems = [
  { emoji: '🏠', labelKey: 'nav.home', to: '/home' },
  { emoji: '💬', labelKey: 'nav.talkBoard', to: '/talk-board' },
  { emoji: '🔤', labelKey: 'nav.wordBuilder', to: '/word-builder' },
  { emoji: '🧩', labelKey: 'nav.puzzles', to: '/puzzles' },
  { emoji: '⚙️', labelKey: 'nav.dashboard', to: '/dashboard' },
];

export default function BottomNav() {
  const { t } = useTranslation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-gray-100 z-40 flex items-center"
      aria-label="Bottom navigation"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          aria-label={t(item.labelKey)}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 h-full text-xs font-display font-semibold transition-colors ${
              isActive ? 'text-primary' : 'text-text-secondary'
            }`
          }
        >
          <span className="text-xl">{item.emoji}</span>
          <span>{t(item.labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
