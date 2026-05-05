import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/common/AppLayout';
import { useTranslation } from '../data/i18n';

export default function Puzzles() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-display font-extrabold text-text-primary">
            🧩 {t('nav.puzzles')}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-border text-sm font-display font-bold text-text-secondary hover:text-primary hover:border-primary/30 transition-colors cursor-pointer"
          >
            ← Back
          </button>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">🧩</span>
          <p className="text-lg font-display font-bold text-text-primary mb-1">Coming Soon</p>
          <p className="text-sm text-text-secondary">This module is under development.</p>
        </div>
      </div>
    </AppLayout>
  );
}
