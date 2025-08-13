
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, Navigate } from 'react-router-dom';
import { Loader2, RefreshCw } from 'lucide-react';
import { cleanupAuthState, performGlobalSignout } from '@/utils/authCleanup';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const { signIn, user, loading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  const clearCacheAndRetry = async () => {
    setIsClearing(true);
    try {
      // Limpar estado de autenticação
      cleanupAuthState();
      
      // Tentar logout global
      await performGlobalSignout(supabase);
      
      // Aguardar um momento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Cache limpo",
        description: "Tente fazer login novamente.",
      });
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Limpar estado antes do login
      cleanupAuthState();
      await performGlobalSignout(supabase);
      
      // Aguardar um momento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Tentando login com:', email);
      const result = await signIn(email, password);
      
      if (result?.error) {
        console.error('Erro de login:', result.error);
        
        if (result.error.message.includes('Invalid login credentials')) {
          toast({
            title: "Credenciais inválidas",
            description: "Email ou senha incorretos. Verifique suas credenciais ou use 'Esqueci minha senha'.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro no login",
            description: result.error.message,
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro durante o login. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Login - PharmaConnect
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Sua senha"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>
          </form>
          
          <div className="mt-4 space-y-2">
            <div className="text-center">
              <Link to="/auth#reset" className="text-sm text-blue-600 hover:underline">
                Esqueci minha senha
              </Link>
            </div>
            
            <div className="text-center">
              <Link to="/auth#register" className="text-sm text-blue-600 hover:underline">
                Não tem conta? Cadastre-se
              </Link>
            </div>
            
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
                Limpar Cache e Tentar Novamente
              </Button>
            </div>
            
            <div className="text-center pt-2">
              <Link to="/auth" className="text-xs text-gray-600 hover:underline">
                Ir para página completa de autenticação
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
