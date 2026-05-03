# NeighBright — Phase 1 Development Program

**Master Prompt for AI-Assisted Development**

---

## Project Summary

NeighBright is a free, multilingual (English, Hindi, French) speech therapy and cognitive development web application for children ages 1–8 with speech delays. Phase 1 is a fully static React SPA hosted on GitHub Pages. No backend, no accounts. One child profile per browser. All data stored in IndexedDB. All content bundled at build time.

**Live URL:** `neighbright.yourdomain.com` (GitHub Pages + Porkbun CNAME)

---

## Tech Stack (Locked — Do Not Substitute)

| Concern | Technology | Version |
|---|---|---|
| Framework | React | 18+ |
| Build tool | Vite | 6+ |
| Styling | Tailwind CSS | 4+ |
| Animation | Framer Motion | 11+ |
| Routing | React Router | v6 |
| Local DB | Dexie.js (IndexedDB) | 4+ |
| Speech | Web Speech API | Browser native |
| Recording | MediaRecorder API | Browser native |
| PDF export | jsPDF | 2+ |
| Fonts | Nunito, Noto Sans Devanagari | Google Fonts |
| Translation | OpenAI API (build-time script) | gpt-4o |
| Hosting | GitHub Pages | — |
| CI/CD | GitHub Actions | — |

---

## Development Modules

This program is divided into 13 sub-modules. Each module is a self-contained markdown file that can be used as a standalone prompt for Claude or Copilot. **Execute them in order** — each module builds on the output of the previous one.

| Order | File | Scope | Est. Effort |
|---|---|---|---|
| 1 | [01-project-scaffold.md](./01-project-scaffold.md) | Vite + React + Tailwind project setup, folder structure, dependencies, Dexie.js schema, base routing | Day 1–2 |
| 2 | [02-design-system.md](./02-design-system.md) | Color tokens, typography, all reusable UI components (Button, Card, Modal, NavBar, Input, ProgressBar, etc.) | Day 3–5 |
| 3 | [03-i18n-system.md](./03-i18n-system.md) | en.json master strings, LanguageContext, useTranslation hook, OpenAI translate script, language switcher component | Day 6–8 |
| 4 | [04-landing-page.md](./04-landing-page.md) | Full public landing page: hero, features, how-it-works, audience cards, evidence section, footer | Day 9–12 |
| 5 | [05-onboarding-profile.md](./05-onboarding-profile.md) | Onboarding flow, profile creation, avatar picker, tier selector, ProfileContext, home screen shell | Day 13–16 |
| 6 | [06-talk-board.md](./06-talk-board.md) | AAC communication board: categories, picture cards, sentence strip, TTS, quick phrases, custom cards | Day 17–24 |
| 7 | [07-sound-explorer.md](./07-sound-explorer.md) | Articulation practice: phoneme data, mouth SVGs, 5-level progression, record & compare, sound sorting game | Day 25–32 |
| 8 | [08-word-builder.md](./08-word-builder.md) | Vocabulary: 240+ words × 3 languages, Learn/Listen/Say modes, spaced repetition, Word of the Day | Day 33–40 |
| 9 | [09-match-learn-games.md](./09-match-learn-games.md) | 6 receptive language games: matching, sorting, directions, missing, odd-one-out, sequencing | Day 41–48 |
| 10 | [10-puzzles.md](./10-puzzles.md) | 3 tiers of cognitive puzzles: shape sorter, jigsaws, patterns, counting, letter tracing, analogies, mazes | Day 49–60 |
| 11 | [11-rewards-dashboard.md](./11-rewards-dashboard.md) | Stars, streaks, stickers, avatar progression, parent dashboard, session notes, settings, PDF export | Day 61–70 |
| 12 | [12-pwa-deployment.md](./12-pwa-deployment.md) | Service worker, PWA manifest, GitHub Actions CI/CD, Porkbun DNS, performance optimization | Day 71–75 |
| 13 | [13-verification-testing.md](./13-verification-testing.md) | Cross-device testing, accessibility audit, i18n verification, Lighthouse, regression checklist, sign-off | Day 76–80 |

---

## How to Use This Program

### For each module:

1. **Open the module's `.md` file** — it contains everything the AI needs: file paths, component signatures, data structures, styling specs, and acceptance criteria.
2. **Paste it as a prompt** to Claude or Copilot. If the module is large, you may split it at the marked `--- SPLIT POINT ---` boundaries.
3. **Review the generated code** against the acceptance criteria listed at the bottom of each module.
4. **Test locally** — `npm run dev` and verify in Chrome DevTools (desktop + mobile responsive modes).
5. **Commit and proceed** to the next module.

### Rules for AI code generation:

