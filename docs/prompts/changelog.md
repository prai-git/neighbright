# NeighBright Changelog

## Module 01 — Project Scaffold
**Date:** 2026-05-03  
**Status:** ✅ Complete

### Changes
- Initialized Vite + React project in existing workspace
- Installed all dependencies: `react-router-dom`, `framer-motion`, `dexie`, `dexie-react-hooks`, `jspdf`, `tailwindcss`, `@tailwindcss/vite`
- Configured `vite.config.js` with Tailwind plugin, `base: '/'`, port 5173
- Replaced default `index.css` with `@import "tailwindcss"` and `@theme` block with custom color/font tokens
- Added Google Fonts (Nunito, Noto Sans Devanagari) to `index.html`
- Created full `src/` and `public/` folder structure with `.gitkeep` files
- Created Dexie.js schema (`src/db/index.js`) — `NeighBrightDB` with 6 tables
- Created `LanguageContext.jsx` and `ProfileContext.jsx` placeholder contexts
- Created `App.jsx` with BrowserRouter and 9 routes
- Created 9 placeholder page components under `src/pages/`
- Updated `src/main.jsx` entry point
- Added MIT License (Praveen Rai 2026), `.gitignore`, `.env.example`
- Initialized git repo, connected to `https://github.com/prai-git/neighbright.git`, pushed `main`

### Deviations
- `npm create vite` with "Remove existing files" deleted the `docs/` folder — user manually restored it. **Going forward: `docs/` must never be deleted.**
- Replaced the default Vite-generated `index.css` entirely with Tailwind + theme tokens as specified.

## Module 02 — Design System
**Date:** 2026-05-03  
**Status:** ✅ Complete

### Changes
- Created 18 reusable components in `src/components/common/`
- Created `src/hooks/useTranslation.js` passthrough hook (upgraded in Module 03)
- Created barrel export `src/components/common/index.js`
- Wrapped all 7 app pages with `AppLayout`

### Deviations
- `useTranslation` hook created as a passthrough stub (returns key as string) since Module 03 (i18n) has not been built yet. Will be replaced with full i18n implementation in Module 03.

## Module 03 — i18n System
**Date:** 2026-05-03  
**Status:** ✅ Complete

### Changes
- Created `src/data/i18n/en.json` — master strings file covering all UI sections, nav labels, and 25 vocabulary entries
- Created `src/data/i18n/hi.json` and `src/data/i18n/fr.json` as empty `{}` placeholders (populated at build-time via translation script)
- Created `src/data/i18n/index.js` — real `useTranslation` hook with nested dot-notation key lookup, `{placeholder}` replacement, English fallback, and per-language selection via `LanguageContext`
- Created `scripts/translate.js` — build-time OpenAI translation script (requires `OPENAI_API_KEY` in `.env`)
- Added `"translate": "node --env-file=.env scripts/translate.js"` to `package.json` scripts
- Updated `NavBar.jsx` — imports `useTranslation` from `../../data/i18n`; uses `t()` for app name, route labels, and "Get Started"
- Updated `BottomNav.jsx` — replaced hardcoded labels with `t(labelKey)` using `nav.*` keys
- Updated `SideNav.jsx` — replaced hardcoded labels with `t(labelKey)` using `nav.*` keys
- Updated `StreakBadge.jsx` — corrected key from `t('days')` to `t('common.days')`
- Updated `src/hooks/useTranslation.js` — now re-exports from `../data/i18n` for backward compatibility

### Deviations
- None — all keys referenced by components verified against `en.json` before build.

## Module 04 — Landing Page
**Date:** 2026-05-03  
**Status:** ✅ Complete

### Changes
- Created `src/components/landing/` directory with 7 section components
- `LandingHero.jsx` — full-viewport hero with animated logo, tagline, CTA, scroll hint, decorative background blobs
- `LandingFeatures.jsx` — 4 feature cards in responsive grid (1/2/4 col), scroll-animated with Framer Motion whileInView
- `LandingHowItWorks.jsx` — 3 numbered steps with dashed connector line on desktop, scroll-animated
- `LandingAudience.jsx` — 3 audience cards (Parents, Therapists, Teachers), outlined variant
- `LandingEvidence.jsx` — evidence paragraph, disclaimer box with ⚕️, multilingual flags section
- `LandingFeedback.jsx` — feedback CTA linking to GitHub Issues (configurable via `FEEDBACK_URL` constant)
- `LandingFooter.jsx` — dark footer, 3 columns, GitHub link with SVG icon, footer tagline
- Replaced `src/pages/Landing.jsx` placeholder with full page assembly
- All text uses `t()` — fully translatable via language switcher

### Deviations
- `Card` `color` prop fixed to use CSS variable syntax (`var(--color-primary)` etc.) instead of string names, matching the component's `style` implementation
- `Card` `padding="none"` used when custom padding applied via `className` to avoid double-padding

## Module 05 — Onboarding & Profile
**Date:** 2026-05-03  
**Status:** ✅ Complete

### Changes
- Created `src/components/common/RequireProfile.jsx` — route guard redirecting to `/onboarding` if no profile in IndexedDB
- Created `src/components/common/SmartRedirect.jsx` — redirects to `/home` if profile already exists (used on `/` and `/onboarding`)
- Built full `Onboarding.jsx` multi-step wizard:
  - Step 1: Language selection (3 tappable cards, calls `changeLanguage()` immediately, text re-renders)
  - Step 2: Name input, 24-avatar emoji grid, 3-tier selector — all with inline validation
  - AnimatePresence horizontal slide transition between steps
  - Progress dots indicator
  - Saves profile via `saveProfile()` → navigates to `/home`
- Built full `Home.jsx` home screen:
  - Personalized greeting with avatar + child's name
  - StarCounter + StreakBadge from IndexedDB rewards table
  - Word of the Day card (date-seeded, tap-to-hear via speechSynthesis)
  - 5 module cards in responsive grid (1/2/3 col)
  - Daily Goal progress bar (reads from IndexedDB progress + settings)
- Updated `App.jsx` — all 7 app routes wrapped with `RequireProfile`; `/` and `/onboarding` wrapped with `SmartRedirect`
- Added `RequireProfile` to barrel export in `index.js`

### Deviations
- `SmartRedirect` component added (not in original spec) — spec said to handle redirect in `App.jsx` conditionally; cleaner as a component
- Dexie `progress` query uses `.filter()` instead of `.where().startsWith()` since `createdAt` is not an indexed range field

## Module 06 — Talk Board
**Date:** 2026-05-03  
**Status:** ✅ Complete

