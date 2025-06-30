
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AnalysisHistory = () => {
  const analysisHistory = [
    { id: 1, client: 'FarmaCorp', type: 'Microbiológica', date: '2024-01-20', status: 'completed' },
    { id: 2, client: 'HealthLab', type: 'Físico-Química', date: '2024-01-18', status: 'in_progress' },
    { id: 3, client: 'BioPharma', type: 'Estabilidade', date: '2024-01-15', status: 'completed' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Análises Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analysisHistory.map((analysis) => (
            <div key={analysis.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">{analysis.client}</h4>
                <p className="text-sm text-gray-600">Análise {analysis.type}</p>
                <p className="text-xs text-gray-500">
                  Data: {new Date(analysis.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <Badge 
                variant={analysis.status === 'completed' ? 'default' : 'secondary'}
              >
                {analysis.status === 'completed' ? 'Concluída' : 'Em Andamento'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisHistory;
