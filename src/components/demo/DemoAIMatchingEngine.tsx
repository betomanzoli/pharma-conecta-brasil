
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, TrendingUp, CheckCircle, XCircle, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { demoAPI } from '@/utils/demoMode';
import DemoModeIndicator from './DemoModeIndicator';

interface DemoMatch {
  id: string;
  name: string;
  type: string;
  score: number;
  specialties: string[];
  location: string;
  verified: boolean;
  compatibility_factors: string[];
}

const DemoAIMatchingEngine = () => {
  const { toast } = useToast();
  const [matches, setMatches] = useState<DemoMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoMatching, setAutoMatching] = useState(false);

  const generateMatches = async () => {
    setLoading(true);
    
    try {
      const result = await demoAPI.aiMatching('pharmaceutical_company', {
        location: 'São Paulo',
        specialties: ['Análise Microbiológica', 'Controle de Qualidade'],
        budget: { min: 10000, max: 500000 }
      });
      
      if (result.success) {
        setMatches(result.matches);
        toast({
          title: "🧠 AI Matching Demo Completo!",
          description: `${result.matches.length} matches de alta qualidade encontrados`,
        });
      }
    } catch (error) {
      console.error('Erro no AI Matching Demo:', error);
      toast({
        title: "Erro no AI Matching",
        description: "Não foi possível completar a demonstração",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptMatch = (matchId: string) => {
    const matchData = matches.find(m => m.id === matchId);
    toast({
      title: "Match aceito! 🎉",
      description: `Demonstração: Em produção, ${matchData?.name} seria notificado automaticamente.`,
    });
    setMatches(prev => prev.filter(m => m.id !== matchId));
  };

  const rejectMatch = (matchId: string) => {
    toast({
      title: "Feedback registrado",
      description: "Demonstração: Seu feedback melhoraria os matches futuros.",
    });
    setMatches(prev => prev.filter(m => m.id !== matchId));
  };

  const getScoreColor = (score: number) => {
    const percentage = Math.round(score * 100);
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 80) return 'bg-blue-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <span>AI Matching Engine</span>
            <DemoModeIndicator variant="badge" />
          </CardTitle>
        </div>
        <DemoModeIndicator variant="alert" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <Button 
            onClick={generateMatches} 
            disabled={loading}
            className="flex items-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <TrendingUp className="h-4 w-4" />
            )}
            <span>{loading ? 'Analisando...' : 'Gerar Matches Demo'}</span>
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

        {matches.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Clique em "Gerar Matches Demo" para ver como funciona o AI Matching
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Na versão de produção, os matches serão baseados em dados reais da plataforma
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full ${getScoreColor(match.score)} flex items-center justify-center text-white font-bold`}>
                      {Math.round(match.score * 100)}%
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{match.name}</h3>
                      <Badge variant="outline" className="mt-1">
                        {match.type === 'laboratory' ? 'Laboratório' : 'Consultor'}
                      </Badge>
                      <DemoModeIndicator variant="inline" className="ml-2" />
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
                    <h4 className="font-medium text-gray-700 mb-2">Localização</h4>
                    <p className="text-sm">{match.location}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Especialidades</h4>
                    <div className="flex flex-wrap gap-1">
                      {match.specialties.map((spec, idx) => (
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

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            Como funciona na versão real:
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Os matches são baseados em dados reais de empresas, laboratórios e consultores</li>
            <li>• O algoritmo de IA analisa compatibilidade real de expertise, localização e histórico</li>
            <li>• Feedback dos usuários melhora continuamente a precisão dos matches</li>
            <li>• Integração com sistemas de comunicação para facilitar o primeiro contato</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoAIMatchingEngine;
