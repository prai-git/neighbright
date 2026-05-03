# Module 02 — Design System

**Scope:** Build all reusable UI components used across NeighBright. Every component must be responsive (mobile-first), accessible (ARIA labels, keyboard support), animated (Framer Motion), and use the `t()` translation function for any user-facing strings.

**Prerequisite:** Module 01 complete.

---

## Design Principles

1. **Child-safe touch targets** — minimum 48×48px, prefer 64×64px for child-facing buttons
2. **Rounded everything** — `rounded-2xl` (16px) on cards, `rounded-xl` (12px) on buttons, `rounded-full` on avatars and icon buttons
3. **Soft shadows** — `shadow-md` on cards, `shadow-lg` on modals. No hard/dark shadows.
4. **Nunito everywhere** — `font-display` class on all text. Noto Sans Devanagari auto-applies for Hindi glyphs.
5. **No hover-only states** — every hover style must also work on `:active` for touch devices
6. **Framer Motion** — use `motion.div`, `motion.button` etc. for all enter/exit/tap animations

---

## Components to Build

All components go in `src/components/common/`. Each component is one file with a default export.

### 1. Button.jsx

A primary interactive element used everywhere.

**Props:**
| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size. `xl` is for child-facing (64px height) |
| `fullWidth` | `boolean` | `false` | Spans container width |
| `disabled` | `boolean` | `false` | Disabled state |
| `icon` | `ReactNode` | `null` | Optional leading icon |
| `onClick` | `function` | — | Click handler |
| `children` | `ReactNode` | — | Button label |

**Variant styles:**
- `primary` — `bg-primary text-white` → hover: slightly darker
- `secondary` — `bg-secondary text-white` → hover: slightly darker
- `ghost` — `bg-transparent text-text-primary border border-gray-200` → hover: `bg-gray-50`
- `danger` — `bg-error text-white` → hover: slightly darker

**Size specs:**
- `sm` — `h-8 px-3 text-sm rounded-lg`
- `md` — `h-10 px-4 text-base rounded-xl`
- `lg` — `h-12 px-6 text-lg rounded-xl`
- `xl` — `h-16 px-8 text-xl rounded-2xl` (child-facing)

**Animation:** `whileTap={{ scale: 0.95 }}` via Framer Motion. Disabled state: `opacity-50 cursor-not-allowed`, no tap animation.

---

### 2. Card.jsx

Container for content blocks, module tiles, and vocabulary cards.

