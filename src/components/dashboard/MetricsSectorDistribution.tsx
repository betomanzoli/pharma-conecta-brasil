
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface SectorData {
  name: string;
  value: number;
  color: string;
}

interface MetricsSectorDistributionProps {
  sectors: SectorData[];
}

const MetricsSectorDistribution: React.FC<MetricsSectorDistributionProps> = ({ sectors }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieChart className="h-5 w-5 mr-2" />
          Distribuição por Setor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <RechartsPieChart>
            <Pie
              data={sectors}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {sectors.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {sectors.map((sector, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }}></div>
                <span className="text-sm">{sector.name}</span>
              </div>
              <span className="text-sm font-medium">{sector.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsSectorDistribution;
