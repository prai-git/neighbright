# NeighBright — Project Plan

**Free Speech Therapy & Learning Platform for Children**
*Version 1.0 — May 2026*

---

## 1. Why NeighBright Exists

Approximately 1 in 4 children experience some form of speech or language delay during early development. The leading apps in this space — Speech Blubs ($60/yr), Articulation Station ($60), SpeakEasy ($50/yr) — lock evidence-based therapy techniques behind paywalls that many families cannot afford. NeighBright fills this gap: a completely free, professional-grade web application that any family can run on any device, combining AAC communication tools, articulation practice, vocabulary building, receptive language games, and age-appropriate cognitive puzzles — all grounded in the same evidence-based techniques that licensed SLPs use.

NeighBright launches in three languages — English, Hindi, and French — making it accessible to a broader global audience from day one.

NeighBright is not a replacement for professional speech therapy. It is a powerful supplement for daily home practice, designed so a parent and child can sit together and turn screen time into speech time.

---

## 2. Two-Phase Strategy

### Phase 1 — Static Launch (This Plan)

Ship a fully functional, multilingual speech therapy app as a static site hosted on GitHub Pages. No backend, no accounts, no server. One child profile per browser. All progress stored locally. The goal is to get NeighBright into families' hands quickly, collect real user feedback, and validate the product before investing in infrastructure.

