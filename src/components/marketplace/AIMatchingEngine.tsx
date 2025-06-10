
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Target, Star, Clock, Users } from "lucide-react";

const AIMatchingEngine = () => {
  const aiMatches = [
    {
      id: 1,
      type: "Laboratory Match",
      title: "LabAnalítica SP ↔ Seu Projeto de Estabilidade",
      compatibility: 92,
      reason: "Especialização em estudos de estabilidade, disponibilidade imediata, localização estratégica",
      potentialValue: "R$ 45.000",
      timeline: "2 semanas",
      confidence: "Muito Alta",
      icon: Target
    },
    {
      id: 2,
      type: "Partnership Opportunity",
      title: "BioNova S.A. ↔ Sua Expertise Regulatória",
      compatibility: 87,
      reason: "Complementaridade de competências, histórico de colaborações similares",
      potentialValue: "R$ 120.000",
      timeline: "1 mês",
      confidence: "Alta",
      icon: Users
    },
    {
      id: 3,
      type: "Equipment Need",
      title: "HPLC Agilent ↔ Seu Laboratório",
      compatibility: 78,
      reason: "Análise de crescimento indica necessidade de capacidade adicional em 3 meses",
      potentialValue: "R$ 180.000",
      timeline: "3 meses",
      confidence: "Média-Alta",
      icon: TrendingUp
    }
  ];

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "Muito Alta":
        return "bg-green-100 text-green-800";
      case "Alta":
        return "bg-blue-100 text-blue-800";
      case "Média-Alta":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Engine Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle className="text-xl text-blue-900">Motor de IA PharmaNexus</CardTitle>
              <p className="text-blue-700">Algoritmos avançados analisando 10.000+ pontos de dados em tempo real</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-900">2.4M</p>
              <p className="text-sm text-blue-600">Análises/Dia</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-900">94%</p>
              <p className="text-sm text-green-600">Precisão</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-900">156</p>
              <p className="text-sm text-purple-600">Matches Hoje</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-900">R$ 15M</p>
              <p className="text-sm text-orange-600">Valor Facilitado</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <div className="grid grid-cols-1 gap-6">
        {aiMatches.map((match) => {
          const Icon = match.icon;
          return (
            <Card key={match.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">{match.type}</Badge>
                      <CardTitle className="text-lg text-gray-900">{match.title}</CardTitle>
                    </div>
                  </div>
                  <Badge className={getConfidenceColor(match.confidence)}>
                    {match.confidence}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Compatibility Score */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Score de Compatibilidade</span>
                      <span className="text-sm font-bold text-blue-600">{match.compatibility}%</span>
                    </div>
                    <Progress value={match.compatibility} className="h-2" />
                  </div>

                  {/* AI Reasoning */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Por que a IA recomenda:</strong> {match.reason}
                    </p>
                  </div>

                  {/* Match Details */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Valor Potencial:</span>
                      <p className="font-semibold text-green-600">{match.potentialValue}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Timeline:</span>
                      <p className="font-semibold">{match.timeline}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Próximo Passo:</span>
                      <p className="font-semibold text-blue-600">Contato Direto</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3 pt-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Iniciar Conversa
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Ver Análise Completa
                    </Button>
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Análises Preditivas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Demanda Prevista - Próximos 30 dias</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Estudos de Estabilidade: +35%</li>
                <li>• Análises Microbiológicas: +22%</li>
                <li>• Consultoria Regulatória: +18%</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Oportunidades de Crescimento</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Parcerias Internacionais: 3 empresas interessadas</li>
                <li>• Novos Equipamentos: ROI projetado 240%</li>
                <li>• Expansão de Serviços: 8 nichos identificados</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIMatchingEngine;
