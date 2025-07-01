
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Building, 
  FlaskConical, 
  UserCheck, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const OnboardingWizard = ({ onComplete }: { onComplete: () => void }) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Dados gerais
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    linkedin_url: profile?.linkedin_url || '',
    
    // Dados específicos por tipo
    company_name: '',
    cnpj: '',
    company_description: '',
    expertise_areas: [] as string[],
    
    lab_name: '',
    lab_location: '',
    certifications: [] as string[],
    equipment_list: [] as string[],
    
    consultant_expertise: [] as string[],
    consultant_location: '',
    hourly_rate: '',
    availability: 'Disponível'
  });

  const steps: OnboardingStep[] = [
    {
      id: 'profile',
      title: 'Perfil Pessoal',
      description: 'Complete suas informações pessoais',
      icon: User
    },
    {
      id: 'professional',
      title: 'Informações Profissionais',
      description: 'Adicione detalhes sobre sua atuação profissional',
      icon: profile?.user_type === 'company' ? Building : 
           profile?.user_type === 'laboratory' ? FlaskConical : UserCheck
    },
    {
      id: 'preferences',
      title: 'Preferências',
      description: 'Configure suas preferências da plataforma',
      icon: CheckCircle
    }
  ];

  const expertiseOptions = [
    'Assuntos Regulatórios',
    'Desenvolvimento Farmacêutico',
    'Controle de Qualidade',
    'Análises Clínicas',
    'Biotecnologia',
    'Medicamentos Genéricos',
    'Fitoterapia',
    'Medicamentos Biológicos',
    'Registro de Medicamentos',
    'Validação de Processos',
    'Consultoria Regulatória'
  ];

  const certificationOptions = [
    'ANVISA',
    'ISO 17025',
    'ISO 9001',
    'GMP',
    'GLP',
    'INMETRO',
    'CRF',
    'RAC',
    'DIA'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!profile) return;

    try {
      // Atualizar perfil pessoal
      await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          linkedin_url: formData.linkedin_url
        })
        .eq('id', profile.id);

      // Criar registro específico baseado no tipo de usuário
      if (profile.user_type === 'company') {
        await supabase.from('companies').insert({
          profile_id: profile.id,
          name: formData.company_name,
          cnpj: formData.cnpj,
          description: formData.company_description,
          expertise_area: formData.expertise_areas
        });
      } else if (profile.user_type === 'laboratory') {
        await supabase.from('laboratories').insert({
          profile_id: profile.id,
          name: formData.lab_name,
          location: formData.lab_location || 'Brasil',
          certifications: formData.certifications,
          equipment_list: formData.equipment_list,
          description: formData.company_description
        });
      } else if (profile.user_type === 'consultant') {
        await supabase.from('consultants').insert({
          profile_id: profile.id,
          expertise: formData.consultant_expertise,
          hourly_rate: parseFloat(formData.hourly_rate) || 0,
          availability: formData.availability,
          location: formData.consultant_location || 'Brasil',
          description: formData.company_description,
          certifications: formData.certifications
        });
      }

      toast({
        title: "Onboarding concluído!",
        description: "Seu perfil foi configurado com sucesso.",
      });

      onComplete();
    } catch (error) {
      console.error('Erro no onboarding:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar suas informações.",
        variant: "destructive"
      });
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Configuração Inicial</CardTitle>
            <Badge variant="outline">
              {currentStep + 1} de {steps.length}
            </Badge>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Step Header */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {React.createElement(steps[currentStep].icon, {
                  className: "h-8 w-8 text-primary-600"
                })}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600">
                {steps[currentStep].description}
              </p>
            </div>

            {/* Step Content */}
            <div className="space-y-4">
              {currentStep === 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome
                      </label>
                      <Input
                        value={formData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sobrenome
                      </label>
                      <Input
                        value={formData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        placeholder="Seu sobrenome"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn (opcional)
                    </label>
                    <Input
                      value={formData.linkedin_url}
                      onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                      placeholder="https://linkedin.com/in/seu-perfil"
                    />
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <>
                  {profile?.user_type === 'company' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome da Empresa
                        </label>
                        <Input
                          value={formData.company_name}
                          onChange={(e) => handleInputChange('company_name', e.target.value)}
                          placeholder="Nome da sua empresa"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CNPJ
                        </label>
                        <Input
                          value={formData.cnpj}
                          onChange={(e) => handleInputChange('cnpj', e.target.value)}
                          placeholder="00.000.000/0000-00"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descrição da Empresa
                        </label>
                        <Textarea
                          value={formData.company_description}
                          onChange={(e) => handleInputChange('company_description', e.target.value)}
                          placeholder="Descreva sua empresa e principais atividades..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Áreas de Expertise
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {expertiseOptions.map(option => (
                            <Badge
                              key={option}
                              variant={formData.expertise_areas.includes(option) ? 'default' : 'outline'}
                              className="cursor-pointer"
                              onClick={() => handleArrayToggle('expertise_areas', option)}
                            >
                              {option}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {profile?.user_type === 'laboratory' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome do Laboratório
                        </label>
                        <Input
                          value={formData.lab_name}
                          onChange={(e) => handleInputChange('lab_name', e.target.value)}
                          placeholder="Nome do seu laboratório"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Localização
                        </label>
                        <Input
                          value={formData.lab_location}
                          onChange={(e) => handleInputChange('lab_location', e.target.value)}
                          placeholder="Cidade, Estado"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Certificações
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {certificationOptions.map(option => (
                            <Badge
                              key={option}
                              variant={formData.certifications.includes(option) ? 'default' : 'outline'}
                              className="cursor-pointer"
                              onClick={() => handleArrayToggle('certifications', option)}
                            >
                              {option}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Equipamentos Principais
                        </label>
                        <Input
                          placeholder="Ex: HPLC, GC-MS, UV-Vis (separados por vírgula)"
                          onChange={(e) => handleInputChange('equipment_list', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descrição do Laboratório
                        </label>
                        <Textarea
                          value={formData.company_description}
                          onChange={(e) => handleInputChange('company_description', e.target.value)}
                          placeholder="Descreva seu laboratório e principais serviços..."
                          rows={3}
                        />
                      </div>
                    </>
                  )}

                  {profile?.user_type === 'consultant' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Áreas de Expertise
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {expertiseOptions.map(option => (
                            <Badge
                              key={option}
                              variant={formData.consultant_expertise.includes(option) ? 'default' : 'outline'}
                              className="cursor-pointer"
                              onClick={() => handleArrayToggle('consultant_expertise', option)}
                            >
                              {option}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Localização
                        </label>
                        <Input
                          value={formData.consultant_location}
                          onChange={(e) => handleInputChange('consultant_location', e.target.value)}
                          placeholder="Cidade, Estado"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valor Hora (R$)
                        </label>
                        <Input
                          type="number"
                          value={formData.hourly_rate}
                          onChange={(e) => handleInputChange('hourly_rate', e.target.value)}
                          placeholder="200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Certificações
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {certificationOptions.map(option => (
                            <Badge
                              key={option}
                              variant={formData.certifications.includes(option) ? 'default' : 'outline'}
                              className="cursor-pointer"
                              onClick={() => handleArrayToggle('certifications', option)}
                            >
                              {option}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sobre Você
                        </label>
                        <Textarea
                          value={formData.company_description}
                          onChange={(e) => handleInputChange('company_description', e.target.value)}
                          placeholder="Descreva sua experiência e especialidades..."
                          rows={3}
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {currentStep === 2 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Quase pronto!</h3>
                  <p className="text-gray-600 mb-4">
                    Suas informações foram configuradas. Você está pronto para 
                    começar a usar a PharmaConnect Brasil.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-700">
                      💡 Dica: Explore o menu de navegação para descobrir todas 
                      as funcionalidades disponíveis para seu tipo de conta.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext}>
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleComplete} className="bg-primary-600 hover:bg-primary-700">
                  Finalizar Configuração
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingWizard;
