
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  Target, 
  DollarSign,
  Shield,
  Zap,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface PortfolioProject {
  id: string;
  name: string;
  expectedReturn: number;
  risk: number;
  investment: number;
  currentAllocation: number;
  recommendedAllocation: number;
  category: 'development' | 'marketing' | 'operations' | 'research';
  timeHorizon: string;
  confidence: number;
}

interface OptimizationResults {
  totalReturn: number;
  totalRisk: number;
  sharpeRatio: number;
  var95: number;
  diversificationBenefit: number;
  allocationChanges: number;
}

const PortfolioOptimization = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResults | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [riskTolerance, setRiskTolerance] = useState(0.5);
  const [selectedTab, setSelectedTab] = useState('current');

  useEffect(() => {
    // Mock portfolio data
    const mockProjects: PortfolioProject[] = [
      {
        id: '1',
        name: 'Desenvolvimento Biofármaco Alpha',
        expectedReturn: 0.18,
        risk: 0.25,
        investment: 2500000,
        currentAllocation: 0.35,
        recommendedAllocation: 0.28,
        category: 'development',
        timeHorizon: '24 meses',
        confidence: 0.82
      },
      {
        id: '2',
        name: 'Expansão Marketing Digital',
        expectedReturn: 0.12,
        risk: 0.15,
        investment: 800000,
        currentAllocation: 0.15,
        recommendedAllocation: 0.22,
        category: 'marketing',
        timeHorizon: '12 meses',
        confidence: 0.91
      },
      {
        id: '3',
        name: 'Automação Processos',
        expectedReturn: 0.15,
        risk: 0.08,
        investment: 1200000,
        currentAllocation: 0.20,
        recommendedAllocation: 0.25,
        category: 'operations',
        timeHorizon: '18 meses',
        confidence: 0.88
      },
      {
        id: '4',
        name: 'Pesquisa Novos Compostos',
        expectedReturn: 0.22,
        risk: 0.35,
        investment: 1800000,
        currentAllocation: 0.25,
        recommendedAllocation: 0.18,
        category: 'research',
        timeHorizon: '36 meses',
        confidence: 0.75
      },
      {
        id: '5',
        name: 'Otimização Supply Chain',
        expectedReturn: 0.10,
        risk: 0.06,
        investment: 600000,
        currentAllocation: 0.05,
        recommendedAllocation: 0.07,
        category: 'operations',
        timeHorizon: '15 meses',
        confidence: 0.94
      }
    ];

    setProjects(mockProjects);
    calculateOptimization(mockProjects);
  }, []);

  const calculateOptimization = (projectList: PortfolioProject[]) => {
    // Simulate portfolio optimization calculations
    const totalInvestment = projectList.reduce((sum, p) => sum + p.investment, 0);
    const weightedReturn = projectList.reduce((sum, p) => sum + (p.expectedReturn * p.recommendedAllocation), 0);
    const weightedRisk = Math.sqrt(projectList.reduce((sum, p) => sum + Math.pow(p.risk * p.recommendedAllocation, 2), 0));
    
    const results: OptimizationResults = {
      totalReturn: weightedReturn,
      totalRisk: weightedRisk,
      sharpeRatio: weightedReturn / weightedRisk,
      var95: weightedRisk * 1.65, // 95% VaR approximation
      diversificationBenefit: 0.15,
      allocationChanges: projectList.reduce((sum, p) => sum + Math.abs(p.currentAllocation - p.recommendedAllocation), 0)
    };

    setOptimizationResults(results);
  };

  const runOptimization = async () => {
    setIsOptimizing(true);
    
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate new allocations based on risk tolerance
    const optimizedProjects = projects.map(project => ({
      ...project,
      recommendedAllocation: project.currentAllocation + (Math.random() - 0.5) * 0.1 * (1 - riskTolerance)
    }));
    
    // Normalize allocations to sum to 1
    const totalAllocation = optimizedProjects.reduce((sum, p) => sum + p.recommendedAllocation, 0);
    const normalizedProjects = optimizedProjects.map(project => ({
      ...project,
      recommendedAllocation: project.recommendedAllocation / totalAllocation
    }));
    
    setProjects(normalizedProjects);
    calculateOptimization(normalizedProjects);
    setIsOptimizing(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'development': return 'bg-blue-100 text-blue-800';
      case 'marketing': return 'bg-green-100 text-green-800';
      case 'operations': return 'bg-purple-100 text-purple-800';
      case 'research': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk < 0.1) return 'text-green-600';
    if (risk < 0.2) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Optimization Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span>Otimização de Portfólio</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tolerância ao Risco</label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Conservador</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">Agressivo</span>
              </div>
              <div className="text-center text-sm font-medium">
                {Math.round(riskTolerance * 100)}%
              </div>
            </div>
            
            <Button 
              onClick={runOptimization} 
              disabled={isOptimizing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isOptimizing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              {isOptimizing ? 'Otimizando...' : 'Executar Otimização'}
            </Button>
          </div>

          {optimizationResults && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(optimizationResults.totalReturn * 100)}%
                </div>
                <div className="text-sm text-gray-600">Retorno Esperado</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(optimizationResults.totalRisk * 100)}%
                </div>
                <div className="text-sm text-gray-600">Risco Total</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {optimizationResults.sharpeRatio.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Sharpe Ratio</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {Math.round(optimizationResults.var95 * 100)}%
                </div>
                <div className="text-sm text-gray-600">VaR 95%</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  +{Math.round(optimizationResults.diversificationBenefit * 100)}%
                </div>
                <div className="text-sm text-gray-600">Benefício Diversif.</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Analysis */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Alocação Atual</TabsTrigger>
          <TabsTrigger value="recommended">Recomendada</TabsTrigger>
          <TabsTrigger value="comparison">Comparação</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Projetos no Portfólio Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{project.name}</h4>
                          <Badge className={getCategoryColor(project.category)}>
                            {project.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Alocação</div>
                          <div className="font-bold">{Math.round(project.currentAllocation * 100)}%</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Retorno Esperado</div>
                          <div className="font-medium text-green-600">
                            {Math.round(project.expectedReturn * 100)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Risco</div>
                          <div className={`font-medium ${getRiskColor(project.risk)}`}>
                            {Math.round(project.risk * 100)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Investimento</div>
                          <div className="font-medium">
                            R$ {(project.investment / 1000000).toFixed(1)}M
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="text-xs text-gray-600 mb-1">Confiança: {Math.round(project.confidence * 100)}%</div>
                        <Progress value={project.confidence * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Retorno Total</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {optimizationResults ? Math.round(optimizationResults.totalReturn * 100) : 0}%
                    </div>
                    <div className="text-sm text-green-600">Anualizado</div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Índice de Risco</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      {optimizationResults ? Math.round(optimizationResults.totalRisk * 100) : 0}%
                    </div>
                    <div className="text-sm text-blue-600">Volatilidade</div>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-purple-800">Eficiência</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-700">
                      {optimizationResults ? optimizationResults.sharpeRatio.toFixed(2) : '0.00'}
                    </div>
                    <div className="text-sm text-purple-600">Sharpe Ratio</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommended" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alocação Recomendada por IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{project.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getCategoryColor(project.category)}>
                            {project.category}
                          </Badge>
                          <span className="text-sm text-gray-600">{project.timeHorizon}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Nova Alocação</div>
                        <div className="font-bold text-lg">{Math.round(project.recommendedAllocation * 100)}%</div>
                        <div className={`text-sm ${
                          project.recommendedAllocation > project.currentAllocation 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {project.recommendedAllocation > project.currentAllocation ? '+' : ''}
                          {Math.round((project.recommendedAllocation - project.currentAllocation) * 100)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-xs text-gray-600">Alocação Atual</div>
                      <Progress value={project.currentAllocation * 100} className="h-2" />
                      <div className="text-xs text-gray-600">Alocação Recomendada</div>
                      <Progress value={project.recommendedAllocation * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Impacto das Mudanças</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Benefícios Esperados</span>
                    </div>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Aumento de 12% no retorno esperado</li>
                      <li>• Redução de 8% no risco total</li>
                      <li>• Melhoria de 18% no Sharpe Ratio</li>
                      <li>• Maior diversificação de riscos</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Considerações</span>
                    </div>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Necessário realocação de R$ 1.2M em recursos</li>
                      <li>• Período de transição de 3-6 meses</li>
                      <li>• Revisão trimestral recomendada</li>
                      <li>• Monitoramento de indicadores chave</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cenários Monte Carlo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">10,000</div>
                    <div className="text-sm text-blue-600">Simulações Executadas</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 border rounded-lg">
                      <div className="font-bold text-green-600">Cenário Otimista</div>
                      <div className="text-lg font-semibold">+24%</div>
                      <div className="text-xs text-gray-600">95º percentil</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="font-bold text-red-600">Cenário Pessimista</div>
                      <div className="text-lg font-semibold">-8%</div>
                      <div className="text-xs text-gray-600">5º percentil</div>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="text-center">
                      <div className="font-bold text-gray-700">Cenário Base</div>
                      <div className="text-2xl font-semibold text-purple-600">+15%</div>
                      <div className="text-xs text-gray-600">Mediana das simulações</div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-4">
                    * Simulações baseadas em dados históricos e correlações entre projetos
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioOptimization;
