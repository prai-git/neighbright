import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../data/i18n';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';

export default function RecordCompare({ speak, modelText, modelRate = 0.7 }) {
  const { t } = useTranslation();
  const { isRecording, startRecording, stopRecording, audioURL, clearRecording, isSupported, error } =
    useAudioRecorder();

  const handlePlayback = useCallback(() => {
    if (!audioURL) return;
    const audio = new Audio(audioURL);
    audio.play().catch(() => {
      // Fallback: create fresh blob URL and retry
      fetch(audioURL).then(r => r.blob()).then(blob => {
        const url = URL.createObjectURL(blob);
        new Audio(url).play();
      });
    });
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
        <p className="text-sm text-error text-center font-display font-bold">{t('sounds.micPermissionDenied')}</p>
      )}

      {/* Record / Stop button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-[0_4px_0_rgba(0,0,0,0.2)] transition-colors cursor-pointer active:translate-y-[2px] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] ${
          isRecording
            ? 'bg-error text-white animate-pulse'
            : 'bg-primary text-white'
        }`}
        aria-label={isRecording ? t('sounds.stop') : t('sounds.record')}
      >
        {isRecording ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="2"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2zm-5 8a1 1 0 001-1v-1.07A7.003 7.003 0 0019 11h-2a5 5 0 01-10 0H5a7.003 7.003 0 006 6.93V18h-2a1 1 0 000 2h6a1 1 0 000-2h-2v-1z"/>
          </svg>
        )}
      </motion.button>
      <span className="text-sm font-display font-extrabold text-text-secondary uppercase tracking-wide">
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
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-secondary text-white text-sm font-display font-extrabold shadow-[0_3px_0_rgba(0,0,0,0.2)] hover:brightness-110 transition cursor-pointer active:translate-y-[2px] active:shadow-[0_1px_0_rgba(0,0,0,0.2)]"
            >
              ▶ {t('sounds.playBack')}
            </button>
            <button
              onClick={handleHearModel}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white/10 border-2 border-primary/30 text-primary text-sm font-display font-extrabold hover:bg-primary/10 transition cursor-pointer"
            >
              🔊 {t('sounds.playModel')}
            </button>
            <button
              onClick={clearRecording}
              className="text-text-secondary/40 text-sm hover:text-error transition cursor-pointer"
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
