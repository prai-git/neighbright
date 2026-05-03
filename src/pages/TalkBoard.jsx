import { useState } from 'react';
import AppLayout from '../components/common/AppLayout';
import { IconButton } from '../components/common';
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
      {voiceUnavailable && (
        <div className="mx-4 mt-2 bg-accent/10 rounded-xl px-4 py-2 text-sm text-text-secondary font-display text-center">
          ⚠️ Speech not available for this language on your device
        </div>
      )}

      <SentenceStrip
        words={sentenceWords}
        onSpeak={handleSpeak}
        onClear={() => setSentenceWords([])}
        onRemoveWord={handleRemoveWord}
        flash={flash}
      />

      <CategorySelector
        categories={categories}
        active={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <PictureCardGrid
        key={`${selectedCategory.id}-${gridKey}`}
        category={selectedCategory}
        onWordTap={handleWordTap}
      />

      <QuickPhrases onPhraseTap={(phrase) => { speak(phrase); logProgress('quick-phrase', { phrase }); }} />

      {/* Add custom card button */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setShowCustomForm(true)}
          className="text-sm font-display font-semibold text-primary underline cursor-pointer"
        >
          + {t('talkBoard.addCard')}
        </button>
      </div>

      <CustomCardForm
        isOpen={showCustomForm}
        onClose={() => setShowCustomForm(false)}
        onSaved={() => setGridKey((k) => k + 1)}
      />
    </AppLayout>
  );
}

