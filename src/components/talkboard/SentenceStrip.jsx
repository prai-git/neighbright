import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import EmojiCard from '../common/EmojiCard';
import IconButton from '../common/IconButton';

const MAX_WORDS = 8;

export default function SentenceStrip({ words, onSpeak, onClear, onRemoveWord, flash }) {
  const { t } = useTranslation();

  return (
    <div className="mx-4 mt-3 bg-surface rounded-2xl shadow-md border border-gray-100 p-3 min-h-[72px] flex items-center gap-2">
      {/* Word chips */}
      <div className="flex-1 flex items-center gap-2 overflow-x-auto min-w-0">
        {words.length === 0 ? (
          <p className="text-sm text-text-secondary font-display px-1 whitespace-nowrap">
            {t('talkBoard.sentenceStrip')}
          </p>
        ) : (
          <AnimatePresence mode="popLayout">
            {words.map((word, i) => (
              <motion.div
                key={`${word.id}-${i}`}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <EmojiCard
                  emoji={word.emoji}
                  label={word.label}
                  size="sm"
                  onClick={() => onRemoveWord(i)}
                  showLabel
                />
              </motion.div>
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
        <IconButton
          icon="🔊"
          label={t('talkBoard.speak')}
          onClick={onSpeak}
          disabled={words.length === 0}
          size="md"
        />
        <IconButton
          icon="❌"
          label={t('talkBoard.clear')}
          onClick={onClear}
          disabled={words.length === 0}
          size="md"
        />
      </div>
    </div>
  );
}

SentenceStrip.MAX_WORDS = MAX_WORDS;
