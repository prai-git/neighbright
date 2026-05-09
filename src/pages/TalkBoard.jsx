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
    <AppLayout bgTheme="talk">
      <div className="flex flex-col gap-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-display font-extrabold text-white">
            💬 {t('nav.talkBoard')}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white/10 border-2 border-white/20 text-sm font-display font-extrabold text-white hover:bg-white/15 transition-colors cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            ← Back
          </button>
        </div>

        {voiceUnavailable && (
          <div className="bg-accent/15 rounded-xl px-4 py-2.5 text-sm text-accent font-display font-bold text-center border border-accent/30">
            ⚠️ Speech not available for this language on your device
          </div>
        )}

        {/* Sentence strip */}
        <section>
          <SentenceStrip
            words={sentenceWords}
            onSpeak={handleSpeak}
            onClear={() => setSentenceWords([])}
            onRemoveWord={handleRemoveWord}
            flash={flash}
          />
        </section>

        {/* Quick phrases */}
        <section>
          <h2 className="text-xs font-display font-extrabold text-text-secondary uppercase tracking-widest mb-2.5">
            {t('talkBoard.quickPhrases')}
          </h2>
          <QuickPhrases onPhraseTap={(phrase) => { speak(phrase); logProgress('quick-phrase', { phrase }); }} />
        </section>

        {/* Category + Grid */}
        <section>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-xs font-display font-extrabold text-text-secondary uppercase tracking-widest">
              {t('talkBoard.categories.feelings') && 'Categories'}
            </h2>
            <button
              onClick={() => setShowCustomForm(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/15 text-primary text-xs font-display font-extrabold cursor-pointer hover:bg-primary/25 transition-colors border border-primary/25"
            >
              + {t('talkBoard.addCard')}
            </button>
          </div>
          <CategorySelector
            categories={categories}
            active={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </section>

        {/* Picture card grid */}
        <section>
          <PictureCardGrid
            key={`${selectedCategory.id}-${gridKey}`}
            category={selectedCategory}
            onWordTap={handleWordTap}
          />
        </section>

        <CustomCardForm
          isOpen={showCustomForm}
          onClose={() => setShowCustomForm(false)}
          onSaved={() => setGridKey((k) => k + 1)}
        />
      </div>
    </AppLayout>
  );
}
