import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, FileText, Download, Send, User, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatDocumentAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou seu assistente para criação de documentos farmacêuticos. Vou fazer algumas perguntas para entender suas necessidades e gerar o documento perfeito. Primeiro, que tipo de documento você precisa criar?',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [documentData, setDocumentData] = useState<any>({});
  const [stage, setStage] = useState('doc_type');
  const [loading, setLoading] = useState(false);
  const [finalDocument, setFinalDocument] = useState('');
  const { toast } = useToast();

  const questions = {
    doc_type: "Que tipo de documento você precisa? (ex: SOP, Protocolo de Validação, Módulo CTD, Business Case)",
    template: "Qual template ou formato específico? (ex: SOP_Validacao_Processos, Template_CTD_Module_3)",
    product: "Qual o produto ou processo envolvido?",
    objective: "Qual o objetivo principal deste documento?",
    scope: "Qual o escopo e limitações?",
    requirements: "Há requisitos específicos ou normas a seguir? (ex: ICH, ANVISA, ISO)",
    additional: "Informações adicionais relevantes?"
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setLoading(true);

    // Store user response
    const newData = { ...documentData };
    newData[stage] = currentMessage;
    setDocumentData(newData);

    // Determine next question
    const stages = Object.keys(questions);
    const currentIndex = stages.indexOf(stage);
    const nextStage = stages[currentIndex + 1];

    setTimeout(() => {
      let assistantResponse = '';
      
      if (nextStage) {
        assistantResponse = questions[nextStage as keyof typeof questions];
        setStage(nextStage);
      } else {
        assistantResponse = 'Perfeito! Tenho todas as informações necessárias. Vou gerar seu documento agora. Isso pode levar alguns momentos...';
        generateFinalDocument(newData);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  const generateFinalDocument = async (data: any) => {
    try {
      // Simulate document generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockDocument = `# ${data.doc_type || 'Documento Farmacêutico'}

## Template: ${data.template || 'Padrão PharmaConnect'}

## Produto/Processo
${data.product || 'Não especificado'}

## Objetivo
${data.objective || 'Não especificado'}

## Escopo
${data.scope || 'Não especificado'}

## Requisitos Regulatórios
${data.requirements || 'Aplicáveis conforme legislação vigente'}

## Informações Adicionais
${data.additional || 'Nenhuma'}

## Seções do Documento

### 1. Introdução
Este documento foi desenvolvido seguindo as melhores práticas da indústria farmacêutica brasileira.

### 2. Aplicabilidade
Aplicável a todos os processos relacionados ao produto especificado.

### 3. Responsabilidades
- Gerente de Qualidade: Aprovação final
- Analista: Execução e documentação
- Coordenador: Revisão técnica

### 4. Procedimento
[Detalhamento específico baseado nas respostas fornecidas]

### 5. Registros
Todos os registros devem ser mantidos conforme política de retenção da empresa.

---
*Documento gerado automaticamente pelo PharmaConnect AI Assistant*
`;

      setFinalDocument(mockDocument);
      
      const finalMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: '✅ Documento gerado com sucesso! Você pode visualizar e fazer download usando os botões abaixo.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, finalMessage]);
      
      toast({
        title: "Documento pronto!",
        description: "Seu documento foi gerado e está disponível para download.",
      });

    } catch (error) {
      toast({
        title: "Erro na geração",
        description: "Não foi possível gerar o documento. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([finalDocument], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentData.doc_type || 'documento'}_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou seu assistente para criação de documentos farmacêuticos. Vou fazer algumas perguntas para entender suas necessidades e gerar o documento perfeito. Primeiro, que tipo de documento você precisa criar?',
      timestamp: new Date()
    }]);
    setDocumentData({});
    setStage('doc_type');
    setFinalDocument('');
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                <MessageCircle className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Chat - Assistente de Documentação</h1>
                <p className="text-muted-foreground">
                  Criação guiada de documentos farmacêuticos via conversa
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Area */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Conversa</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`p-2 rounded-full ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </div>
                          <div className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div className="flex space-x-2">
                          <div className="p-2 rounded-full bg-muted">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="p-3 rounded-lg bg-muted">
                            <p className="text-sm">Digitando...</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {!finalDocument && (
                    <div className="flex space-x-2">
                      <Input
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Digite sua resposta..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={loading}
                      />
                      <Button onClick={handleSendMessage} disabled={loading || !currentMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Status Panel */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progresso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(questions).map(([key, question]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm">{question.split('?')[0]}?</span>
                        <Badge variant={documentData[key] ? 'default' : stage === key ? 'secondary' : 'outline'}>
                          {documentData[key] ? '✓' : stage === key ? '...' : '○'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {finalDocument && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Documento Pronto</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={handleDownload} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Documento
                    </Button>
                    <Button onClick={resetChat} variant="outline" className="w-full">
                      Nova Conversa
                    </Button>
                    <div className="max-h-40 overflow-y-auto text-xs bg-muted p-2 rounded">
                      <pre className="whitespace-pre-wrap">{finalDocument.substring(0, 200)}...</pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ChatDocumentAssistant;