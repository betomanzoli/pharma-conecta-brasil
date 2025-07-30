
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, 
  CheckCircle, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Users, 
  Brain,
  Clock,
  Award,
  PlayCircle,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Básico' | 'Intermediário' | 'Avançado';
  completed: boolean;
  progress: number;
  topics: string[];
  aiFeatures: string[];
}

interface IntelligentOnboardingGuideProps {
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  onModuleCompleted?: (moduleId: string) => void;
}

const IntelligentOnboardingGuide: React.FC<IntelligentOnboardingGuideProps> = ({
  userLevel = 'beginner',
  onModuleCompleted
}) => {
  const { toast } = useToast();
  const [activeModule, setActiveModule] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  const learningModules: LearningModule[] = [
    {
      id: 'intro-ia-projetos',
      title: 'Introdução à IA em Projetos',
      description: 'Fundamentos de como a IA transforma a gestão de projetos farmacêuticos',
      duration: '20 min',
      difficulty: 'Básico',
      completed: false,
      progress: 0,
      topics: [
        'O que é Gestão de Projetos Inteligente',
        'Benefícios da IA em Parcerias Farmacêuticas',
        'Visão Geral da PharmaConnect',
        'Casos de Uso Práticos'
      ],
      aiFeatures: [
        'AI Matching para parcerias',
        'Análise preditiva de sucesso',
        'Comunicação assistida por IA'
      ]
    },
    {
      id: 'ai-matching-mastery',
      title: 'Dominando o AI Matching',
      description: 'Como otimizar o uso do AI Matching para encontrar parcerias ideais',
      duration: '30 min',
      difficulty: 'Básico',
      completed: false,
      progress: 0,
      topics: [
        'Configuração de Perfil Otimizada',
        'Interpretação de Scores de Compatibilidade',
        'Refinamento de Critérios de Busca',
        'Análise de Parcerias Recomendadas'
      ],
      aiFeatures: [
        'Embeddings semânticos',
        'Score de compatibilidade',
        'Filtragem inteligente'
      ]
    },
    {
      id: 'predictive-analytics',
      title: 'Analytics Preditivos',
      description: 'Utilizando análise preditiva para maximizar o sucesso de projetos',
      duration: '25 min',
      difficulty: 'Intermediário',
      completed: false,
      progress: 0,
      topics: [
        'Interpretação de Dashboards Preditivos',
        'Análise de Riscos em Tempo Real',
        'Métricas de Saúde da Colaboração',
        'Tomada de Decisão Baseada em Dados'
      ],
      aiFeatures: [
        'Análise preditiva de riscos',
        'Probabilidade de sucesso',
        'Alertas inteligentes'
      ]
    },
    {
      id: 'hybrid-methodologies',
      title: 'Metodologias Híbridas Inteligentes',
      description: 'Combinando PMBOK, Agile e Lean com otimização por IA',
      duration: '35 min',
      difficulty: 'Intermediário',
      completed: false,
      progress: 0,
      topics: [
        'Teoria das Metodologias Híbridas',
        'Configuração do Engine Metodológico',
        'Adaptação por Fase de Projeto',
        'Otimização Contínua'
      ],
      aiFeatures: [
        'Engine de metodologia híbrida',
        'Otimização automática',
        'Recomendações contextuais'
      ]
    },
    {
      id: 'collaborative-governance',
      title: 'Governança Colaborativa Avançada',
      description: 'Aplicando as Três Leis de Gomes-Casseres com suporte de IA',
      duration: '40 min',
      difficulty: 'Avançado',
      completed: false,
      progress: 0,
      topics: [
        'As Três Leis de Gomes-Casseres',
        'Estruturas de Decisão Inteligentes',
        'Transparência e Valor Compartilhado',
        'Resolução de Conflitos Assistida'
      ],
      aiFeatures: [
        'Governança inteligente',
        'Análise de compliance',
        'Recomendações de estrutura'
      ]
    },
    {
      id: 'communication-ai',
      title: 'Comunicação Assistida por IA',
      description: 'Otimizando comunicação e colaboração com ferramentas inteligentes',
      duration: '30 min',
      difficulty: 'Intermediário',
      completed: false,
      progress: 0,
      topics: [
        'Assistente de Comunicação IA',
        'Resumos Automáticos',
        'Adaptação de Tom',
        'Análise de Sentimento'
      ],
      aiFeatures: [
        'Geração de conteúdo',
        'Análise de sentimento',
        'Sugestões contextuais'
      ]
    }
  ];

  useEffect(() => {
    const completed = completedModules.size;
    const total = learningModules.length;
    setOverallProgress((completed / total) * 100);
  }, [completedModules, learningModules.length]);

  const completeModule = (moduleId: string) => {
    setCompletedModules(prev => new Set(prev).add(moduleId));
    if (onModuleCompleted) {
      onModuleCompleted(moduleId);
    }
    toast({
      title: "Módulo Concluído! 🎉",
      description: "Você ganhou pontos de expertise em IA para projetos."
    });
  };

  const getModuleIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico': return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'Intermediário': return <Target className="h-5 w-5 text-yellow-500" />;
      case 'Avançado': return <Award className="h-5 w-5 text-red-500" />;
      default: return <BookOpen className="h-5 w-5 text-gray-500" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico': return 'bg-green-100 text-green-800';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800';
      case 'Avançado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendedModules = () => {
    switch (userLevel) {
      case 'beginner':
        return learningModules.filter(m => m.difficulty === 'Básico');
      case 'intermediate':
        return learningModules.filter(m => ['Básico', 'Intermediário'].includes(m.difficulty));
      default:
        return learningModules;
    }
  };

  const recommendedModules = getRecommendedModules();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center space-x-2">
          <Brain className="h-6 w-6 text-purple-500" />
          <span>Guia de Gestão de Projetos Inteligente</span>
        </h2>
        <p className="text-gray-600">
          Capacitação em IA aplicada à gestão de projetos farmacêuticos
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <span>Seu Progresso</span>
            </CardTitle>
            <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800">
              {Math.round(overallProgress)}% Concluído
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="mb-4" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{completedModules.size}</p>
              <p className="text-sm text-gray-600">Módulos Concluídos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {learningModules.reduce((acc, m) => acc + parseInt(m.duration), 0)} min
              </p>
              <p className="text-sm text-gray-600">Tempo Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{completedModules.size * 100}</p>
              <p className="text-sm text-gray-600">Pontos de Expertise</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Modules */}
      <Tabs defaultValue="recommended" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recommended">Recomendados</TabsTrigger>
          <TabsTrigger value="all">Todos os Módulos</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recommendedModules.map((module, index) => (
              <Card key={module.id} className={`transition-shadow hover:shadow-md ${
                completedModules.has(module.id) ? 'border-green-200 bg-green-50' : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getModuleIcon(module.difficulty)}
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getDifficultyColor(module.difficulty)}>
                        {module.difficulty}
                      </Badge>
                      {completedModules.has(module.id) && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Concluído
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">{module.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{module.duration}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2 text-sm">Tópicos Principais</h5>
                    <div className="space-y-1">
                      {module.topics.slice(0, 3).map((topic, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs">
                          <Lightbulb className="h-3 w-3 text-yellow-500" />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-2 text-sm">Recursos de IA</h5>
                    <div className="flex flex-wrap gap-1">
                      {module.aiFeatures.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <Brain className="h-2 w-2 mr-1" />
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => completeModule(module.id)}
                    disabled={completedModules.has(module.id)}
                  >
                    {completedModules.has(module.id) ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Concluído
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Iniciar Módulo
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {learningModules.map((module) => (
              <Card key={module.id} className={`transition-shadow hover:shadow-md ${
                completedModules.has(module.id) ? 'border-green-200 bg-green-50' : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getModuleIcon(module.difficulty)}
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getDifficultyColor(module.difficulty)}>
                        {module.difficulty}
                      </Badge>
                      {completedModules.has(module.id) && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Concluído
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-gray-600 text-sm">{module.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{module.duration}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    variant={completedModules.has(module.id) ? "outline" : "default"}
                    onClick={() => completeModule(module.id)}
                    disabled={completedModules.has(module.id)}
                  >
                    {completedModules.has(module.id) ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Concluído
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Iniciar
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedModules.size > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {learningModules
                .filter(m => completedModules.has(m.id))
                .map((module) => (
                <Card key={module.id} className="border-green-200 bg-green-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>{module.title}</span>
                      </CardTitle>
                      <Badge className="bg-green-100 text-green-800">
                        +100 pontos
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Certificado
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum módulo concluído ainda</h3>
                <p className="text-gray-600 mb-4">
                  Complete os módulos recomendados para ganhar expertise em IA
                </p>
                <Button onClick={() => setActiveModule(0)}>
                  Começar Agora
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* 30-Day Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-orange-500" />
            <span>Plano de Ação de 30 Dias</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Baseado no e-book "Gestão de Projetos Inteligente":</strong> Siga este plano 
              estruturado para dominar a gestão de projetos com IA em 30 dias.
            </AlertDescription>
          </Alert>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">1</div>
              <div>
                <h5 className="font-medium">Semana 1: Fundamentos</h5>
                <p className="text-sm text-gray-600">Complete módulos básicos + configure seu perfil para AI Matching otimizado</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">2</div>
              <div>
                <h5 className="font-medium">Semana 2: Analytics Preditivos</h5>
                <p className="text-sm text-gray-600">Domine dashboards preditivos + inicie primeiro projeto com metodologia híbrida</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">3</div>
              <div>
                <h5 className="font-medium">Semana 3: Governança Inteligente</h5>
                <p className="text-sm text-gray-600">Implemente governança colaborativa + otimize comunicação com IA</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">4</div>
              <div>
                <h5 className="font-medium">Semana 4: Otimização Avançada</h5>
                <p className="text-sm text-gray-600">Análise de lições aprendidas + refinamento de processos com IA</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligentOnboardingGuide;