- **Hosting:** GitHub Pages (free, served via GitHub's global CDN)
- **Domain:** Custom domain via Porkbun
- **Languages:** English, Hindi, French (pre-generated translations)
- **Data storage:** Browser localStorage / IndexedDB (one profile per browser)
- **Offline:** Full PWA support
- **Concurrent users:** Unlimited — static files are served globally via CDN; every user runs the app entirely in their own browser with zero shared server state
- **Cost:** $0 hosting + domain registration only

### Phase 2 — Account-Based Platform (Future)

Based on Phase 1 feedback, upgrade to a full backend with user accounts, multi-child profiles per account, cross-device sync, and server-side data. Deploy on Raspberry Pi with PostgreSQL, Fastify, and nginx.

- **Hosting:** Raspberry Pi (self-hosted)
- **Accounts:** Registration, login, email verification
- **Profiles:** Multi-child profiles per account (up to 10)
- **Sync:** Progress syncs across devices
- **Database:** PostgreSQL with full concurrent support
- **Backend:** Node.js + Fastify + Drizzle ORM

Phase 2 is documented at the end of this plan but is not part of the initial build.

---

## 3. Target Users

**Primary:** Children ages 1–8 with speech delay, late talkers, ASD, apraxia, Down syndrome, ADHD, or any child who needs communication support.

**Secondary:** Parents and caregivers who need a free, guided, at-home tool to supplement professional therapy or support early language development.

**Tertiary:** SLPs, special education teachers, and early intervention programs looking for a no-cost digital resource.

---

## 4. Concurrency & Global Access

NeighBright is a fully static site served through GitHub Pages' global CDN (backed by Fastly). This means:

- **Unlimited concurrent users** — a family in Texas, another in Mumbai, and a classroom in Paris can all use NeighBright simultaneously. Each user downloads the same static HTML/CSS/JS bundle from the CDN edge node nearest to them.
- **Zero shared server state** — after the initial page load, everything runs entirely inside the user's browser: speech synthesis, games, puzzles, progress tracking, and IndexedDB storage. No two users ever interact with a shared backend.
- **Global low latency** — CDN edge nodes serve files from 50+ locations worldwide. First load is fast regardless of geography.
- **No bottlenecks** — there is no database, no API server, and no process that could become a single point of failure. GitHub Pages handles traffic spikes that would overwhelm a self-hosted RPi.
- **Each browser is independent** — one user's data, settings, language preference, and progress are isolated to their browser. They cannot see or affect any other user's data.

This architecture means Phase 1 scales effortlessly. Whether 10 families or 10,000 families use NeighBright, the experience is identical.

---

## 5. Multilingual Support

### 5.1 Approach

NeighBright supports English, Hindi, and French from launch. All translations are pre-generated at build time using OpenAI's API — the API is never called at runtime and the key is never exposed in client code.

### 5.2 What Gets Translated

| Content Type | Example (English) | Hindi | French |
|---|---|---|---|
| UI labels | "Get Started", "Settings" | All navigation, buttons, headers | All navigation, buttons, headers |
| Category names | "Feelings", "Animals", "Food" | Category labels | Category labels |
| Word labels | "happy", "dog", "apple" | Transliterated + Devanagari | French word |
| Phrases | "I am happy", "I want milk" | Full phrase in Hindi | Full phrase in French |
| Quick phrases | "I need help", "All done" | Hindi equivalents | French equivalents |
| Instructions | "Tap the red circle" | Hindi instructions | French instructions |
| Encouragement | "Great job!", "Let's try again!" | Hindi encouragement | French encouragement |
| Puzzle prompts | "What comes next?" | Hindi prompts | French prompts |
| Sound descriptions | "Put your lips together" | Hindi articulation cues | French articulation cues |
| Landing page copy | Hero text, feature descriptions | Full page in Hindi | Full page in French |

### 5.3 What Does NOT Get Translated

- **Phoneme inventory** — Sound Explorer teaches English speech sounds specifically. Hindi and French have different phoneme sets. Phase 1 keeps Sound Explorer in English only. Future versions could add language-specific sound inventories.
- **Code and technical strings** — route names, component IDs, data keys
- **Avatar names and sticker labels** — kept universal

### 5.4 Translation Build Pipeline

```
┌──────────────────────────────────────────────────────────┐
│                    Developer's Mac (build time)          │
│                                                          │
│  1. Source strings live in:                               │
│     src/data/i18n/en.json    (master — hand-written)     │
│                                                          │
│  2. Run: npm run translate                               │
│     └── scripts/translate.js                             │
│         ├── Reads en.json                                │
│         ├── Calls OpenAI API (gpt-4o) with structured    │
│         │   prompt for Hindi and French                   │
│         ├── Outputs:                                     │
│         │   src/data/i18n/hi.json                        │
│         │   src/data/i18n/fr.json                        │
│         └── Developer reviews and commits the JSON files │
│                                                          │
│  3. Vite bundles all three JSON files into the build     │
│                                                          │
│  4. At runtime, the app reads the selected language      │
│     from localStorage and loads the matching JSON        │
└──────────────────────────────────────────────────────────┘
```

**Key details:**
- The translate script runs only on the developer's Mac, where the OpenAI API key lives in a local `.env` file
- `.env` is in `.gitignore` — never committed, never deployed
- The generated `hi.json` and `fr.json` files ARE committed to the repo — they are static data
- If vocabulary or UI text changes, the developer re-runs `npm run translate`, reviews the output, and commits
- OpenAI is used as a translation tool at build time only — the deployed app has zero API dependencies

### 5.5 Language Switcher UI

- A globe icon (🌐) in the top navigation bar, always visible
- Tapping opens a simple dropdown: English, हिन्दी, Français
- Selected language saved to localStorage, persists across sessions
- Changing language instantly re-renders all text without a page reload (React context)
- Landing page also has the language switcher
- Web Speech API respects the selected language — TTS speaks in Hindi or French when active (voice availability varies by device/browser)

### 5.6 i18n Architecture

```
src/data/i18n/
├── en.json          # Master file — all strings authored here
├── hi.json          # Generated, reviewed, committed
├── fr.json          # Generated, reviewed, committed
└── index.js         # Exports useTranslation() hook
```

The `useTranslation` hook:
- Reads current language from LanguageContext (backed by localStorage)
- Returns a `t()` function: `t('feelings.happy')` → correct string for active language
- Falls back to English if a key is missing
- Provides `setLanguage()` for the switcher

---

## 6. Public Landing Page

The first thing any visitor sees. Fully translatable via the language switcher. Must feel like a real, funded product — not a side project.

**Layout (top to bottom):**

- **Navigation bar** — NeighBright logo on the left. Language switcher (globe icon) and "Get Started" button on the right.
- **Hero section** — tagline ("Find Your Voice, One Spark at a Time"), a single-sentence description, and a prominent "Start Practicing — It's Free" button. Below: "No account needed. No download. Works on any device."
- **Feature showcase** — four large cards with icons: Talk Board (AAC), Sound Explorer (Articulation), Word Builder (Vocabulary), Puzzles (Cognitive Development). Subtle animation on scroll.
- **How it works** — three steps with illustrations: 1) Open NeighBright on any device, 2) Pick your child's level, 3) Start practicing together. No credit card, no app store, no subscription.
- **Who it's for** — three audience cards: Parents & Families, Speech Therapists & SLPs, Teachers & Schools.
- **Evidence-based** — therapeutic foundations: PECS, articulation progression, ABA reinforcement, vocabulary acquisition. Note: "NeighBright supplements but does not replace professional speech therapy."
- **Multilingual** — "Available in English, Hindi, and French."
- **Feedback callout** — "We're building this for you. Tell us what you need." Link to feedback form.
- **Footer** — About, Privacy Policy, Contact, GitHub link, "Built for every family who deserves access."

---

## 7. Single Profile System (Phase 1)

### 7.1 First Visit Experience

On first visit, tapping "Get Started" leads to a simple onboarding:

1. **Select language** — English, Hindi, or French
2. **Set up your child** — child's name (or nickname), avatar selection (24+ SVG characters), developmental tier: Tier 1 (Early Learners, ~1–3), Tier 2 (Growing Minds, ~3–5), Tier 3 (Ready to Learn, ~5–8)
3. **Start** — lands on the app home screen

### 7.2 One Profile Per Browser

In Phase 1, each browser instance stores one child's profile and progress in IndexedDB. This keeps the architecture simple and the codebase lean.

- The parent can edit the profile (name, avatar, tier) at any time from the dashboard
- All progress, stars, streaks, stickers, custom cards, and settings belong to this single profile
- If a family has two children, they use two devices (or two different browsers on the same device)

### 7.3 Limitations (Addressed in Phase 2)

- One profile per browser — no sibling switching on same device
- Data lives only in this browser on this device — no cross-device sync
- Clearing browser data erases all progress
- No remote sharing of progress with SLPs (parent can still export and email a PDF)

