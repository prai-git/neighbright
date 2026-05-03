# Module 06 — Talk Board (AAC Communication)

**Scope:** Build the picture-exchange communication board — categories, picture cards, sentence strip, text-to-speech, quick phrases, and custom card management. Fully multilingual.

**Prerequisite:** Modules 01–05 complete.

---

## 1. useSpeech Hook

Build before the Talk Board so all modules can use it.

```javascript
// src/hooks/useSpeech.js
```

**Interface:**
```javascript
const { speak, stop, speaking, voices, selectedVoice, setSelectedVoice } = useSpeech();

speak(text)         // Speaks text in current language
stop()              // Cancels current speech
speaking            // boolean — currently speaking
voices              // Available SpeechSynthesisVoice[] filtered to current language
selectedVoice       // Currently selected voice
setSelectedVoice(v) // Save voice preference to IndexedDB settings
```

**Behavior:**
- Read current language from `useLanguage()` context
- Filter `speechSynthesis.getVoices()` by language code: `en` → `en-*`, `hi` → `hi-*`, `fr` → `fr-*`
- Default to the first available voice for the language
- Load saved voice preference from IndexedDB `settings` table
- `speak()` creates a `SpeechSynthesisUtterance`, sets `lang`, `voice`, `rate`, `pitch` from settings
- Handle edge case: if no voices for the language exist, return a `voiceUnavailable` flag so UI can show a message

---

## 2. Vocabulary Data

```javascript
// src/data/vocabulary.js
```

Export a structured object. Each word references i18n keys for translated text.

```javascript
export const categories = [
  {
    id: 'feelings',
    i18nKey: 'talkBoard.categories.feelings',
    icon: '💛',
    color: '#FFB347',
    words: [
      { id: 'happy', emoji: '😊', i18nWord: 'vocabulary.happy.word', i18nPhrase: 'vocabulary.happy.phrase' },
      { id: 'sad', emoji: '😢', i18nWord: 'vocabulary.sad.word', i18nPhrase: 'vocabulary.sad.phrase' },
      // ... all words for this category
    ]
  },
  // ... all 10 categories
];
```

**Categories and their words (complete list):**

