import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import PuzzleWrapper from './PuzzleWrapper';

const LETTER_WORDS = {
  B: [{ emoji: '🍌', word: 'banana' }, { emoji: '🐻', word: 'bear' }, { emoji: '📖', word: 'book' }, { emoji: '🚌', word: 'bus' }],
  C: [{ emoji: '🐱', word: 'cat' }, { emoji: '🚗', word: 'car' }, { emoji: '🍪', word: 'cookie' }, { emoji: '🧁', word: 'cake' }],
  D: [{ emoji: '🐕', word: 'dog' }, { emoji: '🦆', word: 'duck' }, { emoji: '🚪', word: 'door' }, { emoji: '💃', word: 'dance' }],
  F: [{ emoji: '🐟', word: 'fish' }, { emoji: '🐸', word: 'frog' }, { emoji: '🍴', word: 'fork' }, { emoji: '🌸', word: 'flower' }],
  H: [{ emoji: '🐴', word: 'horse' }, { emoji: '🎩', word: 'hat' }, { emoji: '🏠', word: 'house' }, { emoji: '🤚', word: 'hand' }],
  M: [{ emoji: '🐒', word: 'monkey' }, { emoji: '🥛', word: 'milk' }, { emoji: '🌙', word: 'moon' }, { emoji: '🗺️', word: 'map' }],
  S: [{ emoji: '⭐', word: 'star' }, { emoji: '🌞', word: 'sun' }, { emoji: '🧦', word: 'socks' }, { emoji: '🍜', word: 'soup' }],
  T: [{ emoji: '🐢', word: 'turtle' }, { emoji: '🚂', word: 'train' }, { emoji: '🌳', word: 'tree' }, { emoji: '🦷', word: 'tooth' }],
};

const ALL_WORDS = Object.values(LETTER_WORDS).flat();

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateRound() {
  const letters = shuffle(Object.keys(LETTER_WORDS));
  const letter = letters[0];
  const correctWords = shuffle(LETTER_WORDS[letter]).slice(0, 2);
  const otherLetters = letters.slice(1, 3);
  const distractors = otherLetters.map(l => shuffle(LETTER_WORDS[l])[0]);
  return {
    letter,
    items: shuffle([...correctWords, ...distractors]),
    correctWords: correctWords.map(w => w.word),
  };
}

export default function BeginningSound({ onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const [roundIndex, setRoundIndex] = useState(0);
  const [roundData, setRoundData] = useState(() => generateRound());
  const [tapped, setTapped] = useState(new Set());
  const [correct, setCorrect] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setRoundData(generateRound());
    setTapped(new Set());
    setCorrect(0);
  }, [roundIndex]);

  useEffect(() => {
    speak(t('puzzles.tapAllStartWith', { letter: roundData.letter }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIndex]);

  const handleTap = useCallback((word) => {
    if (tapped.has(word)) return;
    const isCorrect = roundData.correctWords.includes(word);
    setTapped(prev => new Set(prev).add(word));
    if (isCorrect) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setTotalCorrect(t => t + 1);
      speak(word);
      if (newCorrect >= roundData.correctWords.length) {
        setTimeout(() => {
          if (roundIndex + 1 >= 8) {
            setIsComplete(true);
          } else {
            setRoundIndex(r => r + 1);
          }
        }, 1200);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tapped, roundData, correct, roundIndex]);

  return (
    <PuzzleWrapper
      puzzleId="beginning-sounds"
      tier={3}
      isComplete={isComplete}
      roundsCorrect={totalCorrect}
      roundsTotal={16}
      onPlayAgain={() => { setRoundIndex(0); setTotalCorrect(0); setIsComplete(false); }}
      onBack={onBack}
    >
      <div className="flex flex-col items-center gap-6">
        <p className="text-sm font-display font-bold text-text-secondary">
          {t('puzzles.roundOf', { current: roundIndex + 1, total: 8 })}
        </p>

        <div className="w-24 h-24 rounded-2xl bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
          <span className="text-5xl font-display font-extrabold text-white">{roundData.letter}</span>
        </div>

        <p className="text-sm font-display font-bold text-text-secondary">
          {t('puzzles.tapWordsStartWith', { letter: roundData.letter })}
        </p>

        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {roundData.items.map((item, i) => {
            const wasTapped = tapped.has(item.word);
            const isCorrect = roundData.correctWords.includes(item.word);
            let bg = 'bg-surface border-border';
            if (wasTapped && isCorrect) bg = 'bg-green-500/20 border-green-400';
            else if (wasTapped && !isCorrect) bg = 'bg-red-500/20 border-red-400';

            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                animate={wasTapped && !isCorrect ? { x: [0, -5, 5, -5, 0] } : {}}
                onClick={() => handleTap(item.word)}
                disabled={wasTapped}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 ${bg} cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] transition-colors disabled:opacity-60`}
              >
                <span className="text-3xl">{item.emoji}</span>
                <span className="font-display font-extrabold text-sm text-white">{item.word}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </PuzzleWrapper>
  );
}
