import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  Building2, 
  Award, 
  Shield,
  Download,
  Calendar,
  Eye,
  MessageCircle,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface BrazilianMetrics {
  pharmaconnect_performance: {
    total_connections: number;
    brazilian_companies: number;
    anvisa_certified_partners: number;
    successful_matches: number;
    total_projects: number;
    revenue_brl: number;
  };
  geographic_distribution: Array<{
    region: string;
    companies: number;
    matches: number;
    market_share: number;
  }>;
  sector_analysis: Array<{
    sector: string;
    companies: number;
    growth_rate: number;
    avg_project_value: number;
  }>;
  compliance_metrics: Array<{
    regulation: string;
    compliance_rate: number;
    partners_certified: number;
  }>;
  engagement_trends: Array<{
    month: string;
    profile_views: number;
    matches_generated: number;
    conversations_started: number;
    projects_completed: number;
  }>;
}

const BrazilianAnalytics = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<BrazilianMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  useEffect(() => {
    loadBrazilianMetrics();
  }, [selectedTimeframe]);

  const loadBrazilianMetrics = async () => {
    setLoading(true);
    try {
      // Simular dados analíticos brasileiros
      const mockMetrics: BrazilianMetrics = {
        pharmaconnect_performance: {
          total_connections: 2847,
          brazilian_companies: 156,
          anvisa_certified_partners: 89,
          successful_matches: 342,
          total_projects: 127,
          revenue_brl: 2456000
        },
        geographic_distribution: [
          { region: 'Sudeste', companies: 89, matches: 156, market_share: 57.1 },
          { region: 'Sul', companies: 34, matches: 89, market_share: 21.8 },
          { region: 'Nordeste', companies: 18, matches: 45, market_share: 11.5 },
          { region: 'Centro-Oeste', companies: 12, matches: 28, market_share: 7.7 },
          { region: 'Norte', companies: 3, matches: 24, market_share: 1.9 }
        ],
        sector_analysis: [
          { sector: 'Medicamentos Genéricos', companies: 45, growth_rate: 23.4, avg_project_value: 89000 },
          { sector: 'Fitoterapicos', companies: 28, growth_rate: 18.7, avg_project_value: 56000 },
          { sector: 'Biotecnologia', companies: 23, growth_rate: 31.2, avg_project_value: 156000 },
          { sector: 'Suplementos', companies: 34, growth_rate: 15.8, avg_project_value: 34000 },
          { sector: 'Cosméticos', companies: 19, growth_rate: 12.5, avg_project_value: 28000 },
          { sector: 'Veterinária', companies: 7, growth_rate: 19.3, avg_project_value: 67000 }
        ],
        compliance_metrics: [
          { regulation: 'RDC 166/2017', compliance_rate: 94.3, partners_certified: 84 },
          { regulation: 'RDC 843/2018', compliance_rate: 87.6, partners_certified: 78 },
          { regulation: 'LGPD', compliance_rate: 98.1, partners_certified: 87 },
          { regulation: 'RDC 200/2017', compliance_rate: 91.2, partners_certified: 81 }
        ],
        engagement_trends: [
          { month: 'Jan', profile_views: 1240, matches_generated: 89, conversations_started: 156, projects_completed: 23 },
          { month: 'Fev', profile_views: 1456, matches_generated: 94, conversations_started: 178, projects_completed: 28 },
          { month: 'Mar', profile_views: 1689, matches_generated: 102, conversations_started: 203, projects_completed: 34 },
          { month: 'Abr', profile_views: 1834, matches_generated: 118, conversations_started: 234, projects_completed: 41 },
          { month: 'Mai', profile_views: 2123, matches_generated: 134, conversations_started: 267, projects_completed: 45 },
          { month: 'Jun', profile_views: 2456, matches_generated: 145, conversations_started: 289, projects_completed: 52 }
        ]
      };

      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
      toast({
        title: "Erro ao carregar analytics",
        description: "Não foi possível carregar as métricas brasileiras",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const exportAnalytics = async () => {
    toast({
      title: "Exportando relatório",
      description: "Seu relatório de analytics brasileiro está sendo preparado",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-l-green-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <BarChart className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <span>Analytics PharmaConnect Brasil</span>
                  <div className="w-6 h-4 bg-green-500 rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1/3 bg-green-500"></div>
                    <div className="absolute top-1/3 left-0 w-full h-1/3 bg-yellow-400"></div>
                    <div className="absolute top-2/3 left-0 w-full h-1/3 bg-blue-600"></div>
                  </div>
                </CardTitle>
                <p className="text-gray-600">Performance da plataforma no mercado farmacêutico brasileiro</p>
              </div>
            </div>
            <Button onClick={exportAnalytics} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Empresas Brasileiras</p>
                <p className="text-3xl font-bold">{formatNumber(metrics.pharmaconnect_performance.brazilian_companies)}</p>
                <p className="text-green-100 text-sm">+23% este mês</p>
              </div>
              <Building2 className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Matches Realizados</p>
                <p className="text-3xl font-bold">{formatNumber(metrics.pharmaconnect_performance.successful_matches)}</p>
                <p className="text-blue-100 text-sm">+18% este mês</p>
              </div>
              <Users className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Certificados ANVISA</p>
                <p className="text-3xl font-bold">{formatNumber(metrics.pharmaconnect_performance.anvisa_certified_partners)}</p>
                <p className="text-yellow-100 text-sm">94% do total</p>
              </div>
              <Award className="h-12 w-12 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Receita Nacional</p>
                <p className="text-3xl font-bold">{formatCurrency(metrics.pharmaconnect_performance.revenue_brl)}</p>
                <p className="text-purple-100 text-sm">+34% este trimestre</p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="geographic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="geographic">Distribuição Geográfica</TabsTrigger>
          <TabsTrigger value="sectors">Análise Setorial</TabsTrigger>
          <TabsTrigger value="compliance">Conformidade</TabsTrigger>
          <TabsTrigger value="engagement">Engajamento</TabsTrigger>
        </TabsList>

        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Distribuição por Regiões do Brasil</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.geographic_distribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="companies" fill="#10B981" name="Empresas" />
                    <Bar dataKey="matches" fill="#3B82F6" name="Matches" />
                  </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={metrics.geographic_distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ region, market_share }) => `${region}: ${market_share}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="market_share"
                    >
                      {metrics.geographic_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
                {metrics.geographic_distribution.map((region, index) => (
                  <Card key={region.region} className="bg-gray-50">
                    <CardContent className="p-4 text-center">
                      <h4 className="font-semibold text-gray-900">{region.region}</h4>
                      <p className="text-2xl font-bold text-blue-600">{region.companies}</p>
                      <p className="text-sm text-gray-600">empresas</p>
                      <Badge className="mt-2 bg-green-100 text-green-800">
                        {region.market_share}% do mercado
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise por Setores Farmacêuticos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={metrics.sector_analysis} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="sector" type="category" width={150} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'avg_project_value') {
                        return [formatCurrency(value as number), 'Valor Médio de Projeto'];
                      }
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="companies" fill="#10B981" name="Empresas" />
                  <Bar dataKey="growth_rate" fill="#3B82F6" name="Taxa de Crescimento %" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {metrics.sector_analysis.map((sector, index) => (
                  <Card key={sector.sector} className="bg-gradient-to-br from-blue-50 to-green-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{sector.sector}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Empresas:</span>
                          <span className="font-medium">{sector.companies}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Crescimento:</span>
                          <Badge className="bg-green-100 text-green-800">
                            +{sector.growth_rate}%
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Valor Médio:</span>
                          <span className="font-medium">{formatCurrency(sector.avg_project_value)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Conformidade Regulatória Brasileira</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {metrics.compliance_metrics.map((regulation, index) => (
                  <div key={regulation.regulation} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${
                          regulation.compliance_rate >= 95 ? 'bg-green-500' :
                          regulation.compliance_rate >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="font-medium">{regulation.regulation}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={
                          regulation.compliance_rate >= 95 ? 'bg-green-100 text-green-800' :
                          regulation.compliance_rate >= 85 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {regulation.compliance_rate}%
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {regulation.partners_certified} parceiros certificados
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          regulation.compliance_rate >= 95 ? 'bg-green-500' :
                          regulation.compliance_rate >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${regulation.compliance_rate}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Status Geral de Conformidade</span>
                </div>
                <p className="text-blue-800 text-sm">
                  A PharmaConnect Brasil mantém {' '}
                  <span className="font-bold">98.1% de conformidade geral</span> com todas as 
                  regulamentações brasileiras, garantindo que todos os parceiros da plataforma 
                  operem dentro dos padrões ANVISA e LGPD.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trends de Engajamento na Plataforma</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={metrics.engagement_trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="profile_views" 
                    stackId="1" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.6}
                    name="Visualizações de Perfil"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="matches_generated" 
                    stackId="2" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.6}
                    name="Matches Gerados"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="conversations_started" 
                    stackId="3" 
                    stroke="#F59E0B" 
                    fill="#F59E0B" 
                    fillOpacity={0.6}
                    name="Conversas Iniciadas"
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-green-50">
                  <CardContent className="p-4 text-center">
                    <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-700">
                      {formatNumber(metrics.engagement_trends[metrics.engagement_trends.length - 1].profile_views)}
                    </p>
                    <p className="text-sm text-green-600">Visualizações (Jun)</p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-700">
                      {formatNumber(metrics.engagement_trends[metrics.engagement_trends.length - 1].matches_generated)}
                    </p>
                    <p className="text-sm text-blue-600">Matches (Jun)</p>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50">
                  <CardContent className="p-4 text-center">
                    <MessageCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-700">
                      {formatNumber(metrics.engagement_trends[metrics.engagement_trends.length - 1].conversations_started)}
                    </p>
                    <p className="text-sm text-yellow-600">Conversas (Jun)</p>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-700">
                      {formatNumber(metrics.engagement_trends[metrics.engagement_trends.length - 1].projects_completed)}
                    </p>
                    <p className="text-sm text-purple-600">Projetos (Jun)</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrazilianAnalytics;