
import { Button } from "@/components/ui/button";
import { Award, FlaskConical, Zap, Network, BarChart3, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Mobile-optimized heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            A Única Plataforma que Conecta
            <span className="text-primary block">TODA a Indústria Farmacêutica Brasileira</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-700 mb-6 font-medium max-w-4xl mx-auto">
            Laboratórios + Indústrias + Consultores + Fornecedores em um só lugar
          </p>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Award className="h-5 w-5 text-primary" />
            <p className="text-base lg:text-lg text-primary font-semibold">
              Mais de 500 profissionais farmacêuticos já conectados
            </p>
          </div>

          {/* Mobile-optimized Quick Benefits */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-2 p-3 lg:p-4 bg-white rounded-lg shadow-sm">
              <FlaskConical className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">Laboratórios Qualificados</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 lg:p-4 bg-white rounded-lg shadow-sm">
              <Zap className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">IA Especializada</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 lg:p-4 bg-white rounded-lg shadow-sm">
              <Network className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">Parcerias Estratégicas</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 lg:p-4 bg-white rounded-lg shadow-sm">
              <BarChart3 className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              <span className="text-xs lg:text-sm font-medium text-gray-700 text-center">ROI Comprovado</span>
            </div>
          </div>

          {/* Mobile-optimized CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center px-4">
            <Button size="lg" className="bg-primary hover:bg-primary-600 px-8 lg:px-10 py-3 lg:py-4 text-base lg:text-lg font-semibold">
              Começar Gratuitamente
              <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary-50 px-8 lg:px-10 py-3 lg:py-4 text-base lg:text-lg">
              Ver Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
