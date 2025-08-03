
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Globe, MapPin, Calendar, Shield } from 'lucide-react';

const Profile = () => {
  const { user, profile } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie suas informações pessoais e configurações
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Perfil Principal */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Informações Pessoais</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Nome</label>
                      <p className="text-foreground">{profile?.first_name || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Sobrenome</label>
                      <p className="text-foreground">{profile?.last_name || 'Não informado'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </label>
                    <p className="text-foreground">{profile?.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tipo de Usuário</label>
                    <Badge className="ml-2">
                      {profile?.user_type === 'company' && 'Empresa'}
                      {profile?.user_type === 'laboratory' && 'Laboratório'}
                      {profile?.user_type === 'consultant' && 'Consultor'}
                      {profile?.user_type === 'individual' && 'Individual'}
                      {profile?.user_type === 'admin' && 'Administrador'}
                    </Badge>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Membro desde</span>
                    </label>
                    <p className="text-foreground">
                      {new Date(profile?.created_at || '').toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status de Verificação */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Verificação</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <Badge variant="outline" className="mb-2">
                      Status: Pendente
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-4">
                      Complete sua verificação para acessar recursos premium
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/verification">
                        Iniciar Verificação
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Ações Rápidas */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/dashboard">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/analytics">
                      <Globe className="h-4 w-4 mr-2" />
                      Analytics
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/master-ai">
                      <Shield className="h-4 w-4 mr-2" />
                      Master AI Hub
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
