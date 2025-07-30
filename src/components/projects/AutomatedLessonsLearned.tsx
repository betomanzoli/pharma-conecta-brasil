
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  BookOpen, 
  Filter,
  Download,
  Search,
  BarChart3,
  Users,
  Clock,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface LessonLearned {
  id: string;
  project_name: string;
  category: 'success_factor' | 'risk_factor' | 'process_improvement' | 'communication' | 'methodology';
  impact_level: 'low' | 'medium' | 'high' | 'critical';
  lesson_title: string;
  lesson_description: string;
  recommendation: string;
  ai_confidence: number;
  frequency: number;
  applicable_contexts: string[];
  created_at: string;
  project_type: string;
  methodology_used: string;
  success_rate_impact: number;
}

interface AutomatedLessonsLearnedProps {
  projectId?: string;
  onLessonApplied?: (lesson: LessonLearned) => void;
}

const AutomatedLessonsLearned: React.FC<AutomatedLessonsLearnedProps> = ({
  projectId,
  onLessonApplied
}) => {
  const { toast } = useToast();
  const [lessons, setLessons] = useState<LessonLearned[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    impact_level: '',
    project_type: '',
    search: ''
  });

  // Mock data for lessons learned
  const mockLessons: LessonLearned[] = [
    {
      id: '1',
      project_name: 'Desenvolvimento Formulação Oral X',
      category: 'success_factor',
      impact_level: 'high',
      lesson_title: 'Comunicação Semanal Estruturada Aumenta Sucesso em 23%',
      lesson_description: 'Projetos com comunicação estruturada semanal entre parceiros apresentaram 23% mais chance de conclusão no prazo e 18% menor desvio de orçamento.',
      recommendation: 'Implementar reuniões semanais obrigatórias com agenda padrão: progresso, riscos, próximos passos e decisões pendentes.',
      ai_confidence: 94,
      frequency: 12,
      applicable_contexts: ['pharmaceutical', 'rd_projects', 'multi_partner'],
      created_at: '2024-01-15',
      project_type: 'pharmaceutical',
      methodology_used: 'hybrid',
      success_rate_impact: 23
    },
    {
      id: '2',
      project_name: 'Análise Regulatória FDA Y',
      category: 'risk_factor',
      impact_level: 'critical',
      lesson_title: 'Atraso na Definição de Responsabilidades Causa 67% dos Conflitos',
      lesson_description: 'A falta de definição clara de papéis e responsabilidades no início do projeto é a causa raiz de 67% dos conflitos em parcerias farmacêuticas.',
      recommendation: 'Utilizar matriz RACI detalhada nas primeiras 2 semanas, com validação de todos os stakeholders e revisão quinzenal.',
      ai_confidence: 89,
      frequency: 8,
      applicable_contexts: ['regulatory', 'multi_partner', 'complex_projects'],
      created_at: '2024-01-18',
      project_type: 'regulatory',
      methodology_used: 'pmbok',
      success_rate_impact: -35
    },
    {
      id: '3',
      project_name: 'Otimização Produção Z',
      category: 'methodology',
      impact_level: 'high',
      lesson_title: 'Metodologia Híbrida Reduz Tempo de Planejamento em 40%',
      lesson_description: 'Combinar PMBOK para estrutura inicial com Agile para execução reduziu o tempo de planejamento em 40% sem perda de qualidade.',
      recommendation: 'Aplicar 60% PMBOK na fase de iniciação/planejamento e 70% Agile na execução, com gates de transição bem definidos.',
      ai_confidence: 92,
      frequency: 15,
      applicable_contexts: ['production', 'optimization', 'time_critical'],
      created_at: '2024-01-22',
      project_type: 'production',
      methodology_used: 'hybrid',
      success_rate_impact: 31
    },
    {
      id: '4',
      project_name: 'Parceria Colaborativa W',
      category: 'process_improvement',
      impact_level: 'medium',
      lesson_title: 'Dashboard em Tempo Real Melhora Transparência em 45%',
      lesson_description: 'Implementação de dashboards em tempo real com métricas de parceria aumentou a satisfação dos stakeholders em 45%.',
      recommendation: 'Configurar dashboards automáticos com atualização diária mostrando progresso, riscos e métricas de valor compartilhado.',
      ai_confidence: 87,
      frequency: 6,
      applicable_contexts: ['collaboration', 'partnership', 'transparency'],
      created_at: '2024-01-25',
      project_type: 'collaboration',
      methodology_used: 'agile',
      success_rate_impact: 19
    },
    {
      id: '5',
      project_name: 'Submissão Regulatória V',
      category: 'communication',
      impact_level: 'high',
      lesson_title: 'IA de Comunicação Reduz Mal-entendidos em 52%',
      lesson_description: 'Uso de assistente de IA para revisar comunicações críticas reduziu mal-entendidos e conflitos em 52%.',
      recommendation: 'Implementar revisão automática de comunicações importantes com IA antes do envio, especialmente para stakeholders externos.',
      ai_confidence: 91,
      frequency: 9,
      applicable_contexts: ['regulatory', 'external_stakeholders', 'critical_communication'],
      created_at: '2024-01-28',
      project_type: 'regulatory',
      methodology_used: 'pmbok',
      success_rate_impact: 28
    }
  ];

  useEffect(() => {
    setLessons(mockLessons);
  }, []);

  const generateNewLessons = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-project-assistant', {
        body: {
          action: 'extract_lessons_learned',
          project_id: projectId
        }
      });

      if (error) throw error;

      toast({
        title: "Lições Aprendidas Geradas",
        description: "IA extraiu novas lições de projetos concluídos."
      });

      // Add new lessons to the list
      if (data.lessons) {
        setLessons(prev => [...prev, ...data.lessons]);
      }
    } catch (error) {
      console.error('Error generating lessons:', error);
      toast({
        title: "Erro na Análise",
        description: "Não foi possível extrair lições aprendidas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyLesson = (lesson: LessonLearned) => {
    if (onLessonApplied) {
      onLessonApplied(lesson);
    }
    toast({
      title: "Lição Aplicada",
      description: `Recomendação "${lesson.lesson_title}" foi aplicada ao projeto.`
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      success_factor: <CheckCircle className="h-4 w-4 text-green-500" />,
      risk_factor: <AlertTriangle className="h-4 w-4 text-red-500" />,
      process_improvement: <TrendingUp className="h-4 w-4 text-blue-500" />,
      communication: <Users className="h-4 w-4 text-purple-500" />,
      methodology: <Target className="h-4 w-4 text-orange-500" />
    };
    return icons[category] || <BookOpen className="h-4 w-4 text-gray-500" />;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      success_factor: 'bg-green-100 text-green-800',
      risk_factor: 'bg-red-100 text-red-800',
      process_improvement: 'bg-blue-100 text-blue-800',
      communication: 'bg-purple-100 text-purple-800',
      methodology: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getImpactColor = (impact: string) => {
    const colors = {
      low: 'text-gray-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      critical: 'text-red-600'
    };
    return colors[impact] || 'text-gray-600';
  };

  const filteredLessons = lessons.filter(lesson => {
    return (!filters.category || lesson.category === filters.category) &&
           (!filters.impact_level || lesson.impact_level === filters.impact_level) &&
           (!filters.project_type || lesson.project_type === filters.project_type) &&
           (!filters.search || lesson.lesson_title.toLowerCase().includes(filters.search.toLowerCase()) ||
            lesson.lesson_description.toLowerCase().includes(filters.search.toLowerCase()));
  });

  const getCategoryStats = () => {
    const stats = lessons.reduce((acc, lesson) => {
      acc[lesson.category] = (acc[lesson.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(stats).map(([category, count]) => ({ category, count }));
  };

  const getTopLessons = () => {
    return lessons
      .filter(l => l.ai_confidence > 85)
      .sort((a, b) => b.success_rate_impact - a.success_rate_impact)
      .slice(0, 5);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <span>Lições Aprendidas Automatizadas</span>
          </h2>
          <p className="text-gray-600 mt-1">
            Insights extraídos automaticamente de projetos concluídos
          </p>
        </div>
        
        <Button onClick={generateNewLessons} disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analisando...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Gerar Novas Lições
            </>
          )}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total de Lições</p>
                <p className="text-2xl font-bold">{lessons.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Impacto Médio</p>
                <p className="text-2xl font-bold text-green-600">
                  +{Math.round(lessons.reduce((acc, l) => acc + Math.abs(l.success_rate_impact), 0) / lessons.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Confiança IA</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(lessons.reduce((acc, l) => acc + l.ai_confidence, 0) / lessons.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Lições Críticas</p>
                <p className="text-2xl font-bold text-red-600">
                  {lessons.filter(l => l.impact_level === 'critical').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all-lessons" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all-lessons">Todas as Lições</TabsTrigger>
          <TabsTrigger value="top-insights">Top Insights</TabsTrigger>
          <TabsTrigger value="categories">Por Categoria</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="all-lessons" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar lições..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="max-w-sm"
                  />
                </div>
                
                <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="success_factor">Fator de Sucesso</SelectItem>
                    <SelectItem value="risk_factor">Fator de Risco</SelectItem>
                    <SelectItem value="process_improvement">Melhoria de Processo</SelectItem>
                    <SelectItem value="communication">Comunicação</SelectItem>
                    <SelectItem value="methodology">Metodologia</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.impact_level} onValueChange={(value) => setFilters({...filters, impact_level: value})}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Impacto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="low">Baixo</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="high">Alto</SelectItem>
                    <SelectItem value="critical">Crítico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lessons List */}
          <div className="space-y-4">
            {filteredLessons.map((lesson) => (
              <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getCategoryIcon(lesson.category)}
                      <div>
                        <CardTitle className="text-lg">{lesson.lesson_title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getCategoryColor(lesson.category)}>
                            {lesson.category.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline">
                            {lesson.project_type}
                          </Badge>
                          <span className={`text-sm font-medium ${getImpactColor(lesson.impact_level)}`}>
                            Impacto {lesson.impact_level}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="text-right">
                        <p className="font-semibold text-lg text-green-600">
                          {lesson.success_rate_impact > 0 ? '+' : ''}{lesson.success_rate_impact}%
                        </p>
                        <p className="text-xs">Impacto no Sucesso</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{lesson.ai_confidence}%</p>
                        <p className="text-xs">Confiança IA</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{lesson.lesson_description}</p>
                  
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Recomendação:</strong> {lesson.recommendation}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Baseado em {lesson.frequency} projetos similares</span>
                      <span>Metodologia: {lesson.methodology_used.toUpperCase()}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Exportar
                      </Button>
                      <Button size="sm" onClick={() => applyLesson(lesson)}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Aplicar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="top-insights" className="space-y-4">
          <div className="space-y-4">
            {getTopLessons().map((lesson, index) => (
              <Card key={lesson.id} className="border-l-4 border-l-yellow-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-yellow-100 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{lesson.lesson_title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getCategoryColor(lesson.category)}>
                            {lesson.category.replace('_', ' ')}
                          </Badge>
                          <span className="text-lg font-bold text-green-600">
                            +{lesson.success_rate_impact}% impacto
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{lesson.lesson_description}</p>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-medium mb-2">Recomendação de Alto Impacto:</h5>
                    <p className="text-sm">{lesson.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {getCategoryStats().map(({ category, count }) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {getCategoryIcon(category)}
                    <span className="capitalize">{category.replace('_', ' ')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Total de lições</span>
                      <Badge className={getCategoryColor(category)}>{count}</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {lessons
                        .filter(l => l.category === category)
                        .slice(0, 3)
                        .map(lesson => (
                        <div key={lesson.id} className="text-sm p-2 bg-gray-50 rounded">
                          <p className="font-medium">{lesson.lesson_title}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-gray-600">Confiança: {lesson.ai_confidence}%</span>
                            <span className="text-green-600 font-medium">+{lesson.success_rate_impact}%</span>
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

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Tendências e Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Tendência Principal:</strong> Projetos com metodologias híbridas apresentam 
                    31% mais chance de sucesso e 40% menos tempo de planejamento.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Users className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Comunicação:</strong> Ferramentas de IA para comunicação reduzem mal-entendidos 
                    em 52% e aumentam satisfação dos stakeholders.
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Principal Risco:</strong> 67% dos conflitos em parcerias são causados pela 
                    falta de definição clara de responsabilidades no início.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomatedLessonsLearned;