All of these are solved in Phase 2 with user accounts and server-side storage.

---

## 8. Core Modules

### 8.1 Talk Board (AAC Communication)

A picture-exchange communication system (PECS-style) that gives non-verbal or minimally verbal children a voice.

- **10 categories** of visual cards: Feelings, Animals, Food, Actions, People, Places, Body, Clothes, Colors, Daily Routines
- **200+ picture-word cards** using high-quality emoji/SVG symbols
- **Sentence strip** at the top — child taps cards to build multi-word messages ("I + want + milk")
- **Text-to-speech playback** — tapping the sentence strip speaks the message aloud (Web Speech API). When Hindi or French is active, TTS uses the corresponding language voice.
- **Voice selection** — parent can pick from available system voices
- **Customizable cards** — parent can add/edit cards via the dashboard. Stored in IndexedDB.
- **Quick phrases** — one-tap phrases: "I need help", "I want more", "All done", "Bathroom please" — translated per language

**Evidence basis:** PECS is one of the most well-researched AAC methods for children with ASD and communication disorders.

### 8.2 Sound Explorer (Articulation Practice)

Structured articulation therapy: isolation → syllables → words → phrases → sentences. **English only in Phase 1** (Hindi and French have different phoneme inventories).

- **All English speech sounds** organized by manner of articulation:
  - Bilabials: /p/, /b/, /m/
  - Labiodental: /f/, /v/
  - Dental: /th/ (voiced and voiceless)
  - Alveolar: /t/, /d/, /n/, /s/, /z/, /l/
  - Palatal: /sh/, /ch/, /j/, /r/
  - Velar: /k/, /g/, /ng/
  - Glottal: /h/
- **Visual mouth diagrams** — SVG cross-sections showing tongue, lip, and teeth position
- **Audio model** — tap to hear correct production (Web Speech API or pre-recorded audio)
- **Practice levels** per sound:
  - Level 1: Sound in isolation ("sss")
  - Level 2: Sound in syllables ("sa, se, si, so, su")
  - Level 3: Sound in words ("sun, sock, bus")
  - Level 4: Sound in phrases ("I see the sun")
  - Level 5: Sound in sentences ("The sun is shining in the sky")
- **Visual cue cards** — animated lip/tongue movement prompts
- **Record & compare** — child records their attempt and plays it back alongside the model (MediaRecorder API). Recordings are ephemeral — never stored.
- **Sound sorting game** — drag words to the correct sound bucket

**Evidence basis:** Traditional articulation therapy uses this exact progression.

### 8.3 Word Builder (Vocabulary)

Progressive vocabulary acquisition. Fully multilingual — words, phrases, and audio adapt to the selected language.

- **12 vocabulary categories** with 15–20 words each (240+ total):
  - Fruits & Vegetables, Food & Meals, Animals, Vehicles, Colors & Shapes, Clothes, Furniture, Kitchen, Hygiene, School, Actions, Descriptors
- **Three learning modes per category:**
  - **Learn mode** — flashcard with image, word (in active language), and audio. Swipe to advance.
  - **Listen & Point mode** — "Can you find the apple?" (in active language) — child taps correct image from 2–4 choices
  - **Say It mode** — image appears, child attempts the word. Parent taps thumbs-up/thumbs-down.
- **Spaced repetition** — struggled words appear more frequently
- **Word of the Day** — featured on the home screen

**Evidence basis:** Vocabulary-building through themed categories with multimodal input is a core early intervention technique.

### 8.4 Match & Learn (Receptive Language Games)

Games that build receptive language. All instructions adapt to the selected language.

- **Picture Matching** — memory card game, 2×2 up to 4×4 grids
- **Category Sorting** — drag items into correct category buckets
- **Follow Directions** — auditory instructions: "Tap the red circle", "Find two animals"
- **What's Missing?** — a scene with one item removed
- **Odd One Out** — four items, find the misfit
- **Sequence Builder** — arrange picture cards to tell a story in order

**Evidence basis:** Receptive language games build auditory comprehension, categorization, and direction-following.

### 8.5 Alphabets (Letter Recognition & Phonics)

Alphabet learning covering A–Z with uppercase and lowercase recognition, phonics, and tracing practice.

- **26 letters** with associated vocabulary word and emoji (A=🍎 apple, B=🍌 banana, etc.)
- **Phonetic pronunciation hints** for each letter with mouth-position guidance
- **Four learning modes:**
  - **Learn Letters** — flashcard with uppercase/lowercase pair, associated emoji + word, tap to hear letter name and word
  - **Listen & Find** — "Can you find the letter B?" — child taps the correct letter from 3–4 choices (tier-scaled)
  - **Trace Letters** — canvas-based letter tracing with dotted guide path, pointer/touch events, accuracy scoring
  - **Letter Quiz** — "What letter does 'banana' start with?" — child taps correct starting letter from 4 choices
- **Tier scaling:**
  - Tier 1: uppercase only, 3 choices, thicker guide lines for tracing
  - Tier 2: uppercase + lowercase alternating, 4 choices
  - Tier 3: lowercase only, tighter tracing tolerance
