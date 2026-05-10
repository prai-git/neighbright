import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import PuzzleWrapper from './PuzzleWrapper';

const EMOJI_SETS = [
  ['🐶', '🐱', '🐸', '🦋'],
  ['🍎', '🌻', '🐟', '⭐'],
  ['🚗', '🏠', '🌳', '🐦'],
  ['🎈', '🍪', '🐻', '🌙'],
];

function generateRound() {
  const set = EMOJI_SETS[Math.floor(Math.random() * EMOJI_SETS.length)];
  const left = [...set].sort(() => Math.random() - 0.5);
  const right = [...set].sort(() => Math.random() - 0.5);
  return { left, right, original: set };
}

export default function ShadowMatch({ onComplete, onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const [roundData, setRoundData] = useState(() => generateRound());
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrong, setWrong] = useState(null);

  const isComplete = matched.length === 4;

  useEffect(() => {
    speak('Match each item to its shadow!');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLeftTap = (emoji) => {
    if (matched.includes(emoji)) return;
    setSelectedLeft(emoji);
  };

  const handleRightTap = (emoji) => {
    if (!selectedLeft || matched.includes(emoji)) return;
    if (selectedLeft === emoji) {
      setMatched((prev) => [...prev, emoji]);
      speak('Match!');
      setSelectedLeft(null);
    } else {
      setWrong(emoji);
      setTimeout(() => setWrong(null), 500);
      setSelectedLeft(null);
    }
  };

  return (
    <PuzzleWrapper
      puzzleId="shadow-match"
      tier={2}
      isComplete={isComplete}
      roundsCorrect={matched.length}
      roundsTotal={4}
      onPlayAgain={() => {
        setRoundData(generateRound());
        setSelectedLeft(null);
        setMatched([]);
        setWrong(null);
      }}
      onBack={onBack}
    >
      <div className="flex flex-col gap-4 items-center">
        <p className="text-sm font-display font-bold text-text-secondary">
          {t('puzzles.shadowMatch')} — Match items to shadows
        </p>

        <div className="flex gap-6 md:gap-10">
          {/* Left column - colored items */}
          <div className="flex flex-col gap-3">
            {roundData.left.map((emoji, idx) => {
              const isMatched = matched.includes(emoji);
              const isSelected = selectedLeft === emoji;
              return (
                <motion.button
                  key={`left-${idx}`}
                  onClick={() => handleLeftTap(emoji)}
                  className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl cursor-pointer border-2 transition-all ${
                    isMatched
                      ? 'border-primary bg-primary/20 opacity-50'
                      : isSelected
                      ? 'border-white bg-white/20 ring-2 ring-white/50'
                      : 'border-border bg-surface hover:bg-white/10'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  disabled={isMatched}
                >
                  {emoji}
                </motion.button>
              );
            })}
          </div>

          {/* Middle divider */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-0.5 h-full bg-border" />
          </div>

          {/* Right column - shadows */}
          <div className="flex flex-col gap-3">
            {roundData.right.map((emoji, idx) => {
              const isMatched = matched.includes(emoji);
              const isWrong = wrong === emoji;
              return (
                <motion.button
                  key={`right-${idx}`}
                  onClick={() => handleRightTap(emoji)}
                  className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl cursor-pointer border-2 transition-all ${
                    isMatched
                      ? 'border-primary bg-primary/20'
                      : 'border-border bg-surface hover:bg-white/10'
                  }`}
                  style={!isMatched ? { filter: 'grayscale(100%) brightness(0.3)' } : {}}
                  animate={isWrong ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                  whileTap={{ scale: 0.95 }}
                  disabled={isMatched}
                >
                  {emoji}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </PuzzleWrapper>
  );
}
