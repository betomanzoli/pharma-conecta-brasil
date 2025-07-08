import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserCheck, TrendingUp, Calendar, FileText, Award, MapPin } from 'lucide-react';

const DashboardConsultant = () => {
  const { profile } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Dashboard Consultor Farmacêutico
                </h1>
                <p className="text-gray-600">
                  Bem-vindo de volta, {profile?.first_name}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <UserCheck className="h-6 w-6 text-primary" />
                <span className="text-lg font-medium text-primary">Consultor</span>
              </div>
            </div>
          </div>

          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">+2 este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">ANVISA compliance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximas Consultas</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Esta semana</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rating Médio</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8</div>
                <p className="text-xs text-muted-foreground">De 127 avaliações</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Especialidades */}
            <Card>
              <CardHeader>
                <CardTitle>Suas Especialidades</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-800">Regulamentação ANVISA</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Registro de Medicamentos</Badge>
                  <Badge className="bg-purple-100 text-purple-800">Farmacovigilância</Badge>
                  <Badge className="bg-yellow-100 text-yellow-800">Qualidade Farmacêutica</Badge>
                  <Badge className="bg-red-100 text-red-800">Compliance</Badge>
                </div>
                <Button variant="outline" size="sm">
                  Atualizar Especialidades
                </Button>
              </CardContent>
            </Card>

            {/* Oportunidades Recomendadas */}
            <Card>
              <CardHeader>
                <CardTitle>Oportunidades Recomendadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium">Consultoria Regulatória - Laboratório ABC</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Registro de novo medicamento genérico
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        São Paulo, SP
                      </div>
                      <Badge>R$ 8.500</Badge>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium">Auditoria de Qualidade - Pharma XYZ</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Preparação para inspeção ANVISA
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        Rio de Janeiro, RJ
                      </div>
                      <Badge>R$ 12.000</Badge>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-medium">Treinamento LGPD - Empresa Beta</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Adequação à LGPD no setor farmacêutico
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        Belo Horizonte, MG
                      </div>
                      <Badge>R$ 6.500</Badge>
                    </div>
                  </div>
                </div>

                <Button className="w-full">
                  Ver Todas as Oportunidades
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Alertas ANVISA Relevantes */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Alertas ANVISA Relevantes para Você</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <Award className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900">Nova RDC sobre Medicamentos Genéricos</h4>
                    <p className="text-sm text-red-700 mb-2">
                      ANVISA publica nova resolução RDC nº 73/2024 alterando critérios de bioequivalência
                    </p>
                    <p className="text-xs text-red-600">Publicado há 2 dias</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <Award className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Atualização nas Boas Práticas de Fabricação</h4>
                    <p className="text-sm text-yellow-700 mb-2">
                      Revisão da RDC nº 301/2019 com novas diretrizes para indústria farmacêutica
                    </p>
                    <p className="text-xs text-yellow-600">Publicado há 1 semana</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Ver Todos os Alertas ANVISA
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardConsultant;