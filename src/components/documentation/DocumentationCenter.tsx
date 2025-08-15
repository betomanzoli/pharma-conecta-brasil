
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Book, 
  Code, 
  HelpCircle, 
  Search,
  Download,
  ExternalLink,
  Video,
  MessageCircle
} from 'lucide-react';

interface DocumentationItem {
  id: string;
  title: string;
  type: 'guide' | 'api' | 'tutorial' | 'faq' | 'video';
  category: string;
  description: string;
  tags: string[];
  lastUpdated: string;
  downloadUrl?: string;
  externalUrl?: string;
}

const DocumentationCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const documentationItems: DocumentationItem[] = [
    {
      id: 'user-guide-1',
      title: 'Guia do Usuário - Fase 1: AI Matching',
      type: 'guide',
      category: 'user-guides',
      description: 'Como utilizar o sistema de matching inteligente para conectar empresas e laboratórios',
      tags: ['ai', 'matching', 'empresas', 'laboratórios'],
      lastUpdated: '2024-01-15',
      downloadUrl: '/docs/user-guide-phase1.pdf'
    },
    {
      id: 'api-docs-1',
      title: 'API Reference - Collaborative Governance',
      type: 'api',
      category: 'api-docs',
      description: 'Documentação completa da API de governança colaborativa',
      tags: ['api', 'governance', 'endpoints', 'rest'],
      lastUpdated: '2024-01-14',
      externalUrl: '/api-docs/governance'
    },
    {
      id: 'tutorial-1',
      title: 'Tutorial: Configuração de Shared Value',
      type: 'tutorial',
      category: 'tutorials',
      description: 'Passo a passo para configurar e otimizar o sistema de valor compartilhado',
      tags: ['tutorial', 'shared-value', 'configuração'],
      lastUpdated: '2024-01-13',
      downloadUrl: '/docs/tutorial-shared-value.pdf'
    },
    {
      id: 'faq-1',
      title: 'FAQ - Compliance e Regulamentações',
      type: 'faq',
      category: 'faqs',
      description: 'Perguntas frequentes sobre compliance, ANVISA e regulamentações',
      tags: ['faq', 'compliance', 'anvisa', 'regulamentações'],
      lastUpdated: '2024-01-12'
    },
    {
      id: 'tech-doc-1',
      title: 'Documentação Técnica - Arquitetura do Sistema',
      type: 'guide',
      category: 'technical',
      description: 'Arquitetura completa do sistema, componentes e integrações',
      tags: ['arquitetura', 'técnico', 'sistema', 'componentes'],
      lastUpdated: '2024-01-11',
      downloadUrl: '/docs/technical-architecture.pdf'
    },
    {
      id: 'api-docs-2',
      title: 'API Reference - Predictive Analysis',
      type: 'api',
      category: 'api-docs',
      description: 'Documentação da API de análise preditiva e métricas avançadas',
      tags: ['api', 'predictive', 'analytics', 'metrics'],
      lastUpdated: '2024-01-10',
      externalUrl: '/api-docs/predictive'
    },
    {
      id: 'video-1',
      title: 'Vídeo Tutorial - Dashboard Overview',
      type: 'video',
      category: 'tutorials',
      description: 'Visão geral do dashboard principal e suas funcionalidades',
      tags: ['video', 'dashboard', 'overview', 'tutorial'],
      lastUpdated: '2024-01-09',
      externalUrl: 'https://youtube.com/watch?v=dashboard-overview'
    },
    {
      id: 'trouble-1',
      title: 'Troubleshooting Guide',
      type: 'guide',
      category: 'troubleshooting',
      description: 'Guia de resolução de problemas comuns e soluções',
      tags: ['troubleshooting', 'problemas', 'soluções', 'suporte'],
      lastUpdated: '2024-01-08',
      downloadUrl: '/docs/troubleshooting-guide.pdf'
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', count: documentationItems.length },
    { id: 'user-guides', name: 'Guias do Usuário', count: documentationItems.filter(item => item.category === 'user-guides').length },
    { id: 'api-docs', name: 'Documentação API', count: documentationItems.filter(item => item.category === 'api-docs').length },
    { id: 'tutorials', name: 'Tutoriais', count: documentationItems.filter(item => item.category === 'tutorials').length },
    { id: 'technical', name: 'Documentação Técnica', count: documentationItems.filter(item => item.category === 'technical').length },
    { id: 'troubleshooting', name: 'Resolução de Problemas', count: documentationItems.filter(item => item.category === 'troubleshooting').length },
    { id: 'faqs', name: 'FAQs', count: documentationItems.filter(item => item.category === 'faqs').length }
  ];

  const filteredItems = documentationItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <Book className="h-4 w-4" />;
      case 'api': return <Code className="h-4 w-4" />;
      case 'tutorial': return <FileText className="h-4 w-4" />;
      case 'faq': return <HelpCircle className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return 'bg-blue-500';
      case 'api': return 'bg-green-500';
      case 'tutorial': return 'bg-purple-500';
      case 'faq': return 'bg-orange-500';
      case 'video': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <FileText className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Centro de Documentação
            </h1>
            <p className="text-muted-foreground">Documentação completa e recursos de aprendizagem</p>
          </div>
        </div>
      </div>

      {/* Busca e Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar documentação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-1"
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-1">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentação */}
      <Tabs defaultValue="grid" className="space-y-6">
        <TabsList>
          <TabsTrigger value="grid">Visualização em Grade</TabsTrigger>
          <TabsTrigger value="list">Lista Detalhada</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${getTypeColor(item.type)} text-white`}>
                        {getTypeIcon(item.type)}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Atualizado: {new Date(item.lastUpdated).toLocaleDateString('pt-BR')}
                      </span>
                      <div className="flex gap-2">
                        {item.downloadUrl && (
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        )}
                        {item.externalUrl && (
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

        <TabsContent value="list">
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${getTypeColor(item.type)} text-white`}>
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{item.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {item.type.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Atualizado: {new Date(item.lastUpdated).toLocaleDateString('pt-BR')}</span>
                          <div className="flex gap-1">
                            {item.tags.slice(0, 4).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {item.downloadUrl && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                      {item.externalUrl && (
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Abrir
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Suporte */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Precisa de Ajuda?</h3>
            <p className="text-muted-foreground">
              Não encontrou o que procurava? Nossa equipe está aqui para ajudar.
            </p>
            <div className="flex justify-center gap-4">
              <Button className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Contatar Suporte
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Central de Ajuda
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentationCenter;
