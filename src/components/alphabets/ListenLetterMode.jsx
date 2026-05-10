import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSpeech } from '../../hooks/useSpeech';
import { useTranslation } from '../../data/i18n';
import { useProfile } from '../../contexts/ProfileContext';
import { alphabetData } from '../../data/alphabets';
import db from '../../db';

const TOTAL_ROUNDS = 10;

function pickChoices(correctIdx, tier) {
  const count = tier === 1 ? 3 : 4;
  const choices = [alphabetData[correctIdx]];
  const used = new Set([correctIdx]);

  while (choices.length < count) {
    const rand = Math.floor(Math.random() * alphabetData.length);
    if (!used.has(rand)) {
      used.add(rand);
      choices.push(alphabetData[rand]);
    }
  }

  // Shuffle
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }

  return choices;
}

function generateRounds(tier) {
  const rounds = [];
  const used = new Set();
  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    let idx;
    do {
      idx = Math.floor(Math.random() * alphabetData.length);
    } while (used.has(idx) && used.size < alphabetData.length);
    used.add(idx);
    const choices = pickChoices(idx, tier);
    // Pre-determine mixed case display per choice (stable across renders)
    const mixedCaseMap = {};
    if (tier === 3) {
      choices.forEach((c) => {
        mixedCaseMap[c.letter] = Math.random() > 0.5;
      });
    }
    rounds.push({
      correct: alphabetData[idx],
      choices,
      showMixedCase: tier === 3,
      mixedCaseMap,
    });
  }
  return rounds;
}

export default function ListenLetterMode({ onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const { profile } = useProfile();
  const tier = profile?.tier || 1;

  const [rounds] = useState(() => generateRounds(tier));
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
      speak(t('alphabets.canYouFind', { letter: current.correct.letter }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx, isComplete]);

  const handleSelect = useCallback((choice) => {
    if (selected !== null) return;

    setSelected(choice.letter);

    if (choice.letter === current.correct.letter) {
      setIsCorrect(true);
      setCorrectCount((c) => c + 1);
      speak(`${choice.letter}. ${t(choice.i18nWord)}`);

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
      speak(t('alphabets.tryAgain'));

      setTimeout(() => {
        setSelected(null);
        setIsCorrect(null);
      }, 1200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, current, roundIdx]);

  // Award star and log on completion
  useEffect(() => {
    if (!isComplete) return;

    const elapsed = Math.round((Date.now() - startRef.current) / 1000);
    db.progress.add({
      module: 'alphabets',
      activityType: 'listen-letter',
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
            onClick={() => {
              setRoundIdx(0);
              setCorrectCount(0);
              setSelected(null);
              setIsCorrect(null);
              setIsComplete(false);
              startRef.current = Date.now();
            }}
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
      <p className="text-lg font-display font-extrabold text-white text-center">
        {t('alphabets.canYouFind', { letter: current.correct.letter })}
      </p>

      <div className={`grid gap-4 w-full max-w-sm ${current.choices.length <= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <AnimatePresence mode="popLayout">
          {current.choices.map((choice) => {
            const isThis = selected === choice.letter;
            const correct = choice.letter === current.correct.letter;
            let borderColor = 'border-border';
            if (isThis && isCorrect === true) borderColor = 'border-green-500';
            if (isThis && isCorrect === false) borderColor = 'border-red-500';

            const displayLetter = current.showMixedCase
              ? (current.mixedCaseMap[choice.letter] ? choice.lowercase : choice.letter)
              : choice.letter;

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
                className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-surface border-2 ${borderColor} cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] transition-colors ${
                  selected !== null && !isThis && isCorrect === false ? 'opacity-50' : ''
                }`}
              >
                <span className="text-5xl font-display font-extrabold text-white">
                  {displayLetter}
                </span>
                <span className="text-2xl">{choice.emoji}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
        {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === roundIdx ? 'bg-secondary scale-125' : i < roundIdx ? 'bg-secondary/40' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
