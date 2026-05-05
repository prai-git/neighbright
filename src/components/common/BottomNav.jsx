import { NavLink } from 'react-router-dom';
import { useTranslation } from '../../data/i18n';

const navItems = [
  { emoji: '🏠', labelKey: 'nav.home', to: '/home' },
  { emoji: '💬', labelKey: 'nav.talkBoard', to: '/talk-board' },
  { emoji: '🔊', labelKey: 'nav.sounds', to: '/sound-explorer' },
  { emoji: '🧩', labelKey: 'nav.puzzles', to: '/puzzles' },
  { emoji: '⚙️', labelKey: 'nav.dashboard', to: '/dashboard' },
];

export default function BottomNav() {
  const { t } = useTranslation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 pb-[env(safe-area-inset-bottom)]"
      aria-label="Bottom navigation"
    >
      <div className="flex items-center h-14">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={t(item.labelKey)}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 h-full text-[10px] font-display font-bold transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-text-secondary/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`text-xl ${isActive ? '' : 'grayscale-[30%]'}`}>
                  {item.emoji}
                </span>
                <span>{t(item.labelKey)}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
