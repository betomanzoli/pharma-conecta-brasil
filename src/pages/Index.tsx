
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Zap, Shield, Globe, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();

  // Redirecionar usuário logado para o dashboard
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PharmaConnect Brasil</h1>
                <p className="text-xs text-gray-600">Ecossistema Colaborativo</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Cadastrar-se
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              A <span className="text-blue-600">PRIMEIRA</span> Plataforma<br />
              Colaborativa da Indústria<br />
              Farmacêutica Brasileira
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Conecte-se com laboratórios, indústrias farmacêuticas, consultores e profissionais 
              especializados. Uma plataforma completa com IA, automação e compliance integrados.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                  Fazer Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Ecossistema Colaborativo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Conecte empresas, laboratórios, consultores e profissionais em uma única plataforma integrada.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">IA & Automação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Inteligência artificial avançada e automação completa para otimizar seus processos.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Compliance & Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Conformidade LGPD, ANVISA e padrões internacionais com segurança enterprise.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">95.5%</div>
                <div className="text-gray-600">Consolidação Enterprise</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                <div className="text-gray-600">Performance Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">92%</div>
                <div className="text-gray-600">LGPD Compliance</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">65+</div>
                <div className="text-gray-600">Testes Automatizados</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-12">
            <Globe className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-bold mb-4">
              Junte-se ao Futuro da Colaboração Farmacêutica
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Seja parte da transformação digital da indústria farmacêutica brasileira
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Cadastrar Minha Empresa
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">PharmaConnect Brasil</span>
          </div>
          <p className="text-gray-600">
            © 2024 PharmaConnect Brasil. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
