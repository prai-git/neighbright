import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';

export default function StreakBadge({ streak = 0 }) {
  const { t } = useTranslation();
  const isHot = streak >= 7;

  return (
    <motion.span
      animate={isHot ? { boxShadow: ['0 0 0px #FECA57', '0 0 8px #FECA57', '0 0 0px #FECA57'] } : {}}
      transition={isHot ? { repeat: Infinity, duration: 2 } : {}}
      className="inline-flex items-center gap-1 rounded-full bg-accent/15 border border-accent/30 px-3 py-1 text-sm font-display font-extrabold text-accent"
    >
      <span>🔥</span>
      <span>{streak}</span>
      <span>{t('common.days')}</span>
    </motion.span>
  );
}
