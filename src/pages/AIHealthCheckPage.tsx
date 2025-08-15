import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AIHealthCheckPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader><CardTitle>AI Health Check</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Verifique o status dos agentes e integrações aqui.</p>
          
        </CardContent>
      </Card>
    </div>
  );
};

export default AIHealthCheckPage;