- **Progress tracking** — accuracy per letter in IndexedDB, stars for correct answers

**Evidence basis:** Letter recognition and phonemic awareness are foundational pre-literacy skills. Multi-sensory approaches (see, hear, trace) improve retention in early learners.

### 8.6 Numbers (Counting & Number Sense)

Number learning covering 0–20 with counting, quantity matching, and number recognition.

- **Numbers 0–20** (extension to 100 for Tier 3 tens: 10, 20, 30... 100)
- **Quantity visualization** using emoji clusters (3 = 🍎🍎🍎) and finger counting for 0–10
- **Four learning modes:**
  - **Learn Numbers** — flashcard with large digit, number word, quantity emoji row, finger counting visual
  - **Count It** — scattered emoji items on screen, "How many do you see?", child taps correct number button
  - **Match Up** — two-column matching: digits on one side, quantity groups on the other, tap to connect
  - **Number Quiz** — mixed question types: "Tap the number 5", "How many?", "What comes next?" (sequence), "Which group has more/fewer?" (comparison)
- **Tier scaling:**
  - Tier 1: numbers 0–5, simple counting, 3 choices
  - Tier 2: numbers 0–10, "what comes next" sequences, 4 choices
  - Tier 3: numbers 0–20, more/fewer comparisons, 4 choices
- **Counting animation** — on correct answer, items bounce one-by-one with spoken count: "one... two... three!"
- **Progress tracking** — accuracy per number in IndexedDB, stars for correct answers

**Evidence basis:** Number sense and one-to-one correspondence are critical early math foundations. Concrete-to-abstract progression (objects → digits) mirrors proven developmental math pedagogy.

### 8.7 Age-Specific Puzzles (Cognitive Development)

Puzzles scaled by developmental level. The child's profile tier determines which are available; parent can unlock any tier. Instructions adapt to selected language. *(Module 12)*

**Tier 1 — Early Learners (developmental age 1–3)**
- Shape sorter — drag shapes into matching holes
- Simple jigsaw — 4-piece puzzles of familiar objects
- Color matching — tap all items of the same color
- Size ordering — arrange 3 items smallest to biggest
- Peek-a-boo — "where did the cat hide?"

**Tier 2 — Growing Minds (developmental age 3–5)**
- 9-piece jigsaw puzzles
- Pattern completion — "what comes next?"
- Counting puzzles — count objects, match to number
- Letter tracing — guided finger/mouse tracing (English letters in Phase 1)
- Shadow matching — match objects to silhouettes
- Rhyming pairs — match rhyming words (English only in Phase 1)

**Tier 3 — Ready to Learn (developmental age 5–8)**
- 16-piece jigsaw puzzles
- Word-picture matching — read simple words, match to pictures
- Sentence building — arrange word cards into correct sentence
- Story sequencing — 4–6 card stories in order
- Beginning sounds — match words to starting letter
- Analogies — "bird is to sky as fish is to ___"
- Maze navigation with directional vocabulary

**Evidence basis:** Cognitive puzzles build problem-solving, spatial reasoning, and pre-literacy skills. Developmental-level alignment is critical for children with delays.

### 8.8 Reward & Motivation System

ABA-inspired positive reinforcement. Tracked in IndexedDB. *(Module 13)*

- **Stars** — earned for completing any activity (effort counts)
- **Streak tracker** — daily practice streaks with visual metaphor
- **Sticker collection** — unlock themed stickers at milestones
- **Celebration animations** — confetti, fireworks, dancing characters
- **No penalties** — incorrect attempts get gentle encouragement, never punishment
- **Avatar progression** — avatar earns accessories at milestones (cape at 50 stars, crown at 100)

**Evidence basis:** Positive reinforcement is the backbone of ABA therapy — rewarding effort and approximation.

### 8.9 Parent Dashboard

Accessible via a gear icon. No PIN needed in Phase 1 (local data only, no account to protect). *(Module 13)*

**Progress tracking:**
- Activity log — calendar heatmap of sessions
- Word accuracy — words mastered vs. needs work, trend over time
- Sound progress — articulation progress by sound and level
- Puzzle completion — puzzles done per tier, time and attempts
- Session notes — parent jots observations, timestamped

**Settings:**
- Language selection
- Voice selection (pitch, rate, voice)
- Difficulty override per module
- Enable/disable modules
- Add custom vocabulary cards
- Daily practice time goal
- Unlock/lock puzzle tiers

**Reports:**
- Export progress summary as PDF (jsPDF, client-side)
- Parent can email or print for their child's SLP

---

## 9. Technical Architecture (Phase 1)

### 9.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────┐
│                     Client (Browser)                 │
│                                                      │
│  React SPA (Vite build → static HTML/CSS/JS)         │
│  ├── Landing page                                    │
│  ├── App modules (all therapy + puzzles)             │
│  ├── i18n JSON bundles (en, hi, fr)                  │
│  ├── Web Speech API (TTS — client-side, multilingual)│
│  ├── MediaRecorder API (ephemeral voice recording)   │
│  ├── Canvas API (letter tracing, puzzles)            │
│  ├── IndexedDB via Dexie.js (single profile storage) │
│  └── Service Worker (PWA offline caching)            │
│                                                      │
│  Zero server dependencies. Fully static.             │
└──────────────────────────────────────────────────────┘
                   │
                   │ GitHub Pages (global CDN via Fastly)
                   │ Custom domain via Porkbun
                   │ HTTPS provided automatically
                   │
                   ▼
            neighbright.yourdomain.com

   Concurrent users worldwide: Unlimited
   Shared server state: None
   Each browser: Fully independent
