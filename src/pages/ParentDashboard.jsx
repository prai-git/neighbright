import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '../components/common/AppLayout';
import { useTranslation } from '../data/i18n';
import { useProfile } from '../contexts/ProfileContext';
import db from '../db';
import { soundGroups } from '../data/sounds';
import { puzzlesByTier } from '../data/puzzles';
import { exportProgressPdf } from '../utils/export-pdf';

// ── Helpers ──────────────────────────────────────────────────────────

function relativeTime(dateStr) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 30) return `${diffDay} days ago`;
  return new Date(dateStr).toLocaleDateString();
}

function formatDuration(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function getDateRangeStart(range) {
  const now = new Date();
  if (range === 'week') {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (range === 'month') {
    const d = new Date(now);
    d.setDate(d.getDate() - 30);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  return null; // all time
}

function filterByRange(records, range) {
  const start = getDateRangeStart(range);
  if (!start) return records;
  return records.filter(r => new Date(r.createdAt) >= start);
}

const MODULE_EMOJI = { words: '📚', sounds: '🔊', puzzles: '🧩', talkboard: '💬', games: '🎮', alphabets: '🔠', numbers: '🔢' };

const TABS = [
  { id: 'overview', label: 'Overview', emoji: '📊' },
  { id: 'activity', label: 'Activity Log', emoji: '📅' },
  { id: 'words', label: 'Words', emoji: '📚' },
  { id: 'sounds', label: 'Sounds', emoji: '🔊' },
  { id: 'puzzles', label: 'Puzzles', emoji: '🧩' },
  { id: 'notes', label: 'Notes', emoji: '📝' },
  { id: 'settings', label: 'Settings', emoji: '⚙️' },
];

// ── Tab bar ──────────────────────────────────────────────────────────

function TabBar({ active, onChange, t }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-display font-extrabold transition-all cursor-pointer whitespace-nowrap
            ${active === tab.id
              ? 'bg-[#58CC02] text-white shadow-[0_4px_0_rgba(0,0,0,0.2)]'
              : 'bg-[#1B2B32] text-white/70 border border-[#2B3D45] hover:bg-[#243840]'
            }`}
        >
          {tab.emoji} {tab.label}
        </button>
      ))}
    </div>
  );
}

// ── Overview Tab ─────────────────────────────────────────────────────

function OverviewTab({ progress, rewards, range, setRange, t }) {
  const filtered = useMemo(() => filterByRange(progress, range), [progress, range]);

  const stats = useMemo(() => {
    const wordsSet = new Set();
    const soundsSet = new Set();
    const puzzlesSet = new Set();
    let totalSecs = 0;

    filtered.forEach(r => {
      totalSecs += r.durationSecs || 0;
      if (r.module === 'words' && r.result === 'correct') {
        const word = typeof r.activityData === 'string' ? r.activityData : r.activityData?.word;
        if (word) wordsSet.add(word);
      }
      if (r.module === 'sounds') {
        const sound = typeof r.activityData === 'string' ? r.activityData : r.activityData?.sound;
        if (sound) soundsSet.add(sound);
      }
      if (r.module === 'puzzles' && r.result === 'completed') {
        const pid = typeof r.activityData === 'string' ? r.activityData : r.activityData?.puzzleId;
        if (pid) puzzlesSet.add(pid);
      }
    });

    return {
      stars: rewards?.totalStars || 0,
      streak: rewards?.currentStreak || 0,
      words: wordsSet.size,
      sounds: soundsSet.size,
      puzzles: puzzlesSet.size,
      totalTime: totalSecs,
    };
  }, [filtered, rewards]);

  const cards = [
    { emoji: '⭐', value: stats.stars, labelKey: 'dashboard.progress' },
    { emoji: '🔥', value: stats.streak, labelKey: 'dashboard.activityLog' },
    { emoji: '📚', value: stats.words, labelKey: 'dashboard.wordsLearned' },
    { emoji: '🔊', value: stats.sounds, labelKey: 'dashboard.soundsPracticed' },
    { emoji: '🧩', value: stats.puzzles, labelKey: 'dashboard.puzzlesDone' },
    { emoji: '⏱️', value: formatDuration(stats.totalTime), labelKey: 'dashboard.totalTime' },
  ];

  const ranges = [
    { id: 'week', labelKey: 'dashboard.thisWeek' },
    { id: 'month', labelKey: 'dashboard.thisMonth' },
    { id: 'all', labelKey: 'dashboard.allTime' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Range pills */}
      <div className="flex gap-2">
        {ranges.map(r => (
          <button
            key={r.id}
            onClick={() => setRange(r.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-display font-extrabold transition-all cursor-pointer
              ${range === r.id
                ? 'bg-[#1CB0F6] text-white shadow-[0_3px_0_rgba(0,0,0,0.2)]'
                : 'bg-[#1B2B32] text-white/60 border border-[#2B3D45] hover:bg-[#243840]'
              }`}
          >
            {t(r.labelKey)}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-[#1B2B32] border border-[#2B3D45] rounded-2xl p-4 flex flex-col items-center gap-1 shadow-[0_4px_0_rgba(0,0,0,0.2)]"
          >
            <span className="text-3xl">{card.emoji}</span>
            <span className="text-2xl font-display font-extrabold text-white">{card.value}</span>
            <span className="text-xs text-white/60 text-center">{t(card.labelKey)}</span>
          </motion.div>
        ))}
      </div>

      {progress.length === 0 && (
        <p className="text-center text-white/50 py-8 text-sm">{t('dashboard.noActivity')}</p>
      )}
    </div>
  );
}

