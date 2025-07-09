import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Database, 
  RefreshCw, 
  Building2, 
  FileText, 
  Users, 
  Recycle,
  Download,
  ExternalLink,
  Calendar,
  Tag,
  Search
} from 'lucide-react';
import { AnvisaRealApiService } from '@/services/anvisaRealApiService';
import { useToast } from '@/hooks/use-toast';

const AnvisaRealDataDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [estatisticas, setEstatisticas] = useState({
    total_conjuntos: 0,
    total_organizacoes: 0,
    total_reusos: 0,
    total_observancia: 0
  });
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [conjuntosDados, setConjuntosDados] = useState<any[]>([]);
  const [organizacoes, setOrganizacoes] = useState<any[]>([]);
  const [reusos, setReusos] = useState<any[]>([]);
  const [observancia, setObservancia] = useState<any[]>([]);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [stats, status] = await Promise.all([
        AnvisaRealApiService.getEstatisticas(),
        AnvisaRealApiService.getApiStatus()
      ]);
      
      setEstatisticas(stats);
      setApiStatus(status);
      
      // Carregar dados iniciais
      await loadTabData('conjuntos');
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados iniciais",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTabData = async (tab: string) => {
    try {
      const filters = {
        search: searchTerm || undefined,
        categoria: categoryFilter || undefined,
        status: statusFilter || undefined,
        limit: 50
      };

      switch (tab) {
        case 'conjuntos':
          const conjuntosData = await AnvisaRealApiService.getConjuntosDados(filters);
          setConjuntosDados(conjuntosData);
          break;
        case 'organizacoes':
          const organizacoesData = await AnvisaRealApiService.getOrganizacoes(filters);
          setOrganizacoes(organizacoesData);
          break;
        case 'reusos':
          const reusosData = await AnvisaRealApiService.getReusos(filters);
          setReusos(reusosData);
          break;
        case 'observancia':
          const observanciaData = await AnvisaRealApiService.getObservanciaLegal(filters);
          setObservancia(observanciaData);
          break;
      }
    } catch (error) {
      console.error(`Erro ao carregar dados da aba ${tab}:`, error);
    }
  };

  const handleSyncAll = async () => {
    setSyncLoading(true);
    try {
      const result = await AnvisaRealApiService.syncAllData();
      
      toast({
        title: "Sincronização Completa",
        description: `${result.total_synced} registros sincronizados com sucesso`,
      });
      
      // Recarregar dados
      await loadInitialData();
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast({
        title: "Erro na Sincronização",
        description: "Não foi possível sincronizar os dados da ANVISA",
        variant: "destructive"
      });
    } finally {
      setSyncLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Carregando dados da ANVISA...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">ANVISA - Dados Oficiais</h2>
          <p className="text-muted-foreground">
            Integração direta com dados.gov.br - API CKAN
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {apiStatus && (
            <Badge variant={apiStatus.is_active ? 'default' : 'secondary'}>
              {apiStatus.is_active ? 'Ativo' : 'Inativo'}
            </Badge>
          )}
          <Button
            onClick={handleSyncAll}
            disabled={syncLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${syncLoading ? 'animate-spin' : ''}`} />
            <span>Sincronizar Tudo</span>
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conjuntos de Dados</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total_conjuntos}</div>
            <p className="text-xs text-muted-foreground">
              Datasets disponíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizações</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total_organizacoes}</div>
            <p className="text-xs text-muted-foreground">
              Órgãos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reusos</CardTitle>
            <Recycle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total_reusos}</div>
            <p className="text-xs text-muted-foreground">
              Projetos de reuso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Observância Legal</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total_observancia}</div>
            <p className="text-xs text-muted-foreground">
              Normas e regulamentos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status da API */}
      {apiStatus && (
        <Alert>
          <Database className="h-4 w-4" />
          <AlertTitle>Status da API</AlertTitle>
          <AlertDescription>
            Última sincronização: {apiStatus.last_sync ? formatDate(apiStatus.last_sync) : 'Nunca'} |
            Frequência: {apiStatus.sync_frequency_hours}h |
            Endpoint: {apiStatus.base_url}
          </AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            <SelectItem value="saude">Saúde</SelectItem>
            <SelectItem value="medicamentos">Medicamentos</SelectItem>
            <SelectItem value="alimentos">Alimentos</SelectItem>
            <SelectItem value="cosmeticos">Cosméticos</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          onClick={() => loadTabData('conjuntos')}
          className="flex items-center space-x-2"
        >
          <Search className="h-4 w-4" />
          <span>Filtrar</span>
        </Button>
      </div>

      {/* Tabs com dados */}
      <Tabs defaultValue="conjuntos" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conjuntos" onClick={() => loadTabData('conjuntos')}>
            Conjuntos de Dados
          </TabsTrigger>
          <TabsTrigger value="organizacoes" onClick={() => loadTabData('organizacoes')}>
            Organizações
          </TabsTrigger>
          <TabsTrigger value="reusos" onClick={() => loadTabData('reusos')}>
            Reusos
          </TabsTrigger>
          <TabsTrigger value="observancia" onClick={() => loadTabData('observancia')}>
            Observância Legal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conjuntos" className="space-y-4">
          {conjuntosDados.map((conjunto) => (
            <Card key={conjunto.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{conjunto.titulo}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {conjunto.descricao}
                    </p>
                  </div>
                  <Badge variant={conjunto.status === 'ativo' ? 'default' : 'secondary'}>
                    {conjunto.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <strong>Organização:</strong>
                    <p>{conjunto.organizacao || 'N/A'}</p>
                  </div>
                  <div>
                    <strong>Categoria:</strong>
                    <p>{conjunto.categoria || 'N/A'}</p>
                  </div>
                  <div>
                    <strong>Recursos:</strong>
                    <p>{conjunto.recursos_count} arquivos</p>
                  </div>
                  <div>
                    <strong>Atualizado:</strong>
                    <p>{formatDate(conjunto.data_atualizacao)}</p>
                  </div>
                </div>
                
                {conjunto.tags && conjunto.tags.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4" />
                      <span className="text-sm font-medium">Tags:</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {conjunto.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {conjunto.anvisa_recurso && conjunto.anvisa_recurso.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Recursos:</h4>
                    <div className="space-y-2">
                      {conjunto.anvisa_recurso.slice(0, 3).map((recurso: any) => (
                        <div key={recurso.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <p className="text-sm font-medium">{recurso.nome}</p>
                            <p className="text-xs text-gray-500">
                              {recurso.formato} • {formatFileSize(recurso.tamanho_bytes)}
                            </p>
                          </div>
                          {recurso.url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={recurso.url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </a>
                            </Button>
                          )}
                        </div>
                      ))}
                      {conjunto.anvisa_recurso.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{conjunto.anvisa_recurso.length - 3} recursos adicionais
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="organizacoes" className="space-y-4">
          {organizacoes.map((org) => (
            <Card key={org.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{org.nome}</CardTitle>
                    {org.sigla && (
                      <Badge variant="outline" className="mt-1">
                        {org.sigla}
                      </Badge>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">
                      {org.descricao}
                    </p>
                  </div>
                  <Badge variant={org.status === 'ativo' ? 'default' : 'secondary'}>
                    {org.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Tipo:</strong>
                    <p>{org.tipo_organizacao || 'N/A'}</p>
                  </div>
                  <div>
                    <strong>Esfera:</strong>
                    <p>{org.esfera || 'N/A'}</p>
                  </div>
                  <div>
                    <strong>Email:</strong>
                    <p>{org.email || 'N/A'}</p>
                  </div>
                </div>
                
                {org.site && (
                  <div className="mt-4">
                    <Button size="sm" variant="outline" asChild>
                      <a href={org.site} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Site Oficial
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reusos" className="space-y-4">
          {reusos.map((reuso) => (
            <Card key={reuso.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{reuso.titulo}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {reuso.descricao}
                    </p>
                  </div>
                  <Badge variant={reuso.status === 'ativo' ? 'default' : 'secondary'}>
                    {reuso.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <strong>Autor:</strong>
                    <p>{reuso.autor || 'N/A'}</p>
                  </div>
                  <div>
                    <strong>Organização:</strong>
                    <p>{reuso.organizacao_autor || 'N/A'}</p>
                  </div>
                  <div>
                    <strong>Tipo:</strong>
                    <p>{reuso.tipo_reuso || 'N/A'}</p>
                  </div>
                  <div>
                    <strong>Categoria:</strong>
                    <p>{reuso.categoria || 'N/A'}</p>
                  </div>
                </div>
                
                {reuso.url_reuso && (
                  <div className="mt-4">
                    <Button size="sm" variant="outline" asChild>
                      <a href={reuso.url_reuso} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Ver Reuso
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="observancia" className="space-y-4">
          {observancia.map((obs) => (
            <Card key={obs.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{obs.titulo}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {obs.descricao}
                    </p>
                  </div>
                  <Badge variant={obs.status === 'ativo' ? 'default' : 'secondary'}>
                    {obs.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Tipo:</strong>
                    <p>{obs.tipo_observancia || 'N/A'}</p>
                  </div>
                  <div>
                    <strong>Norma:</strong>
                    <p>{obs.norma_legal || 'N/A'}</p>
                  </div>
                  <div>
                    <strong>Vigência:</strong>
                    <p>{formatDate(obs.data_vigencia)}</p>
                  </div>
                </div>
                
                {obs.url_norma && (
                  <div className="mt-4">
                    <Button size="sm" variant="outline" asChild>
                      <a href={obs.url_norma} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Ver Norma
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnvisaRealDataDashboard;