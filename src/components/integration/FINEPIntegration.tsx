
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, ExternalLink, Calendar, DollarSign, Target, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FINEPOpportunity {
  id: string;
  title: string;
  description: string;
  agency: string;
  value: number;
  deadline: Date;
  category: string;
  requirements: string[];
  status: 'open' | 'closing_soon' | 'closed';
  compatibility_score?: number;
}

const FINEPIntegration = () => {
  const [opportunities, setOpportunities] = useState<FINEPOpportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<FINEPOpportunity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simular dados de editais da FINEP
    const mockOpportunities: FINEPOpportunity[] = [
      {
        id: 'finep-001',
        title: 'Inovação em Biotecnologia Farmacêutica',
        description: 'Edital para desenvolvimento de novas tecnologias em biotecnologia aplicada ao setor farmacêutico.',
        agency: 'FINEP',
        value: 2500000,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        category: 'Biotecnologia',
        requirements: [
          'Empresa com CNPJ ativo',
          'Experiência comprovada em P&D',
          'Parceria com ICT',
          'Contrapartida mínima de 20%'
        ],
        status: 'open',
        compatibility_score: 92
      },
      {
        id: 'finep-002',
        title: 'Desenvolvimento de Medicamentos Genéricos',
        description: 'Apoio ao desenvolvimento e produção de medicamentos genéricos de alta complexidade.',
        agency: 'FINEP',
        value: 1800000,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        category: 'Medicamentos',
        requirements: [
          'Registro na ANVISA',
          'Laboratório próprio ou terceirizado',
          'Equipe técnica qualificada',
          'Plano de negócios detalhado'
        ],
        status: 'closing_soon',
        compatibility_score: 87
      },
      {
        id: 'finep-003',
        title: 'Inovação em Equipamentos Médicos',
        description: 'Edital para desenvolvimento de equipamentos médicos inovadores.',
        agency: 'FINEP',
        value: 3200000,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        category: 'Equipamentos',
        requirements: [
          'Certificação ISO 13485',
          'Prototipo funcional',
          'Patente depositada',
          'Análise de mercado'
        ],
        status: 'open',
        compatibility_score: 78
      },
      {
        id: 'finep-004',
        title: 'Pesquisa Clínica em Oncologia',
        description: 'Apoio a pesquisas clínicas inovadoras em tratamentos oncológicos.',
        agency: 'FINEP',
        value: 4500000,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        category: 'Pesquisa Clínica',
        requirements: [
          'Comitê de Ética aprovado',
          'Pesquisador principal qualificado',
          'Infraestrutura hospitalar',
          'Seguro de responsabilidade civil'
        ],
        status: 'open',
        compatibility_score: 95
      }
    ];

    setOpportunities(mockOpportunities);
    setFilteredOpportunities(mockOpportunities);
    setLoading(false);
  }, []);

  useEffect(() => {
    const filtered = opportunities.filter(opp =>
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOpportunities(filtered);
  }, [searchTerm, opportunities]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDeadline = (deadline: Date) => {
    const now = new Date();
    const diffInDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) return 'Encerrado';
    if (diffInDays === 0) return 'Hoje';
    if (diffInDays === 1) return 'Amanhã';
    return `${diffInDays} dias`;
  };

  const getStatusBadge = (status: FINEPOpportunity['status']) => {
    const variants = {
      open: 'default',
      closing_soon: 'destructive',
      closed: 'secondary'
    } as const;

    const labels = {
      open: 'Aberto',
      closing_soon: 'Encerrando',
      closed: 'Encerrado'
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const handleApplyInterest = (opportunity: FINEPOpportunity) => {
    toast({
      title: 'Interesse Registrado',
      description: `Seu interesse no edital "${opportunity.title}" foi registrado. Você receberá atualizações sobre este edital.`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Editais FINEP - Oportunidades de Financiamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar editais por palavra-chave, categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Portal FINEP
            </Button>
          </div>

          <ScrollArea className="h-96">
            <div className="space-y-4">
              {filteredOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {opportunity.title}
                          </h3>
                          {getStatusBadge(opportunity.status)}
                          {opportunity.compatibility_score && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {opportunity.compatibility_score}% compatível
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{opportunity.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <div>
                              <p className="text-xs text-gray-500">Valor</p>
                              <p className="text-sm font-medium">{formatCurrency(opportunity.value)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            <div>
                              <p className="text-xs text-gray-500">Prazo</p>
                              <p className="text-sm font-medium">{formatDeadline(opportunity.deadline)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-purple-500" />
                            <div>
                              <p className="text-xs text-gray-500">Categoria</p>
                              <p className="text-sm font-medium">{opportunity.category}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500">Órgão</p>
                              <p className="text-sm font-medium">{opportunity.agency}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-900 mb-2">Requisitos:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {opportunity.requirements.map((req, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Prazo: {opportunity.deadline.toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver Edital
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleApplyInterest(opportunity)}
                          disabled={opportunity.status === 'closed'}
                        >
                          Manifestar Interesse
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default FINEPIntegration;
