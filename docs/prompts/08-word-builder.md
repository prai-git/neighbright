# Module 08 — Word Builder (Vocabulary)

**Scope:** Build the vocabulary learning system with 240+ words across 12 categories, three learning modes (Learn, Listen & Point, Say It), spaced repetition, and Word of the Day. Fully multilingual.

**Prerequisite:** Modules 01–06 complete (reuses `useSpeech`, `EmojiCard`, vocabulary data structure).

---

## 1. Complete Vocabulary Data

Extend `src/data/vocabulary.js` with ALL words. Each word needs an entry in `en.json` (and thus in `hi.json`/`fr.json` after translation).

**Complete word list by category (ensure all are in en.json under `vocabulary.*`):**

| Category | Words |
|---|---|
| Fruits & Vegetables | apple, banana, orange, grapes, strawberry, carrot, tomato, potato, corn, peas, watermelon, mango, pear, broccoli, onion |
| Food & Meals | bread, rice, egg, cheese, chicken, pizza, soup, cake, pasta, sandwich, cereal, butter, jam, yogurt, pancake, noodles, hamburger, salad, toast, milk |
| Animals | dog, cat, bird, fish, cow, pig, duck, horse, sheep, lion, frog, bear, elephant, monkey, rabbit, turtle, snake, butterfly, bee, penguin |
| Vehicles | car, bus, truck, train, airplane, bike, boat, helicopter, motorcycle, scooter |
| Colors & Shapes | red, blue, green, yellow, orange, purple, white, black, pink, brown, circle, square, triangle, star |
| Clothes | shirt, pants, shoes, hat, socks, jacket, dress, shorts, boots, gloves |
| Furniture | chair, table, bed, sofa, lamp, shelf, desk, mirror, rug, door |
| Kitchen | plate, cup, spoon, fork, knife, bowl, pot, stove, fridge, sink |
| Hygiene | toothbrush, soap, towel, shampoo, comb, tissue, bath, wash hands, clean, dry |
| School | book, pencil, crayon, paper, teacher, backpack, scissors, glue, ruler, eraser |
| Actions | eat, drink, play, sleep, go, stop, help, read, wash, sit, run, hug, dance, sing, jump, swim, climb, throw, catch, draw |
| Descriptors | big, small, hot, cold, fast, slow, up, down, more, all done, happy, sad, new, old, soft |

**Each word entry in en.json:**
```json
"apple": { "word": "apple", "phrase": "I want an apple" }
```

**Vocabulary data structure in vocabulary.js:**
```javascript
export const wordCategories = [
  {
    id: 'fruits',
    i18nKey: 'words.categories.fruits',
    icon: '🍎',
    color: '#FF6B6B',
    words: [
      { id: 'apple', emoji: '🍎', i18nWord: 'vocabulary.apple.word', i18nPhrase: 'vocabulary.apple.phrase' },
      // ... all words
    ]
  },
  // ... all 12 categories
];
```

---

## 2. Learning Modes

### LearnMode.jsx (`src/components/words/`)

- Swipeable flashcard interface
- Single card visible: large emoji (text-6xl), word below in active language, category badge
- Tap card → speak the word via `useSpeech`
- Swipe left/right or arrow buttons to advance through the category
- Progress dots at bottom showing position in the category
- Animation: card slides out, new card slides in (Framer Motion `AnimatePresence`)

### ListenPointMode.jsx

- Audio prompt: `speak(t('words.canYouFind', { word: t(correctWord.i18nWord) }))` — "Can you find the [word]?"
- Display 2–4 `EmojiCard` choices (1 correct + 1–3 distractors from same category)
- Tap correct: card bounces, green highlight, star awarded, `speak(t('words.correct'))`, auto-advance after 1.5s
- Tap incorrect: gentle shake, card dims, `speak(t('words.tryAgain'))`, can try again
- Track accuracy per word in IndexedDB progress
- Number of choices scales with profile tier: Tier 1 = 2 choices, Tier 2 = 3, Tier 3 = 4

### SayItMode.jsx

- Large emoji + word displayed
- `speak(t('words.sayTheWord', { word: t(word.i18nWord) }))` — "Say: [word]"
- Two large buttons for parent to rate:
  - 👍 Thumbs up (child said it well) → `result: 'correct'`
  - 👎 Thumbs down (child needs more practice) → `result: 'incorrect'`
- Track accuracy per word — feeds spaced repetition algorithm
- Auto-advance to next word after rating

---

## 3. Category Selector

- Horizontal scrollable bar (same pattern as Talk Board's `CategorySelector`)
- Shows all 12 vocabulary categories with emoji + translated name
- Below: a mode selector — three toggle buttons: Learn | Listen | Say (translated)
- Selected mode + category combination determines what's shown below

---

## 4. Spaced Repetition

```javascript
// src/utils/spaced-repetition.js
```

Simple algorithm based on accuracy data from IndexedDB:

- Query `progress` table for the current profile, filtered to `module: 'words'`
- For each word, calculate: total attempts, correct count, last attempt date
- Score = correct / total (0.0 to 1.0)
- Words with score < 0.5 appear 3× more often than words with score > 0.8
- Words never attempted appear with normal frequency
- Shuffle the weighted list for each session

**Function:** `getWeightedWordList(categoryId)` → returns ordered array of word objects for that category, with struggled words repeated.

---

## 5. Word of the Day

In `src/pages/Home.jsx`, the Word of the Day widget:

- Select a word deterministically based on the current date: `wordIndex = daysSinceEpoch % totalWords`
- Display: emoji, word (translated), tap to hear
- Changes at midnight local time

---

## 6. Progress Tracking

```javascript
{
  module: 'words',
  activityType: 'learn-view' | 'listen-point' | 'say-it',
  activityData: { wordId: 'apple', categoryId: 'fruits', mode: 'listen-point' },
  result: 'correct' | 'incorrect' | 'attempted',
  durationSecs: elapsed,
  createdAt: new Date().toISOString()
}
```

---

## Acceptance Criteria

- [ ] All 240+ words present in en.json and vocabulary.js
- [ ] After running translate script: hi.json and fr.json contain all translated words
- [ ] Category selector shows all 12 categories, scrollable on mobile
- [ ] Learn mode: flashcards swipe through category words, tap plays audio in active language
- [ ] Listen & Point: audio prompt in active language, correct/incorrect feedback works
- [ ] Say It: parent rates accuracy, data saves to IndexedDB
- [ ] Spaced repetition: struggled words appear more frequently in subsequent sessions
- [ ] Word of the Day shows on Home screen, changes daily
- [ ] Number of choices in Listen & Point scales by tier (2/3/4)
- [ ] All progress records write to IndexedDB
- [ ] Stars awarded for completing word activities
- [ ] Full Hindi/French support: words, phrases, audio, instructions
