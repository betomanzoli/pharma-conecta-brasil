
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Rocket, 
  User, 
  Building, 
  Target, 
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
}

const StartHerePage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    company_name: '',
    industry: '',
    company_size: '',
    main_challenges: '',
    primary_goals: '',
    timeline: '',
    budget_range: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bem-vindo ao PharmaConnect',
      description: 'Vamos configurar sua experiência personalizada',
      icon: Rocket,
      completed: false
    },
    {
      id: 'company',
      title: 'Sobre sua Empresa',
      description: 'Conte-nos sobre seu negócio',
      icon: Building,
      completed: false
    },
    {
      id: 'goals',
      title: 'Objetivos e Desafios',
      description: 'O que você quer alcançar?',
      icon: Target,
      completed: false
    },
    {
      id: 'analysis',
      title: 'Análise Inicial',
      description: 'Vamos analisar suas necessidades',
      icon: Sparkles,
      completed: false
    }
  ];

  const industries = [
    'Farmacêutica',
    'Biotecnologia',
    'Dispositivos Médicos',
    'Cosméticos',
    'Suplementos',
    'Pesquisa & Desenvolvimento',
    'Consultoria Regulatória',
    'Laboratório de Análises',
    'Outro'
  ];

  const companySizes = [
    'Startup (1-10 funcionários)',
    'Pequena (11-50 funcionários)',
    'Média (51-200 funcionários)',
    'Grande (201+ funcionários)'
  ];

  const budgetRanges = [
    'Até R$ 50.000',
    'R$ 50.000 - R$ 200.000',
    'R$ 200.000 - R$ 500.000',
    'Acima de R$ 500.000'
  ];

  const timelines = [
    '3 meses',
    '6 meses',
    '12 meses',
    '18+ meses'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    setIsProcessing(true);
    
    try {
      // Salvar dados de onboarding
      if (profile) {
        const { error } = await supabase
          .from('user_onboarding_data')
          .upsert({
            user_id: profile.id,
            onboarding_data: userData,
            completed_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      // Executar análise inicial com Project Analyst
      const { data, error } = await supabase.functions.invoke('ai-project-analyst', {
        body: {
          company_name: userData.company_name,
          industry: userData.industry,
          goals: userData.primary_goals,
          challenges: userData.main_challenges,
          timeline: userData.timeline,
          budget: userData.budget_range,
          context: 'onboarding_analysis'
        }
      });

      if (error) throw error;

      toast({
        title: "Análise inicial concluída!",
        description: "Redirecionando para seu dashboard personalizado...",
      });

      // Redirecionar para dashboard após alguns segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error in onboarding:', error);
      toast({
        title: "Bem-vindo à plataforma!",
        description: "Redirecionando para o dashboard...",
      });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } finally {
      setIsProcessing(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <Rocket className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">Comece Aqui</h1>
          </div>
          <p className="text-muted-foreground">Configure sua experiência personalizada no PharmaConnect</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Progresso do Setup</span>
            <span className="text-sm text-muted-foreground">{currentStep + 1} de {steps.length}</span>
          </div>
          <Progress value={progress} className="h-3" />
          
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  index <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < currentStep ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                </div>
                <span className="text-xs mt-2 text-center max-w-20">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-500 text-white">
                <StepIcon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>{currentStepData.title}</CardTitle>
                <p className="text-muted-foreground">{currentStepData.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">🎉 Bem-vindo à Plataforma Mais Avançada do Setor Farmacêutico!</h3>
                  <p className="text-muted-foreground mb-6">
                    O PharmaConnect usa IA avançada para conectar empresas, otimizar processos e acelerar inovações. 
                    Vamos personalizar sua experiência em alguns passos simples.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                    <h4 className="font-medium">Matching Inteligente</h4>
                    <p className="text-sm text-muted-foreground">IA conecta você com parceiros ideais</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Target className="h-8 w-8 mx-auto text-green-500 mb-2" />
                    <h4 className="font-medium">Agentes Especializados</h4>
                    <p className="text-sm text-muted-foreground">Assistentes AI para cada área</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Sparkles className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                    <h4 className="font-medium">Automação Completa</h4>
                    <p className="text-sm text-muted-foreground">Workflows inteligentes e eficientes</p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nome da Empresa *</label>
                    <Input
                      placeholder="Digite o nome da sua empresa"
                      value={userData.company_name}
                      onChange={(e) => setUserData(prev => ({ ...prev, company_name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Setor *</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={userData.industry}
                      onChange={(e) => setUserData(prev => ({ ...prev, industry: e.target.value }))}
                    >
                      <option value="">Selecione o setor</option>
                      {industries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Tamanho da Empresa</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={userData.company_size}
                    onChange={(e) => setUserData(prev => ({ ...prev, company_size: e.target.value }))}
                  >
                    <option value="">Selecione o tamanho</option>
                    {companySizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Principais Desafios *</label>
                  <Textarea
                    placeholder="Descreva os principais desafios que sua empresa enfrenta..."
                    value={userData.main_challenges}
                    onChange={(e) => setUserData(prev => ({ ...prev, main_challenges: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Objetivos Principais *</label>
                  <Textarea
                    placeholder="O que você espera alcançar com a plataforma?"
                    value={userData.primary_goals}
                    onChange={(e) => setUserData(prev => ({ ...prev, primary_goals: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Prazo</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={userData.timeline}
                      onChange={(e) => setUserData(prev => ({ ...prev, timeline: e.target.value }))}
                    >
                      <option value="">Selecione o prazo</option>
                      {timelines.map(timeline => (
                        <option key={timeline} value={timeline}>{timeline}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Orçamento</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={userData.budget_range}
                      onChange={(e) => setUserData(prev => ({ ...prev, budget_range: e.target.value }))}
                    >
                      <option value="">Selecione a faixa</option>
                      {budgetRanges.map(budget => (
                        <option key={budget} value={budget}>{budget}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">🚀 Pronto para Começar!</h3>
                  <p className="text-muted-foreground mb-4">
                    Vamos executar uma análise inicial com nossos agentes AI para criar 
                    recomendações personalizadas para sua empresa.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">O que acontecerá:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>✓ Análise dos seus dados pelo Project Analyst AI</li>
                    <li>✓ Identificação de oportunidades de parceria</li>
                    <li>✓ Sugestões de próximos passos personalizadas</li>
                    <li>✓ Setup do seu dashboard personalizado</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Empresa:</strong> {userData.company_name}
                  </div>
                  <div>
                    <strong>Setor:</strong> {userData.industry}
                  </div>
                  <div className="col-span-2">
                    <strong>Objetivos:</strong> {userData.primary_goals?.substring(0, 100)}...
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Voltar
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button 
              onClick={handleNext}
              disabled={
                (currentStep === 1 && (!userData.company_name || !userData.industry)) ||
                (currentStep === 2 && (!userData.main_challenges || !userData.primary_goals))
              }
            >
              Próximo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleFinish}
              disabled={isProcessing}
              className="bg-gradient-to-r from-blue-500 to-purple-500"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isProcessing ? 'Executando Análise...' : 'Começar Jornada'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartHerePage;
