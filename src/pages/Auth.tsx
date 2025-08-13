
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Building2, FlaskConical, Users, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import Logo from "@/components/ui/logo";

const Auth = () => {
  const { signUp, signIn, resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  
  // Detect if we're on reset password route
  const isResetPassword = location.pathname.includes('reset-password');
  const [activeTab, setActiveTab] = useState(isResetPassword ? "reset" : "login");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    user_type: "",
    phone: "",
    linkedin_url: "",
    organization_name: "",
    cnpj: "",
    description: "",
    expertise_areas: [] as string[],
    certifications: [] as string[],
    specializations: [] as string[],
  });

  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => {
    if (isResetPassword) {
      setActiveTab("reset");
    }
  }, [isResetPassword]);

  const userTypes = [
    { value: "company", label: "Empresa Farmacêutica/Alimentícia", icon: Building2 },
    { value: "laboratory", label: "Laboratório Analítico", icon: FlaskConical },
    { value: "consultant", label: "Consultor Regulatório", icon: Users },
    { value: "professional", label: "Profissional Individual", icon: User },
    { value: "regulatory_body", label: "Órgão Regulador", icon: Building2 },
    { value: "sector_entity", label: "Entidade Setorial", icon: Building2 },
    { value: "research_institution", label: "Instituição de Pesquisa", icon: Building2 },
    { value: "supplier", label: "Fornecedor", icon: Building2 },
    { value: "funding_agency", label: "Agência de Fomento", icon: Building2 },
    { value: "healthcare_provider", label: "Prestador de Saúde", icon: Building2 },
  ];

  const expertiseAreas = [
    "P&D (Pesquisa e Desenvolvimento)",
    "Controle de Qualidade",
    "Assuntos Regulatórios",
    "Produção",
    "Comercial",
    "Análises Microbiológicas",
    "Análises Físico-Químicas",
    "Validação de Processos",
    "Farmacovigilância",
    "Desenvolvimento Clínico",
    "Registro de Produtos",
    "Importação/Exportação"
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      return;
    }
    
    setLoading(true);
    await signIn(loginData.email, loginData.password);
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerData.email || !registerData.password || !registerData.first_name || !registerData.user_type) {
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      return;
    }

    if (registerData.password.length < 8) {
      return;
    }

    setLoading(true);

    const userData = {
      first_name: registerData.first_name,
      last_name: registerData.last_name,
      user_type: registerData.user_type,
      phone: registerData.phone,
      linkedin_url: registerData.linkedin_url,
      organization_name: registerData.organization_name,
      cnpj: registerData.cnpj,
      description: registerData.description,
      expertise_areas: registerData.expertise_areas,
      certifications: registerData.certifications,
      specializations: registerData.specializations,
    };

    console.log('Submitting registration with userData:', userData);
    await signUp(registerData.email, registerData.password, userData);
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    
    setLoading(true);
    await resetPassword(resetEmail);
    setLoading(false);
  };

  const handleRegisterInputChange = (field: string, value: string | string[]) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
  };

  const renderUserTypeFields = () => {
    const needsOrganization = ['company', 'laboratory', 'regulatory_body', 'sector_entity', 'research_institution', 'supplier', 'funding_agency', 'healthcare_provider'];
    
    if (needsOrganization.includes(registerData.user_type)) {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="organization_name">Nome da Organização *</Label>
            <Input
              id="organization_name"
              required
              value={registerData.organization_name}
              onChange={(e) => handleRegisterInputChange("organization_name", e.target.value)}
              placeholder="Nome da sua organização"
            />
          </div>
          
          {(registerData.user_type === 'company' || registerData.user_type === 'laboratory') && (
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={registerData.cnpj}
                onChange={(e) => handleRegisterInputChange("cnpj", e.target.value)}
                placeholder="00.000.000/0000-00"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={registerData.description}
              onChange={(e) => handleRegisterInputChange("description", e.target.value)}
              placeholder="Descreva sua organização..."
              rows={3}
            />
          </div>
        </>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Conecte-se com os melhores profissionais
          </h2>
          <p className="mt-2 text-gray-600">
            O ecossistema colaborativo da indústria farmacêutica brasileira
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-[#1565C0]">Acesso à Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastro</TabsTrigger>
                <TabsTrigger value="reset">Recuperar Senha</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input
                      id="login-password"
                      type="password"
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Sua senha"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#1565C0] hover:bg-[#1565C0]/90" 
                    disabled={loading}
                  >
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Nome *</Label>
                      <Input
                        id="first_name"
                        required
                        value={registerData.first_name}
                        onChange={(e) => handleRegisterInputChange("first_name", e.target.value)}
                        placeholder="Seu nome"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Sobrenome *</Label>
                      <Input
                        id="last_name"
                        required
                        value={registerData.last_name}
                        onChange={(e) => handleRegisterInputChange("last_name", e.target.value)}
                        placeholder="Seu sobrenome"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={registerData.email}
                      onChange={(e) => handleRegisterInputChange("email", e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha *</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={registerData.password}
                        onChange={(e) => handleRegisterInputChange("password", e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        required
                        value={registerData.confirmPassword}
                        onChange={(e) => handleRegisterInputChange("confirmPassword", e.target.value)}
                        placeholder="Confirme sua senha"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="user_type">Tipo de Usuário *</Label>
                    <Select onValueChange={(value) => handleRegisterInputChange("user_type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione seu tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {userTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center space-x-2">
                                <Icon className="h-4 w-4" />
                                <span>{type.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {renderUserTypeFields()}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={registerData.phone}
                        onChange={(e) => handleRegisterInputChange("phone", e.target.value)}
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="linkedin_url">LinkedIn</Label>
                      <Input
                        id="linkedin_url"
                        type="url"
                        value={registerData.linkedin_url}
                        onChange={(e) => handleRegisterInputChange("linkedin_url", e.target.value)}
                        placeholder="https://linkedin.com/in/seuperfil"
                      />
                    </div>
                  </div>

                  {(registerData.user_type === "consultant" || registerData.user_type === "professional") && (
                    <div className="space-y-2">
                      <Label htmlFor="expertise_areas">Áreas de Expertise</Label>
                      <Select onValueChange={(value) => {
                        const current = registerData.expertise_areas;
                        if (!current.includes(value)) {
                          handleRegisterInputChange("expertise_areas", [...current, value]);
                        }
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione suas áreas" />
                        </SelectTrigger>
                        <SelectContent>
                          {expertiseAreas.map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {registerData.expertise_areas.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {registerData.expertise_areas.map((area, index) => (
                            <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                              {area}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-[#1565C0] hover:bg-[#1565C0]/90" 
                    disabled={loading}
                  >
                    {loading ? "Criando conta..." : "Criar Conta"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="reset">
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#1565C0] hover:bg-[#1565C0]/90" 
                    disabled={loading}
                  >
                    {loading ? "Enviando..." : "Enviar Link de Recuperação"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
