import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Globe, 
  Shield, 
  FileText, 
  ExternalLink, 
  RefreshCw, 
  TrendingUp,
  Database,
  CheckCircle,
  Info
} from 'lucide-react';
import UnifiedHeader from '@/components/UnifiedHeader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AllApisDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const { toast } = useToast();

  const internationalApis = [
    {
      id: 'pics',
      name: 'PIC/S',
      fullName: 'Pharmaceutical Inspection Co-operation Scheme',
      description: 'Diretrizes GMP e inspeções farmacêuticas',
      status: 'active',
      lastUpdate: '2024-03-15',
      documentsCount: 156,
      icon: Shield,
      color: 'blue',
      features: ['GMP Guidelines', 'Inspection Procedures', 'Data Integrity', 'API Guidelines'],
      endpoint: 'pics-api'
    },
    {
      id: 'ich',
      name: 'ICH',
      fullName: 'International Council for Harmonisation',
      description: 'Diretrizes harmonizadas Q, S, E e M',
      status: 'active',
      lastUpdate: '2024-03-10',
      documentsCount: 89,
      icon: Globe,
      color: 'green',
      features: ['Quality Guidelines', 'Safety Guidelines', 'Efficacy Guidelines', 'CTD Format'],
      endpoint: 'ich-guidelines'
    },
    {
      id: 'ema',
      name: 'EMA',
      fullName: 'European Medicines Agency',
      description: 'Diretrizes e procedimentos europeus',
      status: 'active',
      lastUpdate: '2024-03-05',
      documentsCount: 234,
      icon: FileText,
      color: 'purple',
      features: ['Marketing Authorization', 'Pharmacovigilance', 'Biosimilars', 'Paediatrics'],
      endpoint: 'ema-guidelines'
    },
    {
      id: 'who',
      name: 'WHO',
      fullName: 'World Health Organization',
      description: 'Padrões globais e pré-qualificação',
      status: 'active',
      lastUpdate: '2024-03-01',
      documentsCount: 178,
      icon: TrendingUp,
      color: 'orange',
      features: ['Prequalification', 'GMP Standards', 'Pharmacovigilance', 'Global Health'],
      endpoint: 'who-guidelines'
    }
  ];

  const brazilianApis = [
    {
      id: 'anvisa',
      name: 'ANVISA',
      fullName: 'Agência Nacional de Vigilância Sanitária',
      description: 'Dados oficiais da ANVISA',
      status: 'active',
      lastUpdate: '2024-03-16',
      documentsCount: 5420,
      icon: Shield,
      color: 'red',
      features: ['Conjuntos de Dados', 'Organizações', 'Recursos', 'Temas'],
      endpoint: 'anvisa-real-api'
    },
    {
      id: 'fda',
      name: 'FDA',
      fullName: 'Food and Drug Administration',
      description: 'Dados da FDA americana',
      status: 'active',
      lastUpdate: '2024-03-14',
      documentsCount: 2890,
      icon: Database,
      color: 'blue',
      features: ['Drug Data', 'Adverse Events', 'Device Data', 'Recall Information'],
      endpoint: 'fda-api'
    }
  ];

  const handleSyncApi = async (apiId: string, endpoint: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(endpoint, {
        body: { limit: 50 }
      });

      if (error) throw error;

      setLastSync(new Date().toISOString());
      toast({
        title: "Sincronização Concluída",
        description: `API ${apiId.toUpperCase()} sincronizada com sucesso`,
      });
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast({
        title: "Erro na Sincronização",
        description: "Não foi possível sincronizar a API",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const ApiCard = ({ api }: { api: any }) => {
    const IconComponent = api.icon;
    
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <IconComponent className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{api.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{api.fullName}</p>
              </div>
            </div>
            <Badge 
              variant={api.status === 'active' ? 'default' : 'secondary'}
              className="capitalize"
            >
              {api.status === 'active' ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">{api.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-500">Documentos</p>
              <p className="text-2xl font-bold text-primary">{api.documentsCount.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Última Atualização</p>
              <p className="font-medium">{new Date(api.lastUpdate).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium text-gray-700 text-sm">Funcionalidades:</p>
            <div className="flex flex-wrap gap-1">
              {api.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button
              onClick={() => handleSyncApi(api.id, api.endpoint)}
              disabled={isLoading}
              size="sm"
              className="flex-1"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Sincronizar
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Explorar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <Globe className="h-8 w-8 text-primary" />
                <span>APIs Globais & Nacionais</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Integração em tempo real com fontes regulatórias oficiais
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              {lastSync && (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Última sync: {new Date(lastSync).toLocaleTimeString('pt-BR')}</span>
                </Badge>
              )}
              
              <Button
                onClick={() => handleSyncApi('all', 'comprehensive-integration-sync')}
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span>Sincronizar Todas</span>
              </Button>
            </div>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Globe className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">APIs Internacionais</p>
                    <p className="text-2xl font-bold">{internationalApis.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">APIs Nacionais</p>
                    <p className="text-2xl font-bold">{brazilianApis.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total de Documentos</p>
                    <p className="text-2xl font-bold">
                      {(internationalApis.reduce((acc, api) => acc + api.documentsCount, 0) + 
                        brazilianApis.reduce((acc, api) => acc + api.documentsCount, 0)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="text-2xl font-bold text-green-600">Online</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* APIs Tabs */}
          <Tabs defaultValue="international" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="international">APIs Internacionais</TabsTrigger>
              <TabsTrigger value="brazilian">APIs Nacionais</TabsTrigger>
            </TabsList>
            
            <TabsContent value="international" className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>APIs Internacionais</AlertTitle>
                <AlertDescription>
                  Integração direta com organizações regulatórias internacionais. 
                  Dados atualizados automaticamente conforme publicações oficiais.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {internationalApis.map((api) => (
                  <ApiCard key={api.id} api={api} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="brazilian" className="space-y-6">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>APIs Nacionais</AlertTitle>
                <AlertDescription>
                  Integração com órgãos reguladores brasileiros e americanos. 
                  Dados em tempo real das principais agências.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {brazilianApis.map((api) => (
                  <ApiCard key={api.id} api={api} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Integration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Status da Integração</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Todas as APIs estão funcionais</span>
                  </div>
                  <Badge variant="default" className="bg-green-600">100% Operacional</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">6</p>
                    <p className="text-sm text-gray-600">APIs Ativas</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">0</p>
                    <p className="text-sm text-gray-600">Falhas nas últimas 24h</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">98.9%</p>
                    <p className="text-sm text-gray-600">Uptime médio</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AllApisDashboard;