import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';

const features = [
  { emoji: '💬', nameKey: 'landing.featureTalkBoard', descKey: 'landing.featureTalkBoardDesc', bg: '#FF6B6B', light: '#FFF0F0' },
  { emoji: '🔊', nameKey: 'landing.featureSounds', descKey: 'landing.featureSoundsDesc', bg: '#74B9FF', light: '#F0F7FF' },
  { emoji: '🔤', nameKey: 'landing.featureWords', descKey: 'landing.featureWordsDesc', bg: '#FECA57', light: '#FFFBF0' },
  { emoji: '🧩', nameKey: 'landing.featurePuzzles', descKey: 'landing.featurePuzzlesDesc', bg: '#55E6C1', light: '#F0FFF9' },
];

export default function LandingFeatures() {
  const { t } = useTranslation();

  return (
    <section
      className="py-16 md:py-24 px-4"
      aria-labelledby="features-heading"
    >
      <div className="max-w-3xl mx-auto">
        <motion.h2
          id="features-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}
          className="text-2xl md:text-3xl font-display font-extrabold text-text-primary text-center mb-10"
        >
          {t('landing.featuresTitle')}
        </motion.h2>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.nameKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col items-center text-center gap-3 p-5 md:p-6 rounded-3xl"
              style={{ backgroundColor: f.light }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                style={{ backgroundColor: f.bg }}
              >
                <span className="drop-shadow-sm">{f.emoji}</span>
              </div>
              <h3 className="font-display font-bold text-sm md:text-base text-text-primary">{t(f.nameKey)}</h3>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">{t(f.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
