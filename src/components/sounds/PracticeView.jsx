import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import RecordCompare from './RecordCompare';
import db from '../../db';

const LEVEL_COUNT = 5;

export default function PracticeView({ sound, speak, onStarEarned }) {
  const { t } = useTranslation();
  const [activeLevel, setActiveLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [showStar, setShowStar] = useState(false);
  const startTimeRef = useRef(Date.now());

  const levelData = sound.levels[activeLevel];
  const displaySymbol = sound.symbol.replace(/\//g, '');

  const handleLevelSelect = useCallback(n => {
    setActiveLevel(n);
    startTimeRef.current = Date.now();
  }, []);

  const handleAttempt = useCallback(async (wordAttempted = '') => {
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    await db.progress.add({
      module: 'sounds',
      activityType: 'sound-practice',
      activityData: { soundId: sound.id, level: activeLevel, wordAttempted },
      result: 'attempted',
      durationSecs: elapsed,
      createdAt: new Date().toISOString(),
    });
    if (!completedLevels.includes(activeLevel)) {
      setCompletedLevels(prev => [...prev, activeLevel]);
      setShowStar(true);
      setTimeout(() => setShowStar(false), 1800);
      onStarEarned?.();
    }
    startTimeRef.current = Date.now();
  }, [sound.id, activeLevel, completedLevels, onStarEarned]);

  const handleSpeak = useCallback((text, rate = 0.7) => {
    speak(text, rate);
    handleAttempt(text);
  }, [speak, handleAttempt]);

  return (
    <div className="flex flex-col relative">
      {/* Sound header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-3xl font-display font-extrabold text-primary">{displaySymbol}</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-text-secondary mb-1">{t('sounds.ageAcquisition', { age: sound.ageOfAcquisition })}</p>
          <p className="text-sm text-text-secondary leading-relaxed">{sound.mouthDescription}</p>
        </div>
      </div>

      {/* Mouth diagram */}
      <div className="flex justify-center mb-4">
        <img
          src={`/images/mouth/${sound.mouthDiagramKey}.svg`}
          alt={t('sounds.mouthGuide')}
          className="w-32 h-32 rounded-2xl bg-white border border-border p-2"
        />
      </div>

      {/* Level tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto hide-scrollbar">
        {Array.from({ length: LEVEL_COUNT }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            onClick={() => handleLevelSelect(n)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-display font-bold transition cursor-pointer ${
              activeLevel === n
                ? 'bg-primary text-white shadow-sm'
                : completedLevels.includes(n)
                ? 'bg-primary/10 text-primary'
                : 'bg-white text-text-secondary border border-border'
            }`}
          >
            {completedLevels.includes(n) && '⭐ '}{t('sounds.level', { n })}
          </button>
        ))}
      </div>

      {/* Level content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLevel}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-[10px] font-display font-bold text-text-secondary uppercase tracking-widest mb-3">
            {t(`sounds.levels.${activeLevel}`)}
          </p>

          {activeLevel === 1 && levelData && (
            <LevelIsolation levelData={levelData} onSpeak={handleSpeak} t={t} />
          )}
          {activeLevel === 2 && levelData && (
            <LevelSyllables levelData={levelData} onSpeak={handleSpeak} t={t} />
          )}
          {activeLevel === 3 && levelData && (
            <LevelWords levelData={levelData} onSpeak={handleSpeak} t={t} />
          )}
          {activeLevel === 4 && levelData && (
            <LevelPhrases levelData={levelData} onSpeak={handleSpeak} t={t} />
          )}
          {activeLevel === 5 && levelData && (
            <LevelSentences levelData={levelData} onSpeak={handleSpeak} t={t} />
          )}

          {/* Record & compare */}
          <div className="mt-5 bg-white rounded-2xl p-4 border border-border">
            <p className="text-[10px] font-display font-bold text-text-secondary uppercase tracking-widest mb-3">
              {t('sounds.yourTurn')}
            </p>
            <RecordCompare
              speak={speak}
              modelText={levelData?.model || levelData?.syllables?.[0] || levelData?.words?.[0]?.word || levelData?.phrases?.[0] || levelData?.sentences?.[0] || sound.symbol}
              modelRate={activeLevel <= 2 ? 0.6 : 0.8}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Star pop */}
      <AnimatePresence>
        {showStar && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <div className="text-7xl drop-shadow-lg">⭐</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Sub-views ── */

function LevelIsolation({ levelData, onSpeak, t }) {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <p className="text-xl font-display font-bold text-text-primary text-center">
        {levelData.prompt}
      </p>
      <button
        onClick={() => onSpeak(levelData.model, 0.5)}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-display font-bold shadow-sm hover:shadow-md transition cursor-pointer text-base"
      >
        🔊 {t('sounds.tapToHear')}
      </button>
      <p className="text-xs text-text-secondary">{t('sounds.listenFirst')}</p>
    </div>
  );
}

function LevelSyllables({ levelData, onSpeak, t }) {
  return (
    <div className="flex flex-col gap-4 py-2">
      <p className="text-sm font-medium text-text-secondary text-center">{levelData.prompt}</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {levelData.syllables?.map(syl => (
          <button
            key={syl}
            onClick={() => onSpeak(syl, 0.65)}
            className="px-5 py-3 bg-white border-2 border-primary/20 text-primary rounded-2xl font-display text-lg font-bold hover:bg-primary/5 hover:border-primary/40 transition cursor-pointer"
          >
            {syl}
          </button>
        ))}
      </div>
      <p className="text-xs text-center text-text-secondary">{t('sounds.tapToHear')}</p>
    </div>
  );
}

function LevelWords({ levelData, onSpeak, t }) {
  return (
    <div className="grid grid-cols-3 gap-3 py-2">
      {levelData.words?.map(({ word, emoji }) => (
        <button
          key={word}
          onClick={() => onSpeak(word, 0.75)}
          className="bg-white border border-border rounded-2xl p-4 flex flex-col items-center gap-1.5 hover:shadow-md hover:border-primary/20 transition cursor-pointer"
        >
          <span className="text-4xl">{emoji}</span>
          <span className="text-sm font-display font-bold text-text-primary capitalize">{word}</span>
        </button>
      ))}
    </div>
  );
}

function LevelPhrases({ levelData, onSpeak, t }) {
  return (
    <div className="flex flex-col gap-2 py-2">
      {levelData.phrases?.map(phrase => (
        <button
          key={phrase}
          onClick={() => onSpeak(phrase, 0.8)}
          className="w-full text-left bg-white border border-border rounded-2xl px-4 py-3 text-text-primary font-display font-medium hover:shadow-sm hover:border-primary/20 transition flex items-center justify-between gap-2 cursor-pointer"
        >
          <span>{phrase}</span>
          <span className="text-primary flex-shrink-0 opacity-50">🔊</span>
        </button>
      ))}
    </div>
  );
}

function LevelSentences({ levelData, onSpeak, t }) {
  return (
    <div className="flex flex-col gap-4 py-2">
      {levelData.sentences?.map(sentence => (
        <div key={sentence} className="bg-white border border-border rounded-2xl p-5">
          <p className="text-lg font-display font-medium text-text-primary text-center mb-4 leading-relaxed">
            &ldquo;{sentence}&rdquo;
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => onSpeak(sentence, 0.85)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full font-display font-bold shadow-sm hover:shadow-md transition cursor-pointer"
            >
              🔊 {t('sounds.tapToHear')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