**Props:**
| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'elevated' \| 'outlined' \| 'flat'` | `'elevated'` | Visual style |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Internal padding |
| `onClick` | `function` | `null` | If provided, card is interactive (shows hover/tap feedback) |
| `color` | `string` | `null` | Optional accent border-top color (hex) |
| `children` | `ReactNode` | — | Content |

**Variant styles:**
- `elevated` — `bg-surface rounded-2xl shadow-md`
- `outlined` — `bg-surface rounded-2xl border border-gray-200`
- `flat` — `bg-surface rounded-2xl`

If `onClick` is provided, add: `cursor-pointer` and Framer Motion `whileHover={{ y: -2 }}` `whileTap={{ scale: 0.98 }}`.

If `color` is provided, render a `4px` colored border on top: `border-t-4` with inline style for the color.

---

### 3. IconButton.jsx

Circular icon-only button for navigation actions, close buttons, and controls.

**Props:**
| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `ReactNode` | — | Icon content (emoji or SVG) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size |
| `variant` | `'filled' \| 'ghost'` | `'ghost'` | Style |
| `label` | `string` | — | Required `aria-label` |
| `onClick` | `function` | — | Click handler |

**Size specs:**
- `sm` — `w-8 h-8 text-sm`
- `md` — `w-10 h-10 text-base`
- `lg` — `w-14 h-14 text-2xl` (child-facing)

Always `rounded-full`. `whileTap={{ scale: 0.9 }}`.

---

### 4. Modal.jsx

Overlay dialog for confirmations, settings, and custom card forms.

**Props:**
| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | `boolean` | — | Controls visibility |
| `onClose` | `function` | — | Called on backdrop click or close button |
| `title` | `string` | `null` | Optional header text |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Width |
| `children` | `ReactNode` | — | Content |

**Behavior:**
- Renders via a React portal to `document.body`
- Backdrop: `bg-black/40 backdrop-blur-sm`, fades in (`opacity 0→1`)
- Content: slides up from bottom on mobile (`translateY`), centered on desktop
- Close on backdrop click and Escape key
- Focus trap inside the modal
- Prevents body scroll when open (`overflow-hidden` on `<body>`)
- `size` controls max-width: `sm`=400px, `md`=500px, `lg`=640px

**Animation:** Use `AnimatePresence` + `motion.div` for enter/exit.

---

### 5. NavBar.jsx

Top navigation bar. Adapts between landing (public) and app (authenticated) modes.

**Props:**
| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `'landing' \| 'app'` | `'app'` | Display mode |

**Landing mode:**
- Left: NeighBright logo (text-based: "NeighBright" in Nunito Bold + spark emoji ✨)
- Right: Language switcher (globe icon 🌐) + "Get Started" button

**App mode:**
- Left: NeighBright logo (smaller)
- Center: Current module name (from route)
- Right: Avatar icon (links to profile/dashboard) + Language switcher

**Responsive:**
- Mobile: compact, logo + right icons only
- Desktop: full layout with current module name visible

**Specs:** `h-14 md:h-16`, `bg-surface shadow-sm`, sticky at top (`sticky top-0 z-50`).

---

### 6. BottomNav.jsx

Bottom navigation bar for mobile, visible only in app mode (not on landing page).

**Structure:** 5 tappable icon+label items:
1. 🏠 Home → `/home`
2. 💬 Talk → `/talk-board`
3. 🔤 Words → `/word-builder`
4. 🧩 Puzzles → `/puzzles`
5. ⚙️ Dashboard → `/dashboard`

**Specs:**
- Only visible below `md:` breakpoint — `md:hidden`
- `h-16`, `bg-surface`, `border-t border-gray-100`, fixed bottom
- Active item: `text-primary font-bold`
- Inactive: `text-text-secondary`
- Each item is a `NavLink` from React Router with active detection
- Labels are translated via `t()`

---

### 7. SideNav.jsx

Sidebar navigation for tablet and desktop. Hidden on mobile.

**Structure:** Vertical list of navigation items matching BottomNav, plus additional links:
1. 🏠 Home
2. 💬 Talk Board
3. 🔊 Sounds
4. 🔤 Word Builder
5. 🎮 Games
6. 🧩 Puzzles
7. ⚙️ Dashboard

**Specs:**
- Only visible at `md:` and above — `hidden md:flex`
- `w-56 lg:w-64`, `bg-surface`, `border-r border-gray-100`
- Full height below NavBar
- Active item: `bg-primary/10 text-primary font-bold rounded-xl`
- Profile summary at top: avatar + child's name + tier badge
- Translated labels via `t()`

---

### 8. Input.jsx

Text input for profile name, search, session notes.

**Props:**
| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `null` | Label text above input |
| `placeholder` | `string` | `''` | Placeholder text |
| `value` | `string` | — | Controlled value |
| `onChange` | `function` | — | Change handler |
| `type` | `'text' \| 'number' \| 'search'` | `'text'` | Input type |
| `error` | `string` | `null` | Error message below input |
| `icon` | `ReactNode` | `null` | Optional leading icon |

**Specs:**
- `h-12 rounded-xl border border-gray-200 bg-surface px-4 text-base font-display`
- Focus: `ring-2 ring-primary/30 border-primary`
- Error: `border-error` + red error text below
- Label: `text-sm font-semibold text-text-secondary mb-1`

---

### 9. ProgressBar.jsx

Visual progress indicator for sound levels, daily goals, and streaks.

**Props:**
| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | 0 | Current value (0–100) |
| `color` | `string` | `'primary'` | Bar color token |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height |
| `showLabel` | `boolean` | `false` | Show percentage text |
| `animated` | `boolean` | `true` | Animate on mount |

**Specs:**
- Track: `bg-gray-100 rounded-full`
- Fill: `rounded-full` with Framer Motion width animation (`0% → value%`)
- Size heights: `sm`=6px, `md`=10px, `lg`=16px
- If `showLabel`: small percentage text to the right

---

### 10. Badge.jsx

Small status indicator for tier levels, streaks, and counts.

**Props:**
| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'tier' \| 'count' \| 'status'` | `'status'` | Style |
| `color` | `string` | `'primary'` | Color token |
| `children` | `ReactNode` | — | Badge text |

**Specs:**
- `inline-flex items-center rounded-full text-xs font-bold px-2 py-0.5`
- `tier`: larger, shows "Tier 1" / "Tier 2" / "Tier 3" with distinct colors
- `count`: circular, shows a number (star count etc.)
- `status`: small pill

---

### 11. EmojiCard.jsx

The core vocabulary/picture card used in Talk Board, Word Builder, and Games.

**Props:**
| Prop | Type | Default | Description |
|---|---|---|---|
| `emoji` | `string` | — | Emoji character |
| `label` | `string` | — | Word below the emoji |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Card size |
| `selected` | `boolean` | `false` | Highlighted state |
| `disabled` | `boolean` | `false` | Non-interactive |
| `onClick` | `function` | — | Tap handler |
| `showLabel` | `boolean` | `true` | Show/hide word label |

**Specs:**
- `bg-surface rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-1`
- Size: `sm`=80×80px, `md`=100×100px, `lg`=120×120px
- Emoji: `text-3xl` (sm), `text-4xl` (md), `text-5xl` (lg)
- Label: `text-sm font-display font-bold text-text-primary truncate`
- Selected: `ring-3 ring-primary border-primary bg-primary/5`
- `whileTap={{ scale: 0.92 }}`

---

### 12. StarCounter.jsx

Displays the child's total star count with animation.

**Props:**
| Prop | Type | Default | Description |
|---|---|---|---|
| `count` | `number` | 0 | Total stars |
| `animate` | `boolean` | `false` | If true, animate the count up |

