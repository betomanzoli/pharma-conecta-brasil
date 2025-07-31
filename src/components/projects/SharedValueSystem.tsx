
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PieChart, 
  DollarSign, 
  TrendingUp, 
  Target, 
  Users, 
  Award,
  Calculator,
  BarChart3,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface ValueMetrics {
  financial_value: number;
  strategic_value: number;
  innovation_value: number;
  market_access_value: number;
  risk_mitigation_value: number;
  knowledge_value: number;
}

interface PartnerContribution {
  partner_id: string;
  partner_name: string;
  contribution_percentage: number;
  value_received: number;
  satisfaction_score: number;
  equity_balance: number;
}

interface SharedValueSystemProps {
  projectId?: string;
  partners?: any[];
  onValueDistributionUpdated?: (distribution: any) => void;
}

const SharedValueSystem: React.FC<SharedValueSystemProps> = ({
  projectId,
  partners = [],
  onValueDistributionUpdated
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [valueMetrics, setValueMetrics] = useState<ValueMetrics | null>(null);
  const [partnerContributions, setPartnerContributions] = useState<PartnerContribution[]>([]);
  const [equityAnalysis, setEquityAnalysis] = useState<any>(null);

  useEffect(() => {
    generateValueAnalysis();
  }, [partners]);

  const generateValueAnalysis = async () => {
    setLoading(true);
    try {
      // Mock value analysis based on collaborative value creation
      const mockValueMetrics: ValueMetrics = {
        financial_value: 850000,
        strategic_value: 750000,
        innovation_value: 650000,
        market_access_value: 550000,
        risk_mitigation_value: 450000,
        knowledge_value: 350000
      };

      const mockContributions: PartnerContribution[] = [
        {
          partner_id: '1',
          partner_name: 'Empresa Principal',
          contribution_percentage: 45,
          value_received: 1425000,
          satisfaction_score: 95,
          equity_balance: 0.98
        },
        {
          partner_id: '2',
          partner_name: 'Laboratório Parceiro A',
          contribution_percentage: 30,
          value_received: 950000,
          satisfaction_score: 88,
          equity_balance: 0.92
        },
        {
          partner_id: '3',
          partner_name: 'Fornecedor Especializado',
          contribution_percentage: 15,
          value_received: 475000,
          satisfaction_score: 85,
          equity_balance: 0.95
        },
        {
          partner_id: '4',
          partner_name: 'Distribuidor Regional',
          contribution_percentage: 10,
          value_received: 315000,
          satisfaction_score: 78,
          equity_balance: 0.87
        }
      ];

      const mockEquityAnalysis = {
        overall_equity_score: 0.93,
        value_alignment_index: 0.89,
        satisfaction_average: 86.5,
        redistribution_needed: false,
        recommendations: [
          {
            type: 'optimization',
            description: 'Considere ajustar a distribuição para o Distribuidor Regional',
            priority: 'medium'
          },
          {
            type: 'enhancement',
            description: 'Implemente bônus por performance para manter alinhamento',
            priority: 'low'
          }
        ]
      };

      setValueMetrics(mockValueMetrics);
      setPartnerContributions(mockContributions);
      setEquityAnalysis(mockEquityAnalysis);

      if (onValueDistributionUpdated) {
        onValueDistributionUpdated({
          metrics: mockValueMetrics,
          contributions: mockContributions,
          equity: mockEquityAnalysis
        });
      }

      toast({
        title: "Análise de Valor Compartilhado Concluída",
        description: "Sistema de distribuição equitativa analisado com sucesso."
      });
    } catch (error) {
      console.error('Error in value analysis:', error);
      toast({
        title: "Erro na Análise de Valor",
        description: "Não foi possível completar a análise de valor compartilhado.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const valueDistributionData = valueMetrics ? [
    { name: 'Financeiro', value: valueMetrics.financial_value, color: '#22c55e' },
    { name: 'Estratégico', value: valueMetrics.strategic_value, color: '#3b82f6' },
    { name: 'Inovação', value: valueMetrics.innovation_value, color: '#8b5cf6' },
    { name: 'Acesso Mercado', value: valueMetrics.market_access_value, color: '#f59e0b' },
    { name: 'Mitigação Risco', value: valueMetrics.risk_mitigation_value, color: '#ef4444' },
    { name: 'Conhecimento', value: valueMetrics.knowledge_value, color: '#06b6d4' }
  ] : [];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Analisando sistema de valor compartilhado...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center space-x-2">
          <PieChart className="h-6 w-6 text-green-500" />
          <span>Sistema de Valor Compartilhado</span>
        </h2>
        <p className="text-gray-600">
          Distribuição equitativa baseada na contribuição e valor gerado
        </p>
      </div>

      {/* Equity Score */}
      {equityAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span>Score de Equidade Geral</span>
              <Badge className={equityAnalysis.overall_equity_score > 0.9 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                {Math.round(equityAnalysis.overall_equity_score * 100)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(equityAnalysis.overall_equity_score * 100)}%
                </div>
                <div className="text-sm text-gray-600">Score Equidade</div>
                <Progress value={equityAnalysis.overall_equity_score * 100} className="mt-2" />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(equityAnalysis.value_alignment_index * 100)}%
                </div>
                <div className="text-sm text-gray-600">Alinhamento de Valor</div>
                <Progress value={equityAnalysis.value_alignment_index * 100} className="mt-2" />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(equityAnalysis.satisfaction_average)}%
                </div>
                <div className="text-sm text-gray-600">Satisfação Média</div>
                <Progress value={equityAnalysis.satisfaction_average} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="distribution" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="distribution">Distribuição de Valor</TabsTrigger>
          <TabsTrigger value="contributions">Contribuições dos Parceiros</TabsTrigger>
          <TabsTrigger value="analysis">Análise de Equidade</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Valor Gerado</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={valueDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                    >
                      {valueDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Valor</CardTitle>
              </CardHeader>
              <CardContent>
                {valueMetrics && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Valor Financeiro</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(valueMetrics.financial_value)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Valor Estratégico</span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(valueMetrics.strategic_value)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Valor de Inovação</span>
                      <span className="font-semibold text-purple-600">
                        {formatCurrency(valueMetrics.innovation_value)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Acesso ao Mercado</span>
                      <span className="font-semibold text-orange-600">
                        {formatCurrency(valueMetrics.market_access_value)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Mitigação de Riscos</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(valueMetrics.risk_mitigation_value)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Valor do Conhecimento</span>
                      <span className="font-semibold text-cyan-600">
                        {formatCurrency(valueMetrics.knowledge_value)}
                      </span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between items-center font-bold">
                      <span>Valor Total Gerado</span>
                      <span className="text-lg">
                        {formatCurrency(Object.values(valueMetrics).reduce((a, b) => a + b, 0))}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contributions" className="space-y-4">
          <div className="space-y-4">
            {partnerContributions.map((contribution) => (
              <Card key={contribution.partner_id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">{contribution.partner_name}</h4>
                    <div className="flex space-x-2">
                      <Badge variant="outline">
                        {contribution.contribution_percentage}% Contribuição
                      </Badge>
                      <Badge className={contribution.satisfaction_score > 85 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {contribution.satisfaction_score}% Satisfação
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Contribuição</p>
                      <Progress value={contribution.contribution_percentage} className="mt-1" />
                      <p className="text-xs text-gray-500 mt-1">{contribution.contribution_percentage}%</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Valor Recebido</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(contribution.value_received)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Satisfação</p>
                      <Progress value={contribution.satisfaction_score} className="mt-1" />
                      <p className="text-xs text-gray-500 mt-1">{contribution.satisfaction_score}%</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Balanço de Equidade</p>
                      <div className="flex items-center space-x-1">
                        {contribution.equity_balance > 0.9 ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="font-semibold">
                          {Math.round(contribution.equity_balance * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {equityAnalysis && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    <span>Status de Redistribuição</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6">
                    {equityAnalysis.redistribution_needed ? (
                      <div className="space-y-3">
                        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto" />
                        <h4 className="text-lg font-semibold text-yellow-800">
                          Redistribuição Recomendada
                        </h4>
                        <p className="text-gray-600">
                          Alguns parceiros podem estar recebendo valor desproporcional
                        </p>
                        <Button className="bg-yellow-600 hover:bg-yellow-700">
                          <Calculator className="h-4 w-4 mr-2" />
                          Calcular Nova Distribuição
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                        <h4 className="text-lg font-semibold text-green-800">
                          Distribuição Equilibrada
                        </h4>
                        <p className="text-gray-600">
                          O sistema de valor compartilhado está funcionando adequadamente
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recomendações do Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {equityAnalysis.recommendations.map((rec: any, index: number) => (
                      <div key={index} className={`p-3 rounded-lg ${
                        rec.priority === 'high' ? 'bg-red-50 border-l-4 border-l-red-500' :
                        rec.priority === 'medium' ? 'bg-yellow-50 border-l-4 border-l-yellow-500' :
                        'bg-blue-50 border-l-4 border-l-blue-500'
                      }`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={
                            rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {rec.priority.toUpperCase()}
                          </Badge>
                          <span className="font-semibold text-sm">{rec.type}</span>
                        </div>
                        <p className="text-sm">{rec.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Button onClick={generateValueAnalysis} disabled={loading} className="mr-2">
          <Zap className="h-4 w-4 mr-2" />
          Atualizar Análise de Valor
        </Button>
        <Button variant="outline" disabled={loading}>
          <DollarSign className="h-4 w-4 mr-2" />
          Exportar Relatório Financeiro
        </Button>
      </div>
    </div>
  );
};

export default SharedValueSystem;
