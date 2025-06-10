
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  TrendingUp,
  Clock,
  Users,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const DashboardCompany = () => {
  const { profile } = useAuth();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, [profile]);

  const fetchProjects = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('project_requests')
        .select('*')
        .eq('requester_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const complianceStatus = {
    rdc843: { status: 'compliant', lastCheck: '2024-01-15' },
    anvisa: { status: 'warning', lastCheck: '2024-01-10' },
    iso: { status: 'compliant', lastCheck: '2024-01-20' }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'Conforme';
      case 'warning':
        return 'Atenção';
      default:
        return 'Não Conforme';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Empresarial
          </h1>
          <p className="text-gray-600">
            Bem-vindo de volta, {profile?.first_name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-[#1565C0]" />
          <span className="text-lg font-medium text-[#1565C0]">Empresa</span>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter(p => p.status === 'in_progress').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solicitações Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter(p => p.status === 'open').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando resposta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parceiros Conectados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Laboratórios e consultores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Compliance</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#4CAF50]">95%</div>
            <p className="text-xs text-muted-foreground">
              Índice geral
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status de Compliance RDC 843 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-[#1565C0]" />
            <span>Status de Compliance Regulatório</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">RDC 843/2023</p>
                <p className="text-sm text-gray-600">Última verificação: {complianceStatus.rdc843.lastCheck}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(complianceStatus.rdc843.status)}
                <span className="text-sm font-medium">
                  {getStatusText(complianceStatus.rdc843.status)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">ANVISA</p>
                <p className="text-sm text-gray-600">Última verificação: {complianceStatus.anvisa.lastCheck}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(complianceStatus.anvisa.status)}
                <span className="text-sm font-medium">
                  {getStatusText(complianceStatus.anvisa.status)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">ISO 9001</p>
                <p className="text-sm text-gray-600">Última verificação: {complianceStatus.iso.lastCheck}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(complianceStatus.iso.status)}
                <span className="text-sm font-medium">
                  {getStatusText(complianceStatus.iso.status)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Busca Inteligente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-[#1565C0]" />
            <span>Busca Inteligente de Parceiros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <Input
              placeholder="Buscar laboratórios, consultores ou expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button className="bg-[#1565C0] hover:bg-[#1565C0]/90">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Sugestões baseadas no seu perfil:</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Análises Microbiológicas</Badge>
              <Badge variant="secondary">Validação de Processos</Badge>
              <Badge variant="secondary">Consultoria Regulatória</Badge>
              <Badge variant="secondary">ISO 17025</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projetos Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Projetos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando projetos...</p>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Nenhum projeto encontrado</p>
              <Button className="bg-[#1565C0] hover:bg-[#1565C0]/90">
                Criar Primeiro Projeto
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.slice(0, 5).map((project: any) => (
                <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{project.title}</h4>
                    <p className="text-sm text-gray-600">{project.description}</p>
                    <p className="text-xs text-gray-500">
                      Criado em: {new Date(project.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Badge 
                    variant={project.status === 'completed' ? 'default' : 'secondary'}
                  >
                    {project.status === 'open' && 'Aberto'}
                    {project.status === 'in_progress' && 'Em Andamento'}
                    {project.status === 'completed' && 'Concluído'}
                    {project.status === 'cancelled' && 'Cancelado'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCompany;
