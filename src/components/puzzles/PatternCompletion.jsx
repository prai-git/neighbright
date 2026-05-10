import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import PuzzleWrapper from './PuzzleWrapper';

const SYMBOLS = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'];
const TOTAL_ROUNDS = 8;

function generatePattern(round) {
  const complexity = Math.min(Math.floor(round / 3) + 2, 4); // 2, 2, 2, 3, 3, 3, 4, 4
  const picked = [...SYMBOLS].sort(() => Math.random() - 0.5).slice(0, complexity);

  let pattern = [];
  if (complexity === 2) {
    // ABAB
    for (let i = 0; i < 5; i++) pattern.push(picked[i % 2]);
  } else if (complexity === 3) {
    // ABCABC
    for (let i = 0; i < 7; i++) pattern.push(picked[i % 3]);
  } else {
    // AABB
    for (let i = 0; i < 9; i++) pattern.push(picked[Math.floor(i / 2) % complexity]);
  }

  const answer = pattern[pattern.length - 1];
  const display = pattern.slice(0, -1);

  // Generate choices
  const choices = [answer];
  while (choices.length < 3) {
    const c = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    if (!choices.includes(c)) choices.push(c);
  }
  choices.sort(() => Math.random() - 0.5);

  return { display, answer, choices };
}

export default function PatternCompletion({ onComplete, onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [pattern, setPattern] = useState(() => generatePattern(0));
  const [result, setResult] = useState(null);

  const isComplete = round >= TOTAL_ROUNDS;

  useEffect(() => {
    speak(t('puzzles.whatComesNext'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const handleChoice = (choice) => {
    if (result) return;
    const isCorrect = choice === pattern.answer;
    setResult(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setCorrect((prev) => prev + 1);

    setTimeout(() => {
      const nextRound = round + 1;
      setRound(nextRound);
      setPattern(generatePattern(nextRound));
      setResult(null);
    }, 1000);
  };

  return (
    <PuzzleWrapper
      puzzleId="pattern"
      tier={2}
      isComplete={isComplete}
      roundsCorrect={correct}
      roundsTotal={TOTAL_ROUNDS}
      onPlayAgain={() => {
        setRound(0);
        setCorrect(0);
        setPattern(generatePattern(0));
        setResult(null);
      }}
      onBack={onBack}
    >
      <div className="flex flex-col gap-6 items-center">
        <p className="text-sm font-display font-bold text-text-secondary">
          {t('puzzles.pattern')} — {round + 1}/{TOTAL_ROUNDS}
        </p>

        {/* Pattern display */}
        <div className="flex flex-wrap justify-center gap-2 items-center">
          {pattern.display.map((symbol, idx) => (
            <motion.span
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="text-3xl md:text-4xl"
            >
              {symbol}
            </motion.span>
          ))}
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            className="text-3xl md:text-4xl bg-surface border-2 border-dashed border-border rounded-lg w-12 h-12 flex items-center justify-center"
          >
            {result === 'correct' ? pattern.answer : '❓'}
          </motion.span>
        </div>

        {/* Choices */}
        <div className="flex gap-3">
          {pattern.choices.map((choice, idx) => (
            <motion.button
              key={idx}
              onClick={() => handleChoice(choice)}
              className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl cursor-pointer border-2 transition-all shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] ${
                result && choice === pattern.answer
                  ? 'border-primary bg-primary/20'
                  : result === 'wrong' && choice !== pattern.answer
                  ? 'border-border bg-surface opacity-50'
                  : 'border-border bg-surface hover:bg-white/10'
              }`}
              whileTap={{ scale: 0.95 }}
              disabled={!!result}
            >
              {choice}
            </motion.button>
          ))}
        </div>

        {result && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-3xl"
          >
            {result === 'correct' ? '✅' : '❌'}
          </motion.span>
        )}
      </div>
    </PuzzleWrapper>
  );
}
