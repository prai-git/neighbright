import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import { numberData, getNumberRange } from '../../data/numbers';
import { useProfile } from '../../contexts/ProfileContext';
import ASLSign from '../common/ASLSign';
import db from '../../db';

const FINGER_MAP = {
  0: '✊',
  1: '☝️',
  2: '✌️',
  3: '🤟',
  4: '🖖',
  5: '🖐️',
};

function getFingerDisplay(n) {
  if (n === 0) return '✊';
  if (n <= 5) return FINGER_MAP[n] || '🖐️';
  const fives = Math.floor(n / 5);
  const remainder = n % 5;
  let display = '';
  for (let i = 0; i < fives; i++) display += '🖐️';
  if (remainder > 0) display += ' + ' + (FINGER_MAP[remainder] || `${remainder}`);
  return display;
}

function QuantityGrid({ count }) {
  const emoji = '🍎';
  if (count === 0) {
    return (
      <div className="flex items-center justify-center h-16">
        <span className="text-2xl text-text-secondary">—</span>
      </div>
    );
  }
  if (count <= 5) {
    return (
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {Array.from({ length: count }, (_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="text-3xl"
          >
            {emoji}
          </motion.span>
        ))}
      </div>
    );
  }
  if (count <= 10) {
    const topRow = 5;
    const bottomRow = count - 5;
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-1.5">
          {Array.from({ length: topRow }, (_, i) => (
            <motion.span key={`t${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.08 }} className="text-2xl">{emoji}</motion.span>
          ))}
        </div>
        <div className="flex items-center justify-center gap-1.5">
          {Array.from({ length: bottomRow }, (_, i) => (
            <motion.span key={`b${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: (5 + i) * 0.08 }} className="text-2xl">{emoji}</motion.span>
          ))}
        </div>
      </div>
    );
  }
  // 11-20: compact grid with count badge
  const cols = 5;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: count }, (_, i) => (
          <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.04 }} className="text-lg text-center">{emoji}</motion.span>
        ))}
      </div>
      <span className="text-xs font-display font-bold text-text-secondary mt-1">{count}</span>
    </div>
  );
}

export default function LearnNumbersMode({ onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const { profile } = useProfile();

  const [min, max] = getNumberRange(profile?.tier || 1);
  const numbers = numberData.filter((n) => n.value >= min && n.value <= max);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const current = numbers[index];

  useEffect(() => {
    if (current) {
      speak(t(current.i18nWord));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const goNext = useCallback(() => {
    if (index < numbers.length - 1) {
      setDirection(1);
      setIndex((i) => i + 1);
    }
  }, [index, numbers.length]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      setDirection(-1);
      setIndex((i) => i - 1);
    }
  }, [index]);

  const handleTapCard = () => {
    speak(t(current.i18nWord));
  };

  // Log progress when reaching the last card
  useEffect(() => {
    if (index === numbers.length - 1) {
      db.progress.add({
        module: 'numbers',
        activityType: 'learn-number',
        activityData: { range: [min, max] },
        result: 'completed',
        durationSecs: 0,
        createdAt: new Date().toISOString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  if (!current) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress dots */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {numbers.map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === index ? 'bg-primary' : i < index ? 'bg-primary/40' : 'bg-border'
            }`}
          />
        ))}
      </div>

      {/* Flashcard */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.button
          key={index}
          custom={direction}
          initial={{ opacity: 0, x: direction * 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -80 }}
          transition={{ duration: 0.25 }}
          onClick={handleTapCard}
          className="w-full max-w-sm rounded-3xl bg-surface border-2 border-border p-8 flex flex-col items-center gap-5 cursor-pointer shadow-[0_6px_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_rgba(0,0,0,0.2)] active:translate-y-[3px] transition-shadow"
        >
          {/* Large digit + ASL sign */}
          <div className="flex items-center gap-4">
            <span className="text-8xl font-display font-extrabold text-white">
              {current.value}
            </span>
            {current.value <= 10 && <ASLSign value={current.value} size="xl" />}
          </div>

          {/* Number word */}
          <span className="text-2xl font-display font-extrabold text-primary">
            {t(current.i18nWord)}
          </span>

          {/* Quantity visualization */}
          <div className="min-h-[60px]">
            <QuantityGrid count={current.value} />
          </div>

          {/* Finger counting (0-10 only) */}
          {current.fingers !== null && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl">{getFingerDisplay(current.value)}</span>
            </div>
          )}

          {/* Tap to hear hint */}
          <span className="text-xs text-text-secondary font-display">
            🔊 {t('common.tapToHear')}
          </span>
        </motion.button>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="px-5 py-3 rounded-xl bg-white/10 border-2 border-white/20 text-white font-display font-extrabold text-sm cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ←
        </button>
        <span className="text-sm font-display font-bold text-text-secondary">
          {index + 1} / {numbers.length}
        </span>
        <button
          onClick={goNext}
          disabled={index === numbers.length - 1}
          className="px-5 py-3 rounded-xl bg-primary text-white font-display font-extrabold text-sm cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          →
        </button>
      </div>
    </div>
  );
}
