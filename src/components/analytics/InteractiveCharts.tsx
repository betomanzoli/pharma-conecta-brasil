import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Dados de exemplo para os gráficos
const userGrowthData = [
  { month: 'Jan', users: 1200, newUsers: 120, activeUsers: 980 },
  { month: 'Fev', users: 1350, newUsers: 150, activeUsers: 1100 },
  { month: 'Mar', users: 1580, newUsers: 230, activeUsers: 1320 },
  { month: 'Abr', users: 1750, newUsers: 170, activeUsers: 1450 },
  { month: 'Mai', users: 2100, newUsers: 350, activeUsers: 1750 },
  { month: 'Jun', users: 2400, newUsers: 300, activeUsers: 2000 },
  { month: 'Jul', users: 2847, newUsers: 447, activeUsers: 2350 }
];

const engagementData = [
  { week: 'Sem 1', mentorships: 25, forums: 45, chat: 120, projects: 15 },
  { week: 'Sem 2', mentorships: 30, forums: 52, chat: 135, projects: 18 },
  { week: 'Sem 3', mentorships: 35, forums: 48, chat: 150, projects: 22 },
  { week: 'Sem 4', mentorships: 42, forums: 65, chat: 180, projects: 28 }
];

const userTypeData = [
  { name: 'Profissionais', value: 1247, color: 'hsl(var(--primary))' },
  { name: 'Empresas', value: 543, color: 'hsl(var(--secondary))' },
  { name: 'Laboratórios', value: 287, color: 'hsl(var(--accent))' },
  { name: 'Consultores', value: 456, color: 'hsl(var(--muted))' },
  { name: 'Administradores', value: 12, color: 'hsl(var(--destructive))' }
];

const revenueData = [
  { month: 'Jan', revenue: 12000, subscriptions: 8000, mentorship: 4000 },
  { month: 'Fev', revenue: 15000, subscriptions: 9500, mentorship: 5500 },
  { month: 'Mar', revenue: 18500, subscriptions: 11000, mentorship: 7500 },
  { month: 'Abr', revenue: 21000, subscriptions: 13000, mentorship: 8000 },
  { month: 'Mai', revenue: 25500, subscriptions: 15500, mentorship: 10000 },
  { month: 'Jun', revenue: 28000, subscriptions: 17000, mentorship: 11000 }
];

const InteractiveCharts: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Crescimento de Usuários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Crescimento de Usuários
              <Badge variant="outline">Últimos 7 meses</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  className="text-muted-foreground"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-muted-foreground"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="hsl(var(--secondary))"
                  fill="hsl(var(--secondary))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Tipos de Usuário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Distribuição de Usuários
              <Badge variant="outline">Por tipo</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {userTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Engajamento e Receita */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividade Semanal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Atividade por Funcionalidade
              <Badge variant="outline">Últimas 4 semanas</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  className="text-muted-foreground"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-muted-foreground"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="mentorships" fill="hsl(var(--primary))" name="Mentorias" />
                <Bar dataKey="forums" fill="hsl(var(--secondary))" name="Fóruns" />
                <Bar dataKey="chat" fill="hsl(var(--accent))" name="Chat" />
                <Bar dataKey="projects" fill="hsl(var(--muted))" name="Projetos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Receita */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Receita Mensal
              <Badge variant="outline">Últimos 6 meses</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  className="text-muted-foreground"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-muted-foreground"
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`R$ ${value}`, '']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  name="Receita Total"
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="subscriptions"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  name="Assinaturas"
                  dot={{ fill: 'hsl(var(--secondary))', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="mentorship"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  name="Mentorias"
                  dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InteractiveCharts;