import NavBar from './NavBar';
import BottomNav from './BottomNav';
import FunBackground from './FunBackground';

export default function AppLayout({ children, bgTheme = 'default' }) {
  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <FunBackground theme={bgTheme} />
      <NavBar mode="app" />
      <main className="flex-1 overflow-y-auto pb-24 md:pb-8 relative z-10">
        <div className="px-5 py-5 md:px-10 md:py-8 lg:px-16">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