**Specs:**
- Inline element: star emoji ⭐ + count in bold
- When `animate` is true and count changes, the number briefly scales up and turns gold
- `text-lg font-display font-bold text-accent`

---

### 13. StreakBadge.jsx

Shows the current daily streak.

**Props:**
| Prop | Type | Default | Description |
|---|---|---|---|
| `streak` | `number` | 0 | Current streak days |

**Specs:**
- Fire emoji 🔥 + streak number + "days" label (translated)
- If streak ≥ 7: badge glows/pulses subtly
- `rounded-full bg-accent/10 px-3 py-1 text-sm font-bold`

---

### 14. AppLayout.jsx

Wrapper layout for all app pages (not landing). Provides NavBar, SideNav, BottomNav, and content area.

**Behavior:**
- Renders `NavBar` (mode="app") at top
- Renders `SideNav` on the left (hidden on mobile)
- Renders `BottomNav` at bottom (hidden on tablet/desktop)
- Content area: `flex-1 overflow-y-auto p-4 md:p-6 lg:p-8`
- Adds bottom padding on mobile to clear BottomNav (`pb-20 md:pb-0`)
- Background: `bg-background min-h-screen`

```javascript
// Usage in pages:
export default function Home() {
  return (
    <AppLayout>
      {/* page content */}
    </AppLayout>
  );
}
```

---

### 15. LanguageSwitcher.jsx

Dropdown to switch between English, Hindi, and French.

**Behavior:**
- Renders a globe icon button (🌐)
- On tap, opens a dropdown with three options:
  - 🇺🇸 English
  - 🇮🇳 हिन्दी
  - 🇫🇷 Français
- Selected language shows a checkmark
- Calls `changeLanguage()` from `useLanguage()` context
- Dropdown closes on selection or outside click
- Dropdown animated with Framer Motion (fade + slide down)

---

### 16. LoadingSpinner.jsx

Simple loading indicator.

**Specs:**
- Three bouncing dots in primary color
- Framer Motion stagger animation
- Centered in its container

---

### 17. EmptyState.jsx

Placeholder for when a list/grid has no content.

**Props:**
| Prop | Type | Default | Description |
|---|---|---|---|
| `emoji` | `string` | `'📭'` | Large emoji |
| `title` | `string` | — | Heading |
| `description` | `string` | — | Subtext |
| `action` | `ReactNode` | `null` | Optional CTA button |

**Specs:**
- Centered vertically, large emoji on top, title below, description in `text-text-secondary`, optional button at bottom.

---

### 18. ConfettiEffect.jsx

Celebration animation component.

**Behavior:**
- When rendered, triggers a confetti burst from the center of the screen
- Uses Framer Motion to animate 30–50 small colored circles/squares in random trajectories
- Colors: primary, secondary, accent, success
- Duration: 2–3 seconds, then elements fade out
- Renders as a fixed overlay (`pointer-events-none`)
- Auto-removes itself after animation completes

---

## File Exports

Create an index file for easy imports:

```javascript
// src/components/common/index.js
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as IconButton } from './IconButton';
export { default as Modal } from './Modal';
export { default as NavBar } from './NavBar';
export { default as BottomNav } from './BottomNav';
export { default as SideNav } from './SideNav';
export { default as Input } from './Input';
export { default as ProgressBar } from './ProgressBar';
export { default as Badge } from './Badge';
export { default as EmojiCard } from './EmojiCard';
export { default as StarCounter } from './StarCounter';
export { default as StreakBadge } from './StreakBadge';
export { default as AppLayout } from './AppLayout';
export { default as LanguageSwitcher } from './LanguageSwitcher';
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as EmptyState } from './EmptyState';
export { default as ConfettiEffect } from './ConfettiEffect';
```

---

## Acceptance Criteria

- [ ] All 18 components render without errors
- [ ] Button: all 4 variants × 4 sizes render correctly; tap animation works on touch device
- [ ] Card: elevated shows shadow, outlined shows border, interactive cards have tap animation
- [ ] Modal: opens/closes with animation, closes on backdrop click and Escape, traps focus, prevents body scroll
- [ ] NavBar: switches between landing and app modes based on prop
- [ ] BottomNav: visible only on mobile, hides at `md:` breakpoint, active route highlighted
- [ ] SideNav: visible only at `md:` and above, active route highlighted, profile summary shows
- [ ] AppLayout: correct layout on mobile (bottom nav) and desktop (side nav), content area scrolls independently
- [ ] LanguageSwitcher: dropdown opens/closes, selecting a language updates the context and closes the dropdown
- [ ] EmojiCard: renders emoji + label, selected state shows ring, tap animation works
- [ ] ConfettiEffect: renders burst, auto-removes after animation
- [ ] All components are keyboard accessible (Tab, Enter, Escape where applicable)
- [ ] All interactive elements have `aria-label` attributes
- [ ] No Tailwind classes are missing or broken
- [ ] Responsive: components look correct at 375px, 768px, and 1280px widths
