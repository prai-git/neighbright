import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AppLayout from '../components/common/AppLayout';
import LearnNumbersMode from '../components/numbers/LearnNumbersMode';
import CountMode from '../components/numbers/CountMode';
import MatchMode from '../components/numbers/MatchMode';
import NumberQuizMode from '../components/numbers/NumberQuizMode';
import { useTranslation } from '../data/i18n';

const VIEW = { MENU: 'menu', LEARN: 'learn', COUNT: 'count', MATCH: 'match', QUIZ: 'quiz' };

const MODES = [
  { id: VIEW.LEARN, emoji: '📖', nameKey: 'numbers.learnMode', descKey: 'numbers.learnModeDesc', color: '#58CC02' },
  { id: VIEW.COUNT, emoji: '🔢', nameKey: 'numbers.countMode', descKey: 'numbers.countModeDesc', color: '#1CB0F6' },
  { id: VIEW.MATCH, emoji: '🔗', nameKey: 'numbers.matchMode', descKey: 'numbers.matchModeDesc', color: '#FF9600' },
  { id: VIEW.QUIZ,  emoji: '🧠', nameKey: 'numbers.quizMode',  descKey: 'numbers.quizModeDesc',  color: '#CE82FF' },
];

const MODE_COMPONENTS = {
  [VIEW.LEARN]: LearnNumbersMode,
  [VIEW.COUNT]: CountMode,
  [VIEW.MATCH]: MatchMode,
  [VIEW.QUIZ]: NumberQuizMode,
};

export default function Numbers() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [view, setView] = useState(VIEW.MENU);

  const handleBack = useCallback(() => {
    if (view !== VIEW.MENU) {
      setView(VIEW.MENU);
    } else {
      navigate(-1);
    }
  }, [view, navigate]);

  const ModeComponent = view !== VIEW.MENU ? MODE_COMPONENTS[view] : null;

  return (
    <AppLayout bgTheme="numbers">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-display font-extrabold text-white">
            🔢 {t('numbers.title')}
          </h1>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white/10 border-2 border-white/20 text-sm font-display font-extrabold text-white hover:bg-white/15 transition-colors cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            &larr; Back
          </button>
        </div>

        <AnimatePresence mode="wait">
          {view === VIEW.MENU ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {MODES.map((mode) => (
                <div
                  key={mode.id}
                  className="bg-surface rounded-2xl border-2 border-border p-5 flex flex-col gap-3 shadow-[0_4px_0_rgba(0,0,0,0.2)]"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
                      style={{ backgroundColor: mode.color + '25' }}
                    >
                      {mode.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-extrabold text-white text-base">
                        {t(mode.nameKey)}
                      </p>
                      <p className="text-sm text-text-secondary mt-0.5">
                        {t(mode.descKey)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setView(mode.id)}
                    className="w-full py-2.5 rounded-xl font-display font-extrabold text-sm text-white cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.3)] active:shadow-[0_1px_0_rgba(0,0,0,0.3)] active:translate-y-[2px] transition-all"
                    style={{ backgroundColor: mode.color }}
                  >
                    ▶ Play
                  </button>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              {ModeComponent && <ModeComponent onBack={() => setView(VIEW.MENU)} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