1. **Feelings** (💛 #FFB347): happy, sad, angry, scared, tired, hungry, thirsty, sick, excited, love, hurt, cold
2. **Animals** (🐾 #77DD77): dog, cat, bird, fish, cow, pig, duck, horse, sheep, lion, frog, bear
3. **Food & Drink** (🍎 #FF6B6B): apple, banana, milk, water, bread, cookie, rice, egg, juice, cheese, chicken, pizza
4. **Actions** (🏃 #87CEEB): eat, drink, play, sleep, go, stop, help, read, wash, sit, run, hug
5. **People** (👨‍👩‍👧‍👦 #DDA0DD): mama, papa, baby, sister, brother, grandma, grandpa, teacher, friend, doctor
6. **Places** (🏠 #F0E68C): home, school, park, store, car, outside, bathroom, bed, kitchen, yard
7. **Body Parts** (🫀 #98D8C8): mouth, nose, eyes, ears, hands, feet, head, tummy
8. **Clothes** (👕 #B0C4DE): shirt, pants, shoes, hat, socks, jacket
9. **Colors** (🎨 #FFB6C1): red, blue, green, yellow, orange, purple, white, black
10. **Daily Routines** (⏰ #C3B1E1): wake up, brush teeth, eat breakfast, get dressed, go to school, bath time, bedtime

---

## 3. Talk Board Page Components

### CategorySelector.jsx (`src/components/talkboard/`)

- Horizontal scrollable row of category buttons at the top
- Each button: category icon + translated name (`t(category.i18nKey)`)
- Active category: `bg-{category.color}/20 border-{category.color}` (use inline style for dynamic color)
- Scrollable via `overflow-x-auto` with `scroll-snap-x` for nice mobile snapping
- Tap selects category and scrolls the card grid to show that category's words

### SentenceStrip.jsx

- Fixed at the top of the Talk Board content area (below NavBar, above card grid)
- `bg-surface rounded-2xl shadow-md p-3 min-h-[64px]`
- Shows selected words as small `EmojiCard size="sm"` in a horizontal row
- If empty: placeholder text `t('talkBoard.sentenceStrip')` in gray
- Tapping a word in the strip removes it
- Two buttons at the right:
  - 🔊 **Speak** — calls `speak()` with the full sentence (joins all word phrases)
  - ❌ **Clear** — removes all words from the strip
- Max 8 words in the strip; if at limit, show a subtle flash to indicate "full"
- Animate words entering/leaving with `AnimatePresence`

### PictureCardGrid.jsx

- Grid of `EmojiCard` for the active category
- `grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3`
- Tapping a card:
  1. Adds the word to the sentence strip
  2. Plays the word audio via `speak(t(word.i18nWord))`
  3. Brief highlight animation on the card
- Include custom vocabulary cards from IndexedDB (appended to matching category or in a "Custom" category)

### QuickPhrases.jsx

- Collapsible section below the card grid
- Title: `t('talkBoard.quickPhrases')`
- Pre-built one-tap phrase buttons:
  - `t('talkBoard.iNeedHelp')` — 🆘
  - `t('talkBoard.iWantMore')` — ➕
  - `t('talkBoard.allDone')` — ✅
  - `t('talkBoard.bathroomPlease')` — 🚽
  - `t('talkBoard.yes')` — 👍
  - `t('talkBoard.no')` — 👎
- Each button: `Button variant="ghost" size="lg"` with emoji + text
- Tapping immediately speaks the phrase (does NOT add to sentence strip)

### CustomCardForm.jsx

- Modal (using `Modal` component) for adding/editing custom vocabulary cards
- Fields:
  - Category: dropdown of existing categories + "Custom" option
  - Word: text input
  - Emoji: text input (single emoji character)
  - Phrase: text input (the sentence to speak)
- Save → writes to IndexedDB `customVocabulary` table
- Edit/Delete existing custom cards from a list in the dashboard (Module 11)

---

## 4. Progress Tracking

Every time the child taps a word or speaks a sentence, log to IndexedDB `progress` table:

```javascript
await db.progress.add({
  module: 'talkboard',
  activityType: 'word-tap',
  activityData: { wordId: word.id, category: category.id },
  result: 'attempted',
  durationSecs: null,
  createdAt: new Date().toISOString()
});
```

For sentence speaks:
```javascript
activityType: 'sentence-speak',
activityData: { words: [word1.id, word2.id, ...], sentenceLength: n }
```

---

## 5. TalkBoard.jsx Page Assembly

```javascript
// src/pages/TalkBoard.jsx
import { AppLayout } from '../components/common';
// ... import talkboard components

export default function TalkBoard() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [sentenceWords, setSentenceWords] = useState([]);
  const { speak } = useSpeech();
  const { t } = useTranslation();

  // ... handlers

  return (
    <AppLayout>
      <SentenceStrip words={sentenceWords} onSpeak={...} onClear={...} onRemoveWord={...} />
      <CategorySelector categories={categories} active={selectedCategory} onSelect={setSelectedCategory} />
      <PictureCardGrid category={selectedCategory} onWordTap={...} />
      <QuickPhrases onPhraseTap={(phrase) => speak(phrase)} />
    </AppLayout>
  );
}
```

---

## Acceptance Criteria

- [ ] `useSpeech` hook works: `speak('hello')` produces audio in English
- [ ] Switching language to Hindi: `speak(t('vocabulary.happy.word'))` speaks Hindi word
- [ ] Switching to French: same test with French audio
- [ ] If Hindi/French voices unavailable: a message shows instead of crashing
- [ ] Category selector shows all 10 categories with icons and translated names
- [ ] Tapping a category shows its word cards
- [ ] Tapping a word card adds it to the sentence strip and speaks the word
- [ ] Sentence strip shows words in order; tapping a word in the strip removes it
- [ ] "Speak" button reads the full sentence aloud
- [ ] "Clear" button empties the sentence strip
- [ ] Quick phrases speak immediately on tap
- [ ] Custom card form opens in a modal, validates input, saves to IndexedDB
- [ ] Custom cards appear in the grid under their assigned category
- [ ] Progress records are written to IndexedDB on word taps and sentence speaks
- [ ] Layout is responsive: cards reflow from 3 to 5 columns; sentence strip stays at top
- [ ] All strings use `t()` — full Hindi/French rendering works
