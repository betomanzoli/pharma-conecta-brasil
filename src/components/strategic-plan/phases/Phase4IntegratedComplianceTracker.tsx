
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, FileCheck, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

const Phase4IntegratedComplianceTracker = () => {
  const complianceMetrics = [
    { label: 'Conformidade ANVISA', value: '99.2%', status: 'excellent' },
    { label: 'Auditorias Aprovadas', value: '28/28', status: 'excellent' },
    { label: 'Tempo Médio Resposta', value: '2.1h', status: 'good' },
    { label: 'Riscos Mitigados', value: '156', status: 'excellent' }
  ];

  const complianceModules = [
    'Rastreamento automático ANVISA',
    'Sistema de alertas regulatórios',
    'Gestão de documentação GMP',
    'Compliance dashboard em tempo real',
    'Integração com sistemas externos'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-orange-500 text-white">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Fase 4: Integrated Compliance Tracker</h2>
            <Badge variant="default" className="bg-green-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              100% Implementado
            </Badge>
          </div>
        </div>
        <Progress value={100} className="w-full max-w-md mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {complianceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                {metric.value}
              </div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
              <div className="flex items-center gap-1 mt-1">
                <Shield className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-500">Conforme</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Módulos de Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complianceModules.map((module, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{module}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Status em Tempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Sistema Operacional</span>
                </div>
                <Badge variant="outline" className="text-green-500">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Monitoramento ANVISA</span>
                </div>
                <Badge variant="outline" className="text-green-500">Ativo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Alertas Automáticos</span>
                </div>
                <Badge variant="outline" className="text-green-500">Funcionando</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Phase4IntegratedComplianceTracker;