```

### 9.2 Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | React 18+ (Vite) | Component-based, fast HMR, builds to static |
| Styling | Tailwind CSS + custom tokens | Responsive, utility-first |
| Animations | Framer Motion | Child-friendly transitions |
| Routing | React Router v6 | Client-side SPA routing |
| Local storage | IndexedDB via Dexie.js | Structured persistence for profile and progress |
| i18n | Custom hook + static JSON | Lightweight, no runtime dependencies |
| Speech | Web Speech API | Browser-native, multilingual, zero cost |
| Recording | MediaRecorder API | Browser-native, no server |
| PDF export | jsPDF | Client-side generation |
| Icons/Images | Emoji + custom SVG | Universal, no licensing |
| Build | Vite | Fast builds, code splitting |
| Hosting | GitHub Pages | Free, global CDN, auto HTTPS |
| Domain | Porkbun | CNAME to GitHub Pages |
| Translation | OpenAI API (build-time only) | Pre-generates hi.json and fr.json on Mac |

### 9.3 Project Structure

```
neighbright/
├── public/
│   ├── audio/                      # Pre-recorded sound files (optional)
│   ├── images/                     # SVG mouth diagrams, avatars, puzzle assets
│   ├── manifest.json               # PWA manifest
│   ├── sw.js                       # Service worker
│   └── CNAME                       # Custom domain for GitHub Pages
├── src/
│   ├── components/
│   │   ├── common/                 # Button, Card, Modal, NavBar, ProgressBar
│   │   ├── landing/                # Hero, Features, HowItWorks, Footer
│   │   ├── talkboard/              # AAC communication board
│   │   ├── sounds/                 # Sound Explorer
│   │   ├── words/                  # Word Builder
│   │   ├── alphabets/              # Alphabet learning modes
│   │   ├── numbers/                # Number learning modes
│   │   ├── games/                  # Match & Learn games
│   │   ├── puzzles/                # Age-specific puzzles
│   │   ├── rewards/                # Stars, stickers, celebrations
│   │   └── dashboard/              # Parent dashboard
│   ├── contexts/
│   │   ├── LanguageContext.jsx     # Language state + useTranslation
│   │   └── ProfileContext.jsx      # Child profile state
│   ├── data/
│   │   ├── i18n/
│   │   │   ├── en.json             # Master strings
│   │   │   ├── hi.json             # Hindi (generated, reviewed, committed)
│   │   │   ├── fr.json             # French (generated, reviewed, committed)
│   │   │   └── index.js            # useTranslation hook
│   │   ├── vocabulary.js           # Word/phrase/category data
│   │   ├── alphabets.js            # 26 letters with phonetics and word associations
│   │   ├── numbers.js              # 0–20 number data with quantity visuals
│   │   ├── sounds.js               # Phoneme data with mouth positions
│   │   ├── puzzles.js              # Puzzle configs by tier
│   │   └── rewards.js              # Sticker/achievement definitions
│   ├── hooks/
│   │   ├── useSpeech.js            # Web Speech API (language-aware)
│   │   ├── useAudioRecorder.js     # MediaRecorder wrapper
│   │   └── useProgress.js          # IndexedDB progress read/write
│   ├── db/
│   │   └── index.js                # Dexie.js schema
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Onboarding.jsx          # Language + profile setup
│   │   ├── Home.jsx                # Main app home
│   │   ├── TalkBoard.jsx
│   │   ├── SoundExplorer.jsx
│   │   ├── WordBuilder.jsx
│   │   ├── MatchAndLearn.jsx
│   │   ├── Alphabets.jsx
│   │   ├── Numbers.jsx
│   │   ├── Puzzles.jsx
│   │   └── ParentDashboard.jsx
│   ├── utils/
│   │   ├── spaced-repetition.js
│   │   └── export-pdf.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── scripts/
│   └── translate.js                # Build-time OpenAI translation
├── .github/
│   └── workflows/
│       └── deploy.yml              # Auto-deploy to GitHub Pages
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .env.example                    # OPENAI_API_KEY (for translate only)
├── .gitignore                      # Includes .env
└── README.md
```

### 9.4 IndexedDB Schema (Dexie.js)

```javascript
const db = new Dexie('NeighBrightDB');

