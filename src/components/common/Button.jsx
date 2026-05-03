import { motion } from 'framer-motion';

const variantClasses = {
  primary: 'bg-primary text-white hover:brightness-90 active:brightness-90',
  secondary: 'bg-secondary text-white hover:brightness-90 active:brightness-90',
  ghost: 'bg-transparent text-text-primary border border-gray-200 hover:bg-gray-50 active:bg-gray-50',
  danger: 'bg-error text-white hover:brightness-90 active:brightness-90',
};

const sizeClasses = {
  sm: 'h-8 px-3 text-sm rounded-lg',
  md: 'h-10 px-4 text-base rounded-xl',
  lg: 'h-12 px-6 text-lg rounded-xl',
  xl: 'h-16 px-8 text-xl rounded-2xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon = null,
  onClick,
  children,
  ...props
}) {
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.95 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-display font-semibold transition-all select-none',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}
