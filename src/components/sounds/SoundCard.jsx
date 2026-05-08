import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';

export default function SoundCard({ sound, completedLevels = [], onSelect }) {
  const { t } = useTranslation();
  const totalLevels = 5;
  const done = completedLevels.length;

  const exampleWord = sound.examples?.initial?.[0] ?? '';
  const displaySymbol = sound.symbol.replace(/\//g, '');

  return (
    <motion.button
      whileTap={{ scale: 0.95, y: 2 }}
      onClick={() => onSelect(sound)}
      className="bg-surface rounded-2xl p-4 text-center border-2 border-border shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] hover:border-primary/50 transition-all w-full cursor-pointer"
    >
      {/* Phoneme symbol */}
      <div className="w-14 h-14 mx-auto rounded-2xl bg-secondary/20 flex items-center justify-center mb-2 border border-secondary/30">
        <span className="text-2xl font-display font-extrabold text-secondary">
          {displaySymbol}
        </span>
      </div>

      {/* Example word */}
      {exampleWord && (
        <p className="text-sm text-text-secondary capitalize mb-2 font-display font-bold">
          {exampleWord}
        </p>
      )}

      {/* Level progress dots */}
      <div className="flex gap-1.5 justify-center">
        {Array.from({ length: totalLevels }, (_, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${
              i < done ? 'bg-primary' : 'bg-border'
            }`}
          />
        ))}
      </div>
    </motion.button>
  );
}
