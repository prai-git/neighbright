import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import { wordCategories } from '../../data/vocabulary';
import { shuffle, pickRandom, getRandomCategories } from '../../utils/game-helpers';
import GameWrapper from './GameWrapper';

const COUNTS = { easy: { cats: 2, items: 6 }, medium: { cats: 2, items: 8 }, hard: { cats: 3, items: 9 } };

function buildRound(difficulty) {
  const cfg = COUNTS[difficulty] || COUNTS.medium;
  const cats = getRandomCategories(wordCategories, cfg.cats);
  if (!cats || cats.length < cfg.cats) return null;

  const perCat = Math.floor(cfg.items / cfg.cats);
  const items = cats.flatMap((cat) =>
    pickRandom(cat.words, perCat).map((w) => ({ ...w, categoryId: cat.id }))
  );
  return { categories: cats, items: shuffle(items) };
}

export default function CategorySortingGame({ difficulty, onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();

  const [round, setRound] = useState(() => buildRound(difficulty));
  const [selectedItem, setSelectedItem] = useState(null);
  const [sorted, setSorted] = useState([]);
  const [shakeId, setShakeId] = useState(null);

  if (!round) return <p className="text-white text-center py-10">Not enough vocabulary data</p>;

  const remaining = round.items.filter((item) => !sorted.includes(item.id));
  const isComplete = remaining.length === 0;

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  const handleDropBucket = (catId) => {
    if (!selectedItem) return;

    if (selectedItem.categoryId === catId) {
      speak(t(selectedItem.i18nWord));
      setSorted((prev) => [...prev, selectedItem.id]);
      setSelectedItem(null);
    } else {
      setShakeId(selectedItem.id);
      setTimeout(() => setShakeId(null), 500);
      setSelectedItem(null);
    }
  };

  const handlePlayAgain = () => {
    setRound(buildRound(difficulty));
    setSelectedItem(null);
    setSorted([]);
    setShakeId(null);
  };

  return (
    <GameWrapper
      activityType="category-sort"
      difficulty={difficulty}
      isComplete={isComplete}
      roundsCorrect={sorted.length}
      roundsTotal={round.items.length}
      onPlayAgain={handlePlayAgain}
      onBack={onBack}
    >
      <div className="flex flex-col gap-5">
        {/* Items to sort */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {remaining.map((item) => (
            <motion.button
              key={item.id}
              animate={shakeId === item.id ? { x: [0, -6, 6, -3, 3, 0] } : {}}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleSelectItem(item)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all shadow-[0_3px_0_rgba(0,0,0,0.2)] ${
                selectedItem?.id === item.id
                  ? 'bg-secondary/20 border-secondary scale-105'
                  : 'bg-surface border-border hover:border-white/30'
              }`}
            >
              <span className="text-3xl">{item.emoji}</span>
              <span className="text-[10px] font-display font-bold text-white truncate max-w-full">
                {t(item.i18nWord)}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Selected indicator */}
        {selectedItem && (
          <p className="text-center text-sm font-display font-bold text-secondary">
            {t(selectedItem.i18nWord)} → ?
          </p>
        )}

        {/* Category buckets */}
        <div className={`grid gap-3 ${round.categories.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {round.categories.map((cat) => {
            const sortedInCat = sorted.filter((id) =>
              round.items.find((item) => item.id === id && item.categoryId === cat.id)
            );
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleDropBucket(cat.id)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all hover:border-white/40"
                style={{ borderColor: cat.color + '80', backgroundColor: cat.color + '15' }}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-display font-extrabold text-white">
                  {t(cat.i18nKey)}
                </span>
                <span className="text-[10px] font-display font-bold text-text-secondary">
                  {sortedInCat.length} placed
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </GameWrapper>
  );
}
