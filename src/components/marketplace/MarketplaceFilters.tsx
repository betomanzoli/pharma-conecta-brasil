
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Filter } from 'lucide-react';

interface MarketplaceFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
}

const MarketplaceFilters = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType
}: MarketplaceFiltersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Filtros de Busca</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar por nome, especialidade ou localização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:col-span-2"
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos os tipos</option>
            <option value="laboratory">Laboratórios</option>
            <option value="consultant">Consultores</option>
            <option value="company">Empresas</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketplaceFilters;
