import { Navigate } from 'react-router-dom';
import { useProfile } from '../../contexts/ProfileContext';
import LoadingSpinner from './LoadingSpinner';

/** Renders children (Landing/Onboarding) but redirects to /home if a profile already exists. */
export default function SmartRedirect({ children }) {
  const { profile, loading } = useProfile();

  if (loading) return <LoadingSpinner />;
  if (profile) return <Navigate to="/home" replace />;

  return children;
}
