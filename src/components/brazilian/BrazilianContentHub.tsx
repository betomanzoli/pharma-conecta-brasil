import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  FileText, 
  Users, 
  Award, 
  TrendingUp,
  MessageCircle,
  Calendar,
  Search,
  Filter,
  Download,
  ExternalLink,
  Eye,
  Heart,
  Share2,
  Clock,
  Tag
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'case_study' | 'regulation' | 'white_paper' | 'webinar' | 'guide';
  category: string;
  author: {
    name: string;
    title: string;
    company: string;
    avatar?: string;
  };
  content: {
    summary: string;
    reading_time: number;
    tags: string[];
    brazilian_focus: boolean;
  };
  engagement: {
    views: number;
    likes: number;
    shares: number;
    downloads: number;
  };
  metadata: {
    published_at: string;
    updated_at: string;
    regulation_references: string[];
    target_audience: string[];
  };
  featured: boolean;
  anvisa_related: boolean;
}

const BrazilianContentHub = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showAnvisaOnly, setShowAnvisaOnly] = useState(false);

  const contentTypes = [
    { value: 'all', label: 'Todos os Tipos', icon: BookOpen },
    { value: 'article', label: 'Artigos', icon: FileText },
    { value: 'case_study', label: 'Casos de Sucesso', icon: TrendingUp },
    { value: 'regulation', label: 'Regulamentações', icon: Award },
    { value: 'white_paper', label: 'White Papers', icon: FileText },
    { value: 'webinar', label: 'Webinars', icon: Users },
    { value: 'guide', label: 'Guias Práticos', icon: BookOpen }
  ];

  const categories = [
    'Todos',
    'Regulamentação ANVISA',
    'Aprendizado Federado',
    'AI no Setor Farmacêutico',
    'Blockchain e Governança',
    'Inovação Colaborativa',
    'Mercado Brasileiro',
    'Compliance e LGPD',
    'Casos de Sucesso',
    'Tecnologia e Inovação'
  ];

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    filterContent();
  }, [searchTerm, selectedCategory, selectedType, showAnvisaOnly, content]);

  const loadContent = async () => {
    setLoading(true);
    try {
      // Simulação de conteúdo brasileiro específico
      const mockContent: ContentItem[] = [
        {
          id: '1',
          title: 'Desafios da Indústria Farmacêutica Brasileira em 2025',
          type: 'article',
          category: 'Mercado Brasileiro',
          author: {
            name: 'Dr. Carlos Silva',
            title: 'Especialista Regulatório',
            company: 'ANVISA'
          },
          content: {
            summary: 'Uma análise abrangente dos principais desafios que a indústria farmacêutica brasileira enfrentará em 2025, incluindo novas regulamentações, transformação digital e sustentabilidade.',
            reading_time: 12,
            tags: ['ANVISA', 'Regulamentação', 'Mercado Brasileiro', 'Transformação Digital'],
            brazilian_focus: true
          },
          engagement: {
            views: 2847,
            likes: 156,
            shares: 89,
            downloads: 234
          },
          metadata: {
            published_at: '2025-01-15T10:00:00Z',
            updated_at: '2025-01-15T10:00:00Z',
            regulation_references: ['RDC 166/2017', 'RDC 843/2018'],
            target_audience: ['Indústria', 'Regulatório', 'Executivos']
          },
          featured: true,
          anvisa_related: true
        },
        {
          id: '2',
          title: 'Como o AI Matching da PharmaConnect Resolve Problemas Reais',
          type: 'case_study',
          category: 'AI no Setor Farmacêutico',
          author: {
            name: 'Ana Paula Santos',
            title: 'Head de IA',
            company: 'PharmaConnect Brasil'
          },
          content: {
            summary: 'Estudo de caso detalhado mostrando como nossa tecnologia de AI Matching conectou uma farmacêutica de genéricos com o laboratório ideal, resultando em 40% de redução no tempo de aprovação ANVISA.',
            reading_time: 8,
            tags: ['AI Matching', 'Caso de Sucesso', 'Farmacêutica', 'Eficiência'],
            brazilian_focus: true
          },
          engagement: {
            views: 1956,
            likes: 234,
            shares: 156,
            downloads: 89
          },
          metadata: {
            published_at: '2025-01-12T14:30:00Z',
            updated_at: '2025-01-12T14:30:00Z',
            regulation_references: ['RDC 166/2017'],
            target_audience: ['Indústria', 'Laboratórios', 'Consultores']
          },
          featured: false,
          anvisa_related: true
        },
        {
          id: '3',
          title: 'Implementação de Aprendizado Federado no Setor Farmacêutico',
          type: 'white_paper',
          category: 'Aprendizado Federado',
          author: {
            name: 'Prof. Maria Oliveira',
            title: 'Pesquisadora',
            company: 'USP'
          },
          content: {
            summary: 'White paper técnico explorando como o aprendizado federado pode revolucionar a colaboração no setor farmacêutico brasileiro, mantendo a privacidade dos dados e acelerando a inovação.',
            reading_time: 25,
            tags: ['Aprendizado Federado', 'Privacidade', 'Inovação', 'Colaboração'],
            brazilian_focus: true
          },
          engagement: {
            views: 1234,
            likes: 89,
            shares: 45,
            downloads: 167
          },
          metadata: {
            published_at: '2025-01-10T09:00:00Z',
            updated_at: '2025-01-10T09:00:00Z',
            regulation_references: ['LGPD'],
            target_audience: ['Pesquisadores', 'Desenvolvedores', 'Executivos']
          },
          featured: true,
          anvisa_related: false
        },
        {
          id: '4',
          title: 'RDC 843/2018: Guia Completo para Conformidade',
          type: 'guide',
          category: 'Regulamentação ANVISA',
          author: {
            name: 'João Ferreira',
            title: 'Consultor Regulatório',
            company: 'RegPharma Consultoria'
          },
          content: {
            summary: 'Guia prático passo a passo para garantir total conformidade com a RDC 843/2018, incluindo checklists, templates e casos práticos do mercado brasileiro.',
            reading_time: 18,
            tags: ['RDC 843', 'Compliance', 'ANVISA', 'Guia Prático'],
            brazilian_focus: true
          },
          engagement: {
            views: 3456,
            likes: 289,
            shares: 178,
            downloads: 456
          },
          metadata: {
            published_at: '2025-01-08T11:00:00Z',
            updated_at: '2025-01-08T11:00:00Z',
            regulation_references: ['RDC 843/2018', 'RDC 166/2017'],
            target_audience: ['Regulatório', 'Compliance', 'Qualidade']
          },
          featured: false,
          anvisa_related: true
        },
        {
          id: '5',
          title: 'Blockchain para Governança Descentralizada na Farmacêutica',
          type: 'article',
          category: 'Blockchain e Governança',
          author: {
            name: 'Ricardo Lima',
            title: 'CTO',
            company: 'PharmaConnect Brasil'
          },
          content: {
            summary: 'Explorando como a tecnologia blockchain pode criar sistemas de governança transparentes e descentralizados para colaborações farmacêuticas no Brasil.',
            reading_time: 15,
            tags: ['Blockchain', 'Governança', 'Descentralização', 'Transparência'],
            brazilian_focus: true
          },
          engagement: {
            views: 1789,
            likes: 134,
            shares: 67,
            downloads: 89
          },
          metadata: {
            published_at: '2025-01-05T16:00:00Z',
            updated_at: '2025-01-05T16:00:00Z',
            regulation_references: ['LGPD'],
            target_audience: ['Desenvolvedores', 'Executivos', 'Pesquisadores']
          },
          featured: false,
          anvisa_related: false
        }
      ];

      setContent(mockContent);
      setFilteredContent(mockContent);
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error);
      toast({
        title: "Erro ao carregar conteúdo",
        description: "Não foi possível carregar o hub de conteúdo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterContent = () => {
    let filtered = content;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all' && selectedCategory !== 'Todos') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    if (showAnvisaOnly) {
      filtered = filtered.filter(item => item.anvisa_related);
    }

    setFilteredContent(filtered);
  };

  const handleLike = (contentId: string) => {
    setContent(prev => prev.map(item =>
      item.id === contentId
        ? { ...item, engagement: { ...item.engagement, likes: item.engagement.likes + 1 } }
        : item
    ));
    toast({
      title: "Conteúdo curtido!",
      description: "Obrigado pelo seu feedback",
    });
  };

  const handleShare = (contentId: string) => {
    toast({
      title: "Link copiado!",
      description: "O link do conteúdo foi copiado para a área de transferência",
    });
  };

  const handleDownload = (contentId: string) => {
    setContent(prev => prev.map(item =>
      item.id === contentId
        ? { ...item, engagement: { ...item.engagement, downloads: item.engagement.downloads + 1 } }
        : item
    ));
    toast({
      title: "Download iniciado",
      description: "O conteúdo está sendo baixado",
    });
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = contentTypes.find(t => t.value === type);
    const Icon = typeConfig?.icon || FileText;
    return <Icon className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl text-gray-900">Hub de Conteúdo Brasileiro</span>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-6 h-4 bg-green-500 rounded-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1/3 bg-green-500"></div>
                  <div className="absolute top-1/3 left-0 w-full h-1/3 bg-yellow-400"></div>
                  <div className="absolute top-2/3 left-0 w-full h-1/3 bg-blue-600"></div>
                </div>
                <span className="text-sm text-gray-600">
                  Conhecimento especializado para o mercado farmacêutico brasileiro
                </span>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros de Conteúdo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Buscar conteúdo
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Pesquisar artigos, guias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {categories.map(category => (
                  <option key={category} value={category === 'Todos' ? 'all' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Tipo de Conteúdo
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {contentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Filtros Especiais
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showAnvisaOnly}
                  onChange={(e) => setShowAnvisaOnly(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Apenas conteúdo ANVISA</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Content */}
      {filteredContent.some(item => item.featured) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-yellow-500" />
              <span>Conteúdo em Destaque</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredContent.filter(item => item.featured).map((item) => (
                <Card key={item.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 border-l-4 border-l-yellow-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(item.type)}
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Destaque
                        </Badge>
                        {item.anvisa_related && (
                          <Badge className="bg-green-100 text-green-800">
                            <Award className="h-3 w-3 mr-1" />
                            ANVISA
                          </Badge>
                        )}
                      </div>
                      <div className="w-6 h-4 bg-green-500 rounded-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1/3 bg-green-500"></div>
                        <div className="absolute top-1/3 left-0 w-full h-1/3 bg-yellow-400"></div>
                        <div className="absolute top-2/3 left-0 w-full h-1/3 bg-blue-600"></div>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-700 text-sm mb-4">{item.content.summary}</p>

                    <div className="flex items-center space-x-4 text-xs text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{item.content.reading_time} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{item.engagement.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(item.metadata.published_at)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.content.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-600">
                        Por {item.author.name} • {item.author.company}
                      </div>
                      <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                        Ler Agora
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Todo o Conteúdo ({filteredContent.length})
          </h3>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              🇧🇷 Conteúdo Nacional
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              {filteredContent.filter(item => item.anvisa_related).length} relacionados à ANVISA
            </Badge>
          </div>
        </div>

        {filteredContent.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getTypeIcon(item.type)}
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {contentTypes.find(t => t.value === item.type)?.label}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{item.category}</span>
                    {item.anvisa_related && (
                      <Badge className="bg-green-100 text-green-800">
                        <Award className="h-3 w-3 mr-1" />
                        ANVISA
                      </Badge>
                    )}
                    <div className="w-6 h-4 bg-green-500 rounded-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1/3 bg-green-500"></div>
                      <div className="absolute top-1/3 left-0 w-full h-1/3 bg-yellow-400"></div>
                      <div className="absolute top-2/3 left-0 w-full h-1/3 bg-blue-600"></div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-700 text-sm mb-4">{item.content.summary}</p>

                  <div className="flex items-center space-x-4 text-xs text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.content.reading_time} min de leitura</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{item.engagement.views} visualizações</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(item.metadata.published_at)}</span>
                    </div>
                    <div className="text-gray-600">
                      Por {item.author.name} • {item.author.company}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.content.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {item.metadata.regulation_references.length > 0 && (
                    <div className="mb-4">
                      <span className="text-xs font-medium text-gray-700">Regulamentações referenciadas:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.metadata.regulation_references.map((ref, idx) => (
                          <Badge key={idx} className="bg-blue-100 text-blue-800 text-xs">
                            {ref}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(item.id)}
                    className="flex items-center space-x-1"
                  >
                    <Heart className="h-4 w-4" />
                    <span>{item.engagement.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare(item.id)}
                    className="flex items-center space-x-1"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>{item.engagement.shares}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(item.id)}
                    className="flex items-center space-x-1"
                  >
                    <Download className="h-4 w-4" />
                    <span>{item.engagement.downloads}</span>
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Ler Mais
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                  {item.type === 'white_paper' || item.type === 'guide' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Download className="h-3 w-3 mr-1" />
                      Download PDF
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum conteúdo encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Tente ajustar os filtros ou termos de busca
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedType('all');
              setShowAnvisaOnly(false);
            }}>
              Limpar Filtros
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BrazilianContentHub;