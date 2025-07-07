import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  Calendar,
  DollarSign,
  Target,
  Activity
} from 'lucide-react';

interface KPIData {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ElementType;
  description: string;
}

interface KPICardsProps {
  data: KPIData[];
  loading?: boolean;
}

const KPICards: React.FC<KPICardsProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-5 w-5 bg-muted rounded"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-24 mb-2"></div>
              <div className="h-4 bg-muted rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((kpi, index) => {
        const Icon = kpi.icon;
        const isPositive = kpi.changeType === 'increase';
        
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-foreground">
                  {kpi.value}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={isPositive ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(kpi.change)}%
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {kpi.description}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

// Hook para dados de KPI
export const useKPIData = () => {
  const [data, setData] = React.useState<KPIData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simular carregamento de dados
    const fetchKPIData = async () => {
      setLoading(true);
      
      // Simulação de dados (substituir por chamada real à API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: KPIData[] = [
        {
          title: "Total de Usuários",
          value: "2,847",
          change: 12.5,
          changeType: "increase",
          icon: Users,
          description: "vs. mês anterior"
        },
        {
          title: "Sessões de Mentoria",
          value: "156",
          change: 8.2,
          changeType: "increase",
          icon: Calendar,
          description: "este mês"
        },
        {
          title: "Mensagens Enviadas",
          value: "4,729",
          change: 15.3,
          changeType: "increase",
          icon: MessageSquare,
          description: "última semana"
        },
        {
          title: "Taxa de Engajamento",
          value: "87.3%",
          change: 2.1,
          changeType: "decrease",
          icon: Activity,
          description: "últimos 7 dias"
        }
      ];
      
      setData(mockData);
      setLoading(false);
    };

    fetchKPIData();
  }, []);

  return { data, loading };
};

export default KPICards;