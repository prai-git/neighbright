import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import EmojiCard from '../common/EmojiCard';
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
      className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-4 py-3"
      role="grid"
      aria-label={t(category.i18nKey)}
    >
      {allWords.map((word) => {
        const label = word.i18nWord ? t(word.i18nWord) : word.customWord;
        return (
          <motion.div
            key={word.id}
            animate={tappedId === word.id ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <EmojiCard
              emoji={word.emoji}
              label={label}
              size="md"
              onClick={() => handleTap(word)}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
