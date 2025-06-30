
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface AlertData {
  type: 'success' | 'warning' | 'info';
  message: string;
  count: number;
}

interface MetricsAlertsProps {
  alerts: AlertData[];
}

const MetricsAlerts: React.FC<MetricsAlertsProps> = ({ alerts }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas do Sistema</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            {alert.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {alert.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
            {alert.type === 'info' && <Clock className="h-5 w-5 text-blue-500" />}
            
            <div className="flex-1">
              <p className="text-sm font-medium">{alert.message}</p>
              <p className="text-xs text-gray-600">
                {alert.count} {alert.count === 1 ? 'item' : 'itens'}
              </p>
            </div>
            
            <Badge variant={
              alert.type === 'success' ? 'default' : 
              alert.type === 'warning' ? 'destructive' : 'secondary'
            }>
              {alert.count}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MetricsAlerts;
