
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Calendar, AlertTriangle, ExternalLink, Search, Filter, Bell } from 'lucide-react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RegulatoryAlert {
  id: string;
  title: string;
  description: string;
  source: string;
  alert_type: string;
  severity: string;
  published_at: string;
  expires_at?: string;
  url?: string;
}

const ANVISAAlerts = () => {
  const [alerts, setAlerts] = useState<RegulatoryAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<RegulatoryAlert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [searchTerm, typeFilter, severityFilter, alerts]);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('regulatory_alerts')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      
      setAlerts(data || []);
      setFilteredAlerts(data || []);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
      toast({
        title: "Erro ao carregar alertas",
        description: "Não foi possível carregar os alertas regulatórios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAlerts = () => {
    let filtered = alerts;

    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(alert => alert.alert_type === typeFilter);
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter(alert => alert.severity === severityFilter);
    }

    setFilteredAlerts(filtered);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
      case 'alto':
        return 'destructive';
      case 'medium':
      case 'médio':
        return 'default';
      case 'low':
      case 'baixo':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'recall':
        return <AlertTriangle className="h-4 w-4" />;
      case 'update':
        return <Bell className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUniqueTypes = () => {
    const types = alerts.map(alert => alert.alert_type);
    return [...new Set(types)];
  };

  const handleSubscribeAlerts = () => {
    toast({
      title: "Assinatura de alertas",
      description: "Funcionalidade de assinatura será implementada em breve",
    });
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
                  Alertas ANVISA
                </h1>
                <p className="text-gray-600 mt-2">
                  Alertas regulatórios e atualizações da ANVISA
                </p>
              </div>
              <Button onClick={handleSubscribeAlerts}>
                <Bell className="h-4 w-4 mr-2" />
                Assinar Alertas
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
                      placeholder="Buscar alertas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de Alerta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    {getUniqueTypes().map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Severidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Severidades</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="low">Baixa</SelectItem>
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
          ) : filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum alerta encontrado
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
                  {filteredAlerts.length} alerta{filteredAlerts.length !== 1 ? 's' : ''} encontrado{filteredAlerts.length !== 1 ? 's' : ''}
                </p>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros Avançados
                </Button>
              </div>

              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <Card key={alert.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getTypeIcon(alert.alert_type)}
                            <Badge variant="outline">{alert.source}</Badge>
                            <Badge variant={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(alert.published_at)}
                            </div>
                          </div>
                          <CardTitle className="text-xl text-primary mb-2">
                            {alert.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{alert.description}</p>
                      
                      {alert.expires_at && (
                        <div className="flex items-center text-sm text-orange-600 mb-4">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Expira em: {formatDate(alert.expires_at)}
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t">
                        <Badge variant="outline">{alert.alert_type}</Badge>
                        <div className="flex space-x-2">
                          {alert.url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={alert.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Ver Original
                              </a>
                            </Button>
                          )}
                          <Button size="sm">
                            Salvar Alerta
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

export default ANVISAAlerts;
