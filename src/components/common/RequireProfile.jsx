import { Navigate } from 'react-router-dom';
import { useProfile } from '../../contexts/ProfileContext';
import LoadingSpinner from './LoadingSpinner';

export default function RequireProfile({ children }) {
  const { profile, loading } = useProfile();

  if (loading) return <LoadingSpinner />;
  if (!profile) return <Navigate to="/onboarding" replace />;

  return children;
}
