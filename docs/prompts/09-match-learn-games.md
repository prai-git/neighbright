# Module 09 — Match & Learn (Receptive Language Games)

**Scope:** Build 6 interactive games that develop receptive language skills. All instructions translated. Uses vocabulary data from Module 08.

**Prerequisite:** Modules 01–08 complete.

---

## 1. Game Selection Screen

Route: `/match-and-learn` → `src/pages/MatchAndLearn.jsx`

Grid of 6 game cards: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`

Each card: emoji icon, translated name, 1-line description, difficulty selector (Easy/Medium/Hard), "Play" button.

| Game | Emoji | i18n Key |
|---|---|---|
| Picture Match | 🃏 | `games.pictureMatch` |
| Category Sorting | 📦 | `games.categorySorting` |
| Follow Directions | 👂 | `games.followDirections` |
| What's Missing? | 🔍 | `games.whatsMissing` |
| Odd One Out | 🤔 | `games.oddOneOut` |
| Sequence Builder | 📋 | `games.sequenceBuilder` |

---

## 2. Game Components (`src/components/games/`)

### PictureMatchGame.jsx

**Mechanic:** Classic memory card flip game. Find matching emoji pairs.

- **Grid sizes by difficulty:** Easy = 2×2 (4 cards, 2 pairs), Medium = 3×4 (12 cards, 6 pairs), Hard = 4×4 (16 cards, 8 pairs)
- Cards face-down showing a `?` or NeighBright logo. Tap to flip.
- Two cards flipped at a time. If match: both stay face-up, green glow, `speak(t(word.i18nWord))`. If no match: both flip back after 1s.
- Counter: `t('games.pairsFound', { found, total })`
- On completion: confetti + star
- Cards use `EmojiCard` with a flip animation (Framer Motion rotateY 0→180°)

### CategorySortingGame.jsx

**Mechanic:** Drag items into the correct category bucket.

- Two category buckets at bottom (e.g., "Animals" and "Food") — large labeled drop zones
- 6–10 `EmojiCard` items scattered above
- **Touch drag:** Use pointer events (`onPointerDown`, `onPointerMove`, `onPointerUp`) for cross-device drag. Alternatively, use tap-to-select then tap-bucket-to-place for simpler mobile UX.
- Correct placement: item snaps into bucket, green flash, `speak(t(word.i18nWord))`
- Incorrect: item bounces back with a gentle shake
- Random category pairs from vocabulary data
- Difficulty: Easy = 2 categories, 6 items. Medium = 2 categories, 8 items. Hard = 3 categories, 9 items.

### FollowDirectionsGame.jsx

**Mechanic:** Listen to an instruction, then tap the correct item(s).

- Display a grid of 4–6 emoji items (mixed categories)
- Audio instruction plays automatically: `speak(t('games.tapInstruction', { item: t(word.i18nWord) }))` — e.g., "Tap the red circle"
- Child taps the correct item. Correct: green highlight + star. Incorrect: gentle shake + replay instruction.
- 8 rounds per game
- Instructions increase in complexity by difficulty:
  - Easy: "Tap the [item]" (single item)
  - Medium: "Find [count] [items]" (find 2 animals)
  - Hard: "Tap the [color] [item]" or "Find the [big/small] [item]" (compound descriptors)

### WhatsMissingGame.jsx

**Mechanic:** Show items, hide one, ask which is gone.

- Show 4–6 emoji items for 3 seconds (memorization phase)
- Screen briefly covers (`bg-primary/20` overlay for 1 second)
- One item removed. Remaining items re-displayed.
- Below the grid: 3–4 answer choices (the removed item + distractors)
- Audio: "What's missing?" in active language
- Correct: the missing item reappears in its spot with a pop animation + star

### OddOneOutGame.jsx

**Mechanic:** Four items, three belong to one category, one doesn't.

- Display 4 `EmojiCard` in a 2×2 grid
- Audio: `t('games.whichDoesntBelong')` — "Which one doesn't belong?"
- Child taps the odd one. Correct: item highlights, explanation spoken (e.g., "A car is not an animal!"). Incorrect: shake, try again.
- 8 rounds per game
- Items drawn from vocabulary categories — 3 from one category, 1 from another

### SequenceBuilderGame.jsx

**Mechanic:** Arrange picture cards in logical order to tell a story.

- 3–4 emoji cards representing a sequence (e.g., morning routine: 😴 → ⏰ → 🪥 → 🍳)
- Cards presented in shuffled order
- Child taps cards in the correct order (tap first → it moves to position 1, etc.) OR drag to reorder
- Correct order: all cards light up green in sequence with a "swoosh" animation + star
- Incorrect order: cards gently shake, reset

**Predefined sequences (store in `src/data/puzzles.js` or a game-specific file):**
1. Morning: sleep → alarm → brush teeth → breakfast
2. Getting dressed: underwear → shirt → pants → shoes
3. Eating: plate → food on plate → eat → clean up
4. Bath time: fill tub → get in → wash → dry off
5. Going to school: wake up → get dressed → eat → go to school
6. Bedtime: bath → pajamas → book → sleep

---

## 3. Shared Game Utilities

```javascript
// src/utils/game-helpers.js

// Shuffle array (Fisher-Yates)
export function shuffle(array) { ... }

// Pick N random items from a category, excluding specific IDs
export function pickRandom(items, n, excludeIds = []) { ... }

// Pick N items from different categories for odd-one-out
export function pickOddOneOut(categories, mainCategoryId) { ... }

// Get random category pair for sorting game
export function getRandomCategoryPair(categories) { ... }
```

---

## 4. Game Wrapper Component

```javascript
// src/components/games/GameWrapper.jsx
```

Wraps every game with:
- A timer tracking session duration
- Star awarding on completion
- "Play Again" and "Back to Games" buttons on completion screen
- Progress logging to IndexedDB
- Difficulty selector at the top if the game supports it

---

## 5. Progress Tracking

```javascript
{
  module: 'games',
  activityType: 'picture-match' | 'category-sort' | 'follow-directions' | 'whats-missing' | 'odd-one-out' | 'sequence-builder',
  activityData: { difficulty: 'easy', roundsCorrect: 6, roundsTotal: 8 },
  result: 'completed',
  durationSecs: elapsed
}
```

---

## Acceptance Criteria

- [ ] Game selection screen shows all 6 games with translated names and descriptions
- [ ] Each game has Easy/Medium/Hard difficulty options
- [ ] Picture Match: cards flip, pairs match, counter works, completion triggers confetti
- [ ] Category Sorting: items can be placed into buckets (tap or drag), correct/incorrect feedback
- [ ] Follow Directions: audio plays instruction in active language, correct item tapping works
- [ ] What's Missing: memorization phase, hiding, and answer selection all work
- [ ] Odd One Out: 3+1 logic correct, explanation spoken on correct answer
- [ ] Sequence Builder: ordering mechanic works, correct sequence triggers celebration
- [ ] All games award stars on completion
- [ ] All games log progress to IndexedDB
- [ ] All game text/instructions render in Hindi and French
- [ ] All games work on touch devices (phone/tablet)
- [ ] No game crashes on edge cases (e.g., category with fewer words than needed)
