
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ComplianceFooter from "@/components/ComplianceFooter";
import ComplianceDisclaimer from "@/components/ComplianceDisclaimer";
import ROICalculator from "@/components/pharmaceutical/ROICalculator";
import LabFinder from "@/components/pharmaceutical/LabFinder";
import ComplianceChecker from "@/components/pharmaceutical/ComplianceChecker";
import SwipeableCards from "@/components/mobile/SwipeableCards";
import HeroSection from "@/components/sections/HeroSection";
import UserTypeSolutions from "@/components/sections/UserTypeSolutions";
import PlatformFeatures from "@/components/sections/PlatformFeatures";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

const Index = () => {
  // Sample data for mobile cards
  const sampleProfessionals = [
    {
      id: "1",
      name: "Dr. Maria Santos",
      title: "VP de P&D",
      company: "BioPharma Brasil",
      location: "São Paulo, SP",
      specialties: ["Desenvolvimento de Medicamentos", "Estudos Clínicos", "Farmacovigilância"],
      rating: 4.9,
      experience: "15+ anos",
      isVerified: true,
      type: "professional" as const
    },
    {
      id: "2", 
      name: "AnalyticLab São Paulo",
      title: "Laboratório Especializado",
      company: "Grupo AnalyticLab",
      location: "São Paulo, SP",
      specialties: ["Controle de Qualidade", "Análises Microbiológicas", "Bioequivalência"],
      rating: 4.8,
      experience: "20+ anos",
      isVerified: true,
      type: "laboratory" as const
    },
    {
      id: "3",
      name: "Ana Rodrigues",
      title: "Consultora Regulatória Sênior",
      company: "RegConsult",
      location: "Rio de Janeiro, RJ",
      specialties: ["ANVISA", "Registro de Medicamentos", "Compliance"],
      rating: 4.9,
      experience: "12+ anos",
      isVerified: true,
      type: "consultant" as const
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Compliance Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <ComplianceDisclaimer />
      </div>
      
      {/* Hero Section */}
      <HeroSection />

      {/* Mobile Professional Cards Section */}
      <section className="lg:hidden py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SwipeableCards 
            professionals={sampleProfessionals}
            title="Profissionais em Destaque"
          />
        </div>
      </section>

      {/* User Type Solutions */}
      <UserTypeSolutions />

      {/* Interactive Tools Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ferramentas Interativas Farmacêuticas
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Utilize nossas ferramentas especializadas para tomar decisões mais assertivas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ROICalculator />
            <LabFinder />
            <ComplianceChecker />
          </div>
        </div>
      </section>

      {/* Platform Features Showcase */}
      <PlatformFeatures />

      {/* Statistics Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Impulsionando a Colaboração Farmacêutica
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">10.000+</div>
              <div className="text-primary-100">Profissionais Farmacêuticos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-primary-100">Empresas Encontrando Soluções Diariamente</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">300+</div>
              <div className="text-primary-100">Laboratórios Otimizando Capacidade</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">1.000+</div>
              <div className="text-primary-100">Colaborações Bem-sucedidas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <TestimonialsSection />

      {/* Call to Action */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Comece a Colaborar Hoje
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Junte-se ao maior ecossistema farmacêutico e acelere seu crescimento
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
              Cadastrar Gratuitamente
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg">
              Agendar Demo
            </Button>
          </div>
        </div>
      </section>

      <ComplianceFooter />
    </div>
  );
};

export default Index;
