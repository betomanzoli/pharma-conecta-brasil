
import React from 'react';
import Logo from '@/components/ui/logo';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Eye, Award, TrendingUp, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/">
              <Logo size="md" />
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-primary-600 hover:bg-primary-700">
                  Cadastrar-se
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sobre a PharmaConnect Brasil
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A primeira plataforma digital do Brasil dedicada exclusivamente ao 
            ecossistema farmacêutico, conectando empresas, laboratórios e consultores 
            através de tecnologia e inteligência artificial.
          </p>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <CardTitle>Nossa Missão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Revolucionar o setor farmacêutico brasileiro através de uma plataforma 
                que conecta, capacita e acelera a inovação, garantindo acesso a 
                medicamentos seguros e eficazes para toda a população.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Eye className="h-12 w-12 text-secondary-600 mx-auto mb-4" />
              <CardTitle>Nossa Visão</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Ser a principal plataforma de conexão do ecossistema farmacêutico 
                brasileiro até 2030, promovendo inovação, eficiência e conformidade 
                regulatória em todo o país.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Award className="h-12 w-12 text-accent-600 mx-auto mb-4" />
              <CardTitle>Nossos Valores</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-600 space-y-2">
                <li>• Inovação tecnológica</li>
                <li>• Conformidade regulatória</li>
                <li>• Transparência</li>
                <li>• Colaboração</li>
                <li>• Excelência</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            PharmaConnect em Números
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Empresas Conectadas</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary-600 mb-2">150+</div>
              <div className="text-gray-600">Laboratórios Parceiros</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent-600 mb-2">300+</div>
              <div className="text-gray-600">Consultores Especializados</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">2000+</div>
              <div className="text-gray-600">Projetos Realizados</div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Nossa Equipe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Dr. Maria Silva</h3>
                <p className="text-gray-600 mb-2">CEO & Fundadora</p>
                <p className="text-sm text-gray-500">
                  25 anos de experiência no setor farmacêutico. 
                  Ex-diretora da ANVISA e especialista em regulamentação.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-24 h-24 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Dr. João Santos</h3>
                <p className="text-gray-600 mb-2">CTO & Co-fundador</p>
                <p className="text-sm text-gray-500">
                  Especialista em IA e tecnologia aplicada à saúde. 
                  PhD em Ciência da Computação pela USP.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-24 h-24 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Globe className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Dra. Ana Costa</h3>
                <p className="text-gray-600 mb-2">Diretora Científica</p>
                <p className="text-sm text-gray-500">
                  Farmacêutica industrial com expertise em P&D. 
                  Mestrado em Ciências Farmacêuticas pela UFRJ.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Company Story */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Nossa História</h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              A PharmaConnect Brasil nasceu em 2023 da visão de três profissionais experientes 
              do setor farmacêutico que identificaram uma lacuna crítica no mercado brasileiro: 
              a falta de uma plataforma digital especializada que conectasse de forma eficiente 
              todos os atores do ecossistema farmacêutico.
            </p>
            <p className="mb-4">
              Combinando décadas de experiência em regulamentação, tecnologia e ciências 
              farmacêuticas, nossa equipe desenvolveu uma solução inovadora que utiliza 
              inteligência artificial para facilitar conexões estratégicas, otimizar processos 
              e garantir conformidade regulatória.
            </p>
            <p className="mb-4">
              Desde nosso lançamento, já facilitamos mais de 2.000 conexões entre empresas, 
              laboratórios e consultores, contribuindo para o desenvolvimento de centenas de 
              projetos farmacêuticos que impactam positivamente a saúde da população brasileira.
            </p>
            <p>
              Nosso compromisso é continuar inovando e expandindo nossa plataforma para 
              atender às necessidades em constante evolução do setor farmacêutico, 
              sempre mantendo os mais altos padrões de qualidade e conformidade regulatória.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
