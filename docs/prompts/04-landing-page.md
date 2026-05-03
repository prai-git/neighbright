# Module 04 — Landing Page

**Scope:** Build the complete public landing page — the first thing every visitor sees. Must look professional, load fast, and be fully translatable. This page should convince a parent or therapist in under 5 seconds that NeighBright is trustworthy and useful.

**Prerequisite:** Modules 01–03 complete.

---

## Page Route

`/` → `src/pages/Landing.jsx`

The landing page does NOT use `AppLayout` (no side/bottom nav). It has its own layout with a full-width `NavBar` in landing mode and a custom footer.

---

## Section Components

All go in `src/components/landing/`. Every user-facing string uses `t()`.

### 1. LandingHero.jsx

- Full viewport height on mobile (`min-h-screen`), padded on desktop
- Background: `bg-background` with a subtle gradient or large soft shape (CSS only, no images)
- Center-aligned content:
  - NeighBright logo/name in large display font (`text-4xl md:text-6xl font-display font-extrabold text-text-primary`)
  - Tagline below: `t('landing.heroTitle')` in `text-xl md:text-2xl text-text-secondary`
  - One-line description: `t('landing.heroDescription')` in `text-base text-text-secondary max-w-xl mx-auto`
  - Primary CTA button: `t('landing.heroCta')` — large, coral, `Button variant="primary" size="xl"`
  - Subtext: `t('landing.heroSubtext')` in `text-sm text-text-secondary`
- Framer Motion: fade in + slide up on mount, staggered for each element (100ms delay between)
- A subtle animated spark/star accent near the logo (CSS animation or Framer Motion)

### 2. LandingFeatures.jsx

- Section title: `t('landing.featuresTitle')` centered
- 4 feature cards in a responsive grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- Each card uses the `Card` component with:
  - Large emoji icon at top (💬 🔊 🔤 🧩)
  - Feature name in bold
  - 1–2 sentence description
  - Subtle accent `color` prop on each card (different per feature)
- Cards animate in on scroll (Framer Motion `whileInView`)
- Feature data:
  1. 💬 Talk Board — `t('landing.featureTalkBoard')` / `t('landing.featureTalkBoardDesc')`
  2. 🔊 Sound Explorer — `t('landing.featureSounds')` / `t('landing.featureSoundsDesc')`
  3. 🔤 Word Builder — `t('landing.featureWords')` / `t('landing.featureWordsDesc')`
  4. 🧩 Puzzles — `t('landing.featurePuzzles')` / `t('landing.featurePuzzlesDesc')`

### 3. LandingHowItWorks.jsx

- Section title: `t('landing.howTitle')` centered
- 3 numbered steps in a row on desktop, stacked on mobile
- Each step:
  - Large number circle (1, 2, 3) in `bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold`
  - Step title in bold
  - Step description in secondary text
  - A simple emoji illustration below each (📱 → 🎯 → 👨‍👩‍👧‍👦)
- Steps connected by a dotted line on desktop (`border-dashed border-t-2 border-gray-200`)
- Animate in on scroll

### 4. LandingAudience.jsx

- Section title: `t('landing.whoTitle')`
- 3 audience cards: Parents, Therapists, Teachers
- Each card: emoji icon, title, description, `Card variant="outlined"`
- Grid: `grid grid-cols-1 md:grid-cols-3 gap-6`

### 5. LandingEvidence.jsx

- Background: `bg-surface` section with subtle top/bottom padding
- Title: `t('landing.evidenceTitle')`
- Paragraph: `t('landing.evidenceDesc')`
- Disclaimer in a rounded box: `t('landing.evidenceDisclaimer')` with a ⚕️ icon, `bg-secondary/10 rounded-xl p-4`
- Multilingual note: `t('landing.multilingualTitle')` + `t('landing.multilingualDesc')` with three flag emojis (🇺🇸 🇮🇳 🇫🇷)

### 6. LandingFeedback.jsx

- Background: `bg-primary/5`
- Title: `t('landing.feedbackTitle')`
- Description: `t('landing.feedbackDesc')`
- CTA button: `t('landing.feedbackCta')` → links to a Google Form URL or GitHub Issues (configurable via a constant)

### 7. LandingFooter.jsx

- `bg-text-primary text-white` (dark footer)
- Three columns on desktop, stacked on mobile:
  - Col 1: NeighBright name + tagline
  - Col 2: Links — About, Privacy, Contact
  - Col 3: "Open source" note with GitHub icon/link
- Bottom bar: `t('landing.footerTagline')` centered, small text
- `max-w-6xl mx-auto px-4 py-12`

---

## Landing.jsx Page Assembly

```javascript
// src/pages/Landing.jsx
import { NavBar } from '../components/common';
import LandingHero from '../components/landing/LandingHero';
import LandingFeatures from '../components/landing/LandingFeatures';
import LandingHowItWorks from '../components/landing/LandingHowItWorks';
import LandingAudience from '../components/landing/LandingAudience';
import LandingEvidence from '../components/landing/LandingEvidence';
import LandingFeedback from '../components/landing/LandingFeedback';
import LandingFooter from '../components/landing/LandingFooter';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar mode="landing" />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingAudience />
        <LandingEvidence />
        <LandingFeedback />
      </main>
      <LandingFooter />
    </div>
  );
}
```

---

## Responsive Behavior

| Section | Mobile (<640px) | Tablet (640–1024px) | Desktop (>1024px) |
|---|---|---|---|
| Hero | Full screen, stacked, text-center | Same, more horizontal padding | `max-w-4xl` centered |
| Features | 1 column stack | 2×2 grid | 4 across |
| How It Works | Vertical numbered list | 3 across with lines | Same |
| Audience | 1 column stack | 3 across | Same |
| Evidence | Full width, stacked | Side-by-side text + disclaimer | Same |
| Feedback | Full width | Centered `max-w-lg` | Same |
| Footer | Single column | 3 columns | Same |

---

## Scroll Animations

Use Framer Motion `whileInView` on each section:

```javascript
<motion.section
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 0.5 }}
>
```

---

## Acceptance Criteria

- [ ] Landing page renders with all 7 sections in correct order
- [ ] NavBar shows in landing mode (logo + language switcher + "Get Started" button)
- [ ] "Get Started" button navigates to `/onboarding`
- [ ] All text renders correctly in English, Hindi, and French via language switcher
- [ ] Hero CTA button is prominent and obvious
- [ ] Feature cards display with correct icons and descriptions
- [ ] Scroll animations trigger smoothly (fade in, no jank)
- [ ] Page is fully responsive: phone (375px), tablet (768px), desktop (1280px)
- [ ] Footer links are present (can point to placeholder URLs)
- [ ] Feedback CTA links to an external form URL
- [ ] No horizontal scroll on any viewport width
- [ ] Page loads in under 2 seconds on localhost
- [ ] Lighthouse: Performance 90+, Accessibility 95+
- [ ] Screen reader can navigate all sections via headings
