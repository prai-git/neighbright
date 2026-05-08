import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';

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

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {QUICK_PHRASES.map(({ key, emoji }) => (
        <motion.button
          key={key}
          whileTap={{ scale: 0.93, y: 2 }}
          onClick={() => onPhraseTap(t(`talkBoard.${key}`))}
          className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl bg-accent/10 border border-accent/20 cursor-pointer hover:bg-accent/20 hover:border-accent/40 transition-colors shadow-[0_2px_0_rgba(0,0,0,0.15)] active:shadow-[0_0px_0_rgba(0,0,0,0.15)] active:translate-y-[2px]"
        >
          <span className="text-xl">{emoji}</span>
          <span className="text-[11px] font-display font-bold text-accent leading-tight text-center">
            {t(`talkBoard.${key}`)}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
