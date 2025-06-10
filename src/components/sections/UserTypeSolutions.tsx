
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Building2, FlaskConical, UserCheck, User } from "lucide-react";

const UserTypeSolutions = () => {
  const userTypes = [
    {
      icon: Building2,
      title: "Empresas e Indústrias Farmacêuticas",
      benefits: [
        { text: "Encontre", detail: " laboratórios especializados e fornecedores qualificados" },
        { text: "Acesse", detail: " inteligência regulatória ANVISA em tempo real" },
        { text: "Publique", detail: " desafios de inovação e encontre soluções" },
        { text: "Conecte-se", detail: " com talentos e prestadores de elite" }
      ]
    },
    {
      icon: FlaskConical,
      title: "Laboratórios e Prestadores de Serviços",
      benefits: [
        { text: "Otimize", detail: " utilização de capacidade até ", highlight: "60%" },
        { text: "Conecte-se", detail: " com empresas que precisam dos seus serviços" },
        { text: "Apresente", detail: " suas capacidades especializadas" },
        { text: "Colabore", detail: " em projetos multi-empresariais" }
      ]
    },
    {
      icon: UserCheck,
      title: "Consultores e Especialistas",
      benefits: [
        { text: "Acesse", detail: " leads qualificados de empresas farmacêuticas" },
        { text: "Compartilhe", detail: " expertise no marketplace de conhecimento" },
        { text: "Construa", detail: " reputação profissional e rede de contatos" },
        { text: "Participe", detail: " de projetos colaborativos da indústria" }
      ]
    },
    {
      icon: User,
      title: "Profissionais e Crescimento de Carreira",
      benefits: [
        { text: "Acelere", detail: " sua carreira farmacêutica ", highlight: "40% mais rápido" },
        { text: "Conecte-se", detail: " com mentores e líderes da indústria" },
        { text: "Acesse", detail: " oportunidades de trabalho exclusivas" },
        { text: "Mantenha-se", detail: " atualizado com tendências da indústria" }
      ]
    }
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Soluções para Cada Stakeholder Farmacêutico
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubra como cada tipo de profissional maximiza resultados na nossa plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {userTypes.map((userType, index) => {
            const Icon = userType.icon;
            return (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-6">{userType.title}</h3>
                  <div className="text-left space-y-3">
                    {userType.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span className="text-gray-600">
                          <strong>{benefit.text}</strong>
                          {benefit.detail}
                          {benefit.highlight && <strong>{benefit.highlight}</strong>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UserTypeSolutions;
