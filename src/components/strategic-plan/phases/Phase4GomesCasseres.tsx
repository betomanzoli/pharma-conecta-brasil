
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Book, 
  CheckCircle, 
  AlertTriangle, 
  Target,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';
import { StrategicProject, GomesCasseresLaw } from '@/types/strategic-plan';

interface Phase4GomesCasseresProps {
  projects: StrategicProject[];
  onProjectUpdate: (projects: StrategicProject[]) => void;
}

const Phase4GomesCasseres: React.FC<Phase4GomesCasseresProps> = ({ projects, onProjectUpdate }) => {
  const [gomesCasseresLaws, setGomesCasseresLaws] = useState<GomesCasseresLaw[]>([]);
  const [complianceMetrics, setComplianceMetrics] = useState<any[]>([]);
  const [applicationExamples, setApplicationExamples] = useState<any[]>([]);

  useEffect(() => {
    // Leis de Gomes-Casseres para parcerias estratégicas
    const laws: GomesCasseresLaw[] = [
      {
        id: '1',
        name: 'Lei da Complementaridade',
        description: 'Parcerias devem combinar recursos e capacidades complementares',
        principle: 'Recursos + Capacidades = Vantagem Competitiva',
        application: 'Identificar gaps e encontrar parceiros que preencham lacunas específicas',
        metrics: ['Índice de Complementaridade', 'Sobreposição de Recursos', 'Sinergia Operacional'],
        complianceLevel: 8.7
      },
      {
        id: '2',
        name: 'Lei da Reciprocidade',
        description: 'Valor deve ser criado e compartilhado mutuamente entre parceiros',
        principle: 'Valor Criado = Valor Compartilhado',
        application: 'Estruturar acordos com benefícios balanceados para todos os parceiros',
        metrics: ['Distribuição de Valor', 'Satisfação dos Parceiros', 'Retenção de Parcerias'],
        complianceLevel: 9.2
      },
      {
        id: '3',
        name: 'Lei da Governança Adaptativa',
        description: 'Estruturas de governança devem evoluir com a parceria',
        principle: 'Governança Flexível = Adaptabilidade',
        application: 'Implementar mecanismos de governance que se adaptem ao contexto',
        metrics: ['Flexibilidade Estrutural', 'Velocidade de Adaptação', 'Eficácia Decisória'],
        complianceLevel: 7.8
      },
      {
        id: '4',
        name: 'Lei da Confiança Progressiva',
        description: 'Confiança deve ser construída gradualmente através de marcos',
        principle: 'Confiança = Transparência + Resultados',
        application: 'Estabelecer marcos de confiança e sistemas de transparência',
        metrics: ['Índice de Confiança', 'Transparência Operacional', 'Cumprimento de Marcos'],
        complianceLevel: 8.9
      },
      {
        id: '5',
        name: 'Lei da Inovação Colaborativa',
        description: 'Inovação emerge da colaboração entre diferentes perspectivas',
        principle: 'Diversidade + Colaboração = Inovação',
        application: 'Criar ambientes que promovam a colaboração criativa',
        metrics: ['Projetos Inovadores', 'Diversidade de Perspectivas', 'Breakthrough Innovations'],
        complianceLevel: 8.3
      },
      {
        id: '6',
        name: 'Lei da Sustentabilidade Estratégica',
        description: 'Parcerias devem gerar valor sustentável a longo prazo',
        principle: 'Sustentabilidade = Valor Duradouro',
        application: 'Focar em benefícios de longo prazo e impacto sustentável',
        metrics: ['Durabilidade da Parceria', 'Impacto Sustentável', 'Renovação de Contratos'],
        complianceLevel: 8.5
      }
    ];

    const mockComplianceMetrics = [
      {
        projectId: '1',
        projectName: 'Desenvolvimento de Biofármaco',
        overallCompliance: 8.5,
        lawCompliance: [
          { lawId: '1', lawName: 'Complementaridade', score: 9.2, status: 'excellent' },
          { lawId: '2', lawName: 'Reciprocidade', score: 8.8, status: 'good' },
          { lawId: '3', lawName: 'Governança Adaptativa', score: 7.5, status: 'good' },
          { lawId: '4', lawName: 'Confiança Progressiva', score: 9.0, status: 'excellent' },
          { lawId: '5', lawName: 'Inovação Colaborativa', score: 8.2, status: 'good' },
          { lawId: '6', lawName: 'Sustentabilidade Estratégica', score: 8.8, status: 'good' }
        ]
      }
    ];

    const mockApplications = [
      {
        id: '1',
        lawId: '1',
        lawName: 'Lei da Complementaridade',
        project: 'Desenvolvimento de Biofármaco',
        implementation: 'Parceria com BioTech Labs para expertise em síntese molecular',
        results: ['Redução de 40% no tempo de desenvolvimento', 'Acesso a tecnologia exclusiva', 'Economia de R$ 2.1M em P&D'],
        metrics: {
          complementarityIndex: 0.87,
          resourceOverlap: 0.23,
          operationalSynergy: 0.94
        },
        status: 'active',
        impactLevel: 'high'
      },
      {
        id: '2',
        lawId: '2',
        lawName: 'Lei da Reciprocidade',
        project: 'Plataforma de Telemedicina',
        implementation: 'Estrutura de revenue sharing 60/40 com parceiro tecnológico',
        results: ['Distribuição equilibrada de benefícios', 'Satisfação de 9.2/10 dos parceiros', 'Renovação automática de contratos'],
        metrics: {
          valueDistribution: 0.91,
          partnerSatisfaction: 0.92,
          partnershipRetention: 0.89
        },
        status: 'active',
        impactLevel: 'high'
      },
      {
        id: '3',
        lawId: '4',
        lawName: 'Lei da Confiança Progressiva',
        project: 'Pesquisa Clínica Colaborativa',
        implementation: 'Sistema de marcos de confiança com transparência total de dados',
        results: ['Índice de confiança: 8.9/10', 'Zero conflitos em 18 meses', 'Expansão para 3 novos projetos'],
        metrics: {
          trustIndex: 0.89,
          operationalTransparency: 0.95,
          milestoneCompliance: 0.93
        },
        status: 'completed',
        impactLevel: 'high'
      }
    ];

    setGomesCasseresLaws(laws);
    setComplianceMetrics(mockComplianceMetrics);
    setApplicationExamples(mockApplications);
  }, []);

  const getComplianceColor = (level: number) => {
    if (level >= 9) return 'text-green-600 bg-green-100';
    if (level >= 7) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'needs_improvement': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Shield className="h-6 w-6 text-orange-500" />
            <span>Fase 4: Aplicação das Leis de Gomes-Casseres</span>
          </h2>
          <p className="text-gray-600 mt-2">
            Framework estratégico para parcerias de alto desempenho
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-600">
            {Math.round(gomesCasseresLaws.reduce((sum, law) => sum + law.complianceLevel, 0) / gomesCasseresLaws.length * 10)}%
          </div>
          <div className="text-sm text-gray-600">Compliance Médio</div>
        </div>
      </div>

      <Tabs defaultValue="laws" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="laws">Leis Estratégicas</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="applications">Aplicações</TabsTrigger>
        </TabsList>

        <TabsContent value="laws" className="mt-6">
          <div className="space-y-6">
            {gomesCasseresLaws.map((law) => (
              <Card key={law.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Book className="h-5 w-5 text-orange-500" />
                      <span>{law.name}</span>
                    </CardTitle>
                    <Badge className={getComplianceColor(law.complianceLevel)}>
                      {law.complianceLevel}/10
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Descrição</h4>
                    <p className="text-gray-600">{law.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Princípio</h4>
                    <p className="text-blue-600 font-medium">{law.principle}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Aplicação</h4>
                    <p className="text-gray-600">{law.application}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Métricas de Acompanhamento</h4>
                    <div className="flex flex-wrap gap-2">
                      {law.metrics.map((metric, index) => (
                        <Badge key={index} variant="outline">{metric}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Nível de Compliance</h4>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Progress value={law.complianceLevel * 10} className="h-3" />
                      </div>
                      <span className="text-sm font-medium">{law.complianceLevel}/10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <div className="space-y-6">
            {complianceMetrics.map((project) => (
              <Card key={project.projectId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{project.projectName}</CardTitle>
                    <Badge className={getComplianceColor(project.overallCompliance)}>
                      Overall: {project.overallCompliance}/10
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.lawCompliance.map((law: any) => (
                      <div key={law.lawId} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{law.lawName}</h4>
                          <Badge className={getStatusColor(law.status)}>
                            {law.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <Progress value={law.score * 10} className="h-2" />
                          </div>
                          <span className="text-sm font-medium">{law.score}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <div className="space-y-6">
            {applicationExamples.map((example) => (
              <Card key={example.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      <span>{example.lawName}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getImpactColor(example.impactLevel)}>
                        {example.impactLevel} impact
                      </Badge>
                      <Badge variant="outline">{example.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Projeto</h4>
                    <p className="text-gray-600">{example.project}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Implementação</h4>
                    <p className="text-gray-600">{example.implementation}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Resultados</h4>
                    <ul className="space-y-1">
                      {example.results.map((result: string, index: number) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Métricas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(example.metrics).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {Math.round((value as number) * 100)}%
                          </div>
                          <div className="text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </div>
                        </div>
                      ))}
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

export default Phase4GomesCasseres;
