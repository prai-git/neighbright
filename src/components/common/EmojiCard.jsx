import { motion } from 'framer-motion';

const sizeMap = {
  sm: { card: 'w-16 h-16', emoji: 'text-2xl', label: 'text-[9px]' },
  md: { card: 'w-full aspect-square', emoji: 'text-4xl sm:text-5xl', label: 'text-xs' },
  lg: { card: 'w-full aspect-square', emoji: 'text-5xl', label: 'text-sm' },
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
      whileTap={disabled ? {} : { scale: 0.92 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={selected}
      className={[
        'bg-white rounded-2xl border flex flex-col items-center justify-center gap-1 select-none transition-all',
        card,
        selected
          ? 'ring-2 ring-primary border-primary bg-primary/5'
          : 'border-border',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm',
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
