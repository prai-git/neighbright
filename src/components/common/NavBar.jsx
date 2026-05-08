import { Link } from 'react-router-dom';
import { useProfile } from '../../contexts/ProfileContext';
import { useTranslation } from '../../data/i18n';
import LanguageSwitcher from './LanguageSwitcher';
import Button from './Button';

export default function NavBar({ mode = 'app' }) {
  const { profile } = useProfile();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 glass border-b-2 border-border">
      <div className="flex items-center h-14 px-5 md:px-10 lg:px-16">
        {/* Logo */}
        <Link to={mode === 'landing' ? '/' : '/home'} className="flex items-center gap-1.5 shrink-0">
          <span className="font-display font-extrabold text-xl gradient-text tracking-tight">
            {t('app.name')}
          </span>
          <span className="text-lg">✨</span>
        </Link>

        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {mode === 'app' && (
            <Link
              to="/home"
              aria-label={t('nav.home')}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl hover:bg-white/10 transition-colors"
            >
              🏠
            </Link>
          )}

          {mode === 'landing' && (
            <Link to="/onboarding">
              <Button size="sm">{t('nav.getStarted')}</Button>
            </Link>
          )}

          {mode === 'app' && (
            <Link
              to="/dashboard"
              aria-label={t('nav.dashboard')}
              className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-lg hover:bg-primary/30 transition-colors border border-primary/30"
            >
              {profile?.avatarKey || '👤'}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
