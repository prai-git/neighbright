import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import Button from '../common/Button';

// Update this URL to point to your feedback form when available
const FEEDBACK_URL = 'https://github.com/prai-git/neighbright/issues';

export default function LandingFeedback() {
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="py-20 px-4 bg-primary/5"
      aria-labelledby="feedback-heading"
    >
      <div className="max-w-lg mx-auto text-center flex flex-col items-center gap-6">
        <h2
          id="feedback-heading"
          className="text-3xl md:text-4xl font-display font-extrabold text-text-primary"
        >
          {t('landing.feedbackTitle')}
        </h2>
        <p className="text-base md:text-lg text-text-secondary leading-relaxed">
          {t('landing.feedbackDesc')}
        </p>
        <a href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" size="lg">
            {t('landing.feedbackCta')}
          </Button>
        </a>
      </div>
    </motion.section>
  );
}
