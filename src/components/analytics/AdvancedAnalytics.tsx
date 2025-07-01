
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Activity, Target, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from 'react-day-picker';
import { useAuth } from '@/contexts/AuthContext';

interface AnalyticsData {
  userEngagement: Array<{ date: string; sessions: number; pageViews: number; }>;
  conversionFunnel: Array<{ stage: string; users: number; conversion: number; }>;
  revenueAnalysis: Array<{ month: string; revenue: number; transactions: number; }>;
  userSegments: Array<{ segment: string; users: number; value: number; }>;
}

const COLORS = ['#1565C0', '#0288D1', '#0277BD', '#01579B'];

const AdvancedAnalytics: React.FC = () => {
  const { profile } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    userEngagement: [],
    conversionFunnel: [],
    revenueAnalysis: [],
    userSegments: []
  });
  const [dateRange, setDateRange] = useState<string>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    
    try {
      // Simulação de dados analytics avançados
      const mockData: AnalyticsData = {
        userEngagement: [
          { date: '2024-01-01', sessions: 120, pageViews: 480 },
          { date: '2024-01-02', sessions: 135, pageViews: 520 },
          { date: '2024-01-03', sessions: 145, pageViews: 580 },
          { date: '2024-01-04', sessions: 160, pageViews: 640 },
          { date: '2024-01-05', sessions: 155, pageViews: 620 },
          { date: '2024-01-06', sessions: 170, pageViews: 680 },
          { date: '2024-01-07', sessions: 185, pageViews: 740 }
        ],
        conversionFunnel: [
          { stage: 'Visitantes', users: 1000, conversion: 100 },
          { stage: 'Cadastros', users: 450, conversion: 45 },
          { stage: 'Ativações', users: 320, conversion: 32 },
          { stage: 'Pagamentos', users: 95, conversion: 9.5 },
          { stage: 'Renovações', users: 78, conversion: 7.8 }
        ],
        revenueAnalysis: [
          { month: 'Jan', revenue: 25000, transactions: 85 },
          { month: 'Fev', revenue: 28000, transactions: 92 },
          { month: 'Mar', revenue: 32000, transactions: 105 },
          { month: 'Abr', revenue: 35000, transactions: 118 },
          { month: 'Mai', revenue: 38000, transactions: 125 },
          { month: 'Jun', revenue: 42000, transactions: 140 }
        ],
        userSegments: [
          { segment: 'Empresas', users: 450, value: 65 },
          { segment: 'Laboratórios', users: 320, value: 25 },
          { segment: 'Consultores', users: 180, value: 8 },
          { segment: 'Individuais', users: 250, value: 2 }
        ]
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Erro ao buscar dados de analytics:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1565C0]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Avançado</h2>
          <p className="text-gray-600">Insights detalhados sobre performance e engajamento</p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+15.2% vs período anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9.5%</div>
            <p className="text-xs text-muted-foreground">+2.1% vs período anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Sessão</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8m 42s</div>
            <p className="text-xs text-muted-foreground">+1.3% vs período anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LTV Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1,280</div>
            <p className="text-xs text-muted-foreground">+8.7% vs período anterior</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="engagement">Engajamento</TabsTrigger>
          <TabsTrigger value="conversion">Conversão</TabsTrigger>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="segments">Segmentos</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Engajamento de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.userEngagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sessions" stroke="#1565C0" strokeWidth={2} />
                  <Line type="monotone" dataKey="pageViews" stroke="#0288D1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion">
          <Card>
            <CardHeader>
              <CardTitle>Funil de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.conversionFunnel} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" />
                  <Tooltip />
                  <Bar dataKey="users" fill="#1565C0" />
                </BarChart>
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
                <BarChart data={analyticsData.revenueAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
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
                      data={analyticsData.userSegments}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ segment, value }) => `${segment}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.userSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-4">
                  {analyticsData.userSegments.map((segment, index) => (
                    <div key={segment.segment} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-medium">{segment.segment}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{segment.users} usuários</p>
                        <p className="text-sm text-gray-500">{segment.value}% do total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
