
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
  
  console.log('🔐 Auth page rendering...', { 
    user: user?.email, 
    loading,
    currentTab: activeTab,
    searchParams: Object.fromEntries(searchParams.entries())
  });

  useEffect(() => {
    console.log('🔄 Auth page useEffect - checking URL params...');
    
    // Verificar se é um link de recuperação de senha
    const type = searchParams.get('type');
    if (type === 'recovery') {
      console.log('🔐 Password recovery detected, switching to new-password tab');
      setActiveTab('new-password');
      return;
    }

    // Verificar hash para tabs
    const hash = window.location.hash.replace('#', '');
    console.log('🔗 Current hash:', hash);
    
    if (['register', 'reset', 'new-password'].includes(hash)) {
      console.log('📋 Setting tab from hash:', hash);
      setActiveTab(hash);
    } else if (hash === 'login' || !hash) {
      console.log('📋 Setting default login tab');
      setActiveTab('login');
    }
  }, [searchParams]);

  // Atualizar URL quando tab muda
  useEffect(() => {
    const newHash = activeTab === 'login' ? '' : `#${activeTab}`;
    const currentHash = window.location.hash;
    
    if (currentHash !== newHash) {
      console.log('🔗 Updating URL hash:', { from: currentHash, to: newHash });
      window.history.replaceState(null, '', `/auth${newHash}`);
    }
  }, [activeTab]);

  if (user && !loading) {
    console.log('✅ User authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    console.log('⏳ Auth loading state...');
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1565C0] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  console.log('🎨 Rendering auth form with tab:', activeTab);

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
