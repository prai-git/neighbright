import NavBar from './NavBar';
import SideNav from './SideNav';
import BottomNav from './BottomNav';

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar mode="app" />
      <div className="flex flex-1 overflow-hidden">
        <SideNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-20 md:pb-0">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
