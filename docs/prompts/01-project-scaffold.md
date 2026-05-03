# Module 01 — Project Scaffold

**Scope:** Initialize the Vite + React + Tailwind project, install all dependencies, create the folder structure, configure Dexie.js IndexedDB schema, set up React Router with placeholder pages, and configure Vite for GitHub Pages deployment.

---

## 1. Initialize Project

```bash
npm create vite@latest neighbright -- --template react
cd neighbright
```

## 2. Install Dependencies

```bash
# Core
npm install react-router-dom framer-motion dexie dexie-react-hooks

# Speech & PDF
npm install jspdf

# Dev
npm install -D tailwindcss @tailwindcss/vite
```

No other dependencies. Everything else is browser-native (Web Speech API, MediaRecorder, Canvas).

## 3. Tailwind Configuration

```css
/* src/index.css */
@import "tailwindcss";
```

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 5173,
  }
});
```

## 4. Google Fonts

Add to `index.html` inside `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet">
```

Extend tailwind config using CSS in index.css:

```css
@theme {
  --font-display: 'Nunito', sans-serif;
  --font-hindi: 'Noto Sans Devanagari', sans-serif;
  
  --color-primary: #FF6B6B;
  --color-secondary: #74B9FF;
  --color-accent: #FECA57;
  --color-success: #55E6C1;
  --color-background: #FFF9F0;
  --color-surface: #FFFFFF;
  --color-text-primary: #2D3436;
  --color-text-secondary: #636E72;
  --color-error: #E17055;
}
```

## 5. Create Folder Structure

Create every directory listed below. Each directory should contain an empty `.gitkeep` file if it has no files yet.

```
src/
├── components/
│   ├── common/
│   ├── landing/
│   ├── talkboard/
│   ├── sounds/
│   ├── words/
│   ├── games/
│   ├── puzzles/
│   ├── rewards/
│   └── dashboard/
├── contexts/
├── data/
│   └── i18n/
├── hooks/
├── db/
├── pages/
└── utils/

public/
├── audio/
└── images/
    ├── avatars/
    └── mouth/

scripts/
.github/workflows/
```

## 6. Dexie.js Database Schema

```javascript
// src/db/index.js
import Dexie from 'dexie';

const db = new Dexie('NeighBrightDB');

db.version(1).stores({
  profile: '++id, name, avatarKey, tier, createdAt',
  progress: '++id, module, activityType, activityData, result, durationSecs, createdAt',
  rewards: '++id, totalStars, currentStreak, longestStreak, lastActive, avatarLevel, stickers',
  sessionNotes: '++id, noteText, createdAt, updatedAt',
  customVocabulary: '++id, category, word, emoji, phrase',
  settings: '++id, language, voiceURI, voiceRate, voicePitch, dailyGoalMinutes, tierOverrides, moduleToggles'
});

export default db;
```

**Index field rules for Dexie:**
- `++id` = auto-incrementing primary key
- Only fields listed in the store definition are indexed; other fields can still be stored in records but won't be queryable via `.where()`
- The `progress` table will accumulate the most rows; `module` and `createdAt` are indexed for dashboard queries

## 7. Placeholder Contexts

```javascript
// src/contexts/LanguageContext.jsx
import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('nb-lang') || 'en'
  );

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('nb-lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
```

```javascript
// src/contexts/ProfileContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import db from '../db';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.profile.toCollection().first().then((p) => {
      setProfile(p || null);
      setLoading(false);
    });
  }, []);

  const saveProfile = async (profileData) => {
    if (profile?.id) {
      await db.profile.update(profile.id, profileData);
      setProfile({ ...profile, ...profileData });
    } else {
      const id = await db.profile.add({ ...profileData, createdAt: new Date().toISOString() });
      setProfile({ ...profileData, id, createdAt: new Date().toISOString() });
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, saveProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within ProfileProvider');
  return context;
}
```

## 8. React Router Setup

```javascript
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ProfileProvider } from './contexts/ProfileContext';

// Pages (placeholder components for now)
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import TalkBoard from './pages/TalkBoard';
import SoundExplorer from './pages/SoundExplorer';
import WordBuilder from './pages/WordBuilder';
import MatchAndLearn from './pages/MatchAndLearn';
import Puzzles from './pages/Puzzles';
import ParentDashboard from './pages/ParentDashboard';

export default function App() {
  return (
    <LanguageProvider>
      <ProfileProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/talk-board" element={<TalkBoard />} />
            <Route path="/sound-explorer" element={<SoundExplorer />} />
            <Route path="/word-builder" element={<WordBuilder />} />
            <Route path="/match-and-learn" element={<MatchAndLearn />} />
            <Route path="/puzzles" element={<Puzzles />} />
            <Route path="/dashboard" element={<ParentDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ProfileProvider>
    </LanguageProvider>
  );
}
```

## 9. Placeholder Pages

Create each page file under `src/pages/`. Every page should follow this pattern:

```javascript
// src/pages/Landing.jsx
export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <h1 className="text-3xl font-display font-bold text-text-primary">
        Landing Page
      </h1>
    </div>
  );
}
```

Create identical placeholder files for: `Onboarding.jsx`, `Home.jsx`, `TalkBoard.jsx`, `SoundExplorer.jsx`, `WordBuilder.jsx`, `MatchAndLearn.jsx`, `Puzzles.jsx`, `ParentDashboard.jsx`. Each with its own label text.

## 10. Entry Point

```javascript
// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

## 11. Git Setup

```bash
# .gitignore
node_modules/
dist/
.env
.DS_Store
*.local
```

```bash
# .env.example
OPENAI_API_KEY=your-key-here
```

```bash
# public/CNAME
neighbright.yourdomain.com
```

---

## Acceptance Criteria

- [ ] `npm run dev` starts Vite on `localhost:5173` without errors
- [ ] All 9 routes render their placeholder text
- [ ] Browser DevTools → Application → IndexedDB shows `NeighBrightDB` with all 6 tables
- [ ] Tailwind classes render correctly (test: `bg-primary` shows coral, `font-display` shows Nunito)
- [ ] Custom color tokens (`bg-background`, `text-text-primary`, etc.) all work
- [ ] Noto Sans Devanagari loads (test: render a Hindi string like "नमस्ते")
- [ ] `npm run build` produces a clean `dist/` folder with no errors
- [ ] `LanguageContext` persists language selection in `localStorage` under key `nb-lang`
- [ ] `ProfileContext` reads/writes to the `profile` table in IndexedDB
- [ ] No console errors or warnings in the browser
