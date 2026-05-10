import { useMemo } from 'react';

const THEMES = {
  default: ['🌿', '🌸', '🦋', '🐝', '🌺', '🍀', '🐞', '🌻', '🦜', '🌴', '🐢', '🌼'],
  talk:    ['🦜', '💬', '🌺', '🐦', '🌸', '🦋', '🌿', '🐝', '🍃', '🌻', '🐞', '🌴'],
  sounds:  ['🐸', '🔔', '🎵', '🦗', '🐝', '🌿', '🐦', '🌺', '🦋', '🍃', '🎶', '🐞'],
  words:   ['📖', '🌻', '🦋', '🐛', '🌸', '🍀', '🐝', '🌿', '🌺', '🐞', '🌴', '🍃'],
  games:   ['🎯', '🦁', '🐘', '🌴', '🦋', '🌺', '🐒', '🌿', '🦜', '🐞', '🍃', '🌸'],
  puzzles: ['🧩', '🐢', '🌵', '🦎', '🌺', '🐝', '🌿', '🦋', '🍃', '🌻', '🐞', '🌴'],
  home:      ['🌴', '🌺', '🦜', '🐒', '🌿', '🦋', '🐝', '🌸', '🐞', '🍃', '🌻', '🐢'],
  alphabets: ['🔤', '📝', '🅰️', '🅱️', '🌟', '📖', '✏️', '🦋', '🌸', '🍎', '🐝', '🌿'],
  numbers:   ['🔢', '1️⃣', '2️⃣', '3️⃣', '🌟', '🎯', '🧮', '🦋', '🌺', '🍀', '🐞', '🌴'],
};

// Fixed positions to avoid layout shift — spread across bottom 60% of viewport
const POSITIONS = [
  { left: '3%',  top: '45%' },
  { left: '88%', top: '40%' },
  { left: '12%', top: '62%' },
  { left: '78%', top: '55%' },
  { left: '5%',  top: '80%' },
  { left: '92%', top: '72%' },
  { left: '25%', top: '85%' },
  { left: '65%', top: '88%' },
  { left: '40%', top: '70%' },
  { left: '55%', top: '45%' },
  { left: '18%', top: '50%' },
  { left: '82%', top: '82%' },
];

export default function FunBackground({ theme = 'default' }) {
  const emojis = THEMES[theme] || THEMES.default;

  const items = useMemo(
    () =>
      emojis.map((emoji, i) => ({
        emoji,
        ...POSITIONS[i % POSITIONS.length],
        size: 34 + (i % 4) * 10,
        delay: i * 0.7,
        duration: 4 + (i % 3) * 2,
      })),
    [emojis]
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      aria-hidden="true"
    >
      {items.map((item, i) => (
        <span
          key={i}
          className="absolute fun-float select-none"
          style={{
            left: item.left,
            top: item.top,
            fontSize: `${item.size}px`,
            opacity: 0.35,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}
