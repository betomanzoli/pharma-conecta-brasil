
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Network, Users, Calendar, User } from "lucide-react";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Conecte-se com os
              <span className="text-primary"> Melhores Profissionais</span>
              <br />
              da Indústria Farmacêutica
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              PharmaNexus é a plataforma de networking profissional exclusiva para 
              especialistas em farmácia, P&D, assuntos regulatórios e toda a cadeia farmacêutica brasileira.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary-600 px-8 py-3 text-lg">
                Começar Agora - Grátis
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary-50 px-8 py-3 text-lg">
                Saiba Mais
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-gray-600">Profissionais Conectados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <div className="text-gray-600">Empresas Farmacêuticas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600">Eventos por Mês</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-gray-600">Taxa de Satisfação</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tudo que Você Precisa para Crescer na Indústria Farmacêutica
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas especializadas para profissionais que querem acelerar sua carreira no setor farmacêutico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Network className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Networking Inteligente</h3>
                <p className="text-gray-600">
                  Conecte-se com profissionais por área de expertise: P&D, Controle de Qualidade, 
                  Assuntos Regulatórios, Produção e Comercial.
                </p>
              </div>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Perfil Especializado</h3>
                <p className="text-gray-600">
                  Crie um perfil profissional detalhado com suas competências específicas 
                  da indústria farmacêutica e anos de experiência.
                </p>
              </div>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Eventos & Insights</h3>
                <p className="text-gray-600">
                  Participe de webinars, conferências e receba insights exclusivos 
                  sobre tendências e inovações do mercado farmacêutico.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para Elevar sua Carreira Farmacêutica?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Junte-se a milhares de profissionais que já estão crescendo com o PharmaNexus.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg">
            Criar Conta Gratuita
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Network className="h-6 w-6" />
                <span className="text-xl font-bold">PharmaNexus</span>
              </div>
              <p className="text-gray-400">
                A plataforma de networking profissional para a indústria farmacêutica brasileira.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Rede Profissional</a></li>
                <li><a href="#" className="hover:text-white">Desenvolvimento</a></li>
                <li><a href="#" className="hover:text-white">Insights</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white">Carreiras</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PharmaNexus. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
