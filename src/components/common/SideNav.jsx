import { NavLink } from 'react-router-dom';
import { useProfile } from '../../contexts/ProfileContext';
import { useTranslation } from '../../hooks/useTranslation';
import Badge from './Badge';

const navItems = [
  { emoji: '🏠', label: 'Home', to: '/home' },
  { emoji: '💬', label: 'Talk Board', to: '/talk-board' },
  { emoji: '🔊', label: 'Sounds', to: '/sound-explorer' },
  { emoji: '🔤', label: 'Word Builder', to: '/word-builder' },
  { emoji: '🎮', label: 'Games', to: '/match-and-learn' },
  { emoji: '🧩', label: 'Puzzles', to: '/puzzles' },
  { emoji: '⚙️', label: 'Dashboard', to: '/dashboard' },
];

export default function SideNav() {
  const { profile } = useProfile();
  const { t } = useTranslation();

  return (
    <nav
      className="hidden md:flex flex-col w-56 lg:w-64 bg-surface border-r border-gray-100 min-h-full shrink-0"
      aria-label="Sidebar navigation"
    >
      {/* Profile summary */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl shrink-0">
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
      <ul className="flex-1 px-3 py-3 space-y-1">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              aria-label={item.label}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-display text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-text-secondary hover:bg-gray-50 active:bg-gray-50'
                }`
              }
            >
              <span className="text-lg">{item.emoji}</span>
              <span>{t(item.label)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
