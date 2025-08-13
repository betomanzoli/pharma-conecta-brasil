
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/ui/logo";
import { Navigate, useSearchParams } from "react-router-dom";
import AuthTabs from "@/components/auth/AuthTabs";

const Auth = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("login");
  
  console.log('Auth page rendering...', { user: user?.email, loading });

  useEffect(() => {
    // Verificar se é um link de recuperação de senha
    const type = searchParams.get('type');
    if (type === 'recovery') {
      setActiveTab('new-password');
      return;
    }

    // Verificar hash para tabs
    const hash = window.location.hash.replace('#', '');
    if (['register', 'reset', 'new-password'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [searchParams]);

  // Atualizar URL quando tab muda
  useEffect(() => {
    const newHash = activeTab === 'login' ? '' : `#${activeTab}`;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', `/auth${newHash}`);
    }
  }, [activeTab]);

  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1565C0] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Conecte-se com os melhores profissionais
          </h2>
          <p className="mt-2 text-gray-600">
            O ecossistema colaborativo da indústria farmacêutica brasileira
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-[#1565C0]">Acesso à Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
