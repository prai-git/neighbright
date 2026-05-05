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
    <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
      {QUICK_PHRASES.map(({ key, emoji }) => (
        <button
          key={key}
          onClick={() => onPhraseTap(t(`talkBoard.${key}`))}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-border text-sm font-display font-bold text-text-secondary whitespace-nowrap shrink-0 cursor-pointer hover:border-primary hover:text-primary transition-colors"
        >
          <span>{emoji}</span>
          <span>{t(`talkBoard.${key}`)}</span>
        </button>
      ))}
    </div>
  );
}
