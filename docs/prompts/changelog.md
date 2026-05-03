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
