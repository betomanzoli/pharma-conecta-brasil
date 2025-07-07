import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CalendarDays, 
  Filter, 
  Download, 
  RefreshCw,
  X,
  Users,
  Building2,
  FlaskConical,
  GraduationCap
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FilterState {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  userTypes: string[];
  metrics: string[];
  period: string;
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  onExport: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFiltersChange,
  onExport,
  onRefresh,
  loading = false
}) => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
      to: new Date()
    },
    userTypes: [],
    metrics: ['users', 'sessions', 'revenue'],
    period: '30d'
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const userTypeOptions = [
    { id: 'individual', label: 'Profissionais', icon: Users },
    { id: 'company', label: 'Empresas', icon: Building2 },
    { id: 'laboratory', label: 'Laboratórios', icon: FlaskConical },
    { id: 'consultant', label: 'Consultores', icon: GraduationCap }
  ];

  const metricOptions = [
    { id: 'users', label: 'Usuários' },
    { id: 'sessions', label: 'Sessões de Mentoria' },
    { id: 'messages', label: 'Mensagens' },
    { id: 'projects', label: 'Projetos' },
    { id: 'revenue', label: 'Receita' },
    { id: 'engagement', label: 'Engajamento' }
  ];

  const periodOptions = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' },
    { value: '1y', label: 'Último ano' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
    
    // Calcular filtros ativos
    let count = 0;
    if (updatedFilters.userTypes.length > 0) count++;
    if (updatedFilters.metrics.length !== 3) count++; // 3 é o padrão
    if (updatedFilters.period !== '30d') count++;
    setActiveFiltersCount(count);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      dateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date()
      },
      userTypes: [],
      metrics: ['users', 'sessions', 'revenue'],
      period: '30d'
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    setActiveFiltersCount(0);
  };

  const handleUserTypeChange = (userType: string, checked: boolean) => {
    const newUserTypes = checked
      ? [...filters.userTypes, userType]
      : filters.userTypes.filter(type => type !== userType);
    
    updateFilters({ userTypes: newUserTypes });
  };

  const handleMetricChange = (metric: string, checked: boolean) => {
    const newMetrics = checked
      ? [...filters.metrics, metric]
      : filters.metrics.filter(m => m !== metric);
    
    updateFilters({ metrics: newMetrics });
  };

  const handlePeriodChange = (period: string) => {
    let dateRange = filters.dateRange;
    
    if (period !== 'custom') {
      const now = new Date();
      const days = parseInt(period.replace('d', '').replace('y', '')) * (period.includes('y') ? 365 : 1);
      dateRange = {
        from: new Date(now.getTime() - days * 24 * 60 * 60 * 1000),
        to: now
      };
    }
    
    updateFilters({ period, dateRange });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros Avançados</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount} ativo{activeFiltersCount > 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
            >
              <Download className="h-4 w-4 mr-1" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Período */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Período</label>
          <div className="flex items-center space-x-4">
            <Select value={filters.period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {filters.period === 'custom' && (
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      {filters.dateRange.from && filters.dateRange.to ? (
                        `${format(filters.dateRange.from, 'dd/MM/yy', { locale: ptBR })} - ${format(filters.dateRange.to, 'dd/MM/yy', { locale: ptBR })}`
                      ) : (
                        'Selecionar datas'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{
                        from: filters.dateRange.from,
                        to: filters.dateRange.to
                      }}
                      onSelect={(range) => {
                        if (range) {
                          updateFilters({ 
                            dateRange: { 
                              from: range.from, 
                              to: range.to 
                            } 
                          });
                        }
                      }}
                      numberOfMonths={2}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>

        {/* Tipos de Usuário */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipos de Usuário</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {userTypeOptions.map(option => {
              const Icon = option.icon;
              return (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={filters.userTypes.includes(option.id)}
                    onCheckedChange={(checked) => 
                      handleUserTypeChange(option.id, !!checked)
                    }
                  />
                  <label 
                    htmlFor={option.id}
                    className="flex items-center space-x-2 text-sm cursor-pointer"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{option.label}</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Métricas */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Métricas</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {metricOptions.map(option => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={filters.metrics.includes(option.id)}
                  onCheckedChange={(checked) => 
                    handleMetricChange(option.id, !!checked)
                  }
                />
                <label 
                  htmlFor={option.id}
                  className="text-sm cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;