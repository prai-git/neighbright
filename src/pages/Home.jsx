import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '../components/common/AppLayout';
import { ProgressBar } from '../components/common';
import { useTranslation } from '../data/i18n';
import { useProfile } from '../contexts/ProfileContext';
import db from '../db';
import { wordCategories } from '../data/vocabulary';

const MODULE_CARDS = [
  { emoji: '💬', nameKey: 'home.modules.talkBoard',  descKey: 'home.modules.talkBoardDesc', to: '/talk-board',      bg: '#58CC02', dark: '#46A302' },
  { emoji: '🔊', nameKey: 'home.modules.sounds',     descKey: 'home.modules.soundsDesc',    to: '/sound-explorer',  bg: '#1CB0F6', dark: '#1899D6' },
  { emoji: '🔤', nameKey: 'home.modules.words',      descKey: 'home.modules.wordsDesc',     to: '/word-builder',    bg: '#FF9600', dark: '#E08600' },
  { emoji: '🎮', nameKey: 'home.modules.games',      descKey: 'home.modules.gamesDesc',     to: '/match-and-learn', bg: '#CE82FF', dark: '#B06FDF' },
  { emoji: '🧩', nameKey: 'home.modules.puzzles',    descKey: 'home.modules.puzzlesDesc',   to: '/puzzles',         bg: '#FF4B4B', dark: '#E04343' },
];

const ALL_WORDS = wordCategories.flatMap((c) => c.words);

function getDailyWord() {
  if (!ALL_WORDS.length) return null;
  const dayIndex = Math.floor(Date.now() / 86400000) % ALL_WORDS.length;
  const w = ALL_WORDS[dayIndex];
  return { key: w.id, emoji: w.emoji, i18nWord: w.i18nWord, i18nPhrase: w.i18nPhrase };
}

function speakWord(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.9;
  window.speechSynthesis.speak(utt);
}

export default function Home() {
  const { t } = useTranslation();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const [stars, setStars] = useState(0);
  const [streak, setStreak] = useState(0);
  const [goalMinutes, setGoalMinutes] = useState(10);
  const [practicedSecs, setPracticedSecs] = useState(0);

  const dailyWord = useMemo(() => getDailyWord(), []);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);

    db.rewards.toCollection().first().then((r) => {
      if (r) { setStars(r.totalStars || 0); setStreak(r.currentStreak || 0); }
    });

    db.settings.toCollection().first().then((s) => {
      if (s?.dailyGoalMinutes) setGoalMinutes(s.dailyGoalMinutes);
    });

    db.progress
      .filter((e) => typeof e.createdAt === 'string' && e.createdAt.startsWith(today))
      .toArray()
      .then((entries) => {
        const total = entries.reduce((sum, e) => sum + (e.durationSecs || 0), 0);
        setPracticedSecs(total);
      })
      .catch(() => {});
  }, []);

  const goalProgress = Math.min(100, Math.round((practicedSecs / 60 / goalMinutes) * 100));

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">

        {/* Greeting banner */}
        <div className="rounded-2xl p-5 md:p-6" style={{ background: 'linear-gradient(135deg, #1B2B32 0%, #233A44 100%)', border: '2px solid #2B3D45' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-3xl shrink-0 border-2 border-primary/30">
              {profile?.avatarKey || '👤'}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl font-display font-extrabold text-white truncate">
                {t('home.greeting', { name: profile?.name || '' })}
              </h1>
              <div className="flex items-center gap-4 mt-1">
                {streak > 0 && (
                  <span className="flex items-center gap-1 text-sm font-display font-bold text-accent">
                    🔥 {streak} {t('common.days')}
                  </span>
                )}
                <span className="flex items-center gap-1 text-sm font-display font-bold text-accent">
                  ⭐ {stars}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row — Daily Goal + Word of Day side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Daily Goal */}
          <div className="rounded-2xl p-4 bg-surface border-2 border-border shadow-[0_4px_0_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between mb-3">
              <p className="font-display font-extrabold text-sm text-white uppercase tracking-wide">
                {t('home.dailyGoal')}
              </p>
              <span className="text-xs font-display font-bold text-primary bg-primary/15 px-2 py-1 rounded-lg">
                {Math.round(practicedSecs / 60)}/{goalMinutes} min
              </span>
            </div>
            <ProgressBar value={goalProgress} color="primary" size="sm" animated />
          </div>

          {/* Word of the Day */}
          {dailyWord && (
            <button
              onClick={() => speakWord(t(dailyWord.i18nWord))}
              className="flex items-center gap-4 rounded-2xl p-4 bg-surface border-2 border-border shadow-[0_4px_0_rgba(0,0,0,0.2)] cursor-pointer hover:border-secondary/50 transition-colors text-left w-full"
            >
              <span className="text-4xl">{dailyWord.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-display font-extrabold text-text-secondary uppercase tracking-widest mb-0.5">
                  {t('home.wordOfDay')}
                </p>
                <p className="font-display font-extrabold text-lg text-white truncate">{t(dailyWord.i18nWord)}</p>
                <p className="text-sm text-text-secondary truncate">{t(dailyWord.i18nPhrase)}</p>
              </div>
              <span className="text-2xl opacity-40" aria-hidden="true">🔊</span>
            </button>
          )}
        </div>

        {/* Module cards — big, bold, colorful */}
        <section aria-labelledby="modules-heading">
          <h2 id="modules-heading" className="text-xs font-display font-extrabold text-text-secondary uppercase tracking-widest mb-4">
            {t('home.modules.talkBoard') && 'Modules'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {MODULE_CARDS.map((mod, i) => (
              <motion.button
                key={mod.to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileTap={{ scale: 0.96, y: 2 }}
                onClick={() => navigate(mod.to)}
                className="module-card flex flex-col items-center text-center gap-3 p-5 md:p-6 cursor-pointer"
                style={{ backgroundColor: mod.bg }}
              >
                <div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl"
                  style={{ backgroundColor: mod.dark }}
                >
                  <span className="drop-shadow-md">{mod.emoji}</span>
                </div>
                <div>
                  <p className="font-display font-extrabold text-sm md:text-base text-white leading-snug drop-shadow-sm">
                    {t(mod.nameKey)}
                  </p>
                  <p className="text-[11px] text-white/70 leading-tight mt-1 hidden sm:block">
                    {t(mod.descKey)}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

      </div>
    </AppLayout>
  );
}
