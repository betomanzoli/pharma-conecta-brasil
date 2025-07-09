
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Shield, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Building2,
  Clock,
  FileCheck,
  Info
} from 'lucide-react';
import { brazilianRegulatoryService, ComplianceStatus } from '@/services/brazilianRegulatoryService';
import { useToast } from '@/hooks/use-toast';

const ComplianceChecker: React.FC = () => {
  const [cnpj, setCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [complianceData, setComplianceData] = useState<ComplianceStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCnpj(brazilianRegulatoryService.formatCNPJ(value));
  };

  const checkCompliance = async () => {
    if (!brazilianRegulatoryService.validateCNPJ(cnpj)) {
      setError('CNPJ inválido. Verifique o formato.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const compliance = await brazilianRegulatoryService.checkCompanyCompliance(cnpj);
      setComplianceData(compliance);
      
      toast({
        title: "Verificação concluída",
        description: "Status de compliance verificado com sucesso",
      });
    } catch (error) {
      console.error('Error checking compliance:', error);
      setError('Erro ao verificar compliance. Tente novamente.');
      toast({
        title: "Erro na verificação",
        description: "Não foi possível verificar o compliance da empresa",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkCompliance();
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 0.8) return 'Excelente compliance regulatório';
    if (score >= 0.6) return 'Compliance adequado com pontos de atenção';
    return 'Compliance inadequado - requer ações imediatas';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Verificador de Compliance ANVISA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ da Empresa</Label>
              <div className="flex gap-2">
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={cnpj}
                  onChange={handleCNPJChange}
                  maxLength={18}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={loading || !cnpj}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Verificar
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>

      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {complianceData && !loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Resultado da Verificação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status geral */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  {complianceData.status === 'compliant' ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  )}
                </div>
                <Badge 
                  variant={brazilianRegulatoryService.getComplianceStatusColor(complianceData.status) as any}
                  className="mb-2"
                >
                  {brazilianRegulatoryService.getComplianceStatusLabel(complianceData.status)}
                </Badge>
                <p className="text-sm text-muted-foreground">Status Geral</p>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className={`text-2xl font-bold mb-2 ${getScoreColor(complianceData.score)}`}>
                  {Math.round(complianceData.score * 100)}%
                </div>
                <p className="text-sm text-muted-foreground">Score de Compliance</p>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">
                  {new Date(complianceData.last_check).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm text-muted-foreground">Última Verificação</p>
              </div>
            </div>

            {/* Descrição do score */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {getScoreDescription(complianceData.score)}
              </AlertDescription>
            </Alert>

            {/* Itens regulatórios verificados */}
            {complianceData.details.regulatory_items && complianceData.details.regulatory_items.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  Itens Regulatórios Verificados
                </h4>
                <div className="flex flex-wrap gap-2">
                  {complianceData.details.regulatory_items.map((item, index) => (
                    <Badge key={index} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Análise detalhada */}
            <div>
              <h4 className="font-medium mb-3">Análise Detalhada</h4>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm leading-relaxed">
                  {complianceData.details.analysis}
                </p>
              </div>
            </div>

            {/* Informações técnicas */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p>CNPJ verificado: {complianceData.details.cnpj}</p>
              <p>Método de verificação: {complianceData.details.checked_via}</p>
              <p>Válido até: {new Date(complianceData.expires_at).toLocaleDateString('pt-BR')}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !complianceData && (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Verificador de Compliance</h3>
            <p className="text-muted-foreground mb-4">
              Digite o CNPJ da empresa para verificar seu status de compliance com a ANVISA
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComplianceChecker;
