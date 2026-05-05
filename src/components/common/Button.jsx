import { motion } from 'framer-motion';

const variantClasses = {
  primary: 'bg-primary text-white shadow-sm shadow-primary/25 hover:shadow-md hover:shadow-primary/30 hover:brightness-105 active:brightness-95',
  secondary: 'bg-secondary text-white shadow-sm shadow-secondary/25 hover:shadow-md hover:shadow-secondary/30 hover:brightness-105 active:brightness-95',
  ghost: 'bg-transparent text-text-primary border border-border hover:bg-white/80 active:bg-white/60',
  danger: 'bg-error text-white shadow-sm shadow-error/25 hover:brightness-105 active:brightness-95',
};

const sizeClasses = {
  sm: 'h-8 px-3.5 text-sm rounded-lg',
  md: 'h-10 px-5 text-sm rounded-xl',
  lg: 'h-12 px-6 text-base rounded-xl',
  xl: 'h-14 px-8 text-lg rounded-2xl',
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
      whileTap={disabled ? {} : { scale: 0.96 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-display font-bold transition-all select-none',
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
