import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import PuzzleWrapper from './PuzzleWrapper';

function generateMaze(size) {
  const grid = Array.from({ length: size }, () => Array(size).fill(1));
  const visited = Array.from({ length: size }, () => Array(size).fill(false));

  function carve(r, c) {
    visited[r][c] = true;
    grid[r][c] = 0;
    const dirs = [[0, 2], [2, 0], [0, -2], [-2, 0]].sort(() => Math.random() - 0.5);
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited[nr][nc]) {
        grid[r + dr / 2][c + dc / 2] = 0;
        carve(nr, nc);
      }
    }
  }

  carve(1, 1);
  grid[1][1] = 0;
  grid[size - 2][size - 2] = 0;
  return grid;
}

const DIRS = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
};

export default function Maze({ onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const size = 9;
  const [maze, setMaze] = useState(() => generateMaze(size));
  const [pos, setPos] = useState({ r: 1, c: 1 });
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const goalR = size - 2;
  const goalC = size - 2;
  const cellSize = useMemo(() => Math.min(36, Math.floor(300 / size)), [size]);

  useEffect(() => {
    speak(t('puzzles.findWayToStar'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const move = useCallback((dir) => {
    if (isComplete) return;
    const [dr, dc] = DIRS[dir];
    const nr = pos.r + dr, nc = pos.c + dc;
    if (nr >= 0 && nr < size && nc >= 0 && nc < size && maze[nr][nc] === 0) {
      setPos({ r: nr, c: nc });
      setMoves(m => m + 1);
      speak(dir);
      if (nr === goalR && nc === goalC) {
        setTimeout(() => setIsComplete(true), 500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, maze, isComplete, size, goalR, goalC]);

  const reset = useCallback(() => {
    const newMaze = generateMaze(size);
    setMaze(newMaze);
    setPos({ r: 1, c: 1 });
    setMoves(0);
    setIsComplete(false);
  }, [size]);

  return (
    <PuzzleWrapper
      puzzleId="maze"
      tier={3}
      isComplete={isComplete}
      roundsCorrect={1}
      roundsTotal={1}
      onPlayAgain={reset}
      onBack={onBack}
    >
      <div className="flex flex-col items-center gap-5">
        <p className="text-sm font-display font-bold text-text-secondary">
          {t('puzzles.moves', { count: moves })}
        </p>

        <div
          className="rounded-xl overflow-hidden border-2 border-border"
          style={{ display: 'grid', gridTemplateColumns: `repeat(${size}, ${cellSize}px)` }}
        >
          {maze.map((row, r) =>
            row.map((cell, c) => {
              const isPlayer = pos.r === r && pos.c === c;
              const isGoal = r === goalR && c === goalC;
              const isWall = cell === 1;

              return (
                <div
                  key={`${r}-${c}`}
                  className={`flex items-center justify-center ${isWall ? 'bg-[#1B2B32]' : 'bg-[#233A44]'}`}
                  style={{ width: cellSize, height: cellSize }}
                >
                  {isPlayer && (
                    <motion.span
                      layout
                      className="text-lg"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      🐱
                    </motion.span>
                  )}
                  {isGoal && !isPlayer && <span className="text-lg">⭐</span>}
                </div>
              );
            })
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 w-fit">
          <div />
          <button
            onClick={() => move('up')}
            className="w-14 h-14 rounded-xl bg-surface border-2 border-border flex items-center justify-center text-2xl cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            ⬆️
          </button>
          <div />
          <button
            onClick={() => move('left')}
            className="w-14 h-14 rounded-xl bg-surface border-2 border-border flex items-center justify-center text-2xl cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            ⬅️
          </button>
          <div />
          <button
            onClick={() => move('right')}
            className="w-14 h-14 rounded-xl bg-surface border-2 border-border flex items-center justify-center text-2xl cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            ➡️
          </button>
          <div />
          <button
            onClick={() => move('down')}
            className="w-14 h-14 rounded-xl bg-surface border-2 border-border flex items-center justify-center text-2xl cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            ⬇️
          </button>
          <div />
        </div>
      </div>
    </PuzzleWrapper>
  );
}
