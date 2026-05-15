# NeighBright

**Free speech therapy and learning tools for children**

NeighBright is a free, bilingual (English, French) web application for children ages 1-8 with speech delays. It combines AAC communication tools, articulation practice, vocabulary building, receptive language games, alphabet and number learning, and cognitive puzzles — all grounded in evidence-based speech therapy techniques.

**Live:** https://prai-git.github.io/neighbright/

## Features

- **Talk Board** — AAC communication board with categories, picture cards, sentence building, and text-to-speech. Camera support for custom photo cards.
- **Sound Explorer** — 24 consonant sounds with mouth diagrams, 5-level articulation progression, phonics breakdown, record & compare.
- **Word Builder** — 240+ vocabulary words across 12 categories with Learn, Listen & Point, and Say It modes.
- **Match & Learn** — 6 receptive language games: picture matching, category sorting, follow directions, what's missing, odd one out, sequence builder.
- **Alphabets** — Letter recognition with flashcards, listen & find, canvas tracing, letter quiz, and ASL sign language display.
- **Numbers** — Counting and number sense (0-20) with flashcards, counting games, digit-quantity matching, quizzes, and ASL signs.
- **Puzzles** — 17 puzzle types across 3 developmental tiers, from shape sorting to analogies and mazes.
- **Parent Dashboard** — Progress tracking, activity logs, word accuracy, sound progress, session notes, PDF export, and settings.
- **Rewards** — Stars, streaks, sticker gallery, and avatar progression to motivate daily practice.

## Tech Stack

- React 19 + Vite 8 + Tailwind CSS 4
- Framer Motion for animations
- Dexie.js (IndexedDB) for offline data storage
- Web Speech API for text-to-speech
- MediaRecorder API for record & compare
- jsPDF for progress report export
- GitHub Pages deployment via GitHub Actions

## Getting Started

```bash
npm install
npm run dev
```

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via GitHub Actions.

## License

MIT - Praveen Rai 2026
