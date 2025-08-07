
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import UniversalDemoBanner from '@/components/layout/UniversalDemoBanner';
import { isDemoMode } from '@/utils/demoMode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Clock, Award, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MentorshipHub = () => {
  const { profile } = useAuth();
  const isDemo = isDemoMode();

  const renderDemoContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <User className="h-4 w-4 mr-2" />
              Mentores Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-sm text-muted-foreground">Disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Sessões Agendadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-sm text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Horas de Mentoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">32</div>
            <p className="text-sm text-muted-foreground">Acumuladas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Avaliação Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.8</div>
            <p className="text-sm text-muted-foreground">⭐ Excelente</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mentores Recomendados (Demo)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Dr. Ana Silva', expertise: 'Regulatório ANVISA', rating: 4.9 },
                { name: 'Prof. Carlos Santos', expertise: 'Desenvolvimento Clínico', rating: 4.8 },
                { name: 'Dra. Maria Costa', expertise: 'Controle de Qualidade', rating: 4.7 }
              ].map((mentor, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{mentor.name}</p>
                    <p className="text-sm text-muted-foreground">{mentor.expertise}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{mentor.rating}</p>
                    <p className="text-xs text-muted-foreground">⭐ Rating</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Sessões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { mentor: 'Dr. Ana Silva', topic: 'Submissão ANVISA', date: '15 Jan', time: '14:00' },
                { mentor: 'Prof. Carlos Santos', topic: 'Protocolo Clínico', date: '17 Jan', time: '10:00' },
                { mentor: 'Dra. Maria Costa', topic: 'Validação de Métodos', date: '20 Jan', time: '16:00' }
              ].map((session, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{session.topic}</p>
                    <p className="text-sm text-muted-foreground">com {session.mentor}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{session.date}</p>
                    <p className="text-sm text-muted-foreground">{session.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRealContent = () => (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Funcionalidade em Desenvolvimento:</strong> O programa de mentoria está sendo estruturado. 
          Em breve você poderá conectar-se com mentores especialistas do setor farmacêutico.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <User className="h-4 w-4 mr-2" />
              Seus Mentores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">Nenhum ainda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Sessões Realizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">Aguardando lançamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Tempo de Aprendizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0h</div>
            <p className="text-sm text-muted-foreground">Será contabilizado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Certificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">--</div>
            <p className="text-sm text-muted-foreground">Em planejamento</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Programa de Mentoria Planejado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Mentores Especializados</p>
                <p className="text-sm text-muted-foreground">
                  Profissionais experientes em regulatório, desenvolvimento e qualidade
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Sessões Personalizadas</p>
                <p className="text-sm text-muted-foreground">
                  Agendamento flexível com foco nas suas necessidades
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Certificação de Competências</p>
                <p className="text-sm text-muted-foreground">
                  Reconhecimento oficial do aprendizado adquirido
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <UniversalDemoBanner variant="minimal" className="mb-6" />
          
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Programa de Mentoria
                </h1>
                <p className="text-muted-foreground">
                  {isDemo 
                    ? 'Conecte-se com mentores especialistas (dados demonstrativos)'
                    : 'Acelere seu crescimento profissional com mentores especializados'
                  }
                </p>
              </div>
            </div>
          </div>

          {isDemo ? renderDemoContent() : renderRealContent()}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default MentorshipHub;
