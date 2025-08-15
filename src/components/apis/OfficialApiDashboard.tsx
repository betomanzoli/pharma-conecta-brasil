
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, RefreshCw, Database, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useOfficialApis } from '@/hooks/useOfficialApis';

const OfficialApiDashboard = () => {
  const [query, setQuery] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>(['anvisa', 'fda', 'pubmed']);
  
  const { 
    searchOfficial, 
    loadSources, 
    syncAllSources,
    clearResults,
    loading, 
    syncing,
    results, 
    sources,
    hasResults,
    hasActiveSources
  } = useOfficialApis();

  useEffect(() => {
    loadSources();
  }, [loadSources]);

  const handleSearch = () => {
    searchOfficial(query, selectedSources);
  };

  const handleSourceToggle = (sourceName: string, checked: boolean) => {
    if (checked) {
      setSelectedSources(prev => [...prev, sourceName.toLowerCase()]);
    } else {
      setSelectedSources(prev => prev.filter(s => s !== sourceName.toLowerCase()));
    }
  };

  const getSourceIcon = (available: boolean) => {
    return available ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getSourceBadgeVariant = (source: string) => {
    switch (source) {
      case 'anvisa': return 'default';
      case 'fda': return 'secondary';
      case 'pubmed': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>APIs Oficiais</span>
          </CardTitle>
          <CardDescription>
            Busca integrada em fontes oficiais: ANVISA, FDA, PubMed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Buscar</TabsTrigger>
              <TabsTrigger value="sources">Fontes</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Ex: medicamentos oncológicos, recalls FDA..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={loading || !query.trim() || selectedSources.length === 0}
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Buscar
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fontes Selecionadas:</label>
                <div className="flex flex-wrap gap-3">
                  {sources.map((source) => (
                    <div key={source.name} className="flex items-center space-x-2">
                      <Checkbox
                        id={source.name}
                        checked={selectedSources.includes(source.name.toLowerCase())}
                        onCheckedChange={(checked) => 
                          handleSourceToggle(source.name, checked as boolean)
                        }
                        disabled={!source.available}
                      />
                      <label 
                        htmlFor={source.name} 
                        className="text-sm font-medium flex items-center space-x-1"
                      >
                        {getSourceIcon(source.available)}
                        <span>{source.name}</span>
                        {source.total_records && (
                          <Badge variant="outline" className="ml-1">
                            {source.total_records.toLocaleString()}
                          </Badge>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={clearResults} disabled={!hasResults}>
                  Limpar Resultados
                </Button>
                <Button 
                  variant="outline" 
                  onClick={syncAllSources}
                  disabled={syncing}
                >
                  {syncing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Sincronizar Dados
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="sources" className="space-y-4">
              <div className="grid gap-4">
                {sources.map((source) => (
                  <Card key={source.name} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getSourceIcon(source.available)}
                        <div>
                          <h3 className="font-semibold">{source.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Prioridade: {source.priority} | Registros: {source.total_records?.toLocaleString() || 0}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={source.available ? 'default' : 'destructive'}>
                          {source.available ? 'Ativa' : 'Inativa'}
                        </Badge>
                        {source.last_sync && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(source.last_sync).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {hasResults && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados Oficiais ({results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={result.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{result.title}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getSourceBadgeVariant(result.source)}>
                        {result.source.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {(result.relevance_score * 100).toFixed(0)}% relevância
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3 line-clamp-3">
                    {result.content}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {new Date(result.publishedAt).toLocaleDateString()}
                    </span>
                    {result.url && (
                      <a 
                        href={result.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Ver fonte original
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OfficialApiDashboard;
