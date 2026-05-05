import { useTranslation } from '../../data/i18n';

const GITHUB_URL = 'https://github.com/prai-git/neighbright';

export default function LandingFooter() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#2D3436] text-white" aria-label="Site footer">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Brand */}
          <div className="flex-1">
            <p className="font-display font-extrabold text-lg mb-1">NeighBright ✨</p>
            <p className="text-xs text-white/50 leading-relaxed">{t('landing.heroTitle')}</p>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation" className="flex gap-6 text-sm">
            <a href="#" className="text-white/60 hover:text-white transition-colors">{t('landing.footerAbout')}</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">{t('landing.footerPrivacy')}</a>
            <a href="#" className="text-white/60 hover:text-white transition-colors">{t('landing.footerContact')}</a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>

        <div className="border-t border-white/10 pt-4 text-center text-[10px] text-white/30">
          {t('landing.footerTagline')}
        </div>
      </div>
    </footer>
  );
}
