
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  FileText, 
  Users, 
  Download, 
  Trash2, 
  Eye,
  CheckCircle,
  AlertTriangle,
  Settings
} from 'lucide-react';

interface ConsentPreference {
  id: string;
  category: string;
  description: string;
  required: boolean;
  enabled: boolean;
}

interface DataRequest {
  id: string;
  type: 'access' | 'portability' | 'deletion' | 'rectification';
  status: 'pending' | 'processing' | 'completed';
  requestDate: Date;
  description: string;
}

const LGPDComplianceCenter = () => {
  const [complianceScore, setComplianceScore] = useState(87);
  const [consents, setConsents] = useState<ConsentPreference[]>([
    {
      id: '1',
      category: 'Dados Básicos',
      description: 'Nome, email e informações de contato',
      required: true,
      enabled: true
    },
    {
      id: '2',
      category: 'Comunicações de Marketing',
      description: 'Newsletters e comunicações promocionais',
      required: false,
      enabled: true
    },
    {
      id: '3',
      category: 'Análise de Comportamento',
      description: 'Análise de uso da plataforma para melhorias',
      required: false,
      enabled: false
    },
    {
      id: '4',
      category: 'Compartilhamento com Parceiros',
      description: 'Dados compartilhados com parceiros do projeto',
      required: false,
      enabled: true
    }
  ]);

  const [dataRequests, setDataRequests] = useState<DataRequest[]>([
    {
      id: '1',
      type: 'access',
      status: 'completed',
      requestDate: new Date('2024-01-15'),
      description: 'Solicitação de acesso aos dados pessoais'
    }
  ]);

  const updateConsent = (id: string, enabled: boolean) => {
    setConsents(consents.map(consent => 
      consent.id === id ? { ...consent, enabled } : consent
    ));
  };

  const requestDataAccess = () => {
    const newRequest: DataRequest = {
      id: Date.now().toString(),
      type: 'access',
      status: 'pending',
      requestDate: new Date(),
      description: 'Solicitação de acesso aos dados pessoais'
    };
    setDataRequests([...dataRequests, newRequest]);
  };

  const requestDataDeletion = () => {
    const newRequest: DataRequest = {
      id: Date.now().toString(),
      type: 'deletion',
      status: 'pending',
      requestDate: new Date(),
      description: 'Solicitação de exclusão dos dados pessoais'
    };
    setDataRequests([...dataRequests, newRequest]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'access': return <Eye className="h-4 w-4" />;
      case 'portability': return <Download className="h-4 w-4" />;
      case 'deletion': return <Trash2 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Centro de Conformidade LGPD</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{complianceScore}%</div>
              <div className="text-sm text-gray-600">Conformidade LGPD</div>
              <Progress value={complianceScore} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{consents.filter(c => c.enabled).length}</div>
              <div className="text-sm text-gray-600">Consentimentos Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">{dataRequests.length}</div>
              <div className="text-sm text-gray-600">Solicitações de Dados</div>
            </div>
          </div>

          <Tabs defaultValue="consents" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="consents">Consentimentos</TabsTrigger>
              <TabsTrigger value="requests">Solicitações</TabsTrigger>
              <TabsTrigger value="privacy">Privacidade</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </TabsList>

            <TabsContent value="consents" className="space-y-4">
              <div className="space-y-4">
                {consents.map((consent) => (
                  <Card key={consent.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">{consent.category}</h3>
                            {consent.required && (
                              <Badge variant="destructive" className="text-xs">
                                Obrigatório
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{consent.description}</p>
                        </div>
                        <Switch
                          checked={consent.enabled}
                          onCheckedChange={(enabled) => updateConsent(consent.id, enabled)}
                          disabled={consent.required}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="requests" className="space-y-4">
              <div className="flex space-x-2 mb-4">
                <Button onClick={requestDataAccess} variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Solicitar Acesso aos Dados
                </Button>
                <Button onClick={requestDataDeletion} variant="outline">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Solicitar Exclusão
                </Button>
              </div>

              <div className="space-y-3">
                {dataRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(request.type)}
                          <div>
                            <p className="font-medium">{request.description}</p>
                            <p className="text-sm text-gray-600">
                              {request.requestDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Política de Privacidade:</strong> Seus dados são processados de acordo com a Lei Geral de Proteção de Dados (LGPD). 
                  Você tem o direito de acessar, corrigir, excluir ou portar seus dados pessoais.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Seus Direitos LGPD</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Direito de acesso aos seus dados</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Direito de correção de dados incorretos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Direito de exclusão de dados</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Direito de portabilidade dos dados</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Direito de revogação do consentimento</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Relatórios de Conformidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Relatório Mensal de Conformidade</p>
                        <p className="text-sm text-gray-600">Janeiro 2024</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Auditoria de Dados</p>
                        <p className="text-sm text-gray-600">Dezembro 2023</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LGPDComplianceCenter;
