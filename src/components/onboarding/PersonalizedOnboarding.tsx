
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Building, 
  FlaskConical, 
  Users, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  BookOpen,
  Target,
  Trophy,
  Play
} from 'lucide-react';

interface UserSegment {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  onboardingSteps: OnboardingStep[];
  features: string[];
  tutorials: Tutorial[];
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  completed: boolean;
  required: boolean;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  completed: boolean;
}

const PersonalizedOnboarding = () => {
  const [selectedSegment, setSelectedSegment] = useState<UserSegment | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    name: '',
    company: '',
    role: '',
    experience: '',
    goals: [] as string[]
  });

  const segments: UserSegment[] = [
    {
      id: 'pharmaceutical',
      name: 'Empresa Farmacêutica',
      description: 'Desenvolva medicamentos inovadores com parceiros qualificados',
      icon: <Building className="h-6 w-6" />,
      onboardingSteps: [
        {
          id: 'profile',
          title: 'Perfil da Empresa',
          description: 'Configure o perfil da sua empresa farmacêutica',
          component: <ProfileSetup />,
          completed: false,
          required: true
        },
        {
          id: 'expertise',
          title: 'Áreas de Expertise',
          description: 'Defina suas áreas de especialização',
          component: <ExpertiseSetup />,
          completed: false,
          required: true
        },
        {
          id: 'matching',
          title: 'AI Matching',
          description: 'Configure preferências de matching',
          component: <MatchingSetup />,
          completed: false,
          required: false
        }
      ],
      features: ['AI Matching', 'Gestão de Projetos', 'Compliance ANVISA', 'Análise de ROI'],
      tutorials: [
        {
          id: '1',
          title: 'Como Usar o AI Matching',
          description: 'Aprenda a encontrar parceiros ideais',
          duration: 15,
          difficulty: 'beginner',
          category: 'matching',
          completed: false
        },
        {
          id: '2',
          title: 'Gestão de Projetos Farmacêuticos',
          description: 'Gerencie projetos complexos com eficiência',
          duration: 25,
          difficulty: 'intermediate',
          category: 'projects',
          completed: false
        }
      ]
    },
    {
      id: 'laboratory',
      name: 'Laboratório',
      description: 'Ofereça serviços especializados e amplie sua rede',
      icon: <FlaskConical className="h-6 w-6" />,
      onboardingSteps: [
        {
          id: 'lab_profile',
          title: 'Perfil do Laboratório',
          description: 'Configure o perfil do seu laboratório',
          component: <LabProfileSetup />,
          completed: false,
          required: true
        },
        {
          id: 'services',
          title: 'Serviços Oferecidos',
          description: 'Defina os serviços que você oferece',
          component: <ServicesSetup />,
          completed: false,
          required: true
        },
        {
          id: 'capacity',
          title: 'Capacidade e Agenda',
          description: 'Configure sua capacidade e disponibilidade',
          component: <CapacitySetup />,
          completed: false,
          required: false
        }
      ],
      features: ['Marketplace de Serviços', 'Gestão de Capacidade', 'Certificações', 'Relatórios'],
      tutorials: [
        {
          id: '3',
          title: 'Configurar Serviços no Marketplace',
          description: 'Como listar e gerenciar seus serviços',
          duration: 20,
          difficulty: 'beginner',
          category: 'marketplace',
          completed: false
        },
        {
          id: '4',
          title: 'Gestão de Capacidade Avançada',
          description: 'Otimize sua agenda e recursos',
          duration: 30,
          difficulty: 'advanced',
          category: 'capacity',
          completed: false
        }
      ]
    },
    {
      id: 'consultant',
      name: 'Consultor',
      description: 'Conecte-se com projetos e empresas que precisam da sua expertise',
      icon: <User className="h-6 w-6" />,
      onboardingSteps: [
        {
          id: 'consultant_profile',
          title: 'Perfil Profissional',
          description: 'Configure seu perfil como consultor',
          component: <ConsultantProfileSetup />,
          completed: false,
          required: true
        },
        {
          id: 'specializations',
          title: 'Especializações',
          description: 'Defina suas áreas de especialização',
          component: <SpecializationsSetup />,
          completed: false,
          required: true
        },
        {
          id: 'availability',
          title: 'Disponibilidade',
          description: 'Configure sua disponibilidade e tarifas',
          component: <AvailabilitySetup />,
          completed: false,
          required: false
        }
      ],
      features: ['Matching de Projetos', 'Gestão de Clientes', 'Portfólio', 'Faturamento'],
      tutorials: [
        {
          id: '5',
          title: 'Construindo seu Portfólio',
          description: 'Crie um portfólio atrativo',
          duration: 15,
          difficulty: 'beginner',
          category: 'portfolio',
          completed: false
        },
        {
          id: '6',
          title: 'Negociação e Contratos',
          description: 'Melhores práticas para negociação',
          duration: 35,
          difficulty: 'advanced',
          category: 'business',
          completed: false
        }
      ]
    }
  ];

  const handleSegmentSelect = (segment: UserSegment) => {
    setSelectedSegment(segment);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (selectedSegment && currentStep < selectedSegment.onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getProgress = () => {
    if (!selectedSegment) return 0;
    const completedSteps = selectedSegment.onboardingSteps.filter(step => step.completed).length;
    return (completedSteps / selectedSegment.onboardingSteps.length) * 100;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!selectedSegment) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Bem-vindo à PharmaConnect Brasil</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Vamos começar!</h2>
              <p className="text-gray-600">
                Selecione seu perfil para personalizar sua experiência na plataforma
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {segments.map((segment) => (
                <Card 
                  key={segment.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
                  onClick={() => handleSegmentSelect(segment)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        {segment.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{segment.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{segment.description}</p>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-700">Principais recursos:</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {segment.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {selectedSegment.icon}
              <span>Onboarding - {selectedSegment.name}</span>
            </div>
            <Badge variant="outline">
              {currentStep + 1} de {selectedSegment.onboardingSteps.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progresso</span>
              <span className="text-sm text-gray-600">{Math.round(getProgress())}%</span>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </div>

          <Tabs defaultValue="onboarding" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="onboarding">Configuração</TabsTrigger>
              <TabsTrigger value="tutorials">Tutoriais</TabsTrigger>
              <TabsTrigger value="resources">Recursos</TabsTrigger>
            </TabsList>

            <TabsContent value="onboarding" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {currentStep + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {selectedSegment.onboardingSteps[currentStep].title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedSegment.onboardingSteps[currentStep].description}
                    </p>
                  </div>
                  {selectedSegment.onboardingSteps[currentStep].required && (
                    <Badge variant="destructive">Obrigatório</Badge>
                  )}
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  {selectedSegment.onboardingSteps[currentStep].component}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                  >
                    Anterior
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedSegment(null)}
                    >
                      Voltar ao Início
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      disabled={currentStep === selectedSegment.onboardingSteps.length - 1}
                    >
                      Próximo
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tutorials" className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Tutoriais Recomendados</h3>
                <p className="text-sm text-gray-600">
                  Aprenda a usar todos os recursos da plataforma com nossos tutoriais interativos
                </p>
              </div>

              <div className="space-y-3">
                {selectedSegment.tutorials.map((tutorial) => (
                  <Card key={tutorial.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Play className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{tutorial.title}</h4>
                            <p className="text-sm text-gray-600">{tutorial.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {tutorial.duration} min
                              </span>
                              <Badge className={getDifficultyColor(tutorial.difficulty)}>
                                {tutorial.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {tutorial.completed && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          <Button variant="outline" size="sm">
                            {tutorial.completed ? 'Revisar' : 'Iniciar'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <span>Documentação</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Guia de Início Rápido</span>
                        <Button variant="outline" size="sm">Ver</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">API Documentation</span>
                        <Button variant="outline" size="sm">Ver</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Melhores Práticas</span>
                        <Button variant="outline" size="sm">Ver</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Users className="h-5 w-5 text-green-600" />
                      <span>Suporte</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Chat ao Vivo</span>
                        <Button variant="outline" size="sm">Iniciar</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Centro de Ajuda</span>
                        <Button variant="outline" size="sm">Visitar</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Comunidade</span>
                        <Button variant="outline" size="sm">Participar</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription>
                  <strong>Dica:</strong> Complete todos os tutoriais para desbloquear recursos avançados 
                  e ganhar pontos no sistema de gamificação da plataforma.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Componentes de configuração específicos para cada segmento
const ProfileSetup = () => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="company-name">Nome da Empresa</Label>
      <Input id="company-name" placeholder="Digite o nome da sua empresa" />
    </div>
    <div>
      <Label htmlFor="cnpj">CNPJ</Label>
      <Input id="cnpj" placeholder="00.000.000/0000-00" />
    </div>
    <div>
      <Label htmlFor="description">Descrição</Label>
      <Input id="description" placeholder="Descreva sua empresa e principais atividades" />
    </div>
  </div>
);

const ExpertiseSetup = () => (
  <div className="space-y-4">
    <Label>Selecione suas áreas de expertise:</Label>
    <div className="grid grid-cols-2 gap-2">
      {['Oncologia', 'Cardiologia', 'Neurologia', 'Dermatologia', 'Pediatria', 'Geriatria'].map((area) => (
        <label key={area} className="flex items-center space-x-2">
          <input type="checkbox" />
          <span className="text-sm">{area}</span>
        </label>
      ))}
    </div>
  </div>
);

const MatchingSetup = () => (
  <div className="space-y-4">
    <Label>Preferências de Matching:</Label>
    <div className="space-y-2">
      <label className="flex items-center space-x-2">
        <input type="checkbox" />
        <span className="text-sm">Receber notificações de novos matches</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="checkbox" />
        <span className="text-sm">Permitir matching automático</span>
      </label>
    </div>
  </div>
);

const LabProfileSetup = () => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="lab-name">Nome do Laboratório</Label>
      <Input id="lab-name" placeholder="Digite o nome do seu laboratório" />
    </div>
    <div>
      <Label htmlFor="certifications">Certificações</Label>
      <Input id="certifications" placeholder="ISO, ANVISA, etc." />
    </div>
  </div>
);

const ServicesSetup = () => (
  <div className="space-y-4">
    <Label>Serviços oferecidos:</Label>
    <div className="grid grid-cols-2 gap-2">
      {['Análises Clínicas', 'Microbiologia', 'Química', 'Toxicologia'].map((service) => (
        <label key={service} className="flex items-center space-x-2">
          <input type="checkbox" />
          <span className="text-sm">{service}</span>
        </label>
      ))}
    </div>
  </div>
);

const CapacitySetup = () => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="capacity">Capacidade Mensal</Label>
      <Input id="capacity" type="number" placeholder="Número de análises por mês" />
    </div>
  </div>
);

const ConsultantProfileSetup = () => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="consultant-name">Nome Completo</Label>
      <Input id="consultant-name" placeholder="Seu nome completo" />
    </div>
    <div>
      <Label htmlFor="experience">Anos de Experiência</Label>
      <Input id="experience" type="number" placeholder="Quantos anos de experiência" />
    </div>
  </div>
);

const SpecializationsSetup = () => (
  <div className="space-y-4">
    <Label>Suas especializações:</Label>
    <div className="grid grid-cols-2 gap-2">
      {['Regulatório', 'Qualidade', 'P&D', 'Assuntos Clínicos'].map((spec) => (
        <label key={spec} className="flex items-center space-x-2">
          <input type="checkbox" />
          <span className="text-sm">{spec}</span>
        </label>
      ))}
    </div>
  </div>
);

const AvailabilitySetup = () => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="hourly-rate">Valor Hora (R$)</Label>
      <Input id="hourly-rate" type="number" placeholder="Seu valor por hora" />
    </div>
    <div>
      <Label htmlFor="availability">Disponibilidade Semanal</Label>
      <Input id="availability" type="number" placeholder="Horas por semana" />
    </div>
  </div>
);

export default PersonalizedOnboarding;
