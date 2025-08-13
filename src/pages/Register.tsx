
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Link, Navigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import UserTypeSelector from '@/components/UserTypeSelector';

const Register = () => {
  const { signUp, user, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedUserType, setSelectedUserType] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    user_type: '',
    // Dados organizacionais
    organization_name: '',
    cnpj: '',
    description: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    // Dados específicos por tipo
    expertise_area: [] as string[],
    certifications: [] as string[],
    specializations: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);

  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  const userTypeConfig = {
    professional: {
      title: 'Cadastro de Profissional',
      fields: ['first_name', 'last_name', 'email', 'password', 'phone', 'expertise_area', 'description']
    },
    company: {
      title: 'Cadastro de Empresa Farmacêutica',
      fields: ['organization_name', 'cnpj', 'email', 'password', 'phone', 'website', 'address', 'city', 'state', 'expertise_area', 'description']
    },
    laboratory: {
      title: 'Cadastro de Laboratório',
      fields: ['organization_name', 'cnpj', 'email', 'password', 'phone', 'website', 'address', 'city', 'state', 'certifications', 'specializations', 'description']
    },
    consultant: {
      title: 'Cadastro de Consultor',
      fields: ['first_name', 'last_name', 'email', 'password', 'phone', 'website', 'expertise_area', 'specializations', 'description']
    },
    regulatory_body: {
      title: 'Cadastro de Órgão Regulador',
      fields: ['organization_name', 'cnpj', 'email', 'password', 'phone', 'website', 'address', 'city', 'state', 'description']
    },
    sector_entity: {
      title: 'Cadastro de Entidade Setorial',
      fields: ['organization_name', 'cnpj', 'email', 'password', 'phone', 'website', 'address', 'city', 'state', 'description']
    },
    research_institution: {
      title: 'Cadastro de Instituição de Pesquisa',
      fields: ['organization_name', 'cnpj', 'email', 'password', 'phone', 'website', 'address', 'city', 'state', 'expertise_area', 'description']
    },
    supplier: {
      title: 'Cadastro de Fornecedor',
      fields: ['organization_name', 'cnpj', 'email', 'password', 'phone', 'website', 'address', 'city', 'state', 'expertise_area', 'description']
    },
    funding_agency: {
      title: 'Cadastro de Agência de Fomento',
      fields: ['organization_name', 'cnpj', 'email', 'password', 'phone', 'website', 'address', 'city', 'state', 'description']
    },
    healthcare_provider: {
      title: 'Cadastro de Prestador de Saúde',
      fields: ['organization_name', 'cnpj', 'email', 'password', 'phone', 'website', 'address', 'city', 'state', 'description']
    }
  };

  const handleUserTypeSelect = (userType: string) => {
    setSelectedUserType(userType);
    setFormData(prev => ({ ...prev, user_type: userType }));
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        user_type: formData.user_type,
        organization_name: formData.organization_name,
        cnpj: formData.cnpj,
        description: formData.description,
        phone: formData.phone,
        website: formData.website,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        expertise_area: formData.expertise_area,
        certifications: formData.certifications,
        specializations: formData.specializations
      };

      await signUp(formData.email, formData.password, userData);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormField = (fieldName: string) => {
    const commonProps = {
      value: formData[fieldName as keyof typeof formData],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        setFormData(prev => ({ ...prev, [fieldName]: e.target.value })),
      required: true
    };

    switch (fieldName) {
      case 'first_name':
        return (
          <div className="space-y-2">
            <Label htmlFor="first_name">Nome</Label>
            <Input id="first_name" {...commonProps} />
          </div>
        );
      case 'last_name':
        return (
          <div className="space-y-2">
            <Label htmlFor="last_name">Sobrenome</Label>
            <Input id="last_name" {...commonProps} />
          </div>
        );
      case 'organization_name':
        return (
          <div className="space-y-2">
            <Label htmlFor="organization_name">Nome da Organização</Label>
            <Input id="organization_name" {...commonProps} />
          </div>
        );
      case 'cnpj':
        return (
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ</Label>
            <Input id="cnpj" placeholder="00.000.000/0000-00" {...commonProps} />
          </div>
        );
      case 'email':
        return (
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...commonProps} />
          </div>
        );
      case 'password':
        return (
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" {...commonProps} />
          </div>
        );
      case 'phone':
        return (
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" placeholder="(11) 99999-9999" {...commonProps} />
          </div>
        );
      case 'website':
        return (
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input id="website" placeholder="https://..." {...commonProps} required={false} />
          </div>
        );
      case 'address':
        return (
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" {...commonProps} />
          </div>
        );
      case 'city':
        return (
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input id="city" {...commonProps} />
          </div>
        );
      case 'state':
        return (
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Input id="state" {...commonProps} />
          </div>
        );
      case 'description':
        return (
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              placeholder="Descreva sua organização, serviços ou expertise..."
              {...commonProps}
              required={false}
            />
          </div>
        );
      case 'expertise_area':
        return (
          <div className="space-y-2">
            <Label htmlFor="expertise_area">Áreas de Expertise</Label>
            <Input 
              id="expertise_area" 
              placeholder="Ex: Regulatório, Qualidade, P&D (separado por vírgulas)"
              value={formData.expertise_area.join(', ')}
              onChange={(e) => 
                setFormData(prev => ({ 
                  ...prev, 
                  expertise_area: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                }))
              }
            />
          </div>
        );
      case 'certifications':
        return (
          <div className="space-y-2">
            <Label htmlFor="certifications">Certificações</Label>
            <Input 
              id="certifications" 
              placeholder="Ex: ISO17025, GMP, BPL (separado por vírgulas)"
              value={formData.certifications.join(', ')}
              onChange={(e) => 
                setFormData(prev => ({ 
                  ...prev, 
                  certifications: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                }))
              }
            />
          </div>
        );
      case 'specializations':
        return (
          <div className="space-y-2">
            <Label htmlFor="specializations">Especializações</Label>
            <Input 
              id="specializations" 
              placeholder="Ex: Bioequivalência, Análise Microbiológica (separado por vírgulas)"
              value={formData.specializations.join(', ')}
              onChange={(e) => 
                setFormData(prev => ({ 
                  ...prev, 
                  specializations: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                }))
              }
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
        <div className="w-full max-w-4xl">
          <UserTypeSelector 
            onSelect={handleUserTypeSelect} 
            selectedType={selectedUserType} 
          />
        </div>
      </div>
    );
  }

  const config = userTypeConfig[selectedUserType as keyof typeof userTypeConfig];
  if (!config) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center space-x-4 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setStep(1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {config.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.fields.map(fieldName => (
                <div key={fieldName} className={fieldName === 'description' ? 'md:col-span-2' : ''}>
                  {renderFormField(fieldName)}
                </div>
              ))}
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cadastrar
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Já tem conta? Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
