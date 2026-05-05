import { NavLink } from 'react-router-dom';
import { useProfile } from '../../contexts/ProfileContext';
import { useTranslation } from '../../data/i18n';
import Badge from './Badge';

const navItems = [
  { emoji: '🏠', labelKey: 'nav.home', to: '/home' },
  { emoji: '💬', labelKey: 'nav.talkBoard', to: '/talk-board' },
  { emoji: '🔊', labelKey: 'nav.sounds', to: '/sound-explorer' },
  { emoji: '🔤', labelKey: 'nav.wordBuilder', to: '/word-builder' },
  { emoji: '🎮', labelKey: 'nav.games', to: '/match-and-learn' },
  { emoji: '🧩', labelKey: 'nav.puzzles', to: '/puzzles' },
  { emoji: '⚙️', labelKey: 'nav.dashboard', to: '/dashboard' },
];

export default function SideNav() {
  const { profile } = useProfile();
  const { t } = useTranslation();

  return (
    <nav
      className="hidden md:flex flex-col w-56 lg:w-64 bg-white/60 backdrop-blur-sm border-r border-border/40 min-h-full shrink-0"
      aria-label="Sidebar navigation"
    >
      {/* Profile summary */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border/40">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 border border-primary/10 flex items-center justify-center text-xl shrink-0">
          {profile?.avatarKey || '👤'}
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-text-primary text-sm truncate">
            {profile?.name || 'My Child'}
          </p>
          {profile?.tier && (
            <Badge variant="tier" color="primary">
              Tier {profile.tier}
            </Badge>
          )}
        </div>
      </div>

      {/* Nav items */}
      <ul className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              aria-label={t(item.labelKey)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-display text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-text-secondary hover:bg-white/80 hover:text-text-primary'
                }`
              }
            >
              <span className="text-lg w-6 text-center">{item.emoji}</span>
              <span>{t(item.labelKey)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
