
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, FlaskConical, Users, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const RegisterForm = () => {
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={registerData.password}
              onChange={(e) => handleRegisterInputChange("password", e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={registerData.confirmPassword}
              onChange={(e) => handleRegisterInputChange("confirmPassword", e.target.value)}
              placeholder="Confirme sua senha"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
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
  );
};

export default RegisterForm;
