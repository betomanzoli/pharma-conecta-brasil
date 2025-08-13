
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, FlaskConical, Target, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/ui/logo";

const Index = () => {
  const features = [
    {
      icon: Users,
      title: "Networking Qualificado",
      description: "Conecte-se com profissionais verificados da indústria farmacêutica"
    },
    {
      icon: Building2,
      title: "Parcerias Estratégicas",
      description: "Encontre empresas e laboratórios para colaborações"
    },
    {
      icon: FlaskConical,
      title: "Conhecimento Especializado",
      description: "Acesse biblioteca de conhecimento técnico e regulatório"
    },
    {
      icon: Target,
      title: "IA Matching",
      description: "Sistema inteligente para conectar perfis complementares"
    }
  ];

  const benefits = [
    "Rede verificada de profissionais",
    "Sistema de matching por IA",
    "Biblioteca de conhecimento especializada",
    "Oportunidades de mentoria",
    "Fóruns de discussão técnica",
    "Eventos e workshops exclusivos"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Logo size="sm" />
          </div>
          <nav className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-[#1565C0] hover:bg-[#1565C0]/90">Cadastrar</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4">
              🚀 Plataforma de Networking Farmacêutico
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Conecte-se com o
              <span className="text-[#1565C0]"> Ecossistema Farmacêutico</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A plataforma que conecta profissionais, empresas e laboratórios da indústria farmacêutica brasileira através de IA e networking qualificado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-[#1565C0] hover:bg-[#1565C0]/90">
                  Comece Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Saiba Mais
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recursos da Plataforma
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas desenvolvidas especificamente para as necessidades do setor farmacêutico
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-[#1565C0]/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-[#1565C0]" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#1565C0] to-blue-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Por que escolher o PharmaConnect Brasil?
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                Uma plataforma completa para acelerar sua carreira e negócios no setor farmacêutico brasileiro.
              </p>
              <Link to="/auth">
                <Button variant="secondary" size="lg">
                  Junte-se à Comunidade
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-white">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Pronto para conectar-se?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Junte-se a centenas de profissionais que já estão transformando suas carreiras
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-[#1565C0] hover:bg-[#1565C0]/90">
              Criar Conta Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Logo size="sm" />
          </div>
          <p className="text-gray-400">
            © 2024 PharmaConnect Brasil. Conectando o futuro da indústria farmacêutica.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
