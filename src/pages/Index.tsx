import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Network, 
  Users, 
  Calendar, 
  User, 
  Building2, 
  FlaskConical, 
  UserCheck, 
  Briefcase,
  Search,
  Shield,
  Zap,
  BookOpen,
  Target,
  TrendingUp,
  Star,
  CheckCircle,
  ArrowRight,
  Award,
  BarChart3
} from "lucide-react";
import Header from "@/components/Header";
import ComplianceFooter from "@/components/ComplianceFooter";
import ComplianceDisclaimer from "@/components/ComplianceDisclaimer";
import ROICalculator from "@/components/pharmaceutical/ROICalculator";
import LabFinder from "@/components/pharmaceutical/LabFinder";
import ComplianceChecker from "@/components/pharmaceutical/ComplianceChecker";
import SwipeableCards from "@/components/mobile/SwipeableCards";

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
      
      {/* Mobile-Optimized Hero Section */}
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

      {/* Mobile Professional Cards Section */}
      <section className="lg:hidden py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SwipeableCards 
            professionals={sampleProfessionals}
            title="Profissionais em Destaque"
          />
        </div>
      </section>

      {/* Optimized Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main Value Proposition - First 3 seconds */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              A Única Plataforma que Conecta
              <span className="text-primary block">TODA a Indústria Farmacêutica Brasileira</span>
            </h1>
            
            {/* Clear Sub-value - Next 3 seconds */}
            <p className="text-2xl text-gray-700 mb-6 font-medium max-w-4xl mx-auto">
              Laboratórios + Indústrias + Consultores + Fornecedores em um só lugar
            </p>

            {/* Social Proof - Build trust quickly */}
            <div className="flex items-center justify-center space-x-2 mb-8">
              <Award className="h-5 w-5 text-primary" />
              <p className="text-lg text-primary font-semibold">
                Mais de 500 profissionais farmacêuticos já conectados
              </p>
            </div>

            {/* Quick Benefits - Scannable icons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto">
              <div className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-sm">
                <FlaskConical className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium text-gray-700">Laboratórios Qualificados</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-sm">
                <Zap className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium text-gray-700">IA Especializada</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-sm">
                <Network className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium text-gray-700">Parcerias Estratégicas</span>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 bg-white rounded-lg shadow-sm">
                <BarChart3 className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium text-gray-700">ROI Comprovado</span>
              </div>
            </div>

            {/* Clear CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary-600 px-10 py-4 text-lg font-semibold">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary-50 px-10 py-4 text-lg">
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Optimized User Type Sections - Scannable format */}
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
            {/* Pharmaceutical Companies */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-6">Empresas e Indústrias Farmacêuticas</h3>
                <div className="text-left space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-600"><strong>Encontre</strong> laboratórios especializados e fornecedores qualificados</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-600"><strong>Acesse</strong> inteligência regulatória ANVISA em tempo real</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-600"><strong>Publique</strong> desafios de inovação e encontre soluções</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-600"><strong>Conecte-se</strong> com talentos e prestadores de elite</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Laboratories */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <FlaskConical className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-6">Laboratórios e Prestadores de Serviços</h3>
                <div className="text-left space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-600"><strong>Otimize</strong> utilização de capacidade até <strong>60%</strong></span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-600"><strong>Conecte-se</strong> com empresas que precisam dos seus serviços</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-600"><strong>Apresente</strong> suas capacidades especializadas</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-600"><strong>Colabore</strong> em projetos multi-empresariais</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Consultants */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <UserCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-6">Consultores e Especialistas</h3>
                <div className="text-left space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-600"><strong>Acesse</strong> leads qualificados de empresas farmacêuticas</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-600"><strong>Compartilhe</strong> expertise no marketplace de conhecimento</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-600"><strong>Construa</strong> reputação profissional e rede de contatos</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-600"><strong>Participe</strong> de projetos colaborativos da indústria</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Professionals */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-6">Profissionais e Crescimento de Carreira</h3>
                <div className="text-left space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-600"><strong>Acelere</strong> sua carreira farmacêutica <strong>40% mais rápido</strong></span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-600"><strong>Conecte-se</strong> com mentores e líderes da indústria</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-600"><strong>Acesse</strong> oportunidades de trabalho exclusivas</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-600"><strong>Mantenha-se</strong> atualizado com tendências da indústria</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

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
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Motor de Matching com IA</h3>
              <p className="text-gray-600">Conecta automaticamente necessidades e capacidades complementares em todo o ecossistema</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Centro de Inteligência Regulatória</h3>
              <p className="text-gray-600">Atualizações em tempo real da ANVISA, FDA e ferramentas de conformidade para operações contínuas</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Search className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Marketplace B2B</h3>
              <p className="text-gray-600">Equipamentos, serviços e oportunidades colaborativas em uma plataforma</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Repositório de Conhecimento</h3>
              <p className="text-gray-600">Templates, estudos de caso e melhores práticas da indústria compartilhados por especialistas</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Hub de Colaboração em Projetos</h3>
              <p className="text-gray-600">Projetos farmacêuticos multi-stakeholder gerenciados de forma contínua</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <Network className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Networking Inteligente</h3>
              <p className="text-gray-600">Conecte-se com os profissionais, mentores e líderes da indústria certos</p>
            </Card>
          </div>
        </div>
      </section>

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

      {/* Enhanced Testimonials with Pharmaceutical Credibility */}
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
            <Card className="p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <Badge className="ml-3 bg-green-100 text-green-800">Verificado</Badge>
              </div>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                "O PharmaNexus revolucionou nossa busca por laboratórios especializados. 
                O sistema de matching nos conectou com parceiros ideais que aceleraram nosso 
                desenvolvimento em <strong>40%</strong> e reduziram custos em <strong>R$ 300k</strong>."
              </p>
              <div className="flex items-center">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mr-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-lg">Dra. Maria Santos</div>
                  <div className="text-sm text-gray-500">VP de P&D, BioPharma Brasil</div>
                  <div className="text-xs text-primary font-medium mt-1">
                    CRF-SP 12345 • 15 anos de experiência
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-800 mb-1">Resultados Mensuráveis:</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                  <div>• Tempo reduzido: 40%</div>
                  <div>• Economia: R$ 300k</div>
                  <div>• Parceiros encontrados: 8</div>
                  <div>• Projetos acelerados: 3</div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <Badge className="ml-3 bg-green-100 text-green-800">Verificado</Badge>
              </div>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                "Nossa utilização de capacidade laboratorial aumentou <strong>60%</strong> 
                em 6 meses. A plataforma nos trouxe projetos de alta qualidade e 
                faturamento adicional de <strong>R$ 2.4M</strong> no primeiro ano."
              </p>
              <div className="flex items-center">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mr-4">
                  <FlaskConical className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-lg">Carlos Ferreira</div>
                  <div className="text-sm text-gray-500">Diretor, AnalyticLab São Paulo</div>
                  <div className="text-xs text-primary font-medium mt-1">
                    CNPJ: 12.345.678/0001-90 • ISO 17025 Certificado
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-800 mb-1">Impacto Financeiro:</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
                  <div>• Utilização: +60%</div>
                  <div>• Faturamento: R$ 2.4M</div>
                  <div>• Novos clientes: 24</div>
                  <div>• Projetos ativos: 15</div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <Badge className="ml-3 bg-green-100 text-green-800">Verificado</Badge>
              </div>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                "Como consultora regulatória, encontro leads qualificados que resultaram 
                em <strong>85% de conversão</strong> e crescimento de <strong>200%</strong> 
                na minha base de clientes em apenas 8 meses."
              </p>
              <div className="flex items-center">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mr-4">
                  <UserCheck className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-lg">Ana Rodrigues</div>
                  <div className="text-sm text-gray-500">Consultora Regulatória Sênior</div>
                  <div className="text-xs text-primary font-medium mt-1">
                    CRF-RJ 67890 • MBA Regulatório USP
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <div className="text-sm font-medium text-purple-800 mb-1">Performance Comercial:</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-purple-700">
                  <div>• Conversão: 85%</div>
                  <div>• Crescimento: +200%</div>
                  <div>• Leads mensais: 12</div>
                  <div>• Projetos fechados: 28</div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <Badge className="ml-3 bg-green-100 text-green-800">Verificado</Badge>
              </div>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                "Minha carreira acelerou drasticamente. Consegui uma promoção 
                <strong>18 meses mais rápido</strong> que o esperado e aumento salarial 
                de <strong>45%</strong> através das conexões e mentoria da plataforma."
              </p>
              <div className="flex items-center">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mr-4">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-lg">João Silva</div>
                  <div className="text-sm text-gray-500">Especialista em P&D, FarmaTech</div>
                  <div className="text-xs text-primary font-medium mt-1">
                    Farmacêutico Unicamp • Especialização ANVISA
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                <div className="text-sm font-medium text-orange-800 mb-1">Crescimento Profissional:</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-orange-700">
                  <div>• Promoção: -18 meses</div>
                  <div>• Aumento: +45%</div>
                  <div>• Mentores conectados: 3</div>
                  <div>• Certificações: 4</div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Company Logos Section */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-8">Empresas que confiam no PharmaNexus:</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {[
                "BioPharma Brasil", "AnalyticLab SP", "FarmaTech", "BioTest Labs", 
                "PharmaGlobal", "RegConsult", "LabMax", "BioSolutions"
              ].map((company) => (
                <div key={company} className="bg-white px-6 py-3 rounded-lg shadow-sm">
                  <span className="text-gray-700 font-medium">{company}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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

      {/* Replace simple footer with compliance footer */}
      <ComplianceFooter />
    </div>
  );
};

export default Index;

</edits_to_apply>
