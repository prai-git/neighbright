# Module 15 — Verification & Testing

**Scope:** Comprehensive quality assurance across all dimensions: cross-device testing, accessibility audit, i18n verification, performance benchmarks, functional regression, and sign-off checklist. This module ensures the final product is production-ready.

**Prerequisite:** Modules 01–14 complete.

---

## 1. Testing Strategy

NeighBright Phase 1 uses manual testing with structured checklists rather than automated test suites. This is a deliberate choice — the primary interactions (touch, drag, audio, speech synthesis, canvas drawing) are difficult to automate in unit tests and are better verified by a human tester on real devices. Automated testing is a Phase 2 consideration.

**Testing environments:**
- localhost (Mac, Chrome DevTools responsive mode)
- Real iPhone (Safari)
- Real Android phone (Chrome)
- iPad or Android tablet
- Desktop Chrome, Firefox, Edge
- Deployed GitHub Pages site (final pass)

---

## 2. Functional Regression Checklist

Run this checklist after completing each module and again before final deployment.

### 2.1 Landing Page
- [ ] Page loads without errors on all test devices
- [ ] All 7 sections render in correct order
- [ ] Language switcher works — all text re-renders in Hindi and French
- [ ] Hindi text renders in Devanagari script without missing glyphs
- [ ] French accented characters (é, è, ê, à, ç, ô, ù) render correctly
- [ ] "Get Started" button navigates to `/onboarding`
- [ ] Scroll animations trigger on all sections
- [ ] Footer links are clickable
- [ ] No horizontal overflow on any viewport width (check 320px, 375px, 414px)

### 2.2 Onboarding
- [ ] Step 1 (Language): selecting a language highlights the card and changes text
- [ ] Step 2 (Profile): name validation shows error on empty submit
- [ ] Step 2: avatar selection highlights the chosen avatar
- [ ] Step 2: tier selection highlights the chosen tier
- [ ] Completing onboarding saves profile to IndexedDB (verify in DevTools → Application → IndexedDB)
- [ ] After onboarding, subsequent visits go directly to `/home`
- [ ] Step transition animation plays smoothly

### 2.3 Home Screen
- [ ] Greeting shows child's name
- [ ] Star counter shows 0 initially
- [ ] Streak badge shows 0 initially
- [ ] Word of the Day displays with emoji and audio
- [ ] All 5 module cards visible and navigate to correct routes
- [ ] AppLayout: bottom nav on mobile, side nav on tablet/desktop
- [ ] Daily goal progress bar renders

### 2.4 Talk Board
- [ ] All 10 categories load with correct icons and translated names
- [ ] Tapping a category switches the card grid
- [ ] Tapping a word card: adds to sentence strip + speaks the word
- [ ] Sentence strip: words appear in order, tappable to remove
- [ ] Speak button: reads full sentence in active language
- [ ] Clear button: empties the sentence strip
- [ ] Quick phrases: each speaks immediately on tap
- [ ] Custom card creation: modal opens, validates, saves, card appears in grid
- [ ] TTS works in English, Hindi (if voice available), French
- [ ] Grid reflows correctly: 3 cols phone, 4 tablet, 5 desktop

### 2.5 Sound Explorer
- [ ] All 7 sound groups display with correct names
- [ ] All 24 consonant sounds present within their groups
- [ ] Mouth diagram SVGs load and display correctly
- [ ] Each sound's 5-level practice view loads with correct content
- [ ] "Tap to hear" plays audio for each level's content
- [ ] Record button works (if MediaRecorder supported)
- [ ] Playback of recording works
- [ ] If MediaRecorder unsupported: record button hidden, no crash
- [ ] Sound sorting game: 10 rounds, correct/incorrect feedback, final score
- [ ] Star awarded on completion
- [ ] UI text translated; phoneme content in English

### 2.6 Word Builder
- [ ] All 12 categories display with icons and translated names
- [ ] Mode selector (Learn/Listen/Say) switches content
- [ ] Learn mode: flashcards swipe, tap plays audio in active language
- [ ] Listen & Point: audio prompt plays in active language, correct/incorrect feedback works
- [ ] Say It: thumbs up/down tracking works
- [ ] Number of choices scales by tier (2/3/4)
- [ ] Spaced repetition: struggled words appear more often in subsequent sessions
- [ ] All 240+ words render correctly in English, Hindi, French
- [ ] Word of the Day on Home changes daily

