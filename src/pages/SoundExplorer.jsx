import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AppLayout from '../components/common/AppLayout';
import SoundGroupSelector from '../components/sounds/SoundGroupSelector';
import SoundCard from '../components/sounds/SoundCard';
import PracticeView from '../components/sounds/PracticeView';
import SoundSortingGame from '../components/sounds/SoundSortingGame';
import { soundGroups } from '../data/sounds';
import { useSpeech } from '../hooks/useSpeech';
import { useTranslation } from '../data/i18n';
import db from '../db';

const VIEW = {
  GROUPS: 'groups',
  SOUNDS: 'sounds',
  PRACTICE: 'practice',
  GAME: 'game',
};

export default function SoundExplorer() {
  const { t } = useTranslation();
  const { speak } = useSpeech();

  const [view, setView] = useState(VIEW.GROUPS);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedSound, setSelectedSound] = useState(null);
  const [completedMap, setCompletedMap] = useState({});

  const handleSelectGroup = useCallback(group => {
    setSelectedGroup(group);
    setView(VIEW.SOUNDS);
  }, []);

  const handleSelectSound = useCallback(sound => {
    setSelectedSound(sound);
    setView(VIEW.PRACTICE);
  }, []);

  const handleStarEarned = useCallback(async () => {
    const reward = await db.rewards.toCollection().first();
    if (reward) {
      await db.rewards.update(reward.id, { totalStars: (reward.totalStars || 0) + 1 });
    } else {
      await db.rewards.add({ totalStars: 1, currentStreak: 0, longestStreak: 0, lastActive: new Date().toISOString() });
    }
  }, []);

  return (
    <AppLayout>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-border">
        <h1 className="text-xl font-display font-bold text-text-primary">
          {t('sounds.title')}
        </h1>
        <button
          onClick={() => setView(VIEW.GAME)}
          className="text-sm text-primary font-medium hover:underline"
        >
          🎮 {t('sounds.playSortingGame')}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === VIEW.GROUPS && (
          <motion.div key="groups" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SoundGroupSelector groups={soundGroups} onSelectGroup={handleSelectGroup} />
          </motion.div>
        )}

        {view === VIEW.SOUNDS && selectedGroup && (
          <motion.div key="sounds" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="p-4">
            <button
              onClick={() => { setSelectedGroup(null); setView(VIEW.GROUPS); }}
              className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition mb-3"
            >
              ← {t('sounds.backToGroups')}
            </button>
            <h2 className="text-lg font-display font-bold text-text-primary mb-4">
              {t(selectedGroup.i18nKey)}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {selectedGroup.sounds.map(sound => (
                <SoundCard
                  key={sound.id}
                  sound={sound}
                  completedLevels={completedMap[sound.id] || []}
                  onSelect={handleSelectSound}
                />
              ))}
            </div>
          </motion.div>
        )}

        {view === VIEW.PRACTICE && selectedSound && (
          <motion.div key="practice" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <PracticeView
              sound={selectedSound}
              speak={speak}
              onStarEarned={handleStarEarned}
              onBack={() => { setSelectedSound(null); setView(VIEW.SOUNDS); }}
            />
          </motion.div>
        )}

        {view === VIEW.GAME && (
          <motion.div key="game" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <div className="flex items-center gap-3 px-4 pt-4 pb-2">
              <button
                onClick={() => setView(VIEW.GROUPS)}
                className="text-sm text-text-secondary hover:text-primary transition"
              >
                ← {t('sounds.backToGroups')}
              </button>
              <span className="text-lg font-display font-bold text-text-primary">
                🎮 {t('sounds.sortingGame')}
              </span>
            </div>
            <SoundSortingGame speak={speak} onStarEarned={handleStarEarned} />
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