// ── Activity Log Tab ─────────────────────────────────────────────────

function ActivityTab({ progress }) {
  // Build heatmap for last 16 weeks (112 days)
  const { heatmap, monthLabels, recentActivities } = useMemo(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const dayMs = 86400000;
    const totalDays = 112; // 16 weeks

    // Build day map: dateKey -> total minutes
    const dayMap = {};
    progress.forEach(r => {
      const d = new Date(r.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      dayMap[key] = (dayMap[key] || 0) + (r.durationSecs || 0) / 60;
    });

    // Generate grid cells (columns = weeks, rows = days of week)
    const cells = [];
    const months = [];
    let lastMonth = -1;

    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today.getTime() - i * dayMs);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const mins = dayMap[key] || 0;
      const dayOfWeek = d.getDay(); // 0=Sun
      const weekIndex = Math.floor((totalDays - 1 - i) / 7);

      if (d.getMonth() !== lastMonth) {
        months.push({ weekIndex, label: d.toLocaleString('default', { month: 'short' }) });
        lastMonth = d.getMonth();
      }

      cells.push({ weekIndex, dayOfWeek, mins, date: d });
    }

    // Recent 20 activities
    const recent = [...progress]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20);

    return { heatmap: cells, monthLabels: months, recentActivities: recent };
  }, [progress]);

  function heatColor(mins) {
    if (mins <= 0) return 'bg-[#1B2B32]';
    if (mins <= 5) return 'bg-green-900/40';
    if (mins <= 15) return 'bg-green-600/40';
    return 'bg-green-400/40';
  }

  // Group cells into a 7-row × N-column grid
  const numWeeks = Math.ceil(heatmap.length / 7);

  return (
    <div className="flex flex-col gap-5">
      {/* Heatmap */}
      <div className="bg-[#1B2B32] border border-[#2B3D45] rounded-2xl p-4 overflow-x-auto">
        {/* Month labels */}
        <div className="flex gap-0 mb-1 ml-6" style={{ minWidth: numWeeks * 14 }}>
          {monthLabels.map((m, i) => (
            <span
              key={i}
              className="text-[10px] text-white/40 absolute"
              style={{ left: m.weekIndex * 14 + 24 }}
            >
              {m.label}
            </span>
          ))}
        </div>
        <div className="relative pt-4">
          {/* Day labels */}
          <div className="absolute left-0 top-4 flex flex-col gap-[2px]">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="w-5 h-[12px] text-[9px] text-white/30 flex items-center">{i % 2 === 1 ? d : ''}</div>
            ))}
          </div>
          {/* Grid */}
          <div className="ml-6 flex gap-[2px]" style={{ minWidth: numWeeks * 14 }}>
            {Array.from({ length: numWeeks }, (_, wi) => (
              <div key={wi} className="flex flex-col gap-[2px]">
                {Array.from({ length: 7 }, (_, di) => {
                  const cell = heatmap.find(c => c.weekIndex === wi && c.dayOfWeek === di);
                  return (
                    <div
                      key={di}
                      className={`w-[12px] h-[12px] rounded-sm ${cell ? heatColor(cell.mins) : 'bg-transparent'}`}
                      title={cell ? `${cell.date.toLocaleDateString()}: ${Math.round(cell.mins)}min` : ''}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activities */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-display font-extrabold text-white/70">Recent Activity</h3>
        {recentActivities.length === 0 && (
          <p className="text-white/40 text-sm py-4 text-center">No activity recorded yet.</p>
        )}
        {recentActivities.map((r, i) => (
          <motion.div
            key={r.id || i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02 }}
            className="bg-[#1B2B32] border border-[#2B3D45] rounded-xl px-3 py-2 flex items-center gap-3 text-sm"
          >
            <span className="text-lg">{MODULE_EMOJI[r.module] || '📋'}</span>
            <div className="flex-1 min-w-0">
              <span className="text-white font-semibold capitalize">{r.module}</span>
              <span className="text-white/40 mx-1.5">·</span>
              <span className="text-white/60">{r.activityType || 'practice'}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {r.durationSecs > 0 && (
                <span className="text-white/40 text-xs">{formatDuration(r.durationSecs)}</span>
              )}
              {r.result && (
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
                  r.result === 'correct' || r.result === 'completed' ? 'bg-[#58CC02]/20 text-[#58CC02]' :
                  r.result === 'incorrect' ? 'bg-[#FF4B4B]/20 text-[#FF4B4B]' :
                  'bg-white/10 text-white/50'
                }`}>
                  {r.result}
                </span>
              )}
              <span className="text-white/30 text-xs whitespace-nowrap">{relativeTime(r.createdAt)}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Word Accuracy Tab ────────────────────────────────────────────────

function WordsTab({ progress, t }) {
  const wordStats = useMemo(() => {
    const map = {};
    progress.forEach(r => {
      if (r.module !== 'words') return;
      if (!r.activityType || !['listen-point', 'say-it', 'learn'].includes(r.activityType)) return;
      const word = typeof r.activityData === 'string' ? r.activityData : r.activityData?.word;
      if (!word) return;
      if (!map[word]) map[word] = { word, correct: 0, total: 0, emoji: r.activityData?.emoji || '' };
      map[word].total++;
      if (r.result === 'correct') map[word].correct++;
    });
    return Object.values(map).sort((a, b) => {
      const accA = a.total > 0 ? a.correct / a.total : 0;
      const accB = b.total > 0 ? b.correct / b.total : 0;
      return accA - accB;
    });
  }, [progress]);

  const summary = useMemo(() => {
    let mastered = 0, learning = 0, needPractice = 0;
    wordStats.forEach(w => {
      const acc = w.total > 0 ? (w.correct / w.total) * 100 : 0;
      if (acc > 80) mastered++;
      else if (acc >= 50) learning++;
      else needPractice++;
    });
    return { mastered, learning, needPractice };
  }, [wordStats]);

  return (
    <div className="flex flex-col gap-4">
      {/* Summary bar */}
      <div className="flex gap-3 flex-wrap">
        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#58CC02]/20 text-[#58CC02]">
          {summary.mastered} mastered
        </span>
        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#FF9600]/20 text-[#FF9600]">
          {summary.learning} learning
        </span>
        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#FF4B4B]/20 text-[#FF4B4B]">
          {summary.needPractice} need practice
        </span>
      </div>

      {wordStats.length === 0 && (
        <p className="text-white/40 text-sm py-8 text-center">{t('dashboard.noActivity')}</p>
      )}

      {/* Word list */}
      <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
        {wordStats.map((w, i) => {
          const acc = w.total > 0 ? Math.round((w.correct / w.total) * 100) : 0;
          const barColor = acc < 50 ? '#FF4B4B' : acc < 80 ? '#FF9600' : '#58CC02';
          return (
            <div
              key={w.word}
              className="bg-[#1B2B32] border border-[#2B3D45] rounded-xl px-3 py-2.5 flex items-center gap-3"
            >
              <span className="text-lg w-8 text-center">{w.emoji || '📝'}</span>
              <span className="text-white font-semibold flex-1 min-w-0 truncate capitalize">{w.word}</span>
              <span className="text-white/40 text-xs flex-shrink-0">{w.total} tries</span>
              <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden flex-shrink-0">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${acc}%`, backgroundColor: barColor }}
                />
              </div>
              <span className="text-xs font-bold w-10 text-right flex-shrink-0" style={{ color: barColor }}>
                {acc}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Sound Progress Tab ───────────────────────────────────────────────

function SoundsTab({ progress, t }) {
  const soundLevels = useMemo(() => {
    const map = {};
    progress.forEach(r => {
      if (r.module !== 'sounds') return;
      const data = typeof r.activityData === 'string' ? { sound: r.activityData } : r.activityData;
      const sound = data?.sound || data?.soundId;
      const level = data?.level || 1;
      if (!sound) return;
      if (!map[sound]) map[sound] = new Set();
      if (r.result === 'correct' || r.result === 'completed') {
        map[sound].add(level);
      }
    });
    return map;
  }, [progress]);

  return (
    <div className="flex flex-col gap-5">
      {soundGroups.map(group => (
        <div key={group.id}>
          <h3 className="text-sm font-display font-extrabold text-white/70 mb-2 capitalize">{group.id}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {group.sounds.map(s => {
              const completed = soundLevels[s.id] || new Set();
              return (
                <div
                  key={s.id}
                  className="bg-[#1B2B32] border border-[#2B3D45] rounded-xl px-3 py-2 flex items-center gap-2"
                >
                  <span className="text-white font-display font-extrabold text-sm w-8">{s.symbol}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(lv => (
                      <div
                        key={lv}
                        className={`w-2.5 h-2.5 rounded-full ${
                          completed.has(lv) ? 'bg-[#58CC02]' : 'bg-white/15'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {Object.keys(soundLevels).length === 0 && (
        <p className="text-white/40 text-sm py-8 text-center">{t('dashboard.noActivity')}</p>
      )}
    </div>
  );
}

// ── Puzzle Progress Tab ──────────────────────────────────────────────

function PuzzlesTab({ progress, t }) {
  const completedPuzzles = useMemo(() => {
    const set = new Set();
    progress.forEach(r => {
      if (r.module !== 'puzzles') return;
      if (r.result !== 'completed') return;
      const pid = typeof r.activityData === 'string' ? r.activityData : r.activityData?.puzzleId;
      if (pid) set.add(pid);
    });
    return set;
  }, [progress]);

  const tiers = [
    { tier: 1, emoji: '🌱', label: 'Tier 1' },
    { tier: 2, emoji: '🌿', label: 'Tier 2' },
    { tier: 3, emoji: '🌳', label: 'Tier 3' },
  ];

  return (
    <div className="flex flex-col gap-5">
      {tiers.map(({ tier, emoji, label }) => {
        const puzzles = puzzlesByTier[tier] || [];
        return (
          <div key={tier}>
            <h3 className="text-sm font-display font-extrabold text-white/70 mb-2">
              {emoji} {label}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {puzzles.map(p => {
                const done = completedPuzzles.has(p.id);
                return (
                  <div
                    key={p.id}
                    className={`bg-[#1B2B32] border rounded-xl px-3 py-2.5 flex items-center gap-2 ${
                      done ? 'border-[#58CC02]/40' : 'border-[#2B3D45]'
                    }`}
                  >
                    <span className="text-lg">{p.icon}</span>
                    <span className="text-white text-sm flex-1 truncate">{p.id.replace(/-/g, ' ')}</span>
                    {done && <span className="text-[#58CC02] text-sm">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {completedPuzzles.size === 0 && (
        <p className="text-white/40 text-sm py-4 text-center">{t('dashboard.noActivity')}</p>
      )}
    </div>
  );
}

// ── Session Notes Tab ────────────────────────────────────────────────

function NotesTab({ t }) {
  const [notes, setNotes] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadNotes = useCallback(async () => {
    const all = await db.sessionNotes.toArray();
    setNotes(all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }, []);

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async () => {
    if (!newNote.trim()) return;
    const now = new Date().toISOString();
    await db.sessionNotes.add({ noteText: newNote.trim(), createdAt: now, updatedAt: now });
    setNewNote('');
    setShowAdd(false);
    loadNotes();
  };

  const handleEdit = async (id) => {
    if (!editText.trim()) return;
    await db.sessionNotes.update(id, { noteText: editText.trim(), updatedAt: new Date().toISOString() });
    setEditingId(null);
    setEditText('');
    loadNotes();
  };

  const handleDelete = async (id) => {
    await db.sessionNotes.delete(id);
    setDeleteConfirm(null);
    loadNotes();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Add button */}
      {!showAdd ? (
        <button
          onClick={() => setShowAdd(true)}
          className="self-start px-4 py-2 rounded-xl bg-[#FF9600] text-white font-display font-extrabold text-sm shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] transition-all cursor-pointer"
        >
          + {t('dashboard.addNote')}
        </button>
      ) : (
        <div className="bg-[#1B2B32] border border-[#2B3D45] rounded-2xl p-4 flex flex-col gap-3">
          <textarea
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            placeholder={t('dashboard.notePlaceholder')}
            rows={3}
            className="w-full bg-[#131F24] border border-[#2B3D45] rounded-xl px-3 py-2 text-white text-sm placeholder:text-white/30 resize-none focus:outline-none focus:border-[#1CB0F6]"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="px-4 py-2 rounded-xl bg-[#58CC02] text-white font-display font-extrabold text-sm shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] cursor-pointer"
            >
              {t('common.save')}
            </button>
            <button
              onClick={() => { setShowAdd(false); setNewNote(''); }}
              className="px-4 py-2 rounded-xl bg-white/10 text-white font-display font-extrabold text-sm cursor-pointer"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Notes list */}
      {notes.length === 0 && (
        <p className="text-white/40 text-sm py-8 text-center">No session notes yet.</p>
      )}

      <div className="flex flex-col gap-2">
        {notes.map(note => (
          <div key={note.id} className="bg-[#1B2B32] border border-[#2B3D45] rounded-xl px-4 py-3">
            {editingId === note.id ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  rows={3}
                  className="w-full bg-[#131F24] border border-[#2B3D45] rounded-xl px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-[#1CB0F6]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(note.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#58CC02] text-white text-xs font-bold cursor-pointer"
                  >
                    {t('common.save')}
                  </button>
                  <button
                    onClick={() => { setEditingId(null); setEditText(''); }}
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-bold cursor-pointer"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-white text-sm whitespace-pre-wrap">{note.noteText}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-white/30 text-xs">{relativeTime(note.createdAt)}</span>
                  <div className="flex gap-2">
                    {deleteConfirm === note.id ? (
                      <>
                        <span className="text-[#FF4B4B] text-xs mr-1">Delete?</span>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="px-2 py-1 rounded-lg bg-[#FF4B4B] text-white text-xs font-bold cursor-pointer"
                        >
                          {t('common.confirm')}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 rounded-lg bg-white/10 text-white text-xs font-bold cursor-pointer"
                        >
                          {t('common.cancel')}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditingId(note.id); setEditText(note.noteText); }}
                          className="px-2 py-1 rounded-lg bg-white/10 text-white/60 text-xs font-bold hover:bg-white/15 cursor-pointer"
                        >
                          {t('common.edit')}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(note.id)}
                          className="px-2 py-1 rounded-lg bg-white/10 text-[#FF4B4B]/70 text-xs font-bold hover:bg-[#FF4B4B]/10 cursor-pointer"
                        >
                          {t('common.delete')}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Settings Tab ─────────────────────────────────────────────────────

function SettingsTab({ profile, saveProfile, t }) {
  const [settings, setSettings] = useState({
    voiceRate: 1.0,
    voicePitch: 1.0,
    dailyGoalMinutes: 15,
  });
  const [profileName, setProfileName] = useState(profile?.name || '');
  const [profileTier, setProfileTier] = useState(profile?.tier || 1);
  const [saved, setSaved] = useState('');
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    db.settings.toCollection().first().then(s => {
      if (s) {
        setSettings({
          voiceRate: s.voiceRate ?? 1.0,
          voicePitch: s.voicePitch ?? 1.0,
          dailyGoalMinutes: s.dailyGoalMinutes ?? 15,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setProfileName(profile?.name || '');
    setProfileTier(profile?.tier || 1);
  }, [profile]);

  const saveSettings = async (partial) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    const existing = await db.settings.toCollection().first();
    if (existing) {
      await db.settings.update(existing.id, updated);
    } else {
      await db.settings.add(updated);
    }
    flash('Voice');
  };

  const saveGoal = async (val) => {
    const mins = Math.max(5, Math.min(60, Number(val) || 15));
    const updated = { ...settings, dailyGoalMinutes: mins };
    setSettings(updated);
    const existing = await db.settings.toCollection().first();
    if (existing) {
      await db.settings.update(existing.id, { dailyGoalMinutes: mins });
    } else {
      await db.settings.add(updated);
    }
    flash('Goal');
  };

  const saveProfileData = async () => {
    if (!profileName.trim()) return;
    await saveProfile({ name: profileName.trim(), tier: profileTier });
    flash('Profile');
  };

  const flash = (section) => {
    setSaved(section);
    setTimeout(() => setSaved(''), 1500);
  };

  const handleExportPdf = async () => {
    const rewards = await db.rewards.toCollection().first() || {};
    const progressRecords = await db.progress.toArray();
    const notes = await db.sessionNotes.orderBy('createdAt').reverse().toArray();
    await exportProgressPdf(profile || { name: 'Child', tier: 1 }, rewards, progressRecords, notes);
  };

  const handleReset = async () => {
    await Promise.all([
      db.progress.clear(),
      db.rewards.clear(),
      db.sessionNotes.clear(),
      db.customVocabulary.clear(),
      db.settings.clear(),
    ]);
    setShowReset(false);
    window.location.reload();
  };

  const sliderClass = "w-full h-2 rounded-full appearance-none cursor-pointer accent-[#1CB0F6] bg-white/15";

  return (
    <div className="flex flex-col gap-6">
      {/* Voice Settings */}
      <section className="bg-[#1B2B32] border border-[#2B3D45] rounded-2xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-display font-extrabold text-white">🔊 {t('dashboard.voice')}</h3>
          {saved === 'Voice' && <span className="text-xs text-[#58CC02] font-bold">Saved!</span>}
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-white/60">{t('dashboard.voiceRate')}</label>
            <span className="text-xs text-white/80 font-mono">{settings.voiceRate.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={settings.voiceRate}
            onChange={e => saveSettings({ voiceRate: parseFloat(e.target.value) })}
            className={sliderClass}
          />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs text-white/60">{t('dashboard.voicePitch')}</label>
            <span className="text-xs text-white/80 font-mono">{settings.voicePitch.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={settings.voicePitch}
            onChange={e => saveSettings({ voicePitch: parseFloat(e.target.value) })}
            className={sliderClass}
          />
        </div>
      </section>

      {/* Daily Goal */}
      <section className="bg-[#1B2B32] border border-[#2B3D45] rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-display font-extrabold text-white">🎯 {t('dashboard.dailyGoal')}</h3>
          {saved === 'Goal' && <span className="text-xs text-[#58CC02] font-bold">Saved!</span>}
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="5"
            max="60"
            step="5"
            value={settings.dailyGoalMinutes}
            onChange={e => saveGoal(e.target.value)}
            className="w-20 bg-[#131F24] border border-[#2B3D45] rounded-xl px-3 py-2 text-white text-center font-display font-extrabold focus:outline-none focus:border-[#1CB0F6]"
          />
          <span className="text-white/50 text-sm">{t('dashboard.minutes')}</span>
        </div>
      </section>

      {/* Profile */}
      <section className="bg-[#1B2B32] border border-[#2B3D45] rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-display font-extrabold text-white">👤 {t('dashboard.profile')}</h3>
          {saved === 'Profile' && <span className="text-xs text-[#58CC02] font-bold">Saved!</span>}
        </div>
        <div>
          <label className="text-xs text-white/60 mb-1 block">Name</label>
          <input
            type="text"
            value={profileName}
            onChange={e => setProfileName(e.target.value)}
            className="w-full bg-[#131F24] border border-[#2B3D45] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#1CB0F6]"
          />
        </div>
        <div>
          <label className="text-xs text-white/60 mb-1 block">Tier</label>
          <div className="flex gap-2">
            {[1, 2, 3].map(tier => (
              <button
                key={tier}
                onClick={() => setProfileTier(tier)}
                className={`flex-1 px-3 py-2 rounded-xl text-sm font-display font-extrabold transition-all cursor-pointer
                  ${profileTier === tier
                    ? 'bg-[#1CB0F6] text-white shadow-[0_3px_0_rgba(0,0,0,0.2)]'
                    : 'bg-[#131F24] border border-[#2B3D45] text-white/60 hover:bg-[#1B2B32]'
                  }`}
              >
                {tier === 1 ? '🌱' : tier === 2 ? '🌿' : '🌳'} Tier {tier}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={saveProfileData}
          className="self-start px-4 py-2 rounded-xl bg-[#58CC02] text-white font-display font-extrabold text-sm shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] cursor-pointer"
        >
          {t('common.save')} {t('dashboard.profile')}
        </button>
      </section>

      {/* Data Management */}
      <section className="bg-[#1B2B32] border border-[#2B3D45] rounded-2xl p-4 flex flex-col gap-3">
        <h3 className="text-sm font-display font-extrabold text-white">📦 Data Management</h3>

        <button
          onClick={handleExportPdf}
          className="w-full px-4 py-3 rounded-xl bg-[#1CB0F6] text-white font-display font-extrabold text-sm shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] cursor-pointer text-left"
        >
          📄 {t('dashboard.exportPdf')}
          <span className="block text-xs font-normal text-white/70 mt-0.5">{t('dashboard.exportPdfDesc')}</span>
        </button>

        {!showReset ? (
          <button
            onClick={() => setShowReset(true)}
            className="w-full px-4 py-3 rounded-xl bg-[#FF4B4B]/15 border border-[#FF4B4B]/30 text-[#FF4B4B] font-display font-extrabold text-sm cursor-pointer text-left hover:bg-[#FF4B4B]/20 transition-colors"
          >
            🗑️ Reset All Data
            <span className="block text-xs font-normal text-[#FF4B4B]/60 mt-0.5">This will erase all progress and settings.</span>
          </button>
        ) : (
          <div className="bg-[#FF4B4B]/10 border border-[#FF4B4B]/30 rounded-xl p-4 flex flex-col gap-3">
            <p className="text-[#FF4B4B] text-sm font-bold">Are you sure? This cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-[#FF4B4B] text-white font-display font-extrabold text-sm shadow-[0_3px_0_rgba(0,0,0,0.2)] cursor-pointer"
              >
                {t('common.confirm')} Reset
              </button>
              <button
                onClick={() => setShowReset(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white font-display font-extrabold text-sm cursor-pointer"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────

export default function ParentDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, saveProfile } = useProfile();

  const [tab, setTab] = useState('overview');
  const [progress, setProgress] = useState([]);
  const [rewards, setRewards] = useState(null);
  const [range, setRange] = useState('all');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const [prog, rew] = await Promise.all([
        db.progress.toArray(),
        db.rewards.toCollection().first(),
      ]);
      setProgress(prog || []);
      setRewards(rew || null);
      setLoaded(true);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload progress when switching to certain tabs
  const handleTabChange = useCallback(async (newTab) => {
    setTab(newTab);
    if (['overview', 'activity', 'words', 'sounds', 'puzzles'].includes(newTab)) {
      const prog = await db.progress.toArray();
      setProgress(prog || []);
    }
  }, []);

  return (
    <AppLayout bgTheme="default">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-display font-extrabold text-white">
            ⚙️ {t('dashboard.title')}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white/10 border-2 border-white/20 text-sm font-display font-extrabold text-white hover:bg-white/15 transition-colors cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            ← {t('common.back')}
          </button>
        </div>

        {/* Tab bar */}
        <TabBar active={tab} onChange={handleTabChange} t={t} />

        {/* Tab content */}
        {!loaded ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-white/40 text-sm">{t('common.loading')}</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {tab === 'overview' && (
                <OverviewTab progress={progress} rewards={rewards} range={range} setRange={setRange} t={t} />
              )}
              {tab === 'activity' && (
                <ActivityTab progress={progress} />
              )}
              {tab === 'words' && (
                <WordsTab progress={progress} t={t} />
              )}
              {tab === 'sounds' && (
                <SoundsTab progress={progress} t={t} />
              )}
              {tab === 'puzzles' && (
                <PuzzlesTab progress={progress} t={t} />
              )}
              {tab === 'notes' && (
                <NotesTab t={t} />
              )}
              {tab === 'settings' && (
                <SettingsTab profile={profile} saveProfile={saveProfile} t={t} />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </AppLayout>
  );
}
