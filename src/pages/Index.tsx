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
  CheckCircle
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
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              A Plataforma Completa do
              <span className="text-primary block">Ecossistema Farmacêutico</span>
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-4xl mx-auto">
              Conectando empresas farmacêuticas, laboratórios, consultores, fornecedores e profissionais em uma plataforma inteligente
            </p>
            <p className="text-lg text-primary font-medium mb-8 max-w-3xl mx-auto">
              Onde toda a indústria farmacêutica colabora, inova e cresce em conjunto
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary-600 px-8 py-3 text-lg">
                Cadastrar como Profissional
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary-50 px-8 py-3 text-lg">
                Cadastrar sua Empresa
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary-50 px-8 py-3 text-lg">
                Cadastrar seu Laboratório
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary-50 px-8 py-3 text-lg">
                Tornar-se Fornecedor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* User Type Sections */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Construído para Todos os Stakeholders Farmacêuticos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubra como o PharmaNexus acelera o sucesso de todos os participantes da indústria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pharmaceutical Companies */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Empresas e Indústrias Farmacêuticas</h3>
                <ul className="text-gray-600 text-left space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Encontre laboratórios especializados, consultores e fornecedores</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Acesse inteligência regulatória e ferramentas de conformidade</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Publique desafios de inovação e encontre soluções</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Conecte-se com os melhores talentos e prestadores de serviços</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Laboratories */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <FlaskConical className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Laboratórios e Prestadores de Serviços</h3>
                <ul className="text-gray-600 text-left space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Otimize sua utilização de capacidade</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Conecte-se com empresas que precisam dos seus serviços</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Apresente suas capacidades especializadas</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Colabore em projetos multi-empresariais</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Consultants */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <UserCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Consultores e Especialistas</h3>
                <ul className="text-gray-600 text-left space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Acesse leads qualificados de empresas farmacêuticas</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Compartilhe expertise através do nosso marketplace de conhecimento</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Construa sua reputação profissional e rede de contatos</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Participe de projetos colaborativos da indústria</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Professionals */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Profissionais e Crescimento de Carreira</h3>
                <ul className="text-gray-600 text-left space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Acelere sua carreira farmacêutica</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Conecte-se com mentores e líderes da indústria</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Acesse oportunidades de trabalho exclusivas</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Mantenha-se atualizado com tendências e regulamentações da indústria</span>
                  </li>
                </ul>
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
