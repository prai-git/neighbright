import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/common/AppLayout';
import { Card, StarCounter, StreakBadge, ProgressBar } from '../components/common';
import { useTranslation } from '../data/i18n';
import { useProfile } from '../contexts/ProfileContext';
import db from '../db';
import en from '../data/i18n/en.json';

const MODULE_CARDS = [
  { emoji: '💬', nameKey: 'home.modules.talkBoard',  descKey: 'home.modules.talkBoardDesc', to: '/talk-board',      color: 'var(--color-primary)' },
  { emoji: '🔊', nameKey: 'home.modules.sounds',     descKey: 'home.modules.soundsDesc',    to: '/sound-explorer',  color: '#87CEEB' },
  { emoji: '🔤', nameKey: 'home.modules.words',      descKey: 'home.modules.wordsDesc',     to: '/word-builder',    color: 'var(--color-secondary)' },
  { emoji: '🎮', nameKey: 'home.modules.games',      descKey: 'home.modules.gamesDesc',     to: '/match-and-learn', color: '#DDA0DD' },
  { emoji: '🧩', nameKey: 'home.modules.puzzles',    descKey: 'home.modules.puzzlesDesc',   to: '/puzzles',         color: 'var(--color-accent)' },
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
      <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-8">

        {/* Greeting */}
        <div className="flex items-center gap-3">
          <span className="text-4xl">{profile?.avatarKey || '👤'}</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-text-primary">
              {t('home.greeting', { name: profile?.name || '' })}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <StarCounter count={stars} />
              <StreakBadge streak={streak} />
            </div>
          </div>
        </div>

        {/* Word of the Day */}
        {dailyWord && (
          <Card
            color="var(--color-accent)"
            padding="none"
            onClick={() => speakWord(dailyWord.word)}
            className="flex items-center gap-4 p-5 cursor-pointer"
          >
            <span className="text-5xl">{dailyWord.emoji}</span>
            <div className="flex-1">
              <p className="text-xs font-display font-semibold text-text-secondary uppercase tracking-wide">
                {t('home.wordOfDay')}
              </p>
              <p className="font-display font-extrabold text-2xl text-text-primary">{dailyWord.word}</p>
              <p className="text-sm text-text-secondary">{dailyWord.phrase}</p>
            </div>
            <span className="text-2xl" aria-hidden="true">🔊</span>
          </Card>
        )}

        {/* Module Grid */}
        <section aria-labelledby="modules-heading">
          <h2 id="modules-heading" className="sr-only">Learning Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULE_CARDS.map((mod) => (
              <Card
                key={mod.to}
                color={mod.color}
                padding="none"
                onClick={() => navigate(mod.to)}
                className="flex items-start gap-4 p-5"
              >
                <span className="text-4xl shrink-0">{mod.emoji}</span>
                <div>
                  <p className="font-display font-bold text-lg text-text-primary">{t(mod.nameKey)}</p>
                  <p className="text-sm text-text-secondary">{t(mod.descKey)}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Daily Goal */}
        <Card padding="md" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="font-display font-semibold text-text-primary">{t('home.dailyGoal')}</p>
            <span className="text-sm text-text-secondary">
              {Math.round(practicedSecs / 60)}/{goalMinutes} min
            </span>
          </div>
          <ProgressBar value={goalProgress} color="primary" size="md" animated />
        </Card>

      </div>
    </AppLayout>
  );
}

