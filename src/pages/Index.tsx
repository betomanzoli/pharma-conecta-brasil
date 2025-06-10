
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
      specialties: ["Desenvolvimento Nacional", "Estudos Clínicos Brasil", "Regulamentação ANVISA"],
      rating: 4.9,
      experience: "15+ anos",
      isVerified: true,
      type: "professional" as const
    },
    {
      id: "2", 
      name: "AnalyticLab São Paulo",
      title: "Laboratório Brasileiro",
      company: "Grupo AnalyticLab",
      location: "São Paulo, SP",
      specialties: ["Controle de Qualidade ANVISA", "Análises Microbiológicas", "Bioequivalência Brasil"],
      rating: 4.8,
      experience: "20+ anos",
      isVerified: true,
      type: "laboratory" as const
    },
    {
      id: "3",
      name: "Ana Rodrigues",
      title: "Consultora Regulatória ANVISA",
      company: "RegConsult Brasil",
      location: "Rio de Janeiro, RJ",
      specialties: ["ANVISA", "RDC 843", "Registro Brasil"],
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
            title="Participantes do Piloto Brasileiro"
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
              Ferramentas Brasileiras em Desenvolvimento
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Teste nossas ferramentas conceituais focadas no mercado brasileiro e ajude a validar sua utilidade
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

      {/* Brazilian Pilot Statistics Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Programa Piloto FarmaConnect Brasil
            </h2>
            <p className="text-primary-100 mb-8">
              Validando o conceito com profissionais selecionados da indústria farmacêutica brasileira
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-primary-100">Profissionais Brasileiros Convidados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">15+</div>
              <div className="text-primary-100">Empresas Nacionais Participantes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">8+</div>
              <div className="text-primary-100">Laboratórios Brasileiros Testando</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">90 dias</div>
              <div className="text-primary-100">Período de Teste Gratuito</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot Testimonials */}
      <TestimonialsSection />

      {/* Pricing Section - Brazilian Pilot Phase */}
      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Fase Piloto Gratuita Brasileira
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Participe da validação do conceito no mercado farmacêutico brasileiro sem nenhum custo
          </p>
          
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-md mx-auto border-l-4 border-green-500">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Programa Piloto Brasil</h3>
            <div className="text-4xl font-bold text-primary mb-2">Gratuito</div>
            <p className="text-gray-500 mb-6">90 dias de teste no mercado brasileiro</p>
            
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Acesso completo à plataforma brasileira
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Ferramentas de matching nacional
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Suporte direto da equipe brasileira
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Expertise em ANVISA e RDC 843
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Participação na definição do produto
              </li>
            </ul>
            
            <Button size="lg" className="w-full mb-4">
              Candidatar-se ao Piloto Brasileiro
            </Button>
            
            <p className="text-sm text-gray-500">
              Modelo comercial será definido baseado no valor comprovado durante o piloto no mercado brasileiro
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ajude a Construir o Futuro da Colaboração Farmacêutica Brasileira
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Participe do nosso programa piloto e seja parte da validação deste conceito inovador para o mercado brasileiro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
              Participar do Piloto Gratuito Brasileiro
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg">
              Agendar Conversa sobre o Conceito
            </Button>
          </div>
          
          <p className="text-sm text-primary-100 mt-6 max-w-2xl mx-auto">
            Estamos buscando profissionais experientes da indústria farmacêutica brasileira para validar se nossa hipótese 
            de valor realmente resolve problemas reais do setor nacional. Conformidade total com LGPD.
          </p>
        </div>
      </section>

      <ComplianceFooter />
    </div>
  );
};

export default Index;
