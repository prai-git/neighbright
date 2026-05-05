import { motion } from 'framer-motion';

const variantClasses = {
  elevated: 'bg-white rounded-2xl border border-border',
  outlined: 'bg-white rounded-2xl border border-border',
  flat: 'bg-white/60 rounded-2xl',
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
      whileHover={interactive ? { y: -1 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={[
        variantClasses[variant],
        paddingClasses[padding],
        interactive ? 'cursor-pointer hover:shadow-md transition-shadow' : '',
        color ? 'border-t-[3px]' : '',
      ].join(' ')}
      style={color ? { borderTopColor: color } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
}
