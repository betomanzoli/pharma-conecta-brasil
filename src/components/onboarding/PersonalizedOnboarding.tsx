
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Building, 
  FlaskConical, 
  UserCog, 
  User, 
  MapPin, 
  Phone, 
  Globe, 
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface PersonalizedOnboardingProps {
  onComplete?: () => void;
}

const PersonalizedOnboarding: React.FC<PersonalizedOnboardingProps> = ({ onComplete }) => {
  const { profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    userType: profile?.user_type || '',
    companyName: '',
    cnpj: '',
    description: '',
    website: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    expertiseAreas: [] as string[],
    specializations: [] as string[],
    certifications: [] as string[],
    industrialSegment: '',
    subsegment: ''
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const expertiseOptions = [
    'Desenvolvimento de Medicamentos',
    'Análises Laboratoriais',
    'Registro ANVISA',
    'Consultoria Regulatória',
    'P&D Farmacêutico',
    'Controle de Qualidade',
    'Validação de Processos',
    'Farmacovigilância'
  ];

  const segmentOptions = [
    'Medicamentos',
    'Cosméticos',
    'Saneantes',
    'Alimentos',
    'Dispositivos Médicos',
    'Produtos Biológicos'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleArrayItem = (field: string, item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(item)
        ? (prev[field as keyof typeof prev] as string[]).filter(i => i !== item)
        : [...(prev[field as keyof typeof prev] as string[]), item]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    try {
      if (formData.userType === 'company') {
        await supabase
          .from('companies')
          .upsert({
            profile_id: profile?.id,
            name: formData.companyName,
            cnpj: formData.cnpj,
            description: formData.description,
            website: formData.website,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zipCode,
            expertise_area: formData.expertiseAreas,
            industrial_segment: formData.industrialSegment,
            subsegment: formData.subsegment
          });
      } else if (formData.userType === 'laboratory') {
        await supabase
          .from('laboratories')
          .upsert({
            profile_id: profile?.id,
            name: formData.companyName,
            description: formData.description,
            website: formData.website,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zipCode,
            certifications: formData.certifications,
            specializations: formData.specializations,
            industrial_segment: formData.industrialSegment,
            subsegment: formData.subsegment,
            location: `${formData.city}, ${formData.state}`
          });
      }

      toast.success('Onboarding Completo!', {
        description: 'Seu perfil foi configurado com sucesso.'
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Erro ao salvar dados do onboarding:', error);
      toast.error('Erro ao salvar dados', {
        description: 'Tente novamente mais tarde.'
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Tipo de Usuário</h3>
              <p className="text-muted-foreground">Como você pretende usar a plataforma?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'company', label: 'Empresa Farmacêutica', icon: Building, desc: 'Desenvolvo produtos farmacêuticos' },
                { value: 'laboratory', label: 'Laboratório', icon: FlaskConical, desc: 'Ofereço serviços de análise' },
                { value: 'consultant', label: 'Consultor', icon: UserCog, desc: 'Presto consultoria especializada' },
                { value: 'individual', label: 'Profissional', icon: User, desc: 'Sou um profissional da área' }
              ].map((type) => (
                <Card 
                  key={type.value}
                  className={`cursor-pointer transition-all ${formData.userType === type.value ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => handleInputChange('userType', type.value)}
                >
                  <CardContent className="p-4 text-center">
                    <type.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold">{type.label}</h4>
                    <p className="text-sm text-muted-foreground">{type.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Informações da Organização</h3>
              <p className="text-muted-foreground">Conte-nos sobre sua empresa/organização</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Nome da Organização *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Nome da sua empresa/laboratório"
                />
              </div>
              
              {formData.userType === 'company' && (
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => handleInputChange('cnpj', e.target.value)}
                    placeholder="00.000.000/0001-00"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://exemplo.com.br"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descreva sua organização, serviços e expertise..."
                rows={4}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Localização</h3>
              <p className="text-muted-foreground">Onde sua organização está localizada?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Rua, número, bairro"
                />
              </div>
              
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="São Paulo"
                />
              </div>
              
              <div>
                <Label htmlFor="state">Estado</Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'CE'].map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="00000-000"
                />
              </div>
              
              <div>
                <Label htmlFor="segment">Segmento Industrial</Label>
                <Select value={formData.industrialSegment} onValueChange={(value) => handleInputChange('industrialSegment', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o segmento" />
                  </SelectTrigger>
                  <SelectContent>
                    {segmentOptions.map(segment => (
                      <SelectItem key={segment} value={segment}>{segment}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Áreas de Expertise</h3>
              <p className="text-muted-foreground">Selecione suas áreas de especialização</p>
            </div>
            
            <div>
              <Label>Áreas de Expertise</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {expertiseOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.expertiseAreas.includes(option)}
                      onCheckedChange={() => toggleArrayItem('expertiseAreas', option)}
                    />
                    <span className="text-sm">{option}</span>
                  </div>
                ))}
              </div>
            </div>

            {formData.userType === 'laboratory' && (
              <div>
                <Label>Certificações</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['ISO 17025', 'ANVISA', 'INMETRO', 'CAP', 'GLP'].map(cert => (
                    <Badge
                      key={cert}
                      variant={formData.certifications.includes(cert) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem('certifications', cert)}
                    >
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Passo {currentStep} de {totalSteps}</span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% completo</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        {currentStep < totalSteps ? (
          <Button
            onClick={nextStep}
            disabled={currentStep === 1 && !formData.userType}
          >
            Próximo
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            disabled={!formData.companyName}
            className="bg-primary"
          >
            Finalizar
            <CheckCircle className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default PersonalizedOnboarding;
