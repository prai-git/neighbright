import { useTranslation } from '../../data/i18n';

const GITHUB_URL = 'https://github.com/prai-git/neighbright';

export default function LandingFooter() {
  const { t } = useTranslation();

  return (
    <footer className="bg-text-primary text-white" aria-label="Site footer">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Col 1: Brand */}
          <div>
            <p className="font-display font-extrabold text-2xl mb-2">NeighBright ✨</p>
            <p className="text-sm text-white/70 leading-relaxed">{t('landing.heroTitle')}</p>
          </div>

          {/* Col 2: Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-col gap-2 text-sm text-white/80">
              <li>
                <a href="#" className="hover:text-white transition-colors">{t('landing.footerAbout')}</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">{t('landing.footerPrivacy')}</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">{t('landing.footerContact')}</a>
              </li>
            </ul>
          </nav>

          {/* Col 3: Open source */}
          <div className="flex flex-col gap-2">
            <p className="text-sm text-white/70">Open source • MIT License</p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
              aria-label="View NeighBright on GitHub"
            >
              {/* GitHub SVG icon */}
              <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 text-center text-xs text-white/50">
          {t('landing.footerTagline')}
        </div>
      </div>
    </footer>
  );
}
