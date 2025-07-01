
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ConnectionData {
  date: string;
  count: number;
}

interface ConnectionsChartProps {
  data: ConnectionData[];
}

const ConnectionsChart = ({ data }: ConnectionsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Crescimento de Conexões</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} name="Novas Conexões" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ConnectionsChart;
