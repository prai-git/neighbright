# Module 03 — Internationalization System

**Scope:** Build the complete i18n infrastructure: master en.json with all UI strings, the useTranslation hook, the build-time OpenAI translation script, and generate hi.json and fr.json.

**Prerequisite:** Modules 01–02 complete.

---

## 1. Master Strings File Structure

```javascript
// src/data/i18n/en.json
{
  "app": {
    "name": "NeighBright",
    "tagline": "Find Your Voice, One Spark at a Time"
  },

  "nav": {
    "home": "Home",
    "talkBoard": "Talk Board",
    "sounds": "Sounds",
    "wordBuilder": "Words",
    "games": "Games",
    "puzzles": "Puzzles",
    "dashboard": "Dashboard",
    "getStarted": "Get Started",
    "language": "Language"
  },

  "landing": {
    "heroTitle": "Find Your Voice, One Spark at a Time",
    "heroDescription": "Free speech therapy and learning tools for children — no account, no download, works on any device.",
    "heroCta": "Start Practicing — It's Free",
    "heroSubtext": "No account needed. No download. Works on any device.",
    "featuresTitle": "What's Inside",
    "featureTalkBoard": "Talk Board",
    "featureTalkBoardDesc": "A picture-based communication board that helps your child build sentences and speak them aloud.",
    "featureSounds": "Sound Explorer",
    "featureSoundsDesc": "Practice every speech sound with visual mouth guides and structured levels from isolation to sentences.",
    "featureWords": "Word Builder",
    "featureWordsDesc": "240+ vocabulary words across 12 categories with flashcards, listening games, and speech practice.",
    "featurePuzzles": "Puzzles",
    "featurePuzzlesDesc": "Age-appropriate cognitive puzzles from shape sorting to sentence building across three difficulty tiers.",
    "howTitle": "How It Works",
    "howStep1Title": "Open NeighBright",
    "howStep1Desc": "On any phone, tablet, or computer. No app store needed.",
    "howStep2Title": "Pick Your Level",
    "howStep2Desc": "Choose your child's developmental tier for age-appropriate activities.",
    "howStep3Title": "Practice Together",
    "howStep3Desc": "Sit with your child and turn screen time into speech time.",
    "whoTitle": "Who It's For",
    "whoParentsTitle": "Parents & Families",
    "whoParentsDesc": "Daily home practice that supplements professional therapy. Track progress and share with your child's SLP.",
    "whoTherapistsTitle": "Speech Therapists & SLPs",
    "whoTherapistsDesc": "A free tool to recommend to families for structured home practice between sessions.",
    "whoTeachersTitle": "Teachers & Schools",
    "whoTeachersDesc": "Use in classrooms and resource rooms. No software to install, no budget needed.",
    "evidenceTitle": "Evidence-Based Methods",
    "evidenceDesc": "NeighBright uses proven therapeutic techniques: PECS for communication, traditional articulation therapy progression, ABA-inspired positive reinforcement, and research-backed vocabulary acquisition methods.",
    "evidenceDisclaimer": "NeighBright supplements but does not replace professional speech therapy.",
    "multilingualTitle": "Available in Three Languages",
    "multilingualDesc": "English, Hindi, and French — choose your language at any time.",
    "feedbackTitle": "We're Building This For You",
    "feedbackDesc": "Tell us what you need. Your feedback shapes NeighBright.",
    "feedbackCta": "Share Feedback",
    "footerAbout": "About",
    "footerPrivacy": "Privacy Policy",
    "footerContact": "Contact",
    "footerTagline": "Built for every family who deserves access."
  },

  "onboarding": {
    "welcomeTitle": "Welcome to NeighBright!",
    "welcomeDesc": "Let's set things up for your child.",
    "languageStep": "Choose a Language",
    "profileStep": "About Your Child",
    "nameLabel": "Child's Name or Nickname",
    "namePlaceholder": "e.g. Arjun, Priya, Sam",
    "avatarLabel": "Choose an Avatar",
    "tierLabel": "Developmental Level",
    "tier1Name": "Early Learners",
    "tier1Desc": "Ages 1–3: Basic shapes, first words, simple matching",
    "tier2Name": "Growing Minds",
    "tier2Desc": "Ages 3–5: Patterns, counting, letter tracing, rhyming",
    "tier3Name": "Ready to Learn",
    "tier3Desc": "Ages 5–8: Reading, sentence building, analogies, mazes",
    "next": "Next",
    "back": "Back",
    "startPracticing": "Start Practicing!"
  },

  "home": {
    "greeting": "Hi, {name}! Ready to practice?",
    "wordOfDay": "Word of the Day",
    "modules": {
      "talkBoard": "Talk Board",
      "talkBoardDesc": "Build sentences with pictures",
      "sounds": "Sound Explorer",
      "soundsDesc": "Practice speech sounds",
      "words": "Word Builder",
      "wordsDesc": "Learn new words",
      "games": "Match & Learn",
      "gamesDesc": "Play learning games",
      "puzzles": "Puzzles",
      "puzzlesDesc": "Solve fun puzzles"
    },
    "dailyGoal": "Daily Goal",
    "minutesLeft": "{minutes} minutes left today"
  },

  "talkBoard": {
    "sentenceStrip": "Tap pictures to build a sentence",
    "speak": "Speak",
    "clear": "Clear",
    "quickPhrases": "Quick Phrases",
    "iNeedHelp": "I need help",
    "iWantMore": "I want more",
    "allDone": "All done",
    "bathroomPlease": "Bathroom please",
    "yes": "Yes",
    "no": "No",
    "customCards": "Custom Cards",
    "addCard": "Add Card",
    "editCard": "Edit Card",
    "deleteCard": "Delete Card",
    "categories": {
      "feelings": "Feelings",
      "animals": "Animals",
      "food": "Food & Drink",
      "actions": "Actions",
      "people": "People",
      "places": "Places",
      "body": "Body Parts",
      "clothes": "Clothes",
      "colors": "Colors",
      "routines": "Daily Routines"
    }
  },

  "sounds": {
    "title": "Sound Explorer",
    "chooseSound": "Choose a Sound",
    "level": "Level {n}",
    "levels": {
      "1": "Say the sound",
      "2": "Sound in syllables",
      "3": "Sound in words",
      "4": "Sound in phrases",
      "5": "Sound in sentences"
    },
    "listenFirst": "Listen first, then try!",
    "tapToHear": "Tap to hear",
    "yourTurn": "Your turn!",
    "record": "Record",
    "stop": "Stop",
    "playBack": "Play back",
    "playModel": "Hear the model",
    "tryAgain": "Try again",
    "sortingGame": "Sound Sorting",
    "sortPrompt": "Does this word start with {sound}?",
    "mouthGuide": "Watch the Mouth",
    "groups": {
      "bilabial": "Lip Sounds",
      "labiodental": "Lip-Teeth Sounds",
      "dental": "Tongue-Teeth Sounds",
      "alveolar": "Tongue-Ridge Sounds",
      "palatal": "Tongue-Roof Sounds",
      "velar": "Back Sounds",
      "glottal": "Throat Sounds"
    }
  },

  "words": {
    "title": "Word Builder",
    "learnMode": "Learn",
    "listenMode": "Listen & Point",
    "sayMode": "Say It",
    "canYouFind": "Can you find the {word}?",
    "sayTheWord": "Say: {word}",
    "correct": "That's right!",
    "tryAgain": "Let's try again!",
    "swipeNext": "Swipe for next word",
    "categories": {
      "fruits": "Fruits & Vegetables",
      "food": "Food & Meals",
      "animals": "Animals",
      "vehicles": "Vehicles",
      "colorsShapes": "Colors & Shapes",
      "clothes": "Clothes",
      "furniture": "Furniture",
      "kitchen": "Kitchen",
      "hygiene": "Hygiene",
      "school": "School",
      "actions": "Actions",
      "descriptors": "Descriptors"
    }
  },

  "games": {
    "title": "Match & Learn",
    "pictureMatch": "Picture Match",
    "pictureMatchDesc": "Find matching pairs",
    "categorySorting": "Category Sorting",
    "categorySortingDesc": "Sort items into groups",
    "followDirections": "Follow Directions",
    "followDirectionsDesc": "Listen and do",
    "whatsMissing": "What's Missing?",
    "whatsMissingDesc": "Find what disappeared",
    "oddOneOut": "Odd One Out",
    "oddOneOutDesc": "Which one doesn't belong?",
    "sequenceBuilder": "Sequence Builder",
    "sequenceBuilderDesc": "Put the story in order",
    "difficulty": "Difficulty",
    "easy": "Easy",
    "medium": "Medium",
    "hard": "Hard",
    "pairsFound": "{found} of {total} pairs found",
    "tapInstruction": "Tap the {item}",
    "findInstruction": "Find {count} {item}",
    "whichDoesntBelong": "Which one doesn't belong?"
  },

  "puzzles": {
    "title": "Puzzles",
    "tier1": "Early Learners",
    "tier2": "Growing Minds",
    "tier3": "Ready to Learn",
    "shapeSorter": "Shape Sorter",
    "jigsaw": "Jigsaw",
    "colorMatch": "Color Match",
    "sizeOrder": "Size Order",
    "peekaboo": "Peek-a-Boo",
    "pattern": "Pattern",
    "counting": "Counting",
    "letterTrace": "Letter Tracing",
    "shadowMatch": "Shadow Match",
    "rhyming": "Rhyming Pairs",
    "wordPicture": "Word & Picture",
    "sentenceBuild": "Sentence Builder",
    "storySequence": "Story Sequence",
    "beginningSound": "Beginning Sounds",
    "analogies": "Analogies",
    "maze": "Maze",
    "whatComesNext": "What comes next?",
    "dragToMatch": "Drag to the matching spot",
    "tapToCount": "Tap to count",
    "traceTheLetter": "Trace the letter",
    "completed": "Puzzle completed!",
    "locked": "Complete Tier {n} puzzles to unlock"
  },

  "rewards": {
    "stars": "{count} Stars",
    "streak": "{count} Day Streak",
    "stickers": "My Stickers",
    "greatJob": "Great job!",
    "amazing": "Amazing!",
    "keepGoing": "Keep going!",
    "letsKeepPracticing": "Let's keep practicing!",
    "newSticker": "You earned a new sticker!",
    "streakMessage": "You've practiced {count} days in a row!",
    "milestones": {
      "firstWord": "First Word",
      "tenWords": "10 Words",
      "fiftyWords": "50 Words",
      "firstRecording": "First Recording",
      "threeDay": "3-Day Streak",
      "sevenDay": "7-Day Streak",
      "thirtyDay": "30-Day Streak",
      "puzzleMaster": "Puzzle Master",
      "soundStar": "Sound Star"
    }
  },

  "dashboard": {
    "title": "Parent Dashboard",
    "profile": "Profile",
    "editProfile": "Edit Profile",
    "progress": "Progress",
    "activityLog": "Activity Log",
    "wordAccuracy": "Word Accuracy",
    "soundProgress": "Sound Progress",
    "puzzleProgress": "Puzzle Progress",
    "sessionNotes": "Session Notes",
    "addNote": "Add Note",
    "notePlaceholder": "What did you observe today?",
    "settings": "Settings",
    "voice": "Voice Settings",
    "voiceRate": "Speed",
    "voicePitch": "Pitch",
    "dailyGoal": "Daily Goal (minutes)",
    "modules": "Modules",
    "customVocabulary": "Custom Vocabulary",
    "exportPdf": "Export Progress Report (PDF)",
    "exportPdfDesc": "Download a summary to share with your child's SLP.",
    "noActivity": "No activity yet. Start practicing!",
    "wordsLearned": "Words Learned",
    "soundsPracticed": "Sounds Practiced",
    "puzzlesDone": "Puzzles Completed",
    "totalTime": "Total Practice Time",
    "minutes": "min",
    "thisWeek": "This Week",
    "thisMonth": "This Month",
    "allTime": "All Time"
  },

  "common": {
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "confirm": "Confirm",
    "close": "Close",
    "back": "Back",
    "next": "Next",
    "done": "Done",
    "edit": "Edit",
    "reset": "Reset",
    "search": "Search",
    "noResults": "No results found",
    "error": "Something went wrong. Please try again.",
    "days": "days",
    "minutes": "minutes",
    "seconds": "seconds"
  },

  "vocabulary": {
    "happy": { "word": "happy", "phrase": "I am happy" },
    "sad": { "word": "sad", "phrase": "I am sad" },
    "angry": { "word": "angry", "phrase": "I am angry" },
    "scared": { "word": "scared", "phrase": "I am scared" },
    "tired": { "word": "tired", "phrase": "I am tired" },
    "hungry": { "word": "hungry", "phrase": "I am hungry" },
    "thirsty": { "word": "thirsty", "phrase": "I am thirsty" },
    "sick": { "word": "sick", "phrase": "I feel sick" },
    "excited": { "word": "excited", "phrase": "I am excited" },
    "love": { "word": "love", "phrase": "I love you" },
    "hurt": { "word": "hurt", "phrase": "I am hurt" },
    "cold": { "word": "cold", "phrase": "I am cold" },
    "hot": { "word": "hot", "phrase": "I am hot" },
    "dog": { "word": "dog", "phrase": "I see a dog" },
    "cat": { "word": "cat", "phrase": "I see a cat" },
    "bird": { "word": "bird", "phrase": "I see a bird" },
    "fish": { "word": "fish", "phrase": "I see a fish" }
  }
}
```

