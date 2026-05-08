import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import { wordCategories } from '../../data/vocabulary';
import { shuffle, pickRandom } from '../../utils/game-helpers';
import GameWrapper from './GameWrapper';

const ROUNDS = 8;
const ITEM_COUNT = { easy: 4, medium: 5, hard: 6 };

function buildRound(difficulty) {
  const allWords = wordCategories.flatMap((c) => c.words);
  const count = ITEM_COUNT[difficulty] || 5;
  const items = pickRandom(allWords, count);
  const removedIndex = Math.floor(Math.random() * items.length);
  const removed = items[removedIndex];
  const distractors = pickRandom(allWords, 3, items.map((w) => w.id));
  const choices = shuffle([removed, ...distractors.slice(0, 2)]);
  return { items, removed, removedIndex, choices };
}

const PHASE = { MEMORIZE: 'memorize', HIDING: 'hiding', GUESS: 'guess' };

export default function WhatsMissingGame({ difficulty, onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();

  const [round, setRound] = useState(0);
  const [data, setData] = useState(() => buildRound(difficulty));
  const [phase, setPhase] = useState(PHASE.MEMORIZE);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const isComplete = round >= ROUNDS;

  useEffect(() => {
    if (isComplete) return;
    if (phase === PHASE.MEMORIZE) {
      const timer = setTimeout(() => setPhase(PHASE.HIDING), 3000);
      return () => clearTimeout(timer);
    }
    if (phase === PHASE.HIDING) {
      const timer = setTimeout(() => {
        setPhase(PHASE.GUESS);
        speak(t('games.whatsMissingDesc'));
      }, 1000);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, isComplete]);

  const handleGuess = useCallback(
    (item) => {
      if (selected) return;
      setSelected(item.id);

      if (item.id === data.removed.id) {
        setFeedback('correct');
        setCorrect((c) => c + 1);
        speak(t(data.removed.i18nWord));
        setTimeout(() => {
          setSelected(null);
          setFeedback(null);
          setPhase(PHASE.MEMORIZE);
          setRound((r) => r + 1);
          setData(buildRound(difficulty));
        }, 1500);
      } else {
        setFeedback('incorrect');
        setTimeout(() => {
          setSelected(null);
          setFeedback(null);
        }, 800);
      }
    },
    [selected, data, difficulty, speak, t]
  );

  const handlePlayAgain = () => {
    setRound(0);
    setCorrect(0);
    setSelected(null);
    setFeedback(null);
    setPhase(PHASE.MEMORIZE);
    setData(buildRound(difficulty));
  };

  return (
    <GameWrapper
      activityType="whats-missing"
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

        {phase === PHASE.HIDING && (
          <div className="flex items-center justify-center py-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-4xl font-display font-extrabold text-primary"
            >
              🙈
            </motion.div>
          </div>
        )}

        {phase !== PHASE.HIDING && (
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto w-full">
            {data.items.map((item, i) => {
              const isRemoved = phase === PHASE.GUESS && i === data.removedIndex;
              return (
                <div
                  key={item.id + i}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 aspect-square justify-center transition-all ${
                    isRemoved
                      ? 'bg-border/30 border-dashed border-white/10'
                      : 'bg-surface border-border'
                  }`}
                >
                  {!isRemoved && (
                    <>
                      <span className="text-3xl">{item.emoji}</span>
                      <span className="text-[10px] font-display font-bold text-white">{t(item.i18nWord)}</span>
                    </>
                  )}
                  {isRemoved && <span className="text-2xl text-white/20">?</span>}
                </div>
              );
            })}
          </div>
        )}

        {phase === PHASE.GUESS && (
          <div className="flex flex-col gap-3 items-center">
            <p className="text-base font-display font-extrabold text-white">
              {t('games.whatsMissingDesc')}
            </p>
            <div className="grid grid-cols-3 gap-3 max-w-xs w-full">
              {data.choices.map((item) => {
                const isSel = selected === item.id;
                return (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.93 }}
                    animate={isSel && feedback === 'incorrect' ? { x: [0, -6, 6, -3, 3, 0] } : {}}
                    onClick={() => handleGuess(item)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all shadow-[0_3px_0_rgba(0,0,0,0.2)] ${
                      isSel && feedback === 'correct'
                        ? 'bg-green-500/20 border-green-500'
                        : isSel && feedback === 'incorrect'
                        ? 'bg-red-500/10 border-red-500/50'
                        : 'bg-surface border-border hover:border-white/30'
                    }`}
                  >
                    <span className="text-3xl">{item.emoji}</span>
                    <span className="text-[10px] font-display font-bold text-white">{t(item.i18nWord)}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {phase === PHASE.MEMORIZE && (
          <p className="text-sm font-display font-bold text-accent text-center animate-pulse">
            👀 Remember these!
          </p>
        )}
      </div>
    </GameWrapper>
  );
}
