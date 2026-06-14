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

  // Phonics breakdown: spell out each letter slowly, then say the full word
  const handleSpeakWithBreakdown = useCallback((text, rate = 0.65) => {
    const letters = text.replace(/[^a-zA-Z]/g, '').split('');
    let delay = 0;
    letters.forEach((letter, i) => {
      setTimeout(() => speak(letter, 0.4), delay);
      delay += 700;
    });
    // Say the full word after all letters
    setTimeout(() => {
      speak(text, rate);
      handleAttempt(text);
    }, delay + 300);
  }, [speak, handleAttempt]);

  return (
    <div className="flex flex-col relative">
      {/* Sound header */}
      <div className="flex items-center gap-4 mb-5 p-5 bg-surface rounded-2xl border-2 border-border">
        <div className="w-20 h-20 rounded-2xl bg-secondary/20 flex items-center justify-center shrink-0 border-2 border-secondary/30">
          <span className="text-4xl font-display font-extrabold text-secondary">{displaySymbol}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm text-text-secondary mb-1 font-display font-bold">{t('sounds.ageAcquisition', { age: sound.ageOfAcquisition })}</p>
          <p className="text-base text-text-secondary leading-relaxed">{sound.mouthDescription}</p>
        </div>
      </div>

      {/* Mouth diagram */}
      <div className="flex justify-center mb-5">
        <img
          src={`${import.meta.env.BASE_URL}images/mouth/${sound.mouthDiagramKey}.svg`}
          alt={t('sounds.mouthGuide')}
          className="w-40 h-40 rounded-2xl bg-surface border-2 border-border p-2"
        />
      </div>

      {/* Level tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto hide-scrollbar">
        {Array.from({ length: LEVEL_COUNT }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            onClick={() => handleLevelSelect(n)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-display font-extrabold transition cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] ${
              activeLevel === n
                ? 'bg-primary text-white'
                : completedLevels.includes(n)
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-surface text-text-secondary border-2 border-border'
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
          <p className="text-[10px] font-display font-extrabold text-text-secondary uppercase tracking-widest mb-3">
            {t(`sounds.levels.${activeLevel}`)}
          </p>

          {activeLevel === 1 && levelData && (
            <LevelIsolation levelData={levelData} onSpeak={handleSpeak} t={t} />
          )}
          {activeLevel === 2 && levelData && (
            <LevelSyllables levelData={levelData} onSpeak={handleSpeak} onSpeakBreakdown={handleSpeakWithBreakdown} t={t} />
          )}
          {activeLevel === 3 && levelData && (
            <LevelWords levelData={levelData} onSpeak={handleSpeak} onSpeakBreakdown={handleSpeakWithBreakdown} t={t} />
          )}
          {activeLevel === 4 && levelData && (
            <LevelPhrases levelData={levelData} onSpeak={handleSpeak} t={t} />
          )}
          {activeLevel === 5 && levelData && (
            <LevelSentences levelData={levelData} onSpeak={handleSpeak} t={t} />
          )}

          {/* Record & compare */}
          <div className="mt-5 bg-surface rounded-2xl p-4 border-2 border-border">
            <p className="text-[10px] font-display font-extrabold text-text-secondary uppercase tracking-widest mb-3">
              {t('sounds.yourTurn')}
            </p>
            <RecordCompare
              speak={speak}
              modelText={activeLevel === 1 ? (levelData?.model || sound.symbol).replace(/(.)\1+/g, '$1') : (levelData?.model || levelData?.syllables?.[0] || levelData?.words?.[0]?.word || levelData?.phrases?.[0] || levelData?.sentences?.[0] || sound.symbol)}
              modelRate={activeLevel === 1 ? 0.3 : activeLevel === 2 ? 0.6 : 0.8}
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
  // Deduplicate repeated chars so TTS says the phoneme once, not letter-by-letter
  // e.g. 'nnn' → 'n', 'sss' → 's', 'shh' → 'sh'
  const spokenPhoneme = levelData.model.replace(/(.)\1+/g, '$1');

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <p className="text-xl font-display font-extrabold text-white text-center">
        {levelData.prompt}
      </p>
      <button
        onClick={() => onSpeak(spokenPhoneme, 0.3)}
        className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-display font-extrabold shadow-[0_4px_0_rgba(0,0,0,0.2)] hover:brightness-110 transition cursor-pointer text-base uppercase tracking-wide active:translate-y-[2px] active:shadow-[0_1px_0_rgba(0,0,0,0.2)]"
      >
        🔊 {t('sounds.tapToHear')}
      </button>
      <p className="text-xs text-text-secondary font-display font-bold">{t('sounds.listenFirst')}</p>
    </div>
  );
}

function LevelSyllables({ levelData, onSpeak, onSpeakBreakdown, t }) {
  return (
    <div className="flex flex-col gap-4 py-2">
      <p className="text-sm font-display font-bold text-text-secondary text-center">{levelData.prompt}</p>
      <div className="flex flex-wrap gap-3 justify-center">
        {levelData.syllables?.map(syl => (
          <button
            key={syl}
            onClick={() => onSpeakBreakdown(syl, 0.65)}
            className="px-6 py-3 bg-surface border-2 border-secondary/30 text-secondary rounded-2xl font-display text-lg font-extrabold hover:bg-secondary/10 hover:border-secondary/50 transition cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            {syl}
          </button>
        ))}
      </div>
      <p className="text-xs text-center text-text-secondary font-display font-bold">{t('sounds.tapToHearBreakdown')}</p>
    </div>
  );
}

function LevelWords({ levelData, onSpeak, onSpeakBreakdown, t }) {
  return (
    <div className="grid grid-cols-3 gap-3 py-2">
      {levelData.words?.map(({ word, emoji }) => (
        <button
          key={word}
          onClick={() => onSpeakBreakdown(word, 0.75)}
          className="bg-surface border-2 border-border rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-primary/50 transition cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
        >
          <span className="text-5xl">{emoji}</span>
          <span className="text-base font-display font-extrabold text-white capitalize">{word}</span>
        </button>
      ))}
    </div>
  );
}

function LevelPhrases({ levelData, onSpeak, t }) {
  return (
    <div className="flex flex-col gap-3 py-2">
      {levelData.phrases?.map(phrase => (
        <button
          key={phrase}
          onClick={() => onSpeak(phrase, 0.8)}
          className="w-full text-left bg-surface border-2 border-border rounded-2xl px-5 py-4 text-white font-display font-bold hover:border-primary/50 transition flex items-center justify-between gap-2 cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
        >
          <span>{phrase}</span>
          <span className="text-secondary flex-shrink-0 opacity-60">🔊</span>
        </button>
      ))}
    </div>
  );
}

function LevelSentences({ levelData, onSpeak, t }) {
  return (
    <div className="flex flex-col gap-4 py-2">
      {levelData.sentences?.map(sentence => (
        <div key={sentence} className="bg-surface border-2 border-border rounded-2xl p-5 shadow-[0_3px_0_rgba(0,0,0,0.2)]">
          <p className="text-lg font-display font-bold text-white text-center mb-4 leading-relaxed">
            &ldquo;{sentence}&rdquo;
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => onSpeak(sentence, 0.85)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-display font-extrabold shadow-[0_3px_0_rgba(0,0,0,0.2)] hover:brightness-110 transition cursor-pointer active:translate-y-[2px] active:shadow-[0_1px_0_rgba(0,0,0,0.2)]"
            >
              🔊 {t('sounds.tapToHear')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
