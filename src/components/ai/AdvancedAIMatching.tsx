
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Shield, 
  Users, 
  Lock, 
  Eye, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  Target,
  Network
} from 'lucide-react';

interface ConfidentialMatch {
  id: string;
  partnerId: string;
  partnerName: string;
  confidentialityScore: number;
  sharedDataLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  ndaSigned: boolean;
  dataAccessRules: string[];
  securityClearance: string;
  trustScore: number;
  compatibilityScore: number;
  sharedValuePotential: number;
  gomessCasseresApplication: {
    valueCreation: number;
    governance: number;
    valueSharing: number;
  };
}

interface SmartContract {
  id: string;
  projectId: string;
  participants: string[];
  confidentialityRules: string[];
  dataAccessLevels: Record<string, string>;
  automaticEnforcement: boolean;
  complianceStatus: 'compliant' | 'warning' | 'violation';
  expiryDate: Date;
}

const AdvancedAIMatching = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [confidentialMatches, setConfidentialMatches] = useState<ConfidentialMatch[]>([
    {
      id: '1',
      partnerId: 'biotech-labs',
      partnerName: 'BioTech Labs',
      confidentialityScore: 0.95,
      sharedDataLevel: 'confidential',
      ndaSigned: true,
      dataAccessRules: ['IP_RESTRICTED', 'TIME_LIMITED', 'AUDIT_REQUIRED'],
      securityClearance: 'Level 3',
      trustScore: 0.92,
      compatibilityScore: 0.87,
      sharedValuePotential: 0.89,
      gomessCasseresApplication: {
        valueCreation: 0.85,
        governance: 0.90,
        valueSharing: 0.88
      }
    },
    {
      id: '2',
      partnerId: 'pharmacorp',
      partnerName: 'PharmaCorp',
      confidentialityScore: 0.88,
      sharedDataLevel: 'restricted',
      ndaSigned: true,
      dataAccessRules: ['CLEAN_ROOM', 'SEGREGATED_ACCESS', 'REAL_TIME_MONITORING'],
      securityClearance: 'Level 4',
      trustScore: 0.94,
      compatibilityScore: 0.82,
      sharedValuePotential: 0.91,
      gomessCasseresApplication: {
        valueCreation: 0.90,
        governance: 0.85,
        valueSharing: 0.92
      }
    }
  ]);

  const [smartContracts, setSmartContracts] = useState<SmartContract[]>([
    {
      id: '1',
      projectId: 'proj-alpha',
      participants: ['biotech-labs', 'pharmacorp'],
      confidentialityRules: [
        'Dados clínicos só podem ser acessados por pesquisadores autorizados',
        'Informações financeiras restritas ao nível executivo',
        'Propriedade intelectual protegida por clean room'
      ],
      dataAccessLevels: {
        'clinical-data': 'restricted',
        'financial-data': 'confidential',
        'ip-data': 'restricted'
      },
      automaticEnforcement: true,
      complianceStatus: 'compliant',
      expiryDate: new Date('2024-12-31')
    }
  ]);

  const [matchingInProgress, setMatchingInProgress] = useState(false);

  const executeConfidentialMatching = async () => {
    setMatchingInProgress(true);
    
    // Simular processamento de AI Matching com confidencialidade
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Atualizar scores baseado em confidencialidade
    const updatedMatches = confidentialMatches.map(match => ({
      ...match,
      confidentialityScore: Math.min(0.98, match.confidentialityScore + 0.02),
      trustScore: Math.min(0.98, match.trustScore + 0.01),
      compatibilityScore: Math.min(0.98, match.compatibilityScore + 0.01)
    }));
    
    setConfidentialMatches(updatedMatches);
    setMatchingInProgress(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDataLevelColor = (level: string) => {
    switch (level) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'internal': return 'bg-blue-100 text-blue-800';
      case 'confidential': return 'bg-orange-100 text-orange-800';
      case 'restricted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'violation': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI Matching Avançado com Confidencialidade</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {confidentialMatches.length}
              </div>
              <div className="text-sm text-gray-600">Matches Seguros</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">95%</div>
              <div className="text-sm text-gray-600">Confidencialidade</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {smartContracts.length}
              </div>
              <div className="text-sm text-gray-600">Contratos Inteligentes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">100%</div>
              <div className="text-sm text-gray-600">Conformidade</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <Input
              placeholder="Buscar por expertise, setor ou tipo de parceria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={executeConfidentialMatching}
              disabled={matchingInProgress}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {matchingInProgress ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processando...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Executar Matching Seguro
                </>
              )}
            </Button>
          </div>

          <Tabs defaultValue="matches" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="matches">Matches</TabsTrigger>
              <TabsTrigger value="contracts">Contratos</TabsTrigger>
              <TabsTrigger value="governance">Governança</TabsTrigger>
              <TabsTrigger value="value">Valor Compartilhado</TabsTrigger>
            </TabsList>

            <TabsContent value="matches" className="space-y-4">
              <div className="space-y-4">
                {confidentialMatches.map((match) => (
                  <Card key={match.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{match.partnerName}</h3>
                        <div className="flex items-center space-x-2">
                          {match.ndaSigned && (
                            <Badge className="bg-green-100 text-green-800">
                              <Shield className="h-3 w-3 mr-1" />
                              NDA Assinado
                            </Badge>
                          )}
                          <Badge className={getDataLevelColor(match.sharedDataLevel)}>
                            {match.sharedDataLevel}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium">Confidencialidade</Label>
                          <div className="flex items-center space-x-2">
                            <Progress value={match.confidentialityScore * 100} className="flex-1" />
                            <span className={`text-sm font-medium ${getScoreColor(match.confidentialityScore)}`}>
                              {Math.round(match.confidentialityScore * 100)}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Confiança</Label>
                          <div className="flex items-center space-x-2">
                            <Progress value={match.trustScore * 100} className="flex-1" />
                            <span className={`text-sm font-medium ${getScoreColor(match.trustScore)}`}>
                              {Math.round(match.trustScore * 100)}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Compatibilidade</Label>
                          <div className="flex items-center space-x-2">
                            <Progress value={match.compatibilityScore * 100} className="flex-1" />
                            <span className={`text-sm font-medium ${getScoreColor(match.compatibilityScore)}`}>
                              {Math.round(match.compatibilityScore * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <Label className="text-sm font-medium mb-2 block">
                          Regras de Acesso aos Dados
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {match.dataAccessRules.map((rule, index) => (
                            <Badge key={index} variant="outline">
                              <Lock className="h-3 w-3 mr-1" />
                              {rule}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <Label className="text-sm font-medium mb-2 block">
                          Aplicação das Leis de Gomes-Casseres
                        </Label>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {Math.round(match.gomessCasseresApplication.valueCreation * 100)}%
                            </div>
                            <div className="text-xs text-gray-600">Criação de Valor</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {Math.round(match.gomessCasseresApplication.governance * 100)}%
                            </div>
                            <div className="text-xs text-gray-600">Governança</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {Math.round(match.gomessCasseresApplication.valueSharing * 100)}%
                            </div>
                            <div className="text-xs text-gray-600">Compartilhamento</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          <Users className="h-4 w-4 mr-2" />
                          Iniciar Parceria
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contracts" className="space-y-4">
              <div className="space-y-4">
                {smartContracts.map((contract) => (
                  <Card key={contract.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Contrato Inteligente - {contract.projectId}</span>
                        <Badge className={getComplianceColor(contract.complianceStatus)}>
                          {contract.complianceStatus}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Participantes</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {contract.participants.map((participant, index) => (
                              <Badge key={index} variant="outline">
                                <Users className="h-3 w-3 mr-1" />
                                {participant}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Regras de Confidencialidade</Label>
                          <div className="space-y-2 mt-1">
                            {contract.confidentialityRules.map((rule, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">{rule}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Níveis de Acesso aos Dados</Label>
                          <div className="space-y-2 mt-1">
                            {Object.entries(contract.dataAccessLevels).map(([dataType, level]) => (
                              <div key={dataType} className="flex items-center justify-between">
                                <span className="text-sm">{dataType}</span>
                                <Badge className={getDataLevelColor(level)}>
                                  {level}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Aplicação Automática</Label>
                            <div className="flex items-center space-x-2 mt-1">
                              {contract.automaticEnforcement ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              )}
                              <span className="text-sm">
                                {contract.automaticEnforcement ? 'Ativo' : 'Inativo'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Label className="text-sm font-medium">Expira em</Label>
                            <div className="text-sm text-gray-600">
                              {contract.expiryDate.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="governance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Governança Colaborativa Inteligente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Princípios de Governança</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-900">Transparência</h4>
                          <p className="text-sm text-blue-700">
                            Todas as decisões são registradas e auditáveis
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h4 className="font-medium text-green-900">Responsabilidade</h4>
                          <p className="text-sm text-green-700">
                            Papéis e responsabilidades claramente definidos
                          </p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <h4 className="font-medium text-orange-900">Equidade</h4>
                          <p className="text-sm text-orange-700">
                            Distribuição justa de riscos e benefícios
                          </p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <h4 className="font-medium text-purple-900">Eficiência</h4>
                          <p className="text-sm text-purple-700">
                            Decisões rápidas e implementação eficaz
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Métricas de Governança</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">2.3</div>
                          <div className="text-sm text-gray-600">Dias (Tempo de Decisão)</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">92%</div>
                          <div className="text-sm text-gray-600">Engajamento</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-600">97%</div>
                          <div className="text-sm text-gray-600">Satisfação</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="value" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Valor Compartilhado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Valor Econômico</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>ROI Conjunto</span>
                            <span className="font-bold text-green-600">284%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Redução de Custos</span>
                            <span className="font-bold text-blue-600">R$ 2.3M</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Novos Mercados</span>
                            <span className="font-bold text-purple-600">7 países</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-3">Valor Social</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>Empregos Criados</span>
                            <span className="font-bold text-green-600">450</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Pacientes Beneficiados</span>
                            <span className="font-bold text-blue-600">15,000</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Comunidades Impactadas</span>
                            <span className="font-bold text-purple-600">23</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Distribuição de Valor</h3>
                      <div className="space-y-3">
                        {confidentialMatches.map((match) => (
                          <div key={match.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{match.partnerName}</span>
                              <Badge variant="outline">
                                {Math.round(match.sharedValuePotential * 100)}% valor
                              </Badge>
                            </div>
                            <Progress value={match.sharedValuePotential * 100} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Alert className="mt-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Matching Inteligente e Seguro:</strong> Nossa IA garante que apenas informações 
              apropriadas sejam compartilhadas, respeitando todos os níveis de confidencialidade e 
              aplicando as melhores práticas de governança colaborativa.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAIMatching;