### Changes
- Created `src/hooks/useSpeech.js` — speech synthesis hook with language filtering, IndexedDB voice persistence, rate/pitch settings, `voiceUnavailable` flag
- Created `src/data/vocabulary.js` — full structured vocabulary for all 10 categories (≈100 words) with i18n keys and emojis
- Added 76 vocabulary words to `src/data/i18n/en.json` (all categories: animals, food, actions, people, places, body, clothes, colors, routines)
- Created `src/components/talkboard/CategorySelector.jsx` — horizontal scrollable tab row with active highlight
- Created `src/components/talkboard/SentenceStrip.jsx` — AnimatePresence word chips, max 8 words, Speak/Clear buttons
- Created `src/components/talkboard/PictureCardGrid.jsx` — 3/4/5 col grid, highlight animation on tap, loads custom cards from IndexedDB
- Created `src/components/talkboard/QuickPhrases.jsx` — collapsible section, 6 quick-tap phrases
- Created `src/components/talkboard/CustomCardForm.jsx` — Modal form, validates, writes to IndexedDB customVocabulary
- Replaced `src/pages/TalkBoard.jsx` placeholder with full page assembly
- Progress tracked to IndexedDB on every word tap, sentence speak, and quick phrase

### Deviations
- Bundle size warning emitted (>500KB) — expected for this phase; code-splitting can be added in Module 12 (PWA/deployment)

## Module 07 — Sound Explorer
**Date:** 2026-05-03  
**Status:** ✅ Complete

### Changes
- Created `src/data/sounds.js` — all 24 consonant sounds across 7 articulation groups (bilabial, labiodental, dental, alveolar, palatal, velar, glottal), each with: symbol, mouthDescription, 3 examples per position (initial/medial/final), ageOfAcquisition, and all 5 level prompts (isolation/syllables/words/phrases/sentences)
- Created 13 mouth-position SVG diagrams in `public/images/mouth/` — clean line art, active articulator highlighted in primary color: `bilabial-stop.svg`, `bilabial-nasal.svg`, `labiodental.svg`, `dental.svg`, `alveolar-stop.svg`, `alveolar-fricative.svg`, `alveolar-nasal.svg`, `alveolar-lateral.svg`, `palatal-fricative.svg`, `palatal-affricate.svg`, `palatal-r.svg`, `velar.svg`, `glottal.svg`
- Extended `sounds` section in `src/data/i18n/en.json` with additional keys: `chooseSoundGroup`, `playSortingGame`, `sortDragPrompt`, `ageAcquisition`, `practiceLevel`, `levelComplete`, `roundResult`, `gameComplete`, `backToGroups`, `backToSounds`, `recordingNotSupported`, `micPermissionDenied`, `examples`, `initial`, `medial`, `final`
- Created `src/hooks/useAudioRecorder.js` — `MediaRecorder` wrapper with mic permission handling, Blob URL management, `isSupported` flag, graceful permission-denied error handling
- Updated `src/hooks/useSpeech.js` — `speak(text, rateOverride?)` now accepts optional rate override for slow/normal playback per level
- Created `src/components/sounds/SoundGroupSelector.jsx` — 2–4 col grid of group cards with mouth diagram previews and phoneme symbol badges
- Created `src/components/sounds/SoundCard.jsx` — individual sound card with phoneme symbol, example word, age badge, level progress dots
- Created `src/components/sounds/PracticeView.jsx` — full 5-level practice interface per sound: mouth diagram, level tabs, level-appropriate content (isolation/syllables/words/phrases/sentences), RecordCompare per level, star animation on first attempt
- Created `src/components/sounds/RecordCompare.jsx` — record/stop button, playback + hear-model side-by-side, handles unsupported/permission-denied gracefully
- Created `src/components/sounds/SoundSortingGame.jsx` — 10-round game, auto-speaks word each round, two-bucket tap answer, correct/incorrect feedback animations, game-over score screen with restart
- Replaced `src/pages/SoundExplorer.jsx` placeholder with full page assembly (groups → sound list → practice, + sorting game)
- Progress written to IndexedDB for every practice attempt and on game completion
- Stars written to IndexedDB `rewards.totalStars` on each completed attempt

### Deviations
- Bundle size ~559KB — still advisory only; code-splitting planned for Module 12
- `w` and `y` glides placed in `glottal` group for simplicity; `zh` added as voiced palatal fricative companion to `sh`
- Sound sorting game uses tap-on-bucket UX instead of drag (drag complex on mobile without additional library)

## Design Overhaul — Visual Polish
**Date:** 2026-05-03
**Status:** ✅ Complete

### Summary
Comprehensive design refresh aligning the entire UI with the project plan's warm color palette and significantly improving visual polish, hierarchy, and professionalism across all existing pages and components.

### Color Palette (reverted to project plan spec)
- Primary: `#FF6B6B` (Warm Coral) — was `#6366F1` (Indigo)
- Secondary: `#74B9FF` (Soft Sky) — was `#0EA5E9`
- Accent: `#FECA57` (Sunshine) — unchanged
- Success: `#55E6C1` (Mint) — was `#10B981`
- Background: `#FFF9F0` (Cream) — was `#F0F2FF`
- Text Primary: `#2D3436` (Charcoal) — was `#1E1B4B`
- Text Secondary: `#636E72` (Slate) — was `#6B7280`
- Error: `#E17055` (Soft Red) — was `#EF4444`
- Border: `#F0E6D8` (Warm) — was `#E5E7EB`

### Files Changed

**Foundation:**
- `src/index.css` — New warm color tokens, softer mesh gradient background, improved glassmorphism with warmer tones, new `.section-divider` utility, updated scrollbar/selection colors, added `--color-primary-dark` and `--color-border` tokens

**Common Components (src/components/common/):**
- `NavBar.jsx` — Max-width constraint for landing mode, hover effect on logo, better border treatment, consistent spacing
- `SideNav.jsx` — Warm background (`bg-white/60`), rounded avatar container with gradient background, cleaner active state (`bg-primary/10` instead of gradient), consistent icon widths
- `BottomNav.jsx` — Safe area inset padding, top-bar active indicator instead of bottom dot, smaller label text, better height structure
- `AppLayout.jsx` — Added `max-w-5xl` content wrapper with consistent padding, removed per-page max-width responsibility
- `Card.jsx` — Better hover shadow animation, thinner top-border accent (`border-t-[3px]`), responsive padding (`p-4 md:p-5`)
- `Button.jsx` — Added shadow treatment per variant (`shadow-primary/25`), changed `font-semibold` to `font-bold`, adjusted padding
- `LanguageSwitcher.jsx` — Dropdown uses warm borders, active item uses `bg-primary/5`, scale animation on open
- `StarCounter.jsx` — Simplified animation (removed color flash)
- `StreakBadge.jsx` — Added border, changed text color to `text-text-primary`

**Landing Page (src/components/landing/):**
- `LandingHero.jsx` — Reduced height to 90vh, gradient text on logo, larger/softer blurs, better spacing
- `LandingFeatures.jsx` — Replaced Card component with custom gradient cards per feature, icon containers with colored backgrounds, added section dividers
- `LandingHowItWorks.jsx` — Gradient connector line instead of dashed, warm section background, better spacing
- `LandingAudience.jsx` — Circular icon containers, warm card backgrounds, section dividers
- `LandingEvidence.jsx` — Section dividers, warm disclaimer box, interactive flag hover
- `LandingFeedback.jsx` — Wrapped in gradient card with rounded-3xl, warm border
- `LandingFooter.jsx` — Column headers with uppercase tracking, better link spacing, explicit Charcoal bg color

