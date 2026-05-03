import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import Card from '../common/Card';

const features = [
  { emoji: '💬', nameKey: 'landing.featureTalkBoard', descKey: 'landing.featureTalkBoardDesc', color: 'var(--color-primary)' },
  { emoji: '🔊', nameKey: 'landing.featureSounds', descKey: 'landing.featureSoundsDesc', color: 'var(--color-secondary)' },
  { emoji: '🔤', nameKey: 'landing.featureWords', descKey: 'landing.featureWordsDesc', color: 'var(--color-accent)' },
  { emoji: '🧩', nameKey: 'landing.featurePuzzles', descKey: 'landing.featurePuzzlesDesc', color: 'var(--color-primary)' },
];

export default function LandingFeatures() {
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="py-20 px-4 bg-surface"
      aria-labelledby="features-heading"
    >
      <div className="max-w-6xl mx-auto">
        <h2
          id="features-heading"
          className="text-3xl md:text-4xl font-display font-extrabold text-text-primary text-center mb-12"
        >
          {t('landing.featuresTitle')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.nameKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <Card color={f.color} padding="none" className="h-full flex flex-col items-start gap-3 p-6">
                <span className="text-4xl" role="img" aria-hidden="true">{f.emoji}</span>
                <h3 className="font-display font-bold text-lg text-text-primary">{t(f.nameKey)}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{t(f.descKey)}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
