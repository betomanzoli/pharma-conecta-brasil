
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Users, Zap, Globe, Award, Lightbulb } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import DeployStatusBanner from "@/components/layout/DeployStatusBanner";
import { useState } from "react";

const Index = () => {
  const { user } = useAuth();
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');

  const handleDeploy = async () => {
    setDeployStatus('deploying');
    
    // Simular deploy - em produção isso seria conectado ao serviço de deploy
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% de chance de sucesso
      setDeployStatus(success ? 'success' : 'error');
    }, 3000);
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <DeployStatusBanner 
            status={deployStatus}
            url="https://seu-site.vercel.app"
            onRetry={handleDeploy}
          />
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bem-vindo ao PharmaConnect
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Você está logado! Acesse seu dashboard para começar.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Ir para Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleDeploy}
                disabled={deployStatus === 'deploying'}
              >
                <Globe className="mr-2 h-5 w-5" />
                {deployStatus === 'deploying' ? 'Fazendo Deploy...' : 'Deploy do Site'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PharmaConnect</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Cadastrar-se</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Conectando o Futuro Farmacêutico
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A plataforma definitiva para empresas farmacêuticas, laboratórios, consultores e profissionais 
            da saúde colaborarem, inovarem e crescerem juntos.
          </p>
          
          <div className="flex gap-4 justify-center mb-12">
            <Link to="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Por que escolher o PharmaConnect?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Shield className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle>Segurança e Compliance</CardTitle>
                <CardDescription>
                  Plataforma certificada com os mais altos padrões de segurança e conformidade regulatória.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Users className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle>Rede Especializada</CardTitle>
                <CardDescription>
                  Conecte-se com profissionais qualificados, empresas e laboratórios do setor farmacêutico.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Zap className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle>Automação Inteligente</CardTitle>
                <CardDescription>
                  Automatize processos, acompanhe regulamentações e otimize suas operações com IA.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Award className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle>Marketplace Integrado</CardTitle>
                <CardDescription>
                  Encontre serviços, equipamentos e oportunidades de parceria em um só lugar.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Lightbulb className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle>Biblioteca de Conhecimento</CardTitle>
                <CardDescription>
                  Acesse recursos, guias e documentação técnica atualizada do setor.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Globe className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle>Integração Global</CardTitle>
                <CardDescription>
                  Conecte-se com regulamentações internacionais e oportunidades globais.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Pronto para revolucionar seu negócio farmacêutico?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de profissionais que já estão transformando o setor farmacêutico com o PharmaConnect.
          </p>
          
          <Link to="/register">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Cadastrar-se Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-xl font-bold">PharmaConnect</span>
            </div>
            <p className="text-gray-400">
              © 2024 PharmaConnect. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
