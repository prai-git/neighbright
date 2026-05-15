import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import { sequences } from '../../data/sequences';
import { shuffle } from '../../utils/game-helpers';
import GameWrapper from './GameWrapper';

function buildRound(usedIds) {
  const available = sequences.filter((s) => !usedIds.includes(s.id));
  const pool = available.length > 0 ? available : sequences;
  const seq = pool[Math.floor(Math.random() * pool.length)];
  return {
    sequence: seq,
    shuffled: shuffle(seq.items.map((item, i) => ({ ...item, correctIndex: i }))),
  };
}

export default function SequenceBuilderGame({ difficulty, onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();

  const totalRounds = difficulty === 'easy' ? 3 : difficulty === 'hard' ? 6 : 4;
  const [round, setRound] = useState(0);
  const [usedIds, setUsedIds] = useState([]);
  const [data, setData] = useState(() => buildRound([]));
  const [placed, setPlaced] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const isComplete = round >= totalRounds;

  const remaining = data.shuffled.filter(
    (item) => !placed.find((p) => p.correctIndex === item.correctIndex)
  );

  const handleTap = useCallback(
    (item) => {
      const nextIndex = placed.length;
      if (item.correctIndex === nextIndex) {
        const newPlaced = [...placed, item];
        setPlaced(newPlaced);
        speak(t(item.i18nWord));

        if (newPlaced.length === data.shuffled.length) {
          setFeedback('correct');
          setCorrect((c) => c + 1);
          setTimeout(() => {
            const newUsed = [...usedIds, data.sequence.id];
            setUsedIds(newUsed);
            setRound((r) => r + 1);
            setData(buildRound(newUsed));
            setPlaced([]);
            setFeedback(null);
          }, 1500);
        }
      } else {
        setFeedback('incorrect');
        setTimeout(() => {
          setPlaced([]);
          setFeedback(null);
        }, 800);
      }
    },
    [placed, data, usedIds, speak, t]
  );

  const handlePlayAgain = () => {
    setRound(0);
    setUsedIds([]);
    setCorrect(0);
    setPlaced([]);
    setFeedback(null);
    setData(buildRound([]));
  };

  return (
    <GameWrapper
      activityType="sequence-builder"
      difficulty={difficulty}
      isComplete={isComplete}
      roundsCorrect={correct}
      roundsTotal={totalRounds}
      onPlayAgain={handlePlayAgain}
      onBack={onBack}
    >
      <div className="flex flex-col gap-5">
        <p className="text-sm font-display font-bold text-text-secondary text-center">
          {round + 1} / {totalRounds}
        </p>

        <p className="text-base font-display font-extrabold text-white text-center">
          {t('games.sequenceBuilderDesc')}
        </p>

        {/* Placed slots */}
        <div className="flex gap-2 justify-center">
          {data.shuffled.map((_, i) => {
            const item = placed[i];
            return (
              <motion.div
                key={i}
                animate={feedback === 'correct' && item ? { scale: [1, 1.15, 1] } : {}}
                transition={{ delay: i * 0.1 }}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 flex items-center justify-center transition-all ${
                  item
                    ? 'bg-green-500/15 border-green-500/50'
                    : i === placed.length
                    ? 'bg-secondary/10 border-secondary/50 border-dashed'
                    : 'bg-border/30 border-white/10 border-dashed'
                }`}
              >
                {item ? (
                  <span className="text-3xl sm:text-4xl">{item.emoji}</span>
                ) : (
                  <span className="text-base font-display font-bold text-white/30">{i + 1}</span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Arrow */}
        <div className="flex justify-center text-white/30 text-lg">→ → →</div>

        {/* Remaining items */}
        <div className="flex gap-3 justify-center flex-wrap">
          {remaining.map((item) => (
            <motion.button
              key={item.correctIndex}
              whileTap={{ scale: 0.9 }}
              animate={feedback === 'incorrect' ? { x: [0, -4, 4, -2, 2, 0] } : {}}
              onClick={() => handleTap(item)}
              className="flex flex-col items-center gap-1 p-3 w-16 sm:w-20 rounded-xl bg-surface border-2 border-border cursor-pointer hover:border-white/30 transition-all shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
            >
              <span className="text-3xl sm:text-4xl">{item.emoji}</span>
              <span className="text-xs font-display font-bold text-white truncate max-w-full">
                {t(item.i18nWord)}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </GameWrapper>
  );
}
