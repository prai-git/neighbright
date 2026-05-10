import { motion } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { stickers as stickerDefs } from '../../data/rewards';
import { useRewards } from '../../hooks/useRewards';

/**
 * Grid gallery showing all stickers — unlocked ones are vibrant, locked ones are dimmed.
 */
export default function StickerGallery() {
  const { t } = useTranslation();
  const { rewards, getUnlockedStickers } = useRewards();

  const unlockedIds = new Set(getUnlockedStickers(rewards));

  return (
    <div>
      <h2 className="text-lg font-display font-extrabold text-white mb-3">
        {t('rewards.stickers')}
      </h2>

      <div className="grid grid-cols-3 gap-3">
        {stickerDefs.map((sticker) => {
          const unlocked = unlockedIds.has(sticker.id);

          return (
            <motion.div
              key={sticker.id}
              className="rounded-2xl p-3 flex flex-col items-center gap-1 select-none"
              style={{
                backgroundColor: '#1B2B32',
                border: unlocked ? '2px solid #58CC02' : '2px solid #2B3D45',
                opacity: unlocked ? 1 : 0.4,
                filter: unlocked ? 'none' : 'grayscale(1)',
              }}
              whileTap={unlocked ? { scale: 1.1 } : undefined}
              transition={{ type: 'spring', damping: 10, stiffness: 400 }}
            >
              <div className="text-4xl relative">
                {unlocked ? (
                  sticker.emoji
                ) : (
                  <>
                    <span className="blur-[2px]">{sticker.emoji}</span>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl">
                      🔒
                    </span>
                  </>
                )}
              </div>

              <span className="text-xs font-display font-bold text-center leading-tight text-white/80 truncate w-full">
                {unlocked ? t(sticker.i18nKey) : '???'}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
