
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/ui/logo";
import { useToast } from "@/hooks/use-toast";
import { Navigate, useSearchParams } from "react-router-dom";
import AuthTabs from "@/components/auth/AuthTabs";

const Auth = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("login");
  const [debugMode, setDebugMode] = useState(false);
  
  useEffect(() => {
    // Verificar se é um link de recuperação de senha
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');
    
    if (accessToken && refreshToken && type === 'recovery') {
      console.log('Link de recuperação de senha detectado');
      setActiveTab('new-password');
      toast({
        title: "Link de recuperação válido",
        description: "Defina sua nova senha abaixo.",
      });
      return;
    }

    // Verificar hash para tabs
    const hash = window.location.hash.replace('#', '');
    if (hash === 'register' || hash === 'reset') {
      setActiveTab(hash);
    }
  }, [searchParams, toast]);

  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
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

        {debugMode && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Modo debug ativo. URL atual: {window.location.href}
              <br />
              Domínio: {window.location.hostname}
            </AlertDescription>
          </Alert>
        )}

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
