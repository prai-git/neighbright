import { motion } from 'framer-motion';

const sizeMap = {
  sm: 6,
  md: 10,
  lg: 16,
};

const colorMap = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
  success: 'bg-success',
  error: 'bg-error',
};

export default function ProgressBar({
  value = 0,
  color = 'primary',
  size = 'md',
  showLabel = false,
  animated = true,
}) {
  const clamped = Math.min(100, Math.max(0, value));
  const height = sizeMap[size];
  const barColor = colorMap[color] || 'bg-primary';

  return (
    <div className="flex items-center gap-2 w-full">
      <div
        className="flex-1 bg-gray-100 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={animated ? { duration: 0.6, ease: 'easeOut' } : { duration: 0 }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-display font-semibold text-text-secondary shrink-0 w-10 text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
}
