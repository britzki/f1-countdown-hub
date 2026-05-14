import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { ReactNode } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="text-center py-20 text-sm text-gray-400">Carregando...</div>
  );

  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}