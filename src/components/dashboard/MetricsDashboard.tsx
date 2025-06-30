import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Target, 
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const MetricsDashboard = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de métricas em tempo real
    const fetchMetrics = () => {
      const mockMetrics = {
        overview: {
          total_matches: 1247,
          successful_partnerships: 89,
          revenue_generated: 2580000,
          active_companies: 456,
          growth_rate: 23.5,
          conversion_rate: 7.1
        },
        trends: {
          matches: [
            { month: 'Jan', value: 45 },
            { month: 'Fev', value: 52 },
            { month: 'Mar', value: 78 },
            { month: 'Abr', value: 91 },
            { month: 'Mai', value: 67 },
            { month: 'Jun', value: 103 },
            { month: 'Jul', value: 125 },
          ],
          revenue: [
            { month: 'Jan', value: 180000 },
            { month: 'Fev', value: 220000 },
            { month: 'Mar', value: 285000 },
            { month: 'Abr', value: 350000 },
            { month: 'Mai', value: 290000 },
            { month: 'Jun', value: 420000 },
            { month: 'Jul', value: 580000 },
          ]
        },
        sectors: [
          { name: 'Genéricos', value: 35, color: '#0088FE' },
          { name: 'Biotecnologia', value: 28, color: '#00C49F' },
          { name: 'Medicamentos', value: 22, color: '#FFBB28' },
          { name: 'Equipamentos', value: 15, color: '#FF8042' }
        ],
        alerts: [
          { type: 'success', message: 'Sistema operando normalmente', count: 1 },
          { type: 'warning', message: 'Alertas regulatórios pendentes', count: 3 },
          { type: 'info', message: 'Novos matches disponíveis', count: 12 }
        ]
      };
      
      setMetrics(mockMetrics);
      setLoading(false);
    };

    fetchMetrics();
    
    // Atualizar métricas a cada 30 segundos (simulando real-time)
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Matches</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.overview.total_matches)}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{metrics.overview.growth_rate}% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parcerias Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.overview.successful_partnerships}</div>
            <div className="flex items-center text-xs text-blue-600">
              <Activity className="h-3 w-3 mr-1" />
              {metrics.overview.conversion_rate}% taxa de conversão
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Gerada</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.overview.revenue_generated)}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +42% vs trimestre anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(metrics.overview.active_companies)}</div>
            <div className="flex items-center text-xs text-blue-600">
              <Users className="h-3 w-3 mr-1" />
              12 novas esta semana
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matches Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="h-5 w-5 mr-2" />
              Evolução de Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={metrics.trends.matches}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#0088FE" strokeWidth={2} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Receita Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.trends.revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="value" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sector Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Distribuição por Setor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={metrics.sectors}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {metrics.sectors.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {metrics.sectors.map((sector: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }}></div>
                    <span className="text-sm">{sector.name}</span>
                  </div>
                  <span className="text-sm font-medium">{sector.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Taxa de Sucesso</span>
                <span className="text-sm font-medium">94%</span>
              </div>
              <Progress value={94} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Tempo de Resposta</span>
                <span className="text-sm font-medium">1.2s</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Satisfação</span>
                <span className="text-sm font-medium">4.8/5</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Uptime</span>
                <span className="text-sm font-medium">99.9%</span>
              </div>
              <Progress value={99.9} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.alerts.map((alert: any, index: number) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {alert.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                {alert.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                {alert.type === 'info' && <Clock className="h-5 w-5 text-blue-500" />}
                
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-gray-600">
                    {alert.count} {alert.count === 1 ? 'item' : 'itens'}
                  </p>
                </div>
                
                <Badge variant={
                  alert.type === 'success' ? 'default' : 
                  alert.type === 'warning' ? 'destructive' : 'secondary'
                }>
                  {alert.count}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MetricsDashboard;
