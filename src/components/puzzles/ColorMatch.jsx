import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import PuzzleWrapper from './PuzzleWrapper';

const EMOJIS = ['🌟', '🐟', '🍎', '🦋', '🎈', '🌺', '🐝', '🍀', '🎵', '🐸', '🌈', '🍄'];
const COLORS = [
  { name: 'red', bg: '#FF4B4B', border: '#FF6B6B' },
  { name: 'blue', bg: '#1CB0F6', border: '#4DC4FF' },
  { name: 'green', bg: '#58CC02', border: '#7BDB3F' },
  { name: 'yellow', bg: '#FFD900', border: '#FFE44D' },
];
const TOTAL_ROUNDS = 4;

function generateRound() {
  const shuffled = [...EMOJIS].sort(() => Math.random() - 0.5).slice(0, 8);
  const targetColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  const items = shuffled.map((emoji) => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return { emoji, color, isTarget: color.name === targetColor.name };
  });
  // Ensure at least 2 targets
  let targetCount = items.filter((i) => i.isTarget).length;
  while (targetCount < 2) {
    const idx = items.findIndex((i) => !i.isTarget);
    if (idx >= 0) {
      items[idx].color = targetColor;
      items[idx].isTarget = true;
      targetCount++;
    }
  }
  return { items, targetColor };
}

export default function ColorMatch({ onComplete, onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const [round, setRound] = useState(0);
  const [roundData, setRoundData] = useState(() => generateRound());
  const [tapped, setTapped] = useState([]);
  const [shaking, setShaking] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [roundDone, setRoundDone] = useState(false);

  const isComplete = round >= TOTAL_ROUNDS;
  const totalTargets = roundData.items.filter((i) => i.isTarget).length;
  const foundTargets = tapped.filter((i) => roundData.items[i]?.isTarget).length;

  useEffect(() => {
    speak(`Tap all the ${roundData.targetColor.name} ones!`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  useEffect(() => {
    if (foundTargets === totalTargets && !roundDone && tapped.length > 0) {
      setRoundDone(true);
      setCorrect((prev) => prev + 1);
      setTimeout(() => {
        setRound((prev) => prev + 1);
        setRoundData(generateRound());
        setTapped([]);
        setRoundDone(false);
      }, 1200);
    }
  }, [foundTargets, totalTargets, roundDone, tapped.length]);

  const handleTap = useCallback(
    (index) => {
      if (tapped.includes(index) || roundDone) return;
      const item = roundData.items[index];
      if (item.isTarget) {
        setTapped((prev) => [...prev, index]);
      } else {
        setShaking(index);
        setTimeout(() => setShaking(null), 500);
      }
    },
    [tapped, roundData.items, roundDone]
  );

  return (
    <PuzzleWrapper
      puzzleId="color-match"
      tier={1}
      isComplete={isComplete}
      roundsCorrect={correct}
      roundsTotal={TOTAL_ROUNDS}
      onPlayAgain={() => {
        setRound(0);
        setRoundData(generateRound());
        setTapped([]);
        setCorrect(0);
        setRoundDone(false);
      }}
      onBack={onBack}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-display font-bold text-text-secondary">
            {t('puzzles.colorMatch')} — {round + 1}/{TOTAL_ROUNDS}
          </p>
          <div
            className="px-3 py-1 rounded-full text-sm font-display font-bold text-white"
            style={{ backgroundColor: roundData.targetColor.bg }}
          >
            {roundData.targetColor.name}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {roundData.items.map((item, idx) => {
            const isTapped = tapped.includes(idx);
            const isShaking = shaking === idx;
            return (
              <motion.button
                key={idx}
                onClick={() => handleTap(idx)}
                className="aspect-square rounded-xl flex items-center justify-center text-3xl cursor-pointer border-3 transition-all"
                style={{
                  backgroundColor: item.color.bg + '25',
                  borderColor: isTapped ? '#58CC02' : item.color.border + '60',
                }}
                animate={
                  isShaking
                    ? { x: [0, -8, 8, -8, 8, 0] }
                    : isTapped
                    ? { scale: [1, 1.15, 1] }
                    : {}
                }
                transition={{ duration: 0.4 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.emoji}
              </motion.button>
            );
          })}
        </div>

        <p className="text-center text-xs text-text-secondary">
          {foundTargets}/{totalTargets}
        </p>
      </div>
    </PuzzleWrapper>
  );
}
