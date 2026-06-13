import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import db from '../../db';

export default function PictureCardGrid({ category, onWordTap }) {
  const { t } = useTranslation();
  const [customCards, setCustomCards] = useState([]);
  const [hiddenIds, setHiddenIds] = useState(new Set());
  const [showHidden, setShowHidden] = useState(false);
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

  const loadHiddenCards = useCallback(() => {
    db.hiddenCards
      .toArray()
      .then((rows) => setHiddenIds(new Set(rows.map((r) => r.cardId))))
      .catch(() => setHiddenIds(new Set()));
  }, []);

  useEffect(() => {
    loadCustomCards();
    loadHiddenCards();
  }, [loadCustomCards, loadHiddenCards]);

  const handleTap = (word) => {
    if (confirmDeleteId) {
      setConfirmDeleteId(null);
      return;
    }
    setTappedId(word.id);
    setTimeout(() => setTappedId(null), 400);
    onWordTap(word);
  };

  const handleDeleteClick = (e, word) => {
    e.stopPropagation();
    if (word.isCustom) {
      if (confirmDeleteId === word.dbId) {
        db.customVocabulary.delete(word.dbId).then(loadCustomCards);
        setConfirmDeleteId(null);
      } else {
        setConfirmDeleteId(word.dbId);
      }
    } else {
      // Built-in card: hide it
      if (confirmDeleteId === word.id) {
        db.hiddenCards.put({ cardId: word.id }).then(loadHiddenCards);
        setConfirmDeleteId(null);
      } else {
        setConfirmDeleteId(word.id);
      }
    }
  };

  const handleRestore = (e, cardId) => {
    e.stopPropagation();
    db.hiddenCards.delete(cardId).then(loadHiddenCards);
  };

  const allWords = [
    ...category.words.map((w) => ({ ...w, isCustom: false })),
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

  const visibleWords = allWords.filter((w) => !hiddenIds.has(w.id));
  const hiddenBuiltInCards = allWords.filter((w) => !w.isCustom && hiddenIds.has(w.id));
  const hasHiddenCards = hiddenBuiltInCards.length > 0;

  return (
    <div>
      <div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
        role="grid"
        aria-label={t(category.i18nKey)}
      >
        <AnimatePresence>
          {visibleWords.map((word) => {
            const label = word.i18nWord ? t(word.i18nWord) : word.customWord;
            const deleteKey = word.isCustom ? word.dbId : word.id;
            const isConfirming = confirmDeleteId === deleteKey;
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
                {/* Delete/hide button */}
                <button
                  type="button"
                  onClick={(e) => handleDeleteClick(e, word)}
                  className={`absolute top-1 right-1 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${
                    isConfirming
                      ? 'bg-error text-white'
                      : 'bg-white/10 text-text-secondary hover:bg-error/80 hover:text-white'
                  }`}
                  aria-label={isConfirming ? 'Confirm remove' : 'Remove card'}
                >
                  ✕
                </button>
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

      {/* Show/restore hidden cards */}
      {hasHiddenCards && (
        <div className="mt-4">
          <button
            onClick={() => setShowHidden(!showHidden)}
            className="text-sm font-display font-bold text-text-secondary hover:text-primary transition cursor-pointer"
          >
            {showHidden ? '▾ Hide hidden cards' : `▸ Show ${hiddenBuiltInCards.length} hidden card${hiddenBuiltInCards.length > 1 ? 's' : ''}`}
          </button>
          {showHidden && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-3">
              {hiddenBuiltInCards.map((word) => {
                const label = word.i18nWord ? t(word.i18nWord) : word.customWord;
                return (
                  <motion.button
                    key={word.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleRestore(e, word.id)}
                    aria-label={`Restore ${label}`}
                    className="relative flex flex-col items-center justify-center gap-1 p-2 rounded-2xl bg-surface/50 border-2 border-border/50 cursor-pointer hover:border-primary/50 transition-all aspect-square"
                  >
                    <span className="text-5xl sm:text-6xl md:text-7xl opacity-50">{word.emoji}</span>
                    <span className="text-sm sm:text-base font-display font-extrabold text-white/50 truncate max-w-full">
                      {label}
                    </span>
                    <span className="absolute bottom-2 text-[10px] font-display font-bold text-primary">
                      tap to restore
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
