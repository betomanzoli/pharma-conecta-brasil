
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, DollarSign, Target, CheckCircle2 } from 'lucide-react';

const Phase3AdvancedSharedValue = () => {
  const kpis = [
    { label: 'Valor Compartilhado Gerado', value: 'R$ 2.8M', change: '+180%' },
    { label: 'Parcerias Estratégicas', value: '42', change: '+250%' },
    { label: 'ROI Colaborativo', value: '385%', change: '+285%' },
    { label: 'Satisfação Partners', value: '94%', change: '+24%' }
  ];

  const features = [
    'Sistema de matching avançado para parcerias',
    'Plataforma de compartilhamento de recursos',
    'Analytics de valor colaborativo',
    'Gestão inteligente de contratos',
    'Métricas de impacto social'
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-purple-500 text-white">
            <TrendingUp className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Fase 3: Advanced Shared Value</h2>
            <Badge variant="default" className="bg-green-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              100% Implementado
            </Badge>
          </div>
        </div>
        <Progress value={100} className="w-full max-w-md mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-500">{kpi.value}</div>
              <div className="text-sm text-muted-foreground">{kpi.label}</div>
              <div className="text-xs text-green-500">{kpi.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Recursos Implementados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Phase3AdvancedSharedValue;
