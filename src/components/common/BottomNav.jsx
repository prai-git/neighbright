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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-[env(safe-area-inset-bottom)]"
      style={{ background: 'rgba(19, 31, 36, 0.98)', boxShadow: '0 -2px 0 rgba(0,0,0,0.3)' }}
      aria-label="Bottom navigation"
    >
      <div className="flex items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={t(item.labelKey)}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 h-full text-[10px] font-display font-extrabold transition-colors relative ${
                isActive
                  ? 'text-primary'
                  : 'text-text-secondary/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full" />
                )}
                <span className={`text-xl ${isActive ? 'scale-110' : 'grayscale-[40%] opacity-70'} transition-transform`}>
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
