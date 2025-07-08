import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Globe, 
  Building2, 
  Award, 
  CheckCircle,
  Edit,
  Save,
  X,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CompanyProfile {
  id: string;
  name: string;
  cnpj: string;
  description: string;
  website: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  expertise_area: string[];
  compliance_status: string;
  anvisa_certification: boolean;
  social_media: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  tags: string[];
}

const BrazilianCompanyProfile = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyProfile>({
    id: '',
    name: 'PharmaConnect Brasil',
    cnpj: '00.000.000/0001-00',
    description: 'A primeira plataforma colaborativa da indústria farmacêutica brasileira, conectando laboratórios, empresas, consultores e profissionais através de IA avançada e aprendizado federado.',
    website: 'https://pharmaconnect.com.br',
    phone: '+55 11 99999-9999',
    address: 'Rua das Indústrias, 123',
    city: 'São Paulo',
    state: 'SP',
    zip_code: '01234-567',
    expertise_area: [
      'Inteligência Artificial',
      'Aprendizado Federado',
      'Matching Farmacêutico',
      'Conformidade ANVISA',
      'LGPD',
      'Blockchain',
      'Inovação Colaborativa'
    ],
    compliance_status: 'Totalmente Conforme',
    anvisa_certification: true,
    social_media: {
      linkedin: 'https://linkedin.com/company/pharmaconnect-brasil',
      facebook: 'https://facebook.com/pharmaconnectbrasil',
      instagram: 'https://instagram.com/pharmaconnectbr'
    },
    tags: [
      'HealthTech',
      'B2B',
      'Farmacêutica',
      'IA',
      'Colaboração',
      'Inovação',
      'Brasil',
      'ANVISA',
      'Matching',
      'Plataforma'
    ]
  });

  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const handleSave = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('companies')
        .upsert({
          profile_id: profile.id,
          name: companyData.name,
          cnpj: companyData.cnpj,
          description: companyData.description,
          website: companyData.website,
          phone: companyData.phone,
          address: companyData.address,
          city: companyData.city,
          state: companyData.state,
          zip_code: companyData.zip_code,
          expertise_area: companyData.expertise_area,
          compliance_status: companyData.compliance_status
        });

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "As informações da empresa foram salvas com sucesso",
      });
      
      setEditing(false);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addTag = (newTag: string) => {
    if (newTag && !companyData.tags.includes(newTag)) {
      setCompanyData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCompanyData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900 flex items-center space-x-2">
                  <span>{companyData.name}</span>
                  {companyData.anvisa_certification && (
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      <Award className="h-3 w-3 mr-1" />
                      ANVISA Certified
                    </Badge>
                  )}
                  <div className="w-6 h-4 bg-green-500 rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1/3 bg-green-500"></div>
                    <div className="absolute top-1/3 left-0 w-full h-1/3 bg-yellow-400"></div>
                    <div className="absolute top-2/3 left-0 w-full h-1/3 bg-blue-600"></div>
                    <span className="sr-only">🇧🇷 Brasil</span>
                  </div>
                </CardTitle>
                <p className="text-gray-600">{companyData.description}</p>
              </div>
            </div>
            <Button
              variant={editing ? "destructive" : "outline"}
              onClick={() => editing ? setEditing(false) : setEditing(true)}
              className="flex items-center space-x-2"
            >
              {editing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              <span>{editing ? 'Cancelar' : 'Editar'}</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome da Empresa</Label>
                    <Input
                      id="name"
                      value={companyData.name}
                      onChange={(e) => setCompanyData(prev => ({...prev, name: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={companyData.cnpj}
                      onChange={(e) => setCompanyData(prev => ({...prev, cnpj: e.target.value}))}
                      placeholder="00.000.000/0001-00"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={companyData.description}
                    onChange={(e) => setCompanyData(prev => ({...prev, description: e.target.value}))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={companyData.website}
                      onChange={(e) => setCompanyData(prev => ({...prev, website: e.target.value}))}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={companyData.phone}
                      onChange={(e) => setCompanyData(prev => ({...prev, phone: e.target.value}))}
                      placeholder="+55 11 99999-9999"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">CNPJ:</span>
                  <span>{companyData.cnpj}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <a href={companyData.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:underline">
                    {companyData.website}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{companyData.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Status:</span>
                  <Badge className="bg-green-100 text-green-800">
                    {companyData.compliance_status}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Localização */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Localização</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={companyData.address}
                    onChange={(e) => setCompanyData(prev => ({...prev, address: e.target.value}))}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={companyData.city}
                      onChange={(e) => setCompanyData(prev => ({...prev, city: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <select
                      id="state"
                      value={companyData.state}
                      onChange={(e) => setCompanyData(prev => ({...prev, state: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {brazilianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      value={companyData.zip_code}
                      onChange={(e) => setCompanyData(prev => ({...prev, zip_code: e.target.value}))}
                      placeholder="00000-000"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <p>{companyData.address}</p>
                <p>{companyData.city}, {companyData.state} - {companyData.zip_code}</p>
                <div className="mt-4">
                  <span className="text-sm text-gray-600">Cobertura Nacional Brasileira</span>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">São Paulo</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Rio de Janeiro</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Minas Gerais</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Áreas de Expertise */}
      <Card>
        <CardHeader>
          <CardTitle>Áreas de Expertise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {companyData.expertise_area.map((area, index) => (
              <Badge key={index} className="bg-blue-100 text-blue-800">
                {area}
                {editing && (
                  <button
                    onClick={() => {
                      const updatedAreas = companyData.expertise_area.filter((_, i) => i !== index);
                      setCompanyData(prev => ({...prev, expertise_area: updatedAreas}));
                    }}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags e Categorização */}
      <Card>
        <CardHeader>
          <CardTitle>Tags e Categorização</CardTitle>
          <p className="text-sm text-gray-600">
            Tags ajudam outros usuários a encontrar sua empresa na plataforma
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {companyData.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-gray-50">
                #{tag}
                {editing && (
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
            {editing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newTag = prompt('Digite uma nova tag:');
                  if (newTag) addTag(newTag);
                }}
                className="flex items-center space-x-1"
              >
                <Plus className="h-3 w-3" />
                <span>Adicionar Tag</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {editing && (
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => setEditing(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Salvando...' : 'Salvar Alterações'}</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default BrazilianCompanyProfile;