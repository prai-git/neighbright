import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';

export default function StreakBadge({ streak = 0 }) {
  const { t } = useTranslation();
  const isHot = streak >= 7;

  return (
    <motion.span
      animate={isHot ? { boxShadow: ['0 0 0px #FECA57', '0 0 8px #FECA57', '0 0 0px #FECA57'] } : {}}
      transition={isHot ? { repeat: Infinity, duration: 2 } : {}}
      className="inline-flex items-center gap-1 rounded-full bg-accent/10 border border-accent/20 px-3 py-1 text-sm font-display font-bold text-text-primary"
    >
      <span>🔥</span>
      <span>{streak}</span>
      <span>{t('common.days')}</span>
    </motion.span>
  );
}
