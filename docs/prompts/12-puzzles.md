# Module 12 — Puzzles (Cognitive Development)

**Scope:** Build 15+ puzzle types across three developmental tiers. All procedurally generated or SVG-based — no raster images. Puzzle instructions translated; some puzzle content (rhyming, sentence building) is English-only in Phase 1.

**Prerequisite:** Modules 01–11 complete.

---

## 1. Puzzle Selection Screen

Route: `/puzzles` → `src/pages/Puzzles.jsx`

### Layout
- Three tier sections, each collapsible/expandable
- The child's profile tier is expanded by default; other tiers are collapsed with a lock icon if below their tier, or open if at/above
- Parent can override lock from dashboard settings
- Each tier shows its puzzle types as cards in a grid

### Tier Header
- Tier name + emoji: 🌱 Tier 1, 🌿 Tier 2, 🌳 Tier 3
- Translated name: `t('puzzles.tier1')` etc.
- Progress: "4 of 5 completed" badge

### Puzzle Cards
- `Card` with emoji icon, translated name, completion checkmark if done, tap to play

---

## 2. Puzzle Data

```javascript
// src/data/puzzles.js
export const puzzlesByTier = {
  1: [
    { id: 'shape-sorter', i18nKey: 'puzzles.shapeSorter', icon: '🔷', component: 'ShapeSorter' },
    { id: 'jigsaw-4', i18nKey: 'puzzles.jigsaw', icon: '🧩', component: 'Jigsaw', config: { pieces: 4 } },
    { id: 'color-match', i18nKey: 'puzzles.colorMatch', icon: '🎨', component: 'ColorMatch' },
    { id: 'size-order', i18nKey: 'puzzles.sizeOrder', icon: '📏', component: 'SizeOrder' },
    { id: 'peekaboo', i18nKey: 'puzzles.peekaboo', icon: '🙈', component: 'Peekaboo' },
  ],
  2: [
    { id: 'jigsaw-9', i18nKey: 'puzzles.jigsaw', icon: '🧩', component: 'Jigsaw', config: { pieces: 9 } },
    { id: 'pattern', i18nKey: 'puzzles.pattern', icon: '🔁', component: 'PatternCompletion' },
    { id: 'counting', i18nKey: 'puzzles.counting', icon: '🔢', component: 'Counting' },
    { id: 'letter-trace', i18nKey: 'puzzles.letterTrace', icon: '✍️', component: 'LetterTrace' },
    { id: 'shadow-match', i18nKey: 'puzzles.shadowMatch', icon: '🌑', component: 'ShadowMatch' },
    { id: 'rhyming', i18nKey: 'puzzles.rhyming', icon: '🎵', component: 'RhymingPairs' },
  ],
  3: [
    { id: 'jigsaw-16', i18nKey: 'puzzles.jigsaw', icon: '🧩', component: 'Jigsaw', config: { pieces: 16 } },
    { id: 'word-picture', i18nKey: 'puzzles.wordPicture', icon: '📝', component: 'WordPicture' },
    { id: 'sentence-build', i18nKey: 'puzzles.sentenceBuild', icon: '📖', component: 'SentenceBuilder' },
    { id: 'story-sequence', i18nKey: 'puzzles.storySequence', icon: '📚', component: 'StorySequence' },
    { id: 'beginning-sounds', i18nKey: 'puzzles.beginningSound', icon: '🔤', component: 'BeginningSound' },
    { id: 'analogies', i18nKey: 'puzzles.analogies', icon: '🧠', component: 'Analogies' },
    { id: 'maze', i18nKey: 'puzzles.maze', icon: '🏁', component: 'Maze' },
  ]
};
```

---

## 3. Puzzle Components (`src/components/puzzles/`)

### Tier 1 Puzzles

**ShapeSorter.jsx** — 3–5 shapes (circle, square, triangle, star, heart) at top, matching holes at bottom. Drag shape to its hole. Use SVG shapes. Correct placement: shape snaps in with satisfying animation + `speak(shape name)`.

**Jigsaw.jsx** — Configurable piece count (4, 9, 16). Draw a simple scene on a canvas (e.g., a house, sun, tree using basic shapes/emoji), divide into grid pieces, shuffle positions. Child taps a piece then taps a position (or drags). Pieces snap when placed correctly. Use `<canvas>` for rendering.

**ColorMatch.jsx** — Display 6–8 items in various colors. Audio: "Tap all the red ones!" Child taps items of the named color. Correct items highlight. Wrong items shake. Score: n correct out of total.

