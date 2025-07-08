import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  MapPin, 
  Star, 
  CheckCircle, 
  Filter,
  TrendingUp,
  Users,
  Building2,
  FlaskConical,
  Award,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BrazilianMatch {
  id: string;
  provider: {
    id: string;
    name: string;
    type: 'laboratory' | 'consultant' | 'company';
    location: {
      city: string;
      state: string;
      region: string;
    };
    specialties: string[];
    anvisa_certified: boolean;
    lgpd_compliant: boolean;
    rating: number;
    completedProjects: number;
  };
  compatibility: {
    score: number;
    factors: Array<{
      category: string;
      description: string;
      weight: number;
    }>;
    brazilian_specific: Array<{
      regulation: string;
      compliance_level: string;
    }>;
  };
  recommended_actions: string[];
  estimated_timeline: string;
  cost_estimate?: {
    min: number;
    max: number;
    currency: 'BRL';
  };
}

const BrazilianAIMatching = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState<BrazilianMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    region: 'all',
    service_type: 'all',
    anvisa_required: false,
    budget_range: 'all',
    timeline: 'all'
  });

  const brazilianRegions = [
    { value: 'all', label: 'Todas as Regiões' },
    { value: 'sudeste', label: 'Sudeste (SP, RJ, MG, ES)' },
    { value: 'sul', label: 'Sul (RS, SC, PR)' },
    { value: 'nordeste', label: 'Nordeste' },
    { value: 'centro-oeste', label: 'Centro-Oeste' },
    { value: 'norte', label: 'Norte' }
  ];

  const serviceTypes = [
    { value: 'all', label: 'Todos os Serviços' },
    { value: 'laboratory_analysis', label: 'Análises Laboratoriais' },
    { value: 'anvisa_consulting', label: 'Consultoria ANVISA' },
    { value: 'regulatory_affairs', label: 'Assuntos Regulatórios' },
    { value: 'quality_control', label: 'Controle de Qualidade' },
    { value: 'clinical_research', label: 'Pesquisa Clínica' },
    { value: 'bioequivalence', label: 'Bioequivalência' },
    { value: 'stability_studies', label: 'Estudos de Estabilidade' }
  ];

  const generateBrazilianMatches = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      // Simulação de dados brasileiros específicos
      const mockMatches: BrazilianMatch[] = [
        {
          id: '1',
          provider: {
            id: 'lab-001',
            name: 'LabAnalyse Brasil',
            type: 'laboratory',
            location: {
              city: 'São Paulo',
              state: 'SP',
              region: 'Sudeste'
            },
            specialties: ['Microbiológica', 'Físico-Química', 'Bioequivalência'],
            anvisa_certified: true,
            lgpd_compliant: true,
            rating: 4.8,
            completedProjects: 156
          },
          compatibility: {
            score: 94,
            factors: [
              {
                category: 'Certificação ANVISA',
                description: 'Laboratório certificado para análises farmacêuticas',
                weight: 35
              },
              {
                category: 'Proximidade Geográfica',
                description: 'Localizado na mesma região (Sudeste)',
                weight: 25
              },
              {
                category: 'Experiência em Genéricos',
                description: 'Histórico comprovado em medicamentos genéricos',
                weight: 20
              },
              {
                category: 'Conformidade LGPD',
                description: 'Totalmente conforme com Lei Geral de Proteção de Dados',
                weight: 20
              }
            ],
            brazilian_specific: [
              {
                regulation: 'RDC 166/2017',
                compliance_level: 'Totalmente Conforme'
              },
              {
                regulation: 'RDC 843/2018',
                compliance_level: 'Certificado'
              }
            ]
          },
          recommended_actions: [
            'Agendar visita técnica presencial',
            'Solicitar certificados ANVISA atualizados',
            'Discutir cronograma de análises',
            'Negociar desconto por volume'
          ],
          estimated_timeline: '15-30 dias',
          cost_estimate: {
            min: 15000,
            max: 35000,
            currency: 'BRL'
          }
        },
        {
          id: '2',
          provider: {
            id: 'consultant-001',
            name: 'Dra. Maria Santos',
            type: 'consultant',
            location: {
              city: 'Rio de Janeiro',
              state: 'RJ',
              region: 'Sudeste'
            },
            specialties: ['Regulatório ANVISA', 'Registro de Medicamentos', 'RDC 166'],
            anvisa_certified: true,
            lgpd_compliant: true,
            rating: 4.9,
            completedProjects: 89
          },
          compatibility: {
            score: 91,
            factors: [
              {
                category: 'Especialização ANVISA',
                description: 'Expert em regulamentações farmacêuticas brasileiras',
                weight: 40
              },
              {
                category: 'Histórico de Aprovações',
                description: '95% de taxa de aprovação em registros ANVISA',
                weight: 30
              },
              {
                category: 'Disponibilidade Imediata',
                description: 'Pode iniciar projeto em até 7 dias',
                weight: 20
              },
              {
                category: 'Conhecimento Local',
                description: 'Profundo conhecimento do mercado brasileiro',
                weight: 10
              }
            ],
            brazilian_specific: [
              {
                regulation: 'Lei 6.360/76',
                compliance_level: 'Especialista'
              },
              {
                regulation: 'RDC 200/2017',
                compliance_level: 'Certificada'
              }
            ]
          },
          recommended_actions: [
            'Agendar reunião inicial online',
            'Revisar portfolio de aprovações ANVISA',
            'Definir escopo regulatório específico',
            'Estabelecer cronograma de entregas'
          ],
          estimated_timeline: '7-14 dias para início',
          cost_estimate: {
            min: 8000,
            max: 15000,
            currency: 'BRL'
          }
        },
        {
          id: '3',
          provider: {
            id: 'company-001',
            name: 'Instituto de Pesquisas Farmacêuticas do Brasil',
            type: 'company',
            location: {
              city: 'Campinas',
              state: 'SP',
              region: 'Sudeste'
            },
            specialties: ['Pesquisa Clínica', 'Desenvolvimento de Fármacos', 'Biotecnologia'],
            anvisa_certified: true,
            lgpd_compliant: true,
            rating: 4.7,
            completedProjects: 203
          },
          compatibility: {
            score: 87,
            factors: [
              {
                category: 'Infraestrutura Nacional',
                description: 'Laboratórios em múltiplas regiões do Brasil',
                weight: 30
              },
              {
                category: 'Parceria com Universidades',
                description: 'Convênios com USP, UNICAMP e outras instituições',
                weight: 25
              },
              {
                category: 'Experiência em P&D',
                description: 'Mais de 20 anos em pesquisa farmacêutica nacional',
                weight: 25
              },
              {
                category: 'Financiamento FINEP',
                description: 'Acesso a linhas de financiamento para inovação',
                weight: 20
              }
            ],
            brazilian_specific: [
              {
                regulation: 'Marco Legal de CT&I',
                compliance_level: 'Totalmente Aderente'
              },
              {
                regulation: 'Lei de Inovação',
                compliance_level: 'Certificado'
              }
            ]
          },
          recommended_actions: [
            'Apresentar projeto de P&D',
            'Explorar financiamentos FINEP/FAPESP',
            'Agendar visita aos laboratórios',
            'Discutir propriedade intelectual'
          ],
          estimated_timeline: '30-60 dias',
          cost_estimate: {
            min: 50000,
            max: 200000,
            currency: 'BRL'
          }
        }
      ];

      // Aplicar filtros brasileiros específicos
      let filteredMatches = mockMatches;
      
      if (filters.region !== 'all') {
        filteredMatches = filteredMatches.filter(match => 
          match.provider.location.region.toLowerCase() === filters.region
        );
      }

      if (filters.anvisa_required) {
        filteredMatches = filteredMatches.filter(match => 
          match.provider.anvisa_certified
        );
      }

      setMatches(filteredMatches);
      
      toast({
        title: "Matching Brasileiro Completo!",
        description: `${filteredMatches.length} parceiros brasileiros encontrados`,
      });
    } catch (error) {
      console.error('Erro no AI Matching Brasileiro:', error);
      toast({
        title: "Erro no Matching",
        description: "Falha ao executar matching brasileiro",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'laboratory': return <FlaskConical className="h-5 w-5" />;
      case 'consultant': return <Users className="h-5 w-5" />;
      case 'company': return <Building2 className="h-5 w-5" />;
      default: return <Building2 className="h-5 w-5" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-green-600';
    if (score >= 80) return 'from-blue-500 to-blue-600';
    if (score >= 70) return 'from-yellow-500 to-yellow-600';
    return 'from-gray-500 to-gray-600';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl text-gray-900">AI Matching Brasileiro</span>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-6 h-4 bg-green-500 rounded-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1/3 bg-green-500"></div>
                  <div className="absolute top-1/3 left-0 w-full h-1/3 bg-yellow-400"></div>
                  <div className="absolute top-2/3 left-0 w-full h-1/3 bg-blue-600"></div>
                </div>
                <span className="text-sm text-gray-600">
                  Especializado no mercado farmacêutico brasileiro
                </span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Filtros Brasileiros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros Brasileiros Específicos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Região do Brasil
              </label>
              <Select value={filters.region} onValueChange={(value) => 
                setFilters(prev => ({...prev, region: value}))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {brazilianRegions.map(region => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Tipo de Serviço
              </label>
              <Select value={filters.service_type} onValueChange={(value) => 
                setFilters(prev => ({...prev, service_type: value}))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map(service => (
                    <SelectItem key={service.value} value={service.value}>
                      {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Certificação ANVISA
              </label>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  checked={filters.anvisa_required}
                  onChange={(e) => setFilters(prev => ({
                    ...prev, 
                    anvisa_required: e.target.checked
                  }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Apenas certificados ANVISA</span>
              </div>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={generateBrazilianMatches} 
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              >
                {loading ? 'Processando...' : 'Buscar Parceiros Brasileiros'}
                <Zap className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {matches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Parceiros Brasileiros Encontrados ({matches.length})
            </h3>
            <Badge className="bg-green-100 text-green-800">
              <Globe className="h-3 w-3 mr-1" />
              Matching Nacional
            </Badge>
          </div>
          
          {matches.map((match) => (
            <Card key={match.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    {/* Score Badge */}
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getScoreColor(match.compatibility.score)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {match.compatibility.score}%
                    </div>
                    
                    {/* Provider Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          {getProviderIcon(match.provider.type)}
                          <h4 className="text-lg font-semibold">{match.provider.name}</h4>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {match.provider.anvisa_certified && (
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              <Award className="h-3 w-3 mr-1" />
                              ANVISA
                            </Badge>
                          )}
                          {match.provider.lgpd_compliant && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                              <Shield className="h-3 w-3 mr-1" />
                              LGPD
                            </Badge>
                          )}
                          <div className="w-6 h-4 bg-green-500 rounded-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1/3 bg-green-500"></div>
                            <div className="absolute top-1/3 left-0 w-full h-1/3 bg-yellow-400"></div>
                            <div className="absolute top-2/3 left-0 w-full h-1/3 bg-blue-600"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{match.provider.location.city}, {match.provider.location.state}</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {match.provider.location.region}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{match.provider.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{match.provider.completedProjects} projetos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Estimate */}
                  {match.cost_estimate && (
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Estimativa</div>
                      <div className="font-semibold text-lg">
                        {formatCurrency(match.cost_estimate.min)} - {formatCurrency(match.cost_estimate.max)}
                      </div>
                      <div className="text-sm text-gray-600">{match.estimated_timeline}</div>
                    </div>
                  )}
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {match.provider.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Compatibility Factors */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Fatores de Compatibilidade:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {match.compatibility.factors.map((factor, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <div>
                          <span className="font-medium text-sm">{factor.category}</span>
                          <span className="text-xs text-gray-600 ml-2">({factor.weight}%)</span>
                          <p className="text-xs text-gray-600">{factor.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brazilian Specific Compliance */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Conformidade Regulatória Brasileira:</h5>
                  <div className="flex flex-wrap gap-2">
                    {match.compatibility.brazilian_specific.map((regulation, idx) => (
                      <Badge key={idx} className="bg-green-100 text-green-800">
                        <Shield className="h-3 w-3 mr-1" />
                        {regulation.regulation}: {regulation.compliance_level}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Recommended Actions */}
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Próximos Passos Recomendados:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {match.recommended_actions.map((action, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Users className="h-4 w-4 mr-2" />
                    Iniciar Conversa
                  </Button>
                  <Button variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Ver Portfólio
                  </Button>
                  <Button variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Agendar Visita
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {matches.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Pronto para encontrar parceiros brasileiros?
            </h3>
            <p className="text-gray-600 mb-4">
              Configure os filtros acima e clique em "Buscar Parceiros Brasileiros" para encontrar matches específicos para o mercado nacional
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
              <span>🇧🇷 Foco nacional</span>
              <span>•</span>
              <span>📋 Conformidade ANVISA</span>
              <span>•</span>
              <span>🔒 LGPD compliant</span>
              <span>•</span>
              <span>⚡ IA especializada</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BrazilianAIMatching;