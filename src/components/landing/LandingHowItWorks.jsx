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
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="py-20 px-4 bg-background"
      aria-labelledby="how-heading"
    >
      <div className="max-w-4xl mx-auto">
        <h2
          id="how-heading"
          className="text-3xl md:text-4xl font-display font-extrabold text-text-primary text-center mb-16"
        >
          {t('landing.howTitle')}
        </h2>

        <div className="relative flex flex-col md:flex-row gap-8 md:gap-0">
          {/* Connecting dashed line — desktop only */}
          <div className="hidden md:block absolute top-6 left-[calc(1/6*100%)] right-[calc(1/6*100%)] border-t-2 border-dashed border-gray-200" aria-hidden="true" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: i * 0.15 }}
              className="flex-1 flex flex-col items-center text-center gap-4 relative z-10"
            >
              {/* Number circle */}
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold font-display shadow-md shadow-primary/30">
                {step.num}
              </div>
              {/* Emoji illustration */}
              <span className="text-4xl" role="img" aria-hidden="true">{step.emoji}</span>
              {/* Text */}
              <div>
                <h3 className="font-display font-bold text-lg text-text-primary mb-1">{t(step.titleKey)}</h3>
                <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">{t(step.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
