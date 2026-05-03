import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';

export default function StreakBadge({ streak = 0 }) {
  const { t } = useTranslation();
  const isHot = streak >= 7;

  return (
    <motion.span
      animate={isHot ? { boxShadow: ['0 0 0px #FECA57', '0 0 10px #FECA57', '0 0 0px #FECA57'] } : {}}
      transition={isHot ? { repeat: Infinity, duration: 2 } : {}}
      className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-sm font-display font-bold text-amber-700"
    >
      <span>🔥</span>
      <span>{streak}</span>
      <span>{t('days')}</span>
    </motion.span>
  );
}
