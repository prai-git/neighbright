import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { allSounds } from '../../data/sounds';
import db from '../../db';

const ROUNDS = 10;

// Build a pool of (word, correctSound, distractorSound) tuples
function buildRounds() {
  // Gather all words with known initial position
  const pool = [];
  allSounds.forEach(sound => {
    (sound.examples?.initial ?? []).forEach(word => {
      if (word !== '—') pool.push({ word, sound });
    });
  });

  // Shuffle
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const rounds = [];

  for (const item of shuffled) {
    if (rounds.length >= ROUNDS) break;
    // Pick a distractor sound (different group preferred)
    const distractors = allSounds.filter(s => s.id !== item.sound.id);
    const distractor = distractors[Math.floor(Math.random() * distractors.length)];
    if (!distractor) continue;
    // Randomly place correct sound in left or right bucket
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
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect'
  const [gameOver, setGameOver] = useState(false);
  const startTimeRef = useRef(Date.now());

  const round = rounds[current];

  const handleAnswer = useCallback(async (chosenSound) => {
    if (feedback) return; // prevent double-tap
    const isCorrect = chosenSound.id === round.correctSound.id;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setScore(s => s + 1);

    setTimeout(async () => {
      setFeedback(null);
      if (current + 1 >= ROUNDS) {
        // Game over — log and show result
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

  // Auto-speak word on each new round
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
        className="flex flex-col items-center gap-6 py-10 px-4"
      >
        <div className="text-6xl">🎉</div>
        <p className="text-2xl font-display font-bold text-text-primary text-center">
          {t('sounds.gameComplete', { correct: score })}
        </p>
        <div className="flex gap-1">
          {Array.from({ length: ROUNDS }, (_, i) => (
            <span key={i} className={`text-2xl ${i < score ? '' : 'opacity-30'}`}>⭐</span>
          ))}
        </div>
        <button
          onClick={restart}
          className="px-6 py-3 bg-primary text-white rounded-2xl font-semibold shadow hover:opacity-90 transition"
        >
          {t('sounds.tryAgain')}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-6">
      {/* Progress bar */}
      <div className="flex items-center gap-2 pt-2">
        <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-2 bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(current / ROUNDS) * 100}%` }}
          />
        </div>
        <span className="text-sm text-text-secondary whitespace-nowrap">
          {t('sounds.roundResult', { n: current + 1 })}
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
          <p className="text-sm text-text-secondary">{t('sounds.sortDragPrompt')}</p>
          <button
            onClick={() => speak(round.word, 0.8)}
            className="text-4xl font-display font-bold text-text-primary px-6 py-3 bg-surface rounded-2xl border border-border shadow hover:border-primary transition"
          >
            {round.word}
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Feedback overlay */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`text-center text-lg font-bold py-2 rounded-xl ${
              feedback === 'correct'
                ? 'text-success bg-success/10'
                : 'text-error bg-error/10'
            }`}
          >
            {feedback === 'correct'
              ? t('sounds.correct')
              : t('sounds.incorrect', { answer: round.correctSound.symbol })}
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
                  ? { scale: [1, 1.08, 1], backgroundColor: ['#ffffff', '#bbf7d0', '#ffffff'] }
                  : { x: [0, -6, 6, -6, 0] }
                : {}
            }
            onClick={() => handleAnswer(bucketSound)}
            className="bg-surface rounded-2xl border-2 border-border flex flex-col items-center gap-2 p-5 shadow hover:border-primary transition focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span className="text-4xl font-mono font-bold text-primary">{bucketSound.symbol}</span>
            <span className="text-xs text-text-secondary">tap if word starts here</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
