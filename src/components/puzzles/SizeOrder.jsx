import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import PuzzleWrapper from './PuzzleWrapper';

const EMOJI_OPTIONS = ['🐻', '🌟', '🍎', '🎈', '🦋', '🌻', '🐶', '🐱'];
const SIZES = [
  { label: 'tiny', fontSize: '1.5rem' },
  { label: 'small', fontSize: '2.5rem' },
  { label: 'medium', fontSize: '3.5rem' },
  { label: 'big', fontSize: '5rem' },
];

function generateRound() {
  const emoji = EMOJI_OPTIONS[Math.floor(Math.random() * EMOJI_OPTIONS.length)];
  const items = SIZES.map((size, i) => ({ ...size, id: i, emoji }));
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return { emoji, items: shuffled, ordered: items };
}

export default function SizeOrder({ onComplete, onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const [roundData, setRoundData] = useState(() => generateRound());
  const [placed, setPlaced] = useState([]);
  const [wrong, setWrong] = useState(null);

  const isComplete = placed.length === SIZES.length;
  const nextExpected = placed.length; // Index in ordered (0=tiny, 1=small, etc.)

  useEffect(() => {
    speak(t('puzzles.tapSmallestToBiggest'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTap = (item) => {
    if (placed.find((p) => p.id === item.id)) return;
    if (item.id === nextExpected) {
      setPlaced((prev) => [...prev, item]);
      speak(item.label);
    } else {
      setWrong(item.id);
      setTimeout(() => setWrong(null), 500);
    }
  };

  const handlePlayAgain = () => {
    setRoundData(generateRound());
    setPlaced([]);
    setWrong(null);
  };

  return (
    <PuzzleWrapper
      puzzleId="size-order"
      tier={1}
      isComplete={isComplete}
      roundsCorrect={SIZES.length}
      roundsTotal={SIZES.length}
      onPlayAgain={handlePlayAgain}
      onBack={onBack}
    >
      <div className="flex flex-col gap-6">
        <p className="text-center text-sm font-display font-bold text-text-secondary">
          {t('puzzles.sizeOrder')} — {t('puzzles.tapSmallestToBiggest')}
        </p>

        {/* Available items */}
        <div className="flex flex-wrap justify-center items-end gap-4 min-h-[120px]">
          {roundData.items.map((item) => {
            const isPlaced = placed.find((p) => p.id === item.id);
            const isWrong = wrong === item.id;
            if (isPlaced) return null;
            return (
              <motion.button
                key={item.id}
                onClick={() => handleTap(item)}
                className="bg-surface border-2 border-border rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-all"
                animate={isWrong ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                whileTap={{ scale: 0.95 }}
              >
                <span style={{ fontSize: item.fontSize }}>{item.emoji}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t-2 border-dashed border-border" />

        {/* Ordered row */}
        <div className="flex justify-center items-end gap-4 min-h-[100px]">
          {placed.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-primary/20 border-2 border-primary/40 rounded-xl p-3"
            >
              <span style={{ fontSize: item.fontSize }}>{item.emoji}</span>
            </motion.div>
          ))}
          {placed.length < SIZES.length && (
            <div className="border-2 border-dashed border-border rounded-xl p-3 opacity-40">
              <span style={{ fontSize: SIZES[placed.length].fontSize }}>?</span>
            </div>
          )}
        </div>
      </div>
    </PuzzleWrapper>
  );
}
