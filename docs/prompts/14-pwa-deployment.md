# Module 14 — PWA & Deployment

**Scope:** Finalize the Progressive Web App configuration (service worker, manifest, offline support), set up GitHub Actions CI/CD, configure the custom domain on Porkbun, and optimize build performance.

**Prerequisite:** Modules 01–13 complete.

---

## 1. PWA Manifest

```json
// public/manifest.json
{
  "name": "NeighBright",
  "short_name": "NeighBright",
  "description": "Free speech therapy and learning tools for children",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFF9F0",
  "theme_color": "#FF6B6B",
  "orientation": "any",
  "icons": [
    { "src": "/images/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/images/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/images/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "categories": ["education", "kids", "health"]
}
```

**Create app icons:**
- Generate a simple icon: speech bubble with spark (can be SVG converted to PNG)
- Sizes: 192×192 and 512×512 (regular + maskable)
- Place in `public/images/`

Link in `index.html`:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#FF6B6B">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="apple-touch-icon" href="/images/icon-192.png">
```

---

## 2. Service Worker

```javascript
// public/sw.js
const CACHE_NAME = 'neighbright-v1';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Vite hashed assets will be added dynamically
];

// Install: precache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first for static assets, network-first for navigation
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  if (request.mode === 'navigate') {
    // SPA: always serve index.html for navigation requests
    event.respondWith(
      caches.match('/index.html').then((cached) => {
        return cached || fetch(request);
      })
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
```

**Register in main.jsx:**
```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
```

**Versioning strategy:** When deploying updates, increment `CACHE_NAME` (e.g., `neighbright-v2`). The activate handler cleans old caches. Users get the new version on next visit.

---

## 3. index.html Finalization

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="description" content="NeighBright — Free speech therapy and learning tools for children. Practice vocabulary, articulation, and cognitive skills in English, Hindi, and French.">
  
  <!-- PWA -->
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#FF6B6B">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <link rel="apple-touch-icon" href="/images/icon-192.png">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet">
  
  <!-- Open Graph -->
  <meta property="og:title" content="NeighBright — Free Speech Therapy for Children">
  <meta property="og:description" content="Practice vocabulary, articulation, puzzles, and communication — for free, in English, Hindi, and French.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://neighbright.yourdomain.com">
  
  <title>NeighBright — Free Speech Therapy for Children</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

---

## 4. Build Optimization

### Vite Config Updates

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion': ['framer-motion'],
          'db': ['dexie'],
          'pdf': ['jspdf'],
        }
      }
    }
  }
});
```

### Lazy Loading

All module pages should be lazy-loaded to reduce initial bundle:

```javascript
// src/App.jsx
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from './components/common';

const TalkBoard = lazy(() => import('./pages/TalkBoard'));
const SoundExplorer = lazy(() => import('./pages/SoundExplorer'));
const WordBuilder = lazy(() => import('./pages/WordBuilder'));
const MatchAndLearn = lazy(() => import('./pages/MatchAndLearn'));
const Puzzles = lazy(() => import('./pages/Puzzles'));
const ParentDashboard = lazy(() => import('./pages/ParentDashboard'));

// In routes:
<Route path="/talk-board" element={
  <RequireProfile>
    <Suspense fallback={<LoadingSpinner />}>
      <TalkBoard />
    </Suspense>
  </RequireProfile>
} />
```

### Image Optimization
- All SVGs should be optimized (remove unnecessary metadata)
- Emoji rendering: no images to optimize — native browser rendering

---

## 5. GitHub Actions Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
      - run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Repository Settings
1. Go to repo → Settings → Pages
2. Source: GitHub Actions
3. Custom domain: `neighbright.yourdomain.com`
4. Enforce HTTPS: ✅

---

## 6. Porkbun DNS

```
Type: CNAME
Host: neighbright
Value: yourusername.github.io
TTL: 600
```

Wait for DNS propagation (usually 5–15 minutes). GitHub Pages auto-provisions SSL.

Ensure `public/CNAME` contains: `neighbright.yourdomain.com`

---

## 7. SPA Routing Fix for GitHub Pages

GitHub Pages doesn't natively support client-side routing. Add a 404 fallback:

```html
<!-- public/404.html -->
<!DOCTYPE html>
<html>
<head>
  <script>
    // Redirect all 404s to index.html for SPA routing
    const path = window.location.pathname;
    window.location.replace('/' + '?redirect=' + encodeURIComponent(path));
  </script>
</head>
</html>
```

In `main.jsx`, handle the redirect:
```javascript
const params = new URLSearchParams(window.location.search);
const redirect = params.get('redirect');
if (redirect) {
  window.history.replaceState(null, '', redirect);
}
```

---

## Acceptance Criteria

- [ ] PWA manifest is valid (test via Chrome DevTools → Application → Manifest)
- [ ] App icons display correctly in "Add to Home Screen" prompt
- [ ] Service worker registers and caches all static assets
- [ ] App works fully offline after first load (disconnect network, reload)
- [ ] Navigating between routes works offline
- [ ] TTS works offline
- [ ] IndexedDB data persists across offline sessions
- [ ] GitHub Actions workflow runs on push to main and deploys to GitHub Pages
- [ ] Custom domain resolves to the deployed site with HTTPS
- [ ] All routes work on the deployed site (no 404 on direct URL access)
- [ ] Build output is code-split (check `dist/assets/` for separate chunks)
- [ ] Lazy loading works (module chunks load on first navigation to that route)
- [ ] Open Graph meta tags render correctly in link previews
- [ ] `npm run build` completes in under 30 seconds
- [ ] Total bundle size (all chunks combined) is under 500KB gzipped
