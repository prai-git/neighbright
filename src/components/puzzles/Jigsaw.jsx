import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import PuzzleWrapper from './PuzzleWrapper';

const SCENES = [
  ['🌳', '🌞', '🏠', '🌻', '🐶', '🐱', '🦋', '🌈', '⭐', '🌙', '🐸', '🍎', '🌺', '🍄', '🐝', '🌿'],
  ['🐠', '🐙', '🦀', '🐚', '🌊', '⛵', '🐋', '🦈', '🐡', '🦑', '🐬', '🪸', '🦞', '🐳', '🏖️', '🧜'],
  ['🚗', '🏢', '🌲', '☁️', '🚌', '🏪', '🌳', '🌤️', '🏫', '🚕', '🌻', '🌈', '🏠', '🛤️', '🚲', '🌸'],
];

function generatePuzzle(gridSize) {
  const scene = SCENES[Math.floor(Math.random() * SCENES.length)];
  const totalPieces = gridSize * gridSize;
  const pieces = scene.slice(0, totalPieces).map((emoji, i) => ({
    id: i,
    emoji,
    correctPos: i,
  }));
  // Shuffle positions
  const positions = pieces.map((_, i) => i).sort(() => Math.random() - 0.5);
  return { pieces, positions, gridSize };
}

export default function Jigsaw({ onComplete, onBack, config }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const gridSize = config?.pieces === 16 ? 4 : config?.pieces === 9 ? 3 : 2;
  const totalPieces = gridSize * gridSize;

  const [puzzle, setPuzzle] = useState(() => generatePuzzle(gridSize));
  const [selected, setSelected] = useState(null);
  const [placedCount, setPlacedCount] = useState(0);

  // Track which positions have the correct piece
  const correctPositions = useMemo(() => {
    const correct = new Set();
    puzzle.positions.forEach((pieceId, posIdx) => {
      if (puzzle.pieces[pieceId].correctPos === posIdx) {
        correct.add(posIdx);
      }
    });
    return correct;
  }, [puzzle.positions, puzzle.pieces]);

  const isComplete = correctPositions.size === totalPieces;

  const handleCellTap = (posIndex) => {
    if (correctPositions.has(posIndex) && selected !== posIndex) return;

    if (selected === null) {
      setSelected(posIndex);
    } else if (selected === posIndex) {
      setSelected(null);
    } else {
      // Swap
      const newPositions = [...puzzle.positions];
      [newPositions[selected], newPositions[posIndex]] = [newPositions[posIndex], newPositions[selected]];
      setPuzzle((prev) => ({ ...prev, positions: newPositions }));
      setSelected(null);

      // Check if swap made correct placements
      let newCorrect = 0;
      newPositions.forEach((pieceId, idx) => {
        if (puzzle.pieces[pieceId].correctPos === idx) newCorrect++;
      });
      if (newCorrect > placedCount) {
        speak('Nice!');
        setPlacedCount(newCorrect);
      }
    }
  };

  const handlePlayAgain = () => {
    setPuzzle(generatePuzzle(gridSize));
    setSelected(null);
    setPlacedCount(0);
  };

  const cellSize = gridSize === 2 ? 'w-28 h-28' : gridSize === 3 ? 'w-20 h-20' : 'w-16 h-16';
  const emojiSize = gridSize === 2 ? 'text-5xl' : gridSize === 3 ? 'text-3xl' : 'text-2xl';

  return (
    <PuzzleWrapper
      puzzleId={`jigsaw-${totalPieces}`}
      tier={gridSize === 2 ? 1 : gridSize === 3 ? 2 : 3}
      isComplete={isComplete}
      roundsCorrect={correctPositions.size}
      roundsTotal={totalPieces}
      onPlayAgain={handlePlayAgain}
      onBack={onBack}
    >
      <div className="flex flex-col gap-4 items-center">
        <p className="text-sm font-display font-bold text-text-secondary">
          {t('puzzles.jigsaw')} ({gridSize}x{gridSize}) — {t('puzzles.tapTwoToSwap')}
        </p>

        {/* Guide (faint) */}
        <div className="opacity-30">
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          >
            {puzzle.pieces.map((piece) => (
              <div
                key={`guide-${piece.id}`}
                className={`${cellSize} rounded-lg bg-surface flex items-center justify-center ${emojiSize}`}
              >
                {piece.emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Puzzle grid */}
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {puzzle.positions.map((pieceId, posIdx) => {
            const piece = puzzle.pieces[pieceId];
            const isCorrect = correctPositions.has(posIdx);
            const isSelected = selected === posIdx;
            return (
              <motion.button
                key={posIdx}
                onClick={() => handleCellTap(posIdx)}
                className={`${cellSize} rounded-lg flex items-center justify-center ${emojiSize} cursor-pointer transition-all ${
                  isCorrect
                    ? 'bg-primary/20 border-2 border-primary/40'
                    : isSelected
                    ? 'bg-white/20 border-2 border-white ring-2 ring-white/50'
                    : 'bg-surface border-2 border-border hover:bg-white/10'
                }`}
                whileTap={{ scale: 0.95 }}
                animate={isCorrect ? { scale: [1, 1.1, 1] } : {}}
              >
                {piece.emoji}
              </motion.button>
            );
          })}
        </div>
      </div>
    </PuzzleWrapper>
  );
}
