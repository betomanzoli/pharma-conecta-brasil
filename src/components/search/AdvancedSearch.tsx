import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Building2, 
  Users, 
  Beaker,
  BookOpen,
  Briefcase,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { toast } from 'sonner';

interface SearchFilters {
  query: string;
  category: string;
  location: string;
  rating: number;
  priceRange: [number, number];
  specialties: string[];
  availability: string;
  experience: string;
  certifications: string[];
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'company' | 'consultant' | 'laboratory' | 'knowledge' | 'project';
  location?: string;
  rating?: number;
  price?: number;
  tags: string[];
  verified?: boolean;
  featured?: boolean;
}

const AdvancedSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    location: '',
    rating: 0,
    priceRange: [0, 1000],
    specialties: [],
    availability: 'any',
    experience: 'any',
    certifications: []
  });

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const categories = [
    { value: 'all', label: 'Todos', icon: Search },
    { value: 'companies', label: 'Empresas', icon: Building2 },
    { value: 'consultants', label: 'Consultores', icon: Users },
    { value: 'laboratories', label: 'Laboratórios', icon: Beaker },
    { value: 'knowledge', label: 'Conhecimento', icon: BookOpen },
    { value: 'projects', label: 'Projetos', icon: Briefcase }
  ];

  const specialties = [
    'Medicamentos Genéricos',
    'Biotecnologia',
    'Regulatório',
    'Fitoterapicos',
    'Cosméticos',
    'Suplementos',
    'Veterinária',
    'Análises Clínicas',
    'Controle de Qualidade',
    'P&D'
  ];

  const certifications = [
    'ANVISA',
    'ISO 9001',
    'ISO 17025',
    'GMP',
    'FINEP',
    'INMETRO',
    'CRF',
    'CRQ'
  ];

  useEffect(() => {
    // Carregar pesquisas recentes do localStorage
    const saved = localStorage.getItem('recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (filters.query) {
      performSearch();
    }
  }, [filters]);

  const performSearch = async () => {
    setLoading(true);
    
    try {
      // Simular busca
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: 'Farmácia Brasileira LTDA',
          description: 'Empresa especializada em medicamentos genéricos e fitoterapicos',
          type: 'company',
          location: 'São Paulo, SP',
          rating: 4.8,
          tags: ['Medicamentos Genéricos', 'Fitoterapicos', 'ANVISA'],
          verified: true,
          featured: true
        },
        {
          id: '2',
          title: 'Dr. Carlos Silva',
          description: 'Consultor regulatório com 15 anos de experiência',
          type: 'consultant',
          location: 'Rio de Janeiro, RJ',
          rating: 4.9,
          price: 150,
          tags: ['Regulatório', 'ANVISA', 'Biotecnologia'],
          verified: true
        },
        {
          id: '3',
          title: 'Lab Análises Plus',
          description: 'Laboratório especializado em controle de qualidade',
          type: 'laboratory',
          location: 'Belo Horizonte, MG',
          rating: 4.7,
          tags: ['Controle de Qualidade', 'ISO 17025', 'Análises'],
          verified: true
        }
      ];

      // Filtrar resultados baseado nos filtros aplicados
      let filteredResults = mockResults;

      if (filters.category !== 'all') {
        filteredResults = filteredResults.filter(r => 
          r.type === filters.category.slice(0, -1) // Remove 's' do final
        );
      }

      if (filters.location) {
        filteredResults = filteredResults.filter(r =>
          r.location?.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      if (filters.rating > 0) {
        filteredResults = filteredResults.filter(r => 
          (r.rating || 0) >= filters.rating
        );
      }

      if (filters.specialties.length > 0) {
        filteredResults = filteredResults.filter(r =>
          filters.specialties.some(spec => r.tags.includes(spec))
        );
      }

      setResults(filteredResults);
      
      // Salvar pesquisa recente
      if (filters.query && !recentSearches.includes(filters.query)) {
        const newRecent = [filters.query, ...recentSearches.slice(0, 4)];
        setRecentSearches(newRecent);
        localStorage.setItem('recent-searches', JSON.stringify(newRecent));
      }

    } catch (error) {
      console.error('Erro na busca:', error);
      toast.error('Erro ao realizar busca');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: 'all',
      location: '',
      rating: 0,
      priceRange: [0, 1000],
      specialties: [],
      availability: 'any',
      experience: 'any',
      certifications: []
    });
    setResults([]);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'company': return 'Empresa';
      case 'consultant': return 'Consultor';
      case 'laboratory': return 'Laboratório';
      case 'knowledge': return 'Conhecimento';
      case 'project': return 'Projeto';
      default: return 'Item';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'company': return 'bg-blue-100 text-blue-800';
      case 'consultant': return 'bg-green-100 text-green-800';
      case 'laboratory': return 'bg-purple-100 text-purple-800';
      case 'knowledge': return 'bg-orange-100 text-orange-800';
      case 'project': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de busca principal */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Busca Avançada</span>
          </CardTitle>
          <CardDescription>
            Encontre empresas, consultores, laboratórios e conhecimento especializado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empresas, consultores, laboratórios..."
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
          </div>

          {/* Busca rápida por categoria */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.value}
                  variant={filters.category === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, category: category.value }))}
                  className="flex items-center space-x-1"
                >
                  <Icon className="h-3 w-3" />
                  <span>{category.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Pesquisas recentes */}
          {recentSearches.length > 0 && !filters.query && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Pesquisas recentes:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, query: search }))}
                    className="text-xs"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filtros avançados */}
      {showFilters && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filtros Avançados</span>
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Localização */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Localização</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cidade, estado..."
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Rating mínimo */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Avaliação mínima</label>
                <Select
                  value={filters.rating.toString()}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, rating: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Qualquer avaliação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Qualquer avaliação</SelectItem>
                    <SelectItem value="3">3+ estrelas</SelectItem>
                    <SelectItem value="4">4+ estrelas</SelectItem>
                    <SelectItem value="5">5 estrelas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Disponibilidade */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Disponibilidade</label>
                <Select
                  value={filters.availability}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, availability: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Qualquer</SelectItem>
                    <SelectItem value="immediate">Imediata</SelectItem>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Especialidades */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Especialidades</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {specialties.map((specialty) => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={specialty}
                      checked={filters.specialties.includes(specialty)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters(prev => ({
                            ...prev,
                            specialties: [...prev.specialties, specialty]
                          }));
                        } else {
                          setFilters(prev => ({
                            ...prev,
                            specialties: prev.specialties.filter(s => s !== specialty)
                          }));
                        }
                      }}
                    />
                    <label
                      htmlFor={specialty}
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      {specialty}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificações */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Certificações</label>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <Badge
                    key={cert}
                    variant={filters.certifications.includes(cert) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (filters.certifications.includes(cert)) {
                        setFilters(prev => ({
                          ...prev,
                          certifications: prev.certifications.filter(c => c !== cert)
                        }));
                      } else {
                        setFilters(prev => ({
                          ...prev,
                          certifications: [...prev.certifications, cert]
                        }));
                      }
                    }}
                  >
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultados */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>
              Resultados {results.length > 0 && `(${results.length})`}
            </CardTitle>
            {filters.query && (
              <p className="text-sm text-muted-foreground">
                Buscando por: "{filters.query}"
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {filters.query ? 'Nenhum resultado encontrado' : 'Digite algo para buscar'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{result.title}</h3>
                          {result.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verificado
                            </Badge>
                          )}
                          {result.featured && (
                            <Badge className="text-xs bg-yellow-100 text-yellow-800">
                              Destaque
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {result.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <Badge 
                            variant="outline" 
                            className={getTypeColor(result.type)}
                          >
                            {getTypeLabel(result.type)}
                          </Badge>
                          
                          {result.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{result.location}</span>
                            </div>
                          )}
                          
                          {result.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>{result.rating}</span>
                            </div>
                          )}
                          
                          {result.price && (
                            <span className="font-medium">
                              R$ {result.price}/hora
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {result.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm">Ver Detalhes</Button>
                        <Button size="sm" variant="outline">Contatar</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedSearch;