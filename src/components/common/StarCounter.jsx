import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

export default function StarCounter({ count = 0, animate = false }) {
  const controls = useAnimation();
  const prevCount = useRef(count);

  useEffect(() => {
    if (count !== prevCount.current) {
      controls.start({
        scale: [1, 1.3, 1],
        transition: { duration: 0.4 },
      });
      prevCount.current = count;
    }
  }, [count, controls]);

  return (
    <span className="inline-flex items-center gap-1 text-lg font-display font-bold text-accent">
      <span>⭐</span>
      <motion.span animate={controls}>{count}</motion.span>
    </span>
  );
}
