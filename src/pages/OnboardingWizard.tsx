
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, ArrowLeft, CheckCircle, Building, User, Microscope, Users, Target, BookOpen, MessageSquare, TrendingUp } from 'lucide-react';

const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    userType: '',
    company: '',
    role: '',
    experience: '',
    interests: [],
    goals: [],
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: false
    }
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps = [
    {
      title: 'Bem-vindo!',
      subtitle: 'Vamos configurar seu perfil',
      icon: CheckCircle
    },
    {
      title: 'Tipo de Usuário',
      subtitle: 'Como você se identifica?',
      icon: User
    },
    {
      title: 'Informações Profissionais',
      subtitle: 'Conte-nos sobre sua experiência',
      icon: Building
    },
    {
      title: 'Interesses',
      subtitle: 'O que te interessa na plataforma?',
      icon: Target
    },
    {
      title: 'Objetivos',
      subtitle: 'O que você espera alcançar?',
      icon: TrendingUp
    },
    {
      title: 'Preferências',
      subtitle: 'Como você gostaria de ser contatado?',
      icon: MessageSquare
    },
    {
      title: 'Concluído!',
      subtitle: 'Tudo pronto para começar',
      icon: CheckCircle
    }
  ];

  const userTypes = [
    {
      id: 'pharmaceutical_company',
      name: 'Empresa Farmacêutica',
      description: 'Desenvolvo ou produzo medicamentos e produtos farmacêuticos',
      icon: Building,
      color: 'bg-blue-500'
    },
    {
      id: 'laboratory',
      name: 'Laboratório',
      description: 'Ofereço serviços de análise e testes laboratoriais',
      icon: Microscope,
      color: 'bg-green-500'
    },
    {
      id: 'consultant',
      name: 'Consultor',
      description: 'Prestou consultoria em assuntos regulatórios e técnicos',
      icon: User,
      color: 'bg-purple-500'
    },
    {
      id: 'individual',
      name: 'Profissional Individual',
      description: 'Trabalho na área farmacêutica como pessoa física',
      icon: User,
      color: 'bg-orange-500'
    }
  ];

  const interests = [
    'Alertas Regulatórios',
    'Networking Profissional',
    'Mentoria',
    'Biblioteca de Conhecimento',
    'Fóruns de Discussão',
    'Integrações com APIs',
    'Analytics e Relatórios',
    'Marketplace de Serviços',
    'Eventos e Webinars',
    'Oportunidades de Negócio'
  ];

  const goals = [
    'Expandir minha rede profissional',
    'Manter-me atualizado com regulamentações',
    'Encontrar oportunidades de negócio',
    'Compartilhar conhecimento',
    'Aprender com especialistas',
    'Automatizar processos',
    'Melhorar compliance',
    'Aumentar visibilidade profissional',
    'Encontrar parceiros estratégicos',
    'Acessar recursos especializados'
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Atualizar perfil do usuário
        await supabase
          .from('profiles')
          .update({
            user_type: formData.userType,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        // Criar registro de preferências de notificação
        await supabase
          .from('notification_preferences')
          .insert([{
            user_id: user.id,
            system_enabled: formData.preferences.emailNotifications,
            mentorship_enabled: formData.preferences.emailNotifications,
            forum_enabled: formData.preferences.emailNotifications,
            knowledge_enabled: formData.preferences.emailNotifications
          }]);

        // Criar achievement de primeiro acesso
        await supabase
          .from('user_achievements')
          .insert([{
            user_id: user.id,
            achievement_type: 'milestone',
            achievement_name: 'Primeiro Acesso',
            points: 100,
            metadata: {
              description: 'Completou o onboarding da plataforma',
              category: 'getting_started'
            }
          }]);

        toast({
          title: "Onboarding concluído!",
          description: "Bem-vindo à plataforma. Você ganhou 100 pontos!",
        });

        // Redirecionar para dashboard apropriado
        const dashboardRoute = getDashboardRoute(formData.userType);
        navigate(dashboardRoute);
      }
    } catch (error) {
      console.error('Erro ao finalizar onboarding:', error);
      toast({
        title: "Erro ao finalizar configuração",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const getDashboardRoute = (userType) => {
    switch (userType) {
      case 'pharmaceutical_company':
        return '/dashboard/company';
      case 'laboratory':
        return '/dashboard/laboratory';
      case 'consultant':
        return '/dashboard/consultant';
      default:
        return '/dashboard/general';
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleGoal = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Bem-vindo à Plataforma!</h2>
              <p className="text-muted-foreground">
                Vamos configurar seu perfil para que você tenha a melhor experiência possível.
                Este processo leva apenas alguns minutos.
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 Dica: Quanto mais informações você fornecer, melhor será a personalização da plataforma para suas necessidades.
              </p>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Como você se identifica?</h2>
              <p className="text-muted-foreground">Selecione o tipo que melhor descreve sua atividade profissional</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userTypes.map(type => {
                const Icon = type.icon;
                return (
                  <Card 
                    key={type.id} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      formData.userType === type.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => updateFormData('userType', type.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${type.color}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{type.name}</h3>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Informações Profissionais</h2>
              <p className="text-muted-foreground">Conte-nos mais sobre sua experiência profissional</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="company">Empresa/Organização</Label>
                <Input 
                  id="company"
                  value={formData.company}
                  onChange={(e) => updateFormData('company', e.target.value)}
                  placeholder="Nome da sua empresa ou organização"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Cargo/Função</Label>
                <Input 
                  id="role"
                  value={formData.role}
                  onChange={(e) => updateFormData('role', e.target.value)}
                  placeholder="Seu cargo ou função atual"
                />
              </div>
              
              <div>
                <Label htmlFor="experience">Tempo de Experiência</Label>
                <Select value={formData.experience} onValueChange={(value) => updateFormData('experience', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu tempo de experiência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">Menos de 1 ano</SelectItem>
                    <SelectItem value="1-3">1-3 anos</SelectItem>
                    <SelectItem value="3-5">3-5 anos</SelectItem>
                    <SelectItem value="5-10">5-10 anos</SelectItem>
                    <SelectItem value="10+">Mais de 10 anos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Seus Interesses</h2>
              <p className="text-muted-foreground">Selecione as áreas que mais te interessam na plataforma</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interests.map(interest => (
                <div
                  key={interest}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    formData.interests.includes(interest) 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-white border-gray-200'
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={formData.interests.includes(interest)}
                      onChange={() => toggleInterest(interest)}
                    />
                    <span className="text-sm">{interest}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Seus Objetivos</h2>
              <p className="text-muted-foreground">O que você espera alcançar usando nossa plataforma?</p>
            </div>
            <div className="space-y-3">
              {goals.map(goal => (
                <div
                  key={goal}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    formData.goals.includes(goal) 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200'
                  }`}
                  onClick={() => toggleGoal(goal)}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={formData.goals.includes(goal)}
                      onChange={() => toggleGoal(goal)}
                    />
                    <span>{goal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Preferências de Notificação</h2>
              <p className="text-muted-foreground">Como você gostaria de receber atualizações?</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="email"
                  checked={formData.preferences.emailNotifications}
                  onCheckedChange={(checked) => 
                    updateFormData('preferences', { 
                      ...formData.preferences, 
                      emailNotifications: checked 
                    })
                  }
                />
                <Label htmlFor="email" className="flex-1">
                  <div>
                    <div className="font-medium">Notificações por Email</div>
                    <div className="text-sm text-muted-foreground">
                      Receba atualizações importantes por email
                    </div>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="sms"
                  checked={formData.preferences.smsNotifications}
                  onCheckedChange={(checked) => 
                    updateFormData('preferences', { 
                      ...formData.preferences, 
                      smsNotifications: checked 
                    })
                  }
                />
                <Label htmlFor="sms" className="flex-1">
                  <div>
                    <div className="font-medium">Notificações por SMS</div>
                    <div className="text-sm text-muted-foreground">
                      Receba alertas urgentes por SMS
                    </div>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="marketing"
                  checked={formData.preferences.marketingEmails}
                  onCheckedChange={(checked) => 
                    updateFormData('preferences', { 
                      ...formData.preferences, 
                      marketingEmails: checked 
                    })
                  }
                />
                <Label htmlFor="marketing" className="flex-1">
                  <div>
                    <div className="font-medium">Emails de Marketing</div>
                    <div className="text-sm text-muted-foreground">
                      Receba dicas, novidades e conteúdo exclusivo
                    </div>
                  </div>
                </Label>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Tudo Pronto!</h2>
              <p className="text-muted-foreground mb-4">
                Seu perfil foi configurado com sucesso. Agora você pode aproveitar ao máximo nossa plataforma.
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  🎉 Parabéns! Você ganhou 100 pontos por completar o onboarding!
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 bg-blue-50 rounded-lg">
                <BookOpen className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="font-semibold">Explore o Conhecimento</h3>
                <p className="text-sm text-muted-foreground">
                  Acesse nossa biblioteca com recursos especializados
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <Users className="h-8 w-8 text-purple-500 mb-2" />
                <h3 className="font-semibold">Conecte-se</h3>
                <p className="text-sm text-muted-foreground">
                  Expanda sua rede profissional
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-orange-500 mb-2" />
                <h3 className="font-semibold">Cresça</h3>
                <p className="text-sm text-muted-foreground">
                  Encontre oportunidades de negócio
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.userType !== '';
      case 2:
        return formData.company !== '' && formData.role !== '';
      case 3:
        return formData.interests.length > 0;
      case 4:
        return formData.goals.length > 0;
      default:
        return true;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-2">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 mx-2 ${
                        index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Progress value={progress} className="w-full mb-4" />
            <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].subtitle}</CardDescription>
          </CardHeader>
          
          <CardContent className="pb-6">
            <div className="min-h-[400px]">
              {renderStep()}
            </div>
          </CardContent>
          
          <div className="flex justify-between p-6 border-t">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            
            <div className="flex space-x-2">
              {currentStep < steps.length - 1 ? (
                <Button 
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleFinish}>
                  Finalizar
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingWizard;
