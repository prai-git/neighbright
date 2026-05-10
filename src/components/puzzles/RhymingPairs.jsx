import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import PuzzleWrapper from './PuzzleWrapper';

const RHYME_SETS = [
  [
    { word: 'cat', pair: 'hat' },
    { word: 'dog', pair: 'log' },
    { word: 'fish', pair: 'dish' },
  ],
  [
    { word: 'cake', pair: 'lake' },
    { word: 'moon', pair: 'spoon' },
    { word: 'star', pair: 'car' },
  ],
  [
    { word: 'bee', pair: 'tree' },
    { word: 'fox', pair: 'box' },
    { word: 'ring', pair: 'king' },
  ],
  [
    { word: 'hen', pair: 'pen' },
    { word: 'boat', pair: 'coat' },
    { word: 'mice', pair: 'rice' },
  ],
];

function generateRound() {
  const set = RHYME_SETS[Math.floor(Math.random() * RHYME_SETS.length)];
  const cards = set.flatMap((pair) => [
    { word: pair.word, pairId: pair.word },
    { word: pair.pair, pairId: pair.word },
  ]);
  return cards.sort(() => Math.random() - 0.5);
}

export default function RhymingPairs({ onComplete, onBack }) {
  const { t, language } = useTranslation();
  const { speak } = useSpeech();
  const [cards, setCards] = useState(() => generateRound());
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState([]);
  const [shaking, setShaking] = useState(null);

  const isComplete = matched.length === 6;

  useEffect(() => {
    speak('Match the rhyming pairs!');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (language !== 'en') {
    return (
      <div className="flex flex-col items-center gap-4 py-10">
        <span className="text-5xl">🎵</span>
        <p className="text-lg font-display font-extrabold text-white text-center">
          {t('puzzles.rhyming')}
        </p>
        <p className="text-sm text-text-secondary text-center max-w-xs">
          This puzzle is only available in English. Please switch to English to play.
        </p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-white/10 border-2 border-white/20 text-white font-display font-extrabold text-sm cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
        >
          ← {t('common.back')}
        </button>
      </div>
    );
  }

  const handleTap = (index) => {
    const card = cards[index];
    if (matched.includes(card.word) || matched.includes(cards.find((c) => c.pairId === card.pairId && c.word !== card.word)?.word)) return;

    if (selected === null) {
      setSelected(index);
      speak(card.word);
    } else if (selected === index) {
      setSelected(null);
    } else {
      const selectedCard = cards[selected];
      if (selectedCard.pairId === card.pairId) {
        // Match found
        setMatched((prev) => [...prev, selectedCard.word, card.word]);
        speak(`${selectedCard.word} and ${card.word}!`);
        setSelected(null);
      } else {
        // No match
        setShaking(index);
        setTimeout(() => {
          setShaking(null);
          setSelected(null);
        }, 500);
      }
    }
  };

  return (
    <PuzzleWrapper
      puzzleId="rhyming"
      tier={2}
      isComplete={isComplete}
      roundsCorrect={matched.length / 2}
      roundsTotal={3}
      onPlayAgain={() => {
        setCards(generateRound());
        setSelected(null);
        setMatched([]);
        setShaking(null);
      }}
      onBack={onBack}
    >
      <div className="flex flex-col gap-5 items-center">
        <p className="text-sm font-display font-bold text-text-secondary">
          {t('puzzles.rhyming')} — Match the pairs!
        </p>

        <div className="grid grid-cols-3 gap-3 max-w-sm">
          {cards.map((card, idx) => {
            const isMatched = matched.includes(card.word);
            const isSelected = selected === idx;
            const isShaking = shaking === idx;
            return (
              <motion.button
                key={idx}
                onClick={() => handleTap(idx)}
                className={`py-4 px-3 rounded-xl text-center font-display font-extrabold text-sm cursor-pointer border-2 transition-all shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] ${
                  isMatched
                    ? 'border-primary bg-primary/20 text-primary'
                    : isSelected
                    ? 'border-white bg-white/20 text-white'
                    : 'border-border bg-surface text-white hover:bg-white/10'
                }`}
                animate={isShaking ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                disabled={isMatched}
              >
                {card.word}
              </motion.button>
            );
          })}
        </div>
      </div>
    </PuzzleWrapper>
  );
}
