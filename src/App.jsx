import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ProfileProvider } from './contexts/ProfileContext';
import RequireProfile from './components/common/RequireProfile';
import SmartRedirect from './components/common/SmartRedirect';

// Lazy-loaded pages
const Landing = lazy(() => import('./pages/Landing'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Home = lazy(() => import('./pages/Home'));
const TalkBoard = lazy(() => import('./pages/TalkBoard'));
const SoundExplorer = lazy(() => import('./pages/SoundExplorer'));
const WordBuilder = lazy(() => import('./pages/WordBuilder'));
const MatchAndLearn = lazy(() => import('./pages/MatchAndLearn'));
const Puzzles = lazy(() => import('./pages/Puzzles'));
const Alphabets = lazy(() => import('./pages/Alphabets'));
const Numbers = lazy(() => import('./pages/Numbers'));
const ParentDashboard = lazy(() => import('./pages/ParentDashboard'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#131F24] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60 text-sm font-nunito">Loading…</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ProfileProvider>
        <BrowserRouter basename="/neighbright">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public routes — redirect to /home if profile already exists */}
              <Route path="/" element={<SmartRedirect><Landing /></SmartRedirect>} />
              <Route path="/onboarding" element={<SmartRedirect><Onboarding /></SmartRedirect>} />

              {/* Protected app routes */}
              <Route path="/home" element={<RequireProfile><Home /></RequireProfile>} />
              <Route path="/talk-board" element={<RequireProfile><TalkBoard /></RequireProfile>} />
              <Route path="/sound-explorer" element={<RequireProfile><SoundExplorer /></RequireProfile>} />
              <Route path="/word-builder" element={<RequireProfile><WordBuilder /></RequireProfile>} />
              <Route path="/match-and-learn" element={<RequireProfile><MatchAndLearn /></RequireProfile>} />
              <Route path="/puzzles" element={<RequireProfile><Puzzles /></RequireProfile>} />
              <Route path="/alphabets" element={<RequireProfile><Alphabets /></RequireProfile>} />
              <Route path="/numbers" element={<RequireProfile><Numbers /></RequireProfile>} />
              <Route path="/dashboard" element={<RequireProfile><ParentDashboard /></RequireProfile>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ProfileProvider>
    </LanguageProvider>
  );
}
