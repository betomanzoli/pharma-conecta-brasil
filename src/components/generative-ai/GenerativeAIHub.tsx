
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Sparkles, 
  Brain, 
  FileText, 
  MessageCircle, 
  TrendingUp, 
  Target,
  Lightbulb,
  Cpu,
  Zap,
  Settings,
  BarChart3,
  Globe,
  Database
} from 'lucide-react';

const GenerativeAIHub = () => {
  const [activeTab, setActiveTab] = useState('multimodal');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const aiEngines = [
    {
      id: 'multimodal',
      name: 'Multimodal AI Engine',
      description: 'IA avançada que processa texto, imagem, voz e dados simultaneamente',
      icon: Brain,
      color: 'bg-purple-500',
      status: 'active',
      capabilities: [
        'Análise de documentos complexos',
        'Processamento de imagens médicas',
        'Reconhecimento de voz especializada',
        'Síntese cross-modal'
      ]
    },
    {
      id: 'document-generator',
      name: 'Document Generator',
      description: 'Geração automática de documentos regulatórios e técnicos',
      icon: FileText,
      color: 'bg-blue-500',
      status: 'active',
      capabilities: [
        'Templates regulatórios ANVISA',
        'Relatórios técnicos automatizados',
        'Documentação de compliance',
        'Propostas comerciais personalizadas'
      ]
    },
    {
      id: 'market-predictor',
      name: 'Market Predictor',
      description: 'Análise preditiva avançada para insights de mercado',
      icon: TrendingUp,
      color: 'bg-green-500',
      status: 'active',
      capabilities: [
        'Previsão de tendências farmacêuticas',
        'Análise competitiva automática',
        'Identificação de oportunidades',
        'Avaliação de riscos de mercado'
      ]
    },
    {
      id: 'intelligent-matcher',
      name: 'Intelligent Matcher',
      description: 'Sistema de matching com deep learning avançado',
      icon: Target,
      color: 'bg-orange-500',
      status: 'active',
      capabilities: [
        'Matching comportamental avançado',
        'Análise de compatibilidade profunda',
        'Recomendações personalizadas',
        'Otimização contínua de resultados'
      ]
    }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simular geração de IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  const currentEngine = aiEngines.find(engine => engine.id === activeTab);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Sparkles className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Generative AI Hub
            </h1>
            <p className="text-muted-foreground">Central de IA Generativa Avançada do PharmaConnect</p>
          </div>
        </div>
      </div>

      {/* Engine Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Status dos Engines de IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiEngines.map((engine) => {
              const IconComponent = engine.icon;
              return (
                <div key={engine.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className={`p-2 rounded-lg ${engine.color} text-white`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{engine.name}</div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-muted-foreground">Online</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Engines Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          {aiEngines.map((engine) => (
            <TabsTrigger key={engine.id} value={engine.id} className="text-xs">
              {engine.name.split(' ')[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {aiEngines.map((engine) => {
          const IconComponent = engine.icon;
          return (
            <TabsContent key={engine.id} value={engine.id} className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${engine.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>{engine.name}</CardTitle>
                      <p className="text-muted-foreground">{engine.description}</p>
                    </div>
                    <Badge variant="default" className="bg-green-500 ml-auto">
                      <Zap className="h-3 w-3 mr-1" />
                      Ativo
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Capabilities */}
                    <div>
                      <h4 className="font-semibold mb-3">Capacidades Principais</h4>
                      <div className="space-y-2">
                        {engine.capabilities.map((capability, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{capability}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interface */}
                    <div>
                      <h4 className="font-semibold mb-3">Interface de Geração</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Prompt/Instrução</label>
                          <Textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={`Digite sua instrução para o ${engine.name}...`}
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                        <Button 
                          onClick={handleGenerate}
                          disabled={isGenerating || !prompt.trim()}
                          className="w-full"
                        >
                          {isGenerating ? (
                            <>
                              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                              Gerando...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Gerar com IA
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Métricas de Performance - {engine.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-500">99.2%</div>
                      <div className="text-sm text-muted-foreground">Precisão</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-blue-500">0.3s</div>
                      <div className="text-sm text-muted-foreground">Tempo Resposta</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-purple-500">1.2k</div>
                      <div className="text-sm text-muted-foreground">Gerações/Dia</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-orange-500">96.8%</div>
                      <div className="text-sm text-muted-foreground">Satisfação</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Global AI Statistics */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Estatísticas Globais da IA Generativa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                47.2k
              </div>
              <div className="text-sm text-muted-foreground">Gerações Totais</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                427%
              </div>
              <div className="text-sm text-muted-foreground">Eficiência Aumentada</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                97.8%
              </div>
              <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                2.5k+
              </div>
              <div className="text-sm text-muted-foreground">Usuários Ativos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GenerativeAIHub;
