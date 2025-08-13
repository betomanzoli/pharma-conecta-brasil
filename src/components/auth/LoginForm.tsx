
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const LoginForm = () => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔑 Login form submitted for:', loginData.email);
    
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

    setIsLoading(true);
    
    try {
      console.log('🚀 Calling signIn function...');
      const result = await signIn(loginData.email, loginData.password);
      
      if (result.error) {
        console.error('❌ Sign in returned error:', result.error);
      } else {
        console.log('✅ Sign in completed successfully');
      }
    } catch (error) {
      console.error('💥 Unexpected login error:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente recarregar a página ou entre em contato com o suporte.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="login-password">Senha</Label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            required
            value={loginData.password}
            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Sua senha"
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

      <Button 
        type="submit" 
        className="w-full bg-[#1565C0] hover:bg-[#1565C0]/90" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>
      
      <div className="text-center pt-2">
        <p className="text-sm text-gray-600">
          Usuário de teste: <code className="bg-gray-100 px-1 rounded">betomanzoli@gmail.com</code>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