**Pages:**
- `Home.jsx` — Gradient avatar container, gradient module cards (no longer using Card component for modules), warm Word of the Day with accent gradient, keyboard accessibility on interactive elements
- `Onboarding.jsx` — Warm borders, animated progress dots (active dot widens), updated selection rings
- `SoundExplorer.jsx` — Updated header border styling

### Deviations
- Landing section backgrounds changed from alternating `bg-surface`/`bg-background` to alternating `bg-white/40`/transparent for subtler separation
- Home module cards use native divs with gradient classes instead of Card component for more color variety
- Added `primary-dark` token not in original spec — useful for hover states

## Design Overhaul v2 — Layout & Consistency
**Date:** 2026-05-04
**Status:** ✅ Complete

### Summary
Major layout and navigation overhaul inspired by Khan Academy Kids (full-width content, big colorful badge cards) and Duolingo (clean, minimal nav, bold rounded UI). Removed sidebar, removed top nav links, widened content area, and established consistent page header pattern across all pages.

### Design Reference
- **Khan Academy Kids**: Full-width content, large colorful module cards as navigation hub, character-centric home screen
- **Duolingo**: Clean minimal nav (just logo + avatar), bold rounded UI, path-based navigation

### Key Changes

**Layout — content no longer squished:**
- `AppLayout.jsx` — Removed SideNav import entirely. Content area widened from `max-w-3xl` (768px) to `max-w-5xl` (1024px). Full-width centered layout.
- `SideNav.jsx` — No longer imported or rendered (file kept for potential future use)
- `index.css` — Background changed from warm cream (`#FFF9F0`) to clean neutral (`#FAFAFA`). Removed mesh gradient background — cleaner look. Simplified glassmorphism. Added `.hide-scrollbar` utility class.

**Navigation — Home badges are the hub:**
- `NavBar.jsx` — Removed all desktop nav links (Home, Sounds, etc.). NavBar now only contains: logo (left), language switcher + avatar (right). Clean and minimal.
- `BottomNav.jsx` — Mobile-only, unchanged. Serves as secondary nav on small screens.
- Home page module cards serve as the primary navigation hub with big colorful badges.

**Consistent page headers — every page follows same pattern:**
- **Home** — Greeting with avatar + stats, "Modules" section label, badge grid (2 cols mobile, 3 cols tablet, 5 cols desktop)
- **TalkBoard** — `← Home` back link + `💬 Talk Board` title + `+ Add Card` action button
- **SoundExplorer** — `← Home` back link + `🔊 Sound Explorer` title + `🎮 Play Sorting Game` action button
- **WordBuilder, MatchAndLearn, Puzzles, ParentDashboard** — All placeholder pages updated with same `← Home` + emoji title pattern + "Coming Soon" centered content

**Talk Board improvements:**
- `+ Add Card` moved from bottom text link to top-right action button (pill badge style)
- `QuickPhrases.jsx` — Removed collapsible accordion. Now always-visible horizontal pill bar.
- `PictureCardGrid.jsx` — Larger emoji (text-4xl/5xl), responsive columns (3/4/5), aspect-square cards
- `SentenceStrip.jsx` — Cleaner word chips (pill style), simplified clear button
- `CategorySelector.jsx` — Full-rounded pill tabs, active = primary fill

**Sound Explorer improvements:**
- `SoundGroupSelector.jsx` — Wider grid (2/3/4 cols), bigger cards with colored icon containers, sound symbols without `/` slashes
- `SoundCard.jsx` — Bigger phoneme display in colored container, removed age-of-acquisition badge from grid view, cleaner progress dots
- `SoundSortingGame.jsx` — Stripped `/` from all symbol displays, bigger bucket cards with icon containers
- `PracticeView.jsx` — Stripped `/` from symbol display, pill-shaped level tabs, rounded-full buttons
- `RecordCompare.jsx` — Pill-shaped playback buttons

**Landing page — cleaner sections:**
- All sections: removed `bg-surface`/`bg-background` alternation, use clean white sections
- `LandingHero.jsx` — Removed decorative blobs, cleaner minimal layout
- `LandingFeatures.jsx` — Same colorful badge card style as Home modules
- `LandingFooter.jsx` — Simplified to flex row links
- All sections use consistent `max-w` constraints matching app pages

**Onboarding:**
- Wider avatar grid (8 cols), cleaner tier selection cards, consistent border treatment

### Files Changed (25 files)
- `src/index.css`
- `src/components/common/AppLayout.jsx`
- `src/components/common/NavBar.jsx`
- `src/components/common/BottomNav.jsx`
- `src/components/common/Card.jsx`
- `src/components/common/Button.jsx`
- `src/components/common/EmojiCard.jsx`
- `src/components/common/LanguageSwitcher.jsx`
- `src/components/landing/LandingHero.jsx`
- `src/components/landing/LandingFeatures.jsx`
- `src/components/landing/LandingHowItWorks.jsx`
- `src/components/landing/LandingAudience.jsx`
- `src/components/landing/LandingEvidence.jsx`
- `src/components/landing/LandingFeedback.jsx`
- `src/components/landing/LandingFooter.jsx`
- `src/components/talkboard/SentenceStrip.jsx`
- `src/components/talkboard/CategorySelector.jsx`
- `src/components/talkboard/PictureCardGrid.jsx`
- `src/components/talkboard/QuickPhrases.jsx`
- `src/components/sounds/SoundGroupSelector.jsx`
- `src/components/sounds/SoundCard.jsx`
- `src/components/sounds/PracticeView.jsx`
- `src/components/sounds/SoundSortingGame.jsx`
- `src/components/sounds/RecordCompare.jsx`
- `src/pages/Home.jsx`
- `src/pages/TalkBoard.jsx`
- `src/pages/SoundExplorer.jsx`
- `src/pages/Onboarding.jsx`
- `src/pages/WordBuilder.jsx`
- `src/pages/MatchAndLearn.jsx`
- `src/pages/Puzzles.jsx`
- `src/pages/ParentDashboard.jsx`

### Deviations
- SideNav file kept but no longer imported — available for future desktop dashboard if needed
- Background changed from warm cream to neutral gray (`#FAFAFA`) — cleaner, more professional per reference apps
- Border color changed from warm `#F0E6D8` to neutral `#EEEEEE` — better contrast on neutral background

---

## Design Overhaul v3 — Navigation Refinement
**Date:** 2026-05-04
**Status:** ✅ Complete

### Summary
Consolidated navigation: single "← Back" button per sub-page positioned top-right of page content area. NavBar simplified to logo, language switcher, Home icon (🏠), and avatar only. Removed all duplicate/internal back buttons from Sound Explorer. Removed redundant "Choose a Sound Group" heading.

### Key Changes

