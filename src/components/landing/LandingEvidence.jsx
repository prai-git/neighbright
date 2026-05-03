import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';

export default function LandingEvidence() {
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="py-20 px-4 bg-background"
      aria-labelledby="evidence-heading"
    >
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <div className="text-center">
          <h2
            id="evidence-heading"
            className="text-3xl md:text-4xl font-display font-extrabold text-text-primary mb-4"
          >
            {t('landing.evidenceTitle')}
          </h2>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed">
            {t('landing.evidenceDesc')}
          </p>
        </div>

        {/* Disclaimer box */}
        <div className="flex items-start gap-3 bg-secondary/10 rounded-xl p-4">
          <span className="text-2xl shrink-0" role="img" aria-label="Medical symbol">⚕️</span>
          <p className="text-sm text-text-secondary leading-relaxed">{t('landing.evidenceDisclaimer')}</p>
        </div>

        {/* Multilingual note */}
        <div className="text-center">
          <p className="font-display font-bold text-lg text-text-primary mb-1">
            {t('landing.multilingualTitle')}
          </p>
          <p className="text-base text-text-secondary mb-3">{t('landing.multilingualDesc')}</p>
          <div className="flex items-center justify-center gap-4 text-3xl" aria-label="Languages: English, Hindi, French">
            <span>🇺🇸</span>
            <span>🇮🇳</span>
            <span>🇫🇷</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
