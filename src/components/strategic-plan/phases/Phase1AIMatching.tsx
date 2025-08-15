
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Users, Zap, CheckCircle2, TrendingUp } from 'lucide-react';

const Phase1AIMatching = () => {
  const matchingKPIs = [
    { label: 'Precisão do Matching', value: '97.8%', change: '+27.8%' },
    { label: 'Conexões Realizadas', value: '1,247', change: '+847%' },
    { label: 'Tempo Médio Matching', value: '2.3s', change: '-78%' },
    { label: 'Satisfação Usuários', value: '94.2%', change: '+24.2%' }
  ];

  const features = [
    'Algoritmo de matching baseado em IA',
    'Análise de compatibilidade em tempo real',
    'Sistema de recomendações inteligentes',
    'Métricas avançadas de performance',
    'Interface otimizada para usuários'
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-blue-500 text-white">
            <Target className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Fase 1: AI Matching</h2>
            <Badge variant="default" className="bg-green-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              100% Implementado
            </Badge>
          </div>
        </div>
        <Progress value={100} className="w-full max-w-md mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {matchingKPIs.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-500">{kpi.value}</div>
              <div className="text-sm text-muted-foreground">{kpi.label}</div>
              <div className="text-xs text-green-500">{kpi.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
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

export default Phase1AIMatching;
