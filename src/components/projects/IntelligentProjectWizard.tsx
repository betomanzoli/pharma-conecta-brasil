
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Brain, Target, Users, Calendar, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProjectWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: any) => void;
}

const IntelligentProjectWizard: React.FC<ProjectWizardProps> = ({ isOpen, onClose, onProjectCreated }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    objectives: '',
    budget_range: '',
    expected_timeline: '',
    required_expertise: [] as string[],
    project_type: ''
  });
  
  const [generatedEAP, setGeneratedEAP] = useState(null);
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [scheduleRecommendations, setScheduleRecommendations] = useState(null);

  const steps = [
    { title: 'Descrição do Projeto', icon: Brain },
    { title: 'IA Generativa - EAP', icon: Sparkles },
    { title: 'Análise de Riscos', icon: Target },
    { title: 'Cronograma Inteligente', icon: Calendar },
    { title: 'Finalização', icon: TrendingUp }
  ];

  const generateEAP = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-project-assistant', {
        body: {
          action: 'generate_eap',
          projectData: projectData
        }
      });

      if (error) throw error;

      setGeneratedEAP(data.eap);
      toast({
        title: "EAP Gerada com Sucesso",
        description: "A IA criou uma estrutura analítica para seu projeto."
      });
    } catch (error) {
      console.error('Error generating EAP:', error);
      toast({
        title: "Erro ao Gerar EAP",
        description: "Não foi possível gerar a estrutura do projeto.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeRisks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-project-assistant', {
        body: {
          action: 'analyze_risks',
          projectData: projectData,
          eap: generatedEAP
        }
      });

      if (error) throw error;

      setRiskAnalysis(data.risks);
      toast({
        title: "Análise de Riscos Concluída",
        description: "Identificamos riscos potenciais e estratégias de mitigação."
      });
    } catch (error) {
      console.error('Error analyzing risks:', error);
      toast({
        title: "Erro na Análise de Riscos",
        description: "Não foi possível analisar os riscos do projeto.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSchedule = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-project-assistant', {
        body: {
          action: 'generate_schedule',
          projectData: projectData,
          eap: generatedEAP,
          risks: riskAnalysis
        }
      });

      if (error) throw error;

      setScheduleRecommendations(data.schedule);
      toast({
        title: "Cronograma Inteligente Criado",
        description: "A IA otimizou o cronograma baseado em dados históricos."
      });
    } catch (error) {
      console.error('Error generating schedule:', error);
      toast({
        title: "Erro ao Gerar Cronograma",
        description: "Não foi possível criar o cronograma inteligente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1 && !generatedEAP) {
      await generateEAP();
    } else if (currentStep === 2 && !riskAnalysis) {
      await analyzeRisks();
    } else if (currentStep === 3 && !scheduleRecommendations) {
      await generateSchedule();
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const finalizeProject = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-project-assistant', {
        body: {
          action: 'create_intelligent_project',
          projectData: projectData,
          eap: generatedEAP,
          risks: riskAnalysis,
          schedule: scheduleRecommendations
        }
      });

      if (error) throw error;

      onProjectCreated(data.project);
      onClose();
      toast({
        title: "Projeto Inteligente Criado!",
        description: "Seu projeto foi criado com assistência completa da IA."
      });
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Erro ao Criar Projeto",
        description: "Não foi possível finalizar a criação do projeto.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle>Assistente de Projeto Inteligente</CardTitle>
          </div>
          <Progress value={(currentStep / (steps.length - 1)) * 100} className="mt-4" />
          
          <div className="flex items-center space-x-2 mt-2">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`p-2 rounded-full ${
                    index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200'
                  }`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-px w-8 ${
                      index < currentStep ? 'bg-primary' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardHeader>
        
        <CardContent>
          {currentStep === 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Descreva seu Projeto</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título do Projeto</label>
                  <Input
                    value={projectData.title}
                    onChange={(e) => setProjectData({...projectData, title: e.target.value})}
                    placeholder="Ex: Desenvolvimento de Formulação Inovadora"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <Textarea
                    value={projectData.description}
                    onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                    placeholder="Descreva os objetivos principais, escopo e contexto do projeto..."
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tipo de Projeto</label>
                    <Input
                      value={projectData.project_type}
                      onChange={(e) => setProjectData({...projectData, project_type: e.target.value})}
                      placeholder="Ex: P&D, Regulatório, Produção"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Orçamento Estimado</label>
                    <Input
                      value={projectData.budget_range}
                      onChange={(e) => setProjectData({...projectData, budget_range: e.target.value})}
                      placeholder="Ex: R$ 100.000 - R$ 500.000"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Prazo Esperado</label>
                  <Input
                    value={projectData.expected_timeline}
                    onChange={(e) => setProjectData({...projectData, expected_timeline: e.target.value})}
                    placeholder="Ex: 6 meses, 1 ano"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Estrutura Analítica do Projeto (EAP)</h3>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Gerando EAP com IA...</p>
                </div>
              ) : generatedEAP ? (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800">✨ EAP gerada com sucesso pela IA!</p>
                  </div>
                  {/* Render EAP visualization here */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(generatedEAP, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">A IA criará uma estrutura detalhada para seu projeto</p>
                  <Button onClick={generateEAP} disabled={loading}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Gerar EAP com IA
                  </Button>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-orange-500" />
                <h3 className="text-lg font-semibold">Análise Preditiva de Riscos</h3>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p>Analisando riscos potenciais...</p>
                </div>
              ) : riskAnalysis ? (
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-orange-800">🎯 Análise de riscos concluída!</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(riskAnalysis, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">A IA identificará riscos potenciais e estratégias de mitigação</p>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Cronograma Inteligente</h3>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p>Otimizando cronograma...</p>
                </div>
              ) : scheduleRecommendations ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800">📅 Cronograma otimizado com IA!</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(scheduleRecommendations, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">A IA criará um cronograma otimizado baseado em dados históricos</p>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold">Projeto Pronto!</h3>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-4">Resumo do Projeto Inteligente</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <p>✅ EAP completa gerada pela IA</p>
                  <p>✅ Análise preditiva de riscos realizada</p>
                  <p>✅ Cronograma otimizado criado</p>
                  <p>✅ Recomendações de melhores práticas incluídas</p>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={finalizeProject} 
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Criando...' : 'Criar Projeto Inteligente'}
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={currentStep === 0 ? onClose : handlePrevious}
            >
              {currentStep === 0 ? 'Cancelar' : 'Anterior'}
            </Button>
            
            {currentStep < steps.length - 1 && (
              <Button 
                onClick={handleNext}
                disabled={loading || (currentStep === 0 && !projectData.title)}
              >
                Próximo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligentProjectWizard;
