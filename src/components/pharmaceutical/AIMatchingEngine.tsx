
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  TrendingUp, 
  Users, 
  MapPin, 
  Star,
  MessageCircle,
  Calendar,
  FileText
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface Match {
  company: any;
  compatibility_score: number;
  match_factors: string[];
  recommended_actions: string[];
}

const AIMatchingEngine = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    service_type: '',
    location: '',
    expertise: ''
  });
  const { profile } = useAuth();
  const { toast } = useToast();

  const handleAIMatching = async () => {
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
      // Buscar empresa do usuário
      const { data: company } = await supabase
        .from('companies')
        .select('*')
        .eq('profile_id', profile.id)
        .single();

      if (!company) {
        toast({
          title: "Erro",
          description: "Empresa não encontrada",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('ai-matching-enhanced', {
        body: {
          userType: 'pharmaceutical_company',
          userId: profile.id,
          preferences: {
            location: searchCriteria.location,
            specialties: [searchCriteria.expertise],
            serviceType: searchCriteria.service_type
          }
        }
      });

      if (error) throw error;

      if (data?.success && data?.matches) {
        // Converter formato da resposta para o formato esperado
        const formattedMatches = data.matches.map((match: any) => ({
          company: {
            name: match.name,
            expertise_area: match.specialties,
            city: match.location?.split(', ')[0] || '',
            state: match.location?.split(', ')[1] || '',
            description: `${match.type === 'laboratory' ? 'Laboratório' : 'Consultor'} especializado`
          },
          compatibility_score: match.score,
          match_factors: match.compatibility_factors || [`Score: ${Math.round(match.score * 100)}%`],
          recommended_actions: ['Enviar mensagem', 'Agendar reunião', 'Solicitar proposta']
        }));

        setMatches(formattedMatches);
        toast({
          title: "Matching com IA Real Completo!",
          description: `Encontrados ${formattedMatches.length} matches usando algoritmos de ML`,
        });
      } else {
        throw new Error('Nenhum match encontrado');
      }
    } catch (error) {
      console.error('Erro no AI Matching:', error);
      toast({
        title: "Erro",
        description: "Falha ao executar matching",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-blue-600 bg-blue-100';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-[#1565C0]" />
            <span>AI Matching Engine</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              placeholder="Tipo de serviço"
              value={searchCriteria.service_type}
              onChange={(e) => setSearchCriteria({
                ...searchCriteria,
                service_type: e.target.value
              })}
            />
            <Input
              placeholder="Localização"
              value={searchCriteria.location}
              onChange={(e) => setSearchCriteria({
                ...searchCriteria,
                location: e.target.value
              })}
            />
            <Input
              placeholder="Área de expertise"
              value={searchCriteria.expertise}
              onChange={(e) => setSearchCriteria({
                ...searchCriteria,
                expertise: e.target.value
              })}
            />
          </div>
          
          <Button 
            onClick={handleAIMatching}
            disabled={loading}
            className="w-full bg-[#1565C0] hover:bg-[#1565C0]/90"
          >
            <Search className="h-4 w-4 mr-2" />
            {loading ? 'Processando...' : 'Buscar Matches com IA'}
          </Button>
        </CardContent>
      </Card>

      {matches.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Matches Encontrados ({matches.length})</h3>
          
          {matches.map((match, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold">{match.company.name}</h4>
                      <Badge className={`${getScoreColor(match.compatibility_score)} border-0`}>
                        <Star className="h-3 w-3 mr-1" />
                        {Math.round(match.compatibility_score * 100)}% Match
                      </Badge>
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
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Fatores de Compatibilidade:</p>
                      <div className="flex flex-wrap gap-1">
                        {match.match_factors.map((factor, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIMatchingEngine;
