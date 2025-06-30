
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  Activity,
  BarChart3
} from 'lucide-react';

interface MetricsOverview {
  total_matches: number;
  successful_partnerships: number;
  revenue_generated: number;
  active_companies: number;
  growth_rate: number;
  conversion_rate: number;
}

interface MetricsKPICardsProps {
  overview: MetricsOverview;
}

const MetricsKPICards: React.FC<MetricsKPICardsProps> = ({ overview }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Matches</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(overview.total_matches)}</div>
          <div className="flex items-center text-xs text-green-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            +{overview.growth_rate}% vs mês anterior
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Parcerias Ativas</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overview.successful_partnerships}</div>
          <div className="flex items-center text-xs text-blue-600">
            <Activity className="h-3 w-3 mr-1" />
            {overview.conversion_rate}% taxa de conversão
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Gerada</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(overview.revenue_generated)}</div>
          <div className="flex items-center text-xs text-green-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            +42% vs trimestre anterior
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(overview.active_companies)}</div>
          <div className="flex items-center text-xs text-blue-600">
            <Users className="h-3 w-3 mr-1" />
            12 novas esta semana
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsKPICards;
