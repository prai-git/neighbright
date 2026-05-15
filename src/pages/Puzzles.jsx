import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AppLayout from '../components/common/AppLayout';
import { useTranslation } from '../data/i18n';
import { useProfile } from '../contexts/ProfileContext';
import { puzzlesByTier } from '../data/puzzles';

import ShapeSorter from '../components/puzzles/ShapeSorter';
import ColorMatch from '../components/puzzles/ColorMatch';
import SizeOrder from '../components/puzzles/SizeOrder';
import Peekaboo from '../components/puzzles/Peekaboo';
import Jigsaw from '../components/puzzles/Jigsaw';
import PatternCompletion from '../components/puzzles/PatternCompletion';
import Counting from '../components/puzzles/Counting';
import LetterTrace from '../components/puzzles/LetterTrace';
import ShadowMatch from '../components/puzzles/ShadowMatch';
import RhymingPairs from '../components/puzzles/RhymingPairs';
import WordPicture from '../components/puzzles/WordPicture';
import SentenceBuilder from '../components/puzzles/SentenceBuilder';
import StorySequence from '../components/puzzles/StorySequence';
import BeginningSound from '../components/puzzles/BeginningSound';
import Analogies from '../components/puzzles/Analogies';
import Maze from '../components/puzzles/Maze';

const COMPONENTS = {
  ShapeSorter, ColorMatch, SizeOrder, Peekaboo, Jigsaw,
  PatternCompletion, Counting, LetterTrace, ShadowMatch, RhymingPairs,
  WordPicture, SentenceBuilder, StorySequence, BeginningSound, Analogies, Maze,
};

const TIER_META = [
  { tier: 1, emoji: '🌱', nameKey: 'puzzles.tier1', color: '#58CC02' },
  { tier: 2, emoji: '🌿', nameKey: 'puzzles.tier2', color: '#1CB0F6' },
  { tier: 3, emoji: '🌳', nameKey: 'puzzles.tier3', color: '#CE82FF' },
];

export default function Puzzles() {
  const { t } = useTranslation();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [activePuzzle, setActivePuzzle] = useState(null);
  const [expandedTier, setExpandedTier] = useState(null);

  const userTier = profile?.tier || 1;

  const handleBack = () => {
    if (activePuzzle) {
      setActivePuzzle(null);
    } else {
      navigate(-1);
    }
  };

  const toggleTier = (tier) => {
    setExpandedTier(expandedTier === tier ? null : tier);
  };

  if (activePuzzle) {
    const Comp = COMPONENTS[activePuzzle.component];
    if (!Comp) return null;
    return (
      <AppLayout bgTheme="puzzles">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-display font-extrabold text-white">
              🧩 {t(activePuzzle.i18nKey)}
            </h1>
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white/10 border-2 border-white/20 text-sm font-display font-extrabold text-white hover:bg-white/15 transition-colors cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
            >
              ← {t('common.back')}
            </button>
          </div>
          <Comp onBack={handleBack} config={activePuzzle.config} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout bgTheme="puzzles">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-display font-extrabold text-white">
            🧩 {t('puzzles.title')}
          </h1>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white/10 border-2 border-white/20 text-sm font-display font-extrabold text-white hover:bg-white/15 transition-colors cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            ← {t('common.back')}
          </button>
        </div>

        {TIER_META.map((meta) => {
          const puzzles = puzzlesByTier[meta.tier] || [];
          const isLocked = meta.tier > userTier;
          const isExpanded = expandedTier === meta.tier || (expandedTier === null && meta.tier === userTier);

          return (
            <div key={meta.tier} className="rounded-2xl bg-surface border-2 border-border overflow-hidden shadow-[0_4px_0_rgba(0,0,0,0.2)]">
              <button
                onClick={() => toggleTier(meta.tier)}
                className="w-full flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <span className="text-3xl">{meta.emoji}</span>
                <div className="flex-1 text-left">
                  <p className="font-display font-extrabold text-white text-base">
                    {t(meta.nameKey)}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {puzzles.length} puzzles
                  </p>
                </div>
                {isLocked && <span className="text-xl opacity-50">🔒</span>}
                <span className={`text-text-secondary text-sm transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 p-4 pt-0 ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
                      {puzzles.map((puzzle, i) => (
                        <motion.button
                          key={puzzle.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setActivePuzzle(puzzle)}
                          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-background border-2 border-border cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] hover:border-white/30 transition-colors"
                        >
                          <span className="text-4xl">{puzzle.icon}</span>
                          <p className="font-display font-extrabold text-sm text-white text-center">
                            {t(puzzle.i18nKey)}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
