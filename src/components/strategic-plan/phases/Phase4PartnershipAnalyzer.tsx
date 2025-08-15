
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  Target, 
  Award,
  Globe,
  Handshake,
  BarChart3,
  CheckCircle2
} from 'lucide-react';

interface Partnership {
  id: string;
  partner_name: string;
  partnership_type: 'strategic' | 'operational' | 'research' | 'commercial';
  status: 'active' | 'negotiating' | 'completed' | 'paused';
  gomes_casseres_score: number;
  complementarity_index: number;
  reciprocity_score: number;
  governance_flexibility: number;
  trust_level: number;
  innovation_potential: number;
  sustainability_score: number;
  start_date: string;
  key_benefits: string[];
  risk_factors: string[];
  value_created: number;
}

interface Phase4PartnershipAnalyzerProps {
  projectId?: string;
}

const Phase4PartnershipAnalyzer: React.FC<Phase4PartnershipAnalyzerProps> = ({ projectId }) => {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [analytics, setAnalytics] = useState<any>({});

  useEffect(() => {
    // Simulate partnership data
    const mockPartnerships: Partnership[] = [
      {
        id: '1',
        partner_name: 'BioTech Labs International',
        partnership_type: 'research',
        status: 'active',
        gomes_casseres_score: 89,
        complementarity_index: 0.92,
        reciprocity_score: 0.88,
        governance_flexibility: 0.85,
        trust_level: 0.91,
        innovation_potential: 0.94,
        sustainability_score: 0.87,
        start_date: '2024-01-15',
        key_benefits: ['Acesso a tecnologia exclusiva', 'Redução de custos P&D', 'Aceleração time-to-market'],
        risk_factors: ['Dependência tecnológica', 'Conflito de propriedade intelectual'],
        value_created: 2100000
      },
      {
        id: '2',
        partner_name: 'Global Pharma Solutions',
        partnership_type: 'commercial',
        status: 'active',
        gomes_casseres_score: 76,
        complementarity_index: 0.78,
        reciprocity_score: 0.82,
        governance_flexibility: 0.74,
        trust_level: 0.79,
        innovation_potential: 0.71,
        sustainability_score: 0.83,
        start_date: '2023-11-20',
        key_benefits: ['Expansão de mercado', 'Rede de distribuição', 'Expertise regulatória'],
        risk_factors: ['Concorrência interna', 'Diferenças culturais'],
        value_created: 1450000
      }
    ];

    const mockAnalytics = {
      total_partnerships: mockPartnerships.length,
      active_partnerships: mockPartnerships.filter(p => p.status === 'active').length,
      average_gc_score: Math.round(mockPartnerships.reduce((sum, p) => sum + p.gomes_casseres_score, 0) / mockPartnerships.length),
      total_value_created: mockPartnerships.reduce((sum, p) => sum + p.value_created, 0),
      performance_by_law: {
        complementarity: Math.round(mockPartnerships.reduce((sum, p) => sum + p.complementarity_index, 0) / mockPartnerships.length * 100),
        reciprocity: Math.round(mockPartnerships.reduce((sum, p) => sum + p.reciprocity_score, 0) / mockPartnerships.length * 100),
        governance: Math.round(mockPartnerships.reduce((sum, p) => sum + p.governance_flexibility, 0) / mockPartnerships.length * 100),
        trust: Math.round(mockPartnerships.reduce((sum, p) => sum + p.trust_level, 0) / mockPartnerships.length * 100),
        innovation: Math.round(mockPartnerships.reduce((sum, p) => sum + p.innovation_potential, 0) / mockPartnerships.length * 100),
        sustainability: Math.round(mockPartnerships.reduce((sum, p) => sum + p.sustainability_score, 0) / mockPartnerships.length * 100)
      }
    };

    setPartnerships(mockPartnerships);
    setAnalytics(mockAnalytics);
  }, [projectId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'negotiating': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strategic': return 'text-purple-600 bg-purple-100';
      case 'operational': return 'text-blue-600 bg-blue-100';
      case 'research': return 'text-orange-600 bg-orange-100';
      case 'commercial': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Handshake className="h-5 w-5 text-blue-500" />
            <span>Analisador de Parcerias Estratégicas</span>
          </h3>
          <p className="text-gray-600 mt-1">
            Análise baseada nas Leis de Gomes-Casseres para parcerias de alto desempenho
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{analytics.average_gc_score}%</div>
          <div className="text-sm text-gray-600">Score Médio G-C</div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="partnerships">Parcerias</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{analytics.total_partnerships}</div>
                <div className="text-sm text-gray-600">Total de Parcerias</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{analytics.active_partnerships}</div>
                <div className="text-sm text-gray-600">Parcerias Ativas</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">{analytics.average_gc_score}%</div>
                <div className="text-sm text-gray-600">Score G-C Médio</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  R$ {(analytics.total_value_created / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600">Valor Criado</div>
              </CardContent>
            </Card>
          </div>

          {/* Performance by Law */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Performance por Lei de Gomes-Casseres</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(analytics.performance_by_law || {}).map(([law, score]) => (
                  <div key={law} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium capitalize">{law}</span>
                      <span className="text-sm font-medium">{score}%</span>
                    </div>
                    <Progress value={score as number} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partnerships" className="mt-6">
          <div className="space-y-6">
            {partnerships.map((partnership) => (
              <Card key={partnership.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-blue-500" />
                      <span>{partnership.partner_name}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getTypeColor(partnership.partnership_type)}>
                        {partnership.partnership_type}
                      </Badge>
                      <Badge className={getStatusColor(partnership.status)}>
                        {partnership.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Gomes-Casseres Score */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Score Gomes-Casseres</span>
                      <span className="font-bold text-blue-600">{partnership.gomes_casseres_score}%</span>
                    </div>
                    <Progress value={partnership.gomes_casseres_score} className="h-3" />
                  </div>

                  {/* Individual Scores */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {Math.round(partnership.complementarity_index * 100)}%
                      </div>
                      <div className="text-xs text-gray-600">Complementaridade</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {Math.round(partnership.reciprocity_score * 100)}%
                      </div>
                      <div className="text-xs text-gray-600">Reciprocidade</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {Math.round(partnership.trust_level * 100)}%
                      </div>
                      <div className="text-xs text-gray-600">Confiança</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">
                        {Math.round(partnership.innovation_potential * 100)}%
                      </div>
                      <div className="text-xs text-gray-600">Inovação</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">
                        {Math.round(partnership.governance_flexibility * 100)}%
                      </div>
                      <div className="text-xs text-gray-600">Governança</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-indigo-600">
                        {Math.round(partnership.sustainability_score * 100)}%
                      </div>
                      <div className="text-xs text-gray-600">Sustentabilidade</div>
                    </div>
                  </div>

                  {/* Benefits and Risks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Benefícios Chave</h4>
                      <ul className="space-y-1">
                        {partnership.key_benefits.map((benefit, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Fatores de Risco</h4>
                      <ul className="space-y-1">
                        {partnership.risk_factors.map((risk, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                            <Target className="h-3 w-3 text-red-500" />
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance by Law Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance por Lei</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(analytics.performance_by_law || {}).map(([law, score]) => (
                    <div key={law} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium capitalize">{law}</span>
                        <span className="text-sm font-medium">{score}%</span>
                      </div>
                      <Progress value={score as number} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Value Creation */}
            <Card>
              <CardHeader>
                <CardTitle>Criação de Valor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partnerships.map((partnership, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{partnership.partner_name}</div>
                        <div className="text-sm text-gray-600">{partnership.partnership_type}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          R$ {(partnership.value_created / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-sm text-gray-600">valor criado</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Phase4PartnershipAnalyzer;
