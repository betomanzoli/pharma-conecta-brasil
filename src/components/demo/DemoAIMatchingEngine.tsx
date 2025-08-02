
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Users, TrendingUp, CheckCircle, XCircle, Zap, Target, BarChart3, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { demoAPI } from '@/utils/demoData';
import DemoModeIndicator from './DemoModeIndicator';

interface DemoMatch {
  id: string;
  name: string;
  type: string;
  score: number;
  specialties: string[];
  location: string;
  verified: boolean;
  compatibility_factors: string[];
  capacity?: string;
  annual_revenue?: string;
  major_clients?: string[];
  hourly_rate?: number;
  success_rate?: string;
  recent_projects?: string[];
}

interface MarketContext {
  active_scenario: string;
  market_trend: string;
  recommendations: string[];
}

const DemoAIMatchingEngine = () => {
  const { toast } = useToast();
  const [matches, setMatches] = useState<DemoMatch[]>([]);
  const [marketContext, setMarketContext] = useState<MarketContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('default');
  const [selectedSegment, setSelectedSegment] = useState<string>('generics');

  const scenarios = [
    { value: 'default', label: 'Cenário Padrão' },
    { value: 'biosimilar_boom', label: 'Explosão Biosimilares' },
    { value: 'personalized_medicine', label: 'Medicina Personalizada' },
    { value: 'generic_consolidation', label: 'Consolidação Genéricos' }
  ];

  const segments = [
    { value: 'generics', label: 'Medicamentos Genéricos', specialties: ['Bioequivalência', 'Análise Físico-Química'] },
    { value: 'biologics', label: 'Produtos Biológicos', specialties: ['Biosimilares', 'Terapia Celular'] },
    { value: 'oncology', label: 'Oncologia', specialties: ['Desenvolvimento Clínico', 'Regulatório'] },
    { value: 'pediatrics', label: 'Medicamentos Pediátricos', specialties: ['Formulação Pediátrica', 'Estudos Clínicos'] }
  ];

  const generateAdvancedMatches = async () => {
    setLoading(true);
    
    try {
      const selectedSegmentData = segments.find(s => s.value === selectedSegment);
      
      const result = await demoAPI.aiMatching('pharmaceutical_company', {
        location: 'São Paulo',
        specialties: selectedSegmentData?.specialties || ['Análise Microbiológica'],
        budget: { min: 50000, max: 1000000 },
        scenario: selectedScenario,
        segment: selectedSegment
      });
      
      if (result.success) {
        setMatches(result.matches);
        setMarketContext(result.market_context);
        
        toast({
          title: "🧠 AI Matching Avançado Completo!",
          description: `${result.matches.length} matches encontrados com ${result.processing_time} de processamento`,
        });
      }
    } catch (error) {
      console.error('Erro no AI Matching Demo:', error);
      toast({
        title: "Erro no AI Matching",
        description: "Não foi possível completar a demonstração avançada",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptMatch = (matchId: string) => {
    const matchData = matches.find(m => m.id === matchId);
    toast({
      title: "Match aceito! 🎉",
      description: `Demonstração: ${matchData?.name} foi adicionado ao seu pipeline de parcerias.`,
    });
    setMatches(prev => prev.filter(m => m.id !== matchId));
  };

  const rejectMatch = (matchId: string) => {
    toast({
      title: "Feedback registrado",
      description: "Demonstração: Seu feedback está melhorando nosso algoritmo de IA.",
    });
    setMatches(prev => prev.filter(m => m.id !== matchId));
  };

  const getScoreColor = (score: number) => {
    const percentage = Math.round(score * 100);
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 80) return 'bg-blue-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getScoreLabel = (score: number) => {
    const percentage = Math.round(score * 100);
    if (percentage >= 90) return 'Excelente';
    if (percentage >= 80) return 'Muito Bom';
    if (percentage >= 70) return 'Bom';
    return 'Regular';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <span>AI Matching Engine Avançado</span>
            <DemoModeIndicator variant="badge" />
          </CardTitle>
        </div>
        <DemoModeIndicator variant="alert" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Cenário de Mercado</label>
            <Select value={selectedScenario} onValueChange={setSelectedScenario}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cenário" />
              </SelectTrigger>
              <SelectContent>
                {scenarios.map((scenario) => (
                  <SelectItem key={scenario.value} value={scenario.value}>
                    {scenario.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Segmento Farmacêutico</label>
            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um segmento" />
              </SelectTrigger>
              <SelectContent>
                {segments.map((segment) => (
                  <SelectItem key={segment.value} value={segment.value}>
                    {segment.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button 
              onClick={generateAdvancedMatches} 
              disabled={loading}
              className="w-full flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <TrendingUp className="h-4 w-4" />
              )}
              <span>{loading ? 'Analisando...' : 'Gerar Matches IA'}</span>
            </Button>
          </div>
        </div>

        {marketContext && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Target className="h-4 w-4 mr-2 text-blue-600" />
              Contexto de Mercado: {marketContext.active_scenario}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Badge variant="outline" className="mb-2">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Impacto: {marketContext.market_trend}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Recomendações Estratégicas:</div>
                <ul className="text-xs text-gray-600 space-y-1">
                  {marketContext.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-center space-x-1">
                      <Lightbulb className="h-3 w-3 text-yellow-500" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {matches.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Configure o cenário e segmento desejados e clique em "Gerar Matches IA"
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Simulações baseadas em parcerias reais do mercado farmacêutico brasileiro
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Matches Encontrados ({matches.length})
              </h3>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Zap className="h-3 w-3" />
                <span>Algoritmo v2.1</span>
              </Badge>
            </div>
            
            {matches.map((match) => (
              <div key={match.id} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-full ${getScoreColor(match.score)} flex flex-col items-center justify-center text-white`}>
                      <div className="text-lg font-bold">{Math.round(match.score * 100)}%</div>
                      <div className="text-xs">{getScoreLabel(match.score)}</div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{match.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">
                          {match.type === 'laboratory' ? 'Laboratório' : 'Consultor'}
                        </Badge>
                        <DemoModeIndicator variant="inline" className="ml-2" />
                        {match.verified && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verificado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => acceptMatch(match.id)}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Aceitar</span>
                    </Button>
                    <Button
                      onClick={() => rejectMatch(match.id)}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Rejeitar</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Localização</h4>
                    <p className="text-sm text-gray-600">{match.location}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Especialidades</h4>
                    <div className="flex flex-wrap gap-1">
                      {match.specialties.map((spec, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      {match.type === 'laboratory' ? 'Informações' : 'Dados Profissionais'}
                    </h4>
                    {match.type === 'laboratory' ? (
                      <div className="text-sm text-gray-600 space-y-1">
                        {match.capacity && <div>Capacidade: {match.capacity}</div>}
                        {match.annual_revenue && <div>Receita: {match.annual_revenue}</div>}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 space-y-1">
                        {match.hourly_rate && <div>Taxa: R$ {match.hourly_rate}/hora</div>}
                        {match.success_rate && <div>Taxa Sucesso: {match.success_rate}</div>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Fatores de Compatibilidade</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {match.compatibility_factors.map((factor, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {(match.major_clients || match.recent_projects) && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">
                      {match.type === 'laboratory' ? 'Principais Clientes' : 'Projetos Recentes'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(match.major_clients || match.recent_projects || []).map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border">
          <h4 className="font-medium text-indigo-900 mb-3 flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Tecnologia de IA Avançada - Como funciona na versão real:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="text-sm text-indigo-800 space-y-2">
              <li>• <strong>Machine Learning:</strong> Algoritmos proprietários com aprendizado contínuo</li>
              <li>• <strong>Semantic Matching:</strong> Análise semântica de compatibilidade técnica</li>
              <li>• <strong>Market Intelligence:</strong> Análise de tendências e oportunidades de mercado</li>
              <li>• <strong>Risk Assessment:</strong> Avaliação automática de riscos de parceria</li>
            </ul>
            <ul className="text-sm text-indigo-800 space-y-2">
              <li>• <strong>Performance Tracking:</strong> Métricas de sucesso em tempo real</li>
              <li>• <strong>Predictive Analytics:</strong> Previsões de demanda e oportunidades</li>
              <li>• <strong>Compliance Monitoring:</strong> Verificação automática de certificações</li>
              <li>• <strong>ROI Optimization:</strong> Maximização do retorno sobre investimento</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoAIMatchingEngine;
