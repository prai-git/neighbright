import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import EmojiCard from '../common/EmojiCard';
import { useSpeech } from '../../hooks/useSpeech';
import { useTranslation } from '../../data/i18n';
import { useProfile } from '../../contexts/ProfileContext';
import db from '../../db';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ListenPointMode({ words, onStarEarned }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const { profile } = useProfile();
  const tier = profile?.tier || 1;

  const choiceCount = tier === 1 ? 2 : tier === 2 ? 3 : 4;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(false);
  const startTime = useState(() => Date.now())[0];

  const currentWord = words[index % words.length];

  const choices = useMemo(() => {
    const others = words.filter((w) => w.id !== currentWord.id);
    const distractors = shuffle(others).slice(0, choiceCount - 1);
    return shuffle([currentWord, ...distractors]);
  }, [currentWord, words, choiceCount]);

  useEffect(() => {
    setSelected(null);
    setCorrect(false);
    const timer = setTimeout(() => {
      speak(t('words.canYouFind', { word: t(currentWord.i18nWord) }));
    }, 400);
    return () => clearTimeout(timer);
  }, [index, currentWord, speak, t]);

  const handleSelect = useCallback(
    (word) => {
      if (selected) return;
      setSelected(word.id);

      const isCorrect = word.id === currentWord.id;
      setCorrect(isCorrect);

      db.progress.add({
        module: 'words',
        activityType: 'listen-point',
        activityData: { wordId: currentWord.id, categoryId: '', mode: 'listen-point' },
        result: isCorrect ? 'correct' : 'incorrect',
        durationSecs: Math.round((Date.now() - startTime) / 1000),
        createdAt: new Date().toISOString(),
      });

      if (isCorrect) {
        speak(t('words.correct'));
        onStarEarned?.();
        setTimeout(() => setIndex((i) => i + 1), 1500);
      } else {
        speak(t('words.tryAgain'));
        setTimeout(() => {
          setSelected(null);
          setCorrect(false);
        }, 1200);
      }
    },
    [selected, currentWord, speak, t, onStarEarned, startTime]
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="text-center">
        <p className="text-lg font-display font-extrabold text-white mb-1">
          {t('words.canYouFind', { word: t(currentWord.i18nWord) })}
        </p>
        <button
          onClick={() => speak(t('words.canYouFind', { word: t(currentWord.i18nWord) }))}
          className="text-sm text-secondary font-display font-bold cursor-pointer hover:underline"
          aria-label="Replay prompt"
        >
          🔊 {t('sounds.tapToHear')}
        </button>
      </div>

      <div
        className={`grid gap-4 w-full max-w-md ${
          choiceCount <= 2 ? 'grid-cols-2' : choiceCount === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'
        }`}
      >
        {choices.map((word) => {
          const isThis = selected === word.id;
          const isCorrectChoice = word.id === currentWord.id;
          let extraClass = '';
          if (selected) {
            if (isThis && correct) extraClass = 'ring-4 ring-green-400';
            else if (isThis && !correct) extraClass = 'opacity-50';
          }

          return (
            <motion.div
              key={word.id}
              animate={
                isThis && correct
                  ? { scale: [1, 1.15, 1] }
                  : isThis && !correct
                  ? { x: [0, -8, 8, -4, 4, 0] }
                  : {}
              }
              transition={{ duration: 0.4 }}
              className={extraClass}
            >
              <EmojiCard
                emoji={word.emoji}
                label={t(word.i18nWord)}
                size="md"
                selected={isThis && correct}
                onClick={() => handleSelect(word)}
              />
            </motion.div>
          );
        })}
      </div>

      <p className="text-sm font-display font-bold text-text-secondary">
        {t('sounds.roundResult', { n: (index % words.length) + 1 }).replace('of 10', `of ${words.length}`)}
      </p>
    </div>
  );
}
