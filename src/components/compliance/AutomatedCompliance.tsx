
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Clock,
  Zap,
  Download,
  Eye,
  Settings,
  Activity,
  Target,
  TrendingUp
} from 'lucide-react';

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  regulation: 'ANVISA' | 'FDA' | 'EMA' | 'ICH' | 'LGPD';
  category: 'safety' | 'quality' | 'efficacy' | 'privacy' | 'documentation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  automated: boolean;
  lastChecked: Date;
  status: 'compliant' | 'non_compliant' | 'pending' | 'warning';
}

interface ComplianceReport {
  id: string;
  title: string;
  regulation: string;
  generatedAt: Date;
  status: 'draft' | 'final' | 'submitted' | 'approved';
  complianceScore: number;
  issues: ComplianceIssue[];
  recommendations: string[];
}

interface ComplianceIssue {
  id: string;
  rule: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved';
  assignedTo: string;
  dueDate: Date;
  resolution?: string;
}

const AutomatedCompliance = () => {
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([
    {
      id: '1',
      name: 'Documentação de Segurança',
      description: 'Verificar completude da documentação de segurança pré-clínica',
      regulation: 'ANVISA',
      category: 'safety',
      severity: 'critical',
      automated: true,
      lastChecked: new Date('2024-01-15'),
      status: 'compliant'
    },
    {
      id: '2',
      name: 'Controle de Qualidade',
      description: 'Validar procedimentos de controle de qualidade conforme BPF',
      regulation: 'ANVISA',
      category: 'quality',
      severity: 'high',
      automated: true,
      lastChecked: new Date('2024-01-14'),
      status: 'warning'
    },
    {
      id: '3',
      name: 'Dados Pessoais',
      description: 'Verificar conformidade com LGPD no tratamento de dados',
      regulation: 'LGPD',
      category: 'privacy',
      severity: 'high',
      automated: true,
      lastChecked: new Date('2024-01-13'),
      status: 'compliant'
    },
    {
      id: '4',
      name: 'Eficácia Clínica',
      description: 'Avaliar dados de eficácia conforme diretrizes ICH',
      regulation: 'ICH',
      category: 'efficacy',
      severity: 'critical',
      automated: false,
      lastChecked: new Date('2024-01-12'),
      status: 'pending'
    }
  ]);

  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([
    {
      id: '1',
      title: 'Relatório de Conformidade ANVISA - Janeiro 2024',
      regulation: 'ANVISA',
      generatedAt: new Date('2024-01-15'),
      status: 'final',
      complianceScore: 94,
      issues: [
        {
          id: '1',
          rule: 'Controle de Qualidade',
          description: 'Atualizar procedimentos de validação analítica',
          severity: 'medium',
          status: 'in_progress',
          assignedTo: 'João Silva',
          dueDate: new Date('2024-01-30')
        }
      ],
      recommendations: [
        'Implementar sistema de rastreabilidade aprimorado',
        'Atualizar SOPs de acordo com nova regulamentação',
        'Realizar treinamento adicional da equipe'
      ]
    },
    {
      id: '2',
      title: 'Auditoria LGPD - Trimestre 1',
      regulation: 'LGPD',
      generatedAt: new Date('2024-01-10'),
      status: 'approved',
      complianceScore: 98,
      issues: [],
      recommendations: [
        'Manter práticas atuais de proteção de dados',
        'Revisar política de retenção de dados semestralmente'
      ]
    }
  ]);

  const [overallScore, setOverallScore] = useState(92);
  const [automationEnabled, setAutomationEnabled] = useState(true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'non_compliant': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRegulationColor = (regulation: string) => {
    switch (regulation) {
      case 'ANVISA': return 'bg-blue-100 text-blue-800';
      case 'FDA': return 'bg-purple-100 text-purple-800';
      case 'EMA': return 'bg-indigo-100 text-indigo-800';
      case 'ICH': return 'bg-teal-100 text-teal-800';
      case 'LGPD': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const runAutomatedCheck = async () => {
    console.log('Executando verificação automática...');
    // Simular verificação automática
    const updatedRules = complianceRules.map(rule => ({
      ...rule,
      lastChecked: new Date(),
      status: Math.random() > 0.8 ? 'warning' : 'compliant'
    }));
    setComplianceRules(updatedRules);
  };

  const generateReport = () => {
    console.log('Gerando relatório de conformidade...');
    // Lógica para gerar relatório automático
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Compliance Automático</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={automationEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                <Activity className="h-3 w-3 mr-1" />
                {automationEnabled ? 'Automação Ativa' : 'Manual'}
              </Badge>
              <Button variant="outline" onClick={runAutomatedCheck}>
                <Zap className="h-4 w-4 mr-2" />
                Verificar Agora
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{overallScore}%</div>
              <div className="text-sm text-gray-600">Score Geral</div>
              <Progress value={overallScore} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {complianceRules.filter(r => r.status === 'compliant').length}
              </div>
              <div className="text-sm text-gray-600">Regras Conformes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {complianceRules.filter(r => r.automated).length}
              </div>
              <div className="text-sm text-gray-600">Verificações Automatizadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {complianceReports.length}
              </div>
              <div className="text-sm text-gray-600">Relatórios Gerados</div>
            </div>
          </div>

          <Tabs defaultValue="rules" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="rules">Regras</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
              <TabsTrigger value="issues">Não Conformidades</TabsTrigger>
              <TabsTrigger value="automation">Automação</TabsTrigger>
            </TabsList>

            <TabsContent value="rules" className="space-y-4">
              <div className="space-y-4">
                {complianceRules.map((rule) => (
                  <Card key={rule.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{rule.name}</h3>
                          <p className="text-sm text-gray-600">{rule.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(rule.status)}>
                            {rule.status}
                          </Badge>
                          <Badge className={getSeverityColor(rule.severity)}>
                            {rule.severity}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Regulamentação</span>
                          <div className="mt-1">
                            <Badge className={getRegulationColor(rule.regulation)}>
                              {rule.regulation}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Categoria</span>
                          <p className="font-medium capitalize">{rule.category}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Última Verificação</span>
                          <p className="font-medium">{rule.lastChecked.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Automação</span>
                          <div className="flex items-center space-x-1">
                            {rule.automated ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-gray-500" />
                            )}
                            <span className="text-sm">
                              {rule.automated ? 'Automático' : 'Manual'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Relatórios de Conformidade</h3>
                <Button onClick={generateReport} className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </div>

              <div className="space-y-4">
                {complianceReports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{report.title}</h4>
                          <p className="text-sm text-gray-600">
                            Gerado em: {report.generatedAt.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getRegulationColor(report.regulation)}>
                            {report.regulation}
                          </Badge>
                          <Badge className={
                            report.status === 'approved' ? 'bg-green-100 text-green-800' :
                            report.status === 'final' ? 'bg-blue-100 text-blue-800' :
                            report.status === 'submitted' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {report.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-600">Score de Conformidade</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <Progress value={report.complianceScore} className="flex-1" />
                            <span className="text-sm font-medium">{report.complianceScore}%</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Não Conformidades</span>
                          <p className="font-medium">{report.issues.length}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Recomendações</span>
                          <p className="font-medium">{report.recommendations.length}</p>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="issues" className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Não Conformidades Abertas</h3>
                <p className="text-sm text-gray-600">
                  Acompanhe e resolva questões de conformidade identificadas
                </p>
              </div>

              <div className="space-y-4">
                {complianceReports.flatMap(report => report.issues).map((issue) => (
                  <Card key={issue.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{issue.rule}</h4>
                          <p className="text-sm text-gray-600">{issue.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(issue.severity)}>
                            {issue.severity}
                          </Badge>
                          <Badge className={
                            issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            issue.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {issue.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-600">Responsável</span>
                          <p className="font-medium">{issue.assignedTo}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Data Limite</span>
                          <p className="font-medium">{issue.dueDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Status</span>
                          <p className="font-medium capitalize">{issue.status}</p>
                        </div>
                      </div>

                      {issue.resolution && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm">
                            <strong>Resolução:</strong> {issue.resolution}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="automation" className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Configurações de Automação</h3>
                <p className="text-sm text-gray-600">
                  Configure verificações automáticas e alertas de conformidade
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Verificações Automáticas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Verificação Diária</p>
                          <p className="text-sm text-gray-600">Executa verificações básicas</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auditoria Semanal</p>
                          <p className="text-sm text-gray-600">Auditoria completa de conformidade</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Relatório Mensal</p>
                          <p className="text-sm text-gray-600">Gera relatórios automáticos</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Configurado</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Alertas e Notificações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Alertas Críticos</p>
                          <p className="text-sm text-gray-600">Notificação imediata</p>
                        </div>
                        <Badge className="bg-red-100 text-red-800">Ativo</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Lembretes de Prazo</p>
                          <p className="text-sm text-gray-600">7 dias antes do vencimento</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Ativo</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Relatório Semanal</p>
                          <p className="text-sm text-gray-600">Resumo executivo por email</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Ativo</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Métricas de Desempenho</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-1">96%</div>
                      <div className="text-sm text-gray-600">Precisão da Automação</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">2.3h</div>
                      <div className="text-sm text-gray-600">Tempo Economizado/Dia</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">45%</div>
                      <div className="text-sm text-gray-600">Redução de Erros</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Alert className="mt-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Compliance Automático:</strong> O sistema monitora continuamente suas operações 
              e garante conformidade com todas as regulamentações aplicáveis, gerando relatórios 
              automáticos e alertas proativos.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomatedCompliance;
