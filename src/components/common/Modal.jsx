import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const sizeMap = {
  sm: 'max-w-[400px]',
  md: 'max-w-[500px]',
  lg: 'max-w-[640px]',
};

export default function Modal({
  isOpen,
  onClose,
  title = null,
  size = 'md',
  children,
}) {
  const firstFocusRef = useRef(null);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Focus trap — focus first element inside modal when it opens
  useEffect(() => {
    if (isOpen && firstFocusRef.current) {
      firstFocusRef.current.focus();
    }
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Dialog'}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`bg-surface rounded-2xl shadow-xl border-2 border-border w-full ${sizeMap[size]} p-6`}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-extrabold text-white">{title}</h2>
                <button
                  ref={firstFocusRef}
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="text-text-secondary hover:text-text-primary text-xl leading-none cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
            {!title && <div ref={firstFocusRef} tabIndex={-1} />}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