- **Single-file components** — each React component in its own file, default export.
- **Tailwind only** — no inline styles, no CSS modules, no styled-components. Use Tailwind utility classes exclusively.
- **Functional components + hooks** — no class components.
- **Named exports for hooks** — `export function useSpeech()`, not default.
- **All user-facing strings via `t()` function** — never hardcode English text in JSX. Use `{t('key.path')}` everywhere.
- **Dexie.js for all persistence** — never use raw localStorage for structured data. localStorage is only for the language preference key.
- **Framer Motion for animations** — no CSS keyframe animations, no setTimeout-based animations.
- **Mobile-first responsive** — write base styles for phone, add `md:` and `lg:` breakpoints to scale up.
- **Accessibility always** — semantic HTML, ARIA labels, keyboard handlers, focus management.
- **No external API calls at runtime** — the deployed app must work fully offline after first load.
- **No TypeScript in Phase 1** — plain JSX for faster iteration. TypeScript is a Phase 2 consideration.
- **All comments in English** — even for Hindi/French content sections.

---

## Global File Structure Reference

```
neighbright/
├── public/
│   ├── audio/
│   ├── images/
│   │   ├── avatars/                # 24+ SVG avatar characters
│   │   └── mouth/                  # SVG mouth diagrams per sound group
│   ├── manifest.json
│   ├── sw.js
│   └── CNAME
├── src/
│   ├── components/
│   │   ├── common/                 # Reusable UI primitives
│   │   ├── landing/                # Landing page sections
│   │   ├── talkboard/              # AAC board components
│   │   ├── sounds/                 # Sound Explorer components
│   │   ├── words/                  # Word Builder components
│   │   ├── games/                  # Match & Learn components
│   │   ├── puzzles/                # Puzzle components
│   │   ├── rewards/                # Reward system components
│   │   └── dashboard/              # Parent dashboard components
│   ├── contexts/
│   │   ├── LanguageContext.jsx
│   │   └── ProfileContext.jsx
│   ├── data/
│   │   ├── i18n/
│   │   │   ├── en.json
│   │   │   ├── hi.json
│   │   │   ├── fr.json
│   │   │   └── index.js
│   │   ├── vocabulary.js
│   │   ├── sounds.js
│   │   ├── puzzles.js
│   │   └── rewards.js
│   ├── hooks/
│   │   ├── useSpeech.js
│   │   ├── useAudioRecorder.js
│   │   └── useProgress.js
│   ├── db/
│   │   └── index.js
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Onboarding.jsx
│   │   ├── Home.jsx
│   │   ├── TalkBoard.jsx
│   │   ├── SoundExplorer.jsx
│   │   ├── WordBuilder.jsx
│   │   ├── MatchAndLearn.jsx
│   │   ├── Puzzles.jsx
│   │   └── ParentDashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── scripts/
│   └── translate.js
├── .github/workflows/
│   └── deploy.yml
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .env.example
├── .gitignore
└── README.md
```

---

## Color Token Reference (Use Everywhere)

```
Primary:        #FF6B6B  (coral)       → primary actions, branding
Secondary:      #74B9FF  (sky)         → secondary actions, links
Accent:         #FECA57  (sunshine)    → stars, rewards, highlights
Success:        #55E6C1  (mint)        → correct, complete
Background:     #FFF9F0  (cream)       → page backgrounds
Surface:        #FFFFFF  (white)       → cards, modals
Text Primary:   #2D3436  (charcoal)    → headings, body
Text Secondary: #636E72  (slate)       → labels, descriptions
Error:          #E17055  (soft red)    → validation, alerts
```

---

## Breakpoint Reference

```
Mobile (default):  < 640px   → single column, bottom nav
Tablet (md:):      640–1024px → two columns, side nav
Desktop (lg:):     > 1024px  → three columns, persistent sidebar
```

---

## Module Dependency Map

```
01-scaffold ─────► 02-design-system ─────► 03-i18n
                                              │
                   ┌──────────────────────────┘
                   ▼
              04-landing ─────► 05-onboarding
                                    │
              ┌─────────────────────┤
              ▼                     ▼
         06-talk-board         07-sound-explorer
              │                     │
              ▼                     ▼
         08-word-builder       09-games
              │                     │
              └──────────┬──────────┘
                         ▼
                    10-puzzles
                         │
                         ▼
                11-rewards-dashboard
                         │
                         ▼
                 12-pwa-deployment
                         │
                         ▼
              13-verification-testing
```

Modules 06 through 10 (the therapy modules) can be developed in any order after 05 is complete, but the order listed above is recommended because later modules reuse patterns established by earlier ones.

---

## Final Deliverable

At the end of all 13 modules, NeighBright should be:

- Live at `neighbright.yourdomain.com`
- Fully functional in English, Hindi, and French
- Offline-capable as a PWA
- Lighthouse 95+ on all four categories
- WCAG 2.1 AA compliant
- Tested on iOS Safari, Android Chrome, Firefox, and desktop Chrome/Edge
- Receiving user feedback via embedded form or GitHub Issues

---

*Execute modules in order. Test after each. Ship when Module 13 passes.*
