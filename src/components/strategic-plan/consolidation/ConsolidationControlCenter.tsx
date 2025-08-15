
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Zap, 
  FileText, 
  Target, 
  Activity,
  Settings
} from 'lucide-react';
import PerformanceOptimizer from '@/components/performance/PerformanceOptimizer';
import SecurityAuditDashboard from '@/components/security/SecurityAuditDashboard';
import TestSuiteRunner from '@/components/testing/TestSuiteRunner';
import DocumentationCenter from '@/components/documentation/DocumentationCenter';
import AdvancedMonitoringDashboard from '@/components/monitoring/AdvancedMonitoringDashboard';

const ConsolidationControlCenter = () => {
  const consolidationAreas = [
    {
      name: 'Performance & Otimização',
      progress: 78,
      status: 'in-progress',
      icon: Zap,
      color: 'bg-blue-500',
      description: 'Otimização de performance, lazy loading e caching'
    },
    {
      name: 'Segurança Robusta',
      progress: 92,
      status: 'excellent',
      icon: Shield,
      color: 'bg-green-500',
      description: 'Auditoria de segurança, compliance e proteção de dados'
    },
    {
      name: 'Suite de Testes',
      progress: 67,
      status: 'in-progress',
      icon: Target,
      color: 'bg-purple-500',
      description: 'Testes unitários, integração e end-to-end'
    },
    {
      name: 'Documentação Completa',
      progress: 85,
      status: 'good',
      icon: FileText,
      color: 'bg-orange-500',
      description: 'Documentação técnica, guias de usuário e APIs'
    },
    {
      name: 'Monitoramento Avançado',
      progress: 88,
      status: 'good',
      icon: Activity,
      color: 'bg-cyan-500',
      description: 'APM, alertas proativos e observabilidade'
    },
    {
      name: 'Deploy Production-Ready',
      progress: 45,
      status: 'pending',
      icon: Settings,
      color: 'bg-indigo-500',
      description: 'CI/CD, blue-green deployment e disaster recovery'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'in-progress': return 'text-yellow-500';
      case 'pending': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent': return <Badge className="bg-green-500">Excelente</Badge>;
      case 'good': return <Badge className="bg-blue-500">Bom</Badge>;
      case 'in-progress': return <Badge className="bg-yellow-500">Em Progresso</Badge>;
      case 'pending': return <Badge className="bg-gray-500">Pendente</Badge>;
      default: return <Badge variant="outline">-</Badge>;
    }
  };

  const overallProgress = Math.round(
    consolidationAreas.reduce((acc, area) => acc + area.progress, 0) / consolidationAreas.length
  );

  return (
    <div className="space-y-8">
      {/* Header de Consolidação */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Centro de Controle - Fortalecimento das Fases 1-7
            </h1>
            <p className="text-muted-foreground">
              Consolidação e otimização completa do sistema base
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <Badge variant="default" className={`${overallProgress >= 80 ? 'bg-green-500' : 'bg-blue-500'}`}>
            <Activity className="h-3 w-3 mr-1" />
            {overallProgress}% Consolidado
          </Badge>
          <Badge variant="outline">
            <Shield className="h-3 w-3 mr-1" />
            Sistema em Fortalecimento
          </Badge>
        </div>
      </div>

      {/* Progresso Geral */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Progresso do Fortalecimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Consolidação Geral das 6 Áreas</span>
              <span className="text-lg font-bold text-blue-500">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-4" />
            <div className="text-sm text-muted-foreground">
              Fortalecendo a base do sistema com otimizações avançadas, segurança robusta e monitoramento completo.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Áreas de Consolidação */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consolidationAreas.map((area, index) => {
          const IconComponent = area.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${area.color} text-white`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm">{area.name}</CardTitle>
                  </div>
                  {getStatusBadge(area.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{area.description}</p>
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span className={`font-bold ${getStatusColor(area.status)}`}>
                      {area.progress}%
                    </span>
                  </div>
                  <Progress value={area.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dashboard Detalhado de Consolidação */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="testing">Testes</TabsTrigger>
          <TabsTrigger value="documentation">Documentação</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <PerformanceOptimizer optimizationLevel="advanced">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Otimização de Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">78%</div>
                      <div className="text-sm text-muted-foreground">Otimização Completa</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-500">1.2s</div>
                      <div className="text-sm text-muted-foreground">Tempo de Carregamento</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-purple-500">95%</div>
                      <div className="text-sm text-muted-foreground">Score Lighthouse</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ✅ Lazy loading implementado<br/>
                    ✅ Code splitting configurado<br/>
                    🔄 Caching estratégico em implementação<br/>
                    ⏳ CDN para assets pendente
                  </div>
                </div>
              </CardContent>
            </Card>
          </PerformanceOptimizer>
        </TabsContent>

        <TabsContent value="security">
          <SecurityAuditDashboard />
        </TabsContent>

        <TabsContent value="testing">
          <TestSuiteRunner />
        </TabsContent>

        <TabsContent value="documentation">
          <DocumentationCenter />
        </TabsContent>

        <TabsContent value="monitoring">
          <AdvancedMonitoringDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsolidationControlCenter;
