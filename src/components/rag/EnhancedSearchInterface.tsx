
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Brain, Database, Zap, Target } from 'lucide-react';
import { useEnhancedRAG } from '@/hooks/useEnhancedRAG';
import { SearchContext } from '@/services/enhancedRagService';

const EnhancedSearchInterface = () => {
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState<SearchContext['domain']>('pharmaceutical');
  const [agentType, setAgentType] = useState('');
  const [searchDepth, setSearchDepth] = useState<SearchContext['search_depth']>('medium');
  
  const { 
    search, 
    searchForAgent, 
    searchByDomain, 
    clearResults,
    refreshKnowledgeBase,
    loading, 
    results, 
    hasResults 
  } = useEnhancedRAG();

  const handleGeneralSearch = () => {
    const context: SearchContext = {
      domain,
      search_depth: searchDepth
    };
    search(query, context);
  };

  const handleAgentSearch = () => {
    if (!agentType) return;
    searchForAgent(query, agentType);
  };

  const handleDomainSearch = () => {
    searchByDomain(query, domain);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGeneralSearch();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Enhanced RAG Search</span>
          </CardTitle>
          <CardDescription>
            Sistema de busca inteligente com contexto semântico avançado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Ex: como criar um business case farmacêutico eficaz..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={handleGeneralSearch} 
                disabled={loading || !query.trim()}
              >
                {loading ? <Zap className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Buscar
              </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">Busca Geral</TabsTrigger>
                <TabsTrigger value="agent">Por Agente</TabsTrigger>
                <TabsTrigger value="domain">Por Domínio</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Domínio</label>
                    <Select value={domain} onValueChange={(value: any) => setDomain(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pharmaceutical">Farmacêutico</SelectItem>
                        <SelectItem value="regulatory">Regulatório</SelectItem>
                        <SelectItem value="business">Negócios</SelectItem>
                        <SelectItem value="technical">Técnico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Profundidade</label>
                    <Select value={searchDepth} onValueChange={(value: any) => setSearchDepth(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shallow">Superficial</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="deep">Profunda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="agent" className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Agente Especializado</label>
                  <Select value={agentType} onValueChange={setAgentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um agente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project_analyst">Project Analyst</SelectItem>
                      <SelectItem value="business_strategist">Business Strategist</SelectItem>
                      <SelectItem value="technical_regulatory">Technical Regulatory</SelectItem>
                      <SelectItem value="document_assistant">Document Assistant</SelectItem>
                      <SelectItem value="coordinator">Coordinator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleAgentSearch} 
                  disabled={loading || !query.trim() || !agentType}
                  className="w-full"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Busca Contextual do Agente
                </Button>
              </TabsContent>

              <TabsContent value="domain" className="space-y-4">
                <Button 
                  onClick={handleDomainSearch} 
                  disabled={loading || !query.trim()}
                  className="w-full"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Busca Especializada por Domínio
                </Button>
              </TabsContent>
            </Tabs>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={clearResults} disabled={!hasResults}>
                Limpar Resultados
              </Button>
              <Button variant="outline" onClick={refreshKnowledgeBase}>
                Atualizar Base
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasResults && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados da Busca ({results.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={result.chunk_id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{result.title}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{result.source_type}</Badge>
                      <Badge variant="outline">
                        {(result.similarity_score * 100).toFixed(1)}% relevância
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3 line-clamp-3">
                    {result.content}
                  </p>
                  {result.source_url && (
                    <a 
                      href={result.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Ver fonte original
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedSearchInterface;
