
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import IntegrationCategories, { Integration } from './IntegrationCategories';

const APIIntegrationPanel: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const integrations: Integration[] = [
    // Reguladores Nacionais
    {
      id: 'anvisa',
      name: 'ANVISA',
      description: 'Agência Nacional de Vigilância Sanitária - Alertas regulatórios e registros',
      status: 'connected',
      category: 'Reguladores Nacionais',
      lastSync: 'Hoje, 14:30',
      dataCount: 1247
    },
    {
      id: 'inpi',
      name: 'INPI',
      description: 'Instituto Nacional da Propriedade Industrial - Patentes e marcas',
      status: 'connected',
      category: 'Reguladores Nacionais',
      lastSync: 'Hoje, 13:45',
      dataCount: 856
    },
    {
      id: 'inmetro',
      name: 'INMETRO',
      description: 'Instituto Nacional de Metrologia - Certificações e qualidade',
      status: 'disconnected',
      category: 'Reguladores Nacionais'
    },
    {
      id: 'ibama',
      name: 'IBAMA',
      description: 'Instituto Brasileiro do Meio Ambiente - Licenças ambientais',
      status: 'connected',
      category: 'Reguladores Nacionais',
      lastSync: 'Ontem, 16:20',
      dataCount: 342
    },

    // Reguladores Internacionais
    {
      id: 'fda',
      name: 'FDA',
      description: 'Food and Drug Administration - Regulamentações americanas',
      status: 'connected',
      category: 'Reguladores Internacionais',
      lastSync: 'Hoje, 12:15',
      dataCount: 2156
    },

    // Financiamento e Fomento
    {
      id: 'finep',
      name: 'FINEP',
      description: 'Financiadora de Estudos e Projetos - Editais e financiamentos',
      status: 'connected',
      category: 'Financiamento e Fomento',
      lastSync: 'Hoje, 11:30',
      dataCount: 89
    },
    {
      id: 'bndes',
      name: 'BNDES',
      description: 'Banco Nacional de Desenvolvimento - Linhas de crédito e financiamento',
      status: 'connected',
      category: 'Financiamento e Fomento',
      lastSync: 'Hoje, 10:45',
      dataCount: 156
    },
    {
      id: 'sebrae',
      name: 'SEBRAE',
      description: 'Serviço Brasileiro de Apoio às Micro e Pequenas Empresas',
      status: 'connected',
      category: 'Financiamento e Fomento',
      lastSync: 'Hoje, 09:20',
      dataCount: 567
    },

    // Associações Setoriais
    {
      id: 'sindusfarma',
      name: 'SINDUSFARMA',
      description: 'Sindicato da Indústria Farmacêutica - Dados setoriais e regulamentações',
      status: 'connected',
      category: 'Associações Setoriais',
      lastSync: 'Hoje, 08:15',
      dataCount: 234
    },
    {
      id: 'abifina',
      name: 'ABIFINA',
      description: 'Associação Brasileira das Indústrias de Química Fina',
      status: 'connected',
      category: 'Associações Setoriais',
      lastSync: 'Ontem, 17:30',
      dataCount: 178
    },
    {
      id: 'abiquifi',
      name: 'ABIQUIFI',
      description: 'Associação Brasileira das Indústrias de Química Fina e Biotecnologia',
      status: 'disconnected',
      category: 'Associações Setoriais'
    },
    {
      id: 'alanac',
      name: 'ALANAC',
      description: 'Associação dos Laboratórios Nacionais - Rede de laboratórios',
      status: 'connected',
      category: 'Associações Setoriais',
      lastSync: 'Hoje, 07:45',
      dataCount: 89
    },

    // Entidades Industriais
    {
      id: 'cni',
      name: 'CNI',
      description: 'Confederação Nacional da Indústria - Dados industriais nacionais',
      status: 'connected',
      category: 'Entidades Industriais',
      lastSync: 'Hoje, 14:00',
      dataCount: 1456
    },
    {
      id: 'fiesp',
      name: 'FIESP',
      description: 'Federação das Indústrias do Estado de São Paulo',
      status: 'connected',
      category: 'Entidades Industriais',
      lastSync: 'Hoje, 13:20',
      dataCount: 892
    },
    {
      id: 'abdi',
      name: 'ABDI',
      description: 'Agência Brasileira de Desenvolvimento Industrial',
      status: 'connected',
      category: 'Entidades Industriais',
      lastSync: 'Hoje, 12:45',
      dataCount: 345
    },

    // Pesquisa e Inovação
    {
      id: 'embrapii',
      name: 'EMBRAPII',
      description: 'Empresa Brasileira de Pesquisa e Inovação Industrial',
      status: 'connected',
      category: 'Pesquisa e Inovação',
      lastSync: 'Hoje, 11:15',
      dataCount: 167
    },
    {
      id: 'fiocruz',
      name: 'FIOCRUZ',
      description: 'Fundação Oswaldo Cruz - Pesquisas e desenvolvimento farmacêutico',
      status: 'connected',
      category: 'Pesquisa e Inovação',
      lastSync: 'Hoje, 10:30',
      dataCount: 423
    },
    {
      id: 'bio_manguinhos',
      name: 'Bio-Manguinhos',
      description: 'Instituto de Tecnologia em Imunobiológicos - Vacinas e soros',
      status: 'connected',
      category: 'Pesquisa e Inovação',
      lastSync: 'Hoje, 09:45',
      dataCount: 198
    },
    {
      id: 'butantan',
      name: 'Instituto Butantan',
      description: 'Centro de pesquisa biomédica - Vacinas e antivenenos',
      status: 'connected',
      category: 'Pesquisa e Inovação',
      lastSync: 'Hoje, 08:30',
      dataCount: 267
    },

    // Governo e Ministérios
    {
      id: 'mdic',
      name: 'MDIC',
      description: 'Ministério do Desenvolvimento, Indústria e Comércio Exterior',
      status: 'connected',
      category: 'Governo e Ministérios',
      lastSync: 'Hoje, 15:20',
      dataCount: 789
    },
    {
      id: 'mcti',
      name: 'MCTI',
      description: 'Ministério da Ciência, Tecnologia e Inovação',
      status: 'connected',
      category: 'Governo e Ministérios',
      lastSync: 'Hoje, 14:45',
      dataCount: 534
    },
    {
      id: 'capes',
      name: 'CAPES',
      description: 'Coordenação de Aperfeiçoamento de Pessoal de Nível Superior',
      status: 'connected',
      category: 'Governo e Ministérios',
      lastSync: 'Hoje, 13:10',
      dataCount: 1234
    },
    {
      id: 'gov_relations',
      name: 'Gov Relations',
      description: 'Sistema de Relações Governamentais - Políticas públicas',
      status: 'connected',
      category: 'Governo e Ministérios',
      lastSync: 'Hoje, 12:00',
      dataCount: 456
    },

    // Sistemas e Plataformas
    {
      id: 'sipid',
      name: 'SIPID',
      description: 'Sistema de Propriedade Intelectual - Gestão de patentes',
      status: 'connected',
      category: 'Sistemas e Plataformas',
      lastSync: 'Hoje, 16:00',
      dataCount: 678
    },
    {
      id: 'innovation',
      name: 'Innovation Platform',
      description: 'Plataforma de Inovação - Conecta pesquisadores e empresas',
      status: 'connected',
      category: 'Sistemas e Plataformas',
      lastSync: 'Hoje, 15:45',
      dataCount: 234
    },
    {
      id: 'grupo_farma_brasil',
      name: 'Grupo Farma Brasil',
      description: 'Rede de empresas farmacêuticas brasileiras',
      status: 'connected',
      category: 'Sistemas e Plataformas',
      lastSync: 'Hoje, 14:15',
      dataCount: 189
    },
    {
      id: 'acessa',
      name: 'ACESSA',
      description: 'Plataforma de Acesso a Informações Farmacêuticas',
      status: 'disconnected',
      category: 'Sistemas e Plataformas'
    },
    {
      id: 'nib',
      name: 'NIB',
      description: 'National Institute of Biology - Dados biológicos e farmacêuticos',
      status: 'disconnected',
      category: 'Sistemas e Plataformas'
    },

    // Sistemas Financeiros
    {
      id: 'receita_federal',
      name: 'Receita Federal',
      description: 'Consulta de dados empresariais (CNPJ) e situação fiscal',
      status: 'connected',
      category: 'Sistemas Financeiros',
      lastSync: 'Hoje, 12:15',
      dataCount: 2345
    },
    {
      id: 'stripe',
      name: 'Stripe Payments',
      description: 'Processamento de pagamentos e transações',
      status: 'error',
      category: 'Sistemas Financeiros'
    }
  ];

  const testConnection = async (integrationId: string) => {
    setLoading(integrationId);
    
    try {
      const { data, error } = await supabase.functions.invoke('test-integration', {
        body: { integration: integrationId }
      });

      if (error) throw error;

      // Simular sucesso para demonstração
      setTimeout(() => {
        setLoading(null);
      }, 2000);
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      setLoading(null);
    }
  };

  const configureIntegration = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    setSelectedIntegration(integration || null);
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const totalCount = integrations.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Integrações Completas da Indústria Farmacêutica</h2>
        <p className="text-gray-600 mb-4">
          Conecte-se com todas as entidades relevantes do ecossistema farmacêutico brasileiro e internacional
        </p>
        <div className="flex items-center space-x-4">
          <Badge variant="default" className="bg-green-100 text-green-800">
            {connectedCount} Conectadas
          </Badge>
          <Badge variant="secondary">
            {totalCount - connectedCount} Disponíveis
          </Badge>
          <Badge variant="outline">
            Total: {totalCount} Integrações
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="configure">Configurar</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          <TabsTrigger value="logs">Logs Detalhados</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <IntegrationCategories
            integrations={integrations}
            onTest={testConnection}
            onConfigure={configureIntegration}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="configure">
          <Card>
            <CardHeader>
              <CardTitle>Configuração Avançada de Integrações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Chaves de API Governamentais</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="anvisa-key">ANVISA API Key</Label>
                      <Input id="anvisa-key" type="password" placeholder="Digite sua chave da ANVISA" />
                    </div>
                    <div>
                      <Label htmlFor="fda-key">FDA API Key</Label>
                      <Input id="fda-key" type="password" placeholder="Digite sua chave da FDA" />
                    </div>
                    <div>
                      <Label htmlFor="inpi-token">INPI Access Token</Label>
                      <Input id="inpi-token" type="password" placeholder="Token do INPI" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Configurações de Sincronização</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-sync" />
                      <Label htmlFor="auto-sync">Sincronização automática</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="real-time" />
                      <Label htmlFor="real-time">Alertas em tempo real</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="notifications" />
                      <Label htmlFor="notifications">Notificações por email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="data-validation" />
                      <Label htmlFor="data-validation">Validação de dados</Label>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="w-full">Salvar Todas as Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Geral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Integrações Ativas:</span>
                    <Badge variant="default">{connectedCount}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Sincronizações Hoje:</span>
                    <Badge variant="secondary">47</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Dados Coletados:</span>
                    <Badge variant="outline">15.7K</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Tempo Médio:</span>
                    <span className="text-green-600">1.2s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de Sucesso:</span>
                    <span className="text-green-600">98.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span className="text-green-600">99.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Alertas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-green-600">ANVISA:</span> 3 novos alertas
                  </div>
                  <div className="text-sm">
                    <span className="text-blue-600">FINEP:</span> 2 editais abertos
                  </div>
                  <div className="text-sm">
                    <span className="text-orange-600">INPI:</span> 15 patentes aprovadas
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Logs Detalhados das Integrações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {[
                  { time: 'Hoje, 16:05', source: 'ANVISA', action: 'Sincronização de alertas', status: 'success', count: 23 },
                  { time: 'Hoje, 15:45', source: 'FDA', action: 'Coleta de regulamentações', status: 'success', count: 156 },
                  { time: 'Hoje, 15:30', source: 'FIOCRUZ', action: 'Atualização de pesquisas', status: 'success', count: 45 },
                  { time: 'Hoje, 15:15', source: 'SINDUSFARMA', action: 'Dados setoriais', status: 'success', count: 12 },
                  { time: 'Hoje, 15:00', source: 'EMBRAPII', action: 'Projetos de inovação', status: 'success', count: 8 },
                  { time: 'Hoje, 14:45', source: 'BNDES', action: 'Linhas de financiamento', status: 'success', count: 34 },
                  { time: 'Hoje, 14:30', source: 'INPI', action: 'Consulta de patentes', status: 'success', count: 89 },
                  { time: 'Hoje, 14:15', source: 'CNI', action: 'Indicadores industriais', status: 'success', count: 67 },
                  { time: 'Hoje, 14:00', source: 'SEBRAE', action: 'Programas para PMEs', status: 'success', count: 23 },
                  { time: 'Hoje, 13:45', source: 'Bio-Manguinhos', action: 'Dados de produção', status: 'warning', count: 5 }
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={log.status === 'success' ? 'default' : log.status === 'warning' ? 'secondary' : 'destructive'}
                        className={
                          log.status === 'success' 
                            ? 'bg-green-100 text-green-800' 
                            : log.status === 'warning' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : ''
                        }
                      >
                        {log.status === 'success' ? '✓' : log.status === 'warning' ? '⚠' : '✗'}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{log.source} - {log.action}</p>
                        <p className="text-xs text-gray-500">{log.time} - {log.count} registros</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default APIIntegrationPanel;
