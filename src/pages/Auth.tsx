import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, FlaskConical, Users, User, RefreshCw, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/ui/logo";
import { cleanupAuthState, performGlobalSignout } from "@/utils/authCleanup";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const { signUp, signIn, resetPassword, user, loading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [debugMode, setDebugMode] = useState(false);
  
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
    company_name: "",
    cnpj: "",
    company_description: "",
    lab_name: "",
    anvisa_certifications: [] as string[],
    equipment_list: [] as string[],
    expertise_areas: [] as string[],
    certifications: [] as string[],
  });

  const [resetEmail, setResetEmail] = useState("");

  const userTypes = [
    { value: "company", label: "Empresa Farmacêutica/Alimentícia", icon: Building2 },
    { value: "laboratory", label: "Laboratório Analítico", icon: FlaskConical },
    { value: "consultant", label: "Consultor Regulatório", icon: Users },
    { value: "individual", label: "Profissional Individual", icon: User }
  ];

  const expertiseAreas = [
    "P&D (Pesquisa e Desenvolvimento)",
    "Controle de Qualidade", 
    "Assuntos Regulatórios",
    "Produção",
    "Comercial",
    "Análises Microbiológicas",
    "Análises Físico-Químicas",
    "Validação de Processos"
  ];

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'register' || hash === 'reset') {
      setActiveTab(hash);
    }
  }, []);

  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  const clearCacheAndRetry = async () => {
    setIsClearing(true);
    try {
      console.log('Limpando cache completo...');
      
      // Limpar todos os dados relacionados ao Supabase
      cleanupAuthState();
      
      // Tentar logout global
      await performGlobalSignout(supabase);
      
      // Limpar cookies se possível
      if (document.cookie) {
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=");
          const name = eqPos > -1 ? c.substr(0, eqPos) : c;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Cache limpo completamente",
        description: "Todos os dados de autenticação foram removidos. Tente fazer login novamente.",
      });
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      toast({
        title: "Erro ao limpar cache",
        description: "Tente recarregar a página manualmente.",
        variant: "destructive"
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Tentando login via Auth page com:', loginData.email);
      
      // Validações básicas
      if (!loginData.email || !loginData.password) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha email e senha.",
          variant: "destructive"
        });
        return;
      }
      
      if (!loginData.email.includes('@')) {
        toast({
          title: "Email inválido",
          description: "Digite um email válido.",
          variant: "destructive"
        });
        return;
      }
      
      const result = await signIn(loginData.email, loginData.password);
      
      if (result?.error) {
        console.error('Erro de login:', result.error);
        
        // Sugerir alternativas
        if (result.error.message.includes('Invalid login credentials')) {
          toast({
            title: "Credenciais inválidas",
            description: "Tente recuperar sua senha ou verificar se o email está correto.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente limpar o cache ou recarregar a página.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "Verifique se as senhas são iguais.",
        variant: "destructive"
      });
      return;
    }

    if (registerData.password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    const userData = {
      first_name: registerData.first_name,
      last_name: registerData.last_name,
      user_type: registerData.user_type,
      phone: registerData.phone,
      linkedin_url: registerData.linkedin_url,
      company_name: registerData.company_name,
      cnpj: registerData.cnpj,
      company_description: registerData.company_description,
      lab_name: registerData.lab_name,
      anvisa_certifications: registerData.anvisa_certifications,
      equipment_list: registerData.equipment_list,
      expertise_areas: registerData.expertise_areas,
      certifications: registerData.certifications,
    };

    await signUp(registerData.email, registerData.password, userData);
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail || !resetEmail.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Digite um email válido.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    await resetPassword(resetEmail);
    setIsLoading(false);
  };

  const handleRegisterInputChange = (field: string, value: string | string[]) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
  };

  const renderUserTypeFields = () => {
    switch (registerData.user_type) {
      case "company":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="company_name">Nome da Empresa *</Label>
              <Input
                id="company_name"
                required
                value={registerData.company_name}
                onChange={(e) => handleRegisterInputChange("company_name", e.target.value)}
                placeholder="Ex: Farmacorp Ltda"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                required
                value={registerData.cnpj}
                onChange={(e) => handleRegisterInputChange("cnpj", e.target.value)}
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_description">Descrição da Empresa</Label>
              <Input
                id="company_description"
                value={registerData.company_description}
                onChange={(e) => handleRegisterInputChange("company_description", e.target.value)}
                placeholder="Breve descrição das atividades"
              />
            </div>
          </>
        );
      
      case "laboratory":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="lab_name">Nome do Laboratório *</Label>
              <Input
                id="lab_name"
                required
                value={registerData.lab_name}
                onChange={(e) => handleRegisterInputChange("lab_name", e.target.value)}
                placeholder="Ex: LabAnalytics"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anvisa_certifications">Certificações ANVISA *</Label>
              <Input
                id="anvisa_certifications"
                required
                value={registerData.anvisa_certifications.join(", ")}
                onChange={(e) => handleRegisterInputChange("anvisa_certifications", e.target.value.split(", "))}
                placeholder="Ex: RDC 301, ISO 17025"
              />
            </div>
          </>
        );
      
      case "consultant":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="expertise_areas">Áreas de Expertise *</Label>
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
                <div className="flex flex-wrap gap-2">
                  {registerData.expertise_areas.map((area, index) => (
                    <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                      {area}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        );
      
      default:
        return null;
    }
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

        {/* Alertas de debug se necessário */}
        {debugMode && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Modo debug ativo. URL atual: {window.location.href}
              <br />
              Domínio: {window.location.hostname}
            </AlertDescription>
          </Alert>
        )}

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
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                  
                  <div className="text-center pt-2 space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearCacheAndRetry}
                      disabled={isClearing}
                      className="text-xs"
                    >
                      {isClearing && <RefreshCw className="mr-1 h-3 w-3 animate-spin" />}
                      Limpar Cache Completo
                    </Button>
                    
                    <div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setDebugMode(!debugMode)}
                        className="text-xs text-muted-foreground"
                      >
                        {debugMode ? 'Ocultar' : 'Mostrar'} Info Debug
                      </Button>
                    </div>
                  </div>
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

                  <Button 
                    type="submit" 
                    className="w-full bg-[#1565C0] hover:bg-[#1565C0]/90" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Criando conta..." : "Criar Conta"}
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
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
                  </Button>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Se você não receber o email em alguns minutos, verifique sua pasta de spam ou tente novamente.
                    </AlertDescription>
                  </Alert>
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
