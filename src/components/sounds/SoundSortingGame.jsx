import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { allSounds } from '../../data/sounds';
import db from '../../db';

const ROUNDS = 10;

function buildRounds() {
  const pool = [];
  allSounds.forEach(sound => {
    (sound.examples?.initial ?? []).forEach(word => {
      if (word !== '—') pool.push({ word, sound });
    });
  });

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const rounds = [];

  for (const item of shuffled) {
    if (rounds.length >= ROUNDS) break;
    const distractors = allSounds.filter(s => s.id !== item.sound.id);
    const distractor = distractors[Math.floor(Math.random() * distractors.length)];
    if (!distractor) continue;
    const correctSide = Math.random() < 0.5 ? 'left' : 'right';
    rounds.push({
      word: item.word,
      correctSound: item.sound,
      distractorSound: distractor,
      leftSound: correctSide === 'left' ? item.sound : distractor,
      rightSound: correctSide === 'right' ? item.sound : distractor,
    });
  }
  return rounds;
}

export default function SoundSortingGame({ speak, onStarEarned }) {
  const { t } = useTranslation();
  const [rounds, setRounds] = useState(() => buildRounds());
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const startTimeRef = useRef(Date.now());

  const round = rounds[current];

  const handleAnswer = useCallback(async (chosenSound) => {
    if (feedback) return;
    const isCorrect = chosenSound.id === round.correctSound.id;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setScore(s => s + 1);

    setTimeout(async () => {
      setFeedback(null);
      if (current + 1 >= ROUNDS) {
        const newScore = isCorrect ? score + 1 : score;
        const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
        await db.progress.add({
          module: 'sounds',
          activityType: 'sound-sorting',
          activityData: {
            roundsCorrect: newScore,
            roundsTotal: ROUNDS,
            sounds: [...new Set(rounds.map(r => r.correctSound.id))],
          },
          result: 'completed',
          durationSecs: elapsed,
          createdAt: new Date().toISOString(),
        });
        onStarEarned?.();
        setGameOver(true);
      } else {
        setCurrent(c => c + 1);
      }
    }, 1200);
  }, [feedback, round, current, score, rounds, onStarEarned]);

  const restart = useCallback(() => {
    setRounds(buildRounds());
    setCurrent(0);
    setScore(0);
    setFeedback(null);
    setGameOver(false);
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!gameOver && round?.word) {
      const timer = setTimeout(() => speak(round.word, 0.8), 300);
      return () => clearTimeout(timer);
    }
  }, [current, gameOver, round?.word, speak]);

  if (gameOver) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-12"
      >
        <div className="text-7xl">🎉</div>
        <p className="text-2xl font-display font-extrabold text-white text-center">
          {t('sounds.gameComplete', { correct: score })}
        </p>
        <div className="flex gap-1.5">
          {Array.from({ length: ROUNDS }, (_, i) => (
            <span key={i} className={`text-xl ${i < score ? '' : 'opacity-20'}`}>⭐</span>
          ))}
        </div>
        <button
          onClick={restart}
          className="px-8 py-4 bg-primary text-white rounded-2xl font-display font-extrabold shadow-[0_4px_0_rgba(0,0,0,0.2)] hover:brightness-110 transition cursor-pointer uppercase tracking-wide active:translate-y-[2px] active:shadow-[0_1px_0_rgba(0,0,0,0.2)]"
        >
          {t('sounds.tryAgain')}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 bg-border rounded-full overflow-hidden">
          <div
            className="h-3 bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(current / ROUNDS) * 100}%` }}
          />
        </div>
        <span className="text-xs font-display font-extrabold text-text-secondary whitespace-nowrap">
          {current + 1}/{ROUNDS}
        </span>
      </div>

      {/* Word display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-xs text-text-secondary font-display font-bold">{t('sounds.sortDragPrompt')}</p>
          <button
            onClick={() => speak(round.word, 0.8)}
            className="text-3xl font-display font-extrabold text-white px-10 py-5 bg-surface rounded-2xl border-2 border-border shadow-[0_4px_0_rgba(0,0,0,0.2)] hover:border-secondary/50 transition cursor-pointer active:translate-y-[2px] active:shadow-[0_1px_0_rgba(0,0,0,0.2)]"
          >
            {round.word}
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`text-center text-base font-display font-extrabold py-3 rounded-2xl ${
              feedback === 'correct'
                ? 'text-primary bg-primary/15 border border-primary/30'
                : 'text-error bg-error/15 border border-error/30'
            }`}
          >
            {feedback === 'correct'
              ? t('sounds.correct')
              : t('sounds.incorrect', { answer: round.correctSound.symbol.replace(/\//g, '') })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sound buckets */}
      <div className="grid grid-cols-2 gap-4">
        {[round.leftSound, round.rightSound].map((bucketSound, idx) => (
          <motion.button
            key={`${current}-${idx}`}
            whileTap={{ scale: 0.95 }}
            animate={
              feedback
                ? bucketSound.id === round.correctSound.id
                  ? { scale: [1, 1.06, 1] }
                  : { x: [0, -6, 6, -6, 0] }
                : {}
            }
            onClick={() => handleAnswer(bucketSound)}
            className="bg-surface rounded-2xl border-2 border-border flex flex-col items-center gap-3 p-6 hover:border-primary/50 shadow-[0_4px_0_rgba(0,0,0,0.2)] transition cursor-pointer active:translate-y-[2px] active:shadow-[0_1px_0_rgba(0,0,0,0.2)]"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center border border-secondary/30">
              <span className="text-2xl font-display font-extrabold text-secondary">
                {bucketSound.symbol.replace(/\//g, '')}
              </span>
            </div>
            <span className="text-xs text-text-secondary font-display font-bold">tap if word starts here</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
