
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  TrendingUp, 
  Shield, 
  Users, 
  FlaskConical, 
  Building2,
  Calculator,
  Bell,
  Search
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PlatformDemo = () => {
  const [loading, setLoading] = useState(false);
  const [demoResults, setDemoResults] = useState<any>(null);
  const { toast } = useToast();

  const runAIMatching = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-matching', {
        body: {
          entityType: 'company',
          entityId: 'demo-company-id',
          serviceType: 'laboratory_analysis',
          requirements: ['análise microbiológica', 'controle de qualidade'],
          location: 'São Paulo',
          budget: { min: 5000, max: 15000 }
        }
      });

      if (error) throw error;
      setDemoResults({ type: 'matching', data });
      toast({
        title: "AI Matching executado com sucesso!",
        description: `Encontrados ${data.matches.length} parceiros compatíveis`,
      });
    } catch (error) {
      toast({
        title: "Erro no AI Matching",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runRegulatorySync = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('regulatory-sync', {
        body: { source: 'anvisa' }
      });

      if (error) throw error;
      setDemoResults({ type: 'regulatory', data });
      toast({
        title: "Sincronização ANVISA realizada!",
        description: `${data.alerts.length} alertas processados`,
      });
    } catch (error) {
      toast({
        title: "Erro na sincronização",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const runROICalculator = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('roi-calculator', {
        body: {
          investmentType: 'platform_subscription',
          initialCost: 5000,
          monthlyCost: 500,
          timeHorizon: 12,
          expectedBenefits: {
            timeReduction: 30,
            costSavings: 2000,
            revenueIncrease: 5000
          },
          companySize: 'medium',
          currentProcessCost: 10000
        }
      });

      if (error) throw error;
      setDemoResults({ type: 'roi', data });
      toast({
        title: "Cálculo de ROI concluído!",
        description: `ROI calculado: ${data.roi}%`,
      });
    } catch (error) {
      toast({
        title: "Erro no cálculo de ROI",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Demonstração da Plataforma PharmaConnect Brasil
        </h2>
        <p className="text-lg text-gray-600">
          Teste as funcionalidades principais do ecossistema colaborativo
        </p>
      </div>

      <Tabs defaultValue="ai-matching" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ai-matching" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>AI Matching</span>
          </TabsTrigger>
          <TabsTrigger value="regulatory" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Regulatório</span>
          </TabsTrigger>
          <TabsTrigger value="roi" className="flex items-center space-x-2">
            <Calculator className="h-4 w-4" />
            <span>ROI Calculator</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-matching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary-600" />
                <span>Motor de Matching com IA</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Demonstração do algoritmo que conecta automaticamente empresas com laboratórios 
                e consultores compatíveis baseado em critérios específicos.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Parâmetros de Demonstração:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Empresa buscando análise laboratorial</li>
                  <li>• Localização: São Paulo</li>
                  <li>• Serviços: Análise microbiológica, Controle de qualidade</li>
                  <li>• Orçamento: R$ 5.000 - R$ 15.000</li>
                </ul>
              </div>

              <Button 
                onClick={runAIMatching} 
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700"
              >
                {loading ? 'Processando...' : 'Executar AI Matching'}
              </Button>

              {demoResults?.type === 'matching' && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Resultados do Matching:</h4>
                  {demoResults.data.matches.map((match: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{match.name}</h5>
                          <p className="text-sm text-gray-600">{match.type}</p>
                          <p className="text-xs text-gray-500">{match.location}</p>
                        </div>
                        <Badge variant="secondary">
                          Score: {match.score}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Razões do match:</p>
                        <ul className="text-xs text-gray-600">
                          {match.reasons.map((reason: string, idx: number) => (
                            <li key={idx}>• {reason}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regulatory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary-600" />
                <span>Centro de Inteligência Regulatória</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Sincronização automática com APIs da ANVISA para capturar alertas regulatórios, 
                atualizações de normas e avisos de segurança em tempo real.
              </p>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Funcionalidades:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Alertas de segurança em tempo real</li>
                  <li>• Atualizações de RDCs e normas</li>
                  <li>• Consultas públicas abertas</li>
                  <li>• Notificações personalizadas</li>
                </ul>
              </div>

              <Button 
                onClick={runRegulatorySync} 
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700"
              >
                {loading ? 'Sincronizando...' : 'Sincronizar com ANVISA'}
              </Button>

              {demoResults?.type === 'regulatory' && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Alertas Sincronizados:</h4>
                  {demoResults.data.alerts.map((alert: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium">{alert.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Fonte: {alert.source} | Tipo: {alert.alert_type}
                          </p>
                        </div>
                        <Badge 
                          variant={alert.severity === 'critical' ? 'destructive' : 
                                  alert.severity === 'high' ? 'default' : 'secondary'}
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-primary-600" />
                <span>Calculadora de ROI</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Ferramenta avançada para calcular o retorno sobre investimento de diferentes 
                iniciativas na indústria farmacêutica, baseada em benchmarks do setor.
              </p>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Cenário de Demonstração:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Investimento inicial: R$ 5.000</li>
                  <li>• Custo mensal: R$ 500</li>
                  <li>• Horizonte: 12 meses</li>
                  <li>• Redução de tempo: 30%</li>
                  <li>• Economia de custos: R$ 2.000/mês</li>
                  <li>• Aumento de receita: R$ 5.000/mês</li>
                </ul>
              </div>

              <Button 
                onClick={runROICalculator} 
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700"
              >
                {loading ? 'Calculando...' : 'Calcular ROI'}
              </Button>

              {demoResults?.type === 'roi' && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <h4 className="font-bold text-2xl text-green-700">
                        {demoResults.data.roi}%
                      </h4>
                      <p className="text-sm text-green-600">ROI</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <h4 className="font-bold text-2xl text-blue-700">
                        {demoResults.data.paybackPeriod}
                      </h4>
                      <p className="text-sm text-blue-600">Meses para Payback</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Resumo Financeiro:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Benefícios Totais: R$ {demoResults.data.totalBenefits.toLocaleString()}</li>
                      <li>• Custos Totais: R$ {demoResults.data.totalCosts.toLocaleString()}</li>
                      <li>• Valor Presente Líquido: R$ {demoResults.data.netPresentValue.toLocaleString()}</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Recomendações:</h4>
                    <ul className="text-sm space-y-1">
                      {demoResults.data.recommendations.map((rec: string, idx: number) => (
                        <li key={idx}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlatformDemo;
