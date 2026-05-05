import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';

const GROUP_COLORS = [
  { bg: '#FFF0F0', accent: '#FF6B6B' },
  { bg: '#FFF7F0', accent: '#E17055' },
  { bg: '#FFFBF0', accent: '#FECA57' },
  { bg: '#F0FFF9', accent: '#55E6C1' },
  { bg: '#F0F7FF', accent: '#74B9FF' },
  { bg: '#F5F3FF', accent: '#A29BFE' },
  { bg: '#FFF0F8', accent: '#FD79A8' },
];

export default function SoundGroupSelector({ groups, onSelectGroup }) {
  const { t } = useTranslation();

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {groups.map((group, i) => {
          const color = GROUP_COLORS[i % GROUP_COLORS.length];
          return (
            <motion.button
              key={group.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectGroup(group)}
              className="flex flex-col items-center gap-3 p-5 rounded-3xl text-center cursor-pointer hover:shadow-lg transition-shadow"
              style={{ backgroundColor: color.bg }}
            >
              {/* Sound symbols in a colored circle */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: color.accent }}
              >
                <span className="text-white font-display font-extrabold text-lg">
                  {group.sounds.slice(0, 2).map(s => s.symbol.replace(/\//g, '')).join(' ')}
                </span>
              </div>
              {/* Group name */}
              <div className="font-display font-bold text-sm text-text-primary">
                {t(group.i18nKey)}
              </div>
              {/* Sound badges */}
              <div className="flex flex-wrap gap-1 justify-center">
                {group.sounds.map(s => (
                  <span
                    key={s.id}
                    className="text-xs font-display font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${color.accent}15`, color: color.accent }}
                  >
                    {s.symbol.replace(/\//g, '')}
                  </span>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
