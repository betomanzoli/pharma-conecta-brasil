
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Upload, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  demoCompanies, 
  demoLaboratories, 
  demoConsultants, 
  demoProjects,
  demoPartnershipOpportunities,
  demoRegulatoryAlerts,
  demoMentorshipSessions,
  demoNotifications
} from '@/data/demoData';

const DemoDataManager = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [dataStatus, setDataStatus] = useState({
    companies: 0,
    laboratories: 0,
    consultants: 0,
    projects: 0,
    alerts: 0
  });

  const populateDemoData = async () => {
    if (!profile) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Popular empresas
      for (const company of demoCompanies) {
        await supabase.from('companies').insert({
          ...company,
          profile_id: profile.id
        });
      }

      // Popular laboratórios
      for (const lab of demoLaboratories) {
        await supabase.from('laboratories').insert({
          ...lab,
          profile_id: profile.id
        });
      }

      // Popular consultores
      for (const consultant of demoConsultants) {
        await supabase.from('consultants').insert({
          ...consultant,
          profile_id: profile.id
        });
      }

      // Popular projetos
      for (const project of demoProjects) {
        await supabase.from('project_requests').insert({
          ...project,
          requester_id: profile.id
        });
      }

      // Popular oportunidades de parceria
      const { data: userCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('profile_id', profile.id)
        .limit(1)
        .single();

      if (userCompany) {
        for (const opportunity of demoPartnershipOpportunities) {
          await supabase.from('partnership_opportunities').insert({
            ...opportunity,
            company_id: userCompany.id
          });
        }
      }

      // Popular alertas regulatórios
      for (const alert of demoRegulatoryAlerts) {
        await supabase.from('regulatory_alerts').insert(alert);
      }

      // Popular sessões de mentoria
      for (const session of demoMentorshipSessions) {
        await supabase.from('mentorship_sessions').insert({
          ...session,
          mentor_id: profile.id,
          mentee_id: profile.id
        });
      }

      // Popular notificações
      for (const notification of demoNotifications) {
        await supabase.from('notifications').insert({
          ...notification,
          user_id: profile.id
        });
      }

      toast({
        title: "Dados demo populados com sucesso!",
        description: "A plataforma agora está pronta para demonstração.",
      });

      await checkDataStatus();
    } catch (error) {
      console.error('Erro ao popular dados demo:', error);
      toast({
        title: "Erro ao popular dados",
        description: "Ocorreu um erro ao inserir os dados de demonstração.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const clearDemoData = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      // Limpar dados em ordem para respeitar foreign keys
      await supabase.from('notifications').delete().eq('user_id', profile.id);
      await supabase.from('mentorship_sessions').delete().eq('mentor_id', profile.id);
      await supabase.from('project_requests').delete().eq('requester_id', profile.id);
      await supabase.from('partnership_opportunities').delete().in('company_id', 
        (await supabase.from('companies').select('id').eq('profile_id', profile.id)).data?.map(c => c.id) || []
      );
      await supabase.from('companies').delete().eq('profile_id', profile.id);
      await supabase.from('laboratories').delete().eq('profile_id', profile.id);
      await supabase.from('consultants').delete().eq('profile_id', profile.id);

      toast({
        title: "Dados demo removidos",
        description: "Todos os dados de demonstração foram removidos.",
      });

      await checkDataStatus();
    } catch (error) {
      console.error('Erro ao limpar dados demo:', error);
      toast({
        title: "Erro ao limpar dados",
        description: "Ocorreu um erro ao remover os dados de demonstração.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkDataStatus = async () => {
    if (!profile) return;

    try {
      const [companies, laboratories, consultants, projects, alerts] = await Promise.all([
        supabase.from('companies').select('id', { count: 'exact' }).eq('profile_id', profile.id),
        supabase.from('laboratories').select('id', { count: 'exact' }).eq('profile_id', profile.id),
        supabase.from('consultants').select('id', { count: 'exact' }).eq('profile_id', profile.id),
        supabase.from('project_requests').select('id', { count: 'exact' }).eq('requester_id', profile.id),
        supabase.from('regulatory_alerts').select('id', { count: 'exact' })
      ]);

      setDataStatus({
        companies: companies.count || 0,
        laboratories: laboratories.count || 0,
        consultants: consultants.count || 0,
        projects: projects.count || 0,
        alerts: alerts.count || 0
      });
    } catch (error) {
      console.error('Erro ao verificar status dos dados:', error);
    }
  };

  React.useEffect(() => {
    checkDataStatus();
  }, [profile]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-primary-600" />
          <span>Gerenciador de Dados Demo</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Status dos Dados */}
          <div>
            <h3 className="font-semibold mb-3">Status Atual dos Dados</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{dataStatus.companies}</div>
                <div className="text-sm text-gray-600">Empresas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-600">{dataStatus.laboratories}</div>
                <div className="text-sm text-gray-600">Laboratórios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">{dataStatus.consultants}</div>
                <div className="text-sm text-gray-600">Consultores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{dataStatus.projects}</div>
                <div className="text-sm text-gray-600">Projetos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{dataStatus.alerts}</div>
                <div className="text-sm text-gray-600">Alertas</div>
              </div>
            </div>
          </div>

          {/* Dados a serem inseridos */}
          <div>
            <h3 className="font-semibold mb-3">Dados de Demonstração Disponíveis</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Badge variant="outline">{demoCompanies.length} Empresas</Badge>
              <Badge variant="outline">{demoLaboratories.length} Laboratórios</Badge>
              <Badge variant="outline">{demoConsultants.length} Consultores</Badge>
              <Badge variant="outline">{demoProjects.length} Projetos</Badge>
              <Badge variant="outline">{demoPartnershipOpportunities.length} Parcerias</Badge>
              <Badge variant="outline">{demoRegulatoryAlerts.length} Alertas</Badge>
              <Badge variant="outline">{demoMentorshipSessions.length} Mentorias</Badge>
              <Badge variant="outline">{demoNotifications.length} Notificações</Badge>
            </div>
          </div>

          {/* Ações */}
          <div className="flex space-x-4">
            <Button 
              onClick={populateDemoData}
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              {loading ? 'Populando...' : 'Popular Dados Demo'}
            </Button>
            
            <Button 
              onClick={clearDemoData}
              disabled={loading}
              variant="destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Dados Demo
            </Button>
            
            <Button 
              onClick={checkDataStatus}
              disabled={loading}
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Status
            </Button>
          </div>

          {/* Aviso */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Aviso:</strong> Os dados de demonstração são fictícios e destinados 
              apenas para fins de demonstração da plataforma. Não utilize em ambiente de produção.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoDataManager;
