# Module 10 — Alphabets (Letter Recognition & Phonics)

**Scope:** Build the alphabet learning module with letter recognition, phonics, and tracing across three developmental tiers. Covers uppercase and lowercase A–Z with associated vocabulary words, audio pronunciation, and interactive practice modes.

**Prerequisite:** Modules 01–09 complete (reuses `useSpeech`, `EmojiCard`, `AppLayout`, `GameWrapper`, vocabulary data, progress/star patterns).

---

## 1. Alphabet Data

```javascript
// src/data/alphabets.js
export const alphabetData = [
  {
    letter: 'A',
    lowercase: 'a',
    emoji: '🍎',
    word: 'apple',
    i18nWord: 'vocabulary.apple.word',
    phonetic: '/æ/',
    soundHint: 'Open your mouth wide — "aah"',
  },
  {
    letter: 'B',
    lowercase: 'b',
    emoji: '🍌',
    word: 'banana',
    i18nWord: 'vocabulary.banana.word',
    phonetic: '/b/',
    soundHint: 'Press your lips together — "buh"',
  },
  // ... all 26 letters
];
```

**Complete letter → word mapping (use existing vocabulary entries where possible):**

| Letter | Emoji | Word | Letter | Emoji | Word |
|--------|-------|------|--------|-------|------|
| A | 🍎 | apple | N | 🔢 | numbers |
| B | 🍌 | banana | O | 🍊 | orange |
| C | 🐱 | cat | P | 🐧 | penguin |
| D | 🐕 | dog | Q | 👸 | queen |
| E | 🥚 | egg | R | 🐇 | rabbit |
| F | 🐟 | fish | S | ⭐ | star |
| G | 🍇 | grapes | T | 🐢 | turtle |
| H | 🐴 | horse | U | ☂️ | umbrella |
| I | 🍦 | ice cream | V | 🚐 | van |
| J | 🧃 | juice | W | 🌊 | water |
| K | 🪁 | kite | X | 🎸 | xylophone |
| L | 🦁 | lion | Y | 💛 | yellow |
| M | 🐒 | monkey | Z | 🦓 | zebra |

**Add missing vocabulary entries to en.json** (queen, umbrella, van, iceCream, kite, xylophone, zebra).

---

## 2. Learning Modes

### View enum
```javascript
const VIEW = { MENU: 'menu', LEARN: 'learn', LISTEN: 'listen', TRACE: 'trace', QUIZ: 'quiz' };
```

### LearnLettersMode.jsx (`src/components/alphabets/`)