**SizeOrder.jsx** — 3–4 items (same emoji, different sizes) displayed randomly. Child taps them in order smallest → biggest (or vice versa). Tapped items move to an "ordered" row. Correct order: celebration.

**Peekaboo.jsx** — 3 items shown, a "curtain" drops (animated overlay), one item moves behind a hiding spot. Curtain lifts. Child taps where the item is hiding. Correct: item pops out with animation.

### Tier 2 Puzzles

**PatternCompletion.jsx** — A sequence of colored circles or shapes with a pattern (e.g., 🔴🔵🔴🔵❓). 3 answer choices. Child taps the correct next item. 8 rounds, increasing pattern complexity.

**Counting.jsx** — Display 1–10 items (random emoji). Audio: "How many apples?" Below: number buttons 1–10. Child taps the correct count. Correct: number bounces, star. 8 rounds.

**LetterTrace.jsx** — Display a large uppercase letter on a `<canvas>`. Show a dotted/gray path of the letter. Child traces with finger/mouse following the path. Use touch/pointer events to track path. Score based on accuracy (how close the trace follows the guide path). Letters A–Z in shuffled order.

**ShadowMatch.jsx** — 4 items on the left, 4 black silhouettes on the right. Child matches each item to its shadow by tapping item then shadow (or lines). All SVG-based — silhouettes are the same SVG with `fill: black`.

**RhymingPairs.jsx** — English only. 4–6 word cards. Match words that rhyme (cat/hat, dog/log, fish/dish). Tap two cards to attempt a match. Correct: both glow green + `speak` both words. 

### Tier 3 Puzzles

**WordPicture.jsx** — A word displayed in text. 3–4 emoji images below. Child taps the image that matches the word. Uses vocabulary data. 10 rounds. In active language.

**SentenceBuilder.jsx** — 3–5 word cards in shuffled order. Child taps them in sequence to form a correct sentence. E.g., "I" "want" "an" "apple" → child taps in order. Uses phrases from vocabulary data.

**StorySequence.jsx** — Reuses the sequencing mechanic from Module 09's SequenceBuilderGame but with more complex 5–6 card stories.

**BeginningSound.jsx** — English only. A letter shown (e.g., "B"). 4 word/emoji cards. Child taps all words that start with that letter. 8 rounds.

**Analogies.jsx** — "🐦 is to ☀️ as 🐟 is to ___?" Three answer choices. The analogy pairs are predefined (bird→sky, fish→water, car→road, etc.). 8 rounds.

**Maze.jsx** — Simple grid-based maze rendered on `<canvas>` or as a grid of cells. Character emoji at start, star at end. Child taps directional arrow buttons (⬆️⬇️⬅️➡️) or swipes to move. Directional vocabulary spoken on each move: `speak("up")`, `speak("left")`. 3 maze sizes by difficulty.

---

## 4. Puzzle Wrapper

```javascript
// src/components/puzzles/PuzzleWrapper.jsx
```

Wraps each puzzle with:
- Title bar with puzzle name and back button
- Timer (optional display)
- Completion screen with star, "Play Again" / "Next Puzzle" / "Back to Puzzles"
- Progress logging
- Confetti on completion

---

## 5. Progress Tracking

```javascript
{
  module: 'puzzles',
  activityType: 'shape-sorter' | 'jigsaw-4' | 'pattern' | etc.,
  activityData: { puzzleId: 'shape-sorter', tier: 1, accuracy: 0.85 },
  result: 'completed',
  durationSecs: elapsed
}
```

---

## Acceptance Criteria

- [ ] Puzzle selection screen shows all puzzles organized by tier
- [ ] Profile tier determines which tiers are expanded/unlocked by default
- [ ] Each Tier 1 puzzle plays correctly on mobile and desktop
- [ ] Each Tier 2 puzzle plays correctly, including canvas-based letter tracing
- [ ] Each Tier 3 puzzle plays correctly, including maze navigation
- [ ] Jigsaw works at all three piece counts (4, 9, 16)
- [ ] Drag/tap interactions work on touch devices
- [ ] Completion triggers confetti + star
- [ ] All progress records written to IndexedDB
- [ ] Translated instructions display correctly in all three languages
- [ ] English-only puzzles (rhyming, beginning sounds) show a language note if Hindi/French is active
- [ ] No puzzle crashes on edge cases or small screens
