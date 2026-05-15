# Module 11 — Numbers (Counting & Number Sense)

**Scope:** Build the number learning module covering digits 0–20 (with extension to 100 for Tier 3), counting, number recognition, quantity matching, and basic addition/subtraction concepts. Three developmental tiers with progressive complexity.

**Prerequisite:** Modules 01–10 complete (reuses `useSpeech`, `EmojiCard`, `AppLayout`, `GameWrapper`, progress/star patterns).

---

## 1. Number Data

```javascript
// src/data/numbers.js
export const numberData = Array.from({ length: 21 }, (_, i) => ({
  value: i,
  word: numberWords[i],        // 'zero', 'one', 'two', ...
  i18nWord: `numbers.word${i}`, // numbers.word0, numbers.word1, ...
  emoji: numberEmojis[i],       // '0️⃣', '1️⃣', ... or quantity emoji
  fingers: i <= 10 ? i : null,  // for finger counting visual
}));

const numberWords = [
  'zero','one','two','three','four','five','six','seven','eight','nine','ten',
  'eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'
];

// For Tier 3 — tens
export const tensData = [
  { value: 10, word: 'ten', i18nWord: 'numbers.ten' },
  { value: 20, word: 'twenty', i18nWord: 'numbers.twenty' },
  { value: 30, word: 'thirty', i18nWord: 'numbers.thirty' },
  // ... up to 100
];
```

**Emoji quantity sets** (for counting exercises — random items to count):
```javascript
export const countableEmojis = ['🍎','🌟','🐟','🦋','🌸','🐝','🍪','🎈','🐸','🐢','🍊','🐱'];
```

---

## 2. Learning Modes

### View enum
```javascript
const VIEW = { MENU: 'menu', LEARN: 'learn', COUNT: 'count', MATCH: 'match', QUIZ: 'quiz' };
```

### LearnNumbersMode.jsx (`src/components/numbers/`)

- Flashcard interface (reuse Word Builder / Alphabets pattern)
- Large digit displayed (text-8xl, bold) with the number word below
- Quantity visualization: row of emoji (e.g., 3 = 🍎🍎🍎)
- Finger counting visual for 0–10 (simple hand emoji representation)
- Tap card → `speak` the number word
- Left/right arrows, progress dots
- Tier scaling:
  - Tier 1: numbers 0–5
  - Tier 2: numbers 0–10
  - Tier 3: numbers 0–20

### CountMode.jsx

- Display a group of random emoji items on screen (scattered, fun layout)
- Audio prompt: `speak("How many [items] do you see?")`
- Below: number buttons (Tier 1: 1–5, Tier 2: 1–10, Tier 3: 1–20)
- Child taps the correct count
- Correct: items bounce one-by-one as counted, number spoken, star awarded
- Incorrect: shake, "Let's count together!" — items highlight one-by-one with counting audio
- 8 rounds per session
- Tier scaling on quantity range
- Log `activityType: 'count'` with result

### MatchMode.jsx

- Two columns: digits on the left, quantity groups on the right (or vice versa)
- Child matches digit to its quantity by tapping a digit then tapping the matching group
- Quantities shown as emoji clusters (e.g., ⭐⭐⭐ for 3)
- Correct match: both items glow green + connecting line drawn, speak the number
- Wrong match: gentle shake, items reset
- Tier scaling:
  - Tier 1: 3 pairs (numbers 1–5)
  - Tier 2: 4 pairs (numbers 1–10)
  - Tier 3: 5 pairs (numbers 1–20)
- Pairs reshuffle each round, 3 rounds total
- Log `activityType: 'match-number'` with result

### NumberQuizMode.jsx

- Mixed question types, randomly selected each round:

**Type A — "Show me the number":**
- Audio: `speak("Tap the number [N]")`
- Display 3–4 digit cards, child taps correct one

**Type B — "How many?":**
- Display emoji quantity, 3–4 number choices below
- Child taps the correct count

**Type C — "What comes next?" (Tier 2+):**
- Display a sequence: "3, 4, 5, ?"
- 3 number choices below
- Child taps the next number

**Type D — "More or less?" (Tier 3):**
- Display two groups of emojis
- Audio: "Which group has more?" or "Which has fewer?"
- Child taps the correct group

- 10 rounds per session, mixed types based on tier
- Star per correct answer
- Log `activityType: 'number-quiz'` with result and question type

---

## 3. Page Structure

Route: `/numbers` → `src/pages/Numbers.jsx`

Replace the current placeholder with full module.

### Layout
- **Header**: "🔢 Numbers" title + Back button (top-right, context-aware)
- **Menu view**: 4 mode cards in a 2×2 grid:
  - 📖 Learn Numbers — "See each number and count along"
  - 🔢 Count It — "How many do you see?"
  - 🔗 Match Up — "Match numbers to quantities"
  - 🧠 Number Quiz — "Test your number skills"
