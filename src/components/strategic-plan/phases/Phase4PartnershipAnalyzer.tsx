import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Shield, 
  Globe, 
  BookOpen,
  AlertTriangle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const Phase4PartnershipAnalyzer: React.FC = () => {
  const [partnershipMetrics, setPartnershipMetrics] = React.useState([
    { metric: 'Market Share', current_value: 25, trend: 2 },
    { metric: 'Customer Acquisition', current_value: 150, trend: -5 },
    { metric: 'Revenue Growth', current_value: 18, trend: 3 },
    { metric: 'Operational Efficiency', current_value: 65, trend: 1 }
  ]);

  const [partnerships, setPartnerships] = React.useState([
    { id: 'p1', name: 'PharmaCorp', type: 'Distribution', status: 'excellent', roi: 25 },
    { id: 'p2', name: 'Global Labs', type: 'Research', status: 'good', roi: 18 },
    { id: 'p3', name: 'MediServe', type: 'Technology', status: 'fair', roi: 12 }
  ]);

  const [riskFactors, setRiskFactors] = React.useState([
    { factor: 'Regulatory Changes', level: 'medium', description: 'New regulations impacting partnership operations' },
    { factor: 'Market Competition', level: 'high', description: 'Increased competition affecting market share' },
    { factor: 'Technological Obsolescence', level: 'low', description: 'Risk of technology becoming outdated' }
  ]);

  const [marketOpportunities, setMarketOpportunities] = React.useState([
    { market: 'Emerging Markets', potential: 30, description: 'Expansion into new geographic regions', investment: '$500k', timeline: '18 months' },
    { market: 'New Product Lines', potential: 25, description: 'Development of innovative products', investment: '$750k', timeline: '24 months' }
  ]);

  const [gomesCasseresLaws, setGomesCasseresLaws] = React.useState([
    { name: 'Law of the Few', description: 'Strategic partnerships with a limited number of key players', compliance_score: 80, impact: 'high' },
    { name: 'Law of Value Creation', description: 'Focus on creating mutual value for all partners', compliance_score: 90, impact: 'high' },
    { name: 'Law of Asymmetry', description: 'Recognizing and leveraging the different strengths of each partner', compliance_score: 70, impact: 'medium' }
  ]);

  const [strategicRecommendations, setStrategicRecommendations] = React.useState([
    { title: 'Diversify Partnership Portfolio', description: 'Explore partnerships in emerging markets', priority: 'high', impact: 80, effort: 'medium' },
    { title: 'Enhance Technology Integration', description: 'Invest in seamless technology integration', priority: 'medium', impact: 65, effort: 'high' },
    { title: 'Improve Risk Management', description: 'Implement robust risk management processes', priority: 'low', impact: 50, effort: 'low' }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent': return 'default';
      case 'good': return 'secondary';
      case 'fair': return 'outline';
      case 'poor': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Partnership Strategic Analyzer</h2>
          <p className="text-muted-foreground">Análise estratégica baseada nas Leis de Gomes-Casseres</p>
        </div>
        <Button className="gap-2">
          <TrendingUp className="h-4 w-4" />
          Gerar Relatório
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {partnershipMetrics.map((metric) => (
          <Card key={metric.metric}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.metric}
                  </p>
                  <p className="text-2xl font-bold">{metric.current_value}</p>
                </div>
                <div className={`text-right ${metric.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.trend > 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium ml-1">
                    {metric.trend > 0 ? '+' : ''}{metric.trend}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="analysis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analysis">Análise de Parcerias</TabsTrigger>
          <TabsTrigger value="laws">Leis de Gomes-Casseres</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Partnership Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Performance das Parcerias
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partnerships.map((partnership) => (
                    <div key={partnership.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{partnership.name}</h4>
                        <p className="text-sm text-muted-foreground">{partnership.type}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusBadge(partnership.status)}>
                          {partnership.status}
                        </Badge>
                        <p className="text-sm mt-1">
                          ROI: <span className="font-medium text-green-600">
                            {String(partnership.roi)}%
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Strategic Alignment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Alinhamento Estratégico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">85%</div>
                      <div className="text-sm text-muted-foreground">Alinhamento Geral</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">12</div>
                      <div className="text-sm text-muted-foreground">Parcerias Ativas</div>
                    </div>
                  </div>
                  
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={partnershipMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="current_value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Avaliação de Riscos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {riskFactors.map((risk, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`h-4 w-4 ${
                          risk.level === 'high' ? 'text-red-500' : 
                          risk.level === 'medium' ? 'text-yellow-500' : 
                          'text-green-500'
                        }`} />
                        <div>
                          <p className="font-medium">{risk.factor}</p>
                          <p className="text-sm text-muted-foreground">{risk.description}</p>
                        </div>
                      </div>
                      <Badge variant={
                        risk.level === 'high' ? 'destructive' : 
                        risk.level === 'medium' ? 'outline' : 
                        'secondary'
                      }>
                        {risk.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Oportunidades de Mercado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketOpportunities.map((opportunity, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{opportunity.market}</h4>
                        <Badge variant="default">
                          Potencial: {String(opportunity.potential)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {opportunity.description}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>Investimento: <strong>{opportunity.investment}</strong></span>
                        <span>Timeline: <strong>{opportunity.timeline}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="laws" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {gomesCasseresLaws.map((law, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {law.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{law.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">Aplicação Atual:</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${law.compliance_score}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{law.compliance_score}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Impacto:</h4>
                      <Badge variant={
                        law.impact === 'high' ? 'default' : 
                        law.impact === 'medium' ? 'secondary' : 
                        'outline'
                      }>
                        {law.impact}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recomendações Estratégicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strategicRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`p-2 rounded-full ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-600' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{rec.title}</h4>
                        <Badge variant={
                          rec.priority === 'high' ? 'destructive' :
                          rec.priority === 'medium' ? 'outline' :
                          'secondary'
                        }>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                      <div className="flex justify-between text-sm">
                        <span>Impacto: <strong>{String(rec.impact)}%</strong></span>
                        <span>Esforço: <strong>{rec.effort}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Phase4PartnershipAnalyzer;
