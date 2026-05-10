import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import PuzzleWrapper from './PuzzleWrapper';

const ALL_EMOJIS = ['🐶', '🐱', '🐻', '🦊', '🐸', '🐵', '🐰', '🐷', '🦁', '🐮', '🐔', '🐧'];
const TOTAL_ROUNDS = 5;

function pickThree() {
  const shuffled = [...ALL_EMOJIS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

export default function Peekaboo({ onComplete, onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const [phase, setPhase] = useState('show'); // show, curtain, guess
  const [items, setItems] = useState(() => pickThree());
  const [hiddenIndex, setHiddenIndex] = useState(0);
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [result, setResult] = useState(null); // 'correct' | 'wrong'
  const timerRef = useRef(null);

  const isComplete = round >= TOTAL_ROUNDS;

  useEffect(() => {
    if (phase === 'show') {
      speak('Look carefully!');
      timerRef.current = setTimeout(() => {
        const idx = Math.floor(Math.random() * 3);
        setHiddenIndex(idx);
        setPhase('curtain');
      }, 2500);
    }
    if (phase === 'curtain') {
      timerRef.current = setTimeout(() => {
        setPhase('guess');
      }, 1500);
    }
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleGuess = (emoji) => {
    if (emoji === items[hiddenIndex]) {
      setResult('correct');
      setCorrect((prev) => prev + 1);
      speak('You found it!');
    } else {
      setResult('wrong');
      speak('Try again next time!');
    }
    setTimeout(() => {
      setRound((prev) => prev + 1);
      setItems(pickThree());
      setPhase('show');
      setResult(null);
    }, 1500);
  };

  const handlePlayAgain = () => {
    setRound(0);
    setCorrect(0);
    setItems(pickThree());
    setPhase('show');
    setResult(null);
  };

  return (
    <PuzzleWrapper
      puzzleId="peekaboo"
      tier={1}
      isComplete={isComplete}
      roundsCorrect={correct}
      roundsTotal={TOTAL_ROUNDS}
      onPlayAgain={handlePlayAgain}
      onBack={onBack}
    >
      <div className="flex flex-col gap-6 items-center">
        <p className="text-sm font-display font-bold text-text-secondary">
          {t('puzzles.peekaboo')} — {round + 1}/{TOTAL_ROUNDS}
        </p>

        <div className="relative w-full max-w-xs">
          {/* Items display */}
          <div className="flex justify-center gap-4">
            {items.map((emoji, idx) => (
              <div
                key={idx}
                className="w-20 h-20 rounded-xl bg-surface border-2 border-border flex items-center justify-center text-4xl"
              >
                {phase === 'guess' && idx === hiddenIndex ? (
                  <span className="text-2xl text-text-secondary">?</span>
                ) : (
                  emoji
                )}
              </div>
            ))}
          </div>

          {/* Curtain overlay */}
          <AnimatePresence>
            {phase === 'curtain' && (
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-background/95 rounded-xl flex items-center justify-center origin-top"
              >
                <span className="text-4xl">🙈</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Guess buttons */}
        {phase === 'guess' && !result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3 items-center"
          >
            <p className="text-sm font-display font-bold text-white">Who is hiding?</p>
            <div className="flex gap-3">
              {items.map((emoji, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleGuess(emoji)}
                  className="w-16 h-16 rounded-xl bg-surface border-2 border-border flex items-center justify-center text-3xl cursor-pointer hover:bg-white/10 transition-all shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
                  whileTap={{ scale: 0.95 }}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Result feedback */}
        {result && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-4xl"
          >
            {result === 'correct' ? '✅' : '❌'}
          </motion.div>
        )}
      </div>
    </PuzzleWrapper>
  );
}
