import { motion } from 'framer-motion';

const variantClasses = {
  primary: 'bg-primary text-white hover:brightness-110 active:brightness-90',
  secondary: 'bg-secondary text-white hover:brightness-110 active:brightness-90',
  ghost: 'bg-white/10 text-white border-2 border-white/20 hover:bg-white/15 active:bg-white/5',
  danger: 'bg-error text-white hover:brightness-110 active:brightness-90',
};

const sizeClasses = {
  sm: 'h-9 px-4 text-sm rounded-xl',
  md: 'h-11 px-6 text-sm rounded-2xl',
  lg: 'h-13 px-7 text-base rounded-2xl',
  xl: 'h-15 px-9 text-lg rounded-2xl',
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
      whileTap={disabled ? {} : { scale: 0.96, y: 2 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-display font-extrabold tracking-wide uppercase transition-all select-none',
        'shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)]',
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
