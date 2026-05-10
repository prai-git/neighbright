import NavBar from '../components/common/NavBar';
import LandingHero from '../components/landing/LandingHero';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar mode="landing" />
      <main className="flex-1 flex flex-col">
        <LandingHero />
      </main>
      <footer className="text-center py-6 text-[10px] text-text-secondary/50 border-t border-border">
        <p>NeighBright — Free speech therapy for every family</p>
        <a
          href="https://github.com/prai-git/neighbright"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-secondary/40 hover:text-white transition-colors mt-1 inline-block"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
