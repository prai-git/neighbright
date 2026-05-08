import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';

const GROUP_COLORS = [
  { bg: '#58CC02', dark: '#46A302' },
  { bg: '#1CB0F6', dark: '#1899D6' },
  { bg: '#FF9600', dark: '#E08600' },
  { bg: '#CE82FF', dark: '#B06FDF' },
  { bg: '#FF4B4B', dark: '#E04343' },
  { bg: '#2B70C9', dark: '#2460B0' },
  { bg: '#FF86D0', dark: '#E070B8' },
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.96, y: 2 }}
              onClick={() => onSelectGroup(group)}
              className="module-card flex flex-col items-center gap-3 p-5 md:p-6 cursor-pointer text-center"
              style={{ backgroundColor: color.bg }}
            >
              {/* Sound symbols in dark container */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: color.dark }}
              >
                <span className="text-white font-display font-extrabold text-xl">
                  {group.sounds.slice(0, 2).map(s => s.symbol.replace(/\//g, '')).join(' ')}
                </span>
              </div>
              {/* Group name */}
              <div className="font-display font-extrabold text-sm text-white drop-shadow-sm">
                {t(group.i18nKey)}
              </div>
              {/* Sound badges */}
              <div className="flex flex-wrap gap-1 justify-center">
                {group.sounds.map(s => (
                  <span
                    key={s.id}
                    className="text-xs font-display font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: color.dark, color: 'rgba(255,255,255,0.9)' }}
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
