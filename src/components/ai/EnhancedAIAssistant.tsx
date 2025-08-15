
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Sparkles, 
  FileText, 
  TrendingUp, 
  Users,
  Download,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAIHandoffs } from '@/hooks/useAIHandoffs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { isDemoMode } from '@/utils/demoMode';

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  fields: {
    name: string;
    placeholder: string;
    type: 'text' | 'textarea' | 'select';
    options?: string[];
    required?: boolean;
  }[];
  samplePrompt: string;
}

const EnhancedAIAssistant = () => {
  const [activeAgent, setActiveAgent] = useState('ai-project-analyst');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastOutputId, setLastOutputId] = useState<string | null>(null);

  const { user } = useAuth();
  const { enqueue } = useAIHandoffs();
  const { toast } = useToast();
  const isDemo = isDemoMode();

  const agents: AgentConfig[] = [
    {
      id: 'ai-project-analyst',
      name: 'Project Analyst',
      description: 'Análise e estruturação de projetos farmacêuticos',
      icon: TrendingUp,
      color: 'bg-blue-500',
      fields: [
        { name: 'product_name', placeholder: 'Nome do produto', type: 'text', required: true },
        { name: 'therapeutic_area', placeholder: 'Área terapêutica', type: 'text', required: true },
        { name: 'project_goals', placeholder: 'Objetivos do projeto', type: 'textarea', required: true },
        { name: 'timeline', placeholder: 'Prazo esperado', type: 'text' },
        { name: 'budget_range', placeholder: 'Faixa orçamentária', type: 'select', options: ['Até R$ 50k', 'R$ 50k - R$ 200k', 'R$ 200k - R$ 500k', 'Acima de R$ 500k'] }
      ],
      samplePrompt: 'Preciso estruturar um projeto para desenvolvimento de um novo medicamento anti-inflamatório com prazo de 18 meses.'
    },
    {
      id: 'ai-technical-regulatory',
      name: 'Technical Regulatory',
      description: 'Análise técnica e regulatória especializada',
      icon: FileText,
      color: 'bg-green-500',
      fields: [
        { name: 'product_type', placeholder: 'Tipo de produto', type: 'select', options: ['Medicamento', 'Dispositivo Médico', 'Cosmético', 'Suplemento'], required: true },
        { name: 'route_administration', placeholder: 'Via de administração', type: 'select', options: ['Oral', 'Injetável', 'Tópica', 'Inalatória', 'Outra'] },
        { name: 'dosage_form', placeholder: 'Forma farmacêutica', type: 'text' },
        { name: 'active_ingredients', placeholder: 'Ingredientes ativos', type: 'textarea', required: true },
        { name: 'target_market', placeholder: 'Mercado alvo', type: 'select', options: ['Brasil', 'Mercosul', 'América Latina', 'Global'] }
      ],
      samplePrompt: 'Preciso de orientações regulatórias para registro de um comprimido de ibuprofeno 400mg na ANVISA.'
    },
    {
      id: 'ai-business-strategist',
      name: 'Business Strategist',
      description: 'Estratégia de negócios e análise de mercado',
      icon: Users,
      color: 'bg-purple-500',
      fields: [
        { name: 'business_model', placeholder: 'Modelo de negócio', type: 'select', options: ['B2B', 'B2C', 'B2B2C', 'Marketplace'] },
        { name: 'target_audience', placeholder: 'Público-alvo', type: 'textarea', required: true },
        { name: 'competitive_landscape', placeholder: 'Cenário competitivo', type: 'textarea' },
        { name: 'revenue_model', placeholder: 'Modelo de receita', type: 'text' },
        { name: 'growth_stage', placeholder: 'Estágio da empresa', type: 'select', options: ['Startup', 'Growth', 'Scale-up', 'Mature'] }
      ],
      samplePrompt: 'Preciso desenvolver uma estratégia de go-to-market para uma plataforma de telemedicina.'
    },
    {
      id: 'ai-document-assistant',
      name: 'Document Assistant',
      description: 'Geração e revisão de documentos especializados',
      icon: FileText,
      color: 'bg-orange-500',
      fields: [
        { name: 'document_type', placeholder: 'Tipo de documento', type: 'select', options: ['CTD', 'Protocolo Clínico', 'Manual de Qualidade', 'SOP', 'Relatório Técnico'], required: true },
        { name: 'document_purpose', placeholder: 'Finalidade do documento', type: 'textarea', required: true },
        { name: 'regulatory_framework', placeholder: 'Marco regulatório', type: 'select', options: ['ANVISA', 'FDA', 'EMA', 'ICH', 'Outro'] },
        { name: 'template_preference', placeholder: 'Preferência de template', type: 'text' }
      ],
      samplePrompt: 'Preciso gerar um CTD completo para submissão de um medicamento genérico na ANVISA.'
    }
  ];

  const currentAgent = agents.find(a => a.id === activeAgent) || agents[0];

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async () => {
    if (!isDemo && !user) {
      toast({
        title: "Autenticação necessária",
        description: "Faça login para usar os agentes AI",
        variant: "destructive"
      });
      return;
    }

    // Validar campos obrigatórios
    const requiredFields = currentAgent.fields.filter(f => f.required);
    const missingFields = requiredFields.filter(f => !formData[f.name]?.trim());
    
    if (missingFields.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: `Preencha: ${missingFields.map(f => f.placeholder).join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setResponse('');

    try {
      if (isDemo) {
        // Simulação para modo demo
        await new Promise(resolve => setTimeout(resolve, 2000));
        setResponse(`## Análise ${currentAgent.name}

**Produto:** ${formData.product_name || 'Produto de exemplo'}

### Resumo Executivo
Com base nos dados fornecidos, realizei uma análise completa considerando os aspectos técnicos, regulatórios e estratégicos.

### Principais Recomendações
1. **Desenvolvimento**: Estruturar o projeto em fases bem definidas
2. **Regulatório**: Iniciar processo de consulta prévia com ANVISA
3. **Mercado**: Validar demanda e concorrência
4. **Parcerias**: Identificar fornecedores e consultores especializados

### Próximos Passos
- [ ] Elaborar cronograma detalhado
- [ ] Definir orçamento por etapa
- [ ] Identificar parceiros estratégicos
- [ ] Iniciar estudos de viabilidade

*Esta é uma simulação em modo demo. Para análises completas, faça login na plataforma.*`);
      } else {
        // Chamada real para a edge function
        const { data, error } = await supabase.functions.invoke(activeAgent, {
          body: {
            ...formData,
            user_id: user?.id,
            context: 'enhanced_assistant'
          }
        });

        if (error) throw error;

        if (data?.output?.output_md) {
          setResponse(data.output.output_md);
          setLastOutputId(data.output.id);
        } else {
          throw new Error('Resposta inválida do agente');
        }
      }

      toast({
        title: "Análise concluída!",
        description: `${currentAgent.name} processou sua solicitação`,
      });

    } catch (error) {
      console.error('Error calling agent:', error);
      toast({
        title: "Erro na análise",
        description: "Não foi possível processar sua solicitação",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleHandoff = async (targetAgents: string[]) => {
    if (!lastOutputId) return;

    try {
      await enqueue({
        source_agent: activeAgent,
        target_agents: targetAgents,
        input: formData,
        agent_output_id: lastOutputId
      });

      toast({
        title: "Handoff criado!",
        description: `Tarefas enviadas para ${targetAgents.join(', ')}`,
      });
    } catch (error) {
      toast({
        title: "Erro no handoff",
        description: "Não foi possível criar as tarefas",
        variant: "destructive"
      });
    }
  };

  const loadSampleData = () => {
    const sampleData: Record<string, string> = {};
    
    switch (activeAgent) {
      case 'ai-project-analyst':
        sampleData.product_name = 'Analgésico XYZ';
        sampleData.therapeutic_area = 'Controle da dor';
        sampleData.project_goals = 'Desenvolver e registrar novo analgésico de ação prolongada';
        sampleData.timeline = '18 meses';
        sampleData.budget_range = 'R$ 200k - R$ 500k';
        break;
      case 'ai-technical-regulatory':
        sampleData.product_type = 'Medicamento';
        sampleData.route_administration = 'Oral';
        sampleData.dosage_form = 'Comprimido revestido';
        sampleData.active_ingredients = 'Ibuprofeno 400mg';
        sampleData.target_market = 'Brasil';
        break;
    }
    
    setFormData(sampleData);
  };

  const IconComponent = currentAgent.icon;

  return (
    <div className="space-y-6">
      {/* Agent Selection */}
      <Tabs value={activeAgent} onValueChange={setActiveAgent}>
        <TabsList className="grid w-full grid-cols-4">
          {agents.map((agent) => (
            <TabsTrigger key={agent.id} value={agent.id} className="text-xs">
              {agent.name.split(' ')[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {agents.map((agent) => {
          const AgentIcon = agent.icon;
          return (
            <TabsContent key={agent.id} value={agent.id} className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${agent.color} text-white`}>
                      <AgentIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>{agent.name}</CardTitle>
                      <p className="text-muted-foreground">{agent.description}</p>
                    </div>
                    {isDemo && (
                      <Badge variant="outline" className="ml-auto">
                        Modo Demo
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agent.fields.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <label className="text-sm font-medium">
                          {field.placeholder} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        {field.type === 'textarea' ? (
                          <Textarea
                            placeholder={field.placeholder}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                            rows={3}
                          />
                        ) : field.type === 'select' ? (
                          <select
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={formData[field.name] || ''}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          >
                            <option value="">Selecione...</option>
                            {field.options?.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <Input
                            placeholder={field.placeholder}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-2">
                    <Button 
                      onClick={handleSubmit}
                      disabled={isProcessing}
                      className="flex-1"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {isProcessing ? 'Processando...' : `Executar ${agent.name}`}
                    </Button>
                    <Button 
                      onClick={loadSampleData}
                      variant="outline"
                    >
                      Dados de Exemplo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Response */}
      {response && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <IconComponent className="h-5 w-5" />
                Resultado da Análise
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                </Button>
                {lastOutputId && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleHandoff(['ai-coordinator-orchestrator'])}
                  >
                    <ArrowRight className="h-4 w-4 mr-1" />
                    Handoff para Coordenador
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div 
                className="whitespace-pre-wrap text-sm"
                dangerouslySetInnerHTML={{ 
                  __html: response.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedAIAssistant;
