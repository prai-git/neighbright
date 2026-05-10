import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { stickers as stickerDefs } from '../../data/rewards';
import ConfettiEffect from './ConfettiEffect';

/**
 * Full-screen celebration modal shown when a new sticker is unlocked.
 * Props:
 *   stickerId — the id of the newly-earned sticker (string)
 *   onDismiss — callback to close the modal
 */
export default function NewStickerModal({ stickerId, onDismiss }) {
  const { t } = useTranslation();

  const sticker = stickerDefs.find((s) => s.id === stickerId);
  if (!sticker) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60"
          onClick={onDismiss}
        />

        {/* Confetti */}
        <ConfettiEffect />

        {/* Card */}
        <motion.div
          className="relative z-10 rounded-3xl p-8 flex flex-col items-center gap-4 mx-4 max-w-xs w-full"
          style={{
            background: 'linear-gradient(135deg, #1B2B32 0%, #233A44 100%)',
            border: '2px solid #2B3D45',
          }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
        >
          {/* Sticker emoji */}
          <motion.div
            className="text-7xl"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 8, stiffness: 200, delay: 0.2 }}
          >
            {sticker.emoji}
          </motion.div>

          {/* Sticker name */}
          <h2 className="text-xl font-display font-extrabold text-white text-center">
            {t(sticker.i18nKey)}
          </h2>

          {/* Message */}
          <p className="text-secondary font-display font-bold text-center">
            {t('rewards.newSticker')}
          </p>

          {/* Dismiss button */}
          <motion.button
            onClick={onDismiss}
            className="mt-2 w-full py-3 rounded-xl font-display font-extrabold text-lg text-white"
            style={{
              backgroundColor: '#58CC02',
              boxShadow: '0 4px 0 rgba(0,0,0,0.2)',
            }}
            whileTap={{ y: 4, boxShadow: '0 0px 0 rgba(0,0,0,0.2)' }}
          >
            {t('rewards.awesome')}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
