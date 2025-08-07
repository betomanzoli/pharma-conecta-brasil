
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Star, 
  BookOpen, 
  FileText, 
  Video, 
  Link,
  Calendar,
  User,
  Building,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import DemoModeIndicator from '@/components/layout/DemoModeIndicator';

// Dados simulados para demonstração
const knowledgeItems = [
  {
    id: '1',
    title: 'Guia Completo de Registro de Medicamentos na ANVISA 2024',
    description: 'Manual atualizado com todos os procedimentos para registro de medicamentos, incluindo as últimas mudanças na RDC 473/2021.',
    type: 'document',
    author: 'Dr. Maria Silva',
    organization: 'Consultoria Regulatória MS',
    category: 'Regulatório',
    rating: 4.8,
    ratingsCount: 234,
    downloadsCount: 1520,
    createdAt: '2024-01-15',
    tags: ['ANVISA', 'Registro', 'Medicamentos', 'RDC 473'],
    fileSize: '2.4 MB',
    pages: 85,
    isReal: false
  },
  {
    id: '2',
    title: 'Validação de Métodos Analíticos - Boas Práticas',
    description: 'Documento técnico sobre validação de métodos analíticos conforme ICH Q2(R1) e requisitos da ANVISA.',
    type: 'document',
    author: 'Farmacêutica Ana Costa',
    organization: 'Laboratório Central SP',
    category: 'Qualidade',
    rating: 4.9,
    ratingsCount: 156,
    downloadsCount: 890,
    createdAt: '2024-01-10',
    tags: ['Validação', 'Métodos Analíticos', 'ICH Q2', 'Qualidade'],
    fileSize: '1.8 MB',
    pages: 62,
    isReal: false
  },
  {
    id: '3',
    title: 'Webinar: Tendências do Mercado Farmacêutico Brasileiro 2024',
    description: 'Apresentação sobre as principais tendências, oportunidades e desafios do setor farmacêutico nacional.',
    type: 'video',
    author: 'Prof. João Santos',
    organization: 'Universidade Federal RJ',
    category: 'Mercado',
    rating: 4.6,
    ratingsCount: 89,
    downloadsCount: 445,
    createdAt: '2024-01-08',
    tags: ['Mercado', 'Tendências', 'Brasil', 'Farmacêutico'],
    duration: '1h 30min',
    isReal: false
  },
  {
    id: '4',
    title: 'Checklist para Inspeção de BPF em Indústrias Farmacêuticas',
    description: 'Lista de verificação completa baseada na RDC 301/2019 para preparação de inspeções de Boas Práticas de Fabricação.',
    type: 'document',
    author: 'Inspetor Carlos Rodrigues',
    organization: 'ANVISA',
    category: 'BPF',
    rating: 4.7,
    ratingsCount: 198,
    downloadsCount: 1230,
    createdAt: '2024-01-05',
    tags: ['BPF', 'Inspeção', 'RDC 301', 'Qualidade'],
    fileSize: '956 KB',
    pages: 28,
    isReal: false
  }
];

const categories = ['Todos', 'Regulatório', 'Qualidade', 'BPF', 'Mercado', 'Técnico'];
const types = ['Todos', 'document', 'video', 'link'];

const KnowledgeLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedType, setSelectedType] = useState('Todos');

  const filteredItems = knowledgeItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesType = selectedType === 'Todos' || item.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'link':
        return <Link className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'document':
        return 'Documento';
      case 'video':
        return 'Vídeo';
      case 'link':
        return 'Link';
      default:
        return 'Recurso';
    }
  };

  const handleView = (item: any) => {
    alert(`🔍 Visualização de "${item.title}"\n\n⚠️ MODO DEMONSTRAÇÃO:\nEsta funcionalidade está em desenvolvimento. Em produção, você poderia visualizar o documento completo.`);
  };

  const handleDownload = (item: any) => {
    alert(`💾 Download de "${item.title}"\n\n⚠️ MODO DEMONSTRAÇÃO:\nEsta funcionalidade está em desenvolvimento. Em produção, você poderia fazer o download real do arquivo.`);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Biblioteca de Conhecimento
            </h1>
            <p className="text-muted-foreground">
              Recursos técnicos, regulatórios e educacionais para o setor farmacêutico
            </p>
          </div>

          <DemoModeIndicator variant="alert" className="mb-6" />

          {/* Filtros e Busca */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título, descrição ou tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="space-x-2">
                    <span className="text-sm font-medium">Categoria:</span>
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="grid" className="space-y-6">
            <TabsList>
              <TabsTrigger value="grid">Visualização em Grade</TabsTrigger>
              <TabsTrigger value="list">Lista Detalhada</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(item.type)}
                          <Badge variant="outline">{getTypeLabel(item.type)}</Badge>
                        </div>
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <CardDescription className="line-clamp-3">
                        {item.description}
                      </CardDescription>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{item.author}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Building className="h-3 w-3" />
                          <span>{item.organization}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{item.rating}</span>
                            <span>({item.ratingsCount})</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="h-3 w-3" />
                            <span>{item.downloadsCount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm" onClick={() => handleView(item)}>
                          <Eye className="h-3 w-3 mr-1" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(item)}>
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              {filteredItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(item.type)}
                          <Badge variant="outline">{getTypeLabel(item.type)}</Badge>
                          <Badge variant="secondary">{item.category}</Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{item.author} • {item.organization}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{item.rating} ({item.ratingsCount})</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="h-4 w-4" />
                            <span>{item.downloadsCount.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => handleView(item)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Visualizar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(item)}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {filteredItems.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum recurso encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou termos de busca para encontrar recursos relevantes.
                </p>
              </CardContent>
            </Card>
          )}

          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>📚 Biblioteca em Desenvolvimento:</strong> Esta biblioteca contém dados de demonstração. 
              Em produção, os recursos serão carregados de bases de dados reais e APIs especializadas.
              <div className="mt-2 flex items-center space-x-2">
                <ExternalLink className="h-3 w-3" />
                <span className="text-sm">Status: Desenvolvimento ativo • Versão Beta planejada para Q2 2024</span>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default KnowledgeLibrary;
