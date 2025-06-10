
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  FlaskConical, 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const DashboardLaboratory = () => {
  const { profile } = useAuth();
  const [projectRequests, setProjectRequests] = useState([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectRequests();
  }, [profile]);

  const fetchProjectRequests = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('project_requests')
        .select('*')
        .eq('service_type', 'laboratory_analysis')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching project requests:', error);
        return;
      }

      setProjectRequests(data || []);
    } catch (error) {
      console.error('Error fetching project requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const capacityData = {
    today: 75,
    week: 60,
    month: 45
  };

  const analysisHistory = [
    { id: 1, client: 'FarmaCorp', type: 'Microbiológica', date: '2024-01-20', status: 'completed' },
    { id: 2, client: 'HealthLab', type: 'Físico-Química', date: '2024-01-18', status: 'in_progress' },
    { id: 3, client: 'BioPharma', type: 'Estabilidade', date: '2024-01-15', status: 'completed' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Laboratório
          </h1>
          <p className="text-gray-600">
            Bem-vindo de volta, {profile?.first_name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <FlaskConical className="h-6 w-6 text-[#1565C0]" />
          <span className="text-lg font-medium text-[#1565C0]">Laboratório</span>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacidade Hoje</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{capacityData.today}%</div>
            <p className="text-xs text-muted-foreground">
              Utilização atual
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
              {projectRequests.filter((p: any) => p.status === 'open').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando resposta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Análises do Mês</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              Concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#4CAF50]">98.5%</div>
            <p className="text-xs text-muted-foreground">
              Análises aprovadas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendário de Capacidade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-[#1565C0]" />
              <span>Calendário de Capacidade</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Capacidade Semanal:</span>
                <Badge variant="secondary">{capacityData.week}%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Capacidade Mensal:</span>
                <Badge variant="secondary">{capacityData.month}%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solicitações de Projetos */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitações Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando solicitações...</p>
            ) : projectRequests.length === 0 ? (
              <p className="text-gray-500">Nenhuma solicitação pendente</p>
            ) : (
              <div className="space-y-4">
                {projectRequests.slice(0, 3).map((request: any) => (
                  <div key={request.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{request.title}</h4>
                      <Badge variant="outline">
                        {request.service_type === 'laboratory_analysis' ? 'Análise' : 'Outro'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Prazo: {request.deadline ? new Date(request.deadline).toLocaleDateString('pt-BR') : 'Não especificado'}
                      </span>
                      <div className="space-x-2">
                        <Button size="sm" variant="outline">
                          Ver Detalhes
                        </Button>
                        <Button size="sm" className="bg-[#1565C0] hover:bg-[#1565C0]/90">
                          Aceitar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Análises */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Análises Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisHistory.map((analysis) => (
              <div key={analysis.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{analysis.client}</h4>
                  <p className="text-sm text-gray-600">Análise {analysis.type}</p>
                  <p className="text-xs text-gray-500">
                    Data: {new Date(analysis.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <Badge 
                  variant={analysis.status === 'completed' ? 'default' : 'secondary'}
                >
                  {analysis.status === 'completed' ? 'Concluída' : 'Em Andamento'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardLaboratory;
