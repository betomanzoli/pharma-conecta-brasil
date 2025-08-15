
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Globe, 
  Shield, 
  Zap, 
  CheckCircle2,
  AlertTriangle,
  Settings,
  Link
} from 'lucide-react';

const IntegrationStatus = () => {
  const integrationPoints = [
    {
      name: 'Supabase Database',
      type: 'Database',
      status: 'connected',
      health: 100,
      lastSync: '2min ago',
      icon: Database,
      details: {
        tables: 28,
        functions: 24,
        policies: 18,
        connections: '12/50'
      }
    },
    {
      name: 'ANVISA API',
      type: 'External API',
      status: 'connected',
      health: 98,
      lastSync: '5min ago',
      icon: Globe,
      details: {
        endpoints: 8,
        requests: '2.3k/day',
        rateLimit: '95% available',
        compliance: 'Full'
      }
    },
    {
      name: 'OpenAI GPT',
      type: 'AI Service',
      status: 'connected',
      health: 96,
      lastSync: '1min ago',
      icon: Zap,
      details: {
        models: 4,
        tokens: '150k/day',
        requests: '890/day',
        accuracy: '97.8%'
      }
    },
    {
      name: 'Authentication',
      type: 'Auth Service',
      status: 'connected',
      health: 100,
      lastSync: '30s ago',
      icon: Shield,
      details: {
        users: '2.3k active',
        sessions: '1.8k current',
        security: '100% secure',
        uptime: '99.9%'
      }
    }
  ];

  const dataFlows = [
    {
      from: 'Frontend',
      to: 'Supabase',
      status: 'active',
      throughput: '12.5k req/h',
      latency: '120ms'
    },
    {
      from: 'Backend',
      to: 'ANVISA API',
      status: 'active',
      throughput: '2.1k req/h',
      latency: '450ms'
    },
    {
      from: 'AI Engine',
      to: 'OpenAI',
      status: 'active',
      throughput: '890 req/h',
      latency: '1.8s'
    },
    {
      from: 'Database',
      to: 'Analytics',
      status: 'active',
      throughput: '5.2k events/h',
      latency: '85ms'
    }
  ];

  const apiEndpoints = [
    { endpoint: '/api/matching', status: 'operational', responseTime: '120ms', uptime: '99.9%' },
    { endpoint: '/api/governance', status: 'operational', responseTime: '95ms', uptime: '100%' },
    { endpoint: '/api/compliance', status: 'operational', responseTime: '200ms', uptime: '99.8%' },
    { endpoint: '/api/analytics', status: 'operational', responseTime: '150ms', uptime: '99.9%' },
    { endpoint: '/api/automation', status: 'operational', responseTime: '180ms', uptime: '99.7%' },
    { endpoint: '/api/ai-chat', status: 'operational', responseTime: '1.2s', uptime: '99.5%' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'operational':
      case 'active': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
      case 'operational':
      case 'active': 
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Conectado</Badge>;
      case 'warning': 
        return <Badge className="bg-yellow-500"><AlertTriangle className="h-3 w-3 mr-1" />Atenção</Badge>;
      case 'error': 
        return <Badge className="bg-red-500"><AlertTriangle className="h-3 w-3 mr-1" />Erro</Badge>;
      default: 
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-green-500';
    if (health >= 85) return 'text-blue-500';
    if (health >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Status das Integrações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrationPoints.map((integration) => {
          const IconComponent = integration.icon;
          return (
            <Card key={integration.name}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      <div className="text-sm text-muted-foreground">{integration.type}</div>
                    </div>
                  </div>
                  {getStatusBadge(integration.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Saúde da Integração</span>
                    <div className="flex items-center gap-2">
                      <Progress value={integration.health} className="w-16 h-2" />
                      <span className={`text-sm font-bold ${getHealthColor(integration.health)}`}>
                        {integration.health}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Última sincronização: {integration.lastSync}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(integration.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key}:</span>
                        <span className="font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Fluxos de Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Fluxos de Dados Ativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dataFlows.map((flow, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">{flow.from}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-medium">{flow.to}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Throughput: </span>
                    <span className="font-semibold">{flow.throughput}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Latência: </span>
                    <span className="font-semibold">{flow.latency}</span>
                  </div>
                  {getStatusBadge(flow.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status dos Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Status dos Endpoints API
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {apiEndpoints.map((endpoint, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                    {endpoint.endpoint}
                  </code>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Resposta: </span>
                    <span className="font-semibold">{endpoint.responseTime}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Uptime: </span>
                    <span className="font-semibold">{endpoint.uptime}</span>
                  </div>
                  {getStatusBadge(endpoint.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo de Integrações */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle>Resumo das Integrações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">4/4</div>
              <div className="text-sm text-muted-foreground">Integrações Ativas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">98.5%</div>
              <div className="text-sm text-muted-foreground">Saúde Média</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">6/6</div>
              <div className="text-sm text-muted-foreground">APIs Funcionais</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">99.8%</div>
              <div className="text-sm text-muted-foreground">Uptime Médio</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationStatus;
