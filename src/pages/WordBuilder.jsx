import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AppLayout from '../components/common/AppLayout';
import LearnMode from '../components/words/LearnMode';
import ListenPointMode from '../components/words/ListenPointMode';
import SayItMode from '../components/words/SayItMode';
import { wordCategories } from '../data/vocabulary';
import { useTranslation } from '../data/i18n';
import { getWeightedWordList } from '../utils/spaced-repetition';
import db from '../db';

const VIEW = {
  CATEGORIES: 'categories',
  MODE: 'mode',
};

const MODES = [
  { id: 'learn', i18nKey: 'words.learnMode' },
  { id: 'listen', i18nKey: 'words.listenMode' },
  { id: 'say', i18nKey: 'words.sayMode' },
];

export default function WordBuilder() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [view, setView] = useState(VIEW.CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMode, setSelectedMode] = useState('learn');
  const [weightedWords, setWeightedWords] = useState([]);

  const handleSelectCategory = useCallback((cat) => {
    setSelectedCategory(cat);
    setView(VIEW.MODE);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      getWeightedWordList(selectedCategory.words).then(setWeightedWords);
    }
  }, [selectedCategory]);

  const handleBack = () => {
    if (view === VIEW.MODE) {
      setSelectedCategory(null);
      setView(VIEW.CATEGORIES);
    } else {
      navigate(-1);
    }
  };

  const handleStarEarned = useCallback(async () => {
    const reward = await db.rewards.toCollection().first();
    if (reward) {
      await db.rewards.update(reward.id, { totalStars: (reward.totalStars || 0) + 1 });
    } else {
      await db.rewards.add({ totalStars: 1, currentStreak: 0, longestStreak: 0, lastActive: new Date().toISOString() });
    }
  }, []);

  const wordsToUse = selectedMode === 'learn' ? (selectedCategory?.words || []) : weightedWords;

  return (
    <AppLayout bgTheme="words">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-display font-extrabold text-white">
            🔤 {t('words.title')}
          </h1>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white/10 border-2 border-white/20 text-sm font-display font-extrabold text-white hover:bg-white/15 transition-colors cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            ← Back
          </button>
        </div>

        <AnimatePresence mode="wait">
          {view === VIEW.CATEGORIES && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-5"
            >
              {/* Category grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {wordCategories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectCategory(cat)}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-border bg-surface cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] hover:border-white/30 transition-colors"
                  >
                    <span className="text-4xl">{cat.icon}</span>
                    <span className="text-sm font-display font-bold text-white text-center">
                      {t(cat.i18nKey)}
                    </span>
                    <span className="text-xs text-text-secondary font-display">
                      {cat.words.length} {t('home.modules.wordsDesc').split(' ')[0].toLowerCase()}
                    </span>
                    <div
                      className="w-8 h-1 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {view === VIEW.MODE && selectedCategory && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-5"
            >
              {/* Category badge */}
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedCategory.icon}</span>
                <span className="text-lg font-display font-extrabold text-white">
                  {t(selectedCategory.i18nKey)}
                </span>
              </div>

              {/* Mode selector */}
              <div className="flex gap-2 bg-surface rounded-xl p-1 border-2 border-border">
                {MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-display font-extrabold transition-all cursor-pointer ${
                      selectedMode === mode.id
                        ? 'bg-primary text-white shadow-[0_2px_0_rgba(0,0,0,0.2)]'
                        : 'text-text-secondary hover:text-white'
                    }`}
                  >
                    {t(mode.i18nKey)}
                  </button>
                ))}
              </div>

              {/* Active mode */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {selectedMode === 'learn' && (
                    <LearnMode
                      words={wordsToUse}
                      categoryColor={selectedCategory.color}
                      onStarEarned={handleStarEarned}
                    />
                  )}
                  {selectedMode === 'listen' && wordsToUse.length > 1 && (
                    <ListenPointMode
                      words={wordsToUse}
                      onStarEarned={handleStarEarned}
                    />
                  )}
                  {selectedMode === 'say' && (
                    <SayItMode
                      words={wordsToUse}
                      onStarEarned={handleStarEarned}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
