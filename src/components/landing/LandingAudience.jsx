import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';

const audiences = [
  { emoji: '👨‍👩‍👧', titleKey: 'landing.whoParentsTitle', descKey: 'landing.whoParentsDesc' },
  { emoji: '🩺', titleKey: 'landing.whoTherapistsTitle', descKey: 'landing.whoTherapistsDesc' },
  { emoji: '🏫', titleKey: 'landing.whoTeachersTitle', descKey: 'landing.whoTeachersDesc' },
];

export default function LandingAudience() {
  const { t } = useTranslation();

  return (
    <section
      className="py-16 md:py-24 px-4"
      aria-labelledby="audience-heading"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          id="audience-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}
          className="text-2xl md:text-3xl font-display font-extrabold text-white text-center mb-10"
        >
          {t('landing.whoTitle')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {audiences.map((a, i) => (
            <motion.div
              key={a.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-surface border-2 border-border shadow-[0_4px_0_rgba(0,0,0,0.2)]"
            >
              <span className="text-4xl">{a.emoji}</span>
              <h3 className="font-display font-extrabold text-base text-white">{t(a.titleKey)}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{t(a.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
