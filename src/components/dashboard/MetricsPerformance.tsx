
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const MetricsPerformance: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance do Sistema</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Taxa de Sucesso</span>
            <span className="text-sm font-medium">94%</span>
          </div>
          <Progress value={94} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Tempo de Resposta</span>
            <span className="text-sm font-medium">1.2s</span>
          </div>
          <Progress value={85} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Satisfação</span>
            <span className="text-sm font-medium">4.8/5</span>
          </div>
          <Progress value={96} className="h-2" />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Uptime</span>
            <span className="text-sm font-medium">99.9%</span>
          </div>
          <Progress value={99.9} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsPerformance;
