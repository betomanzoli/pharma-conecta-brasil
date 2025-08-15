
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Leaf, 
  Heart, 
  Lightbulb,
  Target,
  BarChart3
} from 'lucide-react';
import { StrategicProject, SharedValueMetrics } from '@/types/strategic-plan';

interface Phase3SharedValueProps {
  sharedValue: SharedValueMetrics;
  projects: StrategicProject[];
  onValueUpdate: (value: SharedValueMetrics) => void;
}

const Phase3SharedValue: React.FC<Phase3SharedValueProps> = ({ 
  sharedValue, 
  projects, 
  onValueUpdate 
}) => {
  const [valueCreationData, setValueCreationData] = useState<any[]>([]);
  const [impactMetrics, setImpactMetrics] = useState<any[]>([]);
  const [stakeholderValue, setStakeholderValue] = useState<any[]>([]);

  useEffect(() => {
    // Simular dados de criação de valor
    const mockValueCreation = [
      {
        id: '1',
        category: 'Valor Econômico',
        icon: DollarSign,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        value: 1250000,
        growth: 12.5,
        description: 'Receita gerada através de parcerias estratégicas',
        components: [
          { name: 'Receita de Licenciamento', value: 450000, percentage: 36 },
          { name: 'Economias Operacionais', value: 320000, percentage: 26 },
          { name: 'Novos Mercados', value: 280000, percentage: 22 },
          { name: 'Eficiência Processos', value: 200000, percentage: 16 }
        ]
      },
      {
        id: '2',
        category: 'Valor Social',
        icon: Heart,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        value: 850000,
        growth: 18.2,
        description: 'Impacto social positivo nas comunidades',
        components: [
          { name: 'Acesso a Medicamentos', value: 280000, percentage: 33 },
          { name: 'Capacitação Profissional', value: 250000, percentage: 29 },
          { name: 'Programas Comunitários', value: 180000, percentage: 21 },
          { name: 'Inclusão Digital', value: 140000, percentage: 17 }
        ]
      },
      {
        id: '3',
        category: 'Valor Ambiental',
        icon: Leaf,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        value: 450000,
        growth: 25.8,
        description: 'Benefícios ambientais e sustentabilidade',
        components: [
          { name: 'Redução CO2', value: 150000, percentage: 33 },
          { name: 'Economia Água', value: 120000, percentage: 27 },
          { name: 'Resíduos Evitados', value: 100000, percentage: 22 },
          { name: 'Energia Renovável', value: 80000, percentage: 18 }
        ]
      },
      {
        id: '4',
        category: 'Valor Stakeholder',
        icon: Users,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        value: 920000,
        growth: 15.4,
        description: 'Valor criado para stakeholders',
        components: [
          { name: 'Satisfação Parceiros', value: 300000, percentage: 33 },
          { name: 'Desenvolvimento Fornecedores', value: 250000, percentage: 27 },
          { name: 'Engajamento Funcionários', value: 220000, percentage: 24 },
          { name: 'Relacionamento Clientes', value: 150000, percentage: 16 }
        ]
      },
      {
        id: '5',
        category: 'Valor Inovação',
        icon: Lightbulb,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        value: 780000,
        growth: 22.1,
        description: 'Valor gerado através de inovação',
        components: [
          { name: 'Novos Produtos', value: 280000, percentage: 36 },
          { name: 'Propriedade Intelectual', value: 200000, percentage: 26 },
          { name: 'Processos Inovadores', value: 180000, percentage: 23 },
          { name: 'Pesquisa & Desenvolvimento', value: 120000, percentage: 15 }
        ]
      }
    ];

    const mockImpactMetrics = [
      {
        id: '1',
        name: 'Pacientes Beneficiados',
        value: 15420,
        target: 18000,
        unit: 'pessoas',
        category: 'social',
        trend: 'up',
        growth: 8.5
      },
      {
        id: '2',
        name: 'Redução Pegada Carbono',
        value: 2.3,
        target: 3.0,
        unit: 'toneladas CO2',
        category: 'ambiental',
        trend: 'up',
        growth: 15.2
      },
      {
        id: '3',
        name: 'Empregos Criados',
        value: 340,
        target: 400,
        unit: 'posições',
        category: 'social',
        trend: 'up',
        growth: 12.8
      },
      {
        id: '4',
        name: 'Investimento P&D',
        value: 1.2,
        target: 1.5,
        unit: 'milhões',
        category: 'inovação',
        trend: 'up',
        growth: 18.4
      }
    ];

    const mockStakeholderValue = [
      {
        stakeholder: 'Parceiros Estratégicos',
        value: 2.8,
        satisfaction: 8.9,
        engagement: 9.2,
        benefits: ['Acesso a novos mercados', 'Compartilhamento de riscos', 'Economia de escala']
      },
      {
        stakeholder: 'Comunidade Local',
        value: 1.9,
        satisfaction: 8.5,
        engagement: 7.8,
        benefits: ['Programas de saúde', 'Capacitação profissional', 'Infraestrutura']
      },
      {
        stakeholder: 'Funcionários',
        value: 2.3,
        satisfaction: 9.1,
        engagement: 8.9,
        benefits: ['Desenvolvimento carreira', 'Benefícios expandidos', 'Ambiente inovador']
      },
      {
        stakeholder: 'Investidores',
        value: 3.2,
        satisfaction: 8.8,
        engagement: 9.5,
        benefits: ['ROI superior', 'Crescimento sustentável', 'Redução de riscos']
      }
    ];

    setValueCreationData(mockValueCreation);
    setImpactMetrics(mockImpactMetrics);
    setStakeholderValue(mockStakeholderValue);
  }, []);

  const getGrowthColor = (growth: number) => {
    if (growth >= 20) return 'text-green-600';
    if (growth >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '➡️';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-purple-500" />
            <span>Fase 3: Métricas de Valor Compartilhado</span>
          </h2>
          <p className="text-gray-600 mt-2">
            Medição e otimização do valor compartilhado entre stakeholders
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">
            R$ {sharedValue.totalSharedValue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Valor Total Compartilhado</div>
        </div>
      </div>

      {/* Resumo Valor Compartilhado */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Econômico</p>
                <p className="text-lg font-bold">R$ {(sharedValue.economicValue / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Social</p>
                <p className="text-lg font-bold">R$ {(sharedValue.socialValue / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Ambiental</p>
                <p className="text-lg font-bold">R$ {(sharedValue.environmentalValue / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Stakeholder</p>
                <p className="text-lg font-bold">R$ {(sharedValue.stakeholderValue / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Inovação</p>
                <p className="text-lg font-bold">R$ {(sharedValue.innovationValue / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="creation" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="creation">Criação de Valor</TabsTrigger>
          <TabsTrigger value="impact">Métricas de Impacto</TabsTrigger>
          <TabsTrigger value="stakeholders">Valor Stakeholders</TabsTrigger>
        </TabsList>

        <TabsContent value="creation" className="mt-6">
          <div className="space-y-6">
            {valueCreationData.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-lg ${category.bgColor}`}>
                          <IconComponent className={`h-5 w-5 ${category.color}`} />
                        </div>
                        <span>{category.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          R$ {category.value.toLocaleString()}
                        </div>
                        <div className={`text-sm ${getGrowthColor(category.growth)}`}>
                          +{category.growth}% vs período anterior
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.components.map((component: any, index: number) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{component.name}</span>
                            <span className="text-sm text-gray-600">{component.percentage}%</span>
                          </div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">
                              R$ {component.value.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={component.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="impact" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {impactMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{metric.name}</span>
                    <Badge variant="outline">{metric.category}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold">{metric.value.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{metric.unit}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Meta: {metric.target.toLocaleString()}</div>
                        <div className={`text-sm ${getGrowthColor(metric.growth)}`}>
                          {getTrendIcon(metric.trend)} {metric.growth}%
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                      </div>
                      <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stakeholders" className="mt-6">
          <div className="space-y-6">
            {stakeholderValue.map((stakeholder, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{stakeholder.stakeholder}</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      Valor: {stakeholder.value}x
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Satisfação</span>
                          <span className="text-sm font-medium">{stakeholder.satisfaction}/10</span>
                        </div>
                        <Progress value={stakeholder.satisfaction * 10} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Engajamento</span>
                          <span className="text-sm font-medium">{stakeholder.engagement}/10</span>
                        </div>
                        <Progress value={stakeholder.engagement * 10} className="h-2" />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <h4 className="font-medium mb-2">Benefícios Principais</h4>
                      <div className="space-y-2">
                        {stakeholder.benefits.map((benefit: string, benefitIndex: number) => (
                          <div key={benefitIndex} className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-purple-500" />
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Phase3SharedValue;
