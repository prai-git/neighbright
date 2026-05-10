import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import { wordCategories } from '../../data/vocabulary';
import { shuffle, pickRandom } from '../../utils/game-helpers';
import PuzzleWrapper from './PuzzleWrapper';

const TOTAL_ROUNDS = 10;

function generateRound(usedIds) {
  const allWords = wordCategories.flatMap((c) => c.words);
  const available = allWords.filter((w) => !usedIds.includes(w.id));
  const pool = available.length >= 4 ? available : allWords;
  const target = pickRandom(pool, 1)[0];
  const distractors = pickRandom(
    allWords.filter((w) => w.id !== target.id),
    3
  );
  const choices = shuffle([target, ...distractors]);
  return { target, choices };
}

export default function WordPicture({ onComplete, onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [usedIds, setUsedIds] = useState([]);
  const [roundData, setRoundData] = useState(() => generateRound([]));
  const [result, setResult] = useState(null);

  const isComplete = round >= TOTAL_ROUNDS;

  useEffect(() => {
    if (!isComplete) {
      speak(t(roundData.target.i18nWord));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const handleChoice = (word) => {
    if (result) return;
    const isCorrect = word.id === roundData.target.id;
    setResult(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setCorrect((prev) => prev + 1);

    setTimeout(() => {
      const newUsed = [...usedIds, roundData.target.id];
      setUsedIds(newUsed);
      setRound((prev) => prev + 1);
      setRoundData(generateRound(newUsed));
      setResult(null);
    }, 1000);
  };

  return (
    <PuzzleWrapper
      puzzleId="word-picture"
      tier={3}
      isComplete={isComplete}
      roundsCorrect={correct}
      roundsTotal={TOTAL_ROUNDS}
      onPlayAgain={() => {
        setRound(0);
        setCorrect(0);
        setUsedIds([]);
        setRoundData(generateRound([]));
        setResult(null);
      }}
      onBack={onBack}
    >
      <div className="flex flex-col gap-6 items-center">
        <p className="text-sm font-display font-bold text-text-secondary">
          {t('puzzles.wordPicture')} — {round + 1}/{TOTAL_ROUNDS}
        </p>

        {/* Word display */}
        <motion.div
          key={round}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border-2 border-border rounded-2xl px-8 py-4"
        >
          <p className="text-2xl font-display font-extrabold text-white">
            {t(roundData.target.i18nWord)}
          </p>
        </motion.div>

        {/* Emoji choices */}
        <div className="grid grid-cols-2 gap-3">
          {roundData.choices.map((word) => {
            const isCorrectChoice = word.id === roundData.target.id;
            return (
              <motion.button
                key={word.id}
                onClick={() => handleChoice(word)}
                className={`w-24 h-24 rounded-xl flex items-center justify-center text-5xl cursor-pointer border-2 transition-all shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] ${
                  result && isCorrectChoice
                    ? 'border-primary bg-primary/20'
                    : result === 'wrong' && !isCorrectChoice
                    ? 'border-border bg-surface opacity-40'
                    : 'border-border bg-surface hover:bg-white/10'
                }`}
                whileTap={{ scale: 0.95 }}
                disabled={!!result}
              >
                {word.emoji}
              </motion.button>
            );
          })}
        </div>

        {result && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-3xl"
          >
            {result === 'correct' ? '✅' : '❌'}
          </motion.span>
        )}
      </div>
    </PuzzleWrapper>
  );
}
