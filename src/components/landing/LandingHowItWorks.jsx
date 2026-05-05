import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';

const steps = [
  { num: 1, emoji: '📱', titleKey: 'landing.howStep1Title', descKey: 'landing.howStep1Desc' },
  { num: 2, emoji: '🎯', titleKey: 'landing.howStep2Title', descKey: 'landing.howStep2Desc' },
  { num: 3, emoji: '👨‍👩‍👧‍👦', titleKey: 'landing.howStep3Title', descKey: 'landing.howStep3Desc' },
];

export default function LandingHowItWorks() {
  const { t } = useTranslation();

  return (
    <section
      className="py-16 md:py-24 px-4 bg-white"
      aria-labelledby="how-heading"
    >
      <div className="max-w-3xl mx-auto">
        <motion.h2
          id="how-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}
          className="text-2xl md:text-3xl font-display font-extrabold text-text-primary text-center mb-12"
        >
          {t('landing.howTitle')}
        </motion.h2>

        <div className="flex flex-col md:flex-row gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex-1 flex flex-col items-center text-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-display font-extrabold shadow-sm">
                {step.num}
              </div>
              <span className="text-3xl">{step.emoji}</span>
              <h3 className="font-display font-bold text-base text-text-primary">{t(step.titleKey)}</h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xs">{t(step.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
