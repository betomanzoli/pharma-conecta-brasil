
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  MapPin, 
  Building, 
  UserPlus,
  MessageCircle,
  Filter,
  Star,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NetworkConnection {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  expertise: string[];
  avatar?: string;
  connection_status: 'connected' | 'pending' | 'none';
  user_type: 'company' | 'laboratory' | 'consultant' | 'individual';
}

const Network = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [connections, setConnections] = useState<NetworkConnection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNetworkConnections();
  }, [profile]);

  const fetchNetworkConnections = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          user_type,
          phone,
          linkedin_url
        `)
        .neq('id', profile.id)
        .limit(50);

      if (error) {
        console.error('Error fetching network connections:', error);
        return;
      }

      const formattedConnections: NetworkConnection[] = (data || []).map(user => ({
        id: user.id,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Nome não informado',
        title: user.user_type === 'company' ? 'Empresa' : 
               user.user_type === 'laboratory' ? 'Laboratório' :
               user.user_type === 'consultant' ? 'Consultor' : 'Profissional',
        company: 'Independente',
        location: 'Brasil',
        expertise: [],
        avatar: undefined,
        connection_status: 'none',
        user_type: user.user_type as 'company' | 'laboratory' | 'consultant' | 'individual'
      }));

      setConnections(formattedConnections);
    } catch (error) {
      console.error('Error fetching network connections:', error);
      toast({
        title: "Erro ao carregar conexões",
        description: "Não foi possível carregar a rede de contatos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (connectionId: string) => {
    try {
      // Simular envio de solicitação de conexão
      setConnections(prev => 
        prev.map(conn => 
          conn.id === connectionId 
            ? { ...conn, connection_status: 'pending' }
            : conn
        )
      );

      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de conexão foi enviada com sucesso",
      });
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Erro ao conectar",
        description: "Não foi possível enviar a solicitação",
        variant: "destructive"
      });
    }
  };

  const filteredConnections = connections.filter(conn => {
    const matchesSearch = conn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conn.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conn.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || conn.user_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'company': return <Building className="h-4 w-4" />;
      case 'laboratory': return <Briefcase className="h-4 w-4" />;
      case 'consultant': return <Star className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'company': return 'bg-blue-100 text-blue-800';
      case 'laboratory': return 'bg-green-100 text-green-800';
      case 'consultant': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Rede de Contatos
            </h1>
            <p className="text-gray-600 mt-2">
              Conecte-se com profissionais e empresas do setor farmacêutico
            </p>
          </div>

          {/* Filtros e Busca */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por nome, empresa ou expertise..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">Todos</option>
                    <option value="company">Empresas</option>
                    <option value="laboratory">Laboratórios</option>
                    <option value="consultant">Consultores</option>
                    <option value="individual">Profissionais</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="discover" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="discover">Descobrir</TabsTrigger>
              <TabsTrigger value="connections">Minhas Conexões</TabsTrigger>
              <TabsTrigger value="requests">Solicitações</TabsTrigger>
            </TabsList>

            <TabsContent value="discover">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-20 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredConnections.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma conexão encontrada
                    </h3>
                    <p className="text-gray-600">
                      Tente ajustar os filtros de busca ou explore diferentes termos
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredConnections.map((connection) => (
                    <Card key={connection.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4 mb-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={connection.avatar} />
                            <AvatarFallback>
                              {connection.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {connection.name}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                              {connection.company}
                            </p>
                            <div className="flex items-center mt-1">
                              <Badge className={`text-xs ${getTypeColor(connection.user_type)}`}>
                                <span className="flex items-center space-x-1">
                                  {getTypeIcon(connection.user_type)}
                                  <span>{connection.title}</span>
                                </span>
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {connection.location && (
                          <div className="flex items-center text-sm text-gray-600 mb-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{connection.location}</span>
                          </div>
                        )}

                        {connection.expertise.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1">
                              {connection.expertise.slice(0, 3).map((exp, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {exp}
                                </Badge>
                              ))}
                              {connection.expertise.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{connection.expertise.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleConnect(connection.id)}
                            disabled={connection.connection_status !== 'none'}
                            className="flex-1"
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            {connection.connection_status === 'pending' ? 'Pendente' : 
                             connection.connection_status === 'connected' ? 'Conectado' : 'Conectar'}
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="connections">
              <Card>
                <CardHeader>
                  <CardTitle>Minhas Conexões</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Suas conexões aparecerão aqui
                    </h3>
                    <p className="text-gray-600">
                      Conecte-se com outros profissionais para expandir sua rede
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle>Solicitações de Conexão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma solicitação pendente
                    </h3>
                    <p className="text-gray-600">
                      Solicitações de conexão recebidas aparecerão aqui
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Network;
