
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Shield, 
  Calculator, 
  Users, 
  Zap, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Star
} from 'lucide-react';
import ComplianceMonitor from '@/components/pharmaceutical/ComplianceMonitor';
import AIMatchingEngine from '@/components/pharmaceutical/AIMatchingEngine';
import DemoDataManager from './DemoDataManager';

const EnhancedPlatformDemo = () => {
  const [activeDemo, setActiveDemo] = useState('ai-matching');

  const demoFeatures = [
    {
      id: 'ai-matching',
      title: 'AI Matching Engine',
      icon: Brain,
      description: 'Algoritmo de IA que conecta empresas com base em compatibilidade e necessidades específicas',
      status: 'active',
      metrics: {
        accuracy: '94%',
        matches: '1,247',
        success_rate: '87%'
      }
    },
    {
      id: 'compliance',
      title: 'Compliance Monitor',
      icon: Shield,
      description: 'Monitoramento em tempo real do status de compliance regulatório',
      status: 'active',
      metrics: {
        companies_monitored: '350+',
        alerts_sent: '1,890',
        compliance_score: '91%'
      }
    },
    {
      id: 'roi-calculator',
      title: 'ROI Calculator',
      icon: Calculator,
      description: 'Calculadora avançada de retorno sobre investimento para projetos farmacêuticos',
      status: 'active',
      metrics: {
        calculations: '2,156',
        avg_roi: '23.5%',
        projects_approved: '78%'
      }
    }
  ];

  const platformMetrics = [
    { label: 'Usuários Ativos', value: '2,847', growth: '+15%' },
    { label: 'Projetos Concluídos', value: '1,234', growth: '+28%' },
    { label: 'Conexões Realizadas', value: '5,678', growth: '+42%' },
    { label: 'ROI Médio', value: '23.5%', growth: '+8%' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Demonstração da Plataforma PharmaConnect
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore as funcionalidades avançadas da nossa plataforma de conexão 
          farmacêutica com tecnologia de ponta e inteligência artificial.
        </p>
      </div>

      {/* Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {platformMetrics.map((metric, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
              <Badge variant="secondary" className="text-green-600">
                {metric.growth}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Demo Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {demoFeatures.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Card key={feature.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="h-8 w-8 text-primary-600" />
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <Badge 
                        variant={feature.status === 'active' ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {feature.status === 'active' ? 'Ativo' : 'Em Desenvolvimento'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="space-y-2">
                  {Object.entries(feature.metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-500 capitalize">
                        {key.replace('_', ' ')}:
                      </span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Interactive Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-primary-600" />
            <span>Demonstração Interativa</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeDemo} onValueChange={setActiveDemo}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ai-matching">AI Matching</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="data-manager">Dados Demo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai-matching" className="mt-6">
              <AIMatchingEngine />
            </TabsContent>
            
            <TabsContent value="compliance" className="mt-6">
              <ComplianceMonitor />
            </TabsContent>
            
            <TabsContent value="data-manager" className="mt-6">
              <DemoDataManager />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Success Stories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-6 w-6 text-yellow-500" />
            <span>Casos de Sucesso</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Conexão Bem-Sucedida</h3>
              </div>
              <p className="text-green-700 text-sm mb-2">
                Farmácia Brasileira S.A. conectou-se com Laboratório Mineiro através 
                do AI Matching, resultando em economia de 40% nos custos de análise.
              </p>
              <Badge variant="outline" className="text-green-600 border-green-600">
                ROI: +40%
              </Badge>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Eficiência Operacional</h3>
              </div>
              <p className="text-blue-700 text-sm mb-2">
                BioTech Inovação reduziu em 60% o tempo de encontrar consultores 
                especializados usando nossa plataforma de matching.
              </p>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                Tempo: -60%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Como Usar Esta Demonstração</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold">Popule os Dados Demo</h4>
                <p className="text-gray-600 text-sm">
                  Use a aba "Dados Demo" para popular a plataforma com dados fictícios 
                  realistas que permitirão testar todas as funcionalidades.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold">Teste o AI Matching</h4>
                <p className="text-gray-600 text-sm">
                  Experimente nossa engine de matching com IA inserindo critérios 
                  de busca e veja como encontramos parceiros compatíveis.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold">Monitore Compliance</h4>
                <p className="text-gray-600 text-sm">
                  Use o monitor de compliance para verificar o status regulatório 
                  de empresas e receber alertas em tempo real.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPlatformDemo;
