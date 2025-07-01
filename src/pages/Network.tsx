
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import NetworkFilters from '@/components/network/NetworkFilters';
import NetworkTabs from '@/components/network/NetworkTabs';
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

          <NetworkFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
          />

          <NetworkTabs 
            connections={filteredConnections}
            loading={loading}
            onConnect={handleConnect}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Network;