- Flashcard interface (reuse pattern from Word Builder's `LearnMode`)
- Large uppercase letter (text-8xl, bold), lowercase below (text-5xl, lighter)
- Associated emoji + word below the letter pair
- Phonetic pronunciation hint displayed as a tooltip/badge
- Tap card → `speak` the letter name, then the word: "A — apple"
- Left/right navigation arrows, progress dots
- Animation: `AnimatePresence` slide transitions

### ListenLetterMode.jsx

- Audio prompt: `speak("Can you find the letter [X]?")`
- Display 3–4 letter cards (1 correct + 2–3 distractors)
- Tier scaling: Tier 1 = 3 choices, Tier 2 = 4 (include lowercase mix), Tier 3 = 4 (uppercase/lowercase mixed)
- Correct: bounce animation, green highlight, star, speak the letter + word, auto-advance 1.5s
- Incorrect: shake, dim, "Let's try again!", retry allowed
- Spaced repetition: struggled letters appear more frequently
- Log `activityType: 'listen-letter'` with result

### TraceLetterMode.jsx

- Large letter displayed as a dotted/gray outline on a `<canvas>` element
- Guide path shown — child traces with finger/mouse/pointer
- Touch/pointer events track the drawing path
- Visual feedback: traced portions turn green as they follow the guide
- Completion threshold: ~70% of the guide path covered = success
- On completion: celebration animation, speak the letter, star awarded
- Cycle through A–Z (or filtered set based on progress)
- Tier scaling:
  - Tier 1: uppercase only, thicker guide lines, generous tolerance
  - Tier 2: uppercase + lowercase alternating
  - Tier 3: lowercase only, tighter tolerance, cursive option (stretch goal)
- Log `activityType: 'trace-letter'` with accuracy score

### LetterQuizMode.jsx

- Audio: `speak("What letter does [word] start with?")`
- Display emoji + word, then 4 letter choices below
- Child taps the correct starting letter
- Correct: letter + word spoken, star awarded
- Incorrect: shake, "The word [word] starts with [letter]", retry
- 10 rounds per session, random words from vocabulary data
- Log `activityType: 'letter-quiz'` with result

---

## 3. Page Structure

Route: `/alphabets` → `src/pages/Alphabets.jsx`

Replace the current placeholder with full module.

### Layout
- **Header**: "🔠 Alphabets" title + Back button (top-right, context-aware)
- **Menu view**: 4 mode cards in a 2×2 grid:
  - 📖 Learn Letters — "See each letter and its word"
  - 👂 Listen & Find — "Hear a letter, tap to find it"
  - ✍️ Trace Letters — "Practice writing letters"
  - 🧠 Letter Quiz — "What letter does it start with?"
- Each card: emoji, translated mode name, short description, colored play button
- Colors: Learn=#58CC02, Listen=#1CB0F6, Trace=#FF9600, Quiz=#CE82FF
- Back button steps: mode view → menu → navigate(-1)

### State Management
```javascript
const [view, setView] = useState(VIEW.MENU);
```

---

## 4. i18n Keys

Add to `en.json` under `alphabets.*`:

```json
"alphabets": {
  "title": "Alphabets",
  "learnMode": "Learn Letters",
  "learnModeDesc": "See each letter and its word",
  "listenMode": "Listen & Find",
  "listenModeDesc": "Hear a letter, tap to find it",
  "traceMode": "Trace Letters",
  "traceModeDesc": "Practice writing letters",
  "quizMode": "Letter Quiz",
  "quizModeDesc": "What letter does it start with?",
  "canYouFind": "Can you find the letter {letter}?",
  "whatLetterStartsWith": "What letter does {word} start with?",
  "traceTheLetter": "Trace the letter {letter}",
  "startsWithLetter": "The word {word} starts with {letter}"
}
```

Add missing vocabulary entries:
```json
"queen": { "word": "queen", "phrase": "I see a queen" },
"umbrella": { "word": "umbrella", "phrase": "I have an umbrella" },
"van": { "word": "van", "phrase": "I see a van" },
"iceCream": { "word": "ice cream", "phrase": "I want ice cream" },
"kite": { "word": "kite", "phrase": "I see a kite" },
"xylophone": { "word": "xylophone", "phrase": "I hear a xylophone" },
"zebra": { "word": "zebra", "phrase": "I see a zebra" }
```

---

## 5. Progress Tracking

```javascript
{
  module: 'alphabets',
  activityType: 'learn-letter' | 'listen-letter' | 'trace-letter' | 'letter-quiz',
  activityData: { letter: 'A', mode: 'trace-letter' },
  result: 'correct' | 'incorrect' | 'attempted',
  durationSecs: elapsed,
  createdAt: new Date().toISOString()
}
```

Stars awarded: 1 star per correct answer in Listen & Find, Quiz, and Trace completion.

---

## 6. Canvas Tracing Implementation Notes

The `TraceLetterMode` is the most technically complex component:

- Use `<canvas>` with 2D context
- Draw the guide letter using `ctx.font` with a large display font, then convert to path data using `ctx.strokeText` for the dotted outline
- Alternative: pre-define SVG path data for each letter for more precise tracing guides
- Track pointer position on `pointerdown`, `pointermove`, `pointerup` events
- Compare drawn path against guide using distance sampling (check if drawn points are within N pixels of the guide path)
- Use `requestAnimationFrame` for smooth rendering
- Support both touch and mouse input
- Clear/redo button to restart the current letter

---

## Acceptance Criteria

- [ ] All 26 letters present in `alphabets.js` with emoji, word, phonetic data
- [ ] Learn mode: flashcards show letter pair + word, tap plays audio
- [ ] Listen & Find: audio prompt, correct/incorrect feedback, tier-scaled choices
- [ ] Trace Letters: canvas tracing works on touch and mouse, completion detected
- [ ] Letter Quiz: "what letter starts..." mechanic works with vocabulary words
- [ ] Back button steps through views correctly (mode → menu → back)
- [ ] Stars awarded on correct answers
- [ ] Progress records written to IndexedDB
- [ ] All UI strings translated via i18n
- [ ] Mobile responsive — single column, canvas scales to screen width
- [ ] Consistent design with existing modules (dark theme, 3D buttons, chunky cards)

---

## Feedback Amendments (2026-05-15)

### ASL Sign Language Display

Each letter (A-Z) in the Learn Letters mode now displays an ASL (American Sign Language) sign alongside the letter:
- An `ASLSign` component renders a hand emoji and a text description of the hand shape for the corresponding letter
- The ASL sign is shown beside the letter card in the flashcard view
- This adds a multi-sensory dimension to letter learning, supporting children who benefit from sign language exposure
- Covers all 26 letters of the ASL fingerspelling alphabet

### Larger ASL Signs (2026-05-15, Round 2)

ASL sign badges in Learn Letters mode have been increased in size:
- Added `xl` size option to ASLSign component: `w-32 h-32`, `text-5xl` emoji, `text-xs` label
- LearnLettersMode now uses `size="xl"` instead of `size="lg"` for better visibility alongside the large letter display
