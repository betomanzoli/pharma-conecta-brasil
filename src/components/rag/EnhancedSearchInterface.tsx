
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Loader2, BookOpen, Database, Globe } from 'lucide-react';
import { useEnhancedRAG } from '@/hooks/useEnhancedRAG';
import { SearchContext } from '@/services/enhancedRagService';

const EnhancedSearchInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('general');
  const [searchDepth, setSearchDepth] = useState(10);
  const { search, searchByDomain, loading, results, clearResults } = useEnhancedRAG();

  const handleSearch = async () => {
    if (!query.trim()) return;

    const context: SearchContext = {
      domain: selectedDomain,
      search_depth: searchDepth,
      search_preferences: {
        prioritize_recent: true,
        include_metadata: true
      }
    };

    if (selectedDomain === 'general') {
      await search(query, context, searchDepth);
    } else {
      await searchByDomain(query, selectedDomain, searchDepth);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const domains = [
    { id: 'general', name: 'Geral', icon: Globe },
    { id: 'pharma', name: 'Farmacêutico', icon: BookOpen },
    { id: 'regulatory', name: 'Regulatório', icon: Database }
  ];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Digite sua consulta..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-lg"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading || !query.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Buscar
          </Button>
        </div>

        {/* Search Filters */}
        <div className="flex space-x-4 items-center">
          <div className="flex space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground mt-1" />
            <span className="text-sm text-muted-foreground">Domínio:</span>
            {domains.map((domain) => {
              const IconComponent = domain.icon;
              return (
                <Button
                  key={domain.id}
                  variant={selectedDomain === domain.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDomain(domain.id)}
                  className="flex items-center space-x-1"
                >
                  <IconComponent className="h-3 w-3" />
                  <span>{domain.name}</span>
                </Button>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Resultados:</span>
            <Input
              type="number"
              min="5"
              max="50"
              value={searchDepth.toString()}
              onChange={(e) => setSearchDepth(parseInt(e.target.value) || 10)}
              className="w-20"
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <Tabs defaultValue="results" className="space-y-4">
        <TabsList>
          <TabsTrigger value="results">Resultados ({results.length})</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Processando busca semântica...</span>
            </div>
          )}

          {!loading && results.length === 0 && query && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Nenhum resultado encontrado para "{query}"
                </p>
              </CardContent>
            </Card>
          )}

          {results.map((result, index) => (
            <Card key={result.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {result.title || `Resultado ${index + 1}`}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Badge variant="secondary">
                      Score: {(result.similarity_score * 100).toFixed(1)}%
                    </Badge>
                    <Badge variant="outline">{result.source}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {result.content}
                </p>
                
                {result.metadata && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {Object.entries(result.metadata).map(([key, value]) => (
                      <Badge key={key} variant="outline" className="text-xs">
                        {key}: {String(value)}
                      </Badge>
                    ))}
                  </div>
                )}

                {result.source_url && (
                  <div className="mt-4">
                    <a 
                      href={result.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Ver fonte original →
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {results.length > 0 && (
            <div className="text-center pt-4">
              <Button variant="outline" onClick={clearResults}>
                Limpar Resultados
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insights da Busca</CardTitle>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Fontes Principais:</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(results.map(r => r.source))).map(source => (
                        <Badge key={source} variant="secondary">{source}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Relevância Média:</h4>
                    <div className="text-2xl font-bold text-green-600">
                      {(results.reduce((acc, r) => acc + r.similarity_score, 0) / results.length * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Realize uma busca para ver insights detalhados
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSearchInterface;
