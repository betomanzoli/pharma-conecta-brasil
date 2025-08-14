
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, Navigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
  const { signIn, user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', email);
      const result = await signIn(email, password);
      
      if (result.error) {
        console.error('Login failed:', result.error);
        setError('Credenciais inválidas. Verifique seu email e senha.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Erro inesperado durante o login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAndRetry = () => {
    setError('');
    setEmail('');
    setPassword('');
    // Forçar limpeza completa do estado de auth
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Login - PharmaConnect
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearAndRetry}
                  className="ml-2 h-auto p-1 text-xs underline"
                >
                  Tentar novamente
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          
          <div className="mt-4 text-center space-y-2">
            <Link to="/register" className="text-sm text-blue-600 hover:underline block">
              Não tem conta? Cadastre-se
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-muted rounded text-xs">
              <p className="font-semibold mb-1">Contas de teste:</p>
              <p>betomanzoli@gmail.com (sua conta existente)</p>
              <p>admin@pharmaconnect.dev (admin)</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
