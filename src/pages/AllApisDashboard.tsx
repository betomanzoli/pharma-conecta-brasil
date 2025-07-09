import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Database, 
  RefreshCw, 
  Globe, 
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  ExternalLink,
  BarChart3,
  Flag
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import AnvisaRealDataDashboard from '@/components/pharmaceutical/AnvisaRealDataDashboard';
import { AnvisaRealApiService } from '@/services/anvisaRealApiService';
import { FdaApiService } from '@/services/fdaApiService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AllApisDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [apiConfigurations, setApiConfigurations] = useState<any[]>([]);
  const [fdaStats, setFdaStats] = useState({
    total_drugs: 0,
    total_adverse_events: 0,
    total_food_enforcement: 0,
    total_device_events: 0
  });

  useEffect(() => {
    loadApiConfigurations();
    loadFdaStats();
  }, []);

  const loadApiConfigurations = async () => {
    try {
      const { data, error } = await supabase
        .from('api_configurations')
        .select('*')
        .order('integration_name');

      if (error) throw error;
      setApiConfigurations(data || []);
    } catch (error) {
      console.error('Erro ao carregar configurações de API:', error);
    }
  };

  const loadFdaStats = async () => {
    try {
      const stats = await FdaApiService.getEstatisticas();
      setFdaStats(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas FDA:', error);
    }
  };

  const syncApiData = async (integrationName: string) => {
    setLoading(true);
    try {
      let result;
      
      switch (integrationName) {
        case 'anvisa_dados_gov_br':
          result = await AnvisaRealApiService.syncAllData();
          break;
        case 'fda_api':
          result = await FdaApiService.syncAllData();
          break;
        default:
          throw new Error(`Sincronização não implementada para ${integrationName}`);
      }

      toast({
        title: "Sincronização Completa",
        description: `API ${integrationName} sincronizada com sucesso`,
      });

      // Recarregar dados
      await loadApiConfigurations();
      await loadFdaStats();
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast({
        title: "Erro na Sincronização",
        description: `Falha ao sincronizar ${integrationName}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getApiCategoryIcon = (name: string) => {
    if (name.includes('anvisa') || name.includes('brasil')) return <Flag className="h-4 w-4 text-green-500" />;
    if (name.includes('fda')) return <Globe className="h-4 w-4 text-blue-500" />;
    if (name.includes('receita') || name.includes('finep') || name.includes('inpi')) return <Flag className="h-4 w-4 text-yellow-500" />;
    return <Database className="h-4 w-4 text-gray-500" />;
  };

  const getApiCategoryName = (name: string) => {
    if (name.includes('anvisa') || name.includes('brasil')) return 'Brasil';
    if (name.includes('fda')) return 'FDA (EUA)';
    if (name.includes('receita') || name.includes('finep') || name.includes('inpi')) return 'Gov Brasil';
    return 'Outros';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const brasileiraApis = apiConfigurations.filter(api => 
    api.integration_name.includes('anvisa') || 
    api.integration_name.includes('receita') || 
    api.integration_name.includes('finep') ||
    api.integration_name.includes('inpi') ||
    api.integration_name.includes('bndes') ||
    api.integration_name.includes('brasil')
  );

  const internacionaisApis = apiConfigurations.filter(api => 
    api.integration_name.includes('fda') ||
    api.integration_name.includes('ema') ||
    api.integration_name.includes('ich')
  );

  const outrasApis = apiConfigurations.filter(api => 
    !brasileiraApis.includes(api) && !internacionaisApis.includes(api)
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Central de APIs</h1>
              <p className="text-muted-foreground">
                Gerenciamento e monitoramento de todas as integrações de APIs
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="flex items-center space-x-1">
                <Database className="h-3 w-3" />
                <span>{apiConfigurations.length} APIs</span>
              </Badge>
            </div>
          </div>

          {/* Resumo geral */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">APIs Brasileiras</CardTitle>
                <Flag className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{brasileiraApis.length}</div>
                <p className="text-xs text-muted-foreground">
                  {brasileiraApis.filter(api => api.is_active).length} ativas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">APIs Internacionais</CardTitle>
                <Globe className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{internacionaisApis.length}</div>
                <p className="text-xs text-muted-foreground">
                  {internacionaisApis.filter(api => api.is_active).length} ativas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">FDA - Medicamentos</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fdaStats.total_drugs}</div>
                <p className="text-xs text-muted-foreground">
                  Registros sincronizados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Última Sincronização</CardTitle>
                <Clock className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Hoje</div>
                <p className="text-xs text-muted-foreground">
                  Dados atualizados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs com diferentes categorias */}
          <Tabs defaultValue="brasileiras" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="brasileiras">APIs Brasileiras</TabsTrigger>
              <TabsTrigger value="internacionais">APIs Internacionais</TabsTrigger>
              <TabsTrigger value="anvisa-dados">ANVISA Dados</TabsTrigger>
              <TabsTrigger value="fda-dados">FDA Dados</TabsTrigger>
            </TabsList>

            <TabsContent value="brasileiras" className="space-y-4">
              <div className="grid gap-4">
                {brasileiraApis.map((api) => (
                  <Card key={api.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getApiCategoryIcon(api.integration_name)}
                          <div>
                            <CardTitle className="text-lg">{api.integration_name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{api.base_url}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant={api.is_active ? 'default' : 'secondary'}>
                            {api.is_active ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Ativa
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Inativa
                              </>
                            )}
                          </Badge>
                          
                          <Button
                            size="sm"
                            onClick={() => syncApiData(api.integration_name)}
                            disabled={loading || !api.is_active}
                            className="flex items-center space-x-1"
                          >
                            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                            <span>Sincronizar</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <strong>Frequência:</strong>
                          <p>{api.sync_frequency_hours}h</p>
                        </div>
                        <div>
                          <strong>Última Sync:</strong>
                          <p>{formatDate(api.last_sync)}</p>
                        </div>
                        <div>
                          <strong>Categoria:</strong>
                          <p>{getApiCategoryName(api.integration_name)}</p>
                        </div>
                        <div>
                          <strong>Atualizado:</strong>
                          <p>{formatDate(api.updated_at)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="internacionais" className="space-y-4">
              <div className="grid gap-4">
                {internacionaisApis.map((api) => (
                  <Card key={api.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getApiCategoryIcon(api.integration_name)}
                          <div>
                            <CardTitle className="text-lg">{api.integration_name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{api.base_url}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant={api.is_active ? 'default' : 'secondary'}>
                            {api.is_active ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Ativa
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Inativa
                              </>
                            )}
                          </Badge>
                          
                          <Button
                            size="sm"
                            onClick={() => syncApiData(api.integration_name)}
                            disabled={loading || !api.is_active}
                            className="flex items-center space-x-1"
                          >
                            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                            <span>Sincronizar</span>
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                          >
                            <a href={api.base_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <strong>Frequência:</strong>
                          <p>{api.sync_frequency_hours}h</p>
                        </div>
                        <div>
                          <strong>Última Sync:</strong>
                          <p>{formatDate(api.last_sync)}</p>
                        </div>
                        <div>
                          <strong>Categoria:</strong>
                          <p>{getApiCategoryName(api.integration_name)}</p>
                        </div>
                        <div>
                          <strong>Atualizado:</strong>
                          <p>{formatDate(api.updated_at)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="anvisa-dados">
              <AnvisaRealDataDashboard />
            </TabsContent>

            <TabsContent value="fda-dados" className="space-y-4">
              <Alert>
                <Database className="h-4 w-4" />
                <AlertTitle>FDA - Food and Drug Administration</AlertTitle>
                <AlertDescription>
                  Dados oficiais da FDA americana incluindo medicamentos, eventos adversos, 
                  recalls de alimentos e eventos de dispositivos médicos.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Medicamentos</CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{fdaStats.total_drugs}</div>
                    <p className="text-xs text-muted-foreground">
                      Registros FDA
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Eventos Adversos</CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{fdaStats.total_adverse_events}</div>
                    <p className="text-xs text-muted-foreground">
                      Reportes de segurança
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Recalls Alimentos</CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{fdaStats.total_food_enforcement}</div>
                    <p className="text-xs text-muted-foreground">
                      Recalls ativos
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Dispositivos</CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{fdaStats.total_device_events}</div>
                    <p className="text-xs text-muted-foreground">
                      Eventos de dispositivos
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Sincronização FDA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Última sincronização: {formatDate(apiConfigurations.find(api => api.integration_name === 'fda_api')?.last_sync)}
                      </p>
                    </div>
                    <Button
                      onClick={() => syncApiData('fda_api')}
                      disabled={loading}
                      className="flex items-center space-x-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                      <span>Sincronizar FDA</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AllApisDashboard;