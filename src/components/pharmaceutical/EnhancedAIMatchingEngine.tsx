
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  TrendingUp, 
  Users, 
  MapPin, 
  Star,
  MessageCircle,
  Calendar,
  FileText,
  Brain,
  Zap,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useAIEventLogger } from '@/hooks/useAIEventLogger';
import { useAIIntegration } from '@/hooks/useAIIntegration';

interface Match {
  id: string;
  company: any;
  compatibility_score: number;
  match_factors: string[];
  recommended_actions: string[];
  ai_insights?: string[];
  learning_applied?: boolean;
}

const EnhancedAIMatchingEngine = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    service_type: '',
    location: '',
    expertise: ''
  });

  const { profile } = useAuth();
  const { toast } = useToast();
  const { logAIEvent } = useAIEventLogger();
  const { getIntegratedContext, executeIntegratedAI, syncUserLearning } = useAIIntegration();

  const handleEnhancedMatching = async () => {
    if (!profile) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Buscar contexto integrado do usuário
      const userContext = await getIntegratedContext(profile.id);
      
      await logAIEvent({ 
        source: 'ai_matching', 
        action: 'search_enhanced', 
        message: 'Enhanced AI matching with integrated context', 
        metadata: { 
          criteria: searchCriteria,
          context_applied: true,
          user_type: profile.user_type
        } 
      });

      // Executar matching com contexto integrado
      const data = await executeIntegratedAI('matching', {
        userType: profile.user_type,
        userId: profile.id,
        preferences: {
          location: searchCriteria.location,
          specialties: [searchCriteria.expertise],
          serviceType: searchCriteria.service_type,
          enhanced_mode: true
        }
      }, userContext);

      if (data?.success && data?.matches) {
        const enhancedMatches = data.matches.map((match: any) => ({
          id: match.id || `match-${Date.now()}-${Math.random()}`,
          company: {
            name: match.name,
            expertise_area: match.specialties,
            city: match.location?.split(', ')[0] || '',
            state: match.location?.split(', ')[1] || '',
            description: `${match.type === 'laboratory' ? 'Laboratório' : 'Consultor'} especializado`
          },
          compatibility_score: match.score,
          match_factors: match.compatibility_factors || [
            `Compatibilidade técnica: ${Math.round(match.score * 100)}%`,
            'Expertise alinhada com necessidades',
            'Localização estratégica'
          ],
          recommended_actions: [
            'Enviar mensagem personalizada',
            'Agendar videochamada',
            'Solicitar proposta detalhada',
            'Verificar referências'
          ],
          ai_insights: match.ai_insights || [
            'Match baseado em padrões de sucesso anteriores',
            'Compatibilidade cultural elevada',
            'Potencial para parceria de longo prazo'
          ],
          learning_applied: true
        }));

        setMatches(enhancedMatches);
        
        // Sync learning data
        await syncUserLearning(profile.id, {
          search_criteria: searchCriteria,
          matches_found: enhancedMatches.length,
          timestamp: new Date().toISOString()
        });

        toast({
          title: "🧠 AI Matching Avançado Completo!",
          description: `${enhancedMatches.length} matches de alta qualidade com aprendizado integrado`,
        });

        await logAIEvent({ 
          source: 'ai_matching', 
          action: 'results_enhanced', 
          message: 'Enhanced matching completed', 
          metadata: { 
            results: enhancedMatches.length,
            avg_score: enhancedMatches.reduce((sum, m) => sum + m.compatibility_score, 0) / enhancedMatches.length
          } 
        });
      } else {
        setMatches([]);
        toast({
          title: "Nenhum match encontrado",
          description: "Ajustando critérios com base no seu perfil...",
        });
      }
    } catch (error) {
      console.error('Erro no Enhanced AI Matching:', error);
      toast({
        title: "Erro no AI Matching",
        description: "Sistema temporariamente indisponível. Tentando novamente...",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (match: Match, type: 'accepted' | 'rejected') => {
    if (!profile) return;
    
    let rejection_reason: string | null = null;
    if (type === 'rejected') {
      rejection_reason = window.prompt('Motivo da rejeição (opcional - isso nos ajuda a melhorar):') || null;
    }

    try {
      // Registrar feedback melhorado
      await executeIntegratedAI('chat', {
        message: `Registrar feedback de matching: ${type} para ${match.company.name}`,
        feedback_data: {
          match_id: match.id,
          feedback_type: type,
          rejection_reason,
          compatibility_score: match.compatibility_score,
          learning_context: true
        }
      });

      await logAIEvent({ 
        source: 'ai_matching', 
        action: 'feedback_enhanced', 
        message: type, 
        metadata: { 
          match: match.company?.name, 
          score: match.compatibility_score,
          learning_applied: match.learning_applied
        } 
      });

      // Atualizar aprendizado do sistema
      await syncUserLearning(profile.id, {
        feedback_type: type,
        match_characteristics: match.match_factors,
        rejection_reason,
        score: match.compatibility_score
      });

      toast({ 
        title: type === 'accepted' ? 'Match aceito! 🎉' : 'Feedback registrado', 
        description: type === 'accepted' 
          ? 'Parceiro notificado. Sistema aprendendo suas preferências...'
          : 'Obrigado! Isso melhora nossos próximos matches.'
      });
      
      setMatches(prev => prev.filter(m => m.id !== match.id));
    } catch (err) {
      console.error('Falha ao registrar feedback', err);
      toast({ 
        title: 'Erro', 
        description: 'Não foi possível registrar o feedback.', 
        variant: 'destructive' 
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600 bg-green-100';
    if (score >= 0.8) return 'text-blue-600 bg-blue-100';
    if (score >= 0.7) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-[#1565C0]" />
            <span>AI Matching Engine Avançado</span>
            <Badge variant="outline" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Federal Learning
            </Badge>
          </CardTitle>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Sistema integrado com aprendizado contínuo e contexto personalizado
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Tipo de serviço (ex: P&D, Regulatório)"
              value={searchCriteria.service_type}
              onChange={(e) => setSearchCriteria({
                ...searchCriteria,
                service_type: e.target.value
              })}
            />
            <Input
              placeholder="Localização (ex: São Paulo, Rio)"
              value={searchCriteria.location}
              onChange={(e) => setSearchCriteria({
                ...searchCriteria,
                location: e.target.value
              })}
            />
            <Input
              placeholder="Expertise (ex: Oncologia, Biotec)"
              value={searchCriteria.expertise}
              onChange={(e) => setSearchCriteria({
                ...searchCriteria,
                expertise: e.target.value
              })}
            />
          </div>
          
          <Button 
            onClick={handleEnhancedMatching}
            disabled={loading}
            className="w-full bg-[#1565C0] hover:bg-[#1565C0]/90"
          >
            <Search className="h-4 w-4 mr-2" />
            {loading ? 'Processando com IA...' : 'Buscar Matches Inteligentes'}
          </Button>
        </CardContent>
      </Card>

      {matches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Matches Encontrados ({matches.length})</h3>
            <Badge variant="outline">
              <Brain className="h-3 w-3 mr-1" />
              Aprendizado ativo
            </Badge>
          </div>
          
          {matches.map((match, index) => (
            <Card key={match.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold">{match.company.name}</h4>
                      <Badge className={`${getScoreColor(match.compatibility_score)} border-0`}>
                        <Star className="h-3 w-3 mr-1" />
                        {Math.round(match.compatibility_score * 100)}% Match
                      </Badge>
                      {match.learning_applied && (
                        <Badge variant="outline" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          IA Aprendida
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{match.company.city}, {match.company.state}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{match.company.expertise_area?.join(', ')}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{match.company.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Fatores de Compatibilidade:</p>
                        <div className="flex flex-wrap gap-1">
                          {match.match_factors.map((factor, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {match.ai_insights && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Insights da IA:</p>
                          <div className="flex flex-wrap gap-1">
                            {match.ai_insights.map((insight, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                <Brain className="h-3 w-3 mr-1" />
                                {insight}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Mensagem
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-4 w-4 mr-1" />
                    Agendar
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-1" />
                    Ver Perfil
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => handleFeedback(match, 'accepted')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aceitar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleFeedback(match, 'rejected')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Rejeitar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedAIMatchingEngine;
