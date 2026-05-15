import { aslLetters, aslNumbers } from '../../data/signLanguage';

export default function ASLSign({ value, size = 'md' }) {
  const isNumber = typeof value === 'number' || /^\d+$/.test(value);
  const data = isNumber ? aslNumbers[Number(value)] : aslLetters[String(value).toUpperCase()];

  if (!data) return null;

  const sizes = {
    sm: { box: 'w-14 h-14', emoji: 'text-2xl', label: 'text-[8px]' },
    md: { box: 'w-20 h-20', emoji: 'text-3xl', label: 'text-[9px]' },
    lg: { box: 'w-24 h-24', emoji: 'text-4xl', label: 'text-[10px]' },
    xl: { box: 'w-32 h-32', emoji: 'text-5xl', label: 'text-xs' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`${s.box} rounded-2xl bg-accent/15 border-2 border-accent/30 flex flex-col items-center justify-center gap-0.5 shrink-0`}>
      <span className={s.emoji}>{data.hand}</span>
      <span className={`${s.label} font-display font-bold text-accent text-center leading-tight px-1`}>
        ASL
      </span>
    </div>
  );
}
