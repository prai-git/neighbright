import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';

export default function SoundGroupSelector({ groups, onSelectGroup }) {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h2 className="text-xl font-display font-bold text-text-primary mb-4">
        {t('sounds.chooseSoundGroup')}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {groups.map((group, i) => (
          <motion.button
            key={group.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectGroup(group)}
            className="bg-surface rounded-2xl p-4 text-left shadow-sm border border-border hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {/* Mouth diagram preview */}
            <img
              src={`/images/mouth/${group.sounds[0]?.mouthDiagramKey}.svg`}
              alt=""
              className="w-16 h-16 mx-auto mb-2 rounded-xl"
              loading="lazy"
            />
            {/* Group name */}
            <div className="font-semibold text-text-primary text-sm text-center mb-2">
              {t(group.i18nKey)}
            </div>
            {/* Sound badges */}
            <div className="flex flex-wrap gap-1 justify-center">
              {group.sounds.map(s => (
                <span
                  key={s.id}
                  className="bg-primary/10 text-primary text-xs font-mono px-1.5 py-0.5 rounded-full"
                >
                  {s.symbol}
                </span>
              ))}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
