import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Zap,
  Brain,
  Target,
  Users,
  Building2,
  FlaskConical,
  GraduationCap,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'query' | 'category' | 'ai_insight';
  category?: string;
  confidence?: number;
  trending?: boolean;
}

interface SmartResult {
  id: string;
  title: string;
  description: string;
  type: 'company' | 'consultant' | 'laboratory' | 'knowledge' | 'ai_match';
  score: number;
  matchReason?: string;
  trending?: boolean;
  verified?: boolean;
  aiInsight?: string;
}

const SmartSearchEngine = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [results, setResults] = useState<SmartResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  
  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { success, error } = useEnhancedToast();

  // Simulação de dados trending
  useEffect(() => {
    setTrendingTopics([
      'ANVISA novas regulamentações',
      'Biotecnologia 2024',
      'Análise microbiológica',
      'Certificação ISO 17025',
      'Medicamentos genéricos'
    ]);

    // Carregar histórico do localStorage
    const saved = localStorage.getItem('search-history');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // Gerar sugestões inteligentes baseadas na query
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const mockSuggestions: SearchSuggestion[] = [
      {
        id: '1',
        text: `${query} - laboratórios especializados`,
        type: 'ai_insight',
        confidence: 0.92,
        category: 'laboratory'
      },
      {
        id: '2',
        text: `Consultores em ${query}`,
        type: 'category',
        category: 'consultant'
      },
      {
        id: '3',
        text: `${query} regulamentações ANVISA`,
        type: 'query',
        trending: true
      },
      {
        id: '4',
        text: `Empresas que trabalham com ${query}`,
        type: 'category',
        category: 'company'
      },
      {
        id: '5',
        text: `Conhecimento sobre ${query}`,
        type: 'category',
        category: 'knowledge'
      }
    ];

    setSuggestions(mockSuggestions);
  }, [query]);

  const performAISearch = async (searchQuery: string) => {
    setIsSearching(true);
    
    try {
      // Simular busca com IA
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockResults: SmartResult[] = [
        {
          id: '1',
          title: 'Lab Biotec Analytics',
          description: 'Laboratório especializado em análises biotecnológicas e microbiológicas',
          type: 'laboratory',
          score: 0.96,
          matchReason: 'Alta compatibilidade com sua busca',
          trending: true,
          verified: true,
          aiInsight: 'Este laboratório tem expertise específica na área que você procura'
        },
        {
          id: '2',
          title: 'Dr. Maria Santos - Consultora Regulatória',
          description: 'Especialista em regulamentações ANVISA com 15+ anos de experiência',
          type: 'consultant',
          score: 0.94,
          matchReason: 'Perfil profissional alinhado',
          verified: true,
          aiInsight: 'Profissional com histórico comprovado em projetos similares'
        },
        {
          id: '3',
          title: 'BioFarma Solutions',
          description: 'Empresa líder em desenvolvimento de medicamentos biotecnológicos',
          type: 'company',
          score: 0.89,
          matchReason: 'Portfólio relevante',
          trending: true,
          verified: true
        },
        {
          id: '4',
          title: 'Análise Microbiológica - Guia Completo',
          description: 'Material técnico sobre metodologias avançadas de análise',
          type: 'knowledge',
          score: 0.87,
          matchReason: 'Conteúdo técnico relevante',
          aiInsight: 'Material atualizado com as últimas normativas'
        },
        {
          id: '5',
          title: 'Match IA: Parceria Estratégica',
          description: 'Nossa IA identificou uma oportunidade de colaboração perfeita',
          type: 'ai_match',
          score: 0.98,
          matchReason: 'Recomendação baseada em IA',
          aiInsight: 'Combinação ideal baseada em análise de compatibilidade'
        }
      ];

      setResults(mockResults);
      
      // Adicionar ao histórico
      if (!searchHistory.includes(searchQuery)) {
        const newHistory = [searchQuery, ...searchHistory.slice(0, 4)];
        setSearchHistory(newHistory);
        localStorage.setItem('search-history', JSON.stringify(newHistory));
      }

      success({
        title: 'Busca concluída!',
        description: `Encontrados ${mockResults.length} resultados relevantes`
      });

    } catch (error) {
      console.error('Erro na busca:', error);
      error({ title: 'Erro na busca', description: 'Não foi possível completar a busca' });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    setShowSuggestions(false);
    performAISearch(searchQuery);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    handleSearch(suggestion.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
        handleSuggestionClick(suggestions[selectedSuggestion]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestion(-1);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'company': return Building2;
      case 'consultant': return GraduationCap;
      case 'laboratory': return FlaskConical;
      case 'knowledge': return Search;
      case 'ai_match': return Brain;
      default: return Target;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'company': return 'bg-blue-500';
      case 'consultant': return 'bg-green-500';
      case 'laboratory': return 'bg-purple-500';
      case 'knowledge': return 'bg-orange-500';
      case 'ai_match': return 'bg-gradient-to-r from-pink-500 to-violet-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de busca inteligente */}
      <Card className="relative">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Busca Inteligente</h2>
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100">
                <Sparkles className="h-3 w-3 mr-1" />
                IA
              </Badge>
            </div>

            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  ref={searchRef}
                  placeholder="Digite sua busca... (ex: laboratórios de biotecnologia)"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(e.target.value.length >= 2);
                    setSelectedSuggestion(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowSuggestions(query.length >= 2)}
                  className="pl-12 pr-12 h-12 text-base"
                />
                {query && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setQuery('');
                      setSuggestions([]);
                      setResults([]);
                      setShowSuggestions(false);
                    }}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  onClick={() => handleSearch()}
                  disabled={!query.trim() || isSearching}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8"
                >
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Sugestões inteligentes */}
              {showSuggestions && suggestions.length > 0 && (
                <Card 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg border"
                >
                  <ScrollArea className="max-h-64">
                    <div className="p-2">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={suggestion.id}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            index === selectedSuggestion 
                              ? 'bg-primary-50 border border-primary-200' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2 flex-1">
                            {suggestion.type === 'ai_insight' && (
                              <Brain className="h-4 w-4 text-purple-500" />
                            )}
                            {suggestion.type === 'category' && (
                              <Target className="h-4 w-4 text-blue-500" />
                            )}
                            {suggestion.type === 'query' && (
                              <Search className="h-4 w-4 text-gray-500" />
                            )}
                            
                            <span className="text-sm">{suggestion.text}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {suggestion.trending && (
                              <Badge variant="secondary" className="text-xs">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                            {suggestion.confidence && (
                              <Badge variant="outline" className="text-xs">
                                {Math.round(suggestion.confidence * 100)}%
                              </Badge>
                            )}
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              )}
            </div>

            {/* Tópicos trending e histórico */}
            {!showSuggestions && !query && (
              <div className="space-y-4">
                {trendingTopics.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Tópicos em alta</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingTopics.map((topic, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setQuery(topic);
                            handleSearch(topic);
                          }}
                          className="text-xs"
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {topic}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {searchHistory.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Buscas recentes</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.map((search, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setQuery(search);
                            handleSearch(search);
                          }}
                          className="text-xs text-muted-foreground"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {search}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resultados inteligentes */}
      {results.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Resultados Inteligentes ({results.length})
                </h3>
                <Badge variant="secondary">
                  <Brain className="h-3 w-3 mr-1" />
                  Ordenado por IA
                </Badge>
              </div>

              <div className="space-y-4">
                {results.map((result) => {
                  const Icon = getTypeIcon(result.type);
                  const typeColor = getTypeColor(result.type);
                  
                  return (
                    <Card key={result.id} className="hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className={`p-2 rounded-lg ${typeColor} bg-opacity-10`}>
                            <Icon className={`h-5 w-5 text-white`} style={{ color: typeColor.replace('bg-', '').replace('gradient-to-r from-', '').replace('to-violet-500', '') }} />
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold">{result.title}</h4>
                              <Badge 
                                variant="outline" 
                                className="text-xs"
                              >
                                {Math.round(result.score * 100)}% match
                              </Badge>
                              {result.trending && (
                                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  Trending
                                </Badge>
                              )}
                              {result.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  Verificado
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground">
                              {result.description}
                            </p>
                            
                            {result.matchReason && (
                              <p className="text-xs text-primary font-medium">
                                💡 {result.matchReason}
                              </p>
                            )}
                            
                            {result.aiInsight && (
                              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border-l-2 border-purple-200">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Brain className="h-4 w-4 text-purple-600" />
                                  <span className="text-xs font-medium text-purple-600">Insight da IA</span>
                                </div>
                                <p className="text-xs text-gray-600">{result.aiInsight}</p>
                              </div>
                            )}
                          </div>
                          
                          <Button size="sm" variant="outline">
                            Ver Detalhes
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartSearchEngine;