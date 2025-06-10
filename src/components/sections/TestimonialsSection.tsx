
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Award, Shield, TrendingUp, Building2, FlaskConical, UserCheck, User } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      icon: Building2,
      rating: 5,
      text: "O PharmaNexus revolucionou nossa busca por laboratórios especializados. O sistema de matching nos conectou com parceiros ideais que aceleraram nosso desenvolvimento em 40% e reduziram custos em R$ 300k.",
      author: "Dra. Maria Santos",
      position: "VP de P&D, BioPharma Brasil",
      credentials: "CRF-SP 12345 • 15 anos de experiência",
      metrics: {
        color: "blue",
        title: "Resultados Mensuráveis:",
        items: ["Tempo reduzido: 40%", "Economia: R$ 300k", "Parceiros encontrados: 8", "Projetos acelerados: 3"]
      }
    },
    {
      icon: FlaskConical,
      rating: 5,
      text: "Nossa utilização de capacidade laboratorial aumentou 60% em 6 meses. A plataforma nos trouxe projetos de alta qualidade e faturamento adicional de R$ 2.4M no primeiro ano.",
      author: "Carlos Ferreira",
      position: "Diretor, AnalyticLab São Paulo",
      credentials: "CNPJ: 12.345.678/0001-90 • ISO 17025 Certificado",
      metrics: {
        color: "green",
        title: "Impacto Financeiro:",
        items: ["Utilização: +60%", "Faturamento: R$ 2.4M", "Novos clientes: 24", "Projetos ativos: 15"]
      }
    },
    {
      icon: UserCheck,
      rating: 5,
      text: "Como consultora regulatória, encontro leads qualificados que resultaram em 85% de conversão e crescimento de 200% na minha base de clientes em apenas 8 meses.",
      author: "Ana Rodrigues",
      position: "Consultora Regulatória Sênior",
      credentials: "CRF-RJ 67890 • MBA Regulatório USP",
      metrics: {
        color: "purple",
        title: "Performance Comercial:",
        items: ["Conversão: 85%", "Crescimento: +200%", "Leads mensais: 12", "Projetos fechados: 28"]
      }
    },
    {
      icon: User,
      rating: 5,
      text: "Minha carreira acelerou drasticamente. Consegui uma promoção 18 meses mais rápido que o esperado e aumento salarial de 45% através das conexões e mentoria da plataforma.",
      author: "João Silva",
      position: "Especialista em P&D, FarmaTech",
      credentials: "Farmacêutico Unicamp • Especialização ANVISA",
      metrics: {
        color: "orange",
        title: "Crescimento Profissional:",
        items: ["Promoção: -18 meses", "Aumento: +45%", "Mentores conectados: 3", "Certificações: 4"]
      }
    }
  ];

  const companies = [
    "BioPharma Brasil", "AnalyticLab SP", "FarmaTech", "BioTest Labs", 
    "PharmaGlobal", "RegConsult", "LabMax", "BioSolutions"
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Reconhecimento da Indústria Farmacêutica
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Profissionais verificados compartilham seus sucessos
          </p>
          
          {/* Industry Recognition Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Endossado por Líderes da Indústria</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Profissionais Verificados</span>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">ROI Comprovado</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => {
            const Icon = testimonial.icon;
            return (
              <Card key={index} className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex text-primary">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <Badge className="ml-3 bg-green-100 text-green-800">Verificado</Badge>
                </div>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mr-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.position}</div>
                    <div className="text-xs text-primary font-medium mt-1">
                      {testimonial.credentials}
                    </div>
                  </div>
                </div>
                
                <div className={`mt-4 p-3 bg-${testimonial.metrics.color}-50 rounded-lg`}>
                  <div className={`text-sm font-medium text-${testimonial.metrics.color}-800 mb-1`}>
                    {testimonial.metrics.title}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-${testimonial.metrics.color}-700">
                    {testimonial.metrics.items.map((item, itemIndex) => (
                      <div key={itemIndex}>• {item}</div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        
        {/* Company Logos Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-8">Empresas que confiam no PharmaNexus:</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {companies.map((company) => (
              <div key={company} className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
