import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#FF6B6B', '#74B9FF', '#FECA57', '#55E6C1', '#fd79a8', '#a29bfe'];
const COUNT = 40;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticle(id) {
  return {
    id,
    x: randomBetween(20, 80),   // start % from left
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: randomBetween(6, 14),
    tx: randomBetween(-200, 200),
    ty: randomBetween(-300, -100),
    rotate: randomBetween(-180, 180),
    shape: Math.random() > 0.5 ? 'circle' : 'square',
    duration: randomBetween(1.5, 2.5),
    delay: randomBetween(0, 0.4),
  };
}

export default function ConfettiEffect({ onDone }) {
  const [particles] = useState(() => Array.from({ length: COUNT }, (_, i) => createParticle(i)));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <div
          className="fixed inset-0 pointer-events-none z-[100] overflow-hidden"
          aria-hidden="true"
        >
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, x: `${p.x}vw`, y: '60vh', rotate: 0, scale: 1 }}
              animate={{
                opacity: [1, 1, 0],
                x: `calc(${p.x}vw + ${p.tx}px)`,
                y: `calc(60vh + ${p.ty}px)`,
                rotate: p.rotate,
                scale: [1, 1.2, 0.6],
              }}
              transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.shape === 'circle' ? '50%' : '2px',
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
