
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, FlaskConical, Users, User, Eye, EyeOff, Loader2 } from "lucide-react";
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
  });

  const userTypes = [
    { value: "company", label: "Empresa Farmacêutica/Alimentícia", icon: Building2 },
    { value: "laboratory", label: "Laboratório Analítico", icon: FlaskConical },
    { value: "consultant", label: "Consultor Regulatório", icon: Users },
    { value: "individual", label: "Profissional Individual", icon: User }
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!registerData.first_name || !registerData.last_name || !registerData.email || 
        !registerData.password || !registerData.user_type) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos marcados com *.",
        variant: "destructive"
      });
      return;
    }

    if (!registerData.email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Digite um email válido.",
        variant: "destructive"
      });
      return;
    }

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
      phone: registerData.phone || null,
      linkedin_url: registerData.linkedin_url || null,
      company_name: registerData.company_name || null,
    };

    await signUp(registerData.email, registerData.password, userData);
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
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
            onChange={(e) => handleInputChange("first_name", e.target.value)}
            placeholder="Seu nome"
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last_name">Sobrenome *</Label>
          <Input
            id="last_name"
            required
            value={registerData.last_name}
            onChange={(e) => handleInputChange("last_name", e.target.value)}
            placeholder="Seu sobrenome"
            disabled={isLoading}
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
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="seu@email.com"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="user_type">Tipo de Usuário *</Label>
        <Select onValueChange={(value) => handleInputChange("user_type", value)} disabled={isLoading}>
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

      {(registerData.user_type === "company" || registerData.user_type === "laboratory") && (
        <div className="space-y-2">
          <Label htmlFor="company_name">
            {registerData.user_type === "company" ? "Nome da Empresa" : "Nome do Laboratório"}
          </Label>
          <Input
            id="company_name"
            value={registerData.company_name}
            onChange={(e) => handleInputChange("company_name", e.target.value)}
            placeholder={registerData.user_type === "company" ? "Ex: Farmacorp Ltda" : "Ex: LabAnalytics"}
            disabled={isLoading}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Senha *</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={registerData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Mínimo 6 caracteres"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
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
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              placeholder="Confirme sua senha"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={registerData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="(11) 99999-9999"
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="linkedin_url">LinkedIn</Label>
          <Input
            id="linkedin_url"
            type="url"
            value={registerData.linkedin_url}
            onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
            placeholder="https://linkedin.com/in/seuperfil"
            disabled={isLoading}
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#1565C0] hover:bg-[#1565C0]/90" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando conta...
          </>
        ) : (
          "Criar Conta"
        )}
      </Button>
    </form>
  );
};

export default RegisterForm;
