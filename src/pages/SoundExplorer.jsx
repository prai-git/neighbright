import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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

  const handleBack = () => {
    if (view === VIEW.PRACTICE) { setSelectedSound(null); setView(VIEW.SOUNDS); }
    else if (view === VIEW.SOUNDS) { setSelectedGroup(null); setView(VIEW.GROUPS); }
    else if (view === VIEW.GAME) { setView(VIEW.GROUPS); }
    else { navigate(-1); }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-5">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-display font-extrabold text-white">
            🔊 {t('sounds.title')}
          </h1>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white/10 border-2 border-white/20 text-sm font-display font-extrabold text-white hover:bg-white/15 transition-colors cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            ← Back
          </button>
        </div>

        <AnimatePresence mode="wait">
          {view === VIEW.GROUPS && (
            <motion.div key="groups" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SoundGroupSelector groups={soundGroups} onSelectGroup={handleSelectGroup} />
            </motion.div>
          )}

          {view === VIEW.SOUNDS && selectedGroup && (
            <motion.div key="sounds" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-lg font-display font-extrabold text-white mb-4">
                {t(selectedGroup.i18nKey)}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
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
              />
            </motion.div>
          )}

          {view === VIEW.GAME && (
            <motion.div key="game" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-lg font-display font-extrabold text-white mb-4">
                🎮 {t('sounds.sortingGame')}
              </h2>
              <SoundSortingGame speak={speak} onStarEarned={handleStarEarned} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
