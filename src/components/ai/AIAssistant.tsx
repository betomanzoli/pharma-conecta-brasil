
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2,
  VolumeX,
  RefreshCw,
  Settings,
  Zap,
  Lightbulb,
  TrendingUp,
  Users,
  FileText,
  Clock
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  context?: string;
  suggestions?: string[];
}

interface AICapability {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  examples: string[];
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou seu assistente de IA especializado em projetos farmacêuticos. Como posso ajudá-lo hoje?',
      type: 'assistant',
      timestamp: new Date(),
      suggestions: [
        'Como encontrar parceiros para meu projeto?',
        'Quais são as melhores práticas de segurança?',
        'Como otimizar minha estratégia de matching?',
        'Explique as métricas de valor compartilhado'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [currentContext, setCurrentContext] = useState('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiCapabilities: AICapability[] = [
    {
      id: 'matching',
      name: 'AI Matching',
      description: 'Encontre parceiros ideais com base em expertise e compatibilidade',
      icon: <Zap className="h-5 w-5" />,
      examples: [
        'Encontre laboratórios especializados em oncologia',
        'Sugira parceiros para desenvolvimento de biofármacos',
        'Analise compatibilidade com empresa X'
      ]
    },
    {
      id: 'insights',
      name: 'Insights Estratégicos',
      description: 'Análise preditiva e recomendações estratégicas',
      icon: <Lightbulb className="h-5 w-5" />,
      examples: [
        'Analise tendências do mercado farmacêutico',
        'Preveja riscos do projeto atual',
        'Recomende estratégias de crescimento'
      ]
    },
    {
      id: 'metrics',
      name: 'Análise de Métricas',
      description: 'Interpretação de KPIs e métricas de performance',
      icon: <TrendingUp className="h-5 w-5" />,
      examples: [
        'Explique as métricas de ROI do projeto',
        'Analise performance de parcerias',
        'Compare resultados com benchmarks'
      ]
    },
    {
      id: 'collaboration',
      name: 'Otimização de Colaboração',
      description: 'Melhore a eficiência das parcerias estratégicas',
      icon: <Users className="h-5 w-5" />,
      examples: [
        'Como melhorar comunicação com parceiros?',
        'Otimize fluxos de trabalho colaborativos',
        'Resolva conflitos de governança'
      ]
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      type: 'user',
      timestamp: new Date(),
      context: currentContext
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simular resposta da IA
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage, currentContext),
        type: 'assistant',
        timestamp: new Date(),
        context: currentContext,
        suggestions: generateSuggestions(inputMessage)
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);

      // Síntese de voz se habilitada
      if (voiceEnabled) {
        speakText(assistantMessage.content);
      }
    }, 1500);
  };

  const generateAIResponse = (message: string, context: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('matching') || lowerMessage.includes('parceiro')) {
      return 'Com base na sua consulta sobre matching, posso ajudá-lo a encontrar parceiros ideais. Considerando suas especificações, identifiquei 3 potenciais parceiros com compatibilidade alta (>85%). Gostaria que eu analise critérios específicos como expertise técnica, capacidade financeira ou localização geográfica?';
    }
    
    if (lowerMessage.includes('segurança') || lowerMessage.includes('confidencial')) {
      return 'Sobre segurança e confidencialidade: nossa plataforma utiliza criptografia AES-256 e políticas de acesso granulares. Todos os dados são classificados automaticamente e o acesso é controlado por contratos inteligentes. Posso configurar níveis específicos de segurança para seu projeto?';
    }
    
    if (lowerMessage.includes('roi') || lowerMessage.includes('retorno')) {
      return 'Analisando as métricas de ROI dos seus projetos, identifiquei oportunidades de otimização que podem aumentar o retorno em até 40%. As principais áreas incluem: redução de tempo de desenvolvimento (25%), otimização de recursos (30%) e melhoria na seleção de parceiros (35%). Quer que eu detalhe alguma dessas áreas?';
    }
    
    if (lowerMessage.includes('projeto') || lowerMessage.includes('gestão')) {
      return 'Para gestão eficaz de projetos farmacêuticos, recomendo implementar: 1) Milestones claros com entregas mensuráveis, 2) Comunicação estruturada entre parceiros, 3) Monitoramento de riscos em tempo real, 4) Métricas de performance alinhadas. Posso criar um plano personalizado para seu projeto específico?';
    }
    
    return 'Entendi sua pergunta. Com base no contexto atual e nas melhores práticas da indústria farmacêutica, posso fornecer insights específicos. Gostaria que eu focasse em algum aspecto particular: estratégico, operacional, regulatório ou financeiro?';
  };

  const generateSuggestions = (message: string) => {
    const suggestions = [
      'Mostrar análise detalhada',
      'Comparar com benchmarks',
      'Gerar relatório executivo',
      'Agendar reunião com especialista'
    ];
    return suggestions.slice(0, 3);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
      };
      recognition.start();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span>Assistente de IA PharmaConnect</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Capacidades da IA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {aiCapabilities.map((capability) => (
              <Card key={capability.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-full">
                      {capability.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{capability.name}</h3>
                      <p className="text-sm text-gray-600">{capability.description}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-700">Exemplos:</p>
                    {capability.examples.slice(0, 2).map((example, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(example)}
                        className="block text-xs text-blue-600 hover:underline text-left"
                      >
                        • {example}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Área de Mensagens */}
          <Card className="h-96 flex flex-col">
            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.type === 'assistant' && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 opacity-70" />
                            <span className="text-xs opacity-70">IA</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>

          {/* Sugestões */}
          {messages.length > 0 && messages[messages.length - 1].suggestions && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Sugestões:</p>
              <div className="flex flex-wrap gap-2">
                {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input de Mensagem */}
          <div className="flex items-center space-x-2 mt-4">
            <div className="flex-1 relative">
              <Textarea
                placeholder="Digite sua pergunta ou solicite insights..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-[60px] pr-12 resize-none"
                rows={2}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={startListening}
                disabled={isListening}
                className="absolute right-2 top-2"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Online</span>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Contexto: {currentContext}</span>
              <span>Modo: {voiceEnabled ? 'Voz ativa' : 'Texto'}</span>
            </div>
          </div>

          <Alert className="mt-4">
            <Bot className="h-4 w-4" />
            <AlertDescription>
              <strong>Assistente Especializado:</strong> Este assistente foi treinado especificamente 
              para o setor farmacêutico brasileiro e integra dados em tempo real da plataforma para 
              fornecer insights precisos e contextualizados.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
