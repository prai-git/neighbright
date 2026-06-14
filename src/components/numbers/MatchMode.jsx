import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import { numberData, countableEmojis, getNumberRange } from '../../data/numbers';
import { useProfile } from '../../contexts/ProfileContext';
import { shuffle } from '../../utils/game-helpers';
import GameWrapper from '../games/GameWrapper';

const TOTAL_ROUNDS = 3;

function getPairCount(tier) {
  if (tier === 1) return 3;
  if (tier === 2) return 4;
  return 5;
}

function generatePairs(min, max, count) {
  // Pick random numbers from range (at least 1 for quantity display)
  const available = [];
  for (let i = Math.max(1, min); i <= max; i++) {
    available.push(i);
  }
  const picked = shuffle(available).slice(0, count);
  const emoji = countableEmojis[Math.floor(Math.random() * countableEmojis.length)];

  return picked.map((value) => ({
    value,
    emoji,
    matched: false,
  }));
}

export default function MatchMode({ onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const { profile } = useProfile();

  const [min, max] = getNumberRange(profile?.tier || 1);
  const pairCount = getPairCount(profile?.tier || 1);

  const [round, setRound] = useState(0);
  const [pairs, setPairs] = useState(() => generatePairs(min, max, pairCount));
  const [selectedDigit, setSelectedDigit] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [matchedValues, setMatchedValues] = useState([]);
  const [shakeValue, setShakeValue] = useState(null);
  const [correctFlash, setCorrectFlash] = useState(null);
  const timeoutRef = useRef(null);

  // Shuffled orders for display
  const digitOrder = useMemo(() => shuffle(pairs.map((p) => p.value)), [pairs]);
  const quantityOrder = useMemo(() => shuffle(pairs.map((p) => p.value)), [pairs]);

  const allMatched = matchedValues.length === pairCount;
  const isComplete = round >= TOTAL_ROUNDS;

  // Check for match when both selected
  useEffect(() => {
    if (selectedDigit !== null && selectedQuantity !== null) {
      if (selectedDigit === selectedQuantity) {
        // Correct match
        setCorrectFlash(selectedDigit);
        const numInfo = numberData[selectedDigit];
        if (numInfo) speak(t(numInfo.i18nWord));
        timeoutRef.current = setTimeout(() => {
          setMatchedValues((prev) => [...prev, selectedDigit]);
          setSelectedDigit(null);
          setSelectedQuantity(null);
          setCorrectFlash(null);
        }, 800);
      } else {
        // Wrong match
        setShakeValue(selectedDigit);
        timeoutRef.current = setTimeout(() => {
          setSelectedDigit(null);
          setSelectedQuantity(null);
          setShakeValue(null);
        }, 600);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDigit, selectedQuantity]);

  // Advance round when all matched
  useEffect(() => {
    if (allMatched && round < TOTAL_ROUNDS) {
      timeoutRef.current = setTimeout(() => {
        setRound((r) => r + 1);
        setPairs(generatePairs(min, max, pairCount));
        setMatchedValues([]);
        setSelectedDigit(null);
        setSelectedQuantity(null);
      }, 1200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMatched]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleDigitTap = useCallback((value) => {
    if (matchedValues.includes(value)) return;
    setSelectedDigit(value);
  }, [matchedValues]);

  const handleQuantityTap = useCallback((value) => {
    if (matchedValues.includes(value)) return;
    setSelectedQuantity(value);
  }, [matchedValues]);

  const handlePlayAgain = () => {
    setRound(0);
    setPairs(generatePairs(min, max, pairCount));
    setMatchedValues([]);
    setSelectedDigit(null);
    setSelectedQuantity(null);
    setCorrectFlash(null);
    setShakeValue(null);
  };

  const currentEmoji = pairs[0]?.emoji || '🍎';

  return (
    <GameWrapper
      activityType="match-number"
      difficulty={`tier${profile?.tier || 1}`}
      isComplete={isComplete}
      roundsCorrect={TOTAL_ROUNDS}
      roundsTotal={TOTAL_ROUNDS}
      onPlayAgain={handlePlayAgain}
      onBack={onBack}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Round indicator */}
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-display font-bold text-text-secondary">
            {t('numbers.round', { current: round + 1, total: TOTAL_ROUNDS })}
          </span>
          <span className="text-sm font-display font-bold text-primary">
            {t('numbers.matched', { current: matchedValues.length, total: pairCount })}
          </span>
        </div>

        {/* Two-column matching */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
          {/* Digit column */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-display font-extrabold text-text-secondary uppercase tracking-wider text-center mb-1">
              {t('numbers.digits')}
            </p>
            {digitOrder.map((value) => {
              const isMatched = matchedValues.includes(value);
              const isSelected = selectedDigit === value;
              const isCorrect = correctFlash === value;
              const isShaking = shakeValue === value;

              let cardClass = 'bg-surface border-2 border-border';
              if (isMatched) cardClass = 'bg-primary/10 border-2 border-primary/30 opacity-50';
              else if (isCorrect) cardClass = 'bg-primary/20 border-2 border-primary';
              else if (isSelected) cardClass = 'bg-secondary/20 border-2 border-secondary';

              return (
                <motion.button
                  key={`d-${value}`}
                  animate={isShaking ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDigitTap(value)}
                  disabled={isMatched}
                  className={`py-4 rounded-2xl font-display font-extrabold text-3xl text-white cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] disabled:cursor-not-allowed transition-all ${cardClass}`}
                >
                  {value}
                </motion.button>
              );
            })}
          </div>

          {/* Quantity column */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-display font-extrabold text-text-secondary uppercase tracking-wider text-center mb-1">
              {t('numbers.count')}
            </p>
            {quantityOrder.map((value) => {
              const isMatched = matchedValues.includes(value);
              const isSelected = selectedQuantity === value;
              const isCorrect = correctFlash === value;

              let cardClass = 'bg-surface border-2 border-border';
              if (isMatched) cardClass = 'bg-primary/10 border-2 border-primary/30 opacity-50';
              else if (isCorrect) cardClass = 'bg-primary/20 border-2 border-primary';
              else if (isSelected) cardClass = 'bg-accent/20 border-2 border-accent';

              return (
                <motion.button
                  key={`q-${value}`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuantityTap(value)}
                  disabled={isMatched}
                  className={`py-3 px-2 rounded-2xl cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] disabled:cursor-not-allowed transition-all flex items-center justify-center flex-wrap gap-0.5 min-h-[60px] ${cardClass}`}
                >
                  {Array.from({ length: value }, (_, i) => (
                    <span key={i} className="text-lg">{currentEmoji}</span>
                  ))}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </GameWrapper>
  );
}
