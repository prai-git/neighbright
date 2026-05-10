import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSpeech } from '../../hooks/useSpeech';
import PuzzleWrapper from './PuzzleWrapper';

const ANALOGY_PAIRS = [
  { a: '🐦', aName: 'bird', b: '☀️', bName: 'sky', c: '🐟', cName: 'fish', answer: '🌊', answerName: 'water', distractors: ['🌳', '🏠'] },
  { a: '🐕', aName: 'dog', b: '🦴', bName: 'bone', c: '🐱', cName: 'cat', answer: '🐟', answerName: 'fish', distractors: ['🚗', '📚'] },
  { a: '🐝', aName: 'bee', b: '🌸', bName: 'flower', c: '🦋', cName: 'butterfly', answer: '🌺', answerName: 'garden', distractors: ['🏔️', '🌙'] },
  { a: '🔑', aName: 'key', b: '🔒', bName: 'lock', c: '✉️', cName: 'letter', answer: '📬', answerName: 'mailbox', distractors: ['🎸', '🧊'] },
  { a: '☔', aName: 'rain', b: '☂️', bName: 'umbrella', c: '❄️', cName: 'snow', answer: '🧤', answerName: 'gloves', distractors: ['🍕', '🎈'] },
  { a: '👶', aName: 'baby', b: '🍼', bName: 'bottle', c: '🐴', cName: 'horse', answer: '🌾', answerName: 'hay', distractors: ['💎', '🎵'] },
  { a: '🚗', aName: 'car', b: '🛣️', bName: 'road', c: '🚢', cName: 'ship', answer: '🌊', answerName: 'sea', distractors: ['🏔️', '🌲'] },
  { a: '📖', aName: 'book', b: '📚', bName: 'library', c: '🍎', cName: 'apple', answer: '🌳', answerName: 'tree', distractors: ['🏠', '🚀'] },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Analogies({ onBack }) {
  const { speak } = useSpeech();
  const [rounds] = useState(() => shuffle(ANALOGY_PAIRS).slice(0, 8));
  const [round, setRound] = useState(0);
  const [choices, setChoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (round >= rounds.length) return;
    const r = rounds[round];
    setChoices(shuffle([r.answer, ...r.distractors]));
    setSelected(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  useEffect(() => {
    if (round < rounds.length) {
      const r = rounds[round];
      speak(`${r.aName} is to ${r.bName} as ${r.cName} is to what?`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const handleSelect = useCallback((choice) => {
    if (selected !== null) return;
    const r = rounds[round];
    setSelected(choice);
    const isCorrect = choice === r.answer;
    if (isCorrect) setCorrect((c) => c + 1);

    setTimeout(() => {
      if (round + 1 >= rounds.length) {
        setIsComplete(true);
      } else {
        setRound((r) => r + 1);
      }
    }, 1500);
  }, [selected, round, rounds]);

  const r = rounds[round];

  return (
    <PuzzleWrapper
      puzzleId="analogies"
      tier={3}
      isComplete={isComplete}
      roundsCorrect={correct}
      roundsTotal={rounds.length}
      onPlayAgain={() => { setRound(0); setCorrect(0); setIsComplete(false); }}
      onBack={onBack}
    >
      <div className="flex flex-col items-center gap-6">
        <p className="text-sm font-display font-bold text-text-secondary">
          Round {round + 1} of {rounds.length}
        </p>

        <div className="flex items-center gap-3 text-4xl flex-wrap justify-center">
          <span>{r.a}</span>
          <span className="text-lg text-text-secondary">is to</span>
          <span>{r.b}</span>
          <span className="text-lg text-text-secondary">as</span>
          <span>{r.c}</span>
          <span className="text-lg text-text-secondary">is to</span>
          <span className="text-4xl">❓</span>
        </div>

        <div className="flex gap-4 flex-wrap justify-center">
          {choices.map((c, i) => {
            const isCorrectChoice = c === r.answer;
            const isSelected = selected === c;
            let borderColor = 'border-border';
            if (selected !== null && isSelected) {
              borderColor = isCorrectChoice ? 'border-green-400' : 'border-red-400';
            } else if (selected !== null && isCorrectChoice) {
              borderColor = 'border-green-400';
            }

            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                animate={isSelected && !isCorrectChoice ? { x: [0, -8, 8, -8, 0] } : isSelected && isCorrectChoice ? { scale: [1, 1.2, 1] } : {}}
                onClick={() => handleSelect(c)}
                className={`w-20 h-20 rounded-2xl bg-surface border-2 ${borderColor} flex items-center justify-center text-4xl cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] transition-colors`}
              >
                {c}
              </motion.button>
            );
          })}
        </div>
      </div>
    </PuzzleWrapper>
  );
}
