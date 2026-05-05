import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

const languages = [
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'hi', flag: '🇮🇳', label: 'हिन्दी' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
];

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Switch language"
        aria-expanded={open}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 active:bg-black/5 transition-colors cursor-pointer text-lg"
      >
        🌐
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg shadow-black/8 border border-border/60 overflow-hidden w-44 z-50"
            role="listbox"
            aria-label="Select language"
          >
            {languages.map((lang) => (
              <li key={lang.code} role="option" aria-selected={language === lang.code}>
                <button
                  onClick={() => { changeLanguage(lang.code); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-display font-semibold transition-colors cursor-pointer ${
                    language === lang.code
                      ? 'bg-primary/5 text-primary'
                      : 'text-text-primary hover:bg-background active:bg-background'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="flex-1 text-left">{lang.label}</span>
                  {language === lang.code && <span className="text-primary text-xs">✓</span>}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
