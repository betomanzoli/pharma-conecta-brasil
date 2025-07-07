
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import KPICards, { useKPIData } from '@/components/analytics/KPICards';
import InteractiveCharts from '@/components/analytics/InteractiveCharts';
import AdvancedFilters from '@/components/analytics/AdvancedFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Users,
  MessageSquare,
  DollarSign,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

interface FilterState {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  userTypes: string[];
  metrics: string[];
  period: string;
}

const AdvancedAnalyticsPage = () => {
  const { data: kpiData, loading: kpiLoading } = useKPIData();
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date()
    },
    userTypes: [],
    metrics: ['users', 'sessions', 'revenue'],
    period: '30d'
  });
  const [refreshing, setRefreshing] = useState(false);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    // Aqui você faria a chamada para atualizar os dados com os novos filtros
    console.log('Filtros atualizados:', newFilters);
  };

  const handleExport = async () => {
    try {
      toast.info('Iniciando exportação dos dados...');
      
      // Simular exportação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui você implementaria a lógica real de exportação
      const exportData = {
        period: filters.period,
        dateRange: filters.dateRange,
        userTypes: filters.userTypes,
        metrics: filters.metrics,
        exportedAt: new Date().toISOString()
      };
      
      // Simular download do arquivo
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('Dados exportados com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      toast.error('Erro ao exportar dados. Tente novamente.');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simular atualização dos dados
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      toast.error('Erro ao atualizar dados. Tente novamente.');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
                  <BarChart3 className="h-8 w-8 text-primary" />
                  <span>Analytics Avançado</span>
                </h1>
                <p className="text-muted-foreground mt-2">
                  Análise detalhada do desempenho da plataforma com métricas e insights avançados
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  Atualizado há 5 min
                </Badge>
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <TrendingUp className={`h-4 w-4 mr-2 ${refreshing ? 'animate-pulse' : ''}`} />
                  {refreshing ? 'Atualizando...' : 'Atualizar'}
                </Button>
              </div>
            </div>
          </div>

          {/* Filtros Avançados */}
          <div className="mb-8">
            <AdvancedFilters
              onFiltersChange={handleFiltersChange}
              onExport={handleExport}
              onRefresh={handleRefresh}
              loading={refreshing}
            />
          </div>

          {/* KPI Cards */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Indicadores Principais
              </h2>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                <span>Período: {filters.period === '30d' ? 'Últimos 30 dias' : 'Personalizado'}</span>
              </div>
            </div>
            <KPICards data={kpiData} loading={kpiLoading} />
          </div>

          <Separator className="my-8" />

          {/* Gráficos Interativos */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Análise Detalhada
              </h2>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>2.847 usuários</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>4.729 mensagens</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>R$ 28.000 receita</span>
                </div>
              </div>
            </div>
            <InteractiveCharts />
          </div>

          {/* Resumo de Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Insights e Recomendações</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Crescimento de Usuários</h4>
                  <p className="text-sm text-muted-foreground">
                    O crescimento de 12.5% em novos usuários indica uma tendência positiva. 
                    Recomenda-se focar em estratégias de retenção.
                  </p>
                  <Badge variant="default" className="text-xs">
                    Tendência Positiva
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Engajamento</h4>
                  <p className="text-sm text-muted-foreground">
                    O chat é a funcionalidade mais utilizada. Considere implementar 
                    recursos adicionais de comunicação.
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    Oportunidade
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Receita</h4>
                  <p className="text-sm text-muted-foreground">
                    Crescimento consistente na receita de mentorias. 
                    Potencial para expandir programas premium.
                  </p>
                  <Badge variant="default" className="text-xs">
                    Alta Performance
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdvancedAnalyticsPage;
