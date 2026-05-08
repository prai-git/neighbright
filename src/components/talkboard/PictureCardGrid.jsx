import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import db from '../../db';

export default function PictureCardGrid({ category, onWordTap }) {
  const { t } = useTranslation();
  const [customCards, setCustomCards] = useState([]);
  const [tappedId, setTappedId] = useState(null);

  useEffect(() => {
    db.customVocabulary
      .where('category')
      .equals(category.id)
      .toArray()
      .then(setCustomCards)
      .catch(() => setCustomCards([]));
  }, [category.id]);

  const handleTap = (word) => {
    setTappedId(word.id);
    setTimeout(() => setTappedId(null), 400);
    onWordTap(word);
  };

  const allWords = [
    ...category.words,
    ...customCards.map((c) => ({
      id: `custom-${c.id}`,
      emoji: c.emoji,
      i18nWord: null,
      i18nPhrase: null,
      customWord: c.word,
      customPhrase: c.phrase,
    })),
  ];

  return (
    <div
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
      role="grid"
      aria-label={t(category.i18nKey)}
    >
      {allWords.map((word) => {
        const label = word.i18nWord ? t(word.i18nWord) : word.customWord;
        return (
          <motion.button
            key={word.id}
            animate={tappedId === word.id ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.25 }}
            whileTap={{ scale: 0.92, y: 2 }}
            onClick={() => handleTap(word)}
            aria-label={label}
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-surface border-2 border-border cursor-pointer hover:border-primary/50 transition-all aspect-square shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            <span className="text-4xl sm:text-5xl">{word.emoji}</span>
            <span className="text-xs font-display font-extrabold text-white truncate max-w-full">
              {label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
