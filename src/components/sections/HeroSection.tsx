
import { Button } from "@/components/ui/button";
import { Award, FlaskConical, Zap, Network, BarChart3, ArrowRight, MapPin, Shield } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Brazilian Badge */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
              🇧🇷 100% Brasileiro
            </div>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
              Especialistas em ANVISA
            </div>
          </div>

          {/* Mobile-optimized heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            A PRIMEIRA Plataforma Colaborativa
            <span className="text-primary block">da Indústria Farmacêutica Brasileira</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 mb-2 font-medium max-w-4xl mx-auto">
            Conectando laboratórios, indústrias, consultores e profissionais DO BRASIL
          </p>
          
          <p className="text-base md:text-lg text-primary-600 mb-6 font-semibold max-w-3xl mx-auto">
            🧪 Validação de Conceito | Piloto Gratuito | Expertise em ANVISA, RDC 843 e peculiaridades do mercado nacional
          </p>

          {/* Brazilian Focus Section */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <MapPin className="h-5 w-5 text-green-600" />
              <p className="text-base lg:text-lg text-green-800 font-semibold">
                Cobertura Nacional: São Paulo • Rio de Janeiro • Minas Gerais • Rio Grande do Sul • Paraná
              </p>
            </div>
            <p className="text-sm text-green-700">
              Desenvolvido por consultores brasileiros para o mercado brasileiro | Conformidade total com LGPD
            </p>
          </div>

          {/* Pilot Program Badge */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <FlaskConical className="h-5 w-5 text-primary" />
            <p className="text-base lg:text-lg text-primary font-semibold">
              Programa Piloto: Testando com profissionais farmacêuticos brasileiros selecionados
            </p>
          </div>

          {/* Mobile-optimized Concept Features */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-2 p-3 lg:p-4 bg-white rounded-lg shadow-sm border-l-4 border-green-500">
              <FlaskConical className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">Laboratórios Brasileiros</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 lg:p-4 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
              <Zap className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">Matching Nacional</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 lg:p-4 bg-white rounded-lg shadow-sm border-l-4 border-yellow-500">
              <Network className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">Ecossistema Brasileiro</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 lg:p-4 bg-white rounded-lg shadow-sm border-l-4 border-green-500">
              <Shield className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">Conformidade ANVISA</span>
            </div>
          </div>

          {/* Differentiation Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
            <h3 className="text-lg font-bold text-blue-900 mb-3">
              Diferente de Consultorias Tradicionais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-blue-800">Ecossistema Permanente</div>
                <div className="text-blue-600">vs projetos pontuais</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-800">Todos Conectados</div>
                <div className="text-blue-600">vs relacionamentos isolados</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-800">Plataforma Colaborativa</div>
                <div className="text-blue-600">vs consultoria tradicional</div>
              </div>
            </div>
          </div>

          {/* Mobile-optimized CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center px-4">
            <Button size="lg" className="bg-primary hover:bg-primary-600 px-8 lg:px-10 py-3 lg:py-4 text-base lg:text-lg font-semibold" asChild>
              <a href="/auth">
                Participar do Piloto Gratuito
                <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary-50 px-8 lg:px-10 py-3 lg:py-4 text-base lg:text-lg" asChild>
              <a href="/apis">
                Ver APIs e Integrações Reais
              </a>
            </Button>
          </div>
          
          {/* Brazilian Focus Transparency Note */}
          <p className="text-sm text-gray-500 mt-6 max-w-3xl mx-auto">
            Focado exclusivamente no ecossistema farmacêutico brasileiro. Estamos na fase de validação do conceito baseado em necessidades reais do mercado nacional. Participe gratuitamente e ajude a moldar o futuro da colaboração farmacêutica no Brasil.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
