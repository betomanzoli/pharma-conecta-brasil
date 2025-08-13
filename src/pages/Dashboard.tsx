
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Building2, LogOut } from "lucide-react";
import Logo from "@/components/ui/logo";

const Dashboard = () => {
  const { user, profile, signOut } = useAuth();

  const getUserTypeLabel = (userType: string) => {
    const types = {
      company: "Empresa Farmacêutica",
      laboratory: "Laboratório Analítico",
      consultant: "Consultor Regulatório",
      professional: "Profissional Individual",
      regulatory_body: "Órgão Regulador",
      sector_entity: "Entidade Setorial",
      research_institution: "Instituição de Pesquisa",
      supplier: "Fornecedor",
      funding_agency: "Agência de Fomento",
      healthcare_provider: "Prestador de Saúde",
      individual: "Individual"
    };
    return types[userType as keyof typeof types] || userType;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Logo size="sm" />
            <span className="font-semibold text-gray-900">Dashboard</span>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo, {profile?.first_name || 'Usuário'}!
            </h1>
            <p className="text-gray-600">
              Você está logado e a autenticação está funcionando perfeitamente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Perfil do Usuário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{profile?.email}</span>
                </div>
                
                {profile?.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                )}
                
                {profile?.organization_name && (
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{profile.organization_name}</span>
                  </div>
                )}
                
                <Badge variant="secondary">
                  {getUserTypeLabel(profile?.user_type || '')}
                </Badge>
              </CardContent>
            </Card>

            {/* Auth Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Status da Autenticação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Usuário:</span>
                    <Badge variant="outline" className="text-green-600">
                      ✓ Logado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Perfil:</span>
                    <Badge variant="outline" className="text-green-600">
                      ✓ Carregado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ID do Usuário:</span>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {user?.id?.slice(0, 8)}...
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps Card */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Passos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Agora que a autenticação está funcionando:
                  </p>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li>• Complete seu perfil</li>
                    <li>• Explore a plataforma</li>
                    <li>• Conecte-se com profissionais</li>
                    <li>• Use o sistema de IA Matching</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
