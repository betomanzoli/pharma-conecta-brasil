import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Compliance Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <ComplianceDisclaimer />
      </div>
      
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

      {/* Platform Features Showcase */}
      <section className="py-20">
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

      {/* Testimonials */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Histórias de Sucesso em Toda a Indústria
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8">
              <div className="flex items-center mb-4">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "O PharmaNexus nos conectou com laboratórios analíticos especializados que não teríamos encontrado de outra forma. 
                O sistema de matching da plataforma nos poupou meses de busca e nos ajudou a lançar nosso produto 40% mais rápido."
              </p>
              <div className="flex items-center">
                <div className="bg-primary-50 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Dra. Maria Santos</div>
                  <div className="text-sm text-gray-500">VP de P&D, BioPharma Brasil</div>
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
              </div>
              <p className="text-gray-600 mb-4">
                "Nossa utilização da capacidade laboratorial aumentou 60% após nos juntarmos ao PharmaNexus. 
                A plataforma consistentemente nos traz projetos de alta qualidade de empresas farmacêuticas."
              </p>
              <div className="flex items-center">
                <div className="bg-primary-50 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <FlaskConical className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Carlos Ferreira</div>
                  <div className="text-sm text-gray-500">Diretor, AnalyticLab São Paulo</div>
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
              </div>
              <p className="text-gray-600 mb-4">
                "Como consultora regulatória, o PharmaNexus se tornou minha principal fonte de leads qualificados. 
                O matching inteligente da plataforma me traz clientes que precisam exatamente da minha expertise."
              </p>
              <div className="flex items-center">
                <div className="bg-primary-50 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Ana Rodrigues</div>
                  <div className="text-sm text-gray-500">Consultora Regulatória Sênior</div>
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
              </div>
              <p className="text-gray-600 mb-4">
                "Minha carreira farmacêutica decolou depois que me juntei ao PharmaNexus. 
                A rede de mentores e as oportunidades exclusivas me ajudaram a crescer mais rápido do que imaginava ser possível."
              </p>
              <div className="flex items-center">
                <div className="bg-primary-50 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">João Silva</div>
                  <div className="text-sm text-gray-500">Especialista em P&D, FarmaTech</div>
                </div>
              </div>
            </Card>
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
