
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, FlaskConical, Users, User, CheckCircle, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/ui/logo";

const Index = () => {
  const { user, loading } = useAuth();

  console.log('Index page - User status:', { user: user?.email, loading });

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1565C0] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (user) {
    console.log('User authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Logo size="lg" />
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth#login">
                <Button variant="ghost" className="text-[#1565C0]">
                  Entrar
                </Button>
              </Link>
              <Link to="/auth#register">
                <Button className="bg-[#1565C0] hover:bg-[#1565C0]/90">
                  Cadastrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4 bg-[#1565C0]/10 text-[#1565C0]">
            🇧🇷 Ecossistema Brasileiro
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            O Futuro da
            <span className="text-[#1565C0] block">Indústria Farmacêutica</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Conecte-se com os melhores profissionais, laboratórios e empresas do setor farmacêutico brasileiro. 
            Uma plataforma colaborativa para acelerar a inovação em saúde.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth#register">
              <Button size="lg" className="bg-[#1565C0] hover:bg-[#1565C0]/90 px-8">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/auth#login">
              <Button size="lg" variant="outline" className="border-[#1565C0] text-[#1565C0] hover:bg-[#1565C0] hover:text-white">
                Já Tenho Conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Para Todos os Profissionais do Setor
            </h2>
            <p className="text-xl text-gray-600">
              Independente do seu papel na indústria farmacêutica, temos as ferramentas certas para você
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Building2,
                title: "Empresas Farmacêuticas",
                description: "Encontre parceiros, fornecedores e talentos para seus projetos",
                color: "bg-blue-500"
              },
              {
                icon: FlaskConical,
                title: "Laboratórios Analíticos", 
                description: "Conecte-se com empresas que precisam de seus serviços especializados",
                color: "bg-green-500"
              },
              {
                icon: Users,
                title: "Consultores Regulatórios",
                description: "Ofereça sua expertise e encontre novos clientes e projetos",
                color: "bg-purple-500"
              },
              {
                icon: User,
                title: "Profissionais Independentes",
                description: "Faça networking e descubra oportunidades de carreira",
                color: "bg-orange-500"
              }
            ].map((userType, index) => {
              const Icon = userType.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${userType.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{userType.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {userType.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recursos Poderosos
            </h2>
            <p className="text-xl text-gray-600">
              Tudo que você precisa para acelerar seus projetos farmacêuticos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "IA Especializada",
                description: "Assistente de IA treinado especificamente para o setor farmacêutico brasileiro",
                icon: "🤖"
              },
              {
                title: "Rede de Profissionais",
                description: "Conecte-se com mais de 10.000 profissionais verificados do setor",
                icon: "👥"
              },
              {
                title: "Projetos Colaborativos",
                description: "Participe de projetos inovadores e encontre parceiros ideais",
                icon: "🚀"
              },
              {
                title: "Biblioteca de Conhecimento",
                description: "Acesso a documentos, estudos e melhores práticas do setor",
                icon: "📚"
              },
              {
                title: "Automações Regulatórias",
                description: "Simplifique processos de compliance com a ANVISA",
                icon: "⚙️"
              },
              {
                title: "Marketplace",
                description: "Encontre e ofereça serviços especializados com segurança",
                icon: "🛒"
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Confiado por Líderes do Setor
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "O PharmaConnect Brasil revolucionou nossa forma de encontrar parceiros para projetos regulatórios.",
                author: "Dr. Ana Silva",
                role: "Diretora Regulatória, FarmaBrasil"
              },
              {
                quote: "Conseguimos reduzir o tempo de aprovação de nossos produtos em 40% usando as automações da plataforma.",
                author: "Carlos Mendes", 
                role: "CEO, LabTech Solutions"
              },
              {
                quote: "A IA especializada nos ajuda diariamente com questões complexas de compliance farmacêutico.",
                author: "Dra. Maria Santos",
                role: "Consultora Regulatória Independente"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-600 mb-4 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1565C0] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Transformar Seus Projetos Farmacêuticos?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de profissionais que já estão acelerando a inovação em saúde no Brasil
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth#register">
              <Button size="lg" variant="secondary" className="px-8 bg-white text-[#1565C0] hover:bg-gray-100">
                Criar Conta Gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="text-sm mt-4 opacity-75">
            Sem compromisso • Configuração em 2 minutos
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Logo size="md" className="text-white mb-4" />
              <p className="text-gray-400">
                O ecossistema colaborativo da indústria farmacêutica brasileira
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Recursos</li>
                <li>Preços</li>
                <li>API</li>
                <li>Documentação</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre</li>
                <li>Blog</li>
                <li>Carreiras</li>
                <li>Contato</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Central de Ajuda</li>
                <li>Status</li>
                <li>Privacidade</li>
                <li>Termos</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PharmaConnect Brasil. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