- Each card: emoji, translated mode name, short description, colored play button
- Colors: Learn=#58CC02, Count=#1CB0F6, Match=#FF9600, Quiz=#CE82FF
- Back button steps: mode view → menu → navigate(-1)

### State Management
```javascript
const [view, setView] = useState(VIEW.MENU);
const [numberRange, setNumberRange] = useState([0, 5]); // auto-set from tier
```

---

## 4. i18n Keys

Add to `en.json` under `numbers.*`:

```json
"numbers": {
  "title": "Numbers",
  "learnMode": "Learn Numbers",
  "learnModeDesc": "See each number and count along",
  "countMode": "Count It",
  "countModeDesc": "How many do you see?",
  "matchMode": "Match Up",
  "matchModeDesc": "Match numbers to quantities",
  "quizMode": "Number Quiz",
  "quizModeDesc": "Test your number skills",
  "howMany": "How many {item} do you see?",
  "tapTheNumber": "Tap the number {number}",
  "whatComesNext": "What number comes next?",
  "whichHasMore": "Which group has more?",
  "whichHasFewer": "Which group has fewer?",
  "letsCountTogether": "Let's count together!",
  "word0": "zero", "word1": "one", "word2": "two", "word3": "three",
  "word4": "four", "word5": "five", "word6": "six", "word7": "seven",
  "word8": "eight", "word9": "nine", "word10": "ten",
  "word11": "eleven", "word12": "twelve", "word13": "thirteen",
  "word14": "fourteen", "word15": "fifteen", "word16": "sixteen",
  "word17": "seventeen", "word18": "eighteen", "word19": "nineteen",
  "word20": "twenty",
  "ten": "ten", "twenty": "twenty", "thirty": "thirty", "forty": "forty",
  "fifty": "fifty", "sixty": "sixty", "seventy": "seventy", "eighty": "eighty",
  "ninety": "ninety", "hundred": "one hundred"
}
```

---

## 5. Progress Tracking

```javascript
{
  module: 'numbers',
  activityType: 'learn-number' | 'count' | 'match-number' | 'number-quiz',
  activityData: { number: 5, mode: 'count', questionType: 'howMany' },
  result: 'correct' | 'incorrect' | 'attempted',
  durationSecs: elapsed,
  createdAt: new Date().toISOString()
}
```

Stars awarded: 1 star per correct answer in Count, Match, and Quiz modes.

---

## 6. Visual Design Notes

### Quantity Visualization
- Numbers 1–5: show emoji in a horizontal row
- Numbers 6–10: show emoji in a 2-row grid (e.g., 3+4 for 7)
- Numbers 11–20: show emoji in a compact grid with a count badge overlay
- Use consistent emoji per session (all apples, or all stars) to avoid distraction

### Number Cards
- Large digit in the center (text-6xl)
- Rounded card with colored background matching the module theme (#FF6B8A palette)
- Subtle shadow matching the dark Duolingo style
- Active/selected state: scale up slightly, brighter border

### Counting Animation
- When child answers correctly, emoji items bounce one-by-one with a 200ms delay between each
- Each bounce plays the count audio: "one... two... three!"
- Final item triggers star animation

---

## Acceptance Criteria

- [ ] Numbers 0–20 present in `numbers.js` with word, emoji, i18n data
- [ ] Learn mode: flashcards show digit + word + quantity visual, tap plays audio
- [ ] Count mode: random emoji quantities, correct/incorrect feedback, counting animation
- [ ] Match mode: digit-to-quantity matching works with tap interactions
- [ ] Number Quiz: all question types work (show number, how many, what comes next, more/less)
- [ ] Tier scaling: Tier 1 (0–5), Tier 2 (0–10), Tier 3 (0–20)
- [ ] Back button steps through views correctly (mode → menu → back)
- [ ] Stars awarded on correct answers
- [ ] Progress records written to IndexedDB
- [ ] All UI strings translated via i18n
- [ ] Mobile responsive — grids stack on small screens, number buttons wrap
- [ ] Counting animation plays smoothly on mobile
- [ ] Consistent design with existing modules (dark theme, 3D buttons, chunky cards)

---

## Feedback Amendments (2026-05-15)

### ASL Sign Language Display

Each number (0-10) in the Learn Numbers mode now displays an ASL (American Sign Language) sign alongside the number:
- An `ASLSign` component renders a hand emoji and a text description of the hand shape for the corresponding number
- The ASL sign is shown beside the number card in the flashcard view
- Covers numbers 0 through 10 (the one-handed ASL number range)

### Larger ASL Signs (2026-05-15, Round 2)

ASL sign badges in Learn Numbers mode have been increased in size:
- Uses the new `xl` size option on ASLSign component: `w-32 h-32`, `text-5xl` emoji, `text-xs` label
- LearnNumbersMode now uses `size="xl"` instead of `size="lg"` for better visibility alongside the large number display
