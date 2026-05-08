import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeech } from '../../hooks/useSpeech';
import { useTranslation } from '../../data/i18n';
import db from '../../db';

export default function SayItMode({ words, onStarEarned }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const [index, setIndex] = useState(0);
  const [showStar, setShowStar] = useState(false);
  const startTime = useState(() => Date.now())[0];

  const word = words[index % words.length];

  useEffect(() => {
    const timer = setTimeout(() => {
      speak(t('words.sayTheWord', { word: t(word.i18nWord) }));
    }, 400);
    return () => clearTimeout(timer);
  }, [index, word, speak, t]);

  const handleRate = useCallback(
    (isCorrect) => {
      db.progress.add({
        module: 'words',
        activityType: 'say-it',
        activityData: { wordId: word.id, mode: 'say-it' },
        result: isCorrect ? 'correct' : 'incorrect',
        durationSecs: Math.round((Date.now() - startTime) / 1000),
        createdAt: new Date().toISOString(),
      });

      if (isCorrect) {
        onStarEarned?.();
        setShowStar(true);
        setTimeout(() => setShowStar(false), 1200);
      }

      setTimeout(() => setIndex((i) => i + 1), 1000);
    },
    [word, startTime, onStarEarned]
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={word.id + index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-surface rounded-3xl border-2 border-border p-8 flex flex-col items-center gap-4 w-full max-w-sm shadow-[0_4px_0_rgba(0,0,0,0.2)]"
        >
          <span className="text-7xl">{word.emoji}</span>
          <span className="text-2xl font-display font-extrabold text-white">
            {t(word.i18nWord)}
          </span>
          <button
            onClick={() => speak(t('words.sayTheWord', { word: t(word.i18nWord) }))}
            className="text-sm text-secondary font-display font-bold cursor-pointer hover:underline"
            aria-label="Hear the word"
          >
            🔊 {t('sounds.tapToHear')}
          </button>
        </motion.div>
      </AnimatePresence>

      <p className="text-base font-display font-bold text-text-secondary text-center">
        {t('words.sayTheWord', { word: t(word.i18nWord) })}
      </p>

      <div className="flex gap-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleRate(true)}
          className="w-20 h-20 rounded-2xl bg-green-500/20 border-2 border-green-500 flex items-center justify-center text-4xl cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          aria-label="Child said it correctly"
        >
          👍
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleRate(false)}
          className="w-20 h-20 rounded-2xl bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-4xl cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          aria-label="Child needs more practice"
        >
          👎
        </motion.button>
      </div>

      {showStar && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0 }}
          className="text-5xl"
        >
          ⭐
        </motion.div>
      )}

      <p className="text-sm font-display font-bold text-text-secondary">
        {(index % words.length) + 1} / {words.length}
      </p>
    </div>
  );
}
