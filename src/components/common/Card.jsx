import { motion } from 'framer-motion';

const variantClasses = {
  elevated: 'bg-surface rounded-2xl border-2 border-border shadow-[0_4px_0_rgba(0,0,0,0.2)]',
  outlined: 'bg-surface rounded-2xl border-2 border-border',
  flat: 'bg-white/5 rounded-2xl',
};

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export default function Card({
  variant = 'elevated',
  padding = 'md',
  onClick = null,
  color = null,
  children,
  ...props
}) {
  const interactive = typeof onClick === 'function';

  return (
    <motion.div
      whileHover={interactive ? { y: -3 } : {}}
      whileTap={interactive ? { scale: 0.98, y: 1 } : {}}
      onClick={onClick}
      className={[
        variantClasses[variant],
        paddingClasses[padding],
        interactive ? 'cursor-pointer transition-all' : '',
        color ? 'border-l-4' : '',
      ].join(' ')}
      style={color ? { borderLeftColor: color } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
}
