import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';

export default function SoundCard({ sound, completedLevels = [], onSelect }) {
  const { t } = useTranslation();
  const totalLevels = 5;
  const done = completedLevels.length;

  // First initial-position example word
  const exampleWord = sound.examples?.initial?.[0] ?? '';
  // Strip slashes from symbol for display
  const displaySymbol = sound.symbol.replace(/\//g, '');

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(sound)}
      className="bg-white rounded-2xl p-4 text-center border border-border hover:shadow-md transition-shadow w-full cursor-pointer"
    >
      {/* Phoneme symbol — big and bold, no slashes */}
      <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
        <span className="text-2xl font-display font-extrabold text-primary">
          {displaySymbol}
        </span>
      </div>

      {/* Example word */}
      {exampleWord && (
        <p className="text-sm text-text-secondary capitalize mb-2">
          {exampleWord}
        </p>
      )}

      {/* Level progress dots */}
      <div className="flex gap-1 justify-center">
        {Array.from({ length: totalLevels }, (_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < done ? 'bg-primary' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </motion.button>
  );
}
