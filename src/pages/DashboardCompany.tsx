import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  TrendingUp, 
  Users, 
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import BrazilianCompanyProfile from '@/components/brazilian/BrazilianCompanyProfile';
import BrazilianAIMatching from '@/components/brazilian/BrazilianAIMatching';
import BrazilianAnalytics from '@/components/brazilian/BrazilianAnalytics';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

const DashboardCompany = () => {
  const { profile } = useAuth();
  const [companyData, setCompanyData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyData();
  }, [profile]);

  const fetchCompanyData = async () => {
    if (!profile) return;

    try {
      const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('profile_id', profile.id)
        .single();

      if (error) {
        console.error('Error fetching company data:', error);
        return;
      }

      setCompanyData(company);

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('project_requests')
        .select('*')
        .eq('requester_id', profile.id)
        .order('created_at', { ascending: false });

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        return;
      }

      setProjects(projectsData || []);
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  const activeProjects = projects.filter((p: any) => p.status === 'open').length;
  const completedProjects = projects.filter((p: any) => p.status === 'completed').length;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Dashboard Empresa Brasileira
                </h1>
                <p className="text-gray-600">
                  Bem-vindo de volta, {companyData?.name || profile?.first_name}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="h-6 w-6 text-primary" />
                <span className="text-lg font-medium text-primary">Empresa</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="matching">AI Matching</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Métricas Principais */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activeProjects}</div>
                    <p className="text-xs text-muted-foreground">
                      Em andamento
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Projetos Concluídos</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{completedProjects}</div>
                    <p className="text-xs text-muted-foreground">
                      Finalizados
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conexões</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">47</div>
                    <p className="text-xs text-muted-foreground">
                      Parceiros conectados
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Status Compliance</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {companyData?.compliance_status === 'compliant' ? '✓' : '⚠'}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {companyData?.compliance_status === 'compliant' ? 'Em dia' : 'Pendente'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Projetos Recentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Projetos Recentes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {projects.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Nenhum projeto encontrado
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {projects.slice(0, 5).map((project: any) => (
                        <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{project.title}</h4>
                            <p className="text-sm text-gray-600">{project.service_type}</p>
                            <p className="text-xs text-gray-500">
                              Criado em: {new Date(project.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <Badge 
                            variant={project.status === 'completed' ? 'default' : 
                                    project.status === 'open' ? 'secondary' : 'outline'}
                          >
                            {project.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <BrazilianCompanyProfile />
            </TabsContent>

            <TabsContent value="matching">
              <BrazilianAIMatching />
            </TabsContent>

            <TabsContent value="analytics">
              <BrazilianAnalytics />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardCompany;