import { useLocation, Link } from 'react-router-dom';
import { useProfile } from '../../contexts/ProfileContext';
import LanguageSwitcher from './LanguageSwitcher';
import Button from './Button';

const routeNames = {
  '/home': 'Home',
  '/talk-board': 'Talk Board',
  '/sound-explorer': 'Sound Explorer',
  '/word-builder': 'Word Builder',
  '/match-and-learn': 'Match & Learn',
  '/puzzles': 'Puzzles',
  '/dashboard': 'Dashboard',
};

export default function NavBar({ mode = 'app' }) {
  const location = useLocation();
  const { profile } = useProfile();
  const moduleName = routeNames[location.pathname] || '';

  return (
    <header className="sticky top-0 z-50 h-14 md:h-16 bg-surface shadow-sm flex items-center px-4 md:px-6">
      {/* Logo */}
      <Link to={mode === 'landing' ? '/' : '/home'} className="flex items-center gap-1 shrink-0">
        <span className={`font-display font-extrabold text-primary ${mode === 'landing' ? 'text-2xl' : 'text-lg'}`}>
          NeighBright
        </span>
        <span className={mode === 'landing' ? 'text-2xl' : 'text-lg'}>✨</span>
      </Link>

      {/* Center: module name (app mode, md+) */}
      {mode === 'app' && moduleName && (
        <span className="hidden md:block flex-1 text-center font-display font-semibold text-text-secondary text-sm">
          {moduleName}
        </span>
      )}

      <div className="flex-1 md:flex-none" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        {mode === 'landing' && (
          <Link to="/onboarding">
            <Button size="sm">Get Started</Button>
          </Link>
        )}
        {mode === 'app' && (
          <Link
            to="/dashboard"
            aria-label="Profile and dashboard"
            className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-lg"
          >
            {profile?.avatarKey || '👤'}
          </Link>
        )}
      </div>
    </header>
  );
}
