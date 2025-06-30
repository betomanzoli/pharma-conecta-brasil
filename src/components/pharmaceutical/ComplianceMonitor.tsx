
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { RegulatoryApiService } from '@/services/regulatoryApiService';
import { useToast } from '@/hooks/use-toast';

interface ComplianceStatus {
  cnpj: string;
  checks: Array<{
    source: string;
    status: 'success' | 'error';
    data: any;
    error?: any;
  }>;
  overall_score: number;
  last_updated: string;
}

const ComplianceMonitor = () => {
  const { toast } = useToast();
  const [cnpj, setCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const checkCompliance = async () => {
    if (!cnpj.trim()) {
      toast({
        title: "CNPJ obrigatório",
        description: "Por favor, insira um CNPJ válido",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const status = await RegulatoryApiService.checkComplianceStatus(cnpj);
      setComplianceStatus(status);
      
      toast({
        title: "Verificação concluída",
        description: `Score de compliance: ${status.overall_score}%`,
      });
    } catch (error) {
      console.error('Erro na verificação:', error);
      toast({
        title: "Erro na verificação",
        description: "Não foi possível verificar o compliance",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'non-compliant': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh && complianceStatus) {
      interval = setInterval(() => {
        checkCompliance();
      }, 5 * 60 * 1000); // 5 minutos
    }
    return () => clearInterval(interval);
  }, [autoRefresh, complianceStatus]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <span>Monitor de Compliance</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex space-x-4">
            <Input
              placeholder="Digite o CNPJ da empresa"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={checkCompliance}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Verificando...' : 'Verificar'}</span>
            </Button>
          </div>

          {complianceStatus && (
            <div className="space-y-6">
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${getStatusColor(complianceStatus.overall_score)}`}>
                  {complianceStatus.overall_score}%
                </div>
                <Progress value={complianceStatus.overall_score} className="w-full h-3 mb-2" />
                <Badge 
                  variant={complianceStatus.overall_score >= 80 ? 'default' : 
                          complianceStatus.overall_score >= 60 ? 'secondary' : 'destructive'}
                  className="text-sm"
                >
                  {complianceStatus.overall_score >= 80 ? 'Totalmente Conforme' : 
                   complianceStatus.overall_score >= 60 ? 'Parcialmente Conforme' : 'Não Conforme'}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Verificações por Fonte</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="autoRefresh"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="autoRefresh" className="text-sm text-gray-600">
                      Atualização automática
                    </label>
                  </div>
                </div>

                {complianceStatus.checks.map((check, index) => (
                  <Alert key={index}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(check.data?.status || 'unknown')}
                        <div>
                          <h4 className="font-medium capitalize">
                            {check.source.replace('_', ' ')}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Status: {check.status === 'success' ? 'Verificado' : 'Erro na verificação'}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={check.data?.status === 'compliant' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {check.data?.status === 'compliant' ? 'Conforme' : 'Não Conforme'}
                      </Badge>
                    </div>
                    {check.data && (
                      <AlertDescription className="mt-2 text-xs">
                        {JSON.stringify(check.data, null, 2)}
                      </AlertDescription>
                    )}
                  </Alert>
                ))}
              </div>

              <div className="text-xs text-gray-500">
                Última atualização: {new Date(complianceStatus.last_updated).toLocaleString('pt-BR')}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceMonitor;
