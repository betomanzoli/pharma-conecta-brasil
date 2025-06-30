
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PendingRequestsProps {
  projectRequests: any[];
  loading: boolean;
}

const PendingRequests = ({ projectRequests, loading }: PendingRequestsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitações Pendentes</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Carregando solicitações...</p>
        ) : projectRequests.length === 0 ? (
          <p className="text-gray-500">Nenhuma solicitação pendente</p>
        ) : (
          <div className="space-y-4">
            {projectRequests.slice(0, 3).map((request: any) => (
              <div key={request.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{request.title}</h4>
                  <Badge variant="outline">
                    {request.service_type === 'laboratory_analysis' ? 'Análise' : 'Outro'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Prazo: {request.deadline ? new Date(request.deadline).toLocaleDateString('pt-BR') : 'Não especificado'}
                  </span>
                  <div className="space-x-2">
                    <Button size="sm" variant="outline">
                      Ver Detalhes
                    </Button>
                    <Button size="sm" className="bg-[#1565C0] hover:bg-[#1565C0]/90">
                      Aceitar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingRequests;
