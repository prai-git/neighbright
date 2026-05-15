import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSpeech } from '../../hooks/useSpeech';
import { useTranslation } from '../../data/i18n';
import { alphabetData } from '../../data/alphabets';
import ASLSign from '../common/ASLSign';
import db from '../../db';

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
};

export default function LearnLettersMode({ onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const startTime = useState(() => Date.now())[0];

  const item = alphabetData[index];

  const goNext = useCallback(() => {
    if (index < alphabetData.length - 1) {
      setDirection(1);
      setIndex((i) => i + 1);
    }
  }, [index]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      setDirection(-1);
      setIndex((i) => i - 1);
    }
  }, [index]);

  const handleTap = useCallback(() => {
    speak(`${item.letter}. ${t(item.i18nWord)}`);
  }, [item, speak, t]);

  // Speak letter on card change
  useEffect(() => {
    const current = alphabetData[index];
    speak(`${current.letter}. ${t(current.i18nWord)}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Log progress
  useEffect(() => {
    db.progress.add({
      module: 'alphabets',
      activityType: 'learn-letter',
      activityData: { letter: alphabetData[index].letter },
      result: 'attempted',
      durationSecs: 0,
      createdAt: new Date().toISOString(),
    });
  }, [index]);

  // Award star on completion
  useEffect(() => {
    if (index === alphabetData.length - 1 && index > 0) {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      db.progress.add({
        module: 'alphabets',
        activityType: 'learn-letter',
        activityData: { completed: true },
        result: 'correct',
        durationSecs: elapsed,
        createdAt: new Date().toISOString(),
      });
      db.rewards.toCollection().first().then((r) => {
        if (r) {
          db.rewards.update(r.id, { totalStars: (r.totalStars || 0) + 1 });
        } else {
          db.rewards.add({ totalStars: 1, currentStreak: 0, longestStreak: 0, lastActive: new Date().toISOString() });
        }
      });
    }
  }, [index, startTime]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="relative w-full max-w-sm h-80 flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.button
            key={item.letter + index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={handleTap}
            className="absolute inset-0 bg-surface rounded-3xl border-2 border-border flex flex-col items-center justify-center gap-2 cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <span className="text-8xl font-display font-extrabold text-white leading-none">
                  {item.letter}
                </span>
                <span className="text-5xl font-display font-extrabold text-text-secondary leading-none">
                  {item.lowercase}
                </span>
              </div>
              <ASLSign value={item.letter} size="xl" />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-4xl">{item.emoji}</span>
              <span className="text-xl font-display font-extrabold text-white">
                {t(item.i18nWord)}
              </span>
            </div>
            <span className="text-xs font-display font-bold px-3 py-1 rounded-full bg-primary/20 text-primary mt-1">
              {item.phonetic} {item.soundHint}
            </span>
          </motion.button>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 text-white font-extrabold text-xl flex items-center justify-center disabled:opacity-30 cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          aria-label="Previous letter"
        >
          &larr;
        </button>
        <span className="text-sm font-display font-bold text-text-secondary">
          {index + 1} / {alphabetData.length}
        </span>
        <button
          onClick={goNext}
          disabled={index === alphabetData.length - 1}
          className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 text-white font-extrabold text-xl flex items-center justify-center disabled:opacity-30 cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          aria-label="Next letter"
        >
          &rarr;
        </button>
      </div>

      <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
        {alphabetData.map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === index ? 'bg-primary scale-125' : i < index ? 'bg-primary/40' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
