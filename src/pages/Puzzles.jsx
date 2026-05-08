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
          <h1 className="text-xl md:text-2xl font-display font-extrabold text-white">
            🧩 {t('nav.puzzles')}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white/10 border-2 border-white/20 text-sm font-display font-extrabold text-white hover:bg-white/15 transition-colors cursor-pointer shadow-[0_3px_0_rgba(0,0,0,0.2)] active:shadow-[0_1px_0_rgba(0,0,0,0.2)] active:translate-y-[2px]"
          >
            ← Back
          </button>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-6xl mb-4">🧩</span>
          <p className="text-xl font-display font-extrabold text-white mb-2">Coming Soon</p>
          <p className="text-sm text-text-secondary">This module is under development.</p>
        </div>
      </div>
    </AppLayout>
  );
}
