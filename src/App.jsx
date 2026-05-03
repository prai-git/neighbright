import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ProfileProvider } from './contexts/ProfileContext';

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
            <Route path="/" element={<Landing />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/talk-board" element={<TalkBoard />} />
            <Route path="/sound-explorer" element={<SoundExplorer />} />
            <Route path="/word-builder" element={<WordBuilder />} />
            <Route path="/match-and-learn" element={<MatchAndLearn />} />
            <Route path="/puzzles" element={<Puzzles />} />
            <Route path="/dashboard" element={<ParentDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ProfileProvider>
    </LanguageProvider>
  );
}
