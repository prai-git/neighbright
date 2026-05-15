import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import { wordCategories } from '../../data/vocabulary';
import { shuffle, pickRandom } from '../../utils/game-helpers';
import GameWrapper from './GameWrapper';

const ROUNDS = 8;
const GRID_SIZE = { easy: 4, medium: 5, hard: 6 };

function buildRound(difficulty) {
  const allWords = wordCategories.flatMap((c) => c.words);
  const count = GRID_SIZE[difficulty] || 5;
  const items = pickRandom(allWords, count);
  const target = items[Math.floor(Math.random() * items.length)];
  return { items: shuffle(items), target };
}

export default function FollowDirectionsGame({ difficulty, onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();

  const [round, setRound] = useState(0);
  const [data, setData] = useState(() => buildRound(difficulty));
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const isComplete = round >= ROUNDS;

  useEffect(() => {
    if (isComplete) return;
    const timer = setTimeout(() => {
      speak(t('games.tapInstruction', { item: t(data.target.i18nWord) }));
    }, 500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, isComplete]);

  const handleTap = useCallback(
    (item) => {
      if (selected) return;
      setSelected(item.id);

      if (item.id === data.target.id) {
        setFeedback('correct');
        setCorrect((c) => c + 1);
        setTimeout(() => {
          setSelected(null);
          setFeedback(null);
          setRound((r) => r + 1);
          setData(buildRound(difficulty));
        }, 1200);
      } else {
        setFeedback('incorrect');
        setTimeout(() => {
          setSelected(null);
          setFeedback(null);
          speak(t('games.tapInstruction', { item: t(data.target.i18nWord) }));
        }, 1000);
      }
    },
    [selected, data, difficulty, speak, t]
  );

  const handlePlayAgain = () => {
    setRound(0);
    setCorrect(0);
    setSelected(null);
    setFeedback(null);
    setData(buildRound(difficulty));
  };

  return (
    <GameWrapper
      activityType="follow-directions"
      difficulty={difficulty}
      isComplete={isComplete}
      roundsCorrect={correct}
      roundsTotal={ROUNDS}
      onPlayAgain={handlePlayAgain}
      onBack={onBack}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-display font-bold text-text-secondary">
            {round + 1} / {ROUNDS}
          </p>
          <button
            onClick={() => speak(t('games.tapInstruction', { item: t(data.target.i18nWord) }))}
            className="text-sm text-secondary font-display font-bold cursor-pointer hover:underline"
          >
            🔊 {t('sounds.tapToHear')}
          </button>
        </div>

        <p className="text-lg font-display font-extrabold text-white text-center">
          {t('games.tapInstruction', { item: t(data.target.i18nWord) })}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto w-full">
          {data.items.map((item) => {
            const isSel = selected === item.id;
            const isCorrectItem = item.id === data.target.id;
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.93 }}
                animate={
                  isSel && feedback === 'incorrect'
                    ? { x: [0, -6, 6, -3, 3, 0] }
                    : {}
                }
                onClick={() => handleTap(item)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all aspect-square justify-center shadow-[0_3px_0_rgba(0,0,0,0.2)] ${
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
