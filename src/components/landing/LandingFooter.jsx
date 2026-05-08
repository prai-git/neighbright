import { useTranslation } from '../../data/i18n';

const GITHUB_URL = 'https://github.com/prai-git/neighbright';

export default function LandingFooter() {
  const { t } = useTranslation();

  return (
    <footer className="bg-surface border-t-2 border-border" aria-label="Site footer">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Brand */}
          <div className="flex-1">
            <p className="font-display font-extrabold text-lg gradient-text mb-1">NeighBright ✨</p>
            <p className="text-xs text-text-secondary leading-relaxed">{t('landing.heroTitle')}</p>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation" className="flex gap-6 text-sm">
            <a href="#" className="text-text-secondary hover:text-white transition-colors font-display font-bold">{t('landing.footerAbout')}</a>
            <a href="#" className="text-text-secondary hover:text-white transition-colors font-display font-bold">{t('landing.footerPrivacy')}</a>
            <a href="#" className="text-text-secondary hover:text-white transition-colors font-display font-bold">{t('landing.footerContact')}</a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-white transition-colors font-display font-bold"
            >
              GitHub
            </a>
          </nav>
        </div>

        <div className="border-t border-border pt-4 text-center text-[10px] text-text-secondary/50">
          {t('landing.footerTagline')}
        </div>
      </div>
    </footer>
  );
}
