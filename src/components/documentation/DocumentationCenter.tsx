
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Code, 
  Video, 
  BookOpen, 
  Search,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Play
} from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  type: 'guide' | 'api' | 'tutorial' | 'reference' | 'video';
  status: 'complete' | 'partial' | 'outdated' | 'missing';
  description: string;
  lastUpdated: string;
  completeness: number;
  url?: string;
  downloadable?: boolean;
}

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  documented: boolean;
  examples: boolean;
}

const DocumentationCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [docSections, setDocSections] = useState<DocSection[]>([]);
  const [apiEndpoints, setApiEndpoints] = useState<APIEndpoint[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    loadDocumentationData();
    loadAPIDocumentation();
  }, []);

  const loadDocumentationData = () => {
    const sections: DocSection[] = [
      {
        id: 'getting-started',
        title: 'Guia de Introdução',
        type: 'guide',
        status: 'complete',
        description: 'Como começar a usar o sistema - primeiro login até configuração inicial',
        lastUpdated: '2024-01-15',
        completeness: 95,
        downloadable: true
      },
      {
        id: 'user-manual',
        title: 'Manual do Usuário',
        type: 'guide',
        status: 'partial',
        description: 'Guia completo de todas as funcionalidades do sistema',
        lastUpdated: '2024-01-10',
        completeness: 78,
        downloadable: true
      },
      {
        id: 'admin-guide',
        title: 'Guia do Administrador',
        type: 'guide',
        status: 'partial',
        description: 'Configurações administrativas, gerenciamento de usuários e sistema',
        lastUpdated: '2024-01-08',
        completeness: 65,
        downloadable: true
      },
      {
        id: 'api-reference',
        title: 'Referência da API',
        type: 'api',
        status: 'complete',
        description: 'Documentação completa de todos os endpoints da API',
        lastUpdated: '2024-01-14',
        completeness: 92,
        url: '/api/docs'
      },
      {
        id: 'integration-guide',
        title: 'Guia de Integração',
        type: 'reference',
        status: 'partial',
        description: 'Como integrar com sistemas externos via API',
        lastUpdated: '2024-01-05',
        completeness: 60,
        downloadable: true
      },
      {
        id: 'video-onboarding',
        title: 'Vídeo: Primeiros Passos',
        type: 'video',
        status: 'complete',
        description: 'Tutorial em vídeo mostrando os primeiros passos no sistema',
        lastUpdated: '2024-01-12',
        completeness: 100,
        url: '/videos/onboarding.mp4'
      },
      {
        id: 'video-advanced',
        title: 'Vídeo: Funcionalidades Avançadas',
        type: 'video',
        status: 'partial',
        description: 'Tutorial sobre funcionalidades avançadas e casos de uso complexos',
        lastUpdated: '2024-01-01',
        completeness: 45,
        url: '/videos/advanced.mp4'
      },
      {
        id: 'troubleshooting',
        title: 'Solução de Problemas',
        type: 'reference',
        status: 'partial',
        description: 'Base de conhecimento para resolver problemas comuns',
        lastUpdated: '2024-01-07',
        completeness: 70,
        downloadable: true
      },
      {
        id: 'architecture-overview',
        title: 'Visão Geral da Arquitetura',
        type: 'reference',
        status: 'complete',
        description: 'Documentação técnica da arquitetura do sistema',
        lastUpdated: '2024-01-13',
        completeness: 88,
        downloadable: true
      },
      {
        id: 'deployment-guide',
        title: 'Guia de Deploy',
        type: 'guide',
        status: 'missing',
        description: 'Instruções para deploy em produção e configuração de ambiente',
        lastUpdated: '2023-12-20',
        completeness: 25
      },
      {
        id: 'security-best-practices',
        title: 'Melhores Práticas de Segurança',
        type: 'guide',
        status: 'partial',
        description: 'Guia de configurações e práticas de segurança recomendadas',
        lastUpdated: '2024-01-09',
        completeness: 55,
        downloadable: true
      },
      {
        id: 'performance-optimization',
        title: 'Otimização de Performance',
        type: 'reference',
        status: 'partial',
        description: 'Guia para otimizar performance da aplicação',
        lastUpdated: '2024-01-06',
        completeness: 40
      }
    ];

    setDocSections(sections);
  };

  const loadAPIDocumentation = () => {
    const endpoints: APIEndpoint[] = [
      {
        method: 'GET',
        path: '/api/users',
        description: 'Listar usuários do sistema',
        documented: true,
        examples: true
      },
      {
        method: 'POST',
        path: '/api/users',
        description: 'Criar novo usuário',
        documented: true,
        examples: true
      },
      {
        method: 'GET',
        path: '/api/users/{id}',
        description: 'Obter dados de um usuário específico',
        documented: true,
        examples: false
      },
      {
        method: 'PUT',
        path: '/api/users/{id}',
        description: 'Atualizar dados do usuário',
        documented: true,
        examples: true
      },
      {
        method: 'DELETE',
        path: '/api/users/{id}',
        description: 'Remover usuário',
        documented: false,
        examples: false
      },
      {
        method: 'GET',
        path: '/api/dashboard/metrics',
        description: 'Obter métricas do dashboard',
        documented: true,
        examples: true
      },
      {
        method: 'GET',
        path: '/api/analytics',
        description: 'Dados de analytics do sistema',
        documented: true,
        examples: false
      },
      {
        method: 'POST',
        path: '/api/auth/login',
        description: 'Autenticar usuário',
        documented: true,
        examples: true
      },
      {
        method: 'POST',
        path: '/api/auth/logout',
        description: 'Logout do usuário',
        documented: false,
        examples: false
      },
      {
        method: 'GET',
        path: '/api/projects',
        description: 'Listar projetos',
        documented: true,
        examples: true
      },
      {
        method: 'POST',
        path: '/api/projects',
        description: 'Criar novo projeto',
        documented: true,
        examples: false
      },
      {
        method: 'GET',
        path: '/api/notifications',
        description: 'Obter notificações do usuário',
        documented: false,
        examples: false
      }
    ];

    setApiEndpoints(endpoints);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <BookOpen className="h-4 w-4" />;
      case 'api': return <Code className="h-4 w-4" />;
      case 'tutorial': return <Play className="h-4 w-4" />;
      case 'reference': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-500';
      case 'partial': return 'bg-yellow-500';
      case 'outdated': return 'bg-orange-500';
      case 'missing': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle2 className="h-4 w-4" />;
      case 'partial': return <AlertCircle className="h-4 w-4" />;
      case 'outdated': return <AlertCircle className="h-4 w-4" />;
      case 'missing': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500';
      case 'POST': return 'bg-green-500';
      case 'PUT': return 'bg-yellow-500';
      case 'DELETE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredSections = docSections.filter(section => {
    const matchesSearch = section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         section.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || section.type === selectedType;
    return matchesSearch && matchesType;
  });

  const completeSections = docSections.filter(s => s.status === 'complete').length;
  const partialSections = docSections.filter(s => s.status === 'partial').length;
  const missingSections = docSections.filter(s => s.status === 'missing').length;
  const overallCompleteness = Math.round(
    docSections.reduce((acc, section) => acc + section.completeness, 0) / docSections.length
  );

  const documentedEndpoints = apiEndpoints.filter(e => e.documented).length;
  const endpointsWithExamples = apiEndpoints.filter(e => e.examples).length;
  const apiCompleteness = Math.round((documentedEndpoints / apiEndpoints.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Centro de Documentação Completa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${overallCompleteness >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                {overallCompleteness}%
              </div>
              <div className="text-sm text-muted-foreground">Completude Geral</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{completeSections}</div>
              <div className="text-sm text-muted-foreground">Completas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{partialSections}</div>
              <div className="text-sm text-muted-foreground">Parciais</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{missingSections}</div>
              <div className="text-sm text-muted-foreground">Faltando</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles de Busca e Filtro */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar documentação..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedType === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedType('all')}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={selectedType === 'guide' ? 'default' : 'outline'}
                onClick={() => setSelectedType('guide')}
                size="sm"
              >
                Guias
              </Button>
              <Button
                variant={selectedType === 'api' ? 'default' : 'outline'}
                onClick={() => setSelectedType('api')}
                size="sm"
              >
                API
              </Button>
              <Button
                variant={selectedType === 'video' ? 'default' : 'outline'}
                onClick={() => setSelectedType('video')}
                size="sm"
              >
                Vídeos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="docs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="docs">Documentação</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="videos">Tutoriais</TabsTrigger>
        </TabsList>

        <TabsContent value="docs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSections.map((section) => (
              <Card key={section.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(section.type)}
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(section.status)}>
                        {section.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                    
                    <div className="flex justify-between text-sm">
                      <span>Completude</span>
                      <span className="font-bold">{section.completeness}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${section.completeness}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Atualizado: {new Date(section.lastUpdated).toLocaleDateString('pt-BR')}
                      </span>
                      <div className="flex gap-2">
                        {section.downloadable && (
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            PDF
                          </Button>
                        )}
                        {section.url && (
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Abrir
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Referência da API</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {documentedEndpoints}/{apiEndpoints.length} documentados
                  </Badge>
                  <Badge className={`${apiCompleteness >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`}>
                    {apiCompleteness}% completo
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <div>
                        <div className="font-mono font-medium">{endpoint.path}</div>
                        <div className="text-sm text-muted-foreground">{endpoint.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {endpoint.documented ? (
                        <Badge className="bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Doc
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Sem Doc
                        </Badge>
                      )}
                      {endpoint.examples ? (
                        <Badge variant="outline">
                          <Code className="h-3 w-3 mr-1" />
                          Exemplos
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Sem Exemplos
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {docSections.filter(s => s.type === 'video').map((video) => (
              <Card key={video.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      {video.title}
                    </CardTitle>
                    <Badge className={getStatusColor(video.status)}>
                      {video.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        Assistir Tutorial
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Atualizado: {new Date(video.lastUpdated).toLocaleDateString('pt-BR')}
                      </span>
                      <div className="text-sm font-medium">
                        {video.completeness}% completo
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentationCenter;
