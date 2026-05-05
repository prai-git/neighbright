import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/common/AppLayout';
import CategorySelector from '../components/talkboard/CategorySelector';
import SentenceStrip from '../components/talkboard/SentenceStrip';
import PictureCardGrid from '../components/talkboard/PictureCardGrid';
import QuickPhrases from '../components/talkboard/QuickPhrases';
import CustomCardForm from '../components/talkboard/CustomCardForm';
import { categories } from '../data/vocabulary';
import { useSpeech } from '../hooks/useSpeech';
import { useTranslation } from '../data/i18n';
import db from '../db';

const MAX = SentenceStrip.MAX_WORDS;

export default function TalkBoard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { speak, voiceUnavailable } = useSpeech();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [sentenceWords, setSentenceWords] = useState([]);
  const [flash, setFlash] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [gridKey, setGridKey] = useState(0);

  const logProgress = async (activityType, activityData) => {
    try {
      await db.progress.add({
        module: 'talkboard',
        activityType,
        activityData,
        result: 'attempted',
        durationSecs: null,
        createdAt: new Date().toISOString(),
      });
    } catch (_) {}
  };

  const handleWordTap = (word) => {
    const label = word.i18nWord ? t(word.i18nWord) : word.customWord;
    const phrase = word.i18nPhrase ? t(word.i18nPhrase) : word.customPhrase;
    speak(label);
    logProgress('word-tap', { wordId: word.id, category: selectedCategory.id });

    if (sentenceWords.length >= MAX) {
      setFlash(true);
      setTimeout(() => setFlash(false), 800);
      return;
    }
    setSentenceWords((prev) => [...prev, { ...word, label, phrase }]);
  };

  const handleSpeak = () => {
    const sentence = sentenceWords.map((w) => w.phrase || w.label).join('. ');
    speak(sentence);
    logProgress('sentence-speak', {
      words: sentenceWords.map((w) => w.id),
      sentenceLength: sentenceWords.length,
    });
  };

  const handleRemoveWord = (index) => {
    setSentenceWords((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-5">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-display font-extrabold text-text-primary">
            💬 {t('nav.talkBoard')}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCustomForm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-display font-bold cursor-pointer hover:bg-primary/15 transition-colors"
            >
              + {t('talkBoard.addCard')}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-border text-sm font-display font-bold text-text-secondary hover:text-primary hover:border-primary/30 transition-colors cursor-pointer"
            >
              ← Back
            </button>
          </div>
        </div>

        {voiceUnavailable && (
          <div className="bg-accent/10 rounded-xl px-4 py-2 text-sm text-text-secondary font-display text-center">
            ⚠️ Speech not available for this language on your device
          </div>
        )}

        {/* Sentence strip */}
        <SentenceStrip
          words={sentenceWords}
          onSpeak={handleSpeak}
          onClear={() => setSentenceWords([])}
          onRemoveWord={handleRemoveWord}
          flash={flash}
        />

        {/* Quick phrases */}
        <QuickPhrases onPhraseTap={(phrase) => { speak(phrase); logProgress('quick-phrase', { phrase }); }} />

        {/* Category selector */}
        <CategorySelector
          categories={categories}
          active={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Picture card grid */}
        <PictureCardGrid
          key={`${selectedCategory.id}-${gridKey}`}
          category={selectedCategory}
          onWordTap={handleWordTap}
        />

        <CustomCardForm
          isOpen={showCustomForm}
          onClose={() => setShowCustomForm(false)}
          onSaved={() => setGridKey((k) => k + 1)}
        />
      </div>
    </AppLayout>
  );
}
