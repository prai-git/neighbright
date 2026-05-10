import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import PuzzleWrapper from './PuzzleWrapper';

const SHAPES = [
  { id: 'circle', name: 'circle', color: '#FF4B4B', path: 'M50,10 A40,40 0 1,1 50,90 A40,40 0 1,1 50,10 Z' },
  { id: 'square', name: 'square', color: '#1CB0F6', path: 'M15,15 H85 V85 H15 Z' },
  { id: 'triangle', name: 'triangle', color: '#58CC02', path: 'M50,10 L90,85 L10,85 Z' },
  { id: 'star', name: 'star', color: '#FF9600', path: 'M50,5 L61,35 L95,35 L68,55 L79,90 L50,70 L21,90 L32,55 L5,35 L39,35 Z' },
  { id: 'heart', name: 'heart', color: '#CE82FF', path: 'M50,85 C20,60 5,40 15,25 C25,10 40,15 50,30 C60,15 75,10 85,25 C95,40 80,60 50,85 Z' },
];

function ShapeIcon({ shape, size = 60, ghost = false, selected = false, placed = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path
        d={shape.path}
        fill={ghost ? 'transparent' : placed ? shape.color : shape.color}
        stroke={ghost ? '#4A5568' : selected ? '#fff' : shape.color}
        strokeWidth={ghost ? 3 : selected ? 4 : 2}
        strokeDasharray={ghost ? '8 4' : 'none'}
        opacity={ghost ? 0.4 : 1}
      />
    </svg>
  );
}

export default function ShapeSorter({ onComplete, onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const [selected, setSelected] = useState(null);
  const [placed, setPlaced] = useState([]);
  const [shuffledShapes, setShuffledShapes] = useState([]);

  const isComplete = placed.length === SHAPES.length;

  useEffect(() => {
    const shuffled = [...SHAPES].sort(() => Math.random() - 0.5);
    setShuffledShapes(shuffled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShapeTap = (shapeId) => {
    if (placed.includes(shapeId)) return;
    setSelected(shapeId);
  };

  const handleHoleTap = (shapeId) => {
    if (!selected || placed.includes(shapeId)) return;
    if (selected === shapeId) {
      setPlaced((prev) => [...prev, shapeId]);
      const shape = SHAPES.find((s) => s.id === shapeId);
      speak(shape.name);
      setSelected(null);
    } else {
      setSelected(null);
    }
  };

  return (
    <PuzzleWrapper
      puzzleId="shape-sorter"
      tier={1}
      isComplete={isComplete}
      roundsCorrect={placed.length}
      roundsTotal={SHAPES.length}
      onPlayAgain={() => {
        setPlaced([]);
        setSelected(null);
        setShuffledShapes([...SHAPES].sort(() => Math.random() - 0.5));
      }}
      onBack={onBack}
    >
      <div className="flex flex-col gap-6">
        <p className="text-center text-sm font-display font-bold text-text-secondary">
          {t('puzzles.dragToMatch')}
        </p>

        {/* Shapes to pick */}
        <div className="flex flex-wrap justify-center gap-3">
          {shuffledShapes.map((shape) => {
            const isPlaced = placed.includes(shape.id);
            const isSelected = selected === shape.id;
            return (
              <motion.button
                key={shape.id}
                onClick={() => handleShapeTap(shape.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  isPlaced
                    ? 'opacity-30'
                    : isSelected
                    ? 'bg-white/20 ring-2 ring-white scale-110'
                    : 'bg-surface border-2 border-border hover:bg-white/10'
                }`}
                whileTap={{ scale: 0.95 }}
                disabled={isPlaced}
              >
                <ShapeIcon shape={shape} selected={isSelected} />
              </motion.button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t-2 border-dashed border-border" />

        {/* Holes to place */}
        <div className="flex flex-wrap justify-center gap-3">
          {SHAPES.map((shape) => {
            const isPlaced = placed.includes(shape.id);
            return (
              <motion.button
                key={`hole-${shape.id}`}
                onClick={() => handleHoleTap(shape.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all ${
                  isPlaced
                    ? 'bg-surface/50'
                    : selected
                    ? 'bg-surface border-2 border-white/30 hover:bg-white/10'
                    : 'bg-surface border-2 border-border'
                }`}
                whileTap={{ scale: 0.95 }}
                animate={isPlaced ? { scale: [1, 1.2, 1] } : {}}
              >
                {isPlaced ? (
                  <ShapeIcon shape={shape} placed />
                ) : (
                  <ShapeIcon shape={shape} ghost />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </PuzzleWrapper>
  );
}
