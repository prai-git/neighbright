import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';

export default function LandingEvidence() {
  const { t } = useTranslation();

  return (
    <section
      className="py-16 md:py-24 px-4 bg-surface"
      aria-labelledby="evidence-heading"
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <h2
            id="evidence-heading"
            className="text-2xl md:text-3xl font-display font-extrabold text-white mb-3"
          >
            {t('landing.evidenceTitle')}
          </h2>
          <p className="text-sm md:text-base text-text-secondary leading-relaxed">
            {t('landing.evidenceDesc')}
          </p>
        </motion.div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 bg-secondary/10 rounded-2xl p-5 border border-secondary/20">
          <span className="text-xl shrink-0">⚕️</span>
          <p className="text-sm text-text-secondary leading-relaxed">{t('landing.evidenceDisclaimer')}</p>
        </div>

        {/* Multilingual */}
        <div className="text-center">
          <p className="font-display font-extrabold text-base text-white mb-2">
            {t('landing.multilingualTitle')}
          </p>
          <p className="text-sm text-text-secondary mb-3">{t('landing.multilingualDesc')}</p>
          <div className="flex items-center justify-center gap-5 text-3xl">
            <span>🇺🇸</span>
            <span>🇫🇷</span>
          </div>
        </div>
      </div>
    </section>
  );
}
