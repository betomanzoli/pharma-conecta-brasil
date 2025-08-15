
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, BarChart3, Target, CheckCircle } from 'lucide-react';
import { useAICoordinator } from '@/hooks/useAICoordinator';
import { useToast } from '@/hooks/use-toast';

const CoordinatorAgent = () => {
  const { coordinate, loading } = useAICoordinator();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    focus: '',
    priorities: ['']
  });
  const [coordination, setCoordination] = useState<any>(null);

  const handleSubmit = async () => {
    const validPriorities = formData.priorities.filter(p => p.trim());
    if (!formData.focus.trim() || validPriorities.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Defina o foco e ao menos uma prioridade",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await coordinate({
        focus: formData.focus,
        priorities: validPriorities
      });

      if (result) {
        setCoordination(result);
        toast({
          title: "Coordenação Concluída",
          description: "Plano executivo gerado com sucesso"
        });
      }
    } catch (error) {
      console.error('Erro na coordenação:', error);
    }
  };

  const addPriority = () => {
    setFormData({
      ...formData,
      priorities: [...formData.priorities, '']
    });
  };

  const updatePriority = (index: number, value: string) => {
    const newPriorities = [...formData.priorities];
    newPriorities[index] = value;
    setFormData({
      ...formData,
      priorities: newPriorities
    });
  };

  const removePriority = (index: number) => {
    if (formData.priorities.length > 1) {
      const newPriorities = formData.priorities.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        priorities: newPriorities
      });
    }
  };

  const focusAreas = [
    'Lançamento de Produto',
    'Compliance Regulatório',
    'Otimização de Processos',
    'Entrada em Novo Mercado',
    'Parcerias Estratégicas',
    'Inovação Tecnológica',
    'Redução de Custos',
    'Expansão de Portfólio'
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <Brain className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Coordenador Central IA</h2>
            <p className="text-muted-foreground">
              Orquestração inteligente e síntese de resultados dos agentes
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Definição de Foco e Prioridades</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Foco Principal *</label>
                <Textarea
                  placeholder="Descreva o foco principal do projeto ou iniciativa que precisa ser coordenada..."
                  value={formData.focus}
                  onChange={(e) => setFormData({...formData, focus: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Prioridades *</label>
                {formData.priorities.map((priority, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <div className="flex-1">
                      <Textarea
                        placeholder={`Prioridade ${index + 1}...`}
                        value={priority}
                        onChange={(e) => updatePriority(index, e.target.value)}
                        rows={2}
                      />
                    </div>
                    {formData.priorities.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePriority(index)}
                        className="mt-0"
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={addPriority} className="w-full">
                  Adicionar Prioridade
                </Button>
              </div>

              <Button onClick={handleSubmit} disabled={loading} className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                {loading ? 'Coordenando...' : 'Gerar Plano de Coordenação'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Áreas de Foco Sugeridas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((area, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({...formData, focus: `Coordenar iniciativas relacionadas a ${area.toLowerCase()}`})}
                    className="text-xs"
                  >
                    {area}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {coordination && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Métricas de Coordenação</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Prioridades Mapeadas</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {coordination.kpis?.priorities_count || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Área de Foco</span>
                    <Badge className="bg-green-100 text-green-800">
                      {coordination.kpis?.focus_area || 'Definido'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Status</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Concluído
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Eficiência de Coordenação</div>
                    <Progress value={95} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">95%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Capacidades do Coordenador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Síntese de informações dos agentes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Priorização inteligente de demandas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Orquestração de workflows</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Recomendações executivas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Monitoramento de progresso</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {coordination && (
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader>
            <CardTitle>Plano de Coordenação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                {coordination.output_md}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CoordinatorAgent;
