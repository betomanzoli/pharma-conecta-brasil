
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Database, FileText, Star, Download, BookOpen } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import KnowledgeIngestButton from '@/components/knowledge/KnowledgeIngestButton';

const KnowledgeLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [knowledgeSources, setKnowledgeSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadKnowledgeSources();
  }, []);

  const loadKnowledgeSources = async () => {
    try {
      const { data, error } = await supabase
        .from('knowledge_sources')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setKnowledgeSources(data || []);
    } catch (error) {
      console.error('Error loading knowledge sources:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: 'Digite um termo de busca',
        description: 'Insira uma palavra-chave para pesquisar',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('rag_search', {
        p_query: searchTerm,
        p_top_k: 10
      });

      if (error) throw error;
      setSearchResults(data || []);
      
      if (data && data.length === 0) {
        toast({
          title: 'Nenhum resultado encontrado',
          description: 'Tente usar termos diferentes ou mais específicos'
        });
      }
    } catch (error) {
      console.error('Error in RAG search:', error);
      toast({
        title: 'Erro na busca',
        description: 'Não foi possível realizar a pesquisa',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <Database className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Biblioteca de Conhecimento</h1>
                <p className="text-muted-foreground">
                  Base curada com RAG para busca inteligente de conteúdo farmacêutico
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="search" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search">Busca RAG</TabsTrigger>
              <TabsTrigger value="sources">Fontes</TabsTrigger>
              <TabsTrigger value="ingest">Ingerir Conteúdo</TabsTrigger>
            </TabsList>

            <TabsContent value="search">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5" />
                    <span>Busca Inteligente (RAG)</span>
                  </CardTitle>
                  <CardDescription>
                    Pesquise no conhecimento curado com IA semântica
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ex: business case farmacêutico, análise SWOT, CTD módulo 2..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button onClick={handleSearch} disabled={loading}>
                      {loading ? 'Buscando...' : 'Buscar'}
                    </Button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Resultados da Busca</h3>
                      {searchResults.map((result: any) => (
                        <Card key={result.chunk_id} className="border-l-4 border-l-blue-500">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-base">{result.title}</CardTitle>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="outline">{result.source_url?.split('/').pop()}</Badge>
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-3 w-3 text-yellow-500" />
                                    <span className="text-xs">{(result.rank * 100).toFixed(1)}% relevância</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                              {result.content}
                            </p>
                            <Button variant="outline" size="sm">
                              <FileText className="h-3 w-3 mr-2" />
                              Ver Completo
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sources">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Fontes de Conhecimento</span>
                  </CardTitle>
                  <CardDescription>
                    Templates e documentos disponíveis na base de conhecimento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {knowledgeSources.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma fonte encontrada</p>
                      <p className="text-sm">Use a aba "Ingerir Conteúdo" para adicionar templates</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {knowledgeSources.map((source: any) => (
                        <Card key={source.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">{source.title}</CardTitle>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="text-xs">
                                {source.source_type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(source.created_at).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <Button variant="outline" size="sm" className="w-full">
                              <Download className="h-3 w-3 mr-2" />
                              Acessar
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ingest">
              <KnowledgeIngestButton />
            </TabsContent>
          </Tabs>

          <Alert className="mt-6">
            <Database className="h-4 w-4" />
            <AlertDescription>
              <strong>Biblioteca de Conhecimento RAG:</strong> Esta base utiliza Retrieval-Augmented 
              Generation para busca semântica inteligente em conteúdo farmacêutico especializado. 
              Ideal para consulta rápida de templates, frameworks e best practices.
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default KnowledgeLibrary;
