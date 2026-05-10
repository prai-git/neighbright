import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSpeech } from '../../hooks/useSpeech';
import { useTranslation } from '../../data/i18n';
import { alphabetData } from '../../data/alphabets';
import db from '../../db';

const TOTAL_ROUNDS = 10;

function generateRounds() {
  const rounds = [];
  const used = new Set();

  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    let idx;
    do {
      idx = Math.floor(Math.random() * alphabetData.length);
    } while (used.has(idx) && used.size < alphabetData.length);
    used.add(idx);

    const correct = alphabetData[idx];
    const distractors = [];
    const usedLetters = new Set([correct.letter]);

    while (distractors.length < 3) {
      const rand = Math.floor(Math.random() * alphabetData.length);
      if (!usedLetters.has(alphabetData[rand].letter)) {
        usedLetters.add(alphabetData[rand].letter);
        distractors.push(alphabetData[rand]);
      }
    }

    const choices = [correct, ...distractors];
    // Shuffle
    for (let j = choices.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [choices[j], choices[k]] = [choices[k], choices[j]];
    }

    rounds.push({ correct, choices });
  }

  return rounds;
}

export default function LetterQuizMode({ onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();

  const [rounds, setRounds] = useState(() => generateRounds());
  const [roundIdx, setRoundIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const startRef = useRef(Date.now());

  const current = rounds[roundIdx];

  // Speak prompt on new round
  useEffect(() => {
    if (!isComplete && current) {
      speak(t('alphabets.whatLetterStartsWith', { word: t(current.correct.i18nWord) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx, isComplete]);

  const handleSelect = useCallback((choice) => {
    if (selected !== null) return;

    setSelected(choice.letter);

    if (choice.letter === current.correct.letter) {
      setIsCorrect(true);
      setCorrectCount((c) => c + 1);
      speak(`${choice.letter}! ${t(current.correct.i18nWord)}`);

      setTimeout(() => {
        if (roundIdx < TOTAL_ROUNDS - 1) {
          setRoundIdx((r) => r + 1);
          setSelected(null);
          setIsCorrect(null);
        } else {
          setIsComplete(true);
        }
      }, 1500);
    } else {
      setIsCorrect(false);
      speak(t('alphabets.startsWithLetter', { word: t(current.correct.i18nWord), letter: current.correct.letter }));

      setTimeout(() => {
        setSelected(null);
        setIsCorrect(null);
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, current, roundIdx]);

  // Log and award on completion
  useEffect(() => {
    if (!isComplete) return;

    const elapsed = Math.round((Date.now() - startRef.current) / 1000);
    db.progress.add({
      module: 'alphabets',
      activityType: 'letter-quiz',
      activityData: { roundsCorrect: correctCount, roundsTotal: TOTAL_ROUNDS },
      result: 'completed',
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
  }, [isComplete, correctCount]);

  const handlePlayAgain = () => {
    setRounds(generateRounds());
    setRoundIdx(0);
    setCorrectCount(0);
    setSelected(null);
    setIsCorrect(null);
    setIsComplete(false);
    startRef.current = Date.now();
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-10"
      >
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-7xl"
        >
          ⭐
        </motion.span>
        <p className="text-2xl font-display font-extrabold text-white">
          {t('rewards.greatJob')}
        </p>
        <p className="text-lg font-display font-bold text-text-secondary">
          {correctCount} / {TOTAL_ROUNDS}
        </p>
        <div className="flex gap-3">
          <button
            onClick={handlePlayAgain}
            className="px-6 py-3 rounded-xl bg-primary text-white font-display font-extrabold text-sm cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            {t('common.reset')}
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white font-display font-extrabold text-sm cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            {t('common.back')}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm font-display font-bold text-text-secondary">
        {roundIdx + 1} / {TOTAL_ROUNDS}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={roundIdx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col items-center gap-4"
        >
          <span className="text-7xl">{current.correct.emoji}</span>
          <p className="text-2xl font-display font-extrabold text-white">
            {t(current.correct.i18nWord)}
          </p>
          <p className="text-sm font-display font-bold text-text-secondary">
            {t('alphabets.whatLetterStartsWith', { word: t(current.correct.i18nWord) })}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {current.choices.map((choice) => {
          const isThis = selected === choice.letter;
          const correct = choice.letter === current.correct.letter;
          let borderColor = 'border-border';
          if (isThis && isCorrect === true) borderColor = 'border-green-500';
          if (isThis && isCorrect === false) borderColor = 'border-red-500';
          if (selected !== null && correct && isCorrect === false) borderColor = 'border-green-500/50';

          return (
            <motion.button
              key={choice.letter}
              onClick={() => handleSelect(choice)}
              animate={
                isThis && isCorrect === true
                  ? { scale: [1, 1.2, 1] }
                  : isThis && isCorrect === false
                  ? { x: [0, -8, 8, -8, 0] }
                  : {}
              }
              transition={{ duration: 0.4 }}
              className={`flex items-center justify-center p-5 rounded-2xl bg-surface border-2 ${borderColor} cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] transition-colors`}
            >
              <span className="text-4xl font-display font-extrabold text-white">
                {choice.letter}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
        {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === roundIdx ? 'bg-purple-400 scale-125' : i < roundIdx ? 'bg-purple-400/40' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
