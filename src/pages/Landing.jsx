import NavBar from '../components/common/NavBar';
import LandingHero from '../components/landing/LandingHero';
import LandingFeatures from '../components/landing/LandingFeatures';
import LandingHowItWorks from '../components/landing/LandingHowItWorks';
import LandingAudience from '../components/landing/LandingAudience';
import LandingEvidence from '../components/landing/LandingEvidence';
import LandingFeedback from '../components/landing/LandingFeedback';
import LandingFooter from '../components/landing/LandingFooter';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar mode="landing" />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingAudience />
        <LandingEvidence />
        <LandingFeedback />
      </main>
      <LandingFooter />
    </div>
  );
}
