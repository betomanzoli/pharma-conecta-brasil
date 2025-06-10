
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Award, Shield, TrendingUp, Building2, FlaskConical, UserCheck, User, Target, MapPin } from "lucide-react";

const TestimonialsSection = () => {
  const pilotParticipants = [
    {
      icon: Building2,
      status: "Em Teste",
      text: "Estamos testando a plataforma para avaliar como ela pode otimizar nossa busca por laboratórios especializados brasileiros e acelerar nossos projetos de desenvolvimento com foco nas exigências da ANVISA.",
      author: "Dra. Maria Santos",
      position: "VP de P&D, BioPharma Brasil",
      credentials: "CRF-SP 12345 • 15 anos no mercado brasileiro",
      location: "São Paulo, SP",
      testingMetrics: {
        color: "blue",
        title: "Métricas que Estamos Avaliando:",
        items: ["Tempo de busca por parceiros nacionais", "Qualidade dos matches brasileiros", "Facilidade de uso", "Valor agregado para o mercado nacional"]
      }
    },
    {
      icon: FlaskConical,
      status: "Piloto Ativo",
      text: "Participamos do piloto para verificar se a plataforma realmente pode aumentar nossa utilização de capacidade conectando com indústrias brasileiras e trazer novos projetos qualificados que atendam às normas nacionais.",
      author: "Carlos Ferreira",
      position: "Diretor, AnalyticLab São Paulo",
      credentials: "CNPJ: 12.345.678/0001-90 • Certificado ANVISA",
      location: "São Paulo, SP",
      testingMetrics: {
        color: "green",
        title: "Indicadores em Monitoramento:",
        items: ["Taxa de utilização", "Qualidade dos leads brasileiros", "Tempo de resposta", "Novos contatos nacionais estabelecidos"]
      }
    },
    {
      icon: UserCheck,
      status: "Testando",
      text: "Como consultora especializada em regulamentação brasileira, estou avaliando se a plataforma pode gerar leads mais qualificados e facilitar conexões com empresas que precisam de expertise em ANVISA e RDC 843.",
      author: "Ana Rodrigues",
      position: "Consultora Regulatória Sênior",
      credentials: "CRF-RJ 67890 • Especialista ANVISA",
      location: "Rio de Janeiro, RJ",
      testingMetrics: {
        color: "purple",
        title: "Validando Hipóteses:",
        items: ["Qualidade dos leads nacionais", "Taxa de conversão", "Facilidade de networking brasileiro", "Valor das conexões locais"]
      }
    },
    {
      icon: User,
      status: "Participante",
      text: "Estou testando como a plataforma pode acelerar conexões profissionais no mercado brasileiro e facilitar acesso a mentoria especializada na regulamentação e peculiaridades da indústria farmacêutica nacional.",
      author: "João Silva",
      position: "Especialista em P&D, FarmaTech",
      credentials: "Farmacêutico Unicamp • Especialização ANVISA",
      location: "Campinas, SP",
      testingMetrics: {
        color: "orange",
        title: "Aspectos em Avaliação:",
        items: ["Facilidade de networking brasileiro", "Qualidade das conexões nacionais", "Acesso a mentoria local", "Oportunidades no mercado nacional"]
      }
    }
  ];

  const baselineMetrics = [
    "Tempo médio para encontrar parceiros especializados no Brasil",
    "Taxa de resposta a solicitações de colaboração nacional", 
    "Qualidade percebida dos matches brasileiros",
    "Satisfação com processo atual de networking nacional",
    "Número de conexões relevantes por mês no mercado brasileiro"
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Participantes do Programa Piloto Brasileiro
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Profissionais da indústria farmacêutica brasileira testando e validando o conceito
          </p>
          
          {/* Brazilian Pilot Phase Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border-l-4 border-green-500">
              <Target className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Validação no Mercado Brasileiro</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border-l-4 border-blue-500">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Participantes Verificados ANVISA</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border-l-4 border-yellow-500">
              <FlaskConical className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Teste Gratuito Nacional</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pilotParticipants.map((participant, index) => {
            const Icon = participant.icon;
            return (
              <Card key={index} className="p-8">
                <div className="flex items-center mb-4">
                  <Badge className="bg-blue-100 text-blue-800">{participant.status}</Badge>
                  <Badge className="ml-3 bg-green-100 text-green-800">Piloto Brasil</Badge>
                </div>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  "{participant.text}"
                </p>
                <div className="flex items-center">
                  <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mr-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{participant.author}</div>
                    <div className="text-sm text-gray-500">{participant.position}</div>
                    <div className="text-xs text-primary font-medium mt-1">
                      {participant.credentials}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {participant.location}
                    </div>
                  </div>
                </div>
                
                <div className={`mt-4 p-3 bg-${participant.testingMetrics.color}-50 rounded-lg`}>
                  <div className={`text-sm font-medium text-${participant.testingMetrics.color}-800 mb-1`}>
                    {participant.testingMetrics.title}
                  </div>
                  <div className="grid grid-cols-1 gap-1 text-xs text-${participant.testingMetrics.color}-700">
                    {participant.testingMetrics.items.map((item, itemIndex) => (
                      <div key={itemIndex}>• {item}</div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        
        {/* Brazilian Baseline Metrics Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Métricas Baseline do Mercado Brasileiro que Estamos Medindo
            </h3>
            <p className="text-gray-600">
              Estabelecendo indicadores para medir o impacto real da plataforma no ecossistema farmacêutico brasileiro
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {baselineMetrics.map((metric, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-gray-700">{metric}</span>
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Resultados serão compartilhados transparentemente com todos os participantes do piloto brasileiro
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
