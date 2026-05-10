import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#58CC02', '#1CB0F6', '#FF9600', '#FFD900', '#FF4B4B', '#CE82FF'];
const PARTICLE_COUNT = 30;
const DURATION = 3; // seconds

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function createParticle(index) {
  return {
    id: index,
    x: randomBetween(5, 95),       // vw percentage start
    color: COLORS[index % COLORS.length],
    size: randomBetween(6, 14),
    delay: randomBetween(0, 0.6),
    wobble: randomBetween(-60, 60), // horizontal drift
    rotation: randomBetween(0, 360),
    shape: index % 3,               // 0 = circle, 1 = square, 2 = triangle-ish
  };
}

export default function ConfettiEffect({ onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, DURATION * 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => createParticle(i));

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                x: `${p.x}vw`,
                y: -20,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: '110vh',
                x: `calc(${p.x}vw + ${p.wobble}px)`,
                rotate: p.rotation + 720,
                opacity: [1, 1, 0.8, 0],
              }}
              transition={{
                duration: DURATION,
                delay: p.delay,
                ease: 'easeIn',
              }}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.shape === 0 ? '50%' : p.shape === 1 ? '2px' : '50% 0 50% 50%',
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
