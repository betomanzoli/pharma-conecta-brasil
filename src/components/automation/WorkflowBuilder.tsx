
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, X, ArrowRight, Play, Save } from 'lucide-react';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'notification';
  title: string;
  config: Record<string, any>;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: WorkflowStep[];
}

const WorkflowBuilder: React.FC = () => {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [showTemplates, setShowTemplates] = useState(true);
  const { toast } = useToast();

  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'template-1',
      name: 'Auto Matching de Projetos',
      description: 'Executa matching automático quando novo projeto é criado',
      category: 'matching',
      steps: [
        {
          id: 'step-1',
          type: 'trigger',
          title: 'Novo Projeto Criado',
          config: { event: 'project.created' }
        },
        {
          id: 'step-2',
          type: 'action',
          title: 'Análise de Requisitos',
          config: { service: 'ai-analysis', method: 'analyze_requirements' }
        },
        {
          id: 'step-3',
          type: 'action',
          title: 'Buscar Parceiros',
          config: { service: 'matching-engine', method: 'find_partners' }
        },
        {
          id: 'step-4',
          type: 'notification',
          title: 'Notificar Resultados',
          config: { recipients: 'project.stakeholders', template: 'matching_results' }
        }
      ]
    },
    {
      id: 'template-2',
      name: 'Monitoramento Compliance',
      description: 'Verifica status regulatório diariamente',
      category: 'compliance',
      steps: [
        {
          id: 'step-1',
          type: 'trigger',
          title: 'Agendamento Diário',
          config: { schedule: '0 9 * * *' }
        },
        {
          id: 'step-2',
          type: 'condition',
          title: 'Verificar Empresas Ativas',
          config: { condition: 'companies.status == "active"' }
        },
        {
          id: 'step-3',
          type: 'action',
          title: 'Check ANVISA Status',
          config: { service: 'anvisa-api', method: 'check_compliance' }
        },
        {
          id: 'step-4',
          type: 'notification',
          title: 'Alertas de Não Conformidade',
          config: { condition: 'compliance.status != "compliant"', template: 'compliance_alert' }
        }
      ]
    },
    {
      id: 'template-3',
      name: 'Cálculo ROI Automático',
      description: 'Atualiza métricas de valor quando milestone é concluído',
      category: 'value',
      steps: [
        {
          id: 'step-1',
          type: 'trigger',
          title: 'Milestone Concluído',
          config: { event: 'milestone.completed' }
        },
        {
          id: 'step-2',
          type: 'action',
          title: 'Calcular ROI',
          config: { service: 'value-calculator', method: 'calculate_roi' }
        },
        {
          id: 'step-3',
          type: 'action',
          title: 'Analisar Impacto Social',
          config: { service: 'impact-analyzer', method: 'social_impact' }
        },
        {
          id: 'step-4',
          type: 'action',
          title: 'Atualizar Dashboard',
          config: { service: 'dashboard', method: 'update_metrics' }
        }
      ]
    }
  ];

  const stepTypes = [
    { value: 'trigger', label: 'Gatilho', color: 'bg-blue-100 text-blue-800' },
    { value: 'condition', label: 'Condição', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'action', label: 'Ação', color: 'bg-green-100 text-green-800' },
    { value: 'notification', label: 'Notificação', color: 'bg-purple-100 text-purple-800' }
  ];

  const handleUseTemplate = (template: WorkflowTemplate) => {
    setWorkflowName(template.name);
    setWorkflowDescription(template.description);
    setSelectedCategory(template.category);
    setWorkflowSteps(template.steps);
    setShowTemplates(false);
  };

  const handleAddStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      type: 'action',
      title: 'Nova Ação',
      config: {}
    };
    setWorkflowSteps([...workflowSteps, newStep]);
  };

  const handleRemoveStep = (stepId: string) => {
    setWorkflowSteps(workflowSteps.filter(step => step.id !== stepId));
  };

  const handleUpdateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    setWorkflowSteps(workflowSteps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  const handleSaveWorkflow = () => {
    if (!workflowName || workflowSteps.length === 0) {
      toast({
        title: "Erro",
        description: "Nome do workflow e pelo menos um passo são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Here you would save to database
    toast({
      title: "Workflow Salvo",
      description: `Workflow "${workflowName}" salvo com sucesso`,
    });
  };

  const handleTestWorkflow = () => {
    toast({
      title: "Teste Iniciado",
      description: "Executando workflow em modo de teste...",
    });
  };

  const getStepTypeConfig = (type: string) => {
    return stepTypes.find(t => t.value === type) || stepTypes[0];
  };

  if (showTemplates) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Construtor de Workflows</h2>
            <p className="text-gray-600 mt-2">
              Crie workflows personalizados ou use templates prontos
            </p>
          </div>
          <Button onClick={() => setShowTemplates(false)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar do Zero
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <Badge variant="outline" className="w-fit">
                  {template.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{template.description}</p>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-gray-700">Passos:</p>
                  {template.steps.map((step, index) => {
                    const typeConfig = getStepTypeConfig(step.type);
                    return (
                      <div key={step.id} className="flex items-center space-x-2">
                        <Badge className={typeConfig.color} variant="secondary">
                          {index + 1}
                        </Badge>
                        <span className="text-sm">{step.title}</span>
                      </div>
                    );
                  })}
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handleUseTemplate(template)}
                >
                  Usar Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Construtor de Workflows</h2>
          <p className="text-gray-600 mt-2">
            Configure seu workflow personalizado
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowTemplates(true)}>
            Ver Templates
          </Button>
          <Button variant="outline" onClick={handleTestWorkflow}>
            <Play className="h-4 w-4 mr-2" />
            Testar
          </Button>
          <Button onClick={handleSaveWorkflow}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow Configuration */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Configuração Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="workflow-name">Nome do Workflow</Label>
                <Input
                  id="workflow-name"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="Ex: Auto Matching de Projetos"
                />
              </div>

              <div>
                <Label htmlFor="workflow-description">Descrição</Label>
                <Textarea
                  id="workflow-description"
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                  placeholder="Descreva o que este workflow faz..."
                />
              </div>

              <div>
                <Label htmlFor="workflow-category">Categoria</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matching">AI Matching</SelectItem>
                    <SelectItem value="governance">Governança</SelectItem>
                    <SelectItem value="value">Valor Compartilhado</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddStep} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Passo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Workflow Steps */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Passos do Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              {workflowSteps.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum passo adicionado ainda</p>
                  <p className="text-sm">Clique em "Adicionar Passo" para começar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workflowSteps.map((step, index) => {
                    const typeConfig = getStepTypeConfig(step.type);
                    return (
                      <div key={step.id} className="relative">
                        <div className="flex items-start space-x-4 p-4 border rounded-lg">
                          <Badge className={typeConfig.color}>
                            {index + 1}
                          </Badge>
                          
                          <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label>Tipo</Label>
                                <Select
                                  value={step.type}
                                  onValueChange={(value) => handleUpdateStep(step.id, { type: value as any })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {stepTypes.map((type) => (
                                      <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label>Título</Label>
                                <Input
                                  value={step.title}
                                  onChange={(e) => handleUpdateStep(step.id, { title: e.target.value })}
                                  placeholder="Título do passo"
                                />
                              </div>
                            </div>

                            {step.type === 'trigger' && (
                              <div>
                                <Label>Evento/Agendamento</Label>
                                <Input
                                  placeholder="Ex: project.created ou 0 9 * * *"
                                  value={step.config.event || step.config.schedule || ''}
                                  onChange={(e) => handleUpdateStep(step.id, {
                                    config: { ...step.config, [step.config.event ? 'event' : 'schedule']: e.target.value }
                                  })}
                                />
                              </div>
                            )}

                            {step.type === 'condition' && (
                              <div>
                                <Label>Condição</Label>
                                <Input
                                  placeholder="Ex: companies.status == 'active'"
                                  value={step.config.condition || ''}
                                  onChange={(e) => handleUpdateStep(step.id, {
                                    config: { ...step.config, condition: e.target.value }
                                  })}
                                />
                              </div>
                            )}

                            {step.type === 'action' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <Label>Serviço</Label>
                                  <Input
                                    placeholder="Ex: ai-analysis"
                                    value={step.config.service || ''}
                                    onChange={(e) => handleUpdateStep(step.id, {
                                      config: { ...step.config, service: e.target.value }
                                    })}
                                  />
                                </div>
                                <div>
                                  <Label>Método</Label>
                                  <Input
                                    placeholder="Ex: analyze_requirements"
                                    value={step.config.method || ''}
                                    onChange={(e) => handleUpdateStep(step.id, {
                                      config: { ...step.config, method: e.target.value }
                                    })}
                                  />
                                </div>
                              </div>
                            )}

                            {step.type === 'notification' && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <Label>Destinatários</Label>
                                  <Input
                                    placeholder="Ex: project.stakeholders"
                                    value={step.config.recipients || ''}
                                    onChange={(e) => handleUpdateStep(step.id, {
                                      config: { ...step.config, recipients: e.target.value }
                                    })}
                                  />
                                </div>
                                <div>
                                  <Label>Template</Label>
                                  <Input
                                    placeholder="Ex: matching_results"
                                    value={step.config.template || ''}
                                    onChange={(e) => handleUpdateStep(step.id, {
                                      config: { ...step.config, template: e.target.value }
                                    })}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveStep(step.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {index < workflowSteps.length - 1 && (
                          <div className="flex justify-center my-2">
                            <ArrowRight className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
