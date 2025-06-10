
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Network,
  TrendingUp,
  Users,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const DashboardGeneral = () => {
  const { profile } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Bem-vindo de volta, {profile?.first_name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <User className="h-6 w-6 text-[#1565C0]" />
          <span className="text-lg font-medium text-[#1565C0]">Profissional Individual</span>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conexões</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Profissionais conectados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações do Perfil</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões de Mentoria</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Participações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos de Conhecimento</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">
              Acumulados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/network">
              <Button className="w-full h-20 flex flex-col items-center justify-center bg-[#1565C0] hover:bg-[#1565C0]/90">
                <Network className="h-6 w-6 mb-2" />
                <span>Explorar Rede</span>
              </Button>
            </Link>
            
            <Link to="/mentorship">
              <Button className="w-full h-20 flex flex-col items-center justify-center bg-[#4CAF50] hover:bg-[#4CAF50]/90">
                <Users className="h-6 w-6 mb-2" />
                <span>Encontrar Mentor</span>
              </Button>
            </Link>
            
            <Link to="/forums">
              <Button className="w-full h-20 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-600/90">
                <MessageSquare className="h-6 w-6 mb-2" />
                <span>Participar de Fóruns</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-[#1565C0] rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nova conexão com João Silva</p>
                <p className="text-xs text-gray-500">Consultor Regulatório - 2 horas atrás</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-[#4CAF50] rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Sessão de mentoria concluída</p>
                <p className="text-xs text-gray-500">Tópico: Validação de Processos - 1 dia atrás</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Participação no fórum de P&D</p>
                <p className="text-xs text-gray-500">Discussão sobre inovação - 2 dias atrás</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardGeneral;