**Important:** The `vocabulary` section above shows only a subset. The full file must contain ALL 240+ words from the content plan (see Module 08 for the complete word list). Each word has a `word` and `phrase` key.

---

## 2. useTranslation Hook

```javascript
// src/data/i18n/index.js
import { useLanguage } from '../../contexts/LanguageContext';
import en from './en.json';
import hi from './hi.json';
import fr from './fr.json';

const translations = { en, hi, fr };

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key, replacements = {}) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        value = translations.en;
        for (const ek of keys) {
          if (value && typeof value === 'object' && ek in value) {
            value = value[ek];
          } else {
            return key; // Return the key itself if not found
          }
        }
        break;
      }
    }

    if (typeof value !== 'string') return key;

    // Replace {placeholders}
    return value.replace(/\{(\w+)\}/g, (_, name) =>
      replacements[name] !== undefined ? replacements[name] : `{${name}}`
    );
  };

  return { t, language };
}
```

**Usage in components:**
```javascript
import { useTranslation } from '../data/i18n';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('landing.heroTitle')}</h1>;
}
```

**With replacements:**
```javascript
t('home.greeting', { name: 'Arjun' })
// → "Hi, Arjun! Ready to practice?"
```

---

## 3. Build-Time Translation Script

```javascript
// scripts/translate.js
// Run with: node scripts/translate.js
// Requires: OPENAI_API_KEY in .env

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY not set in environment.');
  process.exit(1);
}

const LANGUAGES = {
  hi: {
    name: 'Hindi',
    systemPrompt: `You are an expert translator specializing in pediatric speech therapy terminology. Translate the following JSON values from English to Hindi. For vocabulary words, provide both the Devanagari script and a natural Hindi phrasing. Keep JSON keys exactly the same. Keep {placeholder} variables unchanged. UI strings should be concise and natural in Hindi. Return ONLY valid JSON — no markdown, no explanation.`
  },
  fr: {
    name: 'French',
    systemPrompt: `You are an expert translator specializing in pediatric speech therapy terminology. Translate the following JSON values from English to French. Keep JSON keys exactly the same. Keep {placeholder} variables unchanged. UI strings should be concise and natural in French, using the informal "tu" form appropriate for family contexts. Return ONLY valid JSON — no markdown, no explanation.`
  }
};

const BATCH_SIZE = 50; // keys per API call

async function translateBatch(keys, values, langConfig) {
  const subset = {};
  keys.forEach((k, i) => { subset[k] = values[i]; });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      temperature: 0.3,
      messages: [
        { role: 'system', content: langConfig.systemPrompt },
        { role: 'user', content: JSON.stringify(subset, null, 2) }
      ]
    })
  });

  const data = await response.json();
  const text = data.choices[0].message.content.replace(/```json|```/g, '').trim();
  return JSON.parse(text);
}

function flattenObject(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenObject(value, path));
    } else {
      result[path] = value;
    }
  }
  return result;
}

function unflattenObject(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const parts = key.split('.');
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in current)) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}

async function main() {
  const enPath = path.join(__dirname, '..', 'src', 'data', 'i18n', 'en.json');
  const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  const flat = flattenObject(en);
  const keys = Object.keys(flat);
  const values = Object.values(flat);

  for (const [langCode, langConfig] of Object.entries(LANGUAGES)) {
    console.log(`\nTranslating to ${langConfig.name}...`);
    const allTranslated = {};

    for (let i = 0; i < keys.length; i += BATCH_SIZE) {
      const batchKeys = keys.slice(i, i + BATCH_SIZE);
      const batchValues = values.slice(i, i + BATCH_SIZE);
      console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(keys.length / BATCH_SIZE)}`);

      const translated = await translateBatch(batchKeys, batchValues, langConfig);
      Object.assign(allTranslated, translated);

      // Rate limit pause
      await new Promise(r => setTimeout(r, 1000));
    }

    const unflattened = unflattenObject(allTranslated);
    const outPath = path.join(__dirname, '..', 'src', 'data', 'i18n', `${langCode}.json`);
    fs.writeFileSync(outPath, JSON.stringify(unflattened, null, 2), 'utf-8');
    console.log(`  ✓ Written to ${outPath}`);
  }

  console.log('\nDone. Review the generated files before committing.');
}

