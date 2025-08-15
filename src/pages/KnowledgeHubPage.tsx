
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Upload, 
  Search, 
  FileText, 
  MessageCircle,
  Sparkles,
  Database,
  ExternalLink
} from 'lucide-react';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useMasterChatBridge } from '@/hooks/useMasterChatBridge';
import { useToast } from '@/hooks/use-toast';

const KnowledgeHubPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);

  const { ingest } = useKnowledgeBase();
  const { setBridgeData } = useMasterChatBridge();
  const { toast } = useToast();

  const handleIngest = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e conteúdo são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsIngesting(true);
    try {
      await ingest({
        title,
        content,
        source_url: url || undefined,
        source_type: 'manual'
      });

      toast({
        title: "Conhecimento adicionado!",
        description: "Conteúdo foi indexado e está disponível para busca",
      });

      // Limpar formulário
      setTitle('');
      setContent('');
      setUrl('');
    } catch (error) {
      toast({
        title: "Erro na indexação",
        description: "Não foi possível adicionar o conhecimento",
        variant: "destructive"
      });
    } finally {
      setIsIngesting(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await fetch('/api/kb-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, limit: 10 })
      }).then(res => res.json());

      setSearchResults(results.chunks || []);
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Não foi possível realizar a busca",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const sendToMasterChat = (context: string) => {
    setBridgeData({
      context,
      suggested_prompts: [
        "Explique este conteúdo de forma didática",
        "Quais são os pontos principais?",
        "Como isso se aplica ao meu negócio?",
        "Gere um resumo executivo"
      ]
    });

    toast({
      title: "Contexto enviado!",
      description: "Abra o Master Chat para continuar a conversa",
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <Brain className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Knowledge Hub</h1>
            <p className="text-muted-foreground">Base de conhecimento inteligente com RAG</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Buscar Conhecimento</span>
          </TabsTrigger>
          <TabsTrigger value="ingest" className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Adicionar Conhecimento</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Busca Semântica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite sua pergunta ou termo de busca..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button 
                    onClick={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {isSearching ? 'Buscando...' : 'Buscar'}
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Resultados encontrados:</h3>
                    {searchResults.map((result, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{result.title || 'Sem título'}</h4>
                            <Badge variant="outline">
                              Score: {(result.similarity * 100).toFixed(1)}%
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {result.content?.substring(0, 200)}...
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => sendToMasterChat(result.content)}
                            >
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Enviar para Chat
                            </Button>
                            {result.source_url && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(result.source_url, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Ver Fonte
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {searchQuery && searchResults.length === 0 && !isSearching && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum resultado encontrado para "{searchQuery}"</p>
                    <p className="text-sm">Tente termos diferentes ou adicione mais conteúdo à base</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ingest" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Adicionar Novo Conhecimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Título *</label>
                  <Input
                    placeholder="Ex: Registro de medicamentos na ANVISA"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Conteúdo *</label>
                  <Textarea
                    placeholder="Descreva o conhecimento, processo, regulamentação ou informação relevante..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">URL de Referência (opcional)</label>
                  <Input
                    placeholder="https://exemplo.com/documento"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleIngest}
                  disabled={isIngesting || !title.trim() || !content.trim()}
                  className="w-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isIngesting ? 'Indexando...' : 'Adicionar à Base de Conhecimento'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Dicas para Melhor Indexação</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Use títulos descritivos e específicos</li>
                <li>• Inclua termos técnicos e sinônimos relevantes</li>
                <li>• Estruture o conteúdo com subtópicos quando possível</li>
                <li>• Adicione contexto sobre quando e como aplicar a informação</li>
                <li>• Referencie fontes oficiais quando disponível</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeHubPage;