### 2.7 Match & Learn Games
- [ ] Game selection shows all 6 games
- [ ] Each game has working Easy/Medium/Hard difficulty
- [ ] Picture Match: flip animation, pair matching, completion confetti
- [ ] Category Sorting: drag or tap-to-place works on touch devices
- [ ] Follow Directions: audio instruction plays, correct item detection
- [ ] What's Missing: memorization → hide → answer flow works
- [ ] Odd One Out: 3+1 logic correct, explanation spoken
- [ ] Sequence Builder: tap/drag ordering, correct sequence celebration
- [ ] All games award stars
- [ ] All games work in Hindi and French (instructions translated)

### 2.8 Puzzles
- [ ] Puzzle selection shows 3 tiers with correct lock/unlock state
- [ ] Tier based on child's profile setting
- [ ] Tier 1 — all 5 puzzles playable and completable
- [ ] Tier 2 — all 6 puzzles playable, letter tracing canvas works on touch
- [ ] Tier 3 — all 7 puzzles playable, maze navigation works
- [ ] Jigsaw works at 4, 9, and 16 pieces
- [ ] Completion confetti + star on every puzzle
- [ ] English-only puzzles (rhyming, beginning sounds) show notice if Hindi/French active

### 2.9 Rewards
- [ ] Stars increment after each activity across all modules
- [ ] Streak increments on daily use, resets after gap
- [ ] Sticker gallery shows locked/unlocked state
- [ ] New sticker modal triggers with confetti at milestones
- [ ] Avatar accessories appear at correct star thresholds

### 2.10 Parent Dashboard
- [ ] Overview numbers are correct (cross-reference with IndexedDB data)
- [ ] Activity heatmap renders with correct colors
- [ ] Word accuracy table sorts correctly, colors match scores
- [ ] Sound progress shows correct level completion per sound
- [ ] Puzzle progress shows correct completion checkmarks
- [ ] Session notes: add, edit, delete all work
- [ ] Settings changes take effect immediately:
  - Language change re-renders all text
  - Voice settings affect TTS playback
  - Module toggles hide/show modules on Home
  - Tier change updates puzzle access
  - Daily goal updates the progress bar
- [ ] PDF export downloads a file with correct content
- [ ] "Reset All Data" clears everything (verify IndexedDB is empty after)

---

## 3. Cross-Device Testing Matrix

Test on each device × browser combination. Mark pass/fail.

| Test | iPhone Safari | Android Chrome | iPad Safari | Desktop Chrome | Desktop Firefox | Desktop Edge |
|---|---|---|---|---|---|---|
| Landing page renders | | | | | | |
| Language switch to Hindi | | | | | | |
| Language switch to French | | | | | | |
| Onboarding flow | | | | | | |
| Talk Board: tap cards | | | | | | |
| Talk Board: TTS speaks | | | | | | |
| Sound Explorer: levels | | | | | | |
| Record & Compare | | | | | | |
| Word Builder: swipe cards | | | | | | |
| Word Builder: Listen mode | | | | | | |
| Games: drag/tap interactions | | | | | | |
| Puzzles: letter tracing | | | | | | |
| Puzzles: maze navigation | | | | | | |
| Dashboard: charts render | | | | | | |
| PDF export downloads | | | | | | |
| PWA: Add to Home Screen | | | | | | |
| Offline: app works after disconnect | | | | | | |
| Bottom nav visible on mobile only | | | | | | |
| Side nav visible on tablet/desktop only | | | | | | |
| No horizontal scroll anywhere | | | | | | |

---

## 4. Accessibility Audit (WCAG 2.1 AA)

### Automated
Run Lighthouse accessibility audit on every page. Target: 95+.

```bash
# Run via Chrome DevTools → Lighthouse tab
# Or via CLI:
npx lighthouse https://neighbright.yourdomain.com --only-categories=accessibility
```

### Manual Checks

- [ ] **Keyboard navigation:** Tab through every interactive element on every page. Confirm visible focus rings.
- [ ] **Focus order:** Logical tab order (top-to-bottom, left-to-right). No focus traps except modals.
- [ ] **Screen reader:** Test landing page and dashboard with VoiceOver (Mac/iOS) or TalkBack (Android). All buttons have labels. Images have alt text. Decorative elements are hidden (`aria-hidden`).
- [ ] **Color contrast:** All text meets 4.5:1 contrast ratio against its background. Verify with DevTools accessibility inspector.
  - `#2D3436` on `#FFF9F0` (charcoal on cream) = 13.5:1 ✓
  - `#636E72` on `#FFFFFF` (slate on white) = 4.9:1 ✓
  - `#FFFFFF` on `#FF6B6B` (white on coral) = 3.5:1 ⚠️ → ensure button text is large enough (18px+) or darken coral
