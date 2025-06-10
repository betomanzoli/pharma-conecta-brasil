
import { Card } from "@/components/ui/card";
import { Zap, Shield, Search, BookOpen, Target, Network } from "lucide-react";

const PlatformFeatures = () => {
  const features = [
    {
      icon: Zap,
      title: "Motor de Matching com IA",
      description: "Conecta automaticamente necessidades e capacidades complementares em todo o ecossistema"
    },
    {
      icon: Shield,
      title: "Centro de Inteligência Regulatória",
      description: "Atualizações em tempo real da ANVISA, FDA e ferramentas de conformidade para operações contínuas"
    },
    {
      icon: Search,
      title: "Marketplace B2B",
      description: "Equipamentos, serviços e oportunidades colaborativas em uma plataforma"
    },
    {
      icon: BookOpen,
      title: "Repositório de Conhecimento",
      description: "Templates, estudos de caso e melhores práticas da indústria compartilhados por especialistas"
    },
    {
      icon: Target,
      title: "Hub de Colaboração em Projetos",
      description: "Projetos farmacêuticos multi-stakeholder gerenciados de forma contínua"
    },
    {
      icon: Network,
      title: "Networking Inteligente",
      description: "Conecte-se com os profissionais, mentores e líderes da indústria certos"
    }
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Funcionalidades Inteligentes da Plataforma
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tecnologia avançada impulsionando a colaboração da indústria farmacêutica
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlatformFeatures;
