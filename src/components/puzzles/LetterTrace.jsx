import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import PuzzleWrapper from './PuzzleWrapper';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const TOTAL_LETTERS = 5;

function pickRandomLetters() {
  const shuffled = [...LETTERS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, TOTAL_LETTERS);
}

export default function LetterTrace({ onComplete, onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const canvasRef = useRef(null);
  const [letters] = useState(() => pickRandomLetters());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [passed, setPassed] = useState(0);

  const isComplete = currentIndex >= TOTAL_LETTERS;
  const currentLetter = letters[currentIndex];

  useEffect(() => {
    if (!isComplete && currentLetter) {
      speak(`Trace the letter ${currentLetter}`);
      drawGuide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const drawGuide = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    ctx.clearRect(0, 0, size, size);

    // Draw letter as guide
    ctx.font = `bold ${size * 0.7}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(139, 164, 180, 0.25)';
    ctx.fillText(currentLetter || '', size / 2, size / 2);
  }, [currentLetter]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = '#58CC02';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const handlePointerMove = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const handlePointerUp = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
    setStrokeCount((prev) => prev + 1);
  };

  const handleNext = () => {
    if (strokeCount >= 1) {
      setPassed((prev) => prev + 1);
    }
    setCurrentIndex((prev) => prev + 1);
    setStrokeCount(0);
  };

  const handleClear = () => {
    drawGuide();
    setStrokeCount(0);
  };

  return (
    <PuzzleWrapper
      puzzleId="letter-trace"
      tier={2}
      isComplete={isComplete}
      roundsCorrect={passed}
      roundsTotal={TOTAL_LETTERS}
      onPlayAgain={() => {
        setCurrentIndex(0);
        setPassed(0);
        setStrokeCount(0);
      }}
      onBack={onBack}
    >
      <div className="flex flex-col gap-4 items-center">
        <p className="text-sm font-display font-bold text-text-secondary">
          {t('puzzles.letterTrace')} — {currentIndex + 1}/{TOTAL_LETTERS}
        </p>

        <p className="text-lg font-display font-extrabold text-white">
          {t('puzzles.traceTheLetter')}: {currentLetter}
        </p>

        {/* Canvas */}
        <div className="relative bg-surface border-2 border-border rounded-2xl overflow-hidden touch-none">
          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            aria-label={`Trace the letter ${currentLetter}`}
            role="img"
            className="w-[280px] h-[280px] cursor-crosshair"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClear}
            className="px-5 py-2.5 rounded-xl bg-white/10 border-2 border-white/20 text-white font-display font-extrabold text-sm cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            Clear
          </button>
          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-display font-extrabold text-sm cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_2px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            Next →
          </button>
        </div>
      </div>
    </PuzzleWrapper>
  );
}
