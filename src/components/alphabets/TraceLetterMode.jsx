import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSpeech } from '../../hooks/useSpeech';
import { useTranslation } from '../../data/i18n';
import { useProfile } from '../../contexts/ProfileContext';
import { alphabetData } from '../../data/alphabets';
import db from '../../db';

const GRID_SIZE = 20;
const COMPLETION_THRESHOLD = 0.7;

export default function TraceLetterMode({ onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const { profile } = useProfile();
  const tier = profile?.tier || 1;

  const [index, setIndex] = useState(0);
  const [coverage, setCoverage] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [starAwarded, setStarAwarded] = useState(false);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef(null);
  const hitCells = useRef(new Set());
  const guideCells = useRef(new Set());
  const startTime = useRef(Date.now());

  const item = alphabetData[index];
  const lineWidth = tier === 1 ? 8 : tier === 2 ? 6 : 4;
  const displayLetter = tier === 3 ? item.lowercase : tier === 2 ? (index % 2 === 0 ? item.letter : item.lowercase) : item.letter;

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const size = Math.min(rect.width, 320);
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext('2d');

    // Clear
    ctx.clearRect(0, 0, size, size);

    // Draw guide letter
    ctx.font = `bold ${size * 0.7}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillText(displayLetter, size / 2, size / 2);

    // Draw dotted outline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.strokeText(displayLetter, size / 2, size / 2);
    ctx.setLineDash([]);

    // Calculate guide cells from the letter pixels
    const imageData = ctx.getImageData(0, 0, size, size);
    const cellW = size / GRID_SIZE;
    const cellH = size / GRID_SIZE;
    guideCells.current = new Set();

    for (let gy = 0; gy < GRID_SIZE; gy++) {
      for (let gx = 0; gx < GRID_SIZE; gx++) {
        const cx = Math.floor(gx * cellW + cellW / 2);
        const cy = Math.floor(gy * cellH + cellH / 2);
        const pixelIdx = (cy * size + cx) * 4;
        if (imageData.data[pixelIdx + 3] > 10) {
          guideCells.current.add(`${gx},${gy}`);
        }
      }
    }

    hitCells.current = new Set();
    setCoverage(0);
    setCompleted(false);
    setStarAwarded(false);
  }, [displayLetter]);

  useEffect(() => {
    setupCanvas();
    speak(`${t('alphabets.traceTheLetter', { letter: displayLetter })}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, setupCanvas]);

  useEffect(() => {
    const handleResize = () => setupCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setupCanvas]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const updateCoverage = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas || guideCells.current.size === 0) return;

    const cellW = canvas.width / GRID_SIZE;
    const cellH = canvas.height / GRID_SIZE;
    const gx = Math.floor(x / cellW);
    const gy = Math.floor(y / cellH);
    const key = `${gx},${gy}`;

    if (guideCells.current.has(key)) {
      hitCells.current.add(key);
    }
    // Also check neighbors for thicker strokes
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nk = `${gx + dx},${gy + dy}`;
        if (guideCells.current.has(nk)) {
          hitCells.current.add(nk);
        }
      }
    }

    const pct = guideCells.current.size > 0
      ? hitCells.current.size / guideCells.current.size
      : 0;
    setCoverage(Math.min(1, pct));

    if (pct >= COMPLETION_THRESHOLD && !completed) {
      setCompleted(true);
      speak(`${displayLetter}! ${t('alphabets.correct')}`);

      db.progress.add({
        module: 'alphabets',
        activityType: 'trace-letter',
        activityData: { letter: displayLetter, coverage: Math.round(pct * 100) },
        result: 'correct',
        durationSecs: Math.round((Date.now() - startTime.current) / 1000),
        createdAt: new Date().toISOString(),
      });

      db.rewards.toCollection().first().then((r) => {
        if (r) {
          db.rewards.update(r.id, { totalStars: (r.totalStars || 0) + 1 });
        } else {
          db.rewards.add({ totalStars: 1, currentStreak: 0, longestStreak: 0, lastActive: new Date().toISOString() });
        }
        setStarAwarded(true);
      });
    }
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    isDrawing.current = true;
    const pos = getPos(e);
    if (pos) lastPos.current = pos;
  };

  const handlePointerMove = (e) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const pos = getPos(e);
    if (!pos || !lastPos.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#58CC02';
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    updateCoverage(pos.x, pos.y);
    lastPos.current = pos;
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    lastPos.current = null;
  };

  const handleClear = () => {
    setupCanvas();
  };

  const goNext = () => {
    if (index < alphabetData.length - 1) {
      setIndex((i) => i + 1);
      startTime.current = Date.now();
    }
  };

  const goPrev = () => {
    if (index > 0) {
      setIndex((i) => i - 1);
      startTime.current = Date.now();
    }
  };

  const coveragePct = Math.round(coverage * 100);

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <p className="text-lg font-display font-extrabold text-white text-center">
        {t('alphabets.traceTheLetter', { letter: displayLetter })}
      </p>

      <div ref={containerRef} className="w-full max-w-sm flex justify-center">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="rounded-2xl bg-surface border-2 border-border touch-none cursor-crosshair"
        />
      </div>

      {/* Coverage bar */}
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-display font-bold text-text-secondary">
            {coveragePct}%
          </span>
          {completed && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs font-display font-bold text-primary"
            >
              {t('alphabets.correct')}
            </motion.span>
          )}
        </div>
        <div className="h-2 rounded-full bg-border overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${coveragePct}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          />
        </div>
      </div>

      {completed && starAwarded && (
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-5xl"
        >
          ⭐
        </motion.span>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 text-white font-extrabold text-lg flex items-center justify-center disabled:opacity-30 cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          aria-label="Previous letter"
        >
          &larr;
        </button>
        <button
          onClick={handleClear}
          className="px-5 py-2 rounded-xl bg-accent text-white font-display font-extrabold text-sm cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
        >
          {t('common.reset')}
        </button>
        <button
          onClick={goNext}
          disabled={index === alphabetData.length - 1}
          className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 text-white font-extrabold text-lg flex items-center justify-center disabled:opacity-30 cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          aria-label="Next letter"
        >
          &rarr;
        </button>
      </div>

      <span className="text-sm font-display font-bold text-text-secondary">
        {index + 1} / {alphabetData.length}
      </span>
    </div>
  );
}
