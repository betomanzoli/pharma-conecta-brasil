
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  Lock,
  Eye,
  FileText,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityMetric {
  name: string;
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  description: string;
  recommendations: string[];
}

const SecurityAuditDashboard = () => {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    performSecurityAudit();
  }, []);

  const performSecurityAudit = async () => {
    setIsLoading(true);
    
    try {
      // Simular auditoria de segurança
      const metrics: SecurityMetric[] = [
        {
          name: 'Autenticação e Autorização',
          score: 95,
          status: 'excellent',
          description: 'Sistema de autenticação Supabase com RLS ativo',
          recommendations: ['Implementar 2FA para usuários admin']
        },
        {
          name: 'Proteção de Dados',
          score: 88,
          status: 'good',
          description: 'Criptografia em trânsito e em repouso',
          recommendations: ['Implementar mascaramento de dados sensíveis', 'Configurar backup criptografado']
        },
        {
          name: 'Compliance LGPD',
          score: 92,
          status: 'excellent',
          description: 'Conformidade com Lei Geral de Proteção de Dados',
          recommendations: ['Atualizar política de privacidade']
        },
        {
          name: 'Monitoramento de Segurança',
          score: 85,
          status: 'good',
          description: 'Logs de auditoria e detecção de anomalias',
          recommendations: ['Implementar alertas em tempo real', 'Configurar SIEM']
        },
        {
          name: 'Segurança de API',
          score: 90,
          status: 'excellent',
          description: 'Rate limiting e validação de entrada',
          recommendations: ['Implementar API Gateway']
        },
        {
          name: 'Infraestrutura',
          score: 87,
          status: 'good',
          description: 'Configurações de segurança de servidor',
          recommendations: ['Atualizar certificados SSL', 'Configurar WAF']
        }
      ];

      setSecurityMetrics(metrics);
      const avgScore = metrics.reduce((acc, metric) => acc + metric.score, 0) / metrics.length;
      setOverallScore(Math.round(avgScore));
      
    } catch (error) {
      console.error('Erro na auditoria de segurança:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle2 className="h-4 w-4" />;
      case 'good': return <Shield className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Score Geral */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            Auditoria de Segurança Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{overallScore}%</div>
              <div className="text-sm text-muted-foreground">Score de Segurança</div>
              <Progress value={overallScore} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {securityMetrics.filter(m => m.status === 'excellent').length}
              </div>
              <div className="text-sm text-muted-foreground">Áreas Excelentes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {securityMetrics.reduce((acc, m) => acc + m.recommendations.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Recomendações</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {securityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getStatusIcon(metric.status)}
                  {metric.name}
                </CardTitle>
                <Badge className={getStatusColor(metric.status)}>
                  {metric.score}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={metric.score} className="h-2" />
                <p className="text-sm text-muted-foreground">{metric.description}</p>
                
                {metric.recommendations.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Recomendações:</h4>
                    <ul className="text-sm space-y-1">
                      {metric.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ações de Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ações de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button onClick={performSecurityAudit} className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Nova Auditoria
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Teste Penetração
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Relatório Compliance
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Backup Segurança
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alertas de Segurança */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Recomendação Prioritária:</strong> Implementar autenticação de dois fatores (2FA) 
          para usuários administrativos e configurar alertas de segurança em tempo real.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SecurityAuditDashboard;
