import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ProfileProvider } from './contexts/ProfileContext';
import RequireProfile from './components/common/RequireProfile';
import SmartRedirect from './components/common/SmartRedirect';

import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import TalkBoard from './pages/TalkBoard';
import SoundExplorer from './pages/SoundExplorer';
import WordBuilder from './pages/WordBuilder';
import MatchAndLearn from './pages/MatchAndLearn';
import Puzzles from './pages/Puzzles';
import ParentDashboard from './pages/ParentDashboard';

export default function App() {
  return (
    <LanguageProvider>
      <ProfileProvider>
        <BrowserRouter>
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
            <Route path="/dashboard" element={<RequireProfile><ParentDashboard /></RequireProfile>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ProfileProvider>
    </LanguageProvider>
  );
}