db.version(1).stores({
  // Single child profile
  profile: '++id, name, avatarKey, tier, createdAt',

  // Progress records
  progress: '++id, module, activityType, result, durationSecs, createdAt',

  // Rewards (single row)
  rewards: '++id, totalStars, currentStreak, longestStreak, lastActive, avatarLevel',

  // Session notes
  sessionNotes: '++id, noteText, createdAt',

  // Custom vocabulary cards
  customVocabulary: '++id, category, word, emoji, phrase',

  // Settings
  settings: '++id, language, voiceURI, voiceRate, voicePitch, dailyGoalMinutes, tierOverrides, moduleToggles'
});
```

### 9.5 Responsive Design

- **Mobile-first CSS** — base styles for portrait phone, media queries scale up
- **Touch-first** — all targets 48×48px minimum (WCAG), 64×64px preferred for child-facing
- **Breakpoints:**
  - `< 640px` — single column, bottom navigation
  - `640–1024px` — two-column grids, side navigation
  - `> 1024px` — full desktop, three-column grids, persistent sidebar
- **Orientation** — portrait and landscape; puzzle/game layouts adapt
- **Font scaling** — rem-based, 18px min for child-facing text
- **No hover-dependent interactions** — tap/click only
- **Safe areas** — respects notch/status bar
- **Hindi text** — Devanagari may be wider; layout uses flexible containers

### 9.6 Offline Capability (PWA)

- **Service worker** caches full app shell and all static assets on first load
- **All content bundled** — vocabulary, phonemes, puzzles, translations, SVGs
- **IndexedDB works offline** — progress saves locally regardless of connectivity
- **Web Speech API works offline** — TTS is a browser capability
- **PWA manifest** enables "Add to Home Screen" on tablets and phones
- **Lighthouse target:** 95+ on all categories

### 9.7 Accessibility

- Semantic HTML: `<nav>`, `<main>`, `<button>`, `<header>`, `<section>`
- ARIA labels on all interactive elements
- High contrast mode in settings
- Reduced motion (respects `prefers-reduced-motion`)
- Keyboard navigation for non-touch devices
- Screen reader compatible
- CSS logical properties ready for future RTL language support

---

## 10. Design Language

### 10.1 Visual Identity

- **Name:** NeighBright
- **Tagline:** "Find Your Voice, One Spark at a Time"
- **Logo concept:** A speech bubble with a small spark/star inside
- **Personality:** Warm, encouraging, playful but not infantile. Professional enough for an SLP to recommend, friendly enough for a 2-year-old to enjoy.

### 10.2 Color Palette

| Role | Color | Hex | Usage |
|---|---|---|---|
| Primary | Warm Coral | `#FF6B6B` | Primary buttons, active states, branding |
| Secondary | Soft Sky | `#74B9FF` | Secondary buttons, links, Sound Explorer |
| Accent | Sunshine | `#FECA57` | Stars, rewards, highlights |
| Success | Mint | `#55E6C1` | Correct answers, progress complete |
| Background | Cream | `#FFF9F0` | Page backgrounds |
| Surface | White | `#FFFFFF` | Cards, modals |
| Text Primary | Charcoal | `#2D3436` | Headings, body text |
| Text Secondary | Slate | `#636E72` | Labels, descriptions |
| Error | Soft Red | `#E17055` | Validation errors |

### 10.3 Typography

- **Display/Headings:** Nunito (rounded, friendly, supports Latin + extended)
- **Body/Labels:** Quicksand or Nunito Sans
- **Hindi text:** Noto Sans Devanagari (Google Fonts, free)
- **French text:** Nunito handles French accented characters natively
- **Word cards:** Large, bold, generous letter-spacing
- **Minimum sizes:** 20px child-facing, 16px dashboard, 14px floor

### 10.4 Animation Principles

- **Purposeful** — communicate state changes
- **Quick** — 200–300ms micro-interactions, 400–600ms page transitions
- **Encouraging** — celebrations 3–4 seconds max
- **Reducible** — respects `prefers-reduced-motion`
- **Performant** — CSS transforms and opacity only

---

## 11. Development Phases (Phase 1 Build)

### 11.1 Foundation & Landing (Week 1–2)

**Goal:** Project scaffold, design system, landing page, i18n, onboarding.

- Initialize Vite + React + Tailwind
- Project structure and routing
- Design system: Button, Card, IconButton, Modal, NavBar, Input, ProgressBar
- Create en.json master strings
- Build `useTranslation` hook and LanguageContext
- Run translate script → generate and review hi.json, fr.json
- Build landing page (fully translated)
- Language switcher component
- `useSpeech` hook (language-aware)
- Dexie.js IndexedDB schema
- Onboarding: language → profile setup → home
- Responsive navigation shell
- PWA manifest and service worker scaffold

**Deliverable:** Landing page live. User selects language, creates profile, sees app home with module cards.

### 11.2 Talk Board (Week 3–4)

**Goal:** AAC board in all three languages.

- Category selector, picture card grid (responsive columns)
- Sentence strip + speech synthesis
- Quick phrases (translated)
- Custom card management in dashboard
- Progress tracking in IndexedDB
- TTS testing in English, Hindi, French across devices

**Deliverable:** Child taps pictures, builds sentences, hears them in their language.

### 11.3 Sound Explorer (Week 5–6)

**Goal:** Articulation practice. English only.

- Phoneme data with groupings and example words
- SVG mouth-position diagrams
- Sound Selector, 5-level practice UI
- Audio model playback
- Record & Compare (ephemeral)
- Sound sorting mini-game
- Progress in IndexedDB
- UI chrome translated; phoneme content stays English