- [ ] **Touch targets:** All buttons and interactive elements ≥ 48×48px
- [ ] **Reduced motion:** Enable `prefers-reduced-motion` in DevTools. Confirm animations are disabled or reduced.
- [ ] **High contrast mode:** If implemented, toggle and verify readability.
- [ ] **Labels:** Every form input has a visible `<label>` or `aria-label`
- [ ] **Error messages:** Form validation errors are associated with inputs via `aria-describedby`

---

## 5. Internationalization Verification

### Hindi (हिन्दी)
- [ ] All UI strings display in Devanagari
- [ ] No missing glyphs (boxes or question marks)
- [ ] Text doesn't overflow containers (Devanagari can be wider)
- [ ] Noto Sans Devanagari loads correctly (check Network tab)
- [ ] TTS speaks Hindi words (test on Android Chrome — best Hindi voice support)
- [ ] If Hindi TTS voices unavailable (e.g., iOS Safari): fallback message displays
- [ ] Vocabulary words are natural translations (spot-check 20 words with a Hindi speaker if possible)
- [ ] Quick phrases make sense in Hindi context

### French (Français)
- [ ] All UI strings display with correct accented characters
- [ ] Accented characters: é, è, ê, ë, à, â, ç, ô, ù, î, ï, ü all render
- [ ] TTS speaks French words with acceptable pronunciation
- [ ] Informal "tu" form used (not "vous") — verify in a few UI strings
- [ ] Vocabulary translations are natural (spot-check 20 words)

### Language Switching
- [ ] Switching language mid-session re-renders all visible text immediately
- [ ] Language persists across page reloads
- [ ] Language persists across app restart (close and reopen)
- [ ] Word Builder audio switches language on switch
- [ ] Talk Board TTS switches language on switch

---

## 6. Performance Benchmarks

### Lighthouse Targets (deployed site)

| Category | Target | How to Measure |
|---|---|---|
| Performance | 90+ | Lighthouse in Chrome DevTools |
| Accessibility | 95+ | Lighthouse |
| Best Practices | 95+ | Lighthouse |
| SEO | 90+ | Lighthouse |
| PWA | All checks pass | Lighthouse → PWA section |

### Load Times

| Metric | Target | Measurement |
|---|---|---|
| First Contentful Paint | < 1.5s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Time to Interactive | < 3.0s | Lighthouse |
| Total Bundle Size (gzipped) | < 500KB | `ls -la dist/assets/` + gzip estimation |
| Service Worker Cache Size | < 5MB | DevTools → Application → Cache Storage |

### Runtime Performance
- [ ] No jank during page transitions (60fps on mobile)
- [ ] Card grid scrolls smoothly with 20+ cards
- [ ] Canvas-based puzzles (letter tracing, jigsaw, maze) run at 60fps
- [ ] Memory usage stays below 100MB during extended sessions (check DevTools → Memory)
- [ ] No memory leaks after navigating between all pages 10 times

---

## 7. Edge Case Testing

- [ ] **Empty state:** Dashboard with zero progress — shows friendly empty messages
- [ ] **Long name:** Child name with 30+ characters — text truncates gracefully
- [ ] **Rapid tapping:** Quickly tap Talk Board cards — sentence strip handles rapid additions
- [ ] **Double submit:** Quickly tap onboarding "Start" button twice — doesn't create duplicate profiles
- [ ] **Category with few words:** Custom category with only 1 word — Listen & Point mode handles gracefully
- [ ] **Browser back/forward:** Navigate using browser back button — no crashes, correct page shows
- [ ] **Refreshing on sub-route:** Reload while on `/talk-board` — page loads correctly (SPA routing works)
- [ ] **IndexedDB unavailable:** Open in private/incognito mode — app either works (most browsers support IndexedDB in incognito) or shows a clear message
- [ ] **Clearing browser data:** Clear site data via Settings — app returns to landing/onboarding correctly
- [ ] **Screen rotation:** Rotate phone mid-game/puzzle — layout adapts without breaking

---

## 8. Security Checklist

