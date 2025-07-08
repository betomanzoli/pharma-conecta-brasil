import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FlaskConical, Activity, Calendar, Users, Award, TrendingUp, AlertCircle } from 'lucide-react';

const DashboardLaboratory = () => {
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
                  Dashboard Laboratório Farmacêutico
                </h1>
                <p className="text-gray-600">
                  Bem-vindo de volta, Laboratório {profile?.first_name}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <FlaskConical className="h-6 w-6 text-primary" />
                <span className="text-lg font-medium text-primary">Laboratório</span>
              </div>
            </div>
          </div>

          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Capacidade Utilizada</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <Progress value={78} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">156/200 projetos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">+5 este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Parceiros Ativos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">Empresas parceiras</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96.2%</div>
                <p className="text-xs text-muted-foreground">Aprovações ANVISA</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Certificações e Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Certificações e Compliance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Boas Práticas de Fabricação</h4>
                      <p className="text-sm text-gray-600">Válido até: 15/08/2025</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Válido</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">ISO 9001:2015</h4>
                      <p className="text-sm text-gray-600">Válido até: 22/11/2024</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Válido</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">Licença ANVISA</h4>
                      <p className="text-sm text-gray-600">Renovação em: 30 dias</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Atenção</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">LGPD Compliance</h4>
                      <p className="text-sm text-gray-600">Última auditoria: 15/01/2024</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Conforme</Badge>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Gerenciar Certificações
                </Button>
              </CardContent>
            </Card>

            {/* Equipamentos e Capacidade */}
            <Card>
              <CardHeader>
                <CardTitle>Equipamentos e Capacidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>HPLC (Cromatografia Líquida)</span>
                      <span>5/6 disponíveis</span>
                    </div>
                    <Progress value={83} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Espectrômetro de Massa</span>
                      <span>2/3 disponíveis</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Dissolutor</span>
                      <span>8/10 disponíveis</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Estabilidade</span>
                      <span>12/15 disponíveis</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Reservar Equipamento
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Solicitações Pendentes */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Solicitações de Análise Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <h4 className="font-medium">Bioequivalência - Medicamento Genérico</h4>
                      <p className="text-sm text-gray-600">Laboratório ABC Pharma • Prioridade: Alta</p>
                      <p className="text-xs text-gray-500">Solicitado há 2 dias</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge>R$ 15.000</Badge>
                    <Button size="sm">Aceitar</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <h4 className="font-medium">Estabilidade Acelerada - Suplemento</h4>
                      <p className="text-sm text-gray-600">NutriVita Ltd • Prioridade: Média</p>
                      <p className="text-xs text-gray-500">Solicitado há 5 dias</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge>R$ 8.500</Badge>
                    <Button size="sm">Aceitar</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <h4 className="font-medium">Microbiologia - Produto Cosmético</h4>
                      <p className="text-sm text-gray-600">BeautyBras Cosméticos • Prioridade: Baixa</p>
                      <p className="text-xs text-gray-500">Solicitado há 1 semana</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge>R$ 3.200</Badge>
                    <Button size="sm">Aceitar</Button>
                  </div>
                </div>

                <Button className="w-full">
                  Ver Todas as Solicitações
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alertas Importantes */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <span>Alertas e Notificações</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900">Manutenção Programada</h4>
                    <p className="text-sm text-red-700">
                      HPLC #3 entrará em manutenção preventiva em 3 dias. Reagende análises se necessário.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Estoque de Reagentes</h4>
                    <p className="text-sm text-yellow-700">
                      Reagentes para dissolução estão com estoque baixo. Reposição necessária.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLaboratory;