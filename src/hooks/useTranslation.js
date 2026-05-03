/**
 * Placeholder translation hook — upgraded in Module 03.
 * Returns the key as-is so components work without i18n infrastructure.
 */
export function useTranslation() {
  function t(key) {
    return key;
  }
  return { t };
}
