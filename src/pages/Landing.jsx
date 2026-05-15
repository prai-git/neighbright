import NavBar from '../components/common/NavBar';
import LandingHero from '../components/landing/LandingHero';

const FEEDBACK_URL = 'https://github.com/prai-git/neighbright/issues';
const GITHUB_URL = 'https://github.com/prai-git/neighbright';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background" style={{ width: '100%' }}>
      <NavBar mode="landing" />
      <LandingHero />
      <footer style={{ width: '100%', textAlign: 'center', borderTop: '1px solid var(--color-border)', padding: '2rem 1rem' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 700, marginBottom: '0.75rem' }}>
          We're building this for you
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', flexWrap: 'wrap' }}>
          <a
            href={FEEDBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--color-primary)', fontWeight: 700 }}
          >
            Share Feedback
          </a>
          <span style={{ color: 'var(--color-border)' }}>·</span>
          <a href="#" style={{ color: 'rgba(175,175,175,0.5)' }}>About</a>
          <span style={{ color: 'var(--color-border)' }}>·</span>
          <a href="#" style={{ color: 'rgba(175,175,175,0.5)' }}>Privacy</a>
          <span style={{ color: 'var(--color-border)' }}>·</span>
          <a href="#" style={{ color: 'rgba(175,175,175,0.5)' }}>Contact</a>
          <span style={{ color: 'var(--color-border)' }}>·</span>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'rgba(175,175,175,0.5)' }}
          >
            GitHub
          </a>
        </div>
        <p style={{ fontSize: '10px', color: 'rgba(175,175,175,0.3)', marginTop: '0.75rem' }}>
          NeighBright — Free speech therapy for every family
        </p>
      </footer>
    </div>
  );
}
