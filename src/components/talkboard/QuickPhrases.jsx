import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import Button from '../common/Button';

const QUICK_PHRASES = [
  { key: 'iNeedHelp',       emoji: '🆘' },
  { key: 'iWantMore',       emoji: '➕' },
  { key: 'allDone',         emoji: '✅' },
  { key: 'bathroomPlease',  emoji: '🚽' },
  { key: 'yes',             emoji: '👍' },
  { key: 'no',              emoji: '👎' },
];

export default function QuickPhrases({ onPhraseTap }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);

  return (
    <div className="mx-4 mb-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-display font-semibold text-text-secondary mb-2 cursor-pointer"
        aria-expanded={open}
      >
        <span>{open ? '▾' : '▸'}</span>
        {t('talkBoard.quickPhrases')}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 py-1">
              {QUICK_PHRASES.map(({ key, emoji }) => (
                <Button
                  key={key}
                  variant="ghost"
                  size="lg"
                  icon={emoji}
                  onClick={() => onPhraseTap(t(`talkBoard.${key}`))}
                >
                  {t(`talkBoard.${key}`)}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
