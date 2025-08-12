
import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAITechRegulatory } from '@/hooks/useAITechRegulatory';
import { useToast } from '@/hooks/use-toast';

const TechnicalRegulatory = () => {
  const [productType, setProductType] = useState('');
  const [regulatoryBody, setRegulatoryBody] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [analysis, setAnalysis] = useState('');
  const { analyzeTechRegulatory, loading } = useAITechRegulatory();
  const { toast } = useToast();

  const handleAnalyze = async () => {
    try {
      const result = await analyzeTechRegulatory({
        product_type: productType,
        route_or_manufacturing: 'Via oral',
        dosage_form: 'Comprimidos',
        target_regions: regulatoryBody,
        clinical_stage: 'Registro',
        reference_product: '',
        known_risks: productDescription
      });
      
      if (result?.output_md) {
        setAnalysis(result.output_md);
      } else {
        toast({
          title: "Erro na análise",
          description: "Conteúdo vazio retornado. Verifique os dados ou tente novamente.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao analisar:', error);
      toast({
        title: "Erro inesperado",
        description: "Falha na comunicação com o servidor.",
        variant: "destructive"
      });
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Técnico-Regulatório IA</h1>
                <p className="text-muted-foreground">
                  Compliance ANVISA e estratégia regulatória
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Informações do Produto</span>
                </CardTitle>
                <CardDescription>
                  Dados necessários para análise regulatória
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="productType">Tipo de Produto</Label>
                  <Select value={productType} onValueChange={setProductType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="generico">Medicamento Genérico</SelectItem>
                      <SelectItem value="similar">Medicamento Similar</SelectItem>
                      <SelectItem value="novo">Medicamento Novo</SelectItem>
                      <SelectItem value="biologico">Medicamento Biológico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="regulatory">Órgão Regulatório</Label>
                  <Select value={regulatoryBody} onValueChange={setRegulatoryBody}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o órgão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ANVISA">ANVISA (Brasil)</SelectItem>
                      <SelectItem value="FDA">FDA (EUA)</SelectItem>
                      <SelectItem value="EMA">EMA (Europa)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Descrição do Produto</Label>
                  <Textarea
                    id="description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Descreva o produto, indicações, forma farmacêutica..."
                    rows={4}
                  />
                </div>
                <Button onClick={handleAnalyze} disabled={loading || !productType} className="w-full">
                  {loading ? 'Analisando...' : 'Gerar Estratégia Regulatória'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estratégia Regulatória</CardTitle>
              </CardHeader>
              <CardContent>
                {analysis ? (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm">{analysis}</pre>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>A estratégia regulatória aparecerá aqui</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default TechnicalRegulatory;
