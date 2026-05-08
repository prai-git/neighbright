import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';

const features = [
  { emoji: '💬', nameKey: 'landing.featureTalkBoard', descKey: 'landing.featureTalkBoardDesc', bg: '#58CC02', dark: '#46A302' },
  { emoji: '🔊', nameKey: 'landing.featureSounds', descKey: 'landing.featureSoundsDesc', bg: '#1CB0F6', dark: '#1899D6' },
  { emoji: '🔤', nameKey: 'landing.featureWords', descKey: 'landing.featureWordsDesc', bg: '#FF9600', dark: '#E08600' },
  { emoji: '🧩', nameKey: 'landing.featurePuzzles', descKey: 'landing.featurePuzzlesDesc', bg: '#FF4B4B', dark: '#E04343' },
];

export default function LandingFeatures() {
  const { t } = useTranslation();

  return (
    <section
      className="py-16 md:py-24 px-4"
      aria-labelledby="features-heading"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          id="features-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}
          className="text-2xl md:text-3xl font-display font-extrabold text-white text-center mb-10"
        >
          {t('landing.featuresTitle')}
        </motion.h2>

        <div className="grid grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.nameKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="module-card flex flex-col items-center text-center gap-3 p-5 md:p-6"
              style={{ backgroundColor: f.bg }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: f.dark }}
              >
                <span className="drop-shadow-md">{f.emoji}</span>
              </div>
              <h3 className="font-display font-extrabold text-sm md:text-base text-white drop-shadow-sm">{t(f.nameKey)}</h3>
              <p className="text-xs md:text-sm text-white/70 leading-relaxed">{t(f.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
