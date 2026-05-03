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
