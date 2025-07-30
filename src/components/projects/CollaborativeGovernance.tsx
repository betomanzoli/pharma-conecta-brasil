
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Users, 
  Scale, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  Settings, 
  FileText,
  UserCheck,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GovernanceStructure {
  decision_matrix: {
    level: string;
    scope: string[];
    approvers: string[];
    escalation_threshold: string;
  }[];
  transparency_rules: {
    information_sharing: string;
    reporting_frequency: string;
    stakeholder_access: string[];
  };
  value_sharing: {
    revenue_split: any;
    ip_ownership: string;
    cost_allocation: string;
    risk_sharing: string;
  };
  conflict_resolution: {
    process: string[];
    mediator: string;
    timeline: string;
  };
}

interface CollaborativeGovernanceProps {
  projectId?: string;
  partners: any[];
  onGovernanceUpdated: (governance: GovernanceStructure) => void;
}

const CollaborativeGovernance: React.FC<CollaborativeGovernanceProps> = ({
  projectId,
  partners,
  onGovernanceUpdated
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('decision-matrix');
  const [governance, setGovernance] = useState<GovernanceStructure>({
    decision_matrix: [
      {
        level: 'Operacional',
        scope: ['Tarefas diárias', 'Recursos até R$ 5.000', 'Cronograma < 1 semana'],
        approvers: ['Team Lead'],
        escalation_threshold: '3 dias'
      },
      {
        level: 'Tático',
        scope: ['Mudanças de escopo menores', 'Recursos R$ 5.000-50.000', 'Cronograma 1-4 semanas'],
        approvers: ['Project Manager', '1 Partner Representative'],
        escalation_threshold: '1 semana'
      },
      {
        level: 'Estratégico',
        scope: ['Mudanças significativas', 'Recursos > R$ 50.000', 'Cronograma > 4 semanas'],
        approvers: ['All Partners', 'Steering Committee'],
        escalation_threshold: '2 semanas'
      }
    ],
    transparency_rules: {
      information_sharing: 'Complete transparency on project metrics, risks, and progress',
      reporting_frequency: 'Weekly dashboards, Monthly detailed reports, Quarterly strategic reviews',
      stakeholder_access: ['All project data', 'Financial reports', 'Risk assessments', 'Performance metrics']
    },
    value_sharing: {
      revenue_split: { type: 'proportional', basis: 'contribution_weighted' },
      ip_ownership: 'shared_ownership_based_on_contribution',
      cost_allocation: 'actual_costs_plus_overhead_percentage',
      risk_sharing: 'proportional_to_investment'
    },
    conflict_resolution: {
      process: [
        'Direct negotiation (7 days)',
        'Mediation with neutral party (14 days)', 
        'Arbitration (30 days)',
        'Legal resolution (if needed)'
      ],
      mediator: 'External industry expert',
      timeline: 'Total resolution within 60 days maximum'
    }
  });

  const [complianceScore, setComplianceScore] = useState({
    gomes_casseres_law_1: 85, // Joint Value Creation
    gomes_casseres_law_2: 92, // Effective Governance
    gomes_casseres_law_3: 78  // Fair Value Distribution
  });

  const updateGovernance = (section: string, data: any) => {
    const updated = { ...governance, [section]: data };
    setGovernance(updated);
    onGovernanceUpdated(updated);
  };

  const generateAIRecommendations = () => {
    toast({
      title: "IA Analisando Governança",
      description: "Gerando recomendações baseadas nas melhores práticas..."
    });

    // Simulate AI analysis
    setTimeout(() => {
      toast({
        title: "Recomendações Geradas",
        description: "5 sugestões de otimização identificadas."
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header with Compliance Score */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span>Governança Colaborativa Inteligente</span>
          </h2>
          <p className="text-gray-600 mt-1">
            Estrutura baseada nas Três Leis de Gomes-Casseres
          </p>
        </div>
        
        <div className="text-right">
          <Button onClick={generateAIRecommendations} variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Otimizar com IA
          </Button>
        </div>
      </div>

      {/* Compliance Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Criação de Valor Conjunto</p>
                <p className="text-2xl font-bold text-blue-600">{complianceScore.gomes_casseres_law_1}%</p>
                <Progress value={complianceScore.gomes_casseres_law_1} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Settings className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Governança Efetiva</p>
                <p className="text-2xl font-bold text-green-600">{complianceScore.gomes_casseres_law_2}%</p>
                <Progress value={complianceScore.gomes_casseres_law_2} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Scale className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Distribuição Justa</p>
                <p className="text-2xl font-bold text-orange-600">{complianceScore.gomes_casseres_law_3}%</p>
                <Progress value={complianceScore.gomes_casseres_law_3} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Governance Configuration */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="decision-matrix">Matriz de Decisão</TabsTrigger>
          <TabsTrigger value="transparency">Transparência</TabsTrigger>
          <TabsTrigger value="value-sharing">Valor Compartilhado</TabsTrigger>
          <TabsTrigger value="conflict-resolution">Resolução de Conflitos</TabsTrigger>
        </TabsList>

        <TabsContent value="decision-matrix" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>Matriz de Decisão por Níveis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {governance.decision_matrix.map((level, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-lg">{level.level}</h4>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3 mr-1" />
                      {level.escalation_threshold}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2">Escopo de Decisão</h5>
                      <ul className="space-y-1">
                        {level.scope.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Aprovadores Necessários</h5>
                      <div className="flex flex-wrap gap-2">
                        {level.approvers.map((approver, idx) => (
                          <Badge key={idx} variant="secondary">
                            <Users className="h-3 w-3 mr-1" />
                            {approver}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  <strong>Recomendação IA:</strong> Considere automatizar decisões operacionais de baixo risco 
                  para acelerar o projeto em 15-20%.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transparency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Regras de Transparência</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Compartilhamento de Informações</h4>
                  <Textarea
                    value={governance.transparency_rules.information_sharing}
                    onChange={(e) => updateGovernance('transparency_rules', {
                      ...governance.transparency_rules,
                      information_sharing: e.target.value
                    })}
                    rows={4}
                  />
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Frequência de Relatórios</h4>
                  <Textarea
                    value={governance.transparency_rules.reporting_frequency}
                    onChange={(e) => updateGovernance('transparency_rules', {
                      ...governance.transparency_rules,
                      reporting_frequency: e.target.value
                    })}
                    rows={4}
                  />
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Acesso de Stakeholders</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {governance.transparency_rules.stakeholder_access.map((access, index) => (
                    <Badge key={index} variant="outline" className="justify-center py-2">
                      <FileText className="h-3 w-3 mr-1" />
                      {access}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="value-sharing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scale className="h-5 w-5" />
                <span>Modelo de Valor Compartilhado</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-2">Divisão de Receita</label>
                  <Select defaultValue="proportional">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equal">Divisão Igual</SelectItem>
                      <SelectItem value="proportional">Proporcional à Contribuição</SelectItem>
                      <SelectItem value="performance">Baseada em Performance</SelectItem>
                      <SelectItem value="hybrid">Modelo Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block font-medium mb-2">Propriedade Intelectual</label>
                  <Select defaultValue="shared">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shared">Propriedade Compartilhada</SelectItem>
                      <SelectItem value="lead_partner">Parceiro Principal</SelectItem>
                      <SelectItem value="contributor">Por Contribuição</SelectItem>
                      <SelectItem value="separate">Separada por Área</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block font-medium mb-2">Alocação de Custos</label>
                  <Select defaultValue="actual">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equal">Divisão Igual</SelectItem>
                      <SelectItem value="actual">Custos Reais + Overhead</SelectItem>
                      <SelectItem value="budget">Baseada em Orçamento</SelectItem>
                      <SelectItem value="benefit">Proporcional ao Benefício</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block font-medium mb-2">Compartilhamento de Risco</label>
                  <Select defaultValue="proportional">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equal">Risco Igual</SelectItem>
                      <SelectItem value="proportional">Proporcional ao Investimento</SelectItem>
                      <SelectItem value="capability">Por Capacidade</SelectItem>
                      <SelectItem value="insurance">Com Seguro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Alert>
                <Scale className="h-4 w-4" />
                <AlertDescription>
                  <strong>Análise IA:</strong> O modelo atual segue 78% das melhores práticas de Gomes-Casseres. 
                  Sugestão: Considere revisar a distribuição de risco para melhorar a equidade.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conflict-resolution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Processo de Resolução de Conflitos</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Processo Escalonado</h4>
                <div className="space-y-3">
                  {governance.conflict_resolution.process.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-2">Mediador</label>
                  <Input
                    value={governance.conflict_resolution.mediator}
                    onChange={(e) => updateGovernance('conflict_resolution', {
                      ...governance.conflict_resolution,
                      mediator: e.target.value
                    })}
                  />
                </div>
                
                <div>
                  <label className="block font-medium mb-2">Prazo Máximo</label>
                  <Input
                    value={governance.conflict_resolution.timeline}
                    onChange={(e) => updateGovernance('conflict_resolution', {
                      ...governance.conflict_resolution,
                      timeline: e.target.value
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Gerar Acordo de Governança
        </Button>
        <Button onClick={() => onGovernanceUpdated(governance)}>
          <CheckCircle className="h-4 w-4 mr-2" />
          Salvar Governança
        </Button>
      </div>
    </div>
  );
};

export default CollaborativeGovernance;
