
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Users, TrendingUp, CheckCircle, XCircle, Zap, Target, BarChart3, Lightbulb, Globe, MapPin, Languages } from 'lucide-react';
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
  international_presence?: string[];
  regulatory_expertise?: string[];
  languages?: string[];
  speciality_areas?: string[];
  turnaround_time?: string;
}

interface MarketContext {
  active_scenario: string;
  global_market?: string;
  impact_level: string;
  key_opportunities: string[];
  technology_drivers?: string[];
  regulatory_trends?: string[];
}

const DemoAIMatchingEngine = () => {
  const { toast } = useToast();
  const [matches, setMatches] = useState<DemoMatch[]>([]);
  const [marketContext, setMarketContext] = useState<MarketContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('global_biosimilars');
  const [selectedSegment, setSelectedSegment] = useState<string>('biosimilars');
  const [selectedRegion, setSelectedRegion] = useState<string>('latam');

  const scenarios = [
    { value: 'global_biosimilars', label: 'Biosimilares Globais' },
    { value: 'advanced_therapies', label: 'Terapias Avançadas' },
    { value: 'personalized_medicine', label: 'Medicina Personalizada' },
    { value: 'emerging_markets', label: 'Mercados Emergentes' },
    { value: 'tech_transfer', label: 'Transferência Tecnológica' }
  ];

  const segments = [
    { value: 'biosimilars', label: 'Biosimilares', specialties: ['Anti-TNF', 'Biosimilares', 'Comparabilidade'] },
    { value: 'advanced_therapies', label: 'Terapias Avançadas', specialties: ['CAR-T', 'Terapia Gênica', 'Medicina Regenerativa'] },
    { value: 'oncology', label: 'Oncologia', specialties: ['Desenvolvimento Clínico', 'Oncologia', 'Medicina Personalizada'] },
    { value: 'vaccines', label: 'Vacinas', specialties: ['Desenvolvimento Vacinal', 'Manufatura Estéril', 'Cold Chain'] },
    { value: 'rare_diseases', label: 'Doenças Raras', specialties: ['Medicamentos Órfãos', 'Pediatria', 'Regulatório Especial'] },
    { value: 'sterile_manufacturing', label: 'Manufatura Estéril', specialties: ['Aseptic Processing', 'Injetáveis', 'Validação'] }
  ];

  const regions = [
    { value: 'latam', label: 'América Latina', countries: ['Brasil', 'México', 'Argentina', 'Colombia'] },
    { value: 'north_america', label: 'América do Norte', countries: ['EUA', 'Canadá'] },
    { value: 'europe', label: 'Europa', countries: ['Alemanha', 'França', 'Itália', 'Espanha'] },
    { value: 'asia_pacific', label: 'Ásia-Pacífico', countries: ['China', 'Japão', 'Coreia do Sul', 'Austrália'] },
    { value: 'global', label: 'Global', countries: ['Todos os Mercados'] }
  ];

  const generateAdvancedMatches = async () => {
    setLoading(true);
    
    try {
      const selectedSegmentData = segments.find(s => s.value === selectedSegment);
      const selectedRegionData = regions.find(r => r.value === selectedRegion);
      
      const result = await demoAPI.aiMatching('pharmaceutical_company', {
        location: selectedRegionData?.countries[0] || 'São Paulo',
        specialties: selectedSegmentData?.specialties || ['Análise Microbiológica'],
        budget: { min: 100000, max: 5000000 },
        scenario: selectedScenario,
        segment: selectedSegment,
        region: selectedRegion,
        regulatory: 'FDA'
      });
      
      if (result.success) {
        setMatches(result.matches);
        setMarketContext(result.market_context);
        
        toast({
          title: "🧠 AI Matching Global Completo!",
          description: `${result.matches.length} matches internacionais encontrados com ${result.processing_time} de processamento`,
        });
      }
    } catch (error) {
      console.error('Erro no Global AI Matching Demo:', error);
      toast({
        title: "Erro no AI Matching Global",
        description: "Não foi possível completar a demonstração internacional",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptMatch = (matchId: string) => {
    const matchData = matches.find(m => m.id === matchId);
    toast({
      title: "Match internacional aceito! 🌍",
      description: `Demo: ${matchData?.name} foi adicionado ao seu pipeline global de parcerias.`,
    });
    setMatches(prev => prev.filter(m => m.id !== matchId));
  };

  const rejectMatch = (matchId: string) => {
    toast({
      title: "Feedback global registrado",
      description: "Demo: Seu feedback está aprimorando nosso algoritmo de IA global.",
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
            <Globe className="h-5 w-5 text-green-600" />
            <span>AI Matching Engine Global</span>
            <DemoModeIndicator variant="badge" />
          </CardTitle>
        </div>
        <DemoModeIndicator variant="alert" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Cenário Global</label>
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
            <label className="text-sm font-medium text-gray-700 mb-2 block">Segmento</label>
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

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Região de Interesse</label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma região" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{region.label}</span>
                    </div>
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
                <Globe className="h-4 w-4" />
              )}
              <span>{loading ? 'Analisando Globalmente...' : 'Gerar Matches Globais'}</span>
            </Button>
          </div>
        </div>

        {marketContext && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Target className="h-4 w-4 mr-2 text-blue-600" />
              Contexto Global: {marketContext.active_scenario}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Badge variant="outline" className="mb-2 flex items-center space-x-1">
                  <BarChart3 className="h-3 w-3" />
                  <span>Impacto: {marketContext.impact_level}</span>
                </Badge>
                {marketContext.global_market && (
                  <p className="text-sm text-gray-600">Mercado: {marketContext.global_market}</p>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Oportunidades Estratégicas:</div>
                <ul className="text-xs text-gray-600 space-y-1">
                  {marketContext.key_opportunities.map((opp, idx) => (
                    <li key={idx} className="flex items-start space-x-1">
                      <Lightbulb className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                {(marketContext.technology_drivers || marketContext.regulatory_trends) && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Tendências Tecnológicas:</div>
                    <div className="flex flex-wrap gap-1">
                      {(marketContext.technology_drivers || []).map((tech, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {(marketContext.regulatory_trends || []).map((reg, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {reg}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {matches.length === 0 ? (
          <div className="text-center py-8">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Configure o cenário global, segmento e região desejados
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Simulações baseadas em parcerias reais globais e casos de sucesso internacionais
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <span>Matches Globais Encontrados ({matches.length})</span>
                <Globe className="h-5 w-5 text-blue-600" />
              </h3>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Zap className="h-3 w-3" />
                <span>Algoritmo Global v3.0</span>
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
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                        <span>{match.name}</span>
                        {match.international_presence && match.international_presence.length > 0 && (
                          <Globe className="h-4 w-4 text-green-600" />
                        )}
                      </h3>
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>Localização</span>
                    </h4>
                    <p className="text-sm text-gray-600">{match.location}</p>
                    {match.international_presence && match.international_presence.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-600">Presença Internacional:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {match.international_presence.slice(0, 3).map((country, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {country}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Especialidades</h4>
                    <div className="flex flex-wrap gap-1">
                      {match.specialties.slice(0, 3).map((spec, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                    {match.speciality_areas && match.speciality_areas.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {match.speciality_areas.slice(0, 2).map((area, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Regulatório & Certificações</h4>
                    {match.regulatory_expertise && match.regulatory_expertise.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {match.regulatory_expertise.slice(0, 4).map((reg, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-blue-50">
                            {reg}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 space-y-1">
                        {match.capacity && <div>Capacidade: {match.capacity}</div>}
                        {match.annual_revenue && <div>Receita: {match.annual_revenue}</div>}
                        {match.hourly_rate && <div>Taxa: R$ {match.hourly_rate}/hora</div>}
                        {match.success_rate && <div>Taxa Sucesso: {match.success_rate}</div>}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center space-x-1">
                      <Languages className="h-4 w-4" />
                      <span>Idiomas & Extras</span>
                    </h4>
                    {match.languages && match.languages.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {match.languages.map((lang, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                    {match.turnaround_time && (
                      <p className="text-xs text-gray-600">Prazo: {match.turnaround_time}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Fatores de Compatibilidade Global</h4>
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
                      {match.type === 'laboratory' ? 'Principais Clientes Globais' : 'Projetos Internacionais Recentes'}
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
            <Globe className="h-5 w-5 mr-2" />
            Algoritmo Global de IA - Recursos Avançados:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="text-sm text-indigo-800 space-y-2">
              <li>• <strong>Multi-Regional Intelligence:</strong> Análise de 45+ mercados globais simultaneamente</li>
              <li>• <strong>Regulatory Harmonization:</strong> Mapeamento automático de requisitos ICH/FDA/EMA</li>
              <li>• <strong>Cultural Compatibility:</strong> Análise de fatores culturais e de negócios</li>
              <li>• <strong>Technology Transfer Analysis:</strong> Avaliação de viabilidade de transferência</li>
            </ul>
            <ul className="text-sm text-indigo-800 space-y-2">
              <li>• <strong>Supply Chain Optimization:</strong> Análise de cadeias globais de suprimento</li>
              <li>• <strong>IP Landscape Mapping:</strong> Mapeamento de propriedade intelectual</li>
              <li>• <strong>Market Entry Strategy:</strong> Recomendações de entrada em novos mercados</li>
              <li>• <strong>Partnership Risk Assessment:</strong> Análise de riscos geopolíticos e comerciais</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoAIMatchingEngine;
