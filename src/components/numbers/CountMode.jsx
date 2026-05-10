import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import { numberData, countableEmojis, getNumberRange } from '../../data/numbers';
import { useProfile } from '../../contexts/ProfileContext';
import GameWrapper from '../games/GameWrapper';

const TOTAL_ROUNDS = 8;

function generatePositions(count) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    // Keep items within safe bounds with some randomization
    positions.push({
      top: 10 + Math.random() * 70,
      left: 5 + Math.random() * 80,
    });
  }
  return positions;
}

function generateRound(min, max) {
  const count = Math.max(1, min + Math.floor(Math.random() * (max - min + 1)));
  const clampedCount = Math.min(count, max);
  const emoji = countableEmojis[Math.floor(Math.random() * countableEmojis.length)];
  const positions = generatePositions(clampedCount);
  return { count: clampedCount, emoji, positions };
}

export default function CountMode({ onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const { profile } = useProfile();

  const [min, max] = getNumberRange(profile?.tier || 1);
  // Count mode should start from at least 1
  const effectiveMin = Math.max(1, min);

  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(null); // 'correct' | 'incorrect'
  const [countingAnimation, setCountingAnimation] = useState(false);
  const [highlightedItems, setHighlightedItems] = useState(0);
  const timeoutRef = useRef(null);

  const roundData = useMemo(() => generateRound(effectiveMin, max), [round]); // eslint-disable-line react-hooks/exhaustive-deps

  const isComplete = round >= TOTAL_ROUNDS;

  // Generate button options
  const options = useMemo(() => {
    const answer = roundData.count;
    const optionSet = new Set([answer]);
    while (optionSet.size < Math.min(4, max - effectiveMin + 2)) {
      const opt = effectiveMin + Math.floor(Math.random() * (max - effectiveMin + 1));
      if (opt >= 0) optionSet.add(opt);
    }
    // If we still don't have enough, add neighbors
    if (optionSet.size < 3) {
      if (answer > 0) optionSet.add(answer - 1);
      if (answer < 20) optionSet.add(answer + 1);
    }
    return [...optionSet].sort((a, b) => a - b);
  }, [roundData.count, max, effectiveMin]);

  useEffect(() => {
    if (!isComplete) {
      speak(t('numbers.howMany'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const animateCounting = useCallback((count) => {
    setCountingAnimation(true);
    setHighlightedItems(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setHighlightedItems(i);
      if (i <= count) {
        speak(String(i), 1.1);
      }
      if (i >= count) {
        clearInterval(interval);
        timeoutRef.current = setTimeout(() => {
          setCountingAnimation(false);
          setHighlightedItems(0);
          setRound((r) => r + 1);
          setSelected(null);
          setShowResult(null);
        }, 1200);
      }
    }, 500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = useCallback((num) => {
    if (selected !== null || countingAnimation) return;
    setSelected(num);

    if (num === roundData.count) {
      setShowResult('correct');
      setCorrect((c) => c + 1);
      const word = numberData[num]?.i18nWord;
      if (word) speak(t(word));
      timeoutRef.current = setTimeout(() => {
        setRound((r) => r + 1);
        setSelected(null);
        setShowResult(null);
      }, 1500);
    } else {
      setShowResult('incorrect');
      speak(t('numbers.letsCountTogether'));
      timeoutRef.current = setTimeout(() => {
        animateCounting(roundData.count);
      }, 1200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, countingAnimation, roundData.count]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handlePlayAgain = () => {
    setRound(0);
    setCorrect(0);
    setSelected(null);
    setShowResult(null);
    setCountingAnimation(false);
    setHighlightedItems(0);
  };

  return (
    <GameWrapper
      activityType="count"
      difficulty={`tier${profile?.tier || 1}`}
      isComplete={isComplete}
      roundsCorrect={correct}
      roundsTotal={TOTAL_ROUNDS}
      onPlayAgain={handlePlayAgain}
      onBack={onBack}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Round indicator */}
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-display font-bold text-text-secondary">
            Round {round + 1} / {TOTAL_ROUNDS}
          </span>
          <span className="text-sm font-display font-bold text-primary">
            ⭐ {correct}
          </span>
        </div>

        {/* Prompt */}
        <p className="text-lg font-display font-extrabold text-white text-center">
          {t('numbers.howMany')}
        </p>

        {/* Emoji scatter area */}
        <div className="relative w-full h-56 sm:h-64 rounded-2xl bg-surface border-2 border-border overflow-hidden">
          {roundData.positions.map((pos, i) => (
            <motion.span
              key={`${round}-${i}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: countingAnimation && i < highlightedItems ? 1.4 : 1,
                opacity: 1,
              }}
              transition={{
                delay: i * 0.05,
                type: 'spring',
                stiffness: 300,
              }}
              className="absolute text-3xl"
              style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
            >
              {roundData.emoji}
            </motion.span>
          ))}
        </div>

        {/* Number buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {options.map((num) => {
            let btnClass = 'bg-surface border-2 border-border text-white';
            if (selected !== null) {
              if (num === roundData.count && showResult === 'correct') {
                btnClass = 'bg-primary/20 border-2 border-primary text-primary';
              } else if (num === selected && showResult === 'incorrect') {
                btnClass = 'bg-red-500/20 border-2 border-red-500 text-red-400';
              } else if (num === roundData.count && showResult === 'incorrect') {
                btnClass = 'bg-primary/20 border-2 border-primary text-primary';
              }
            }

            return (
              <motion.button
                key={num}
                whileTap={{ scale: 0.92 }}
                animate={
                  num === selected && showResult === 'incorrect'
                    ? { x: [0, -6, 6, -6, 6, 0] }
                    : {}
                }
                transition={{ duration: 0.4 }}
                onClick={() => handleSelect(num)}
                disabled={selected !== null || countingAnimation}
                className={`w-16 h-16 rounded-2xl font-display font-extrabold text-2xl cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] disabled:cursor-not-allowed transition-all ${btnClass}`}
              >
                {num}
              </motion.button>
            );
          })}
        </div>

        {/* Feedback */}
        {showResult && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-lg font-display font-extrabold ${
              showResult === 'correct' ? 'text-primary' : 'text-accent'
            }`}
          >
            {showResult === 'correct' ? t('numbers.correct') : t('numbers.tryAgain')}
          </motion.p>
        )}
      </div>
    </GameWrapper>
  );
}
