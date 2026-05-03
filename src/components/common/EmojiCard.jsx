import { motion } from 'framer-motion';

const sizeMap = {
  sm: { card: 'w-20 h-20', emoji: 'text-3xl', label: 'text-xs' },
  md: { card: 'w-[100px] h-[100px]', emoji: 'text-4xl', label: 'text-sm' },
  lg: { card: 'w-[120px] h-[120px]', emoji: 'text-5xl', label: 'text-sm' },
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
        'bg-surface rounded-2xl shadow-sm border flex flex-col items-center justify-center gap-1 select-none transition-all',
        card,
        selected
          ? 'ring-2 ring-primary border-primary bg-primary/5'
          : 'border-gray-100',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
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
