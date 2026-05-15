import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import db from '../db';

const LANG_MAP = { en: 'en', fr: 'fr' };

function getVoicesForLang(lang) {
  const voices = window.speechSynthesis?.getVoices() || [];
  return voices.filter((v) => v.lang.startsWith(LANG_MAP[lang] || lang));
}

export function useSpeech() {
  const { language } = useLanguage();
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoiceState] = useState(null);
  const [voiceUnavailable, setVoiceUnavailable] = useState(false);
  const rateRef = useRef(0.9);
  const pitchRef = useRef(1);

  // Load voices (async on some browsers)
  useEffect(() => {
    const load = () => {
      const filtered = getVoicesForLang(language);
      setVoices(filtered);
      setVoiceUnavailable(filtered.length === 0);
      setSelectedVoiceState((prev) => {
        if (prev && filtered.find((v) => v.voiceURI === prev.voiceURI)) return prev;
        return filtered[0] || null;
      });
    };

    load();
    window.speechSynthesis?.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', load);
  }, [language]);

  // Load saved settings from IndexedDB
  useEffect(() => {
    db.settings.toCollection().first().then((s) => {
      if (!s) return;
      if (s.voiceRate) rateRef.current = s.voiceRate;
      if (s.voicePitch) pitchRef.current = s.voicePitch;
      if (s.voiceURI) {
        const allVoices = window.speechSynthesis?.getVoices() || [];
        const saved = allVoices.find((v) => v.voiceURI === s.voiceURI);
        if (saved) setSelectedVoiceState(saved);
      }
    });
  }, []);

  const speak = useCallback((text, rateOverride) => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();

    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = `${LANG_MAP[language] || language}-`;
    if (selectedVoice) utt.voice = selectedVoice;
    utt.rate = rateOverride !== undefined ? rateOverride : rateRef.current;
    utt.pitch = pitchRef.current;

    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utt);
  }, [language, selectedVoice]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  const setSelectedVoice = useCallback(async (voice) => {
    setSelectedVoiceState(voice);
    const existing = await db.settings.toCollection().first();
    if (existing?.id) {
      await db.settings.update(existing.id, { voiceURI: voice.voiceURI });
    } else {
      await db.settings.add({ voiceURI: voice.voiceURI });
    }
  }, []);

  return { speak, stop, speaking, voices, selectedVoice, setSelectedVoice, voiceUnavailable };
}
