import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import db from '../../db';

export default function GameWrapper({
  activityType,
  difficulty,
  children,
  isComplete,
  roundsCorrect,
  roundsTotal,
  onPlayAgain,
  onBack,
}) {
  const { t } = useTranslation();
  const startRef = useRef(Date.now());
  const [starAwarded, setStarAwarded] = useState(false);

  useEffect(() => {
    if (!isComplete) return;

    const elapsed = Math.round((Date.now() - startRef.current) / 1000);

    db.progress.add({
      module: 'games',
      activityType,
      activityData: { difficulty, roundsCorrect, roundsTotal },
      result: 'completed',
      durationSecs: elapsed,
      createdAt: new Date().toISOString(),
    });

    db.rewards.toCollection().first().then((reward) => {
      if (reward) {
        db.rewards.update(reward.id, { totalStars: (reward.totalStars || 0) + 1 });
      } else {
        db.rewards.add({ totalStars: 1, currentStreak: 0, longestStreak: 0, lastActive: new Date().toISOString() });
      }
      setStarAwarded(true);
    });
  }, [isComplete, activityType, difficulty, roundsCorrect, roundsTotal]);

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-10"
      >
        {starAwarded && (
          <motion.span
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-7xl"
          >
            ⭐
          </motion.span>
        )}
        <p className="text-2xl font-display font-extrabold text-white">
          {t('rewards.greatJob')}
        </p>
        {roundsTotal > 0 && (
          <p className="text-lg font-display font-bold text-text-secondary">
            {roundsCorrect} / {roundsTotal}
          </p>
        )}
        <div className="flex gap-3">
          <button
            onClick={onPlayAgain}
            className="px-6 py-3 rounded-xl bg-primary text-white font-display font-extrabold text-sm cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            🔄 {t('common.reset')}
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white font-display font-extrabold text-sm cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            ← {t('common.back')}
          </button>
        </div>
      </motion.div>
    );
  }

  return <div className="max-w-2xl mx-auto w-full">{children}</div>;
}
