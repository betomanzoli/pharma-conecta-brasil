
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MessageSquare, FileText, Users, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AICommunicationAssistantProps {
  chatId?: string;
  projectId?: string;
  onSuggestionAccepted?: (suggestion: string) => void;
}

const AICommunicationAssistant: React.FC<AICommunicationAssistantProps> = ({
  chatId,
  projectId,
  onSuggestionAccepted
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [summary, setSummary] = useState('');

  const generateSuggestions = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-communication-assistant', {
        body: {
          action: 'generate_suggestions',
          text: inputText,
          chat_id: chatId,
          project_id: projectId
        }
      });

      if (error) throw error;

      setSuggestions(data.suggestions);
      toast({
        title: "Sugestões Geradas",
        description: "A IA criou sugestões de comunicação para você."
      });
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Erro nas Sugestões",
        description: "Não foi possível gerar sugestões.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-communication-assistant', {
        body: {
          action: 'generate_summary',
          chat_id: chatId,
          project_id: projectId
        }
      });

      if (error) throw error;

      setSummary(data.summary);
      toast({
        title: "Resumo Gerado",
        description: "A IA criou um resumo da conversa."
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Erro no Resumo",
        description: "Não foi possível gerar o resumo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const adaptTone = async (tone: string) => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-communication-assistant', {
        body: {
          action: 'adapt_tone',
          text: inputText,
          tone: tone,
          project_id: projectId
        }
      });

      if (error) throw error;

      if (onSuggestionAccepted) {
        onSuggestionAccepted(data.adapted_text);
      }
      
      toast({
        title: "Tom Adaptado",
        description: `Mensagem adaptada para tom ${tone}.`
      });
    } catch (error) {
      console.error('Error adapting tone:', error);
      toast({
        title: "Erro na Adaptação",
        description: "Não foi possível adaptar o tom.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <span>Assistente de Comunicação IA</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Input Area */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Digite sua mensagem ou texto
          </label>
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Digite o texto que deseja otimizar ou adaptar..."
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={generateSuggestions}
            disabled={loading || !inputText.trim()}
          >
            <MessageSquare className="h-3 w-3 mr-1" />
            Gerar Sugestões
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => adaptTone('formal')}
            disabled={loading || !inputText.trim()}
          >
            <Users className="h-3 w-3 mr-1" />
            Tom Formal
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => adaptTone('friendly')}
            disabled={loading || !inputText.trim()}
          >
            <Zap className="h-3 w-3 mr-1" />
            Tom Amigável
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => adaptTone('technical')}
            disabled={loading || !inputText.trim()}
          >
            <FileText className="h-3 w-3 mr-1" />
            Tom Técnico
          </Button>
        </div>

        {/* Chat Summary */}
        {chatId && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Resumo da Conversa</h4>
              <Button
                size="sm"
                variant="ghost"
                onClick={generateSummary}
                disabled={loading}
              >
                <FileText className="h-3 w-3 mr-1" />
                Gerar Resumo
              </Button>
            </div>
            
            {summary && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm">{summary}</p>
              </div>
            )}
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Sugestões de Comunicação</h4>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline">{suggestion.type}</Badge>
                        {suggestion.priority && (
                          <Badge 
                            className={
                              suggestion.priority === 'high' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {suggestion.priority}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm">{suggestion.text}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onSuggestionAccepted && onSuggestionAccepted(suggestion.text)}
                    >
                      Usar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">IA processando...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AICommunicationAssistant;