**NavBar.jsx — simplified top bar:**
- Removed Back button from NavBar entirely
- NavBar retains: logo, language switcher, 🏠 Home icon, avatar

**Single Back button (top-right) on all sub-pages:**
- Each sub-page has exactly one "← Back" button, positioned top-right via `justify-between`
- Uses `navigate(-1)` for browser-history-based navigation
- Pages updated: TalkBoard, SoundExplorer, WordBuilder, MatchAndLearn, Puzzles, ParentDashboard

**SoundExplorer — context-aware single Back button:**
- Single "← Back" button in top-right handles all navigation levels
- Steps back through internal views: practice → sounds → groups → browser history
- Removed all internal "← Back to Groups" and "← Back to Sounds" buttons
- `PracticeView.jsx` — Removed `onBack` prop and its internal back button

**Sound Explorer cleanup:**
- `SoundGroupSelector.jsx` — Removed "Choose a Sound Group" heading (redundant with page title)

### Files Changed (8 files)
- `src/components/common/NavBar.jsx`
- `src/components/sounds/SoundGroupSelector.jsx`
- `src/components/sounds/PracticeView.jsx`
- `src/pages/TalkBoard.jsx`
- `src/pages/SoundExplorer.jsx`
- `src/pages/WordBuilder.jsx`
- `src/pages/MatchAndLearn.jsx`
- `src/pages/Puzzles.jsx`
- `src/pages/ParentDashboard.jsx`

---

## Design Overhaul v4 — Bold & Vibrant (Duolingo-style)
**Date:** 2026-05-05
**Status:** ✅ Complete

