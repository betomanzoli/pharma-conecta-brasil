
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import UniversalDemoBanner from '@/components/layout/UniversalDemoBanner';
import { isDemoMode } from '@/utils/demoMode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Forums = () => {
  const { profile } = useAuth();
  const isDemo = isDemoMode();

  const renderDemoContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              Tópicos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
            <p className="text-sm text-muted-foreground">Em discussão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Participantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">128</div>
            <p className="text-sm text-muted-foreground">Membros ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Respostas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">256</div>
            <p className="text-sm text-muted-foreground">Esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              Suas Discussões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-sm text-muted-foreground">Participando</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tópicos Populares (Demo)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                'Novas Regulamentações ANVISA 2024',
                'Melhores Práticas em Controle de Qualidade',
                'Desenvolvimento de Medicamentos Genéricos'
              ].map((topic, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{topic}</p>
                    <p className="text-sm text-muted-foreground">{12 + i * 5} respostas</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Discussões por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: 'Regulatório', count: 15 },
                { category: 'Desenvolvimento', count: 12 },
                { category: 'Qualidade', count: 8 },
                { category: 'Mercado', count: 7 }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-sm text-muted-foreground">{item.count} tópicos</span>
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
          <strong>Funcionalidade em Desenvolvimento:</strong> Os fóruns de discussão estão sendo construídos. 
          Em breve você poderá participar de discussões especializadas sobre o setor farmacêutico.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              Suas Participações
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
              <Users className="h-4 w-4 mr-2" />
              Seguidores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">Em desenvolvimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Reputação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">--</div>
            <p className="text-sm text-muted-foreground">Será calculada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">Nenhuma nova</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fóruns Planejados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Regulamentação ANVISA</p>
                <p className="text-sm text-muted-foreground">
                  Discussões sobre normas e compliance
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Desenvolvimento de Produtos</p>
                <p className="text-sm text-muted-foreground">
                  Compartilhe experiências e melhores práticas
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Mercado Farmacêutico</p>
                <p className="text-sm text-muted-foreground">
                  Análises e tendências do setor
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
                  Fóruns de Discussão
                </h1>
                <p className="text-muted-foreground">
                  {isDemo 
                    ? 'Participe de discussões especializadas (dados demonstrativos)'
                    : 'Conecte-se com especialistas do setor farmacêutico'
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

export default Forums;
