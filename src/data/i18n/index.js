import { useLanguage } from '../../contexts/LanguageContext';
import en from './en.json';
import hi from './hi.json';
import fr from './fr.json';

const translations = { en, hi, fr };

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key, replacements = {}) => {
    const keys = key.split('.');

    // Try current language first
    let value = translations[language];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        value = translations.en;
        for (const ek of keys) {
          if (value && typeof value === 'object' && ek in value) {
            value = value[ek];
          } else {
            return key; // Key not found anywhere
          }
        }
        break;
      }
    }

    if (typeof value !== 'string') return key;

    // Replace {placeholder} variables
    return value.replace(/\{(\w+)\}/g, (_, name) =>
      replacements[name] !== undefined ? replacements[name] : `{${name}}`
    );
  };

  return { t, language };
}
