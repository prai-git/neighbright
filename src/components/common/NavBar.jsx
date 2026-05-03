import { useLocation, Link } from 'react-router-dom';
import { useProfile } from '../../contexts/ProfileContext';
import { useTranslation } from '../../data/i18n';
import LanguageSwitcher from './LanguageSwitcher';
import Button from './Button';

const routeNameKeys = {
  '/home': 'nav.home',
  '/talk-board': 'nav.talkBoard',
  '/sound-explorer': 'nav.sounds',
  '/word-builder': 'nav.wordBuilder',
  '/match-and-learn': 'nav.games',
  '/puzzles': 'nav.puzzles',
  '/dashboard': 'nav.dashboard',
};

export default function NavBar({ mode = 'app' }) {
  const location = useLocation();
  const { profile } = useProfile();
  const { t } = useTranslation();
  const moduleNameKey = routeNameKeys[location.pathname];

  return (
    <header className="sticky top-0 z-50 h-14 md:h-16 bg-surface shadow-sm flex items-center px-4 md:px-6">
      {/* Logo */}
      <Link to={mode === 'landing' ? '/' : '/home'} className="flex items-center gap-1 shrink-0">
        <span className={`font-display font-extrabold text-primary ${mode === 'landing' ? 'text-2xl' : 'text-lg'}`}>
          {t('app.name')}
        </span>
        <span className={mode === 'landing' ? 'text-2xl' : 'text-lg'}>✨</span>
      </Link>

      {/* Center: module name (app mode, md+) */}
      {mode === 'app' && moduleNameKey && (
        <span className="hidden md:block flex-1 text-center font-display font-semibold text-text-secondary text-sm">
          {t(moduleNameKey)}
        </span>
      )}

      <div className="flex-1 md:flex-none" />

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        {mode === 'landing' && (
          <Link to="/onboarding">
            <Button size="sm">{t('nav.getStarted')}</Button>
          </Link>
        )}
        {mode === 'app' && (
          <Link
            to="/dashboard"
            aria-label={t('nav.dashboard')}
            className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-lg"
          >
            {profile?.avatarKey || '👤'}
          </Link>
        )}
      </div>
    </header>
  );
}
