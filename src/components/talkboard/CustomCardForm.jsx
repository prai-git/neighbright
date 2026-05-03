import { useState } from 'react';
import { useTranslation } from '../../data/i18n';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import db from '../../db';
import { categories } from '../../data/vocabulary';

export default function CustomCardForm({ isOpen, onClose, onSaved }) {
  const { t } = useTranslation();
  const [category, setCategory] = useState(categories[0].id);
  const [word, setWord] = useState('');
  const [emoji, setEmoji] = useState('');
  const [phrase, setPhrase] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const errs = {};
    if (!word.trim()) errs.word = 'Word is required';
    if (!emoji.trim()) errs.emoji = 'Emoji is required';
    if (!phrase.trim()) errs.phrase = 'Phrase is required';
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      await db.customVocabulary.add({
        category,
        word: word.trim(),
        emoji: emoji.trim(),
        phrase: phrase.trim(),
      });
      setWord(''); setEmoji(''); setPhrase('');
      setErrors({});
      onSaved?.();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('talkBoard.addCard')} size="md">
      <div className="flex flex-col gap-4">
        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-display font-semibold text-text-secondary">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 rounded-xl border border-gray-200 bg-surface px-4 font-display text-text-primary outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{t(c.i18nKey)}</option>
            ))}
            <option value="custom">Custom</option>
          </select>
        </div>

        <Input label="Word" placeholder="e.g. swing" value={word} onChange={(e) => { setWord(e.target.value); setErrors((p) => ({ ...p, word: null })); }} error={errors.word} />
        <Input label="Emoji" placeholder="e.g. 🏄" value={emoji} onChange={(e) => { setEmoji(e.target.value); setErrors((p) => ({ ...p, emoji: null })); }} error={errors.emoji} />
        <Input label="Phrase" placeholder="e.g. I want to swing" value={phrase} onChange={(e) => { setPhrase(e.target.value); setErrors((p) => ({ ...p, phrase: null })); }} error={errors.phrase} />

        <div className="flex gap-3 mt-2">
          <Button variant="ghost" size="md" fullWidth onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="md" fullWidth onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : t('talkBoard.addCard')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
