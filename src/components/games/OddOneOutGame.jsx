import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import { wordCategories } from '../../data/vocabulary';
import { pickOddOneOut } from '../../utils/game-helpers';
import GameWrapper from './GameWrapper';

const ROUNDS = 8;

function buildRound() {
  const catIds = wordCategories.map((c) => c.id);
  const mainId = catIds[Math.floor(Math.random() * catIds.length)];
  return pickOddOneOut(wordCategories, mainId);
}

export default function OddOneOutGame({ difficulty, onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();

  const [round, setRound] = useState(0);
  const [data, setData] = useState(() => buildRound());
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const isComplete = round >= ROUNDS;

  useEffect(() => {
    if (isComplete || !data) return;
    const timer = setTimeout(() => {
      speak(t('games.whichDoesntBelong'));
    }, 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, isComplete]);

  const handleTap = useCallback(
    (item) => {
      if (selected || !data) return;
      setSelected(item.id);

      if (item.id === data.oddItem.id) {
        setFeedback('correct');
        setCorrect((c) => c + 1);
        speak(t(item.i18nWord));
        setTimeout(() => {
          setSelected(null);
          setFeedback(null);
          setRound((r) => r + 1);
          setData(buildRound());
        }, 1500);
      } else {
        setFeedback('incorrect');
        setTimeout(() => {
          setSelected(null);
          setFeedback(null);
        }, 800);
      }
    },
    [selected, data, speak, t]
  );

  const handlePlayAgain = () => {
    setRound(0);
    setCorrect(0);
    setSelected(null);
    setFeedback(null);
    setData(buildRound());
  };

  if (!data) return <p className="text-white text-center py-10">Not enough vocabulary data</p>;

  return (
    <GameWrapper
      activityType="odd-one-out"
      difficulty={difficulty}
      isComplete={isComplete}
      roundsCorrect={correct}
      roundsTotal={ROUNDS}
      onPlayAgain={handlePlayAgain}
      onBack={onBack}
    >
      <div className="flex flex-col gap-5">
        <p className="text-sm font-display font-bold text-text-secondary text-center">
          {round + 1} / {ROUNDS}
        </p>

        <p className="text-lg font-display font-extrabold text-white text-center">
          {t('games.whichDoesntBelong')}
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto w-full">
          {data.items.map((item) => {
            const isSel = selected === item.id;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.93 }}
                animate={
                  isSel && feedback === 'incorrect'
                    ? { x: [0, -6, 6, -3, 3, 0] }
                    : isSel && feedback === 'correct'
                    ? { scale: [1, 1.15, 1] }
                    : {}
                }
                onClick={() => handleTap(item)}
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 cursor-pointer transition-all aspect-square justify-center shadow-[0_3px_0_rgba(0,0,0,0.2)] ${
                  isSel && feedback === 'correct'
                    ? 'bg-green-500/20 border-green-500'
                    : isSel && feedback === 'incorrect'
                    ? 'bg-red-500/10 border-red-500/50'
                    : 'bg-surface border-border hover:border-white/30'
                }`}
              >
                <span className="text-5xl">{item.emoji}</span>
                <span className="text-sm font-display font-bold text-white">
                  {t(item.i18nWord)}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </GameWrapper>
  );
}
