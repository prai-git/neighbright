import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import RecordCompare from './RecordCompare';
import db from '../../db';

const LEVEL_COUNT = 5;

export default function PracticeView({ sound, speak, onStarEarned, onBack }) {
  const { t } = useTranslation();
  const [activeLevel, setActiveLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [showStar, setShowStar] = useState(false);
  const startTimeRef = useRef(Date.now());

  const levelData = sound.levels[activeLevel];

  const handleLevelSelect = useCallback(n => {
    setActiveLevel(n);
    startTimeRef.current = Date.now();
  }, []);

  const handleAttempt = useCallback(async (wordAttempted = '') => {
    const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
    // Log to IndexedDB
    await db.progress.add({
      module: 'sounds',
      activityType: 'sound-practice',
      activityData: { soundId: sound.id, level: activeLevel, wordAttempted },
      result: 'attempted',
      durationSecs: elapsed,
      createdAt: new Date().toISOString(),
    });
    // Award star for first attempt at each level
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
    <div className="flex flex-col h-full relative">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition px-4 pt-3 pb-1 w-fit"
      >
        ← {t('sounds.backToSounds')}
      </button>

      {/* Sound header */}
      <div className="flex items-center gap-4 px-4 py-2">
        <div className="text-5xl font-mono font-bold text-primary">{sound.symbol}</div>
        <div>
          <div className="text-xs text-text-secondary">{t('sounds.ageAcquisition', { age: sound.ageOfAcquisition })}</div>
        </div>
      </div>

      {/* Mouth diagram + description */}
      <div className="flex flex-col sm:flex-row items-center gap-4 px-4 pb-2">
        <img
          src={`/images/mouth/${sound.mouthDiagramKey}.svg`}
          alt={t('sounds.mouthGuide')}
          className="w-28 h-28 rounded-2xl border border-border bg-surface"
        />
        <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
          {sound.mouthDescription}
        </p>
      </div>

      {/* Level tabs */}
      <div className="flex gap-1 px-4 pb-3 overflow-x-auto">
        {Array.from({ length: LEVEL_COUNT }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            onClick={() => handleLevelSelect(n)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary ${
              activeLevel === n
                ? 'bg-primary text-white shadow'
                : completedLevels.includes(n)
                ? 'bg-primary/20 text-primary'
                : 'bg-surface text-text-secondary border border-border'
            }`}
          >
            {completedLevels.includes(n) ? '⭐' : ''} {t('sounds.level', { n })}
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
          className="flex-1 px-4 pb-4 overflow-y-auto"
        >
          <div className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
            {t(`sounds.levels.${activeLevel}`)}
          </div>

          {/* Level 1: Isolation */}
          {activeLevel === 1 && levelData && (
            <LevelIsolation levelData={levelData} onSpeak={handleSpeak} t={t} />
          )}

          {/* Level 2: Syllables */}
          {activeLevel === 2 && levelData && (
            <LevelSyllables levelData={levelData} onSpeak={handleSpeak} t={t} />
          )}

          {/* Level 3: Words */}
          {activeLevel === 3 && levelData && (
            <LevelWords levelData={levelData} onSpeak={handleSpeak} t={t} />
          )}

          {/* Level 4: Phrases */}
          {activeLevel === 4 && levelData && (
            <LevelPhrases levelData={levelData} onSpeak={handleSpeak} t={t} />
          )}

          {/* Level 5: Sentences */}
          {activeLevel === 5 && levelData && (
            <LevelSentences levelData={levelData} onSpeak={handleSpeak} t={t} />
          )}

          {/* Record & compare */}
          <div className="mt-4 bg-surface rounded-2xl p-4 border border-border">
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
              {t('sounds.yourTurn')}
            </div>
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
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
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
      <p className="text-2xl font-display font-bold text-text-primary text-center">
        {levelData.prompt}
      </p>
      <button
        onClick={() => onSpeak(levelData.model, 0.5)}
        className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl font-medium shadow hover:opacity-90 transition text-lg"
      >
        🔊 {t('sounds.tapToHear')}
      </button>
      <p className="text-sm text-text-secondary">{t('sounds.listenFirst')}</p>
    </div>
  );
}

function LevelSyllables({ levelData, onSpeak, t }) {
  return (
    <div className="flex flex-col gap-4 py-2">
      <p className="text-base font-medium text-text-secondary text-center">{levelData.prompt}</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {levelData.syllables?.map(syl => (
          <button
            key={syl}
            onClick={() => onSpeak(syl, 0.65)}
            className="px-5 py-3 bg-surface border border-primary text-primary rounded-2xl font-mono text-lg font-bold shadow hover:bg-primary/10 transition"
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
          className="bg-surface border border-border rounded-2xl p-3 flex flex-col items-center gap-1 shadow hover:border-primary hover:bg-primary/5 transition"
        >
          <span className="text-3xl">{emoji}</span>
          <span className="text-sm font-semibold text-text-primary capitalize">{word}</span>
          <span className="text-xs text-primary">🔊</span>
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
          className="w-full text-left bg-surface border border-border rounded-2xl px-4 py-3 text-text-primary font-medium hover:border-primary hover:bg-primary/5 transition flex items-center justify-between gap-2"
        >
          <span>{phrase}</span>
          <span className="text-primary flex-shrink-0">🔊</span>
        </button>
      ))}
    </div>
  );
}

function LevelSentences({ levelData, onSpeak, t }) {
  return (
    <div className="flex flex-col gap-4 py-4 items-center">
      {levelData.sentences?.map(sentence => (
        <div key={sentence} className="bg-surface border border-border rounded-2xl p-4 w-full">
          <p className="text-lg font-medium text-text-primary text-center mb-3 leading-relaxed">
            "{sentence}"
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => onSpeak(sentence, 0.85)}
              className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl font-medium shadow hover:opacity-90 transition"
            >
              🔊 {t('sounds.tapToHear')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
