
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Network, Linkedin, Calendar } from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Dr. João Silva",
    currentRole: "Gerente de P&D",
    company: "FarmaBrasil",
    yearsExperience: "11-15",
    expertiseArea: "P&D (Pesquisa e Desenvolvimento)",
    location: "São Paulo",
    linkedinUrl: "https://linkedin.com/in/joaosilva",
    bio: "Profissional experiente em Pesquisa e Desenvolvimento farmacêutico com mais de 12 anos de experiência. Especialista em desenvolvimento de novos medicamentos e gestão de projetos de P&D.",
    email: "joao.silva@farmabrasil.com",
    phone: "+55 11 99999-9999"
  });

  const expertiseAreas = [
    "P&D (Pesquisa e Desenvolvimento)",
    "Controle de Qualidade",
    "Assuntos Regulatórios",
    "Produção",
    "Comercial"
  ];

  const brazilianStates = [
    "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
    "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
    "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
    "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
    "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
  ];

  const handleSave = () => {
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
    setIsEditing(false);
    console.log("Dados salvos:", profileData);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-16 w-16 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileData.name}</h1>
                <p className="text-xl text-primary mb-2">{profileData.currentRole}</p>
                <p className="text-gray-600 mb-2">{profileData.company}</p>
                <p className="text-gray-500 mb-4">{profileData.location}</p>
                <div className="flex justify-center md:justify-start space-x-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">124</p>
                    <p className="text-sm text-gray-600">Conexões</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">89</p>
                    <p className="text-sm text-gray-600">Visualizações</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">15</p>
                    <p className="text-sm text-gray-600">Posts</p>
                  </div>
                </div>
              </div>
              <div className="space-x-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary-600">
                    Editar Perfil
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button onClick={handleSave} className="bg-primary hover:bg-primary-600">
                      Salvar
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Sobre</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Conte sobre sua experiência profissional..."
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700">{profileData.bio}</p>
                )}
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Informações Profissionais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentRole">Cargo Atual</Label>
                    {isEditing ? (
                      <Input
                        id="currentRole"
                        value={profileData.currentRole}
                        onChange={(e) => handleInputChange("currentRole", e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-700">{profileData.currentRole}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa</Label>
                    {isEditing ? (
                      <Input
                        id="company"
                        value={profileData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                      />
                    ) : (
                      <p className="text-gray-700">{profileData.company}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience">Anos de Experiência</Label>
                    {isEditing ? (
                      <Select onValueChange={(value) => handleInputChange("yearsExperience", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={profileData.yearsExperience} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-2">0-2 anos</SelectItem>
                          <SelectItem value="3-5">3-5 anos</SelectItem>
                          <SelectItem value="6-10">6-10 anos</SelectItem>
                          <SelectItem value="11-15">11-15 anos</SelectItem>
                          <SelectItem value="16+">16+ anos</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-700">{profileData.yearsExperience} anos</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expertiseArea">Área de Expertise</Label>
                    {isEditing ? (
                      <Select onValueChange={(value) => handleInputChange("expertiseArea", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={profileData.expertiseArea} />
                        </SelectTrigger>
                        <SelectContent>
                          {expertiseAreas.map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-700">{profileData.expertiseArea}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Localização</Label>
                    {isEditing ? (
                      <Select onValueChange={(value) => handleInputChange("location", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={profileData.location} />
                        </SelectTrigger>
                        <SelectContent>
                          {brazilianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-700">{profileData.location}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn</Label>
                    {isEditing ? (
                      <Input
                        id="linkedinUrl"
                        value={profileData.linkedinUrl}
                        onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                      />
                    ) : (
                      <a 
                        href={profileData.linkedinUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-600 flex items-center"
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        Ver Perfil LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact & Actions */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">E-mail</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-700">{profileData.email}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Telefone</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-700">{profileData.phone}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Network className="h-4 w-4 mr-2" />
                  Ver Conexões
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Meus Eventos
                </Button>
                <Button variant="outline" className="w-full">
                  Configurações
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
