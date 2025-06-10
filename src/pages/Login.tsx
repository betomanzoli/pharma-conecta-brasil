import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Network } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ComplianceDisclaimer from "@/components/ComplianceDisclaimer";

const Login = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Login realizado com sucesso!",
      description: "Redirecionando para seu dashboard...",
    });
    
    console.log("Dados do login:", formData);
    // Aqui seria implementada a lógica de autenticação
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Compliance Disclaimer */}
        <ComplianceDisclaimer />
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Network className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold text-primary">PharmaNexus</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Bem-vindo de Volta
          </h2>
          <p className="mt-2 text-gray-600">
            Acesse sua rede profissional farmacêutica
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-primary">Entrar na Sua Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Sua senha"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Lembrar de mim
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="text-primary hover:text-primary-600">
                    Esqueceu a senha?
                  </a>
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary-600 text-lg py-3">
                Entrar
              </Button>

              <div className="text-center">
                <p className="text-gray-600">
                  Não tem uma conta?{" "}
                  <a href="#" className="text-primary hover:text-primary-600 font-medium">
                    Cadastre-se gratuitamente
                  </a>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Ao fazer login, você concorda com nossos{" "}
            <a href="#" className="text-primary hover:text-primary-600">Termos de Uso</a>{" "}
            e{" "}
            <a href="#" className="text-primary hover:text-primary-600">Política de Privacidade</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
