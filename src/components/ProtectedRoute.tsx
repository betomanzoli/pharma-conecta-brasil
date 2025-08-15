
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2, TestTube } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isDemoMode } from '@/utils/demoMode';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isDemo = isDemoMode();

  console.log('ProtectedRoute check:', { user: !!user, loading, path: location.pathname, demoMode: isDemo });

  if (loading && !isDemo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Em modo demo, permite acesso sem autenticação
  if (isDemo) {
    return (
      <>
        <Alert className="mx-4 mt-4 border-orange-200 bg-orange-50">
          <TestTube className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Modo Demonstração:</strong> Você está visualizando dados simulados. 
            Para acessar dados reais, faça login na plataforma.
          </AlertDescription>
        </Alert>
        {children}
      </>
    );
  }

  if (!user) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
