import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AppLayout from '../components/common/AppLayout';
import LearnNumbersMode from '../components/numbers/LearnNumbersMode';
import CountMode from '../components/numbers/CountMode';
import MatchMode from '../components/numbers/MatchMode';
import NumberQuizMode from '../components/numbers/NumberQuizMode';
import { useTranslation } from '../data/i18n';

const VIEW = { MENU: 'menu', LEARN: 'learn', COUNT: 'count', MATCH: 'match', QUIZ: 'quiz' };

const MODE_CARDS = [
  {
    id: VIEW.LEARN,
    emoji: '📖',
    nameKey: 'numbers.learnMode',
    descKey: 'numbers.learnModeDesc',
    color: '#58CC02',
  },
  {
    id: VIEW.COUNT,
    emoji: '🔢',
    nameKey: 'numbers.countMode',
    descKey: 'numbers.countModeDesc',
    color: '#1CB0F6',
  },
  {
    id: VIEW.MATCH,
    emoji: '🔗',
    nameKey: 'numbers.matchMode',
    descKey: 'numbers.matchModeDesc',
    color: '#FF9600',
  },
  {
    id: VIEW.QUIZ,
    emoji: '🧠',
    nameKey: 'numbers.quizMode',
    descKey: 'numbers.quizModeDesc',
    color: '#CE82FF',
  },
];

export default function Numbers() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [view, setView] = useState(VIEW.MENU);

  const handleBack = () => {
    if (view !== VIEW.MENU) {
      setView(VIEW.MENU);
    } else {
      navigate(-1);
    }
  };

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
            ← {t('common.back')}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {view === VIEW.MENU && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 gap-4"
            >
              {MODE_CARDS.map((card, i) => (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setView(card.id)}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-surface border-2 border-border cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] hover:border-white/30 transition-colors"
                >
                  <span className="text-4xl">{card.emoji}</span>
                  <div className="text-center">
                    <p className="font-display font-extrabold text-sm text-white">
                      {t(card.nameKey)}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      {t(card.descKey)}
                    </p>
                  </div>
                  <div
                    className="px-4 py-1.5 rounded-lg font-display font-extrabold text-xs text-white"
                    style={{ backgroundColor: card.color }}
                  >
                    Play
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {view === VIEW.LEARN && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <LearnNumbersMode onBack={() => setView(VIEW.MENU)} />
            </motion.div>
          )}

          {view === VIEW.COUNT && (
            <motion.div
              key="count"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CountMode onBack={() => setView(VIEW.MENU)} />
            </motion.div>
          )}

          {view === VIEW.MATCH && (
            <motion.div
              key="match"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MatchMode onBack={() => setView(VIEW.MENU)} />
            </motion.div>
          )}

          {view === VIEW.QUIZ && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <NumberQuizMode onBack={() => setView(VIEW.MENU)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
