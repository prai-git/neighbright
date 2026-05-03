import { motion } from 'framer-motion';

const variantClasses = {
  elevated: 'bg-surface rounded-2xl shadow-md',
  outlined: 'bg-surface rounded-2xl border border-gray-200',
  flat: 'bg-surface rounded-2xl',
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
      whileHover={interactive ? { y: -2 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={[
        variantClasses[variant],
        paddingClasses[padding],
        interactive ? 'cursor-pointer' : '',
        color ? 'border-t-4' : '',
      ].join(' ')}
      style={color ? { borderTopColor: color } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
}
