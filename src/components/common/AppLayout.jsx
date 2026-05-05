import NavBar from './NavBar';
import BottomNav from './BottomNav';

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar mode="app" />
      <main className="flex-1 overflow-y-auto pb-24 md:pb-8">
        <div className="px-5 py-5 md:px-10 md:py-8 lg:px-16">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
