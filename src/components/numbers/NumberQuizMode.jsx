import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useSpeech } from '../../hooks/useSpeech';
import { numberData, countableEmojis, getNumberRange } from '../../data/numbers';
import { useProfile } from '../../contexts/ProfileContext';
import { shuffle } from '../../utils/game-helpers';
import GameWrapper from '../games/GameWrapper';

const TOTAL_ROUNDS = 10;

// Question type generators
function generateTypeA(min, max) {
  // "Show me the number X" — tap correct digit from options
  const answer = min + Math.floor(Math.random() * (max - min + 1));
  const optionSet = new Set([answer]);
  while (optionSet.size < Math.min(4, max - min + 1)) {
    optionSet.add(min + Math.floor(Math.random() * (max - min + 1)));
  }
  return {
    type: 'A',
    answer,
    options: shuffle([...optionSet]),
    prompt: null, // will use speak
  };
}

function generateTypeB(min, max) {
  // "How many?" — show emojis, pick correct count
  const effectiveMin = Math.max(1, min);
  const answer = effectiveMin + Math.floor(Math.random() * (max - effectiveMin + 1));
  const emoji = countableEmojis[Math.floor(Math.random() * countableEmojis.length)];
  const optionSet = new Set([answer]);
  while (optionSet.size < Math.min(4, max - effectiveMin + 2)) {
    const opt = effectiveMin + Math.floor(Math.random() * (max - effectiveMin + 1));
    optionSet.add(opt);
  }
  if (optionSet.size < 3) {
    if (answer > 0) optionSet.add(answer - 1);
    if (answer < 20) optionSet.add(answer + 1);
  }
  return {
    type: 'B',
    answer,
    emoji,
    options: shuffle([...optionSet]).sort((a, b) => a - b),
  };
}

function generateTypeC(min, max) {
  // "What comes next?" — show sequence, pick next number
  const seqStart = min + Math.floor(Math.random() * Math.max(1, max - min - 2));
  const sequence = [seqStart, seqStart + 1, seqStart + 2];
  const answer = seqStart + 3;
  if (answer > 20) {
    // fallback
    return generateTypeA(min, max);
  }
  const optionSet = new Set([answer]);
  while (optionSet.size < 3) {
    const opt = Math.max(0, answer + (Math.floor(Math.random() * 5) - 2));
    if (opt !== answer) optionSet.add(opt);
  }
  return {
    type: 'C',
    answer,
    sequence,
    options: shuffle([...optionSet]).sort((a, b) => a - b),
  };
}

function generateTypeD(min, max) {
  // "Which has more?" — two groups of emojis
  const effectiveMin = Math.max(1, min);
  let a = effectiveMin + Math.floor(Math.random() * (max - effectiveMin + 1));
  let b = effectiveMin + Math.floor(Math.random() * (max - effectiveMin + 1));
  while (a === b) {
    b = effectiveMin + Math.floor(Math.random() * (max - effectiveMin + 1));
  }
  const emoji1 = countableEmojis[Math.floor(Math.random() * countableEmojis.length)];
  let emoji2 = countableEmojis[Math.floor(Math.random() * countableEmojis.length)];
  while (emoji2 === emoji1) {
    emoji2 = countableEmojis[Math.floor(Math.random() * countableEmojis.length)];
  }
  return {
    type: 'D',
    groups: [
      { count: a, emoji: emoji1 },
      { count: b, emoji: emoji2 },
    ],
    answer: a > b ? 0 : 1,
  };
}

function generateQuestion(tier, min, max) {
  const rand = Math.random();
  if (tier === 1) {
    return rand < 0.5 ? generateTypeA(min, max) : generateTypeB(min, max);
  }
  if (tier === 2) {
    if (rand < 0.35) return generateTypeA(min, max);
    if (rand < 0.65) return generateTypeB(min, max);
    return generateTypeC(min, max);
  }
  // Tier 3
  if (rand < 0.25) return generateTypeA(min, max);
  if (rand < 0.5) return generateTypeB(min, max);
  if (rand < 0.75) return generateTypeC(min, max);
  return generateTypeD(min, max);
}

export default function NumberQuizMode({ onBack }) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const { profile } = useProfile();
  const tier = profile?.tier || 1;
  const [min, max] = getNumberRange(tier);

  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(null);
  const timeoutRef = useRef(null);

  const question = useMemo(() => generateQuestion(tier, min, max), [round]); // eslint-disable-line react-hooks/exhaustive-deps

  const isComplete = round >= TOTAL_ROUNDS;

  // Speak prompt for each question
  useEffect(() => {
    if (isComplete) return;
    if (question.type === 'A') {
      const word = numberData[question.answer]?.i18nWord;
      if (word) speak(t('numbers.tapTheNumber', { number: t(word) }));
    } else if (question.type === 'B') {
      speak(t('numbers.howMany'));
    } else if (question.type === 'C') {
      speak(t('numbers.whatComesNext'));
    } else if (question.type === 'D') {
      speak(t('numbers.whichHasMore'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleAnswer = useCallback((answer) => {
    if (selected !== null) return;
    setSelected(answer);

    let isCorrect = false;
    if (question.type === 'D') {
      isCorrect = answer === question.answer;
    } else {
      isCorrect = answer === question.answer;
    }

    if (isCorrect) {
      setShowResult('correct');
      setCorrect((c) => c + 1);
      // Speak the answer
      if (question.type === 'A' || question.type === 'B' || question.type === 'C') {
        const word = numberData[question.answer]?.i18nWord;
        if (word) speak(t(word));
      }
      timeoutRef.current = setTimeout(() => {
        setRound((r) => r + 1);
        setSelected(null);
        setShowResult(null);
      }, 1500);
    } else {
      setShowResult('incorrect');
      timeoutRef.current = setTimeout(() => {
        setRound((r) => r + 1);
        setSelected(null);
        setShowResult(null);
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, question]);

  const handlePlayAgain = () => {
    setRound(0);
    setCorrect(0);
    setSelected(null);
    setShowResult(null);
  };

  const renderQuestion = () => {
    if (question.type === 'A') {
      return (
        <div className="flex flex-col items-center gap-5">
          <p className="text-lg font-display font-extrabold text-white text-center">
            {t('numbers.tapTheNumber', { number: t(numberData[question.answer]?.i18nWord || '') })}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {question.options.map((num) => {
              let btnClass = 'bg-surface border-2 border-border text-white';
              if (selected !== null) {
                if (num === question.answer) btnClass = 'bg-primary/20 border-2 border-primary text-primary';
                else if (num === selected) btnClass = 'bg-red-500/20 border-2 border-red-500 text-red-400';
              }
              return (
                <motion.button
                  key={num}
                  whileTap={{ scale: 0.92 }}
                  animate={num === selected && showResult === 'incorrect' ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                  onClick={() => handleAnswer(num)}
                  disabled={selected !== null}
                  className={`w-20 h-20 rounded-2xl font-display font-extrabold text-4xl cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] disabled:cursor-not-allowed transition-all ${btnClass}`}
                >
                  {num}
                </motion.button>
              );
            })}
          </div>
        </div>
      );
    }

    if (question.type === 'B') {
      return (
        <div className="flex flex-col items-center gap-5">
          <p className="text-lg font-display font-extrabold text-white text-center">
            {t('numbers.howMany')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 p-4 rounded-2xl bg-surface border-2 border-border min-h-[80px]">
            {Array.from({ length: question.answer }, (_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="text-3xl"
              >
                {question.emoji}
              </motion.span>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {question.options.map((num) => {
              let btnClass = 'bg-surface border-2 border-border text-white';
              if (selected !== null) {
                if (num === question.answer) btnClass = 'bg-primary/20 border-2 border-primary text-primary';
                else if (num === selected) btnClass = 'bg-red-500/20 border-2 border-red-500 text-red-400';
              }
              return (
                <motion.button
                  key={num}
                  whileTap={{ scale: 0.92 }}
                  animate={num === selected && showResult === 'incorrect' ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                  onClick={() => handleAnswer(num)}
                  disabled={selected !== null}
                  className={`w-16 h-16 rounded-2xl font-display font-extrabold text-2xl cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] disabled:cursor-not-allowed transition-all ${btnClass}`}
                >
                  {num}
                </motion.button>
              );
            })}
          </div>
        </div>
      );
    }

    if (question.type === 'C') {
      return (
        <div className="flex flex-col items-center gap-5">
          <p className="text-lg font-display font-extrabold text-white text-center">
            {t('numbers.whatComesNext')}
          </p>
          <div className="flex items-center gap-3">
            {question.sequence.map((num, i) => (
              <span key={i} className="text-4xl font-display font-extrabold text-white">
                {num}{i < question.sequence.length - 1 && <span className="text-text-secondary">,</span>}
              </span>
            ))}
            <span className="text-4xl font-display font-extrabold text-accent">?</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {question.options.map((num) => {
              let btnClass = 'bg-surface border-2 border-border text-white';
              if (selected !== null) {
                if (num === question.answer) btnClass = 'bg-primary/20 border-2 border-primary text-primary';
                else if (num === selected) btnClass = 'bg-red-500/20 border-2 border-red-500 text-red-400';
              }
              return (
                <motion.button
                  key={num}
                  whileTap={{ scale: 0.92 }}
                  animate={num === selected && showResult === 'incorrect' ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                  onClick={() => handleAnswer(num)}
                  disabled={selected !== null}
                  className={`w-16 h-16 rounded-2xl font-display font-extrabold text-2xl cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] disabled:cursor-not-allowed transition-all ${btnClass}`}
                >
                  {num}
                </motion.button>
              );
            })}
          </div>
        </div>
      );
    }

    if (question.type === 'D') {
      return (
        <div className="flex flex-col items-center gap-5">
          <p className="text-lg font-display font-extrabold text-white text-center">
            {t('numbers.whichHasMore')}
          </p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {question.groups.map((group, i) => {
              let cardClass = 'bg-surface border-2 border-border';
              if (selected !== null) {
                if (i === question.answer) cardClass = 'bg-primary/20 border-2 border-primary';
                else if (i === selected) cardClass = 'bg-red-500/20 border-2 border-red-500';
              }
              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.96 }}
                  animate={i === selected && showResult === 'incorrect' ? { x: [0, -6, 6, -6, 6, 0] } : {}}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  className={`p-4 rounded-2xl cursor-pointer shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] disabled:cursor-not-allowed transition-all flex flex-wrap items-center justify-center gap-1 min-h-[100px] ${cardClass}`}
                >
                  {Array.from({ length: group.count }, (_, j) => (
                    <motion.span
                      key={j}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: j * 0.03 }}
                      className="text-2xl"
                    >
                      {group.emoji}
                    </motion.span>
                  ))}
                </motion.button>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <GameWrapper
      activityType="number-quiz"
      difficulty={`tier${tier}`}
      isComplete={isComplete}
      roundsCorrect={correct}
      roundsTotal={TOTAL_ROUNDS}
      onPlayAgain={handlePlayAgain}
      onBack={onBack}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Round indicator */}
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-display font-bold text-text-secondary">
            {t('numbers.round', { current: round + 1, total: TOTAL_ROUNDS })}
          </span>
          <span className="text-sm font-display font-bold text-primary">
            ⭐ {correct}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((round) / TOTAL_ROUNDS) * 100}%` }}
          />
        </div>

        {renderQuestion()}

        {/* Feedback */}
        {showResult && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-lg font-display font-extrabold ${
              showResult === 'correct' ? 'text-primary' : 'text-red-400'
            }`}
          >
            {showResult === 'correct' ? t('numbers.correct') : t('numbers.tryAgain')}
          </motion.p>
        )}
      </div>
    </GameWrapper>
  );
}
