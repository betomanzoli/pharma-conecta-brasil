
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cleanupAuthState, performGlobalSignout } from "@/utils/authCleanup";
import { supabase } from "@/integrations/supabase/client";

const LoginForm = () => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const clearCacheAndRetry = async () => {
    setIsClearing(true);
    try {
      console.log('Limpando cache completo...');
      
      cleanupAuthState();
      await performGlobalSignout(supabase);
      
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

      <Button 
        type="submit" 
        className="w-full bg-[#1565C0] hover:bg-[#1565C0]/90" 
        disabled={isLoading}
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
      
      <div className="text-center pt-2">
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
      </div>
    </form>
  );
};

export default LoginForm;
