
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Building, Globe, Award, Zap } from 'lucide-react';

export const PlatformStats = () => {
  const stats = [
    {
      icon: Users,
      number: "10,000+",
      label: "Profissionais Conectados",
      description: "Rede ativa de especialistas"
    },
    {
      icon: Building,
      number: "500+",
      label: "Empresas Parceiras",
      description: "Farmacêuticas e laboratórios"
    },
    {
      icon: Globe,
      number: "50+",
      label: "Países Atendidos",
      description: "Alcance global"
    },
    {
      icon: Award,
      number: "95%",
      label: "Taxa de Satisfação",
      description: "Clientes satisfeitos"
    },
    {
      icon: Zap,
      number: "24/7",
      label: "Monitoramento",
      description: "Alertas em tempo real"
    },
    {
      icon: TrendingUp,
      number: "300%",
      label: "ROI Médio",
      description: "Retorno comprovado"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Números que <span className="text-blue-600">Impressionam</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Resultados concretos que demonstram o impacto da nossa plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <h3 className="text-xl font-semibold mb-2">{stat.label}</h3>
                  <p className="text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
