
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

interface MentorshipFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  experienceFilter: string;
  setExperienceFilter: (experience: string) => void;
  specialtyFilter: string;
  setSpecialtyFilter: (specialty: string) => void;
}

const MentorshipFilters = ({
  searchTerm,
  setSearchTerm,
  experienceFilter,
  setExperienceFilter,
  specialtyFilter,
  setSpecialtyFilter
}: MentorshipFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar mentores por nome ou especialidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Toda experiência</option>
              <option value="junior">1-3 anos</option>
              <option value="mid">4-7 anos</option>
              <option value="senior">8+ anos</option>
            </select>
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Todas especialidades</option>
              <option value="regulatory">Regulatório</option>
              <option value="clinical">Pesquisa Clínica</option>
              <option value="manufacturing">Fabricação</option>
              <option value="quality">Qualidade</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MentorshipFilters;
