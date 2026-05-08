import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSpeech } from '../../hooks/useSpeech';
import { useTranslation } from '../../data/i18n';
import db from '../../db';

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
};

export default function LearnMode({ words, categoryColor, onStarEarned }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const startTime = useState(() => Date.now())[0];

  const word = words[index];

  const goNext = useCallback(() => {
    if (index < words.length - 1) {
      setDirection(1);
      setIndex((i) => i + 1);
    }
  }, [index, words.length]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      setDirection(-1);
      setIndex((i) => i - 1);
    }
  }, [index]);

  const handleTap = useCallback(() => {
    speak(t(word.i18nWord));
  }, [speak, t, word]);

  useEffect(() => {
    db.progress.add({
      module: 'words',
      activityType: 'learn-view',
      activityData: { wordId: word.id, mode: 'learn' },
      result: 'attempted',
      durationSecs: 0,
      createdAt: new Date().toISOString(),
    });
  }, [word.id]);

  useEffect(() => {
    if (index === words.length - 1 && index > 0) {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      onStarEarned?.();
      db.progress.add({
        module: 'words',
        activityType: 'learn-view',
        activityData: { mode: 'learn', completed: true },
        result: 'correct',
        durationSecs: elapsed,
        createdAt: new Date().toISOString(),
      });
    }
  }, [index, words.length, startTime, onStarEarned]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="relative w-full max-w-sm h-72 flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.button
            key={word.id + index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={handleTap}
            className="absolute inset-0 bg-surface rounded-3xl border-2 border-border flex flex-col items-center justify-center gap-4 cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            <span className="text-7xl">{word.emoji}</span>
            <span className="text-2xl font-display font-extrabold text-white">
              {t(word.i18nWord)}
            </span>
            <span
              className="text-xs font-display font-bold px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: categoryColor }}
            >
              {t(word.i18nPhrase)}
            </span>
          </motion.button>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 text-white font-extrabold text-xl flex items-center justify-center disabled:opacity-30 cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          aria-label="Previous word"
        >
          ←
        </button>
        <span className="text-sm font-display font-bold text-text-secondary">
          {index + 1} / {words.length}
        </span>
        <button
          onClick={goNext}
          disabled={index === words.length - 1}
          className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 text-white font-extrabold text-xl flex items-center justify-center disabled:opacity-30 cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          aria-label="Next word"
        >
          →
        </button>
      </div>

      <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
        {words.map((_, i) => (
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
