
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MetricsDashboard from '@/components/dashboard/MetricsDashboard';
import { isDemoMode } from '@/utils/demoMode';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertTriangle } from 'lucide-react';

const DashboardGeneral = () => {
  const isDemo = isDemoMode();

  if (!isDemo) {
    // Modo REAL - Mostrar estado vazio/inicial
    return (
      <div className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Modo Real Ativo:</strong> Os dados mostrados refletem informações reais da plataforma. 
            Configure sua conta e perfil para começar a ver métricas personalizadas.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conexões Realizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-sm text-muted-foreground">
                Complete seu perfil para começar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Projetos Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-sm text-muted-foreground">
                Nenhum projeto iniciado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Oportunidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-sm text-muted-foreground">
                Configure suas preferências
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Score de Atividade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">--</div>
              <p className="text-sm text-muted-foreground">
                Não calculado
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Primeiros Passos</CardTitle>
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
                    Adicione informações sobre sua empresa ou área de atuação
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
                    Encontre laboratórios, consultores e fornecedores
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold">3</span>
                </div>
                <div>
                  <p className="font-medium">Inicie conexões</p>
                  <p className="text-sm text-muted-foreground">
                    Conecte-se com parceiros estratégicos para seus projetos
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Modo DEMO - Mostrar dados simulados
  return (
    <div className="space-y-6">
      <Alert className="border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Modo Demonstração:</strong> Os dados abaixo são simulados para demonstrar 
          as funcionalidades da plataforma. Ative o modo real para ver seus dados reais.
        </AlertDescription>
      </Alert>

      <MetricsDashboard />
    </div>
  );
};

export default DashboardGeneral;
