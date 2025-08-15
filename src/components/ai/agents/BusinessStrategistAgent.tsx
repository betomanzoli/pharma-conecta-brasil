
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Target, BarChart3 } from 'lucide-react';
import { useAIBusinessStrategist } from '@/hooks/useAIBusinessStrategist';
import { useToast } from '@/hooks/use-toast';
import AgentHandoffButton from '../AgentHandoffButton';

const BusinessStrategistAgent = () => {
  const { analyzeBusinessCase, loading } = useAIBusinessStrategist();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    opportunity: '',
    product_type: '',
    target_market: '',
    competitors: '',
    differentiation: '',
    investment_range: '',
    timeframe: '',
    risks: ''
  });
  const [analysis, setAnalysis] = useState<any>(null);

  const handleSubmit = async () => {
    if (!formData.opportunity.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Descreva a oportunidade de negócio",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await analyzeBusinessCase(formData);
      if (result) {
        setAnalysis(result);
        toast({
          title: "Análise Concluída",
          description: "Business case gerado com sucesso pelo Estrategista IA"
        });
      }
    } catch (error) {
      console.error('Erro na análise:', error);
    }
  };

  const templates = [
    {
      name: "Medicamento Genérico",
      data: {
        opportunity: "Desenvolver versão genérica de medicamento com patente vencendo",
        product_type: "Medicamento genérico",
        target_market: "Mercado brasileiro de medicamentos",
        competitors: "Outros laboratórios nacionais",
        differentiation: "Preço competitivo e qualidade superior",
        investment_range: "R$ 2-5 milhões",
        timeframe: "18-24 meses",
        risks: "Mudanças regulatórias, competição acirrada"
      }
    },
    {
      name: "Suplemento Nutricional",
      data: {
        opportunity: "Lançar linha de suplementos para mercado fitness",
        product_type: "Suplemento alimentar",
        target_market: "Atletas e praticantes de exercícios",
        competitors: "Marcas internacionais estabelecidas",
        differentiation: "Ingredientes nacionais, certificação orgânica",
        investment_range: "R$ 500k - 1 milhão",
        timeframe: "12-18 meses",
        risks: "Sazonalidade, regulamentação ANVISA"
      }
    }
  ];

  const useTemplate = (template: any) => {
    setFormData(template.data);
    toast({
      title: "Template Aplicado",
      description: `Template "${template.name}" carregado com sucesso`
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 text-white">
            <TrendingUp className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Estrategista de Negócios IA</h2>
            <p className="text-muted-foreground">
              Análise de oportunidades e desenvolvimento de business cases
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
                <span>Análise de Oportunidade</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Oportunidade de Negócio *</label>
                  <Textarea
                    placeholder="Descreva a oportunidade identificada..."
                    value={formData.opportunity}
                    onChange={(e) => setFormData({...formData, opportunity: e.target.value})}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tipo de Produto</label>
                  <Input
                    placeholder="Ex: Medicamento, Suplemento, Cosmético..."
                    value={formData.product_type}
                    onChange={(e) => setFormData({...formData, product_type: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Mercado Alvo</label>
                  <Input
                    placeholder="Segmento de mercado ou público-alvo"
                    value={formData.target_market}
                    onChange={(e) => setFormData({...formData, target_market: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Principais Concorrentes</label>
                  <Input
                    placeholder="Empresas competidoras"
                    value={formData.competitors}
                    onChange={(e) => setFormData({...formData, competitors: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Diferenciação</label>
                  <Input
                    placeholder="Vantagens competitivas"
                    value={formData.differentiation}
                    onChange={(e) => setFormData({...formData, differentiation: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Faixa de Investimento</label>
                  <Input
                    placeholder="Ex: R$ 1-5 milhões"
                    value={formData.investment_range}
                    onChange={(e) => setFormData({...formData, investment_range: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Prazo Esperado</label>
                  <Input
                    placeholder="Ex: 12-18 meses"
                    value={formData.timeframe}
                    onChange={(e) => setFormData({...formData, timeframe: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Riscos Identificados</label>
                  <Input
                    placeholder="Principais riscos do projeto"
                    value={formData.risks}
                    onChange={(e) => setFormData({...formData, risks: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={handleSubmit} disabled={loading} className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                {loading ? 'Analisando...' : 'Gerar Business Case'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Templates Rápidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {templates.map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => useTemplate(template)}
                  className="w-full justify-start h-auto p-3"
                >
                  <div className="text-left">
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {template.data.opportunity.substring(0, 50)}...
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {analysis && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Métricas de Análise</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Score de Viabilidade</span>
                    <Badge className="bg-green-100 text-green-800">85%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">ROI Projetado</span>
                    <Badge className="bg-blue-100 text-blue-800">240%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Risco Geral</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Médio</Badge>
                  </div>
                  <div className="mt-4">
                    <AgentHandoffButton
                      sourceAgent="business_strategist"
                      targetAgents={['technical_regulatory', 'project_analyst']}
                      agentOutputId={analysis.id}
                      outputData={{
                        business_case: analysis.output_md,
                        viability_score: 85,
                        roi_projection: 240
                      }}
                      onHandoffComplete={() => {
                        toast({
                          title: "Handoff Realizado",
                          description: "Análise enviada para agentes especializados"
                        });
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {analysis && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle>Business Case Gerado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                {analysis.output_md}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusinessStrategistAgent;
