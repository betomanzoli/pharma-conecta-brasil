
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
        const { data } = await supabase
          .from('consultants')
          .select('*')
          .eq('profile_id', user.id)
          .single();
        entityData = data;
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

      if (data?.success && data?.matches) {
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
        throw new Error('Nenhum match de qualidade encontrado. Tente ajustar suas preferências.');
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
      // Simular aceitar match
      toast({
        title: "Match aceito!",
        description: "O provedor foi notificado e entrará em contato em breve",
      });
      
      // Remover match da lista
      setMatches(prev => prev.filter(m => m.id !== matchId));
    } catch (error) {
      console.error('Error accepting match:', error);
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
      </CardHeader>
      <CardContent>
        {matches.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Clique em "Gerar Matches" para encontrar oportunidades</p>
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
                  <Button
                    onClick={() => acceptMatch(match.id)}
                    className="flex items-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Aceitar Match</span>
                  </Button>
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
