
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ComplianceResult {
  score: number;
  status: 'compliant' | 'partial' | 'non-compliant';
  checks: ComplianceCheck[];
}

interface ComplianceCheck {
  id: string;
  category: string;
  description: string;
  status: 'passed' | 'failed' | 'warning';
  details?: string;
}

const ComplianceChecker = () => {
  const { toast } = useToast();
  const [cnpj, setCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComplianceResult | null>(null);

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
      // Simular verificação de compliance
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResult: ComplianceResult = {
        score: 85,
        status: 'partial',
        checks: [
          {
            id: '1',
            category: 'ANVISA',
            description: 'Autorização de Funcionamento',
            status: 'passed',
            details: 'Válida até 15/12/2025'
          },
          {
            id: '2',
            category: 'ANVISA',
            description: 'Licença Sanitária',
            status: 'passed',
            details: 'Renovada em 03/2024'
          },
          {
            id: '3',
            category: 'Tributário',
            description: 'Regularidade Fiscal Federal',
            status: 'warning',
            details: 'Pendência menor identificada'
          },
          {
            id: '4',
            category: 'Trabalhista',
            description: 'Certificado de Regularidade do FGTS',
            status: 'passed'
          },
          {
            id: '5',
            category: 'Ambiental',
            description: 'Licença Ambiental',
            status: 'failed',
            details: 'Licença vencida em 10/2024'
          },
          {
            id: '6',
            category: 'Qualidade',
            description: 'Certificação ISO 9001',
            status: 'passed',
            details: 'Válida até 08/2025'
          }
        ]
      };

      setResult(mockResult);
      
      toast({
        title: "Verificação concluída",
        description: `Score de compliance: ${mockResult.score}%`,
      });
    } catch (error) {
      console.error('Error checking compliance:', error);
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
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOverallStatusColor = (status: string, score: number) => {
    if (status === 'compliant') return 'text-green-600';
    if (status === 'partial') return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <span>Verificação de Compliance</span>
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
              <Search className="h-4 w-4" />
              <span>{loading ? 'Verificando...' : 'Verificar'}</span>
            </Button>
          </div>

          {result && (
            <div className="space-y-6">
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${getOverallStatusColor(result.status, result.score)}`}>
                  {result.score}%
                </div>
                <Progress value={result.score} className="w-full h-3 mb-2" />
                <Badge 
                  variant={result.status === 'compliant' ? 'default' : result.status === 'partial' ? 'secondary' : 'destructive'}
                  className="text-sm"
                >
                  {result.status === 'compliant' ? 'Totalmente Conforme' : 
                   result.status === 'partial' ? 'Parcialmente Conforme' : 'Não Conforme'}
                </Badge>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Detalhamento por Categoria</h3>
                {result.checks.map((check) => (
                  <div key={check.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(check.status)}
                        <div>
                          <h4 className="font-medium">{check.description}</h4>
                          <Badge variant="outline" className="text-xs mt-1">
                            {check.category}
                          </Badge>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(check.status)}`}>
                        {check.status === 'passed' ? 'Aprovado' : 
                         check.status === 'failed' ? 'Reprovado' : 'Atenção'}
                      </div>
                    </div>
                    {check.details && (
                      <p className="text-sm text-gray-600 mt-2">{check.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceChecker;
