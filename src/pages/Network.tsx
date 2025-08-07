
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import UniversalDemoBanner from '@/components/layout/UniversalDemoBanner';
import { isDemoMode } from '@/utils/demoMode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, FlaskConical, User, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Network = () => {
  const { profile } = useAuth();
  const isDemo = isDemoMode();

  const renderDemoContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              Empresas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">156</div>
            <p className="text-sm text-muted-foreground">Conectadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <FlaskConical className="h-4 w-4 mr-2" />
              Laboratórios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">89</div>
            <p className="text-sm text-muted-foreground">Certificados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <User className="h-4 w-4 mr-2" />
              Consultores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">67</div>
            <p className="text-sm text-muted-foreground">Especialistas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Conexões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">234</div>
            <p className="text-sm text-muted-foreground">Ativas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rede de Contatos Simulada</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Esta é uma demonstração da funcionalidade de rede com dados simulados.
          </p>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Conexão Demo {i}</p>
                  <p className="text-sm text-muted-foreground">Empresa farmacêutica simulada</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRealContent = () => (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Funcionalidade em Desenvolvimento:</strong> A rede de contatos está sendo construída. 
          Complete seu perfil para começar a fazer conexões.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              Suas Conexões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">Nenhuma conexão ainda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Solicitações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">Nenhuma pendente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <FlaskConical className="h-4 w-4 mr-2" />
              Parcerias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">Configure seu perfil</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <User className="h-4 w-4 mr-2" />
              Recomendações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">--</div>
            <p className="text-sm text-muted-foreground">Em breve</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Como Começar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">1</span>
              </div>
              <div>
                <p className="font-medium">Complete seu perfil</p>
                <p className="text-sm text-muted-foreground">
                  Adicione informações sobre sua área de atuação
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold">2</span>
              </div>
              <div>
                <p className="font-medium">Explore o Marketplace</p>
                <p className="text-sm text-muted-foreground">
                  Encontre parceiros compatíveis
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <UniversalDemoBanner variant="minimal" className="mb-6" />
          
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Rede de Contatos
                </h1>
                <p className="text-muted-foreground">
                  {isDemo 
                    ? 'Explore conexões no setor farmacêutico (dados demonstrativos)'
                    : 'Conecte-se com profissionais do setor farmacêutico'
                  }
                </p>
              </div>
            </div>
          </div>

          {isDemo ? renderDemoContent() : renderRealContent()}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Network;
