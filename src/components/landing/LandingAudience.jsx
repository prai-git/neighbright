import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import Card from '../common/Card';

const audiences = [
  { emoji: '👨‍👩‍👧', titleKey: 'landing.whoParentsTitle', descKey: 'landing.whoParentsDesc' },
  { emoji: '🩺', titleKey: 'landing.whoTherapistsTitle', descKey: 'landing.whoTherapistsDesc' },
  { emoji: '🏫', titleKey: 'landing.whoTeachersTitle', descKey: 'landing.whoTeachersDesc' },
];

export default function LandingAudience() {
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="py-20 px-4 bg-surface"
      aria-labelledby="audience-heading"
    >
      <div className="max-w-5xl mx-auto">
        <h2
          id="audience-heading"
          className="text-3xl md:text-4xl font-display font-extrabold text-text-primary text-center mb-12"
        >
          {t('landing.whoTitle')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {audiences.map((a, i) => (
            <motion.div
              key={a.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <Card variant="outlined" padding="none" className="h-full flex flex-col items-center text-center gap-4 p-6">
                <span className="text-5xl" role="img" aria-hidden="true">{a.emoji}</span>
                <h3 className="font-display font-bold text-lg text-text-primary">{t(a.titleKey)}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{t(a.descKey)}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
