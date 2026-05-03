# Module 05 — Onboarding & Profile

**Scope:** Build the onboarding flow (language selection → profile creation), the profile context integration, the app home screen with module cards, and route guards that redirect to onboarding if no profile exists.

**Prerequisite:** Modules 01–04 complete.

---

## 1. Onboarding Flow

Route: `/onboarding` → `src/pages/Onboarding.jsx`

A multi-step wizard. Does NOT use `AppLayout`. Clean, centered layout on `bg-background`.

### Step 1: Language Selection

- Title: `t('onboarding.languageStep')`
- Three large tappable cards, vertically stacked on mobile, horizontal on desktop:
  - 🇺🇸 **English** — tap to select
  - 🇮🇳 **हिन्दी** — tap to select
  - 🇫🇷 **Français** — tap to select
- Selected card: `ring-3 ring-primary` highlight
- Selecting a language immediately calls `changeLanguage()` — all text on this page re-renders
- "Next" button at bottom: `t('onboarding.next')`

### Step 2: Profile Setup

- Title: `t('onboarding.profileStep')`
- **Name input:** `Input` component, label = `t('onboarding.nameLabel')`, placeholder = `t('onboarding.namePlaceholder')`. Required, minimum 1 character.
- **Avatar picker:** Grid of 24 SVG avatar characters. `grid grid-cols-4 md:grid-cols-6 gap-3`. Each is a circular `w-16 h-16` button. Selected avatar gets `ring-3 ring-primary`. Use emoji as placeholder avatars until SVGs are created: 🐶🐱🐰🐻🦊🐼🦁🐸🐵🐧🦄🐲🐮🐷🐯🐨🐹🐝🐢🦋🐙🐠🦕🐳
- **Tier selector:** Three `Card` components, only one selectable at a time:
  - Tier 1: `t('onboarding.tier1Name')` + `t('onboarding.tier1Desc')` + 🌱 emoji
  - Tier 2: `t('onboarding.tier2Name')` + `t('onboarding.tier2Desc')` + 🌿 emoji
  - Tier 3: `t('onboarding.tier3Name')` + `t('onboarding.tier3Desc')` + 🌳 emoji
- Selected tier card: `ring-3 ring-primary`
- "Back" button (secondary) + "Start Practicing!" button (primary CTA)
- On submit: call `saveProfile({ name, avatarKey, tier })` from `useProfile()`, then navigate to `/home`

### Validation

- Name is required — show inline error via `Input` error prop if empty on submit
- Avatar is required — if none selected, highlight the avatar section with a subtle shake animation
- Tier is required — same treatment

### Animation

- Steps transition with a horizontal slide (step 1 slides left, step 2 slides in from right) via `AnimatePresence` and `motion.div`
- Progress indicator at top: two dots, active dot is `bg-primary`, inactive is `bg-gray-200`

---

## 2. Route Guard

Create a wrapper component that redirects to onboarding if no profile exists.

```javascript
// src/components/common/RequireProfile.jsx
import { Navigate } from 'react-router-dom';
import { useProfile } from '../../contexts/ProfileContext';
import { LoadingSpinner } from './';

export default function RequireProfile({ children }) {
  const { profile, loading } = useProfile();

  if (loading) return <LoadingSpinner />;
  if (!profile) return <Navigate to="/onboarding" replace />;

  return children;
}
```

Update `App.jsx` — wrap all app routes (not landing, not onboarding) with `RequireProfile`:

```javascript
<Route path="/home" element={<RequireProfile><Home /></RequireProfile>} />
<Route path="/talk-board" element={<RequireProfile><TalkBoard /></RequireProfile>} />
// ... same for all app routes
```

Also: if a profile exists and user visits `/` (landing) or `/onboarding`, redirect to `/home`.

---

## 3. Home Screen

Route: `/home` → `src/pages/Home.jsx`

Uses `AppLayout`. This is the main hub after profile is set.

### Layout

- **Greeting:** `t('home.greeting', { name: profile.name })` in large display text with the child's avatar emoji next to it
- **Star counter + streak badge** in a row below the greeting (using `StarCounter` and `StreakBadge` components, reading from IndexedDB rewards table)
- **Word of the Day** card — a `Card` with accent color, showing a random vocabulary word (emoji + word + tap-to-hear). Changes daily (use date-based seed).
- **Module grid:** responsive grid of 5 module cards
  - `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
  - Each card: large emoji icon, module name, one-line description, `Card` with `onClick` → navigates to module route
  - Cards:
    1. 💬 Talk Board — coral accent — `/talk-board`
    2. 🔊 Sound Explorer — sky accent — `/sound-explorer`
    3. 🔤 Word Builder — mint accent — `/word-builder`
    4. 🎮 Match & Learn — purple accent (`#DDA0DD`) — `/match-and-learn`
    5. 🧩 Puzzles — sunshine accent — `/puzzles`
- **Daily Goal** mini-widget at bottom: `ProgressBar` showing minutes practiced today vs. goal. Label: `t('home.dailyGoal')`.

### Data Loading

On mount, read from IndexedDB:
- `rewards` table → star count, streak
- `progress` table → filter today's entries → calculate total `durationSecs` for daily goal progress
- `settings` table → daily goal minutes

---

## Acceptance Criteria

- [ ] First visit to any app route (e.g., `/home`) redirects to `/onboarding`
- [ ] Onboarding Step 1: language selection works, text re-renders on language change
- [ ] Onboarding Step 2: name, avatar, and tier are all required; validation errors show inline
- [ ] Completing onboarding saves profile to IndexedDB and navigates to `/home`
- [ ] Subsequent visits skip onboarding and go directly to `/home`
- [ ] Home screen shows personalized greeting with child's name
- [ ] Home screen shows star counter and streak badge (both 0 initially)
- [ ] All 5 module cards are visible and navigate to correct routes
- [ ] Word of the Day shows a word with emoji and audio (tap to hear via `useSpeech`)
- [ ] Daily goal progress bar renders (0% initially)
- [ ] AppLayout renders correctly: bottom nav on mobile, side nav on desktop
- [ ] Visiting `/` when profile exists redirects to `/home`
- [ ] All text uses `t()` — switching language on home screen re-renders everything
- [ ] Step transition animations work smoothly
