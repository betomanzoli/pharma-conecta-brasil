
import { Button } from "@/components/ui/button";
import { Award, FlaskConical, Zap, Network, BarChart3, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Mobile-optimized heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            Testando a Primeira Plataforma que Conecta
            <span className="text-primary block">TODA a Indústria Farmacêutica Brasileira</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 mb-2 font-medium max-w-4xl mx-auto">
            Laboratórios + Indústrias + Consultores + Fornecedores em um só lugar
          </p>
          
          <p className="text-base md:text-lg text-primary-600 mb-6 font-semibold max-w-3xl mx-auto">
            🧪 Validação de Conceito | Piloto Gratuito | Testagem com Profissionais da Indústria
          </p>

          {/* Pilot Program Badge */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <FlaskConical className="h-5 w-5 text-primary" />
            <p className="text-base lg:text-lg text-primary font-semibold">
              Programa Piloto: Testando com profissionais farmacêuticos selecionados
            </p>
          </div>

          {/* Mobile-optimized Concept Features */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-2 p-3 lg:p-4 bg-white rounded-lg shadow-sm">
              <FlaskConical className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">Laboratórios Conectados</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 lg:p-4 bg-white rounded-lg shadow-sm">
              <Zap className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">Matching Inteligente</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 lg:p-4 bg-white rounded-lg shadow-sm">
              <Network className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">Networking Facilitado</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 lg:p-4 bg-white rounded-lg shadow-sm">
              <BarChart3 className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">Métricas de Valor</span>
            </div>
          </div>

          {/* Mobile-optimized CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center px-4">
            <Button size="lg" className="bg-primary hover:bg-primary-600 px-8 lg:px-10 py-3 lg:py-4 text-base lg:text-lg font-semibold">
              Participar do Piloto Gratuito
              <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary-50 px-8 lg:px-10 py-3 lg:py-4 text-base lg:text-lg">
              Ver Conceito
            </Button>
          </div>
          
          {/* Transparency Note */}
          <p className="text-sm text-gray-500 mt-4 max-w-2xl mx-auto">
            Estamos na fase de validação do conceito. Participe gratuitamente e ajude a moldar o futuro da colaboração farmacêutica no Brasil.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
