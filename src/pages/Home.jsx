import AppLayout from '../components/common/AppLayout';

export default function Home() {
  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-64">
        <h1 className="text-3xl font-display font-bold text-text-primary">
          Home Page
        </h1>
      </div>
    </AppLayout>
  );
}
