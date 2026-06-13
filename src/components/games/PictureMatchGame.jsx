import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import { wordCategories } from '../../data/vocabulary';
import { shuffle, pickRandom } from '../../utils/game-helpers';
import GameWrapper from './GameWrapper';

const GRID = { easy: 2, medium: 6, hard: 8 };

function buildCards(pairCount) {
  const allWords = wordCategories.flatMap((c) => c.words);
  const picked = pickRandom(allWords, pairCount);
  const pairs = picked.flatMap((w) => [
    { ...w, uid: w.id + '-a' },
    { ...w, uid: w.id + '-b' },
  ]);
  return shuffle(pairs);
}

export default function PictureMatchGame({ difficulty, onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const pairCount = GRID[difficulty] || 6;

  const [cards, setCards] = useState(() => buildCards(pairCount));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [locked, setLocked] = useState(false);

  const isComplete = matched.length === pairCount * 2;
  const cols = pairCount <= 2 ? 2 : pairCount <= 6 ? 3 : 4;

  const handleFlip = useCallback(
    (index) => {
      if (locked || flipped.includes(index) || matched.includes(cards[index].uid)) return;

      const next = [...flipped, index];
      setFlipped(next);

      if (next.length === 2) {
        setLocked(true);
        const [a, b] = next;
        if (cards[a].id === cards[b].id) {
          speak(t(cards[a].i18nWord));
          setMatched((prev) => [...prev, cards[a].uid, cards[b].uid]);
          setFlipped([]);
          setLocked(false);
        } else {
          setTimeout(() => {
            setFlipped([]);
            setLocked(false);
          }, 1000);
        }
      }
    },
    [locked, flipped, matched, cards, speak, t]
  );

  const handlePlayAgain = () => {
    setCards(buildCards(pairCount));
    setFlipped([]);
    setMatched([]);
    setLocked(false);
  };

  return (
    <GameWrapper
      activityType="picture-match"
      difficulty={difficulty}
      isComplete={isComplete}
      roundsCorrect={pairCount}
      roundsTotal={pairCount}
      onPlayAgain={handlePlayAgain}
      onBack={onBack}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm font-display font-bold text-text-secondary text-center">
          {t('games.pairsFound', { found: matched.length / 2, total: pairCount })}
        </p>
        <div
          className="grid gap-3 max-w-2xl mx-auto w-full"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {cards.map((card, i) => {
            const isFlipped = flipped.includes(i) || matched.includes(card.uid);
            const isMatched = matched.includes(card.uid);
            return (
              <motion.button
                key={card.uid}
                onClick={() => handleFlip(i)}
                aria-label={isFlipped ? `Card: ${card.emoji}` : `Flip card ${i + 1}`}
                animate={isMatched ? { scale: [1, 1.1, 1] } : {}}
                className={`aspect-square rounded-2xl flex items-center justify-center text-5xl cursor-pointer border-2 transition-all shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] ${
                  isMatched
                    ? 'bg-green-500/20 border-green-500'
                    : isFlipped
                    ? 'bg-surface border-secondary'
                    : 'bg-surface border-border hover:border-white/30'
                }`}
              >
                {isFlipped ? card.emoji : '❓'}
              </motion.button>
            );
          })}
        </div>
      </div>
    </GameWrapper>
  );
}
