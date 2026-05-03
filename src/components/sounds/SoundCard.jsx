import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';

export default function SoundCard({ sound, completedLevels = [], onSelect }) {
  const { t } = useTranslation();
  const totalLevels = 5;
  const done = completedLevels.length;

  // First initial-position example word
  const exampleWord = sound.examples?.initial?.[0] ?? '';

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(sound)}
      className="bg-surface rounded-2xl p-4 text-left shadow-sm border border-border hover:border-primary transition-colors w-full focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {/* Phoneme symbol */}
      <div className="text-4xl font-mono font-bold text-primary mb-1 text-center">
        {sound.symbol}
      </div>

      {/* Example word */}
      {exampleWord && (
        <div className="text-sm text-text-secondary text-center mb-2 capitalize">
          e.g. <em>{exampleWord}</em>
        </div>
      )}

      {/* Age of acquisition badge */}
      <div className="flex justify-center mb-3">
        <span className="text-xs bg-secondary/20 text-text-secondary rounded-full px-2 py-0.5">
          {t('sounds.ageAcquisition', { age: sound.ageOfAcquisition })}
        </span>
      </div>

      {/* Level progress dots */}
      <div className="flex gap-1.5 justify-center">
        {Array.from({ length: totalLevels }, (_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < done ? 'bg-primary' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </motion.button>
  );
}
