
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';
import { useToast } from '@/hooks/use-toast';
import MasterChatbot from '@/components/ai/MasterChatbot';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  source?: string;
}

const EnhancedChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sourceInfo, setSourceInfo] = useState<any>(null);
  const { getBridgeData } = useMasterChatBridge();
  const { toast } = useToast();

  useEffect(() => {
    // Check for bridge data first
    const bridgeData = getBridgeData();
    if (bridgeData) {
      console.log('Bridge data received:', bridgeData);
      setInput(bridgeData.prompt);
      setSourceInfo(bridgeData.context);
      
      toast({
        title: 'Prompt carregado',
        description: `Prompt recebido de: ${bridgeData.source || 'Agente IA'}`,
      });
    } else {
      // Check for legacy sessionStorage format
      const pendingMessage = sessionStorage.getItem('pendingChatMessage');
      if (pendingMessage) {
        try {
          const { message } = JSON.parse(pendingMessage);
          setInput(message);
          sessionStorage.removeItem('pendingChatMessage');
          console.log('Legacy sessionStorage message loaded');
        } catch (error) {
          console.error('Error parsing pending message:', error);
        }
      }

      // Check for legacy localStorage format
      const legacyPrompt = localStorage.getItem('pendingChatPrompt');
      if (legacyPrompt) {
        setInput(legacyPrompt);
        localStorage.removeItem('pendingChatPrompt');
        console.log('Legacy localStorage prompt loaded');
      }
    }

// Mensagem de boas-vindas opcional via MasterChatbot
// Mantemos o input apenas para repasse inicial do prompt
}, [getBridgeData, toast]);

const handleSend = async () => {
  // Não usado: MasterChatbot gerencia envio
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

return (
  <ProtectedRoute>
    <MainLayout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <MessageSquare className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Chat IA Farmacêutica</h1>
              <p className="text-muted-foreground">
                Assistente especializado em consultoria farmacêutica
              </p>
            </div>
          </div>
        </div>

        {sourceInfo && (
          <Card className="mb-4 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-blue-800">
                  Prompt recebido de: {sourceInfo.title || sourceInfo.metadata?.module || 'Agente IA'}
                </span>
                {sourceInfo.category && (
                  <Badge variant="secondary" className="text-xs">
                    {sourceInfo.category}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* MasterChatbot integrado com suporte a threads e sumários */}
        <MasterChatbot initialPrompt={input} />
      </div>
    </MainLayout>
  </ProtectedRoute>
);
};

export default EnhancedChat;
