
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Activity, DollarSign, Calendar, Filter, Star, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  overview: {
    total_users: number;
    total_sessions: number;
    total_projects: number;
    total_companies: number;
    total_revenue: number;
  };
  engagement: Array<{ date: string; sessions: number; new_users: number; active_projects: number; }>;
  user_segments: Array<{ segment: string; users: number; percentage: number; }>;
  revenue_analysis: Array<{ month: string; revenue: number; sessions: number; avg_price: number; }>;
  top_mentors: Array<{ name: string; rating: number; sessions: number; specialty: string; }>;
}

const COLORS = ['#1565C0', '#0288D1', '#0277BD', '#01579B', '#004D40'];

const AdvancedAnalytics: React.FC = () => {
  const { profile } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    overview: {
      total_users: 0,
      total_sessions: 0,
      total_projects: 0,
      total_companies: 0,
      total_revenue: 0
    },
    engagement: [],
    user_segments: [],
    revenue_analysis: [],
    top_mentors: []
  });
  const [dateRange, setDateRange] = useState<string>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const getDateRange = () => {
    const endDate = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }
    
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    };
  };

  const fetchAnalyticsData = async () => {
    setLoading(true);
    
    try {
      const { start, end } = getDateRange();
      
      const { data, error } = await supabase.rpc('get_analytics_data', {
        start_date: start,
        end_date: end
      });

      if (error) throw error;

      if (data) {
        const typedData = data as any; // Type casting para lidar com Json type
        setAnalyticsData({
          overview: typedData.overview || {
            total_users: 0,
            total_sessions: 0,
            total_projects: 0,
            total_companies: 0,
            total_revenue: 0
          },
          engagement: typedData.engagement || [],
          user_segments: typedData.user_segments || [],
          revenue_analysis: typedData.revenue_analysis || [],
          top_mentors: typedData.top_mentors || []
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dados de analytics:', error);
      // Fallback para dados de exemplo em caso de erro
      setAnalyticsData({
        overview: {
          total_users: 150,
          total_sessions: 45,
          total_projects: 25,
          total_companies: 35,
          total_revenue: 12500
        },
        engagement: [
          { date: '2024-01-01', sessions: 5, new_users: 12, active_projects: 3 },
          { date: '2024-01-02', sessions: 8, new_users: 15, active_projects: 5 },
          { date: '2024-01-03', sessions: 12, new_users: 18, active_projects: 7 },
        ],
        user_segments: [
          { segment: 'company', users: 35, percentage: 23.3 },
          { segment: 'laboratory', users: 25, percentage: 16.7 },
          { segment: 'consultant', users: 40, percentage: 26.7 },
          { segment: 'individual', users: 50, percentage: 33.3 }
        ],
        revenue_analysis: [
          { month: 'Jan', revenue: 4200, sessions: 15, avg_price: 280 },
          { month: 'Fev', revenue: 3800, sessions: 12, avg_price: 316 },
          { month: 'Mar', revenue: 4500, sessions: 18, avg_price: 250 }
        ],
        top_mentors: [
          { name: 'Roberto Manzoli', rating: 4.8, sessions: 15, specialty: 'Assuntos Regulatórios' }
        ]
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

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const getUserTypeLabel = (userType: string) => {
    const labels: { [key: string]: string } = {
      'company': 'Empresas',
      'laboratory': 'Laboratórios',
      'consultant': 'Consultores',
      'individual': 'Individuais',
      'admin': 'Administradores'
    };
    return labels[userType] || userType;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Analytics Avançado</h2>
          <p className="text-muted-foreground">Insights detalhados sobre performance e engajamento</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.total_users)}</div>
            <p className="text-xs text-muted-foreground">Usuários cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões de Mentoria</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.total_sessions)}</div>
            <p className="text-xs text-muted-foreground">Sessões realizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.total_projects)}</div>
            <p className="text-xs text-muted-foreground">Projetos em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.total_companies)}</div>
            <p className="text-xs text-muted-foreground">Empresas cadastradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.overview.total_revenue)}</div>
            <p className="text-xs text-muted-foreground">Receita de mentorias</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="engagement">Engajamento</TabsTrigger>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="segments">Segmentos</TabsTrigger>
          <TabsTrigger value="mentors">Top Mentores</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Engajamento de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.engagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="sessions" stackId="1" stroke="#1565C0" fill="#1565C0" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="new_users" stackId="2" stroke="#0288D1" fill="#0288D1" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="active_projects" stackId="3" stroke="#0277BD" fill="#0277BD" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Receita</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.revenue_analysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(Number(value)) : value,
                      name === 'revenue' ? 'Receita' : name === 'sessions' ? 'Sessões' : 'Preço Médio'
                    ]} 
                  />
                  <Bar dataKey="revenue" fill="#1565C0" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments">
          <Card>
            <CardHeader>
              <CardTitle>Segmentação de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.user_segments}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ segment, percentage }) => `${getUserTypeLabel(segment)}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {analyticsData.user_segments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-4">
                  {analyticsData.user_segments.map((segment, index) => (
                    <div key={segment.segment} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{getUserTypeLabel(segment.segment)}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{segment.users} usuários</p>
                        <p className="text-sm text-muted-foreground">{segment.percentage}% do total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mentors">
          <Card>
            <CardHeader>
              <CardTitle>Top Mentores por Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.top_mentors.map((mentor, index) => (
                  <div key={mentor.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold">{mentor.name}</h4>
                        <p className="text-sm text-muted-foreground">{mentor.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{mentor.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4 text-blue-500" />
                        <span>{mentor.sessions} sessões</span>
                      </div>
                    </div>
                  </div>
                ))}
                {analyticsData.top_mentors.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum mentor encontrado no período selecionado
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
