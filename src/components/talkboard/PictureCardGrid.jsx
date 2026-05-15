import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import db from '../../db';

export default function PictureCardGrid({ category, onWordTap }) {
  const { t } = useTranslation();
  const [customCards, setCustomCards] = useState([]);
  const [tappedId, setTappedId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const loadCustomCards = useCallback(() => {
    db.customVocabulary
      .where('category')
      .equals(category.id)
      .toArray()
      .then(setCustomCards)
      .catch(() => setCustomCards([]));
  }, [category.id]);

  useEffect(() => {
    loadCustomCards();
  }, [loadCustomCards]);

  const handleTap = (word) => {
    if (confirmDeleteId) {
      setConfirmDeleteId(null);
      return;
    }
    setTappedId(word.id);
    setTimeout(() => setTappedId(null), 400);
    onWordTap(word);
  };

  const handleDeleteClick = (e, dbId) => {
    e.stopPropagation();
    if (confirmDeleteId === dbId) {
      db.customVocabulary.delete(dbId).then(loadCustomCards);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(dbId);
    }
  };

  const allWords = [
    ...category.words,
    ...customCards.map((c) => ({
      id: `custom-${c.id}`,
      dbId: c.id,
      emoji: c.emoji,
      photoData: c.photoData || null,
      i18nWord: null,
      i18nPhrase: null,
      customWord: c.word,
      customPhrase: c.phrase,
      isCustom: true,
    })),
  ];

  return (
    <div
      className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
      role="grid"
      aria-label={t(category.i18nKey)}
    >
      <AnimatePresence>
        {allWords.map((word) => {
          const label = word.i18nWord ? t(word.i18nWord) : word.customWord;
          const isConfirming = word.isCustom && confirmDeleteId === word.dbId;
          return (
            <motion.button
              key={word.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={tappedId === word.id ? { opacity: 1, scale: [1, 1.1, 1] } : { opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.25 }}
              whileTap={{ scale: 0.92, y: 2 }}
              onClick={() => handleTap(word)}
              aria-label={label}
              className="relative flex flex-col items-center justify-center gap-1 p-2 rounded-2xl bg-surface border-2 border-border cursor-pointer hover:border-primary/50 transition-all aspect-square shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
            >
              {/* Delete button for custom cards */}
              {word.isCustom && (
                <span
                  onClick={(e) => handleDeleteClick(e, word.dbId)}
                  className={`absolute top-1 right-1 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${
                    isConfirming
                      ? 'bg-error text-white'
                      : 'bg-white/10 text-text-secondary hover:bg-error/80 hover:text-white'
                  }`}
                  aria-label={isConfirming ? 'Confirm delete' : 'Delete card'}
                >
                  ✕
                </span>
              )}
              {word.photoData ? (
                <img src={word.photoData} alt={label} className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl object-cover" />
              ) : (
                <span className="text-5xl sm:text-6xl md:text-7xl">{word.emoji}</span>
              )}
              <span className="text-sm sm:text-base font-display font-extrabold text-white truncate max-w-full">
                {label}
              </span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
