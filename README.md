# NeighBright

**Free speech therapy and learning tools for children**

NeighBright is a free, bilingual (English & French) web application for children ages 1–8 with speech delays. It combines AAC communication tools, articulation practice, vocabulary building, receptive language games, alphabet and number learning, and cognitive puzzles — all grounded in evidence-based speech therapy techniques.

No account required. No download. Works on any phone, tablet, or computer.

**Live:** https://prai-git.github.io/neighbright/

## Features

- **Talk Board** — AAC communication board with 10 category groups, picture cards, sentence building, and text-to-speech. Support for custom vocabulary cards and hiding cards per child's needs.
- **Sound Explorer** — All 24 English consonant sounds with mouth placement diagrams, 5-level articulation progression (isolation → syllables → words → phrases → sentences), and record & compare.
- **Word Builder** — 253 vocabulary words across 10 categories (feelings, animals, food, actions, people, places, body, clothes, colors, routines) with Learn, Listen & Point, and Say It modes. Uses a spaced-repetition algorithm to surface words the child struggles with more frequently.
- **Match & Learn** — 6 receptive language games: picture matching, category sorting, follow directions, what's missing, odd one out, and sequence builder.
- **Alphabets** — Letter recognition with flashcards, listen & find, canvas tracing, letter quiz, and ASL sign language display for all 26 letters.
- **Numbers** — Counting and number sense (0–20) with flashcards, counting games, digit-quantity matching, quizzes, and ASL signs.
- **Puzzles** — 18 puzzle types across 3 developmental tiers: Tier 1 (ages 1–3): shape sorter, color match, size order, peekaboo, 4-piece jigsaw; Tier 2 (ages 3–5): pattern completion, counting, letter trace, shadow match, rhyming pairs, 9-piece jigsaw; Tier 3 (ages 5–8): word-picture match, sentence builder, story sequence, beginning sounds, analogies, maze, 16-piece jigsaw.
- **Parent Dashboard** — Progress tracking, activity logs, word accuracy stats, sound progress, session notes, PDF export, daily goal setting, and per-module toggles.
- **Onboarding** — Child profile setup with name, avatar, and developmental tier selection (Early Learners / Growing Minds / Ready to Learn).
- **Rewards** — Stars, daily streaks, 9 milestone stickers, and a 5-tier avatar progression system to motivate daily practice.

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19, React Router v7, Tailwind CSS v4 |
| Animation | Framer Motion v12 |
| Local storage | Dexie.js v4 (IndexedDB) |
| Speech | Web Speech API (TTS), MediaRecorder API (record & compare) |
| Export | jsPDF v4 |
| Build | Vite 8, code-split into `vendor`, `motion`, and `db` chunks |
| Deployment | GitHub Pages via GitHub Actions (`deploy.yml`) |
| i18n | Custom `useTranslation` hook with English and French JSON locale files |

### Project Structure

```
src/
├── pages/          # Route-level page components (lazy-loaded)
├── components/     # Feature components grouped by module
│   ├── common/     # Shared UI: NavBar, Modal, Button, ProgressBar, etc.
│   ├── talkboard/  # Talk Board components
│   ├── sounds/     # Sound Explorer components
│   ├── words/      # Word Builder components
│   ├── games/      # Match & Learn game components
│   ├── puzzles/    # Puzzle components
│   ├── alphabets/  # Alphabet components
│   ├── numbers/    # Number components
│   ├── rewards/    # Sticker gallery, avatar, confetti
│   └── landing/    # Public landing page sections
├── contexts/       # LanguageContext, ProfileContext
├── data/           # Static content: vocabulary, sounds, puzzles, alphabets,
│   │               #   numbers, rewards, sign language, sequences
│   └── i18n/       # en.json and fr.json locale strings
├── db/             # Dexie database schema (profile, progress, rewards,
│   │               #   sessionNotes, customVocabulary, settings, hiddenCards)
├── hooks/          # useSpeech, useProgress, useRewards, useAudioRecorder,
│                   #   useTranslation
└── utils/          # spaced-repetition, game-helpers, export-pdf
```

## Getting Started

```bash
npm install
npm run dev        # Dev server at http://localhost:5173/neighbright/
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint
```

### Translation Script

Locale files are generated with OpenAI. Requires an `OPENAI_API_KEY` in a `.env` file (see `.env.example`):

```bash
npm run translate
```

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via the `.github/workflows/deploy.yml` workflow.

## License

MIT — Praveen Rai 2026