**Deliverable:** Structured articulation practice for all English speech sounds.

### 11.4 Word Builder (Week 7–8)

**Goal:** Vocabulary in all three languages.

- 240+ words across 12 categories with translations
- Learn mode (flashcards + translated audio)
- Listen & Point mode (instructions in active language)
- Say It mode with parent-rated accuracy
- Spaced repetition
- Word of the Day
- Progress in IndexedDB

**Deliverable:** Three vocabulary modes, fully multilingual.

### 11.5 Match & Learn Games (Week 9–10)

**Goal:** Six receptive language games.

- Picture Matching, Category Sorting, Follow Directions
- What's Missing, Odd One Out, Sequence Builder
- Difficulty scaling, star rewards
- All instructions in active language

**Deliverable:** Six games building receptive language skills.

### 11.6 Alphabets (Week 11–12)

**Goal:** Letter recognition, phonics, and tracing.

- Alphabet data (26 letters with emoji, word, phonetic hints)
- Learn Letters mode (flashcard with upper/lowercase, tap to hear)
- Listen & Find mode (audio letter recognition, tier-scaled choices)
- Trace Letters mode (canvas tracing with guide path, pointer/touch events)
- Letter Quiz mode ("what letter does X start with?")
- i18n keys for all alphabet UI strings
- Progress tracking in IndexedDB

**Deliverable:** Four alphabet learning modes with canvas-based tracing.

### 11.7 Numbers (Week 12–13)

**Goal:** Counting, number recognition, and quantity matching.

- Number data (0–20 with words, emoji, finger counting)
- Learn Numbers mode (flashcard with digit, word, quantity visual)
- Count It mode (scattered emoji, "how many?", counting animation)
- Match Up mode (digit-to-quantity matching)
- Number Quiz mode (mixed question types: show number, how many, sequences, comparisons)
- Tier-scaled number ranges (0–5, 0–10, 0–20)
- i18n keys for all number UI strings
- Progress tracking in IndexedDB

**Deliverable:** Four number learning modes with animated counting feedback.

### 11.8 Age-Specific Puzzles (Week 14–15)

**Goal:** Three tiers of puzzles.

- Tier 1: Shape sorter, 4-piece jigsaw, color matching, size ordering, peek-a-boo
- Tier 2: 9-piece jigsaw, pattern completion, counting, letter tracing, shadow matching, rhyming
- Tier 3: 16-piece jigsaw, word-picture, sentence building, analogies, maze
- Puzzle selector with tier indicators
- Adaptive difficulty suggestion
- Translated prompts

**Deliverable:** 15+ puzzle types across three tiers.

### 11.9 Rewards & Dashboard (Week 16–17)

**Goal:** Motivation system and parent dashboard.

- Star counter, streak tracker, sticker gallery, avatar progression
- Celebration animations
- Dashboard: calendar heatmap, word accuracy charts, sound progress, puzzle map
- Session notes CRUD
- Settings panel
- PDF export (jsPDF)

**Deliverable:** Complete reward system and parent dashboard.

### 11.10 Polish & Deploy (Week 18–19)

**Goal:** Production-ready on GitHub Pages.

- Cross-device testing: iOS Safari, Android Chrome, Firefox, desktop
- Cross-language testing: Hindi/French rendering, TTS voices
- Performance: lazy loading, code splitting, Lighthouse 95+
- Service worker finalization
- Accessibility audit (WCAG 2.1 AA)
- GitHub Actions deploy workflow
- Porkbun CNAME configuration
- GitHub Pages HTTPS (automatic)
- README with screenshots and usage guide
- Feedback form (GitHub Issues or Google Form)

**Deliverable:** Live at neighbright.yourdomain.com — free, offline, trilingual.

---

## 12. GitHub Pages Deployment

### 12.1 Repository Setup

```
Repository: github.com/yourusername/neighbright
Branch: main (source code)
Deploy: GitHub Actions → gh-pages branch
```

### 12.2 GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci
      - run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: neighbright.yourdomain.com
```

### 12.3 Porkbun DNS

```
Type: CNAME
Host: neighbright
Value: yourusername.github.io
TTL: 600
```

### 12.4 Vite Config

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
});
```

---

## 13. Content Plan

### 13.1 Vocabulary (240+ words, each in EN/HI/FR)

| Category | Count | Examples (English) |
|---|---|---|
| Feelings | 15 | happy, sad, angry, scared, tired, hungry, love, hurt |
| Animals | 20 | dog, cat, bird, fish, cow, pig, duck, horse, lion, frog |
| Food & Drink | 20 | apple, milk, water, bread, cookie, rice, juice, pizza |
| Actions | 20 | eat, drink, play, sleep, go, stop, help, read, wash, hug |
| People | 12 | mama, papa, baby, sister, brother, grandma, friend, teacher |
| Places | 12 | home, school, park, store, car, outside, bathroom, bed |
| Body Parts | 12 | mouth, nose, eyes, ears, hands, feet, head, tummy |
| Clothes | 10 | shirt, pants, shoes, hat, socks, jacket, dress |
| Colors & Shapes | 14 | red, blue, green, circle, square, triangle, star |
| Vehicles | 10 | car, bus, truck, train, airplane, bike, boat |
| Daily Routines | 15 | wake up, brush teeth, eat breakfast, go to school, bath time |
| Descriptors | 15 | big, small, hot, cold, fast, slow, up, down, more, all done |

