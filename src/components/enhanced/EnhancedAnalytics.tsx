
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Building, 
  FlaskConical, 
  Download,
  Calendar,
  Target,
  DollarSign
} from 'lucide-react';

const EnhancedAnalytics = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(false);

  // Dados simulados para demonstração
  const connectionData = [
    { month: 'Jan', connections: 45, successful: 38 },
    { month: 'Fev', connections: 52, successful: 44 },
    { month: 'Mar', connections: 48, successful: 41 },
    { month: 'Abr', connections: 61, successful: 55 },
    { month: 'Mai', connections: 58, successful: 52 },
    { month: 'Jun', connections: 67, successful: 61 }
  ];

  const projectData = [
    { category: 'Análises Laboratoriais', value: 35, color: '#3B82F6' },
    { category: 'Consultoria Regulatória', value: 28, color: '#10B981' },
    { category: 'Desenvolvimento', value: 22, color: '#F59E0B' },
    { category: 'Validação', value: 15, color: '#EF4444' }
  ];

  const roiData = [
    { project: 'Análise Estabilidade', roi: 23.5, investment: 25000 },
    { project: 'Consultoria ANVISA', roi: 18.2, investment: 80000 },
    { project: 'Validação Métodos', roi: 31.8, investment: 45000 },
    { project: 'Desenvolvimento Formulação', roi: 26.4, investment: 65000 }
  ];

  const kpiData = [
    {
      title: 'Taxa de Sucesso de Conexões',
      value: '87.3%',
      change: '+5.2%',
      trend: 'up',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Projetos Concluídos',
      value: '234',
      change: '+12.8%',
      trend: 'up',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      title: 'ROI Médio',
      value: '24.9%',
      change: '+3.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-purple-600'
    },
    {
      title: 'Tempo Médio de Projeto',
      value: '45 dias',
      change: '-8.5%',
      trend: 'down',
      icon: Calendar,
      color: 'text-orange-600'
    }
  ];

  const handleExportData = () => {
    // Simular export de dados
    const csvData = connectionData.map(item => 
      `${item.month},${item.connections},${item.successful}`
    ).join('\n');
    
    const blob = new Blob([`Mês,Conexões,Sucessos\n${csvData}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Avançado
          </h1>
          <p className="text-gray-600">
            Insights detalhados sobre performance e tendências da plataforma
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Dados
          </Button>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <IconComponent className={`h-8 w-8 ${kpi.color}`} />
                  <Badge 
                    variant={kpi.trend === 'up' ? 'default' : 'secondary'}
                    className={kpi.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  >
                    {kpi.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {kpi.value}
                </div>
                <div className="text-sm text-gray-600">
                  {kpi.title}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conexões ao Longo do Tempo */}
        <Card>
          <CardHeader>
            <CardTitle>Conexões ao Longo do Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={connectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="connections" 
                  stroke="#3B82F6" 
                  name="Total de Conexões"
                  strokeWidth={3}
                />
                <Line 
                  type="monotone" 
                  dataKey="successful" 
                  stroke="#10B981" 
                  name="Conexões Bem-sucedidas"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Projetos */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Projetos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ROI Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Análise de ROI por Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={roiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="project" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'roi' ? `${value}%` : `R$ ${value.toLocaleString()}`,
                  name === 'roi' ? 'ROI' : 'Investimento'
                ]}
              />
              <Legend />
              <Bar dataKey="roi" fill="#8B5CF6" name="ROI (%)" />
              <Bar dataKey="investment" fill="#06B6D4" name="Investimento (R$)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas Detalhadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Métrica</th>
                  <th className="text-left p-2">Valor Atual</th>
                  <th className="text-left p-2">Período Anterior</th>
                  <th className="text-left p-2">Variação</th>
                  <th className="text-left p-2">Tendência</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Usuários Ativos Mensais</td>
                  <td className="p-2 font-semibold">2,847</td>
                  <td className="p-2">2,471</td>
                  <td className="p-2 text-green-600">+15.2%</td>
                  <td className="p-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Taxa de Conversão</td>
                  <td className="p-2 font-semibold">12.8%</td>
                  <td className="p-2">11.4%</td>
                  <td className="p-2 text-green-600">+1.4%</td>
                  <td className="p-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Tempo Médio na Plataforma</td>
                  <td className="p-2 font-semibold">23 min</td>
                  <td className="p-2">19 min</td>
                  <td className="p-2 text-green-600">+21.1%</td>
                  <td className="p-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </td>
                </tr>
                <tr>
                  <td className="p-2">Avaliação Média</td>
                  <td className="p-2 font-semibold">4.7/5</td>
                  <td className="p-2">4.5/5</td>
                  <td className="p-2 text-green-600">+4.4%</td>
                  <td className="p-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAnalytics;
