import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function StarCounter({ count = 0, animate = false }) {
  const controls = useAnimation();
  const prevCount = useRef(count);

  useEffect(() => {
    if (animate && count !== prevCount.current) {
      controls.start({
        scale: [1, 1.4, 1],
        color: ['#FECA57', '#FFD700', '#FECA57'],
        transition: { duration: 0.4 },
      });
      prevCount.current = count;
    }
  }, [count, animate, controls]);

  return (
    <span className="inline-flex items-center gap-1 text-lg font-display font-bold text-accent">
      <span>⭐</span>
      <motion.span animate={controls}>{count}</motion.span>
    </span>
  );
}