### 13.2 Alphabet Content (26 Letters)

Each letter mapped to a vocabulary word and emoji. Phonetic pronunciation hint and mouth-position guidance. Canvas tracing guide paths for uppercase and lowercase forms. Associated vocabulary entries reused from Word Builder where possible; 7 new entries (queen, umbrella, van, ice cream, kite, xylophone, zebra).

### 13.3 Number Content (0–20 + Tens to 100)

Number words in all three languages. Quantity visualizations using countable emoji sets (🍎, 🌟, 🐟, etc.). Finger counting visuals for 0–10. Tens data (10, 20, 30... 100) for Tier 3 extension.

### 13.4 Sound Inventory (English Only)

All 24 consonant sounds + vowel sounds. IPA symbol, mouth SVG, 3 words per position, age of acquisition note.

### 13.5 Puzzle Assets

Procedurally generated / SVG-based. No raster images. Canvas clipping for jigsaws. Coordinate paths for letter tracing.

---

## 14. Competitive Comparison

| Feature | Speech Blubs | SpeakEasy | My Words | NeighBright |
|---|---|---|---|---|
| Price | $60/yr | $50/yr | Freemium | **Free forever** |
| Languages | 1 | 1 | 1 | **3 (EN, HI, FR)** |
| AAC board | No | No | No | **Yes** |
| Articulation (5 levels) | Limited | Yes | No | **Yes** |
| Vocabulary builder | Yes | Yes | Yes | **Yes** |
| Receptive language games | Limited | No | Limited | **Yes (6 games)** |
| Alphabet learning + tracing | No | No | No | **Yes (4 modes)** |
| Number sense + counting | No | No | No | **Yes (4 modes)** |
| Cognitive puzzles | No | No | No | **Yes (3 tiers)** |
| Offline | App only | App only | App only | **Yes (PWA)** |
| Any device | iOS/Android | iOS/Android | Android | **Any browser** |
| Custom vocabulary | No | No | No | **Yes** |
| Open source | No | No | No | **Yes** |
| Record & compare | No | No | No | **Yes** |
| Progress PDF | No | Limited | No | **Yes** |
| No app store | No | No | No | **Yes** |
| Global concurrent users | N/A | N/A | N/A | **Unlimited (CDN)** |

---

## 15. Risk & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Web Speech API voice varies | Robotic speech | Bundle pre-recorded MP3s for critical words |
| Hindi TTS unavailable on some devices | No Hindi audio | Detect voices; text-only fallback with clear message |
| French TTS pronunciation | Incorrect accent | Test with speakers; pre-record key words |
| MediaRecorder on older iOS | Record & Compare missing | Feature-detect, hide gracefully |
| Browser data cleared | All progress lost | Clear warning in dashboard; PDF export as backup; Phase 2 solves with accounts |
| Translation quality | Awkward phrasing | Developer reviews every string; native speaker review recommended |
| Emoji rendering varies | Visual inconsistency | SVG fallbacks for critical images |
| GitHub Pages outage | Site down | GitHub 99.9%+ uptime; mirror on Netlify if needed |
| Scope creep | Timeline stretches | Modules independent; Talk Board alone is a useful MVP |

---

## 16. Phase 2 Preview — Account-Based Platform

After Phase 1 collects user feedback, Phase 2 upgrades NeighBright:

**Infrastructure:**
- Raspberry Pi with nginx, Node.js (Fastify), PostgreSQL
- Domain on Porkbun, SSL via Let's Encrypt

**New capabilities:**
- User registration and login (email/password, verification)
- Multi-child profiles per account (up to 10)
- Cross-device progress sync
- Server-side storage — survives browser clears and device changes
- Shareable progress reports via link
- Therapist and classroom account types
- OAuth ("Sign in with Google")

**Migration path:**
- Phase 1 IndexedDB data exportable as JSON
- Phase 2 provides "Import" on first login → populates server database
- Users who never create an account continue using the static version

**Backend stack:**
- Fastify, Drizzle ORM, PostgreSQL, bcrypt, JWT, Nodemailer, PM2

**Database tables:**
- users, child_profiles, progress, rewards, session_notes, custom_vocabulary, refresh_tokens

**Estimated additional development:** 8–10 weeks after Phase 1 feedback.

---

## 17. Success Metrics (Phase 1)

- **Reach:** 100+ unique visitors in first month
- **Engagement:** Average session > 8 minutes
- **Retention:** Returning visitors > 30% within 2 weeks
- **Feedback:** 20+ responses on feedback form within first month
- **Lighthouse:** 95+ on Performance, Accessibility, Best Practices, SEO
- **Language usage:** Track (localStorage counter, never sent to server) which language is selected
- **PWA installs:** Track "Add to Home Screen" events
- **Phase 2 signal:** Users requesting accounts, cross-device sync, or multi-child profiles

---

*NeighBright is built with love for every child who deserves a voice — and every family who deserves access to the tools that help them find it.*
