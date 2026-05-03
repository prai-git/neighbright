import { motion } from 'framer-motion';

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-2xl',
};

const variantClasses = {
  filled: 'bg-primary text-white',
  ghost: 'bg-transparent text-text-primary hover:bg-gray-100 active:bg-gray-100',
};

export default function IconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  label,
  onClick,
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.9 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={label}
      className={[
        'inline-flex items-center justify-center rounded-full transition-all select-none',
        sizeClasses[size],
        variantClasses[variant],
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
      {...props}
    >
      {icon}
    </motion.button>
  );
}
