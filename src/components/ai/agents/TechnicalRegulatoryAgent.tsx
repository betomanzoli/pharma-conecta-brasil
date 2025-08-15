
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Shield, FileCheck, AlertTriangle } from 'lucide-react';
import { useAITechRegulatory } from '@/hooks/useAITechRegulatory';
import { useToast } from '@/hooks/use-toast';
import AgentHandoffButton from '../AgentHandoffButton';

const TechnicalRegulatoryAgent = () => {
  const { analyzeTechRegulatory, loading } = useAITechRegulatory();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    product_type: '',
    route_or_manufacturing: '',
    dosage_form: '',
    target_regions: '',
    clinical_stage: '',
    reference_product: '',
    known_risks: ''
  });
  const [analysis, setAnalysis] = useState<any>(null);

  const handleSubmit = async () => {
    if (!formData.product_type.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Selecione o tipo de produto",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await analyzeTechRegulatory(formData);
      if (result) {
        setAnalysis(result);
        toast({
          title: "Análise Concluída",
          description: "Avaliação técnico-regulatória gerada com sucesso"
        });
      }
    } catch (error) {
      console.error('Erro na análise:', error);
    }
  };

  const complianceChecks = [
    { name: 'RDC 301/2019', status: 'compliant', description: 'Medicamentos Genéricos' },
    { name: 'RDC 47/2009', status: 'warning', description: 'Boas Práticas de Fabricação' },
    { name: 'ICH Q7', status: 'compliant', description: 'API Guidelines' },
    { name: 'RDC 204/2017', status: 'pending', description: 'Rastreabilidade' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <FileCheck className="h-3 w-3" />;
      case 'warning': return <AlertTriangle className="h-3 w-3" />;
      default: return <Shield className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <Settings className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Especialista Técnico-Regulatório IA</h2>
            <p className="text-muted-foreground">
              Análise de compliance e viabilidade regulatória
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Avaliação Regulatória</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tipo de Produto *</label>
                  <Select value={formData.product_type} onValueChange={(value) => setFormData({...formData, product_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medicamento_generico">Medicamento Genérico</SelectItem>
                      <SelectItem value="medicamento_similar">Medicamento Similar</SelectItem>
                      <SelectItem value="medicamento_novo">Medicamento Novo</SelectItem>
                      <SelectItem value="suplemento">Suplemento Alimentar</SelectItem>
                      <SelectItem value="cosmético">Produto Cosmético</SelectItem>
                      <SelectItem value="dispositivo_medico">Dispositivo Médico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Via de Administração/Fabricação</label>
                  <Input
                    placeholder="Ex: Oral, Tópica, Injetável..."
                    value={formData.route_or_manufacturing}
                    onChange={(e) => setFormData({...formData, route_or_manufacturing: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Forma Farmacêutica</label>
                  <Input
                    placeholder="Ex: Comprimido, Cápsula, Solução..."
                    value={formData.dosage_form}
                    onChange={(e) => setFormData({...formData, dosage_form: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Regiões Alvo</label>
                  <Input
                    placeholder="Ex: Brasil, Mercosul, Global..."
                    value={formData.target_regions}
                    onChange={(e) => setFormData({...formData, target_regions: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Estágio Clínico</label>
                  <Select value={formData.clinical_stage} onValueChange={(value) => setFormData({...formData, clinical_stage: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estágio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre_clinico">Pré-clínico</SelectItem>
                      <SelectItem value="fase_1">Fase I</SelectItem>
                      <SelectItem value="fase_2">Fase II</SelectItem>
                      <SelectItem value="fase_3">Fase III</SelectItem>
                      <SelectItem value="pos_comercializacao">Pós-comercialização</SelectItem>
                      <SelectItem value="bioequivalencia">Bioequivalência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Produto de Referência</label>
                  <Input
                    placeholder="Nome do produto de referência"
                    value={formData.reference_product}
                    onChange={(e) => setFormData({...formData, reference_product: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Riscos Conhecidos</label>
                <Input
                  placeholder="Efeitos adversos ou riscos identificados"
                  value={formData.known_risks}
                  onChange={(e) => setFormData({...formData, known_risks: e.target.value})}
                />
              </div>

              <Button onClick={handleSubmit} disabled={loading} className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                {loading ? 'Analisando...' : 'Gerar Avaliação Regulatória'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status de Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {complianceChecks.map((check, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <div className="font-medium text-sm">{check.name}</div>
                      <div className="text-xs text-muted-foreground">{check.description}</div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(check.status)}>
                    {check.status === 'compliant' ? 'OK' : 
                     check.status === 'warning' ? 'Atenção' : 'Pendente'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {analysis && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Resumo da Análise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Viabilidade Regulatória</span>
                    <Badge className="bg-green-100 text-green-800">Alta</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Prazo Estimado</span>
                    <Badge className="bg-blue-100 text-blue-800">12-18 meses</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Complexidade</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Média</Badge>
                  </div>
                  <div className="mt-4">
                    <AgentHandoffButton
                      sourceAgent="technical_regulatory"
                      targetAgents={['document_assistant', 'project_analyst']}
                      agentOutputId={analysis.id}
                      outputData={{
                        regulatory_assessment: analysis.output_md,
                        viability: 'high',
                        estimated_timeline: '12-18 months'
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
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle>Avaliação Técnico-Regulatória</CardTitle>
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

export default TechnicalRegulatoryAgent;