### Summary
Complete visual overhaul to a bold, vibrant dark theme inspired by Duolingo. Dark background (#131F24), saturated colors, chunky 3D-shadow buttons, large module cards with vivid fills, and proper widget layout across all pages.

### Design System
- **Palette**: Dark background (#131F24), surface (#1B2B32), border (#2B3D45), green primary (#58CC02), blue secondary (#1CB0F6), orange accent (#FF9600), red error (#FF4B4B)
- **Shadows**: Chunky 3D button shadows (0 4px 0) with press-down active states
- **Typography**: White text on dark, font-extrabold, uppercase tracking on labels
- **Cards**: Dark surface, 2px borders, 3D drop shadows, hover lift
- **Module cards**: Fully saturated backgrounds (green, blue, orange, purple, red)

### Key Changes

**CSS Foundation**: Complete dark palette, `.module-card` with 3D shadow, dark glass nav, dark scrollbar
**NavBar/BottomNav**: Dark glass, gradient logo, active indicator bar, scale effects
**Common Components**: Chunky 3D buttons, dark cards/modals/inputs, accent-colored badges
**Home**: Gradient banner, side-by-side stats cards, large saturated module tiles
**Sub-Pages**: Dark headers, chunky ghost Back button with 3D shadow
**Sound Explorer**: Saturated group cards, dark sound cards, chunky level pills, bold game UI
**TalkBoard**: Dark sentence strip, blue word chips, orange quick phrases, dark picture cards
**Landing**: All dark sections, saturated feature tiles, dark audience/evidence cards
**Onboarding**: Dark selection cards with 3D shadows, thicker progress dots

### Files Changed (33 files)
- `src/index.css`
- `src/components/common/{Button,Card,EmojiCard,Input,LanguageSwitcher,Modal,NavBar,BottomNav,ProgressBar,StreakBadge}.jsx`
- `src/components/landing/{LandingHero,LandingFeatures,LandingHowItWorks,LandingAudience,LandingEvidence,LandingFeedback,LandingFooter}.jsx`
- `src/components/sounds/{PracticeView,RecordCompare,SoundCard,SoundGroupSelector,SoundSortingGame}.jsx`
- `src/components/talkboard/{CategorySelector,PictureCardGrid,QuickPhrases,SentenceStrip}.jsx`
- `src/pages/{Home,TalkBoard,SoundExplorer,WordBuilder,MatchAndLearn,Puzzles,ParentDashboard,Onboarding}.jsx`

---

## Module 08 — Word Builder
**Date:** 2026-05-08
**Status:** ✅ Complete

### Summary
Full vocabulary learning system with 240+ words across 12 categories, three learning modes (Learn, Listen & Point, Say It), spaced repetition, progress tracking, star earning, and Word of the Day integration on the Home screen.

### Changes

**Vocabulary Data (`src/data/vocabulary.js`):**
- Added `wordCategories` export with 12 categories: Fruits & Vegetables, Food & Meals, Animals, Vehicles, Colors & Shapes, Clothes, Furniture, Kitchen, Hygiene, School, Actions, Descriptors
- 240+ words total, each with emoji, i18n word key, and i18n phrase key
- Existing TalkBoard `categories` export preserved untouched

**i18n (`src/data/i18n/en.json`):**
- Added ~120 new vocabulary entries (word + phrase pairs) covering all new words
- Used `orangeFruit` key to disambiguate from the color "orange"

**Spaced Repetition (`src/utils/spaced-repetition.js`):**
- `getWeightedWordList(categoryWords)` — queries IndexedDB progress for accuracy per word
- Words with < 50% accuracy repeat 3×, 50-80% repeat 2×, > 80% repeat 1×
- Fisher-Yates shuffle on the weighted list

**Learning Mode Components (`src/components/words/`):**
- `LearnMode.jsx` — Swipeable flashcard interface with AnimatePresence slide transitions, large emoji (text-7xl), word + phrase badge, tap-to-speak via useSpeech, prev/next arrow buttons, progress dots, logs `learn-view` to IndexedDB, awards star on category completion
- `ListenPointMode.jsx` — Audio prompt ("Can you find the [word]?"), EmojiCard choice grid, tier-scaled difficulty (Tier 1 = 2 choices, Tier 2 = 3, Tier 3 = 4), correct = bounce + green ring + star + auto-advance 1.5s, incorrect = shake + dim + retry, replay button, logs `listen-point` with result
- `SayItMode.jsx` — Large emoji + word card, speaks "Say: [word]", two large rating buttons (👍 correct / 👎 needs practice), star animation on correct, auto-advance after rating, logs `say-it` with result

**WordBuilder Page (`src/pages/WordBuilder.jsx`):**
- VIEW enum pattern (CATEGORIES / MODE) matching SoundExplorer
- 12-category grid (2/3/4 cols responsive) with emoji, name, word count, color accent
- Three-button mode selector (Learn / Listen / Say) as segmented control
- Context-aware Back button (mode → categories → browser history)
- Star earning via `db.rewards` (same pattern as SoundExplorer)

**Home Page (`src/pages/Home.jsx`):**
- Word of the Day now uses `wordCategories` data (240+ word pool) instead of hardcoded WORD_EMOJIS map
- `getDailyWord()` returns i18n keys — word and phrase render via `t()` for full multilingual support
- Removed `en.json` direct import dependency

### Talk Board Layout Fix
- Moved "Add Card" button from cramped header to inline with "Categories" section label
- Added section labels ("Quick Phrases", "Categories") as uppercase tracking headers
- Redesigned QuickPhrases from horizontal scroll pills to 3×2 grid cards (emoji above label)
- CategorySelector active tab now uses category's own color instead of generic green
- Increased section spacing from gap-5 to gap-6

### Files Changed
- `src/data/vocabulary.js` — added `wordCategories` export
- `src/data/i18n/en.json` — ~120 new vocabulary entries
- `src/utils/spaced-repetition.js` — **new file**
- `src/components/words/LearnMode.jsx` — **new file**
- `src/components/words/ListenPointMode.jsx` — **new file**
- `src/components/words/SayItMode.jsx` — **new file**
- `src/pages/WordBuilder.jsx` — replaced placeholder
- `src/pages/Home.jsx` — Word of the Day updated
- `src/pages/TalkBoard.jsx` — layout restructured
- `src/components/talkboard/QuickPhrases.jsx` — redesigned to grid
- `src/components/talkboard/CategorySelector.jsx` — color-coded active state

### Deviations
- Used `orangeFruit` i18n key for the fruit "orange" to avoid collision with the color "orange" key
- LearnMode uses category's original word order (not spaced repetition) since it's a browse/flashcard mode; Listen & Say modes use spaced repetition
- Bundle size ~596KB — code-splitting planned for Module 12

---

## Module 09 — Match & Learn Games
**Date:** 2026-05-08
**Status:** ✅ Complete

### Summary
Six interactive receptive language games with difficulty scaling (Easy/Medium/Hard), game selection screen, shared game wrapper for progress tracking and star earning, and full vocabulary integration from Module 08.

### Changes

**Game Utilities:**
- `src/utils/game-helpers.js` — **new file**: `shuffle()`, `pickRandom()`, `pickOddOneOut()`, `getRandomCategoryPair()`, `getRandomCategories()`
- `src/data/sequences.js` — **new file**: 6 predefined sequences for Sequence Builder (morning, getting dressed, eating, bath time, going to school, bedtime)

**Game Wrapper (`src/components/games/GameWrapper.jsx`):**
- Wraps all games with session timer, star awarding on completion, progress logging to IndexedDB, "Play Again" and "Back" buttons on completion screen

**6 Game Components (`src/components/games/`):**
- `PictureMatchGame.jsx` — Memory card flip game. Grid sizes by difficulty (2×2 / 3×4 / 4×4). Tap to flip, matching pairs stay face-up with green glow, speaks matched word
- `CategorySortingGame.jsx` — Tap-to-select item, tap bucket to place. 2–3 category buckets with colored drop zones. Correct = snap + speak, incorrect = bounce back. Difficulty scales item/category count
- `FollowDirectionsGame.jsx` — Audio instruction ("Tap the [word]"), grid of 4–6 choices, 8 rounds. Correct = green highlight, incorrect = shake + replay. Replay button for audio
- `WhatsMissingGame.jsx` — 3-second memorization phase, 1-second hiding overlay, one item removed. 3 answer choices (1 correct + 2 distractors). 8 rounds
- `OddOneOutGame.jsx` — 2×2 grid, 3 items from one category + 1 odd item. Audio prompt "Which one doesn't belong?". 8 rounds
- `SequenceBuilderGame.jsx` — Tap cards in correct order to build a sequence. Placed slots show progress, remaining items below. Incorrect order resets. Rounds scale by difficulty (3/4/6)

**MatchAndLearn Page (`src/pages/MatchAndLearn.jsx`):**
- Game selection grid (1/2/3 cols responsive) with color-coded cards
- Each card: emoji, name, description, per-game difficulty selector, Play button
- VIEW pattern: selection → active game → back
- Context-aware Back button (game → selection → browser history)

### Files Changed
- `src/utils/game-helpers.js` — **new file**
- `src/data/sequences.js` — **new file**
- `src/components/games/GameWrapper.jsx` — **new file**
- `src/components/games/PictureMatchGame.jsx` — **new file**
- `src/components/games/CategorySortingGame.jsx` — **new file**
- `src/components/games/FollowDirectionsGame.jsx` — **new file**
- `src/components/games/WhatsMissingGame.jsx` — **new file**
- `src/components/games/OddOneOutGame.jsx` — **new file**
- `src/components/games/SequenceBuilderGame.jsx` — **new file**
- `src/pages/MatchAndLearn.jsx` — replaced placeholder

### Deviations
- Category Sorting uses tap-to-select + tap-bucket (not drag) for simpler mobile UX, same approach as Sound Sorting game
- Follow Directions game simplified to single-item instructions across all difficulties (compound descriptors would require additional i18n infrastructure)
- Bundle size ~617KB — code-splitting planned for Module 12

---

## Design Enhancement — Fun Tropical Backgrounds
**Date:** 2026-05-09
**Status:** ✅ Complete

### Summary
Added animated tropical-themed emoji decorations to all page backgrounds, making the app feel more playful and child-friendly. Each page gets a unique themed set of floating emojis (animals, insects, flowers, leaves) at low opacity with gentle float animations.

### Changes

**New Component (`src/components/common/FunBackground.jsx`):**
- 7 themed emoji sets: default, talk, sounds, words, games, puzzles, home
- 12 fixed positions spread across bottom 60% of viewport
- Each emoji: low opacity (6%), varying sizes (18–36px), staggered float animation
- `pointer-events-none` so decorations never interfere with interaction
- `aria-hidden="true"` for accessibility

**CSS (`src/index.css`):**
- Added `@keyframes fun-float` animation with gentle vertical bob + subtle rotation
- `.fun-float` class with infinite ease-in-out animation

**AppLayout (`src/components/common/AppLayout.jsx`):**
- Accepts `bgTheme` prop, renders `FunBackground` behind all content
- Content area set to `relative z-10` to layer above decorations

**All pages updated with themed backgrounds:**
- Home → `"home"` (palms, parrots, monkeys, flowers)
- TalkBoard → `"talk"` (parrots, speech bubbles, birds, flowers)
- SoundExplorer → `"sounds"` (frogs, bells, music notes, crickets)
- WordBuilder → `"words"` (books, butterflies, caterpillars, flowers)
- MatchAndLearn → `"games"` (targets, lions, elephants, monkeys)
- Puzzles → `"puzzles"` (puzzle pieces, turtles, cacti, lizards)
- ParentDashboard → `"default"` (mixed tropical)

### Files Changed
- `src/components/common/FunBackground.jsx` — **new file**
- `src/components/common/AppLayout.jsx` — added FunBackground integration
- `src/index.css` — added fun-float animation
- `src/pages/Home.jsx` — bgTheme="home"
- `src/pages/TalkBoard.jsx` — bgTheme="talk"
- `src/pages/SoundExplorer.jsx` — bgTheme="sounds"
- `src/pages/WordBuilder.jsx` — bgTheme="words"
- `src/pages/MatchAndLearn.jsx` — bgTheme="games"
- `src/pages/Puzzles.jsx` — bgTheme="puzzles"
- `src/pages/ParentDashboard.jsx` — bgTheme="default"

## Alphabets & Numbers Modules — Placeholder Pages
**Date:** 2026-05-09
**Status:** ✅ Complete (placeholder)

### Changes
- Added Alphabets (🔠) and Numbers (🔢) module cards to Home page
- Created placeholder pages: `Alphabets.jsx` and `Numbers.jsx` (Coming Soon)
- Added routes `/alphabets` and `/numbers` in `App.jsx`
- Added i18n keys: `nav.alphabets`, `nav.numbers`, `home.modules.alphabets`, `home.modules.alphabetsDesc`, `home.modules.numbers`, `home.modules.numbersDesc`
- Added FunBackground themes for `"alphabets"` and `"numbers"`
- Updated Home grid from 5-col to 4-col to better accommodate 7 module cards
- Alphabets color: teal (#2DCDAA), Numbers color: coral pink (#FF6B8A)

### Files Changed
- `src/pages/Alphabets.jsx` — **new file** (placeholder)
- `src/pages/Numbers.jsx` — **new file** (placeholder)
- `src/pages/Home.jsx` — added 2 module cards, updated grid layout
- `src/App.jsx` — added routes + imports
- `src/data/i18n/en.json` — added i18n keys
- `src/components/common/FunBackground.jsx` — added alphabets/numbers themes

### Prompt Renumbering
Inserted Module 10 (Alphabets) and Module 11 (Numbers) prompts. Existing prompts shifted:
- `10-puzzles.md` → `12-puzzles.md`
- `11-rewards-dashboard.md` → `13-rewards-dashboard.md`
- `12-pwa-deployment.md` → `14-pwa-deployment.md`
- `13-verification-testing.md` → `15-verification-testing.md`

New prompt files:
- `docs/prompts/10-alphabets.md` — Letter recognition, phonics, tracing, letter quiz (4 modes)
- `docs/prompts/11-numbers.md` — Counting, number recognition, quantity matching, number quiz (4 modes)

---

## Module 10 — Alphabets (Letter Recognition & Phonics)
**Date:** 2026-05-10
**Status:** ✅ Complete

### Summary
Full letter learning module with 4 interactive modes: Learn Letters (flashcards), Listen & Find (audio identification), Trace Letters (canvas-based tracing), and Letter Quiz. Covers all 26 letters with uppercase/lowercase, phonetics, emoji associations, and tier-based difficulty scaling.

### Changes

**Data (`src/data/alphabets.js`):**
- 26 letters with uppercase, lowercase, emoji, word, i18nWord key, phonetic symbol, and soundHint
- Example: `{ letter: 'A', lowercase: 'a', emoji: '🍎', word: 'apple', i18nWord: 'vocabulary.apple.word', phonetic: '/æ/', soundHint: 'Open your mouth wide — "aah"' }`

**i18n (`src/data/i18n/en.json`):**
- Added full `alphabets` section (16 keys): title, 4 mode names + descriptions, canYouFind, whatLetterStartsWith, traceTheLetter, etc.
- Added 7 new vocabulary entries: queen, umbrella, van, iceCream, kite, xylophone, zebra

**Components (`src/components/alphabets/`):**
- `LearnLettersMode.jsx` — Flashcard with large uppercase/lowercase, emoji + word, phonetic badge, soundHint. AnimatePresence slide transitions, tap-to-speak, progress dots. Logs `learn-letter` to db.progress
- `ListenLetterMode.jsx` — "Can you find the letter X?" with tier-scaled choices (Tier 1: 3 choices, Tier 2: 4, Tier 3: 4 with mixed case). Bounce/shake feedback, auto-advance, star award on completion
- `TraceLetterMode.jsx` — Canvas-based letter tracing with semi-transparent guide rendered via `ctx.fillText`. Pointer events for drawing, grid-based coverage tracking (70% threshold). Tier scaling: uppercase only / alternating / lowercase with varying line thickness
- `LetterQuizMode.jsx` — "What letter does [word] start with?" quiz, 10 rounds, 4 choices, feedback animations, star award

**Page (`src/pages/Alphabets.jsx`):**
- VIEW enum (MENU/LEARN/LISTEN/TRACE/QUIZ) with AnimatePresence transitions
- 2-column mode card grid with emoji, name, description, colored Play button
- MODE_COMPONENTS map for dynamic rendering
- Context-aware back button (mode → menu → navigate(-1))
- Uses bgTheme="alphabets"

### Files Changed
- `src/data/alphabets.js` — **new file**
- `src/components/alphabets/LearnLettersMode.jsx` — **new file**
- `src/components/alphabets/ListenLetterMode.jsx` — **new file**
- `src/components/alphabets/TraceLetterMode.jsx` — **new file**
- `src/components/alphabets/LetterQuizMode.jsx` — **new file**
- `src/pages/Alphabets.jsx` — replaced placeholder
- `src/data/i18n/en.json` — added alphabets section + vocabulary

---

## Module 11 — Numbers (Counting & Number Sense)
**Date:** 2026-05-10
**Status:** ✅ Complete

### Summary
Full number learning module with 4 interactive modes: Learn Numbers (flashcards with digit, word, quantity, finger counting), Count (scattered emoji counting), Match (digit-to-quantity matching), and Number Quiz. Covers 0–20 with tier-based difficulty scaling and tens data for Tier 3.

### Changes

**Data (`src/data/numbers.js`):**
- `numberData` array (0–20) with value, word, i18nWord, emoji, fingers
- `tensData` for Tier 3 (10–100 by tens)
- `countableEmojis` array for counting exercises
- `getNumberRange(tier)` helper: Tier 1 = 0–5, Tier 2 = 0–10, Tier 3 = 0–20

**i18n (`src/data/i18n/en.json`):**
- Added full `numbers` section (34+ keys): title, 4 mode names + descriptions, howMany, tapTheNumber, whatComesAfter, whichIsMore, word0–word20, tens (ten through hundred)

**Components (`src/components/numbers/`):**
- `LearnNumbersMode.jsx` — Flashcard with large digit, word, quantity emoji grid (repeated emojis), finger counting display. Slide transitions, tap-to-speak, progress dots
- `CountMode.jsx` — 8-round counting game. Scattered emoji items with random positions, "How many?" prompt, number buttons grid, counting animation, tier-scaled ranges
- `MatchMode.jsx` — Two-column digit-to-quantity matching. Left column: digits, right column: emoji quantities. Tap-to-select matching, 3 rounds with 3–4 pairs each, tier-scaled
- `NumberQuizMode.jsx` — 10-round mixed quiz with 4 question types (identify number, how many, what comes after, which is more/less), tier-weighted question selection, 4 answer choices

**Page (`src/pages/Numbers.jsx`):**
- VIEW enum (MENU/LEARN/COUNT/MATCH/QUIZ) with AnimatePresence transitions
- 2×2 grid of mode cards with emoji, name, description, colored Play button
- Context-aware back button, bgTheme="numbers"

### Files Changed
- `src/data/numbers.js` — **new file**
- `src/components/numbers/LearnNumbersMode.jsx` — **new file**
- `src/components/numbers/CountMode.jsx` — **new file**
- `src/components/numbers/MatchMode.jsx` — **new file**
- `src/components/numbers/NumberQuizMode.jsx` — **new file**
- `src/pages/Numbers.jsx` — replaced placeholder
- `src/data/i18n/en.json` — added numbers section

---

## Module 12 — Puzzles
**Date:** 2026-05-10
**Status:** ✅ Complete

### Summary
17 puzzle types across 3 developmental tiers, with collapsible tier sections, profile-based tier locking, and a shared PuzzleWrapper for progress tracking and star earning. Puzzles range from simple shape sorting (Tier 1) to analogies and mazes (Tier 3).

### Changes

**Data (`src/data/puzzles.js`):**
- `puzzlesByTier` object with 3 tiers:
  - Tier 1 (5 puzzles): Shape Sorter, Color Match, Size Order, Peekaboo, Jigsaw (4-piece)
  - Tier 2 (6 puzzles): Pattern Completion, Counting, Letter Trace, Shadow Match, Rhyming Pairs, Jigsaw (9-piece)
  - Tier 3 (7 puzzles): Word-Picture Match, Sentence Builder, Story Sequence, Beginning Sounds, Analogies, Maze, Jigsaw (16-piece)
- Each entry: id, i18nKey, icon emoji, component name, optional config

**Shared Wrapper (`src/components/puzzles/PuzzleWrapper.jsx`):**
- Same pattern as GameWrapper: star animation, score display, play again/back buttons
- Logs to `db.progress` with `module: 'puzzles'`, awards star via `db.rewards`

**17 Puzzle Components (`src/components/puzzles/`):**
- `ShapeSorter.jsx` — Drag shapes into matching outlines (circle, square, triangle, star)
- `ColorMatch.jsx` — Match colors to their names, 8 rounds
- `SizeOrder.jsx` — Arrange items from smallest to biggest
- `Peekaboo.jsx` — Items shown briefly then hidden, find the target
- `Jigsaw.jsx` — Grid-based jigsaw with configurable piece count (4/9/16)
- `PatternCompletion.jsx` — Complete the emoji pattern sequence
- `Counting.jsx` — Count objects and select the correct number
- `LetterTrace.jsx` — Simplified letter tracing (puzzle variant)
- `ShadowMatch.jsx` — Match emoji to their silhouette/shadow
- `RhymingPairs.jsx` — Find words that rhyme
- `WordPicture.jsx` — Match words to pictures
- `SentenceBuilder.jsx` — Arrange words to form sentences
- `StorySequence.jsx` — Put story events in order
- `BeginningSound.jsx` — Identify words starting with a given letter, 8 letter sets (B/C/D/F/H/M/S/T)
- `Analogies.jsx` — "A is to B as C is to ?" with 8 analogy pairs
- `Maze.jsx` — 9×9 grid maze with recursive backtracking generation, 🐱 player, ⭐ goal, directional buttons

**Page (`src/pages/Puzzles.jsx`):**
- 3 collapsible tier sections (🌱 Seedling, 🌿 Sprout, 🌳 Tree)
- User's profile tier expanded by default, higher tiers locked (🔒)
- AnimatePresence for expand/collapse transitions
- Dynamic component loading via COMPONENTS map
- 2/3-column puzzle grid within each tier
- Context-aware back button (puzzle → tier list → navigate(-1))
- Uses bgTheme="puzzles"

### Files Changed
- `src/data/puzzles.js` — **new file**
- `src/components/puzzles/PuzzleWrapper.jsx` — **new file**
- `src/components/puzzles/ShapeSorter.jsx` — **new file**
- `src/components/puzzles/ColorMatch.jsx` — **new file**
- `src/components/puzzles/SizeOrder.jsx` — **new file**
- `src/components/puzzles/Peekaboo.jsx` — **new file**
- `src/components/puzzles/Jigsaw.jsx` — **new file**
- `src/components/puzzles/PatternCompletion.jsx` — **new file**
- `src/components/puzzles/Counting.jsx` — **new file**
- `src/components/puzzles/LetterTrace.jsx` — **new file**
- `src/components/puzzles/ShadowMatch.jsx` — **new file**
- `src/components/puzzles/RhymingPairs.jsx` — **new file**
- `src/components/puzzles/WordPicture.jsx` — **new file**
- `src/components/puzzles/SentenceBuilder.jsx` — **new file**
- `src/components/puzzles/StorySequence.jsx` — **new file**
- `src/components/puzzles/BeginningSound.jsx` — **new file**
- `src/components/puzzles/Analogies.jsx` — **new file**
- `src/components/puzzles/Maze.jsx` — **new file**
- `src/pages/Puzzles.jsx` — replaced placeholder
- `src/data/i18n/en.json` — added puzzles section with all puzzle i18n keys

### Deviations
- Maze uses tap buttons instead of swipe gestures for simpler mobile UX
- Beginning Sounds is English-only (letter-sound correspondence doesn't translate directly)
- Jigsaw uses CSS grid positioning rather than actual drag-and-drop for cross-device compatibility
- Bundle size ~716KB — code-splitting planned for Module 14

---

## Module 13 — Rewards & Parent Dashboard
**Date:** 2026-05-10
**Status:** ✅ Complete

### Summary
Full reward/motivation system (stars, streaks, stickers, avatar progression) and comprehensive parent dashboard with 7 tabs: Overview, Activity Log, Word Accuracy, Sound Progress, Puzzle Progress, Session Notes, and Settings. Includes PDF export and data reset functionality.

### Changes

**Reward Data & Logic:**
- `src/data/rewards.js` — 9 sticker definitions with unlock thresholds (star count or streak), 5 avatar levels (Beginner to Legend at 200 stars)
- `src/hooks/useRewards.js` — Central rewards hook with `useLiveQuery` reactivity, `updateStreak()` (daily streak logic), `awardStar(count)` (increments stars, detects new stickers/avatar levels), `getUnlockedStickers()`, `getAvatarLevel()`
- `src/hooks/useProgress.js` — Central progress hook with 8 methods: `addProgress`, `getProgressByModule`, `getProgressByDate`, `getTodayProgress`, `getTotalDuration`, `getWordAccuracy`, `getSoundProgress`, `getPuzzleCompletion`

**Reward Components (`src/components/rewards/`):**
- `StickerGallery.jsx` — 3-column grid of sticker slots, unlocked = vibrant with green border, locked = grayscale with lock overlay
- `NewStickerModal.jsx` — Full-screen celebration overlay with confetti, large sticker emoji, "You earned a new sticker!" message, dismiss button
- `AvatarDisplay.jsx` — Renders avatar with level badge overlay, golden glow animation at level 5 (200+ stars), 3 sizes (sm/md/lg)
- `ConfettiEffect.jsx` — 30 colored particles falling with wobble via framer motion, auto-removes after 3s

**Parent Dashboard (`src/pages/ParentDashboard.jsx`):**
- 7 tabbed sections with horizontal scrollable tab bar:
  - **Overview** — 6 stat cards (stars, streak, words, sounds, puzzles, total time) with date range filter (This Week / This Month / All Time)
  - **Activity Log** — Calendar heatmap (16 weeks, color-coded by daily minutes) + recent activity list with module emoji, type, duration, result, relative timestamps
  - **Word Accuracy** — Summary badges (mastered/learning/need practice) + word list sorted by accuracy with color-coded progress bars
  - **Sound Progress** — Sounds grouped by articulation type with 5-dot level indicators per phoneme
  - **Puzzle Progress** — 3 tier sections with checkmarks for completed puzzles
  - **Session Notes** — Full CRUD: add note (inline textarea), edit in-place, delete with confirmation
  - **Settings** — Voice rate/pitch sliders, daily goal input, profile name/tier editing, PDF export button, destructive "Reset All Data" with confirmation

**PDF Export (`src/utils/export-pdf.js`):**
- Client-side PDF generation via jsPDF
- Includes: child name, date, tier, summary stats, module activity breakdown, last 10 session notes
- Auto-downloads as `neighbright-progress-{name}-{date}.pdf`

**Home Page Integration:**
- Streak logic now runs on Home page load via `useRewards().updateStreak()`

**i18n (`src/data/i18n/en.json`):**
- Added: `rewards.awesome`, `rewards.locked`, `rewards.milestones.hundredStars`, full `rewards.avatarLevels` object (5 levels)

### Files Changed
- `src/data/rewards.js` — **new file**
- `src/hooks/useRewards.js` — **new file**
- `src/hooks/useProgress.js` — **new file**
- `src/components/rewards/StickerGallery.jsx` — **new file**
- `src/components/rewards/NewStickerModal.jsx` — **new file**
- `src/components/rewards/AvatarDisplay.jsx` — **new file**
- `src/components/rewards/ConfettiEffect.jsx` — **new file**
- `src/utils/export-pdf.js` — **new file**
- `src/pages/ParentDashboard.jsx` — replaced placeholder
- `src/pages/Home.jsx` — added streak update on load
- `src/data/i18n/en.json` — added reward/avatar i18n keys

### Deviations
- Sticker unlock conditions use simple threshold checks (totalStars >= N, currentStreak >= N) rather than complex manual triggers — simpler and more predictable
- Avatar level badges use emoji overlays rather than SVG accessories — keeps bundle lean
- Dashboard heatmap uses div grid rather than canvas — simpler, more accessible
- Bundle size ~1.1MB (jsPDF + html2canvas added) — code-splitting planned for Module 14

---

## Module 14 — PWA & GitHub Pages Deployment
**Date:** 2026-05-10
**Status:** ✅ Complete

### Summary
Progressive Web App configuration with service worker, manifest, offline support, lazy loading with code splitting, touch compatibility fixes, and GitHub Actions CI/CD for GitHub Pages deployment. No custom domain yet — deploying to `prai-git.github.io/neighbright` initially.

### Changes

**PWA Configuration:**
- `public/manifest.json` — PWA manifest with dark theme colors (#131F24 bg, #58CC02 theme), SVG icons (192/512), standalone display, education/kids/health categories
- `public/sw.js` — Service worker with cache-first for static assets, network-first for navigation (serves index.html for SPA routing), precaches app shell, cleans old caches on activate
- `public/404.html` — GitHub Pages SPA routing fix: redirects 404s to `/?redirect=<path>` for client-side routing
- `public/images/icon-192.svg` — SVG app icon 192×192 with NB branding, dark theme
- `public/images/icon-512.svg` — SVG app icon 512×512 with same branding

**index.html — PWA meta tags:**
- Added `<meta name="description">`, `<meta name="theme-color" content="#58CC02">`
- Added Apple mobile web app tags (capable, status-bar-style, title, touch-icon)
- Added `<link rel="manifest" href="/manifest.json">`
- Added Open Graph tags (og:title, og:description, og:type, og:image)

**main.jsx — Service worker registration + SPA redirect:**
- SPA redirect handling: reads `?redirect=` param, replaces history state
- Service worker registration on window load with error swallowing

**App.jsx — Lazy loading:**
- All 11 page components converted to `React.lazy()` imports
- Single `<Suspense>` wrapper around `<Routes>` with branded loading spinner fallback
- Loading fallback: dark bg, spinning green ring, "Loading…" text

**vite.config.js — Code splitting:**
- `manualChunks` function splitting vendor (react/react-dom/react-router), motion (framer-motion), and db (dexie) into separate chunks
- Rolldown-compatible function syntax (not object)

**GitHub Actions (`.github/workflows/deploy.yml`):**
- Triggers on push to main + manual workflow_dispatch
- Node 20, npm ci, npm run build
- Uses `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`
- Proper permissions (contents: read, pages: write, id-token: write)
- Concurrency group to cancel in-progress deploys

**Touch Compatibility Fixes (pre-Module 14):**
- `index.html` — Added `viewport-fit=cover` for notch/safe-area handling
- `NavBar.jsx` — Home icon and avatar buttons bumped to w-12 h-12 (48px touch targets)
- `LanguageSwitcher.jsx` — Globe button bumped to w-12 h-12, changed mousedown to pointerdown
- `TraceLetterMode.jsx` — Prev/next arrow buttons bumped to w-12 h-12
- `src/index.css` — Added `@media (hover: none)` guard to prevent sticky hover on touch devices

### Build Output
- 33 chunks, code-split by page and vendor
- vendor: 223KB (71KB gzip), motion: 124KB (40KB gzip), db: 103KB (34KB gzip)
- Each page is its own chunk (loaded on navigation)
- Total build time: ~700ms

### Files Changed
- `index.html` — PWA meta tags, Open Graph, Apple mobile web app
- `src/main.jsx` — service worker registration, SPA redirect
- `src/App.jsx` — React.lazy + Suspense for all pages
- `vite.config.js` — manualChunks code splitting
- `public/manifest.json` — **new file**
- `public/sw.js` — **new file**
- `public/404.html` — **new file**
- `public/images/icon-192.svg` — **new file**
- `public/images/icon-512.svg` — **new file**
- `.github/workflows/deploy.yml` — **new file**
- `src/components/common/NavBar.jsx` — touch target fix
- `src/components/common/LanguageSwitcher.jsx` — touch target + pointerdown fix
- `src/components/alphabets/TraceLetterMode.jsx` — touch target fix
- `src/index.css` — hover guard for touch devices

### Deviations
- SVG icons used instead of PNG — avoids needing image generation tools, scales perfectly
- No custom domain / CNAME / Porkbun DNS setup — deferred until after initial user testing
- manualChunks uses function syntax (not object) due to Vite 8 + Rolldown requirement
- jsPDF not given its own chunk — it's only imported by ParentDashboard which is already lazy-loaded
