
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, MapPin, Calendar, Building2, Wrench, FlaskConical } from "lucide-react";

interface AdvancedSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
}

const AdvancedSearch = ({ searchTerm, setSearchTerm, activeFilters, setActiveFilters }: AdvancedSearchProps) => {
  const filterCategories = {
    location: ["São Paulo", "Rio de Janeiro", "Brasília", "Belo Horizonte", "Porto Alegre"],
    serviceType: ["Análises", "Consultoria", "Equipamentos", "Validação", "Treinamento"],
    certification: ["ISO 17025", "GMP", "FDA", "ANVISA", "ICH"],
    capacity: ["Disponível", "Limitada", "Sob Consulta"],
    budget: ["< R$ 10k", "R$ 10k-50k", "R$ 50k-100k", "> R$ 100k"],
    timeline: ["Urgente (< 1 semana)", "Rápido (1-4 semanas)", "Normal (1-3 meses)", "Longo Prazo (> 3 meses)"]
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(
      activeFilters.includes(filter)
        ? activeFilters.filter(f => f !== filter)
        : [...activeFilters, filter]
    );
  };

  const clearFilters = () => {
    setActiveFilters([]);
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        {/* Main Search Bar */}
        <div className="flex space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar serviços, equipamentos, especialidades, empresas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="bg-primary hover:bg-primary-600">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros Avançados
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Filtros Rápidos</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filterCategories).map(([category, filters]) => (
              <div key={category} className="flex flex-wrap gap-1">
                {filters.slice(0, 3).map((filter) => (
                  <Badge
                    key={filter}
                    variant={activeFilters.includes(filter) ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                    onClick={() => toggleFilter(filter)}
                  >
                    {filter}
                  </Badge>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm text-gray-600">Filtros ativos:</span>
            {activeFilters.map((filter) => (
              <Badge key={filter} variant="outline" className="bg-blue-50 text-blue-700">
                {filter}
                <button
                  onClick={() => toggleFilter(filter)}
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpar todos
            </Button>
          </div>
        )}

        {/* Advanced Search Tabs */}
        <Tabs defaultValue="general" className="mt-4">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="laboratory">Laboratório</TabsTrigger>
            <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
            <TabsTrigger value="consulting">Consultoria</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Localização</label>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <Input placeholder="Cidade, Estado ou CEP" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Prazo</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <Input placeholder="Data limite" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Orçamento</label>
                <Input placeholder="Faixa de preço" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="laboratory" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tipo de Análise</label>
                <div className="flex items-center space-x-2">
                  <FlaskConical className="h-4 w-4 text-gray-400" />
                  <Input placeholder="Microbiologia, Físico-química..." />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Certificação</label>
                <Input placeholder="ISO 17025, GMP, FDA..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Capacidade</label>
                <Input placeholder="Número de amostras/dia" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Categoria</label>
                <div className="flex items-center space-x-2">
                  <Wrench className="h-4 w-4 text-gray-400" />
                  <Input placeholder="HPLC, Espectrofotômetro..." />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Condição</label>
                <Input placeholder="Novo, Usado, Recondicionado" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Modalidade</label>
                <Input placeholder="Venda, Locação, Demonstração" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="consulting" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Especialidade</label>
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <Input placeholder="Regulatório, Qualidade..." />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Experiência</label>
                <Input placeholder="Anos de experiência mínima" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Disponibilidade</label>
                <Input placeholder="Imediata, 30 dias..." />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;
