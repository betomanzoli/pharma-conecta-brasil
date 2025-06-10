
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Building2, DollarSign, Target, Clock } from "lucide-react";

const MarketplaceStats = () => {
  const stats = [
    {
      title: "Transações Ativas",
      value: "247",
      change: "+18%",
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      title: "Volume (30 dias)",
      value: "R$ 2.4M",
      change: "+25%",
      trend: "up", 
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Fornecedores Ativos",
      value: "1,284",
      change: "+12%",
      trend: "up",
      icon: Building2,
      color: "text-purple-600"
    },
    {
      title: "Tempo Médio p/ Match",
      value: "2.1 dias",
      change: "-15%",
      trend: "down",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Taxa de Conversão",
      value: "73%",
      change: "+8%",
      trend: "up",
      icon: Target,
      color: "text-indigo-600"
    },
    {
      title: "Usuários Mensais",
      value: "12.5k",
      change: "+22%",
      trend: "up",
      icon: Users,
      color: "text-pink-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.trend === "up";
        
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <span className={`text-xs px-2 py-1 rounded ${
                  isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.title}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MarketplaceStats;
