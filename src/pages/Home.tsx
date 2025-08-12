import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Users, 
  MessageCircle, 
  TrendingUp, 
  FileText, 
  BookOpen, 
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Target
} from 'lucide-react';
import { useButtonActivation } from '@/hooks/useButtonActivation';

const Home = () => {
  const { activateButton } = useButtonActivation();

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
          {/* Hero Section */}
          <section className="py-20 px-4">
            <div className="container mx-auto text-center">
              <div className="flex justify-center mb-6">
                <img
                  src="/lovable-uploads/9c96c4a3-866a-4e28-a69f-55d561dad6e5.png"
                  alt="PharmaConnect Brasil"
                  className="h-20 w-auto"
                />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Conectando a <span className="text-primary">Farmacêutica</span> do Futuro
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Plataforma inteligente para networking, parcerias estratégicas e inovação no setor farmacêutico brasileiro
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => activateButton('ai_matching')}
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Começar com IA
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => activateButton('master_chat')}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Falar com Assistente
                </Button>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-12 px-4 bg-white/50">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <div className="text-gray-600">Empresas Conectadas</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                  <div className="text-gray-600">Matches Realizados</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">95%</div>
                  <div className="text-gray-600">Taxa de Sucesso</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-gray-600">Assistente IA</div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-16 px-4">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Funcionalidades Principais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">AI Matching</h3>
                  <p className="text-gray-600 mb-4">
                    Algoritmos avançados conectam você aos parceiros ideais
                  </p>
                  <Button 
                    onClick={() => activateButton('ai_matching')}
                    className="w-full"
                  >
                    Explorar Matches
                  </Button>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Gestão de Projetos</h3>
                  <p className="text-gray-600 mb-4">
                    Ferramentas especializadas para projetos farmacêuticos
                  </p>
                  <Button 
                    onClick={() => activateButton('project_analysis')}
                    variant="outline" 
                    className="w-full"
                  >
                    Iniciar Projeto
                  </Button>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Mentoria</h3>
                  <p className="text-gray-600 mb-4">
                    Conecte-se com especialistas da indústria
                  </p>
                  <Button 
                    onClick={() => activateButton('mentorship')}
                    variant="outline" 
                    className="w-full"
                  >
                    Encontrar Mentores
                  </Button>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Biblioteca</h3>
                  <p className="text-gray-600 mb-4">
                    Recursos, templates e conhecimento especializado
                  </p>
                  <Button 
                    onClick={() => activateButton('knowledge_base')}
                    variant="outline" 
                    className="w-full"
                  >
                    Acessar Biblioteca
                  </Button>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Fórum</h3>
                  <p className="text-gray-600 mb-4">
                    Discussões e networking com a comunidade
                  </p>
                  <Button 
                    onClick={() => activateButton('forum')}
                    variant="outline" 
                    className="w-full"
                  >
                    Participar do Fórum
                  </Button>
                </Card>

                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Assistente IA</h3>
                  <p className="text-gray-600 mb-4">
                    Chat inteligente especializado em farmacêutica
                  </p>
                  <Button 
                    onClick={() => activateButton('master_chat')}
                    className="w-full"
                  >
                    Conversar com IA
                  </Button>
                </Card>
              </div>
            </div>
          </section>

          {/* AI Features Section */}
          <section className="py-16 px-4 bg-gradient-to-r from-purple-100 to-blue-100">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Inteligência Artificial Avançada</h2>
                <p className="text-xl text-gray-600">
                  Tecnologia de ponta para acelerar sua jornada farmacêutica
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Recursos Inteligentes</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Matching baseado em Machine Learning</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Análise preditiva de parcerias</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Assistente regulatório especializado</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Gestão inteligente de projetos</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 text-center">
                    <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">AI</div>
                    <div className="text-sm text-gray-600">Matching</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">ML</div>
                    <div className="text-sm text-gray-600">Analytics</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">95%</div>
                    <div className="text-sm text-gray-600">Precisão</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-gray-600">Disponível</div>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-16 px-4">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">O que nossos usuários dizem</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    "O AI Matching da PharmaConnect revolucionou nossa busca por parceiros. 
                    Encontramos laboratórios ideais em questão de minutos."
                  </p>
                  <div className="font-semibold">Dr. Ana Silva</div>
                  <div className="text-sm text-gray-500">Diretora de P&D, FarmaTech</div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    "A plataforma conectou nossa startup com mentores experientes. 
                    O crescimento foi exponencial desde então."
                  </p>
                  <div className="font-semibold">Carlos Mendes</div>
                  <div className="text-sm text-gray-500">CEO, BioInova</div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    "O assistente IA é incrivelmente preciso para questões regulatórias. 
                    Economizamos horas de pesquisa."
                  </p>
                  <div className="font-semibold">Dra. Mariana Costa</div>
                  <div className="text-sm text-gray-500">Consultora Regulatória</div>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 px-4 bg-primary text-white">
            <div className="container mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Pronto para transformar seu negócio farmacêutico?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Junte-se a centenas de empresas que já estão usando nossa IA
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => activateButton('ai_matching')}
                >
                  Começar Agora
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => activateButton('master_chat')}
                >
                  Falar com Especialista
                </Button>
              </div>
            </div>
          </section>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Home;
