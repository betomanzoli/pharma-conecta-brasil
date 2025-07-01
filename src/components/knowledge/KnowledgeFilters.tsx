
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Upload } from 'lucide-react';

interface KnowledgeFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  typeFilter: string;
  setTypeFilter: (type: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  onUpload: () => void;
}

const KnowledgeFilters = ({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  onUpload
}: KnowledgeFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar recursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">Todos os tipos</option>
                <option value="document">Documentos</option>
                <option value="video">Vídeos</option>
                <option value="guide">Guias</option>
                <option value="template">Templates</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">Todas categorias</option>
                <option value="regulatory">Regulatório</option>
                <option value="clinical">Clínico</option>
                <option value="manufacturing">Fabricação</option>
                <option value="quality">Qualidade</option>
              </select>
            </div>
          </div>
          <Button 
            onClick={onUpload}
            className="bg-[#1565C0] hover:bg-[#1565C0]/90"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Recurso
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeFilters;
