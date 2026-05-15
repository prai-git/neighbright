import { motion } from 'framer-motion';

const sizeMap = {
  sm: { card: 'w-16 h-16', emoji: 'text-2xl', label: 'text-[9px]' },
  md: { card: 'w-full aspect-square', emoji: 'text-5xl sm:text-6xl', label: 'text-sm' },
  lg: { card: 'w-full aspect-square', emoji: 'text-6xl', label: 'text-base' },
};

export default function EmojiCard({
  emoji,
  label,
  size = 'md',
  selected = false,
  disabled = false,
  onClick,
  showLabel = true,
}) {
  const { card, emoji: emojiSize, label: labelSize } = sizeMap[size];

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.92, y: 2 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={selected}
      className={[
        'bg-surface rounded-2xl border-2 flex flex-col items-center justify-center gap-1.5 select-none transition-all',
        'shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)]',
        card,
        selected
          ? 'ring-2 ring-primary border-primary bg-primary/10'
          : 'border-border',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50',
      ].join(' ')}
    >
      <span className={emojiSize}>{emoji}</span>
      {showLabel && label && (
        <span className={`${labelSize} font-display font-bold text-text-primary truncate max-w-full px-1`}>
          {label}
        </span>
      )}
    </motion.button>
  );
}
