
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus } from 'lucide-react';
import NetworkConnection from './NetworkConnection';

interface NetworkTabsProps {
  connections: any[];
  loading: boolean;
  onConnect: (connectionId: string) => void;
}

const NetworkTabs = ({ connections, loading, onConnect }: NetworkTabsProps) => {
  const renderLoadingState = () => (
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
  );

  const renderEmptyState = () => (
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
  );

  const renderConnectionsList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {connections.map((connection) => (
        <NetworkConnection
          key={connection.id}
          connection={connection}
          onConnect={onConnect}
        />
      ))}
    </div>
  );

  return (
    <Tabs defaultValue="discover" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="discover">Descobrir</TabsTrigger>
        <TabsTrigger value="connections">Minhas Conexões</TabsTrigger>
        <TabsTrigger value="requests">Solicitações</TabsTrigger>
      </TabsList>

      <TabsContent value="discover">
        {loading ? renderLoadingState() : 
         connections.length === 0 ? renderEmptyState() : renderConnectionsList()}
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
  );
};

export default NetworkTabs;
