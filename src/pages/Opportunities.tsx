
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Calendar, DollarSign, Building2, Search, Filter, ExternalLink, Briefcase } from 'lucide-react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  partnership_type: string;
  budget_range?: string;
  requirements: string[];
  status: string;
  deadline?: string;
  company_id?: string;
  companies?: {
    name: string;
  };
}

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOpportunities();
  }, []);

  useEffect(() => {
    filterOpportunities();
  }, [searchTerm, typeFilter, statusFilter, opportunities]);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('partnership_opportunities')
        .select(`
          *,
          companies (
            name
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setOpportunities(data || []);
      setFilteredOpportunities(data || []);
    } catch (error) {
      console.error('Erro ao carregar oportunidades:', error);
      toast({
        title: "Erro ao carregar oportunidades",
        description: "Não foi possível carregar as oportunidades",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterOpportunities = () => {
    let filtered = opportunities;

    if (searchTerm) {
      filtered = filtered.filter(opp =>
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.companies?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(opp => opp.partnership_type === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(opp => opp.status === statusFilter);
    }

    setFilteredOpportunities(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'closed':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'joint_venture':
        return 'bg-blue-100 text-blue-800';
      case 'licensing':
        return 'bg-green-100 text-green-800';
      case 'distribution':
        return 'bg-purple-100 text-purple-800';
      case 'research':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getUniqueTypes = () => {
    const types = opportunities.map(opp => opp.partnership_type);
    return [...new Set(types)];
  };

  const handleApply = (opportunity: Opportunity) => {
    toast({
      title: "Candidatura enviada",
      description: `Sua candidatura para "${opportunity.title}" foi enviada`,
    });
  };

  const isDeadlineNear = (deadline?: string) => {
    if (!deadline) return false;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Oportunidades de Parceria
                </h1>
                <p className="text-gray-600 mt-2">
                  Encontre oportunidades de negócio e parcerias estratégicas
                </p>
              </div>
              <Button>
                <Target className="h-4 w-4 mr-2" />
                Publicar Oportunidade
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar oportunidades..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de Parceria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    {getUniqueTypes().map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="open">Aberto</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="closed">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Resultados */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma oportunidade encontrada
                </h3>
                <p className="text-gray-600">
                  Tente ajustar os filtros de busca
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  {filteredOpportunities.length} oportunidade{filteredOpportunities.length !== 1 ? 's' : ''} encontrada{filteredOpportunities.length !== 1 ? 's' : ''}
                </p>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros Avançados
                </Button>
              </div>

              <div className="space-y-4">
                {filteredOpportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className={getTypeColor(opportunity.partnership_type)}>
                              {opportunity.partnership_type}
                            </Badge>
                            <Badge variant={getStatusColor(opportunity.status)}>
                              {opportunity.status === 'open' ? 'Aberto' : 
                               opportunity.status === 'in_progress' ? 'Em Andamento' : 'Fechado'}
                            </Badge>
                            {opportunity.deadline && isDeadlineNear(opportunity.deadline) && (
                              <Badge variant="destructive">
                                Prazo próximo
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl text-primary mb-2">
                            {opportunity.title}
                          </CardTitle>
                          {opportunity.companies && (
                            <div className="flex items-center text-gray-600 mb-2">
                              <Building2 className="h-4 w-4 mr-1" />
                              <span>{opportunity.companies.name}</span>
                            </div>
                          )}
                        </div>
                        {opportunity.budget_range && (
                          <div className="text-right">
                            <div className="flex items-center text-lg font-bold text-green-600">
                              <DollarSign className="h-5 w-5" />
                              {opportunity.budget_range}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{opportunity.description}</p>
                      
                      {opportunity.requirements && opportunity.requirements.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Requisitos:</h4>
                          <div className="flex flex-wrap gap-2">
                            {opportunity.requirements.map((req, index) => (
                              <Badge key={index} variant="outline">{req}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {opportunity.deadline && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Prazo: {formatDate(opportunity.deadline)}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                          <Button size="sm" onClick={() => handleApply(opportunity)}>
                            <Briefcase className="h-4 w-4 mr-1" />
                            Candidatar-se
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Opportunities;
