
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createMatchFeedbackNotification } from '@/utils/notificationSeeder';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface Match {
  id: string;
  score: number;
  company: {
    name: string;
    expertise: string[];
  };
  provider: {
    name: string;
    type: 'laboratory' | 'consultant' | 'company';
    specialties: string[];
  };
  compatibility_factors: string[];
  location?: string;
  verified?: boolean;
  metrics?: any;
  lastContact?: Date | null;
  responseRate?: number;
}

const AIMatchingEngine = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoMatching, setAutoMatching] = useState(false);
  const [hasRealData, setHasRealData] = useState(false);

  // Verificar se existem dados reais na plataforma
  useEffect(() => {
    checkForRealData();
  }, []);

  const checkForRealData = async () => {
    try {
      const [
        { data: companies, count: companiesCount },
        { data: laboratories, count: labsCount },
        { data: consultants, count: consultantsCount }
      ] = await Promise.all([
        supabase.from('companies').select('*', { count: 'exact', head: true }),
        supabase.from('laboratories').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'consultant')
      ]);

      const totalEntities = (companiesCount || 0) + (labsCount || 0) + (consultantsCount || 0);
      setHasRealData(totalEntities >= 5); // Considerar "dados reais" quando houver pelo menos 5 entidades
    } catch (error) {
      console.error('Error checking for real data:', error);
      setHasRealData(false);
    }
  };

  const generateMatches = async (preferences?: any) => {
    if (!user) return;
    
    setLoading(true);
    const startTime = Date.now();
    
    try {
      // Buscar perfil completo do usuário
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type, first_name, last_name')
        .eq('id', user.id)
        .single();
      
      if (!profile) {
        throw new Error('Perfil do usuário não encontrado');
      }

      // Buscar dados específicos baseado no tipo de usuário
      let entityData = null;
      if (profile.user_type === 'pharmaceutical_company') {
        const { data } = await supabase
          .from('companies')
          .select('*')
          .eq('profile_id', user.id)
          .single();
        entityData = data;
      } else if (profile.user_type === 'laboratory') {
        const { data } = await supabase
          .from('laboratories')
          .select('*')
          .eq('profile_id', user.id)
          .single();
        entityData = data;
      } else if (profile.user_type === 'consultant') {
        // Para consultores, usar dados do perfil
        entityData = profile;
      }

      // Se não há dados reais suficientes, mostrar aviso
      if (!hasRealData) {
        toast({
          title: "Dados Insuficientes",
          description: "A plataforma precisa de mais usuários cadastrados para gerar matches precisos.",
          variant: "destructive"
        });
        setMatches([]);
        return;
      }

      // Preferências inteligentes baseadas no perfil
      const smartPreferences = preferences || {
        location: entityData?.city || 'São Paulo',
        specialties: entityData?.expertise_area || entityData?.certifications || ['Análise Microbiológica'],
        budget: { min: 1000, max: 50000 },
        searchRadius: 100, // km
        minScore: 0.4,
        maxResults: 15
      };

      // Chamar edge function de AI matching otimizada
      const { data, error } = await supabase.functions.invoke('ai-matching-enhanced', {
        body: {
          userType: profile.user_type,
          userId: user.id,
          preferences: smartPreferences,
          entityData,
          requestTimestamp: new Date().toISOString()
        }
      });

      if (error) throw error;

      if (data?.success && data?.matches && data.matches.length > 0) {
        // Converter e enriquecer dados do match
        const formattedMatches: Match[] = data.matches.map((match: any) => ({
          id: match.id,
          score: Math.round(match.score * 100), // Score em porcentagem
          company: {
            name: entityData?.name || `${profile.first_name} ${profile.last_name}`,
            expertise: entityData?.expertise_area || ['Desenvolvimento Farmacêutico']
          },
          provider: {
            name: match.name,
            type: match.type,
            specialties: match.specialties || []
          },
          compatibility_factors: match.compatibility_factors || [`Compatibilidade: ${Math.round(match.score * 100)}%`],
          location: match.location,
          verified: match.verified,
          metrics: match.metrics,
          lastContact: null,
          responseRate: Math.random() * 30 + 70 // Simular taxa de resposta
        }));

        // Ordenar por score e filtrar baixa qualidade
        const highQualityMatches = formattedMatches
          .filter(m => m.score >= (smartPreferences.minScore * 100))
          .sort((a, b) => b.score - a.score)
          .slice(0, smartPreferences.maxResults);

        setMatches(highQualityMatches);
        
        const processingTime = Date.now() - startTime;
        
        // Log métrica de performance para monitoramento
        try {
          await supabase.from('performance_metrics').insert({
            metric_name: 'ai_matching_frontend_request',
            metric_value: highQualityMatches.length,
            metric_unit: 'matches',
            tags: {
              user_type: profile.user_type,
              user_id: user.id,
              processing_time: processingTime,
              avg_score: highQualityMatches.reduce((sum, m) => sum + m.score, 0) / highQualityMatches.length,
              timestamp: new Date().toISOString()
            }
          });
        } catch (e) {
          console.warn('Failed to log frontend metrics:', e);
        }
        
        toast({
          title: "🧠 AI Matching Completo!",
          description: `${highQualityMatches.length} matches de alta qualidade encontrados em ${processingTime}ms`,
        });
      } else {
        // Quando não há matches suficientes
        setMatches([]);
        toast({
          title: "Nenhum match encontrado",
          description: "Tente ajustar suas preferências ou aguarde mais usuários se cadastrarem na plataforma.",
        });
      }
    } catch (error) {
      console.error('Error generating matches:', error);
      toast({
        title: "Erro no AI Matching",
        description: error instanceof Error ? error.message : "Sistema temporariamente indisponível",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptMatch = async (matchId: string) => {
    try {
      const matchData = matches.find(m => m.id === matchId);
      
      // Registrar feedback na nova tabela
      const feedbackData = {
        user_id: user?.id,
        match_id: matchId,
        feedback_type: 'accepted',
        provider_name: matchData?.provider.name,
        provider_type: matchData?.provider.type,
        match_score: matchData?.score
      };
      
      await supabase.from('match_feedback').insert(feedbackData);
      
      // Criar notificação de feedback
      await createMatchFeedbackNotification(user?.id!, feedbackData);

      // Também manter log em performance_metrics para continuidade
      await supabase.from('performance_metrics').insert({
        metric_name: 'ai_matching_feedback',
        metric_value: 1,
        metric_unit: 'feedback',
        tags: {
          match_id: matchId,
          user_id: user?.id,
          feedback_type: 'accepted',
          timestamp: new Date().toISOString()
        }
      });

      toast({
        title: "Match aceito! 🎉",
        description: hasRealData 
          ? "O provedor foi notificado e entrará em contato em breve. Seu feedback melhora nosso AI!" 
          : "Feedback registrado! Na versão completa, o provedor seria notificado automaticamente.",
      });
      
      setMatches(prev => prev.filter(m => m.id !== matchId));
    } catch (error) {
      console.error('Error accepting match:', error);
      toast({
        title: "Erro ao aceitar match",
        description: "Não foi possível processar sua resposta. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const rejectMatch = async (matchId: string, reason?: string) => {
    try {
      const matchData = matches.find(m => m.id === matchId);
      
      // Registrar feedback na nova tabela
      const feedbackData = {
        user_id: user?.id,
        match_id: matchId,
        feedback_type: 'rejected',
        rejection_reason: reason || 'not_specified',
        provider_name: matchData?.provider.name,
        provider_type: matchData?.provider.type,
        match_score: matchData?.score
      };
      
      await supabase.from('match_feedback').insert(feedbackData);
      
      // Criar notificação de feedback
      await createMatchFeedbackNotification(user?.id!, feedbackData);

      // Também manter log em performance_metrics para continuidade
      await supabase.from('performance_metrics').insert({
        metric_name: 'ai_matching_feedback',
        metric_value: 0,
        metric_unit: 'feedback',
        tags: {
          match_id: matchId,
          user_id: user?.id,
          feedback_type: 'rejected',
          rejection_reason: reason || 'not_specified',
          timestamp: new Date().toISOString()
        }
      });

      toast({
        title: "Feedback registrado",
        description: "Obrigado! Seu feedback nos ajuda a melhorar os matches futuros.",
      });
      
      setMatches(prev => prev.filter(m => m.id !== matchId));
    } catch (error) {
      console.error('Error rejecting match:', error);
      toast({
        title: "Erro ao registrar feedback",
        description: "Não foi possível processar sua resposta. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  useEffect(() => {
    if (autoMatching) {
      const interval = setInterval(() => {
        generateMatches();
      }, 30000); // Gerar novos matches a cada 30 segundos

      return () => clearInterval(interval);
    }
  }, [autoMatching]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-blue-600" />
          <span>AI Matching Engine</span>
        </CardTitle>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={generateMatches} 
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span>{loading ? 'Analisando...' : 'Gerar Matches'}</span>
          </Button>
          <Button
            variant={autoMatching ? 'destructive' : 'outline'}
            onClick={() => setAutoMatching(!autoMatching)}
            className="flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span>{autoMatching ? 'Parar Auto-Match' : 'Ativar Auto-Match'}</span>
          </Button>
        </div>
        
        {!hasRealData && (
          <Alert className="border-orange-200 bg-orange-50">
            <Info className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Plataforma em crescimento:</strong> Para matches mais precisos, precisamos de mais usuários cadastrados. 
              Experimente a <a href="/demo" className="underline font-medium">versão demo</a> para ver o potencial completo.
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        {matches.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {hasRealData 
                ? 'Clique em "Gerar Matches" para encontrar oportunidades'
                : 'Aguardando mais usuários na plataforma para gerar matches precisos'
              }
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {hasRealData 
                ? 'Os matches são baseados em dados reais dos usuários cadastrados'
                : 'Visite nossa demonstração para ver como o AI Matching funciona'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full ${getScoreColor(match.score)} flex items-center justify-center text-white font-bold`}>
                      {match.score}%
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{match.provider.name}</h3>
                      <Badge variant="outline" className="mt-1">
                        {match.provider.type === 'laboratory' ? 'Laboratório' : 'Consultor'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => acceptMatch(match.id)}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Aceitar</span>
                    </Button>
                    <Button
                      onClick={() => rejectMatch(match.id)}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Rejeitar</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Empresa</h4>
                    <p className="text-sm font-medium">{match.company.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {match.company.expertise.map((exp, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Especialidades</h4>
                    <div className="flex flex-wrap gap-1">
                      {match.provider.specialties.map((spec, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Fatores de Compatibilidade</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {match.compatibility_factors.map((factor, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIMatchingEngine;
