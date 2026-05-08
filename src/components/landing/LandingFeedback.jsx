import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import Button from '../common/Button';

const FEEDBACK_URL = 'https://github.com/prai-git/neighbright/issues';

export default function LandingFeedback() {
  const { t } = useTranslation();

  return (
    <section
      className="py-16 md:py-24 px-4"
      aria-labelledby="feedback-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4 }}
        className="max-w-md mx-auto text-center flex flex-col items-center gap-4"
      >
        <h2
          id="feedback-heading"
          className="text-2xl md:text-3xl font-display font-extrabold text-white"
        >
          {t('landing.feedbackTitle')}
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          {t('landing.feedbackDesc')}
        </p>
        <a href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="lg">
            {t('landing.feedbackCta')}
          </Button>
        </a>
      </motion.div>
    </section>
  );
}
