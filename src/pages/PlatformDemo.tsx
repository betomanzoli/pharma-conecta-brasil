
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  Users, 
  Building2, 
  FlaskConical,
  Bot,
  BarChart3,
  MessageSquare,
  ArrowRight,
  Info
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

const PlatformDemo = () => {
  const [currentDemo, setCurrentDemo] = useState('overview');
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  const demoSections = {
    overview: {
      title: 'Visão Geral da Plataforma',
      description: 'Conheça o ecossistema completo do PharmaConnect',
      icon: Eye,
      color: 'bg-blue-500',
      features: [
        'Conecte empresas farmacêuticas, laboratórios e consultores',
        'AI Matching inteligente para parcerias estratégicas',
        'Monitoramento regulatório em tempo real',
        'Analytics avançado do setor farmacêutico',
        'Marketplace de serviços e oportunidades'
      ]
    },
    userTypes: {
      title: 'Tipos de Usuários',
      description: 'Diferentes perfis no ecossistema farmacêutico',
      icon: Users,
      color: 'bg-green-500',
      features: [
        'Empresas Farmacêuticas: Buscar parceiros e fornecedores',
        'Laboratórios: Oferecer serviços analíticos',
        'Consultores: Prestar consultoria especializada',
        'Órgãos Reguladores: ANVISA, Ministério da Saúde',
        'Entidades Setoriais: Sindusfarma, associações',
        'Instituições de Pesquisa: Universidades, institutos',
        'Fornecedores: Matérias-primas, equipamentos',
        'Agências de Fomento: FINEP, CNPq',
        'Prestadores de Saúde: Hospitais, clínicas'
      ]
    },
    aiMatching: {
      title: 'AI Matching Engine',
      description: 'Algoritmos inteligentes para conexões estratégicas',
      icon: Bot,
      color: 'bg-purple-500',
      features: [
        'Machine Learning para análise de compatibilidade',
        'Matching baseado em localização e especialidade',
        'Pontuação de compatibilidade em tempo real',
        'Recomendações personalizadas por setor',
        'Feedback contínuo para melhorar algoritmos'
      ]
    },
    marketplace: {
      title: 'Marketplace e Projetos',
      description: 'Centro de negócios e oportunidades',
      icon: Building2,
      color: 'bg-orange-500',
      features: [
        'Catálogo de serviços laboratoriais',
        'Projetos colaborativos de P&D',
        'Sistema de cotações e propostas',
        'Avaliações e ratings de fornecedores',
        'Gestão de contratos e SLAs'
      ]
    },
    analytics: {
      title: 'Analytics e Insights',
      description: 'Inteligência de mercado farmacêutico',
      icon: BarChart3,
      color: 'bg-red-500',
      features: [
        'Métricas de performance da indústria',
        'Análise de tendências regulatórias',
        'ROI de parcerias e projetos',
        'Benchmarking setorial',
        'Relatórios personalizados'
      ]
    },
    regulatory: {
      title: 'Monitoramento Regulatório',
      description: 'Acompanhamento em tempo real da ANVISA',
      icon: FlaskConical,
      color: 'bg-indigo-500',
      features: [
        'Alertas automáticos de mudanças regulatórias',
        'Base de dados integrada ANVISA/FDA/EMA',
        'Tracking de registros e processos',
        'Compliance score automático',
        'Calendário regulatório inteligente'
      ]
    }
  };

  const currentSection = demoSections[currentDemo as keyof typeof demoSections];

  const handleStartTrial = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Building2 className="h-12 w-12 text-[#1565C0] mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">PharmaConnect Demo</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore a plataforma completa que conecta todo o ecossistema farmacêutico brasileiro
          </p>
          
          <Alert className="max-w-2xl mx-auto mt-6 border-blue-200 bg-blue-50">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Este é um ambiente de demonstração com dados simulados. 
              Para acessar a plataforma real, faça login ou crie sua conta.
            </AlertDescription>
          </Alert>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {Object.entries(demoSections).map(([key, section]) => {
            const Icon = section.icon;
            return (
              <Button
                key={key}
                variant={currentDemo === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentDemo(key)}
                className={`flex items-center space-x-2 ${
                  currentDemo === key ? section.color + ' text-white' : ''
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{section.title}</span>
              </Button>
            );
          })}
        </div>

        {/* Main Demo Section */}
        <Card className="max-w-4xl mx-auto mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${currentSection.color} text-white`}>
                  <currentSection.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{currentSection.title}</CardTitle>
                  <p className="text-gray-600">{currentSection.description}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? 'Pausar' : 'Reproduzir'}
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4" />
                  Reiniciar
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Funcionalidades Principais:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentSection.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <ArrowRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              {currentDemo === 'userTypes' && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Ecossistema Integrado
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Nossa plataforma reconhece a complexidade do setor farmacêutico brasileiro, 
                    conectando desde grandes indústrias até profissionais independentes, 
                    passando por órgãos reguladores e entidades setoriais.
                  </p>
                </div>
              )}
              
              {currentDemo === 'aiMatching' && (
                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">
                    Algoritmo Inteligente
                  </h4>
                  <p className="text-purple-700 text-sm">
                    Utilizamos machine learning para analisar compatibilidade entre organizações,
                    considerando localização, especialidades, certificações e histórico de colaborações.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">500+</div>
              <p className="text-gray-600">Empresas Conectadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">150+</div>
              <p className="text-gray-600">Laboratórios Certificados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600">300+</div>
              <p className="text-gray-600">Consultores Especializados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600">95%</div>
              <p className="text-gray-600">Taxa de Matching</p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Pronto para começar?
            </h3>
            <p className="text-gray-600 mb-6">
              Junte-se ao maior ecossistema farmacêutico digital do Brasil
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={handleStartTrial}
                className="bg-[#1565C0] hover:bg-[#1565C0]/90"
              >
                Criar Conta Gratuita
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleLogin}
              >
                Já tenho conta
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Gratuito para começar • Sem compromisso • Suporte 24/7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformDemo;
