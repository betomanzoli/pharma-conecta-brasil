import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Calendar,
  TrendingUp,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ComplianceItem {
  id: string;
  category: string;
  requirement: string;
  status: 'compliant' | 'non-compliant' | 'pending' | 'expiring';
  score: number;
  lastCheck: Date;
  nextCheck: Date;
  description: string;
  actions: string[];
  documentation: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

const mockComplianceData: ComplianceItem[] = [
  {
    id: '1',
    category: 'ANVISA',
    requirement: 'Boas Práticas de Fabricação (BPF)',
    status: 'compliant',
    score: 95,
    lastCheck: new Date('2024-01-10'),
    nextCheck: new Date('2024-07-10'),
    description: 'Certificação BPF válida e em conformidade',
    actions: ['Manter documentação atualizada', 'Treinamento contínuo'],
    documentation: ['Certificado BPF', 'Relatório de auditoria', 'Plano de ação'],
    riskLevel: 'low'
  },
  {
    id: '2',
    category: 'FDA',
    requirement: 'Current Good Manufacturing Practice (cGMP)',
    status: 'expiring',
    score: 88,
    lastCheck: new Date('2024-01-05'),
    nextCheck: new Date('2024-03-15'),
    description: 'Certificação expira em 60 dias',
    actions: ['Agendar renovação', 'Preparar documentação'],
    documentation: ['Certificado cGMP', 'Plano de renovação'],
    riskLevel: 'medium'
  },
  {
    id: '3',
    category: 'ISO',
    requirement: 'ISO 13485 - Dispositivos Médicos',
    status: 'pending',
    score: 72,
    lastCheck: new Date('2024-01-01'),
    nextCheck: new Date('2024-02-01'),
    description: 'Auditoria pendente para certificação',
    actions: ['Completar não-conformidades', 'Agendar auditoria'],
    documentation: ['Relatório de gap analysis', 'Plano de implementação'],
    riskLevel: 'high'
  },
  {
    id: '4',
    category: 'ANVISA',
    requirement: 'Farmacovigilância',
    status: 'non-compliant',
    score: 45,
    lastCheck: new Date('2024-01-12'),
    nextCheck: new Date('2024-01-20'),
    description: 'Relatórios atrasados - não conformidade crítica',
    actions: ['Enviar relatórios pendentes', 'Implementar processo automatizado'],
    documentation: ['Relatórios PSUR', 'Plano de farmacovigilância'],
    riskLevel: 'critical'
  }
];

const ComplianceMonitor = () => {
  const [complianceData, setComplianceData] = useState<ComplianceItem[]>(mockComplianceData);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'non-compliant':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'expiring':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      compliant: 'default',
      'non-compliant': 'destructive',
      expiring: 'secondary',
      pending: 'outline'
    } as const;
    
    const labels = {
      compliant: 'Em conformidade',
      'non-compliant': 'Não conforme',
      expiring: 'Expirando',
      pending: 'Pendente'
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getRiskBadge = (risk: string) => {
    const variants = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'secondary',
      low: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[risk as keyof typeof variants] || 'outline'}>
        {risk}
      </Badge>
    );
  };

  const getOverallScore = () => {
    const scores = complianceData.map(item => item.score);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const getStatusCounts = () => {
    return {
      compliant: complianceData.filter(item => item.status === 'compliant').length,
      nonCompliant: complianceData.filter(item => item.status === 'non-compliant').length,
      expiring: complianceData.filter(item => item.status === 'expiring').length,
      pending: complianceData.filter(item => item.status === 'pending').length
    };
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Dados Atualizados",
        description: "Status de compliance atualizado com sucesso",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    toast({
      title: "Relatório Exportado",
      description: "Relatório de compliance baixado com sucesso",
    });
  };

  const statusCounts = getStatusCounts();
  const overallScore = getOverallScore();

  return (
    <div className="space-y-6">
      {/* Header com métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Score Geral</p>
                <p className="text-2xl font-bold">{overallScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conformes</p>
                <p className="text-2xl font-bold">{statusCounts.compliant}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-100 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expirando</p>
                <p className="text-2xl font-bold">{statusCounts.expiring}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Não Conformes</p>
                <p className="text-2xl font-bold">{statusCounts.nonCompliant}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas críticos */}
      {statusCounts.nonCompliant > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Atenção:</strong> {statusCounts.nonCompliant} item(s) em não conformidade. 
            Ação imediata necessária para evitar penalidades regulatórias.
          </AlertDescription>
        </Alert>
      )}

      {/* Monitor principal */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Monitor de Compliance
              </CardTitle>
              <CardDescription>
                Acompanhamento em tempo real do status regulatório
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button variant="outline" onClick={handleExportReport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="anvisa">ANVISA</TabsTrigger>
              <TabsTrigger value="fda">FDA</TabsTrigger>
              <TabsTrigger value="iso">ISO</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {complianceData.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            <h3 className="font-semibold">{item.requirement}</h3>
                            {getStatusBadge(item.status)}
                            {getRiskBadge(item.riskLevel)}
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{item.score}%</p>
                          <p className="text-sm text-muted-foreground">Score</p>
                        </div>
                      </div>

                      <Progress value={item.score} className="h-2" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium mb-2">Próximas Ações:</p>
                          <ul className="space-y-1">
                            {item.actions.map((action, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-2">Documentação:</p>
                          <ul className="space-y-1">
                            {item.documentation.map((doc, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <FileText className="h-3 w-3" />
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Última verificação: {item.lastCheck.toLocaleDateString('pt-BR')}</span>
                          <span>Próxima: {item.nextCheck.toLocaleDateString('pt-BR')}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="anvisa">
              <div className="space-y-4">
                {complianceData.filter(item => item.category === 'ANVISA').map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{item.requirement}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(item.status)}
                          <span className="font-bold">{item.score}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="fda">
              <div className="space-y-4">
                {complianceData.filter(item => item.category === 'FDA').map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{item.requirement}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(item.status)}
                          <span className="font-bold">{item.score}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="iso">
              <div className="space-y-4">
                {complianceData.filter(item => item.category === 'ISO').map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{item.requirement}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(item.status)}
                          <span className="font-bold">{item.score}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceMonitor;