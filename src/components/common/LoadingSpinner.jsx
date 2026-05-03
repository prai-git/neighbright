import { motion } from 'framer-motion';

const dots = [0, 1, 2];

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center gap-2" role="status" aria-label="Loading">
      {dots.map((i) => (
        <motion.span
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-primary block"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
