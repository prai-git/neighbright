import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import PuzzleWrapper from './PuzzleWrapper';

const STORIES = [
  {
    id: 'morning',
    cards: [
      { emoji: '🌅', label: 'Wake up' },
      { emoji: '🪥', label: 'Brush teeth' },
      { emoji: '🥣', label: 'Eat breakfast' },
      { emoji: '🎒', label: 'Go to school' },
    ],
  },
  {
    id: 'plant',
    cards: [
      { emoji: '🌱', label: 'Plant a seed' },
      { emoji: '💧', label: 'Water it' },
      { emoji: '☀️', label: 'Sunshine' },
      { emoji: '🌻', label: 'Flower grows' },
    ],
  },
  {
    id: 'baking',
    cards: [
      { emoji: '📖', label: 'Read recipe' },
      { emoji: '🥣', label: 'Mix ingredients' },
      { emoji: '🔥', label: 'Bake in oven' },
      { emoji: '🍪', label: 'Enjoy cookies' },
    ],
  },
  {
    id: 'bedtime',
    cards: [
      { emoji: '🛁', label: 'Take a bath' },
      { emoji: '👕', label: 'Put on pajamas' },
      { emoji: '📚', label: 'Read a story' },
      { emoji: '🌙', label: 'Go to sleep' },
    ],
  },
];

const TOTAL_ROUNDS = 4;

function generateRound(usedStories) {
  const available = STORIES.filter((s) => !usedStories.includes(s.id));
  const pool = available.length > 0 ? available : STORIES;
  const story = pool[Math.floor(Math.random() * pool.length)];
  const shuffled = [...story.cards].sort(() => Math.random() - 0.5);
  return { story, shuffled };
}

export default function StorySequence({ onComplete, onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [usedStories, setUsedStories] = useState([]);
  const [roundData, setRoundData] = useState(() => generateRound([]));
  const [placed, setPlaced] = useState([]);
  const [wrong, setWrong] = useState(null);

  const isComplete = round >= TOTAL_ROUNDS;

  useEffect(() => {
    speak(t('puzzles.putStoryInOrder'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  useEffect(() => {
    if (placed.length === roundData.story.cards.length && placed.length > 0) {
      setCorrect((prev) => prev + 1);
      speak(t('puzzles.greatStory'));
      setTimeout(() => {
        const newUsed = [...usedStories, roundData.story.id];
        setUsedStories(newUsed);
        setRound((prev) => prev + 1);
        const newRound = generateRound(newUsed);
        setRoundData(newRound);
        setPlaced([]);
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placed.length]);

  const handleCardTap = (card) => {
    if (placed.find((p) => p.label === card.label)) return;
    const nextIndex = placed.length;
    const expected = roundData.story.cards[nextIndex];

    if (card.label === expected.label) {
      setPlaced((prev) => [...prev, card]);
      speak(card.label);
    } else {
      setWrong(card.label);
      setTimeout(() => setWrong(null), 500);
    }
  };

  return (
    <PuzzleWrapper
      puzzleId="story-sequence"
      tier={3}
      isComplete={isComplete}
      roundsCorrect={correct}
      roundsTotal={TOTAL_ROUNDS}
      onPlayAgain={() => {
        setRound(0);
        setCorrect(0);
        setUsedStories([]);
        const newRound = generateRound([]);
        setRoundData(newRound);
        setPlaced([]);
      }}
      onBack={onBack}
    >
      <div className="flex flex-col gap-5 items-center">
        <p className="text-sm font-display font-bold text-text-secondary">
          {t('puzzles.storySequence')} — {round + 1}/{TOTAL_ROUNDS}
        </p>

        {/* Placed sequence */}
        <div className="flex gap-2 min-h-[80px] items-center">
          {roundData.story.cards.map((_, idx) => (
            <div
              key={idx}
              className={`w-16 h-20 rounded-xl flex flex-col items-center justify-center gap-1 border-2 ${
                placed[idx]
                  ? 'border-primary bg-primary/20'
                  : 'border-dashed border-border bg-surface/50'
              }`}
            >
              {placed[idx] ? (
                <>
                  <span className="text-2xl">{placed[idx].emoji}</span>
                  <span className="text-[9px] text-white font-bold">{idx + 1}</span>
                </>
              ) : (
                <span className="text-text-secondary text-sm">{idx + 1}</span>
              )}
            </div>
          ))}
        </div>

        {/* Available cards */}
        <div className="grid grid-cols-2 gap-3">
          {roundData.shuffled.map((card) => {
            const isPlaced = placed.find((p) => p.label === card.label);
            const isWrong = wrong === card.label;
            if (isPlaced) return null;
            return (
              <motion.button
                key={card.label}
                onClick={() => handleCardTap(card)}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-surface border-2 border-border cursor-pointer hover:bg-white/10 transition-all shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
                animate={isWrong ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-3xl">{card.emoji}</span>
                <span className="text-xs font-display font-bold text-white">{card.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </PuzzleWrapper>
  );
}
