import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';

export default function RecordCompare({ speak, modelText, modelRate = 0.7 }) {
  const { t } = useTranslation();
  const { isRecording, startRecording, stopRecording, audioURL, clearRecording, isSupported, error } =
    useAudioRecorder();

  const handlePlayback = useCallback(() => {
    if (audioURL) new Audio(audioURL).play();
  }, [audioURL]);

  const handleHearModel = useCallback(() => {
    speak(modelText, modelRate);
  }, [speak, modelText, modelRate]);

  if (!isSupported) {
    return (
      <p className="text-sm text-text-secondary italic text-center py-2">
        {t('sounds.recordingNotSupported')}
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {error === 'permission_denied' && (
        <p className="text-sm text-error text-center">{t('sounds.micPermissionDenied')}</p>
      )}

      {/* Record / Stop button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm transition-colors cursor-pointer ${
          isRecording
            ? 'bg-error text-white animate-pulse'
            : 'bg-primary text-white'
        }`}
        aria-label={isRecording ? t('sounds.stop') : t('sounds.record')}
      >
        {isRecording ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="2"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2zm-5 8a1 1 0 001-1v-1.07A7.003 7.003 0 0019 11h-2a5 5 0 01-10 0H5a7.003 7.003 0 006 6.93V18h-2a1 1 0 000 2h6a1 1 0 000-2h-2v-1z"/>
          </svg>
        )}
      </motion.button>
      <span className="text-xs font-display font-bold text-text-secondary">
        {isRecording ? t('sounds.stop') : t('sounds.record')}
      </span>

      {/* Playback + model comparison */}
      <AnimatePresence>
        {audioURL && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex gap-2 items-center"
          >
            <button
              onClick={handlePlayback}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary text-white text-sm font-display font-bold shadow-sm hover:shadow-md transition cursor-pointer"
            >
              ▶ {t('sounds.playBack')}
            </button>
            <button
              onClick={handleHearModel}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-primary text-primary text-sm font-display font-bold hover:bg-primary/5 transition cursor-pointer"
            >
              🔊 {t('sounds.playModel')}
            </button>
            <button
              onClick={clearRecording}
              className="text-text-secondary/40 text-xs hover:text-error transition cursor-pointer"
              aria-label="Clear recording"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
