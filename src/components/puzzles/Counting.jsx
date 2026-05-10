import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import PuzzleWrapper from './PuzzleWrapper';

const EMOJIS = ['🍎', '🌟', '🐟', '🦋', '🎈', '🌻', '🐶', '🍪', '🐸', '🍕'];
const TOTAL_ROUNDS = 8;

function generateRound() {
  const count = Math.floor(Math.random() * 10) + 1;
  const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  return { count, emoji };
}

export default function Counting({ onComplete, onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [roundData, setRoundData] = useState(() => generateRound());
  const [result, setResult] = useState(null);

  const isComplete = round >= TOTAL_ROUNDS;

  useEffect(() => {
    speak('How many do you see?');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const handleAnswer = (num) => {
    if (result) return;
    const isCorrect = num === roundData.count;
    setResult(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setCorrect((prev) => prev + 1);
    speak(isCorrect ? 'Correct!' : `It was ${roundData.count}`);

    setTimeout(() => {
      setRound((prev) => prev + 1);
      setRoundData(generateRound());
      setResult(null);
    }, 1200);
  };

  return (
    <PuzzleWrapper
      puzzleId="counting"
      tier={2}
      isComplete={isComplete}
      roundsCorrect={correct}
      roundsTotal={TOTAL_ROUNDS}
      onPlayAgain={() => {
        setRound(0);
        setCorrect(0);
        setRoundData(generateRound());
        setResult(null);
      }}
      onBack={onBack}
    >
      <div className="flex flex-col gap-5 items-center">
        <p className="text-sm font-display font-bold text-text-secondary">
          {t('puzzles.counting')} — {round + 1}/{TOTAL_ROUNDS}
        </p>

        {/* Items display */}
        <div className="flex flex-wrap justify-center gap-2 max-w-xs">
          {Array.from({ length: roundData.count }).map((_, idx) => (
            <motion.span
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="text-4xl"
            >
              {roundData.emoji}
            </motion.span>
          ))}
        </div>

        <p className="text-sm font-display font-bold text-white">
          {t('puzzles.tapToCount')}
        </p>

        {/* Number buttons */}
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
            <motion.button
              key={num}
              onClick={() => handleAnswer(num)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-display font-extrabold cursor-pointer border-2 transition-all shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] ${
                result && num === roundData.count
                  ? 'border-primary bg-primary/30 text-white'
                  : 'border-border bg-surface text-white hover:bg-white/10'
              }`}
              animate={
                result === 'correct' && num === roundData.count
                  ? { scale: [1, 1.3, 1] }
                  : {}
              }
              whileTap={{ scale: 0.95 }}
              disabled={!!result}
            >
              {num}
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
