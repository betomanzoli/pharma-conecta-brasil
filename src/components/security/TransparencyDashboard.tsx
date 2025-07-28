
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  Users, 
  Shield, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Activity,
  FileText,
  Download,
  Share2
} from 'lucide-react';

interface AccessEvent {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: Date;
  ipAddress: string;
  location: string;
  riskLevel: 'low' | 'medium' | 'high';
  classification: string;
}

interface SecurityMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  icon: React.ReactNode;
}

const TransparencyDashboard = () => {
  const [accessEvents, setAccessEvents] = useState<AccessEvent[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'João Silva',
      action: 'view',
      resource: 'Contrato de Confidencialidade.pdf',
      timestamp: new Date('2024-01-15T10:30:00'),
      ipAddress: '192.168.1.100',
      location: 'São Paulo, SP',
      riskLevel: 'low',
      classification: 'restricted'
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Maria Santos',
      action: 'download',
      resource: 'Dados Experimentais.xlsx',
      timestamp: new Date('2024-01-15T11:15:00'),
      ipAddress: '192.168.1.101',
      location: 'Rio de Janeiro, RJ',
      riskLevel: 'medium',
      classification: 'confidential'
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Carlos Oliveira',
      action: 'share',
      resource: 'Relatório de Pesquisa.pdf',
      timestamp: new Date('2024-01-15T14:20:00'),
      ipAddress: '192.168.1.102',
      location: 'Belo Horizonte, MG',
      riskLevel: 'high',
      classification: 'restricted'
    }
  ]);

  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([
    {
      name: 'Acessos Autorizados',
      value: 98.5,
      unit: '%',
      trend: 'up',
      color: 'text-green-600',
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      name: 'Detecção de Anomalias',
      value: 12,
      unit: 'alertas',
      trend: 'down',
      color: 'text-yellow-600',
      icon: <AlertTriangle className="h-5 w-5" />
    },
    {
      name: 'Tempo de Resposta',
      value: 1.2,
      unit: 'ms',
      trend: 'stable',
      color: 'text-blue-600',
      icon: <Clock className="h-5 w-5" />
    },
    {
      name: 'Conformidade LGPD',
      value: 99.1,
      unit: '%',
      trend: 'up',
      color: 'text-purple-600',
      icon: <Shield className="h-5 w-5" />
    }
  ]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'view': return <Eye className="h-4 w-4" />;
      case 'download': return <Download className="h-4 w-4" />;
      case 'share': return <Share2 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'internal': return 'bg-blue-100 text-blue-800';
      case 'confidential': return 'bg-orange-100 text-orange-800';
      case 'restricted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportAuditReport = () => {
    console.log('Exportando relatório de auditoria...');
  };

  const [realTimeEnabled, setRealTimeEnabled] = useState(true);

  useEffect(() => {
    if (realTimeEnabled) {
      const interval = setInterval(() => {
        // Simular novos eventos em tempo real
        const newEvent: AccessEvent = {
          id: Date.now().toString(),
          userId: 'user' + Math.floor(Math.random() * 10),
          userName: 'Usuário Teste',
          action: ['view', 'download', 'share'][Math.floor(Math.random() * 3)],
          resource: 'Documento Teste.pdf',
          timestamp: new Date(),
          ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
          location: 'São Paulo, SP',
          riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
          classification: ['public', 'internal', 'confidential', 'restricted'][Math.floor(Math.random() * 4)]
        };
        setAccessEvents(prev => [newEvent, ...prev.slice(0, 19)]);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [realTimeEnabled]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <span>Dashboard de Transparência</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={realTimeEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                <Activity className="h-3 w-3 mr-1" />
                {realTimeEnabled ? 'Tempo Real' : 'Pausado'}
              </Badge>
              <Button variant="outline" onClick={exportAuditReport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Relatório
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Métricas de Segurança */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {securityMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{metric.name}</p>
                      <p className={`text-2xl font-bold ${metric.color}`}>
                        {metric.value}{metric.unit}
                      </p>
                    </div>
                    <div className={metric.color}>
                      {metric.icon}
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress value={metric.value} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="access" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="access">Acessos</TabsTrigger>
              <TabsTrigger value="sharing">Compartilhamentos</TabsTrigger>
              <TabsTrigger value="alerts">Alertas</TabsTrigger>
              <TabsTrigger value="analytics">Análises</TabsTrigger>
            </TabsList>

            <TabsContent value="access" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Eventos de Acesso em Tempo Real</h3>
                <Badge variant="outline">
                  {accessEvents.length} eventos registrados
                </Badge>
              </div>

              <div className="space-y-3">
                {accessEvents.slice(0, 10).map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getActionIcon(event.action)}
                          <div>
                            <p className="font-medium">{event.userName}</p>
                            <p className="text-sm text-gray-600">
                              {event.action} • {event.resource}
                            </p>
                            <p className="text-xs text-gray-500">
                              {event.timestamp.toLocaleString()} • {event.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getClassificationColor(event.classification)}>
                            {event.classification}
                          </Badge>
                          <Badge className={getRiskColor(event.riskLevel)}>
                            {event.riskLevel}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sharing" className="space-y-4">
              <h3 className="text-lg font-medium">Histórico de Compartilhamentos</h3>
              <div className="space-y-3">
                {accessEvents.filter(e => e.action === 'share').map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Share2 className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">{event.userName}</p>
                            <p className="text-sm text-gray-600">
                              Compartilhou: {event.resource}
                            </p>
                            <p className="text-xs text-gray-500">
                              {event.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getClassificationColor(event.classification)}>
                            {event.classification}
                          </Badge>
                          <Badge className={getRiskColor(event.riskLevel)}>
                            Risco: {event.riskLevel}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              <h3 className="text-lg font-medium">Alertas de Segurança</h3>
              <div className="space-y-3">
                {accessEvents.filter(e => e.riskLevel === 'high').map((event) => (
                  <Alert key={event.id}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Alerta de Alto Risco:</strong> {event.userName} executou ação "{event.action}" 
                      no documento "{event.resource}" classificado como "{event.classification}".
                      <br />
                      <span className="text-sm">
                        Timestamp: {event.timestamp.toLocaleString()} | IP: {event.ipAddress}
                      </span>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <h3 className="text-lg font-medium">Análises de Segurança</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ações por Usuário</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Array.from(new Set(accessEvents.map(e => e.userName))).map((userName) => {
                        const userEvents = accessEvents.filter(e => e.userName === userName);
                        return (
                          <div key={userName} className="flex items-center justify-between">
                            <span className="font-medium">{userName}</span>
                            <Badge variant="outline">{userEvents.length} ações</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Classificações Acessadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Array.from(new Set(accessEvents.map(e => e.classification))).map((classification) => {
                        const classEvents = accessEvents.filter(e => e.classification === classification);
                        return (
                          <div key={classification} className="flex items-center justify-between">
                            <Badge className={getClassificationColor(classification)}>
                              {classification}
                            </Badge>
                            <span className="text-sm">{classEvents.length} acessos</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <Alert className="mt-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Transparência Total:</strong> Este dashboard fornece visibilidade completa sobre 
              todos os acessos e compartilhamentos de dados na plataforma, garantindo conformidade 
              com regulamentações de privacidade e segurança.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransparencyDashboard;