- [ ] No API keys in the deployed code (search `dist/` for any key patterns)
- [ ] No sensitive data in localStorage or IndexedDB (only child first name, progress data)
- [ ] CSP meta tag in HTML prevents XSS
- [ ] No inline scripts in HTML (all scripts are in bundled JS files)
- [ ] External links use `rel="noopener noreferrer"`
- [ ] HTTPS enforced on deployed site
- [ ] No third-party tracking scripts or analytics beacons
- [ ] Service worker only caches from same origin

---

## 9. Content Review

- [ ] Landing page copy is clear and free of typos
- [ ] All vocabulary words have correct emoji associations (e.g., "dog" → 🐕, not 🐈)
- [ ] Mouth position descriptions are anatomically accurate
- [ ] Sound examples are correct (e.g., /p/ initial = "pop", not "shop")
- [ ] Puzzle sequences make logical sense (morning routine order is correct)
- [ ] Encouragement messages are positive and age-appropriate
- [ ] No placeholder text ("Lorem ipsum") anywhere in the app
- [ ] Evidence-based disclaimer is present and visible

---

## 10. Final Deployment Verification

After deploying to GitHub Pages with custom domain:

- [ ] `https://neighbright.yourdomain.com` loads correctly
- [ ] HTTP redirects to HTTPS
- [ ] All routes work via direct URL (e.g., `/talk-board`, `/dashboard`)
- [ ] Service worker installs and caches assets
- [ ] "Add to Home Screen" works on iOS and Android
- [ ] Installed PWA opens to the correct page
- [ ] Installed PWA works offline
- [ ] Open Graph preview renders correctly when sharing the URL on social media
- [ ] GitHub Actions deployment runs successfully on push to main
- [ ] README.md has screenshots and usage instructions

---

## 11. Sign-Off

All sections above must pass before NeighBright is considered production-ready for Phase 1 launch.

| Section | Status | Tested By | Date |
|---|---|---|---|
| Functional Regression | ☐ Pass / ☐ Fail | | |
| Cross-Device Testing | ☐ Pass / ☐ Fail | | |
| Accessibility Audit | ☐ Pass / ☐ Fail | | |
| i18n Verification | ☐ Pass / ☐ Fail | | |
| Performance Benchmarks | ☐ Pass / ☐ Fail | | |
| Edge Cases | ☐ Pass / ☐ Fail | | |
| Security | ☐ Pass / ☐ Fail | | |
| Content Review | ☐ Pass / ☐ Fail | | |
| Deployment Verification | ☐ Pass / ☐ Fail | | |

**Launch decision:** All sections must be "Pass" before sharing NeighBright publicly and beginning user feedback collection.

---

*When this checklist is complete and signed off, NeighBright Phase 1 is live. Begin collecting feedback for Phase 2.*

---

## Amendment — Module 15 Implementation (2026-06-13)

### Completed Actions

**i18n Verification:**
- Generated complete `fr.json` with all UI strings and 216 vocabulary words in French
- Eliminated 17 hardcoded English strings across 11 puzzle/game components — all now use `t()` translation function
- Added 19 new i18n keys to both `en.json` and `fr.json` (puzzles and games sections)
- Removed Hindi from translate.js script (Hindi was dropped in Feedback Round 1)

**Accessibility Audit:**
- Fixed non-semantic `<span>` with onClick → `<button>` (PictureCardGrid delete button)
- Added `aria-label` to 6+ emoji-only buttons (Peekaboo, PictureMatch, ShadowMatch)
- Added `aria-label` and `role="img"` to 2 canvas elements (TraceLetterMode, LetterTrace)
- Added `@media (prefers-reduced-motion: reduce)` CSS rule to disable all animations

**Security Checklist:**
- Added Content-Security-Policy meta tag (script-src 'self', font-src Google Fonts, img-src data/blob)
- Verified: no API keys in source code
- Verified: all external links have `rel="noopener noreferrer"`
- Verified: service worker caches same-origin only

**Edge Cases:**
- Added double-submit guard to onboarding (`submitting` state flag)
- Added `maxLength={30}` to child name input
- Verified: Home greeting truncates long names (has `truncate` class)
- Verified: Dashboard shows "No activity yet" empty states in all tabs

**Performance:**
- Build succeeds in ~580ms, 32 code-split chunks
- Total dist size: 1.7MB uncompressed
- Vendor chunk: 71KB gzipped, Motion: 41KB gzipped

### Remaining (Manual Testing Required)
- Cross-device testing matrix (requires real devices)
- Lighthouse scoring on deployed site
- Screen reader testing with VoiceOver/TalkBack
- Color contrast verification with DevTools
- French translation spot-check by native speaker
