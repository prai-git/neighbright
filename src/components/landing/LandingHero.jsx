import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../data/i18n';
import Button from '../common/Button';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: 'easeOut', delay },
});

export default function LandingHero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden bg-background">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
        {/* Logo + spark */}
        <motion.div {...fadeUp(0)} className="flex items-center gap-2">
          <span className="font-display font-extrabold text-5xl md:text-7xl text-text-primary">
            NeighBright
          </span>
          <motion.span
            animate={{ rotate: [0, 15, -15, 10, 0], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-4xl md:text-6xl"
          >
            ✨
          </motion.span>
        </motion.div>

        {/* Tagline */}
        <motion.p {...fadeUp(0.1)} className="text-xl md:text-2xl text-text-secondary font-display font-semibold max-w-2xl">
          {t('landing.heroTitle')}
        </motion.p>

        {/* Description */}
        <motion.p {...fadeUp(0.2)} className="text-base md:text-lg text-text-secondary max-w-xl">
          {t('landing.heroDescription')}
        </motion.p>

        {/* CTA */}
        <motion.div {...fadeUp(0.3)}>
          <Link to="/onboarding">
            <Button size="xl" variant="primary" className="shadow-lg shadow-primary/30">
              {t('landing.heroCta')}
            </Button>
          </Link>
        </motion.div>

        {/* Subtext */}
        <motion.p {...fadeUp(0.4)} className="text-sm text-text-secondary">
          {t('landing.heroSubtext')}
        </motion.p>

        {/* Scroll hint */}
        <motion.div
          {...fadeUp(0.6)}
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="mt-4 text-text-secondary/50 text-2xl"
          aria-hidden="true"
        >
          ↓
        </motion.div>
      </div>
    </section>
  );
}
