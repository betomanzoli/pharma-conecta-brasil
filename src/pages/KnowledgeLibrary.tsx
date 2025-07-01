
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Video, FileText, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import KnowledgeCard from '@/components/knowledge/KnowledgeCard';
import KnowledgeFilters from '@/components/knowledge/KnowledgeFilters';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'guide' | 'template';
  category: string;
  author: string;
  downloads: number;
  views: number;
  rating: number;
  created_at: string;
  file_size?: string;
  duration?: string;
  is_premium: boolean;
}

const KnowledgeLibrary = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<KnowledgeItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKnowledgeItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchTerm, typeFilter, categoryFilter, items]);

  const fetchKnowledgeItems = async () => {
    try {
      // Mock data - em produção, viria do Supabase
      const mockItems: KnowledgeItem[] = [
        {
          id: '1',
          title: 'Guia Completo de Registro na ANVISA',
          description: 'Manual completo com todos os procedimentos necessários para registro de medicamentos na ANVISA.',
          type: 'guide',
          category: 'regulatory',
          author: 'ANVISA',
          downloads: 1250,
          views: 3400,
          rating: 4.8,
          created_at: '2024-01-10T00:00:00Z',
          file_size: '2.5 MB',
          is_premium: false
        },
        {
          id: '2',
          title: 'Webinar: Novas Diretrizes de Farmacovigilância',
          description: 'Apresentação sobre as recentes mudanças nas diretrizes de farmacovigilância.',
          type: 'video',
          category: 'regulatory',
          author: 'Dr. Maria Silva',
          downloads: 890,
          views: 2100,
          rating: 4.6,
          created_at: '2024-01-08T00:00:00Z',
          duration: '45 min',
          is_premium: true
        },
        {
          id: '3',
          title: 'Template de Protocolo de Bioequivalência',
          description: 'Template padronizado para elaboração de protocolos de estudos de bioequivalência.',
          type: 'template',
          category: 'clinical',
          author: 'Instituto de Pesquisas',
          downloads: 2100,
          views: 4800,
          rating: 4.9,
          created_at: '2024-01-05T00:00:00Z',
          file_size: '1.2 MB',
          is_premium: false
        },
        {
          id: '4',
          title: 'Manual de Boas Práticas de Laboratório',
          description: 'Documento técnico sobre implementação de boas práticas em laboratórios farmacêuticos.',
          type: 'document',
          category: 'quality',
          author: 'Conselho Regional de Farmácia',
          downloads: 1670,
          views: 3200,
          rating: 4.7,
          created_at: '2024-01-03T00:00:00Z',
          file_size: '3.8 MB',
          is_premium: false
        }
      ];

      setItems(mockItems);
      setFilteredItems(mockItems);
    } catch (error) {
      console.error('Error fetching knowledge items:', error);
      toast({
        title: "Erro ao carregar recursos",
        description: "Não foi possível carregar a biblioteca de conhecimento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredItems(filtered);
  };

  const handleView = (itemId: string) => {
    toast({
      title: "Visualizando recurso",
      description: "Abrindo o recurso selecionado",
    });
  };

  const handleDownload = (itemId: string) => {
    toast({
      title: "Download iniciado",
      description: "O download do recurso foi iniciado",
    });
  };

  const handleUpload = () => {
    toast({
      title: "Upload de recurso",
      description: "Funcionalidade de upload será implementada",
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Biblioteca de Conhecimento
            </h1>
            <p className="text-gray-600 mt-2">
              Acesse recursos educacionais, documentos técnicos e templates especializados
            </p>
          </div>

          <Tabs defaultValue="all-resources" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all-resources" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Todos</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Documentos</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center space-x-2">
                <Video className="h-4 w-4" />
                <span>Vídeos</span>
              </TabsTrigger>
              <TabsTrigger value="popular" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Populares</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all-resources" className="space-y-6">
              <KnowledgeFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                onUpload={handleUpload}
              />

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-20 bg-gray-200 rounded mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum recurso encontrado
                    </h3>
                    <p className="text-gray-600">
                      Tente ajustar os filtros de busca
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <KnowledgeCard
                      key={item.id}
                      item={item}
                      onView={handleView}
                      onDownload={handleDownload}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="documents">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.filter(item => item.type === 'document' || item.type === 'guide').map((item) => (
                  <KnowledgeCard
                    key={item.id}
                    item={item}
                    onView={handleView}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.filter(item => item.type === 'video').map((item) => (
                  <KnowledgeCard
                    key={item.id}
                    item={item}
                    onView={handleView}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="popular">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.sort((a, b) => b.downloads - a.downloads).map((item) => (
                  <KnowledgeCard
                    key={item.id}
                    item={item}
                    onView={handleView}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default KnowledgeLibrary;
