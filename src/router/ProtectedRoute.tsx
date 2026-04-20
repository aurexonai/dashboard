import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full bg-bg-section flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-black border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
