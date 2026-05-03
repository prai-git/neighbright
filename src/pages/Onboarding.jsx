import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../data/i18n';
import { useLanguage } from '../contexts/LanguageContext';
import { useProfile } from '../contexts/ProfileContext';
import { Button, Input, Card } from '../components/common';

const AVATARS = ['🐶','🐱','🐰','🐻','🦊','🐼','🦁','🐸','🐵','🐧','🦄','🐲','🐮','🐷','🐯','🐨','🐹','🐝','🐢','🦋','🐙','🐠','🦕','🐳'];

const LANGUAGES = [
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'hi', flag: '🇮🇳', label: 'हिन्दी' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
];

const TIERS = [
  { value: 1, emoji: '🌱', nameKey: 'onboarding.tier1Name', descKey: 'onboarding.tier1Desc' },
  { value: 2, emoji: '🌿', nameKey: 'onboarding.tier2Name', descKey: 'onboarding.tier2Desc' },
  { value: 3, emoji: '🌳', nameKey: 'onboarding.tier3Name', descKey: 'onboarding.tier3Desc' },
];

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

export default function Onboarding() {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const { saveProfile } = useProfile();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Step 2 form state
  const [name, setName] = useState('');
  const [avatarKey, setAvatarKey] = useState('');
  const [tier, setTier] = useState(null);
  const [errors, setErrors] = useState({});
  const [avatarShake, setAvatarShake] = useState(false);
  const [tierShake, setTierShake] = useState(false);

  const goNext = () => {
    setDirection(1);
    setStep(1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep(0);
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = t('onboarding.nameLabel') + ' is required';
    if (!avatarKey) {
      setAvatarShake(true);
      setTimeout(() => setAvatarShake(false), 600);
    }
    if (!tier) {
      setTierShake(true);
      setTimeout(() => setTierShake(false), 600);
    }
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0 || !avatarKey || !tier) return;
    await saveProfile({ name: name.trim(), avatarKey, tier });
    navigate('/home', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start py-10 px-4">
      {/* Progress dots */}
      <div className="flex gap-2 mb-10" aria-label="Step indicator">
        {[0, 1].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${i === step ? 'bg-primary' : 'bg-gray-200'}`}
            aria-current={i === step ? 'step' : undefined}
          />
        ))}
      </div>

      <div className="w-full max-w-lg overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 ? (
            <motion.div
              key="step0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-8"
            >
              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-text-primary text-center">
                {t('onboarding.languageStep')}
              </h1>

              <div className="flex flex-col md:flex-row gap-4 w-full">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={[
                      'flex-1 flex flex-col items-center gap-2 p-6 rounded-2xl border-2 bg-surface transition-all cursor-pointer',
                      language === lang.code
                        ? 'border-primary ring-2 ring-primary/30 shadow-md'
                        : 'border-gray-200 hover:border-gray-300',
                    ].join(' ')}
                    aria-pressed={language === lang.code}
                  >
                    <span className="text-5xl">{lang.flag}</span>
                    <span className="font-display font-bold text-lg text-text-primary">{lang.label}</span>
                  </button>
                ))}
              </div>

              <Button size="lg" fullWidth onClick={goNext}>
                {t('onboarding.next')} →
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="flex flex-col gap-8"
            >
              <h1 className="text-3xl md:text-4xl font-display font-extrabold text-text-primary text-center">
                {t('onboarding.profileStep')}
              </h1>

              {/* Name */}
              <Input
                label={t('onboarding.nameLabel')}
                placeholder={t('onboarding.namePlaceholder')}
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: null })); }}
                error={errors.name}
                autoComplete="given-name"
              />

              {/* Avatar */}
              <div>
                <p className="text-sm font-display font-semibold text-text-secondary mb-3">
                  {t('onboarding.avatarLabel')}
                </p>
                <motion.div
                  animate={avatarShake ? { x: [-6, 6, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-6 gap-3"
                  role="group"
                  aria-label={t('onboarding.avatarLabel')}
                >
                  {AVATARS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setAvatarKey(emoji)}
                      className={[
                        'w-12 h-12 rounded-full bg-surface border-2 flex items-center justify-center text-2xl transition-all cursor-pointer hover:scale-110',
                        avatarKey === emoji
                          ? 'border-primary ring-2 ring-primary/30 scale-110'
                          : 'border-gray-200',
                      ].join(' ')}
                      aria-pressed={avatarKey === emoji}
                      aria-label={`Avatar ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </motion.div>
                {avatarShake && !avatarKey && (
                  <p className="text-xs text-error mt-1 font-display">{t('onboarding.avatarLabel')} is required</p>
                )}
              </div>

              {/* Tier */}
              <div>
                <p className="text-sm font-display font-semibold text-text-secondary mb-3">
                  {t('onboarding.tierLabel')}
                </p>
                <motion.div
                  animate={tierShake ? { x: [-6, 6, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-3"
                  role="group"
                  aria-label={t('onboarding.tierLabel')}
                >
                  {TIERS.map((tierItem) => (
                    <Card
                      key={tierItem.value}
                      onClick={() => setTier(tierItem.value)}
                      padding="md"
                      className={[
                        'flex items-center gap-4 transition-all',
                        tier === tierItem.value
                          ? 'ring-2 ring-primary border-primary'
                          : '',
                      ].join(' ')}
                      aria-pressed={tier === tierItem.value}
                    >
                      <span className="text-3xl" role="img" aria-hidden="true">{tierItem.emoji}</span>
                      <div>
                        <p className="font-display font-bold text-text-primary">{t(tierItem.nameKey)}</p>
                        <p className="text-xs text-text-secondary">{t(tierItem.descKey)}</p>
                      </div>
                    </Card>
                  ))}
                </motion.div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="ghost" size="lg" onClick={goBack} className="flex-1">
                  ← {t('onboarding.back')}
                </Button>
                <Button variant="primary" size="lg" onClick={handleSubmit} className="flex-2">
                  {t('onboarding.startPracticing')} 🚀
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

