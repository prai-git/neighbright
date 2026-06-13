import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import PuzzleWrapper from './PuzzleWrapper';

const SENTENCES = [
  ['I', 'am', 'happy'],
  ['The', 'cat', 'is', 'big'],
  ['I', 'like', 'apples'],
  ['She', 'can', 'run', 'fast'],
  ['The', 'dog', 'is', 'cute'],
  ['I', 'want', 'water'],
  ['He', 'has', 'a', 'ball'],
  ['We', 'go', 'to', 'school'],
  ['The', 'bird', 'can', 'fly'],
  ['I', 'see', 'a', 'fish'],
];

const TOTAL_ROUNDS = 5;

function generateRound(usedIndices) {
  const available = SENTENCES.map((s, i) => i).filter((i) => !usedIndices.includes(i));
  const pool = available.length > 0 ? available : SENTENCES.map((_, i) => i);
  const idx = pool[Math.floor(Math.random() * pool.length)];
  const sentence = SENTENCES[idx];
  const shuffled = [...sentence].sort(() => Math.random() - 0.5);
  return { sentence, shuffled, idx };
}

export default function SentenceBuilder({ onComplete, onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [usedIndices, setUsedIndices] = useState([]);
  const [roundData, setRoundData] = useState(() => generateRound([]));
  const [built, setBuilt] = useState([]);
  const [available, setAvailable] = useState(() => roundData.shuffled.map((w, i) => ({ word: w, idx: i })));
  const [wrong, setWrong] = useState(false);

  const isComplete = round >= TOTAL_ROUNDS;

  useEffect(() => {
    if (!isComplete) {
      const newRound = generateRound(usedIndices);
      setRoundData(newRound);
      setBuilt([]);
      setAvailable(newRound.shuffled.map((w, i) => ({ word: w, idx: i })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  useEffect(() => {
    if (built.length === roundData.sentence.length && built.length > 0) {
      const builtSentence = built.map((b) => b.word).join(' ');
      speak(builtSentence);
      setCorrect((prev) => prev + 1);
      setTimeout(() => {
        setUsedIndices((prev) => [...prev, roundData.idx]);
        setRound((prev) => prev + 1);
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [built.length]);

  const handleWordTap = (item) => {
    const nextIndex = built.length;
    const expectedWord = roundData.sentence[nextIndex];

    if (item.word === expectedWord) {
      setBuilt((prev) => [...prev, item]);
      setAvailable((prev) => prev.filter((a) => a.idx !== item.idx));
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 500);
    }
  };

  const handleUndo = () => {
    if (built.length === 0) return;
    const last = built[built.length - 1];
    setBuilt((prev) => prev.slice(0, -1));
    setAvailable((prev) => [...prev, last]);
  };

  return (
    <PuzzleWrapper
      puzzleId="sentence-build"
      tier={3}
      isComplete={isComplete}
      roundsCorrect={correct}
      roundsTotal={TOTAL_ROUNDS}
      onPlayAgain={() => {
        setRound(0);
        setCorrect(0);
        setUsedIndices([]);
        const newRound = generateRound([]);
        setRoundData(newRound);
        setBuilt([]);
        setAvailable(newRound.shuffled.map((w, i) => ({ word: w, idx: i })));
      }}
      onBack={onBack}
    >
      <div className="flex flex-col gap-5 items-center">
        <p className="text-sm font-display font-bold text-text-secondary">
          {t('puzzles.sentenceBuild')} — {round + 1}/{TOTAL_ROUNDS}
        </p>

        {/* Built sentence strip */}
        <div className="flex flex-wrap gap-2 min-h-[48px] bg-surface border-2 border-border rounded-xl px-4 py-3 w-full max-w-sm justify-center items-center">
          {built.length === 0 && (
            <span className="text-text-secondary text-sm">{t('puzzles.tapWordsInOrder')}</span>
          )}
          {built.map((item, idx) => (
            <motion.span
              key={idx}
              initial={{ scale: 0, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              className="px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/40 text-white font-display font-bold text-sm"
            >
              {item.word}
            </motion.span>
          ))}
          {built.length > 0 && (
            <button
              onClick={handleUndo}
              className="text-text-secondary hover:text-white text-xs cursor-pointer ml-1"
            >
              ↩
            </button>
          )}
        </div>

        {/* Available words */}
        <motion.div
          className="flex flex-wrap gap-2 justify-center"
          animate={wrong ? { x: [0, -5, 5, -5, 5, 0] } : {}}
        >
          {available.map((item) => (
            <motion.button
              key={item.idx}
              onClick={() => handleWordTap(item)}
              className="px-4 py-2.5 rounded-xl bg-surface border-2 border-border text-white font-display font-extrabold text-sm cursor-pointer hover:bg-white/10 transition-all shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
              whileTap={{ scale: 0.95 }}
            >
              {item.word}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </PuzzleWrapper>
  );
}