main().catch(console.error);
```

Add to `package.json` scripts:
```json
"scripts": {
  "translate": "node --env-file=.env scripts/translate.js"
}
```

---

## 4. Placeholder Translation Files

Until translations are generated, create placeholder files that mirror en.json structure:

```javascript
// src/data/i18n/hi.json
{}

// src/data/i18n/fr.json
{}
```

The `useTranslation` hook will fall back to English for any missing keys, so the app works with empty translation files.

---

## 5. Wire Into Existing Components

After this module, update all Module 02 components to use `t()`:

- `NavBar.jsx` — nav labels via `t('nav.home')`, etc.
- `BottomNav.jsx` — all labels via `t()`
- `SideNav.jsx` — all labels via `t()`
- `LanguageSwitcher.jsx` — already built, confirm it uses `changeLanguage()` from context
- `StreakBadge.jsx` — "days" label via `t('common.days')`
- All user-facing strings in all components must use `t()` — no hardcoded English

---

## Acceptance Criteria

- [ ] `en.json` contains all UI strings for every module (landing through dashboard)
- [ ] `en.json` contains vocabulary entries for at least 20 sample words (full 240+ comes in Module 08)
- [ ] `useTranslation` hook returns correct English strings for nested keys
- [ ] `useTranslation` supports `{placeholder}` replacement
- [ ] `useTranslation` falls back to English when a key is missing in hi.json or fr.json
- [ ] `useTranslation` returns the raw key string when a key is missing everywhere
- [ ] Language switcher changes the language context and persists to localStorage
- [ ] All Module 02 components now use `t()` for user-facing strings
- [ ] `npm run translate` executes the script (with a valid API key) and produces hi.json and fr.json
- [ ] Generated hi.json has Devanagari text for UI strings and vocabulary words
- [ ] Generated fr.json has proper French with accented characters
- [ ] `{placeholder}` variables are preserved untranslated in both hi.json and fr.json
- [ ] App renders correctly in all three languages after switching
