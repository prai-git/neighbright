import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../data/i18n';

const MAX_WORDS = 8;

export default function SentenceStrip({ words, onSpeak, onClear, onRemoveWord, flash }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl border border-border p-3 min-h-[64px] flex items-center gap-2">
      {/* Word chips */}
      <div className="flex-1 flex items-center gap-1.5 overflow-x-auto hide-scrollbar min-w-0">
        {words.length === 0 ? (
          <p className="text-sm text-text-secondary/50 font-display px-1 whitespace-nowrap select-none">
            {t('talkBoard.sentenceStrip')}
          </p>
        ) : (
          <AnimatePresence mode="popLayout">
            {words.map((word, i) => (
              <motion.button
                key={`${word.id}-${i}`}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={() => onRemoveWord(i)}
                className="flex items-center gap-1 bg-primary/8 rounded-full px-2.5 py-1.5 shrink-0 cursor-pointer hover:bg-primary/15 transition-colors"
              >
                <span className="text-lg">{word.emoji}</span>
                <span className="text-xs font-display font-bold text-text-primary">{word.label}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        )}
        {flash && (
          <motion.span
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs text-primary font-display shrink-0"
          >
            Max {MAX_WORDS}
          </motion.span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onSpeak}
          disabled={words.length === 0}
          className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg disabled:opacity-30 cursor-pointer disabled:cursor-default transition-opacity"
          aria-label={t('talkBoard.speak')}
        >
          🔊
        </button>
        {words.length > 0 && (
          <button
            onClick={onClear}
            className="w-8 h-8 rounded-full text-text-secondary/40 hover:text-text-secondary flex items-center justify-center text-sm cursor-pointer transition-colors"
            aria-label={t('talkBoard.clear')}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

SentenceStrip.MAX_WORDS = MAX_WORDS;
