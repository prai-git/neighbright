import NavBar from '../components/common/NavBar';
import LandingHero from '../components/landing/LandingHero';

const FEEDBACK_URL = 'https://github.com/prai-git/neighbright/issues';
const GITHUB_URL = 'https://github.com/prai-git/neighbright';

export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <NavBar mode="landing" />
      <main className="flex-1 flex flex-col">
        <LandingHero />
      </main>
      <footer className="w-full border-t border-border py-8 px-4">
        <div className="w-full max-w-md mx-auto flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-text-secondary font-display font-bold">
            We're building this for you
          </p>
          <div className="flex items-center gap-4 text-xs">
            <a
              href={FEEDBACK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-bold transition-colors"
            >
              Share Feedback
            </a>
            <span className="text-border">·</span>
            <a href="#" className="text-text-secondary/50 hover:text-white transition-colors">About</a>
            <span className="text-border">·</span>
            <a href="#" className="text-text-secondary/50 hover:text-white transition-colors">Privacy</a>
            <span className="text-border">·</span>
            <a href="#" className="text-text-secondary/50 hover:text-white transition-colors">Contact</a>
            <span className="text-border">·</span>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary/50 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
          <p className="text-[10px] text-text-secondary/30 mt-1">
            NeighBright — Free speech therapy for every family
          </p>
        </div>
      </footer>
    </div>
  );
}
