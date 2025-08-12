
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, Database, Brain, FileSearch, AlertTriangle, TrendingUp } from 'lucide-react';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';

const FederalLearning = () => {
  const [activeTab, setActiveTab] = useState('knowledge');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [integrationData, setIntegrationData] = useState<any[]>([]);
  const { toast } = useToast();
  const { search } = useKnowledgeBase();

  const handleKnowledgeSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await search(searchQuery, 10);
      setSearchResults(results);
      toast({
        title: "Busca concluída",
        description: `${results.length} resultados encontrados`
      });
    } catch (error: any) {
      toast({
        title: "Erro na busca",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePerplexitySearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('perplexity-search', {
        body: {
          query: searchQuery,
          searchType: 'regulatory',
          industry: 'farmacêutico'
        }
      });

      if (error) throw error;

      setSearchResults([{
        chunk_id: 'perplexity-result',
        source_id: 'perplexity',
        title: 'Busca Inteligente com IA',
        source_url: null,
        content: data.content,
        rank: 1
      }]);

      toast({
        title: "Busca IA concluída",
        description: "Resultados gerados com inteligência artificial"
      });
    } catch (error: any) {
      toast({
        title: "Erro na busca IA",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const syncIntegrations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('comprehensive-integration-sync', {
        body: { force_sync: true }
      });

      if (error) throw error;

      setIntegrationData(data?.synced_sources || []);
      toast({
        title: "Sincronização concluída",
        description: `${data?.total_records || 0} registros processados`
      });
    } catch (error: any) {
      toast({
        title: "Erro na sincronização",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Brain className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Federal Learning AI
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Sistema avançado de aprendizado federado para análise regulatória farmacêutica com IA
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="knowledge" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Base de Conhecimento</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Busca Inteligente</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center space-x-2">
              <FileSearch className="h-4 w-4" />
              <span>Integrações</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Busca na Base de Conhecimento</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Buscar na base de conhecimento..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleKnowledgeSearch()}
                  />
                  <Button onClick={handleKnowledgeSearch} disabled={loading}>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Resultados ({searchResults.length})</h3>
                    {searchResults.map((result, index) => (
                      <Card key={result.chunk_id || index} className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-blue-900">{result.title}</h4>
                            {result.rank && (
                              <Badge variant="secondary">Score: {result.rank.toFixed(2)}</Badge>
                            )}
                          </div>
                          <p className="text-gray-700 mb-2">{result.content}</p>
                          {result.source_url && (
                            <a 
                              href={result.source_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              Ver fonte →
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Intelligent Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Busca Inteligente com IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Faça uma pergunta sobre regulamentação farmacêutica..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePerplexitySearch()}
                  />
                  <Button onClick={handlePerplexitySearch} disabled={loading}>
                    <Brain className="h-4 w-4 mr-2" />
                    Buscar com IA
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 border-dashed border-2 border-gray-300 hover:border-blue-400 cursor-pointer"
                        onClick={() => setSearchQuery('Últimas atualizações ANVISA 2024')}>
                    <div className="text-center">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                      <p className="text-sm font-medium">Alertas ANVISA</p>
                    </div>
                  </Card>
                  
                  <Card className="p-4 border-dashed border-2 border-gray-300 hover:border-blue-400 cursor-pointer"
                        onClick={() => setSearchQuery('Boas práticas de fabricação medicamentos')}>
                    <div className="text-center">
                      <FileSearch className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm font-medium">BPF Guidelines</p>
                    </div>
                  </Card>
                  
                  <Card className="p-4 border-dashed border-2 border-gray-300 hover:border-blue-400 cursor-pointer"
                        onClick={() => setSearchQuery('Registro de medicamentos genéricos')}>
                    <div className="text-center">
                      <Database className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <p className="text-sm font-medium">Registros</p>
                    </div>
                  </Card>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    {searchResults.map((result, index) => (
                      <Card key={index} className="border-l-4 border-l-green-500">
                        <CardContent className="pt-4">
                          <h4 className="font-semibold text-green-900 mb-2">{result.title}</h4>
                          <div className="prose max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap">{result.content}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileSearch className="h-5 w-5" />
                  <span>Integrações de Dados</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={syncIntegrations} disabled={loading} className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  {loading ? 'Sincronizando...' : 'Sincronizar Todas as Fontes'}
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Database className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold">ANVISA</h3>
                      <p className="text-sm text-gray-600">Dados regulatórios brasileiros</p>
                      <Badge variant="default" className="mt-2">Ativo</Badge>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Database className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold">FDA</h3>
                      <p className="text-sm text-gray-600">Dados regulatórios americanos</p>
                      <Badge variant="default" className="mt-2">Ativo</Badge>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Database className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold">PubMed</h3>
                      <p className="text-sm text-gray-600">Publicações científicas</p>
                      <Badge variant="default" className="mt-2">Ativo</Badge>
                    </div>
                  </Card>
                </div>

                {integrationData.length > 0 && (
                  <Card className="mt-4">
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-2">Última Sincronização</h4>
                      <div className="space-y-2">
                        {integrationData.map((source, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="capitalize">{source}</span>
                            <Badge variant="outline">Sincronizado</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <Database className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Documentos</p>
                      <div className="text-2xl font-bold">1,234</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <Search className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Buscas</p>
                      <div className="text-2xl font-bold">567</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Alertas</p>
                      <div className="text-2xl font-bold">23</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Precisão</p>
                      <div className="text-2xl font-bold">94%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Status do Sistema Federal Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Embeddings Vetoriais</span>
                    <Badge variant="default">Operacional</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Busca Semântica</span>
                    <Badge variant="default">Operacional</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>IA Perplexity</span>
                    <Badge variant="default">Operacional</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sincronização de Dados</span>
                    <Badge variant="default">Operacional</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FederalLearning;
