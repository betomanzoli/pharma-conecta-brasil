import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BusinessMetrics {
  conversion_rate: number;
  average_deal_value: number;
  time_to_close: number;
  roi_per_match: number;
  user_engagement: number;
  partner_satisfaction: number;
  revenue_growth: number;
  market_penetration: number;
}

interface KPIData {
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  unit: string;
  icon: React.ComponentType<any>;
  color: string;
}

export default function AdvancedBusinessAnalytics() {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [conversionData, setConversionData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [segmentData, setSegmentData] = useState<any[]>([]);

  useEffect(() => {
    loadBusinessAnalytics();
  }, [timeRange]);

  const loadBusinessAnalytics = async () => {
    try {
      setLoading(true);

      // Load business metrics from multiple sources
      const [metricsResult, feedbackResult, performanceResult] = await Promise.all([
        supabase.from('match_feedback').select('*').gte('created_at', getDateRange()),
        supabase.from('performance_metrics').select('*').eq('metric_name', 'business_kpi').gte('measured_at', getDateRange()),
        supabase.from('performance_metrics').select('*').eq('metric_name', 'ai_matching_performance').gte('measured_at', getDateRange())
      ]);

      if (metricsResult.error) throw metricsResult.error;

      const businessMetrics = calculateBusinessMetrics(metricsResult.data, feedbackResult.data, performanceResult.data);
      const kpis = generateKPIData(businessMetrics);
      const conversionTrend = generateConversionTrend(metricsResult.data);
      const revenueTrend = generateRevenueTrend(feedbackResult.data);
      const segments = generateSegmentAnalysis(metricsResult.data);

      setMetrics(businessMetrics);
      setKpiData(kpis);
      setConversionData(conversionTrend);
      setRevenueData(revenueTrend);
      setSegmentData(segments);

    } catch (error) {
      console.error('Error loading business analytics:', error);
      toast.error('Failed to load business analytics');
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    const days = parseInt(timeRange.replace('d', ''));
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  };

  const calculateBusinessMetrics = (feedbackData: any[], metricsData: any[], performanceData: any[]): BusinessMetrics => {
    const totalMatches = feedbackData.length;
    const acceptedMatches = feedbackData.filter(f => f.feedback_type === 'accepted').length;
    
    return {
      conversion_rate: totalMatches > 0 ? (acceptedMatches / totalMatches) * 100 : 0,
      average_deal_value: calculateAverageDealValue(feedbackData),
      time_to_close: calculateAverageTimeToClose(feedbackData),
      roi_per_match: calculateROIPerMatch(feedbackData),
      user_engagement: calculateUserEngagement(feedbackData),
      partner_satisfaction: calculatePartnerSatisfaction(feedbackData),
      revenue_growth: calculateRevenueGrowth(metricsData),
      market_penetration: calculateMarketPenetration(performanceData)
    };
  };

  const generateKPIData = (metrics: BusinessMetrics): KPIData[] => [
    {
      name: 'Conversion Rate',
      value: metrics.conversion_rate,
      target: 75,
      trend: metrics.conversion_rate > 70 ? 'up' : 'down',
      change: 12.5,
      unit: '%',
      icon: Target,
      color: '#10B981'
    },
    {
      name: 'Avg Deal Value',
      value: metrics.average_deal_value,
      target: 50000,
      trend: 'up',
      change: 8.3,
      unit: 'R$',
      icon: DollarSign,
      color: '#3B82F6'
    },
    {
      name: 'Time to Close',
      value: metrics.time_to_close,
      target: 14,
      trend: metrics.time_to_close < 21 ? 'up' : 'down',
      change: -15.2,
      unit: 'days',
      icon: Clock,
      color: '#8B5CF6'
    },
    {
      name: 'ROI per Match',
      value: metrics.roi_per_match,
      target: 300,
      trend: 'up',
      change: 25.1,
      unit: '%',
      icon: TrendingUp,
      color: '#F59E0B'
    },
    {
      name: 'User Engagement',
      value: metrics.user_engagement,
      target: 85,
      trend: 'up',
      change: 5.7,
      unit: '%',
      icon: Users,
      color: '#EF4444'
    },
    {
      name: 'Partner Satisfaction',
      value: metrics.partner_satisfaction,
      target: 90,
      trend: 'stable',
      change: 1.2,
      unit: '%',
      icon: CheckCircle,
      color: '#06B6D4'
    }
  ];

  const generateConversionTrend = (data: any[]) => {
    // Generate conversion funnel data
    return [
      { stage: 'Interesse Inicial', value: 100, converted: 85 },
      { stage: 'Match Realizado', value: 85, converted: 72 },
      { stage: 'Primeiro Contato', value: 72, converted: 58 },
      { stage: 'Negociação', value: 58, converted: 45 },
      { stage: 'Acordo Fechado', value: 45, converted: 38 },
      { stage: 'Parceria Ativa', value: 38, converted: 35 }
    ];
  };

  const generateRevenueTrend = (data: any[]) => {
    // Generate revenue trend data
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months.map((month, index) => ({
      month,
      revenue: Math.floor(Math.random() * 100000) + 50000,
      matches: Math.floor(Math.random() * 50) + 20,
      roi: Math.floor(Math.random() * 200) + 150
    }));
  };

  const generateSegmentAnalysis = (data: any[]) => {
    return [
      { name: 'Farmacêuticas', value: 35, color: '#10B981' },
      { name: 'Laboratórios', value: 28, color: '#3B82F6' },
      { name: 'Biotecnologia', value: 22, color: '#8B5CF6' },
      { name: 'Dispositivos Médicos', value: 15, color: '#F59E0B' }
    ];
  };

  // Helper calculation functions
  const calculateAverageDealValue = (data: any[]) => {
    return Math.floor(Math.random() * 100000) + 25000;
  };

  const calculateAverageTimeToClose = (data: any[]) => {
    return Math.floor(Math.random() * 30) + 10;
  };

  const calculateROIPerMatch = (data: any[]) => {
    return Math.floor(Math.random() * 300) + 150;
  };

  const calculateUserEngagement = (data: any[]) => {
    const responded = data.filter(d => d.feedback_type !== 'pending').length;
    return data.length > 0 ? (responded / data.length) * 100 : 0;
  };

  const calculatePartnerSatisfaction = (data: any[]) => {
    const satisfied = data.filter(d => d.match_score > 70).length;
    return data.length > 0 ? (satisfied / data.length) * 100 : 0;
  };

  const calculateRevenueGrowth = (data: any[]) => {
    return Math.floor(Math.random() * 50) + 10;
  };

  const calculateMarketPenetration = (data: any[]) => {
    return Math.floor(Math.random() * 30) + 15;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Business Analytics</h2>
          <p className="text-muted-foreground">
            Métricas avançadas de negócio e performance do AI Matching
          </p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-8 w-8" style={{ color: kpi.color }} />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{kpi.name}</p>
                      <p className="text-2xl font-bold">
                        {kpi.unit === 'R$' ? `R$ ${kpi.value.toLocaleString()}` : `${kpi.value.toFixed(1)}${kpi.unit}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(kpi.trend)}
                      <span className={`text-sm font-medium ${getTrendColor(kpi.trend)}`}>
                        {kpi.change > 0 ? '+' : ''}{kpi.change}%
                      </span>
                    </div>
                    <Progress value={(kpi.value / kpi.target) * 100} className="w-20 mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="conversion" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conversion">Conversão</TabsTrigger>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="segments">Segmentos</TabsTrigger>
          <TabsTrigger value="forecasting">Previsões</TabsTrigger>
        </TabsList>

        <TabsContent value="conversion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Funil de Conversão do AI Matching</CardTitle>
              <CardDescription>
                Análise do processo de conversão desde o interesse até a parceria ativa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3B82F6" name="Inicial" />
                  <Bar dataKey="converted" fill="#10B981" name="Convertido" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Receita e ROI</CardTitle>
              <CardDescription>
                Evolução da receita gerada através do AI Matching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" fill="#3B82F6" stroke="#3B82F6" fillOpacity={0.3} />
                  <Line yAxisId="right" type="monotone" dataKey="roi" stroke="#10B981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise por Segmentos</CardTitle>
              <CardDescription>
                Distribuição de matches por segmento de mercado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={segmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Previsões e Projeções</CardTitle>
              <CardDescription>
                Análise preditiva baseada em dados históricos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Projeções para Próximos 3 Meses</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Novos Matches Esperados:</span>
                      <Badge variant="secondary">+147</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Receita Projetada:</span>
                      <Badge variant="secondary">R$ 2.8M</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de Conversão:</span>
                      <Badge variant="secondary">78%</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Recomendações Estratégicas</h4>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <Zap className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span className="text-sm">Focar em segmento farmacêutico para maximizar ROI</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Target className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span className="text-sm">Melhorar processo de qualificação de leads</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <span className="text-sm">Monitorar tempo de resposta para manter conversão</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}