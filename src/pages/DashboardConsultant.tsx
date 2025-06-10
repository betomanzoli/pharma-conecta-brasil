
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Clock,
  FileText,
  TrendingUp,
  Calendar,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const DashboardConsultant = () => {
  const { profile } = useAuth();
  const [projectProposals, setProjectProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectProposals();
  }, [profile]);

  const fetchProjectProposals = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('project_requests')
        .select('*')
        .eq('service_type', 'regulatory_consulting')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching project proposals:', error);
        return;
      }

      setProjectProposals(data || []);
    } catch (error) {
      console.error('Error fetching project proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeManagement = {
    hoursThisWeek: 32,
    hoursThisMonth: 128,
    billableRate: 85
  };

  const templates = [
    { id: 1, name: 'Dossiê ANVISA', category: 'Regulatório', downloads: 45 },
    { id: 2, name: 'Plano de Validação', category: 'Qualidade', downloads: 32 },
    { id: 3, name: 'Relatório de Estabilidade', category: 'P&D', downloads: 28 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Consultor
          </h1>
          <p className="text-gray-600">
            Bem-vindo de volta, {profile?.first_name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-[#1565C0]" />
          <span className="text-lg font-medium text-[#1565C0]">Consultor</span>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propostas Ativas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projectProposals.filter((p: any) => p.status === 'open').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando resposta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas da Semana</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeManagement.hoursThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              De 40h planejadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#4CAF50]">{timeManagement.billableRate}%</div>
            <p className="text-xs text-muted-foreground">
              Projetos aprovados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Propostas de Projetos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-[#1565C0]" />
              <span>Propostas de Projetos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando propostas...</p>
            ) : projectProposals.length === 0 ? (
              <p className="text-gray-500">Nenhuma proposta disponível</p>
            ) : (
              <div className="space-y-4">
                {projectProposals.slice(0, 3).map((proposal: any) => (
                  <div key={proposal.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{proposal.title}</h4>
                      <Badge variant="outline">
                        R$ {proposal.budget_min || 0} - {proposal.budget_max || 0}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{proposal.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Prazo: {proposal.deadline ? new Date(proposal.deadline).toLocaleDateString('pt-BR') : 'Flexível'}
                      </span>
                      <div className="space-x-2">
                        <Button size="sm" variant="outline">
                          Ver Detalhes
                        </Button>
                        <Button size="sm" className="bg-[#1565C0] hover:bg-[#1565C0]/90">
                          Enviar Proposta
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gestão de Tempo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-[#1565C0]" />
              <span>Gestão de Tempo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">Horas Esta Semana</p>
                  <p className="text-sm text-gray-600">{timeManagement.hoursThisWeek}h trabalhadas</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#1565C0]">{timeManagement.hoursThisWeek}</p>
                  <p className="text-xs text-gray-500">de 40h</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Horas Este Mês</p>
                  <p className="text-sm text-gray-600">{timeManagement.hoursThisMonth}h trabalhadas</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#4CAF50]">{timeManagement.hoursThisMonth}</p>
                  <p className="text-xs text-gray-500">de 160h</p>
                </div>
              </div>

              <Button className="w-full bg-[#1565C0] hover:bg-[#1565C0]/90">
                <Calendar className="h-4 w-4 mr-2" />
                Gerenciar Agenda
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biblioteca de Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-[#1565C0]" />
            <span>Biblioteca de Templates Regulatórios</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-gray-600">Categoria: {template.category}</p>
                  <p className="text-xs text-gray-500">{template.downloads} downloads</p>
                </div>
                <div className="space-x-2">
                  <Button size="sm" variant="outline">
                    Visualizar
                  </Button>
                  <Button size="sm" className="bg-[#1565C0] hover:bg-[#1565C0]/90">
                    Usar Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full">
              <BookOpen className="h-4 w-4 mr-2" />
              Ver Todos os Templates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardConsultant;
