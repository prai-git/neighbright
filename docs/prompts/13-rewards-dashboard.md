# Module 13 — Rewards & Parent Dashboard

**Scope:** Build the reward/motivation system (stars, streaks, stickers, avatar progression) and the comprehensive parent dashboard (progress charts, session notes, settings, PDF export).

**Prerequisite:** Modules 01–12 complete.

---

## 1. useProgress Hook

Centralize all progress reading/writing logic.

```javascript
// src/hooks/useProgress.js
```

**Interface:**
```javascript
const {
  addProgress,          // (record) → saves to IndexedDB
  getProgressByModule,  // (module, dateRange?) → filtered records
  getProgressByDate,    // (startDate, endDate) → all records in range
  getTodayProgress,     // () → today's records
  getTotalDuration,     // (module?, dateRange?) → sum of durationSecs
  getWordAccuracy,      // () → { wordId, attempts, correct, score }[]
  getSoundProgress,     // () → { soundId, levelsCompleted }[]
  getPuzzleCompletion,  // () → { puzzleId, completed, bestTime }[]
} = useProgress();
```

---

## 2. Reward System

### Star Logic

Stars are awarded automatically when the child completes an activity. Build a centralized `awardStar` function that:
1. Increments `rewards.totalStars` in IndexedDB
2. Checks for milestone stickers (10 stars, 50 stars, 100 stars, etc.)
3. If a new milestone is hit, adds the sticker key to `rewards.stickers` array
4. Triggers the `ConfettiEffect` + star bounce animation

Call `awardStar()` from every module's completion handler.

### Streak Logic

On each session:
1. Read `rewards.lastActive` from IndexedDB
2. If `lastActive` is yesterday → increment `rewards.currentStreak`
3. If `lastActive` is today → do nothing (already counted)
4. If `lastActive` is older than yesterday → reset `currentStreak` to 1
5. Update `rewards.longestStreak` if `currentStreak` exceeds it
6. Set `rewards.lastActive` to today

Run this check on app load (in `ProfileContext` or a dedicated `useRewards` hook).

### Sticker Collection

```javascript
// src/data/rewards.js
export const stickers = [
  { id: 'first-word', i18nKey: 'rewards.milestones.firstWord', emoji: '🎉', condition: (r) => r.totalStars >= 1 },
  { id: 'ten-words', i18nKey: 'rewards.milestones.tenWords', emoji: '📚', condition: (r) => r.totalStars >= 10 },
  { id: 'fifty-words', i18nKey: 'rewards.milestones.fiftyWords', emoji: '🏆', condition: (r) => r.totalStars >= 50 },
  { id: 'first-recording', i18nKey: 'rewards.milestones.firstRecording', emoji: '🎤', condition: 'manual' },
  { id: 'three-day', i18nKey: 'rewards.milestones.threeDay', emoji: '🔥', condition: (r) => r.currentStreak >= 3 },
  { id: 'seven-day', i18nKey: 'rewards.milestones.sevenDay', emoji: '⚡', condition: (r) => r.currentStreak >= 7 },
  { id: 'thirty-day', i18nKey: 'rewards.milestones.thirtyDay', emoji: '🌟', condition: (r) => r.currentStreak >= 30 },
  { id: 'puzzle-master', i18nKey: 'rewards.milestones.puzzleMaster', emoji: '🧩', condition: 'manual' },
  { id: 'sound-star', i18nKey: 'rewards.milestones.soundStar', emoji: '🔊', condition: 'manual' },
];
```

### Avatar Progression

- Avatar emoji gets visual "accessories" at milestones stored in `rewards.avatarLevel`:
  - Level 1 (default): base avatar
  - Level 2 (25 stars): add a small star badge overlay
  - Level 3 (50 stars): add a cape background element
  - Level 4 (100 stars): add a crown on top
  - Level 5 (200 stars): golden glow effect
- Implemented via layered rendering in the avatar display component

---

## 3. Reward Components (`src/components/rewards/`)

### StickerGallery.jsx
- Grid of all sticker slots: `grid grid-cols-3 md:grid-cols-4 gap-4`
- Unlocked stickers: full color emoji + name
- Locked stickers: grayed out with lock icon + "???" name
- Tapping an unlocked sticker shows a small celebration replay

### NewStickerModal.jsx
- Triggered when a new sticker is unlocked
- Full-screen overlay with the sticker emoji large + `t('rewards.newSticker')`
- Confetti + bouncing animation
- "Awesome!" dismiss button

### AvatarDisplay.jsx
- Renders the child's avatar emoji with level-appropriate accessories
- Used in: NavBar, SideNav, Home greeting, Profile screens

---

## 4. Parent Dashboard

Route: `/dashboard` → `src/pages/ParentDashboard.jsx`

Uses `AppLayout`. Organized as a tabbed or sectioned layout.

### Dashboard Sections

**4.1 Overview Tab**
- Summary cards in a row: Total Stars, Current Streak, Words Learned, Sounds Practiced, Puzzles Done, Total Practice Time
- Each card: large number + label + small trend arrow (up/down/flat compared to last week)
- Date range selector: This Week | This Month | All Time

**4.2 Activity Log Tab**
- Calendar heatmap showing practice days (similar to GitHub contribution graph)
- Each day: color intensity based on minutes practiced (0=gray, 1–5=light green, 5–15=medium, 15+=dark green)
- Tapping a day shows that day's activity list: module, activity type, duration, result
- Implementation: `<canvas>` or pure `<div>` grid with 7 columns (days) × weeks

**4.3 Word Accuracy Tab**
- Table/list of vocabulary words with accuracy scores
- Columns: Word (emoji + text), Attempts, Correct, Accuracy %, Trend
- Sortable by accuracy (show weakest words first by default)
- Color coding: <50% red, 50–80% yellow, >80% green
- Top: summary "X words mastered (>80%), Y words need practice (<50%)"

**4.4 Sound Progress Tab**
- Grid of all sounds with level progress indicators
- Each sound: phoneme symbol + 5 small dots (one per level, filled if completed, empty if not)
- Grouped by manner of articulation
- Tapping a sound shows detailed history of practice attempts

**4.5 Puzzle Progress Tab**
- Three tier sections, each showing puzzle cards with checkmarks for completed
- For completed puzzles: best time and number of attempts shown

**4.6 Session Notes Tab**
- Chronological list of parent notes
- "Add Note" button opens an `Input` (multiline) modal
- Each note shows: text, timestamp, edit/delete buttons
- Save to IndexedDB `sessionNotes` table
- Notes display with relative timestamps ("2 hours ago", "Yesterday", "May 1")

**4.7 Settings Tab**
- **Language:** Current language display + language switcher
- **Voice:** Voice selector dropdown (from `useSpeech().voices`), rate slider (0.5–1.5), pitch slider (0.5–1.5)
- **Daily Goal:** Number input for target minutes per day (default: 15)
- **Modules:** Toggle switches to enable/disable each module (e.g., hide Sound Explorer if working with an SLP who covers that in sessions)
- **Tier Override:** Dropdown to change the child's developmental tier
- **Custom Vocabulary:** List of custom cards with edit/delete buttons + "Add Card" button (opens `CustomCardForm` from Module 06)
- **Profile:** Edit child's name and avatar
- **Data:** "Export Progress Report (PDF)" button + "Reset All Data" button (with confirmation modal)

---

## 5. PDF Export

```javascript
// src/utils/export-pdf.js
import { jsPDF } from 'jspdf';
```

Generate a 1–2 page PDF containing:
- Header: "NeighBright Progress Report" + child's name + date range
- Summary stats: stars, streak, words learned, sounds practiced, puzzles completed, total time
- Word accuracy top/bottom 10 list
- Sound progress summary (which sounds at which levels)
- Session notes from the date range
- Footer: "Generated by NeighBright — neighbright.yourdomain.com"

The PDF is generated entirely client-side and triggers a browser download.

---

## Acceptance Criteria

- [ ] Stars increment correctly across all modules
- [ ] Streak tracks daily practice correctly (yesterday = increment, gap = reset)
- [ ] Sticker gallery shows locked/unlocked stickers
- [ ] New sticker modal triggers with confetti when a milestone is reached
- [ ] Avatar accessories display at correct star thresholds
- [ ] Dashboard Overview shows correct summary numbers
- [ ] Activity log heatmap renders with correct colors per day
- [ ] Word accuracy table sorts and color-codes correctly
- [ ] Sound progress shows per-sound level completion
- [ ] Session notes CRUD works (add, edit, delete, display)
- [ ] All settings save to IndexedDB and take effect immediately
- [ ] Voice settings (rate, pitch, voice selection) work with `useSpeech`
- [ ] Module toggles hide/show modules on the Home screen
- [ ] PDF export generates a downloadable file with correct data
- [ ] "Reset All Data" clears all IndexedDB tables (with confirmation)
- [ ] All dashboard text uses `t()` for translation
- [ ] Dashboard is responsive and usable on phone screens
