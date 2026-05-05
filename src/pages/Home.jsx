import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '../components/common/AppLayout';
import { ProgressBar } from '../components/common';
import { useTranslation } from '../data/i18n';
import { useProfile } from '../contexts/ProfileContext';
import db from '../db';
import en from '../data/i18n/en.json';

const MODULE_CARDS = [
  { emoji: '💬', nameKey: 'home.modules.talkBoard',  descKey: 'home.modules.talkBoardDesc', to: '/talk-board',      bg: '#FF6B6B', light: '#FFF0F0' },
  { emoji: '🔊', nameKey: 'home.modules.sounds',     descKey: 'home.modules.soundsDesc',    to: '/sound-explorer',  bg: '#74B9FF', light: '#F0F7FF' },
  { emoji: '🔤', nameKey: 'home.modules.words',      descKey: 'home.modules.wordsDesc',     to: '/word-builder',    bg: '#FECA57', light: '#FFFBF0' },
  { emoji: '🎮', nameKey: 'home.modules.games',      descKey: 'home.modules.gamesDesc',     to: '/match-and-learn', bg: '#55E6C1', light: '#F0FFF9' },
  { emoji: '🧩', nameKey: 'home.modules.puzzles',    descKey: 'home.modules.puzzlesDesc',   to: '/puzzles',         bg: '#A29BFE', light: '#F5F3FF' },
];

const WORD_EMOJIS = {
  happy:'😊', sad:'😢', angry:'😠', scared:'😨', tired:'😴', hungry:'🍽️',
  thirsty:'💧', sick:'🤒', excited:'🎉', love:'❤️', hurt:'🤕', cold:'🥶',
  hot:'🥵', dog:'🐶', cat:'🐱', bird:'🐦', fish:'🐟', apple:'🍎',
  milk:'🥛', water:'💧', more:'👐', help:'🙏', stop:'✋', go:'🏃', yes:'👍',
};

function getDailyWord() {
  const vocabKeys = Object.keys(en.vocabulary || {});
  if (!vocabKeys.length) return null;
  const dayIndex = Math.floor(Date.now() / 86400000) % vocabKeys.length;
  const key = vocabKeys[dayIndex];
  return { key, ...en.vocabulary[key], emoji: WORD_EMOJIS[key] || '📝' };
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
      <div className="flex flex-col gap-8">

        {/* Page header — greeting + stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl shrink-0">
              {profile?.avatarKey || '👤'}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-display font-extrabold text-text-primary truncate">
                {t('home.greeting', { name: profile?.name || '' })}
              </h1>
              <p className="text-sm text-text-secondary">
                {streak > 0 && <span className="mr-3">🔥 {streak} {t('common.days')}</span>}
                <span>⭐ {stars}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Word of the Day */}
        {dailyWord && (
          <button
            onClick={() => speakWord(dailyWord.word)}
            className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white border border-border cursor-pointer hover:shadow-sm transition-shadow text-left w-full"
          >
            <span className="text-4xl">{dailyWord.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-display font-bold text-text-secondary uppercase tracking-widest mb-0.5">
                {t('home.wordOfDay')}
              </p>
              <p className="font-display font-extrabold text-xl text-text-primary truncate">{dailyWord.word}</p>
              <p className="text-sm text-text-secondary truncate">{dailyWord.phrase}</p>
            </div>
            <span className="text-2xl opacity-30" aria-hidden="true">🔊</span>
          </button>
        )}

        {/* Module badges — main navigation hub */}
        <section aria-labelledby="modules-heading">
          <h2 id="modules-heading" className="text-sm font-display font-bold text-text-secondary uppercase tracking-widest mb-4">
            {t('home.modules.talkBoard') && 'Modules'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {MODULE_CARDS.map((mod, i) => (
              <motion.button
                key={mod.to}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(mod.to)}
                className="flex flex-col items-center text-center gap-3 p-6 rounded-3xl cursor-pointer transition-shadow hover:shadow-lg active:shadow-sm"
                style={{ backgroundColor: mod.light }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
                  style={{ backgroundColor: mod.bg }}
                >
                  <span className="drop-shadow-sm">{mod.emoji}</span>
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-text-primary leading-snug">{t(mod.nameKey)}</p>
                  <p className="text-[11px] text-text-secondary leading-tight mt-1 hidden sm:block">{t(mod.descKey)}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Daily Goal */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-display font-bold text-sm text-text-primary">{t('home.dailyGoal')}</p>
            <span className="text-xs font-display font-semibold text-text-secondary">
              {Math.round(practicedSecs / 60)}/{goalMinutes} min
            </span>
          </div>
          <ProgressBar value={goalProgress} color="primary" size="sm" animated />
        </div>

      </div>
    </AppLayout>
  );
}
