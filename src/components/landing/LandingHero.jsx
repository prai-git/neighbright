import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../data/i18n';
import Button from '../common/Button';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut', delay },
});

export default function LandingHero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-5">
        {/* Logo */}
        <motion.div {...fadeUp(0)} className="flex items-center gap-2">
          <span className="font-display font-extrabold text-5xl md:text-6xl text-text-primary tracking-tight">
            NeighBright
          </span>
          <motion.span
            animate={{ rotate: [0, 12, -12, 8, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-4xl md:text-5xl"
          >
            ✨
          </motion.span>
        </motion.div>

        {/* Tagline */}
        <motion.p {...fadeUp(0.1)} className="text-lg md:text-xl text-text-secondary font-display font-semibold max-w-lg leading-relaxed">
          {t('landing.heroTitle')}
        </motion.p>

        {/* Description */}
        <motion.p {...fadeUp(0.2)} className="text-sm md:text-base text-text-secondary/70 max-w-md leading-relaxed">
          {t('landing.heroDescription')}
        </motion.p>

        {/* CTA */}
        <motion.div {...fadeUp(0.3)} className="mt-2">
          <Link to="/onboarding">
            <Button size="xl" variant="primary">
              {t('landing.heroCta')}
            </Button>
          </Link>
        </motion.div>

        {/* Subtext */}
        <motion.p {...fadeUp(0.4)} className="text-xs text-text-secondary/50">
          {t('landing.heroSubtext')}
        </motion.p>
      </div>
    </section>
  );
}
