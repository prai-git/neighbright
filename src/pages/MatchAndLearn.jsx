import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AppLayout from '../components/common/AppLayout';
import PictureMatchGame from '../components/games/PictureMatchGame';
import CategorySortingGame from '../components/games/CategorySortingGame';
import FollowDirectionsGame from '../components/games/FollowDirectionsGame';
import WhatsMissingGame from '../components/games/WhatsMissingGame';
import OddOneOutGame from '../components/games/OddOneOutGame';
import SequenceBuilderGame from '../components/games/SequenceBuilderGame';
import { useTranslation } from '../data/i18n';

const GAMES = [
  { id: 'pictureMatch',     emoji: '🃏', nameKey: 'games.pictureMatch',     descKey: 'games.pictureMatchDesc',     color: '#58CC02' },
  { id: 'categorySorting',  emoji: '📦', nameKey: 'games.categorySorting',  descKey: 'games.categorySortingDesc',  color: '#1CB0F6' },
  { id: 'followDirections', emoji: '👂', nameKey: 'games.followDirections', descKey: 'games.followDirectionsDesc', color: '#FF9600' },
  { id: 'whatsMissing',     emoji: '🔍', nameKey: 'games.whatsMissing',     descKey: 'games.whatsMissingDesc',     color: '#CE82FF' },
  { id: 'oddOneOut',        emoji: '🤔', nameKey: 'games.oddOneOut',        descKey: 'games.oddOneOutDesc',        color: '#FF4B4B' },
  { id: 'sequenceBuilder',  emoji: '📋', nameKey: 'games.sequenceBuilder',  descKey: 'games.sequenceBuilderDesc',  color: '#FFB347' },
];

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const DIFF_KEYS = { easy: 'games.easy', medium: 'games.medium', hard: 'games.hard' };

const GAME_COMPONENTS = {
  pictureMatch: PictureMatchGame,
  categorySorting: CategorySortingGame,
  followDirections: FollowDirectionsGame,
  whatsMissing: WhatsMissingGame,
  oddOneOut: OddOneOutGame,
  sequenceBuilder: SequenceBuilderGame,
};

export default function MatchAndLearn() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeGame, setActiveGame] = useState(null);
  const [difficulty, setDifficulty] = useState('easy');
  const [selectedDiffs, setSelectedDiffs] = useState({});

  const handleBack = useCallback(() => {
    if (activeGame) {
      setActiveGame(null);
    } else {
      navigate(-1);
    }
  }, [activeGame, navigate]);

  const handlePlay = (gameId) => {
    setDifficulty(selectedDiffs[gameId] || 'easy');
    setActiveGame(gameId);
  };

  const handleDiffChange = (gameId, diff) => {
    setSelectedDiffs((prev) => ({ ...prev, [gameId]: diff }));
  };

  const GameComponent = activeGame ? GAME_COMPONENTS[activeGame] : null;

  return (
    <AppLayout bgTheme="games">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-display font-extrabold text-white">
            🎮 {t('games.title')}
          </h1>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white/10 border-2 border-white/20 text-sm font-display font-extrabold text-white hover:bg-white/15 transition-colors cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            ← Back
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!activeGame ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {GAMES.map((game) => {
                const gameDiff = selectedDiffs[game.id] || 'easy';
                return (
                  <div
                    key={game.id}
                    className="bg-surface rounded-2xl border-2 border-border p-5 flex flex-col gap-3 shadow-[0_4px_0_rgba(0,0,0,0.2)]"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                        style={{ backgroundColor: game.color + '25' }}
                      >
                        {game.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-extrabold text-white text-sm">
                          {t(game.nameKey)}
                        </p>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {t(game.descKey)}
                        </p>
                      </div>
                    </div>

                    {/* Difficulty selector */}
                    <div className="flex gap-1 bg-background rounded-lg p-0.5">
                      {DIFFICULTIES.map((diff) => (
                        <button
                          key={diff}
                          onClick={() => handleDiffChange(game.id, diff)}
                          className={`flex-1 py-1.5 rounded-md text-xs font-display font-bold transition-all cursor-pointer ${
                            gameDiff === diff
                              ? 'bg-white/15 text-white'
                              : 'text-text-secondary hover:text-white'
                          }`}
                        >
                          {t(DIFF_KEYS[diff])}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePlay(game.id)}
                      className="w-full py-2.5 rounded-xl font-display font-extrabold text-sm text-white cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.3)] active:shadow-[0_1px_0_rgba(0,0,0,0.3)] active:translate-y-[2px] transition-all"
                      style={{ backgroundColor: game.color }}
                    >
                      ▶ Play
                    </button>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key={activeGame}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {GameComponent && (
                <GameComponent
                  difficulty={difficulty}
                  onBack={() => setActiveGame(null)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
