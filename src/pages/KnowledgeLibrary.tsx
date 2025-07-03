
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
import { supabase } from '@/integrations/supabase/client';

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
      const { data, error } = await supabase
        .from('knowledge_items')
        .select(`
          *,
          author:profiles!knowledge_items_author_id_fkey(first_name, last_name)
        `)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedItems: KnowledgeItem[] = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.content_type as 'document' | 'video' | 'guide' | 'template',
        category: item.category,
        author: `${item.author?.first_name || ''} ${item.author?.last_name || ''}`.trim() || 'Autor',
        downloads: item.downloads_count,
        views: item.views_count,
        rating: Number(item.rating) || 0,
        created_at: item.created_at,
        file_size: item.file_size || undefined,
        duration: item.duration || undefined,
        is_premium: item.is_premium
      }));

      setItems(formattedItems);
      setFilteredItems(formattedItems);
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

  const handleView = async (itemId: string) => {
    try {
      // Incrementar contador de visualizações
      await supabase
        .from('knowledge_items')
        .update({ 
          views_count: items.find(item => item.id === itemId)?.views + 1 || 1 
        })
        .eq('id', itemId);

      // Simular abertura do recurso
      toast({
        title: "Recurso aberto",
        description: "Visualizando o recurso selecionado",
      });

      // Atualizar dados locais
      setItems(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, views: item.views + 1 }
          : item
      ));
    } catch (error) {
      console.error('Error updating views:', error);
      toast({
        title: "Erro",
        description: "Não foi possível abrir o recurso",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async (itemId: string) => {
    if (!profile?.id) {
      toast({
        title: "Acesso necessário",
        description: "Faça login para fazer download dos recursos",
        variant: "destructive"
      });
      return;
    }

    try {
      // Registrar download
      await supabase
        .from('knowledge_downloads')
        .insert({
          item_id: itemId,
          user_id: profile.id
        });

      toast({
        title: "Download iniciado",
        description: "O download do recurso foi iniciado com sucesso",
      });

      // Atualizar dados locais (o trigger no banco já incrementa automaticamente)
      setTimeout(() => {
        setItems(prev => prev.map(item => 
          item.id === itemId 
            ? { ...item, downloads: item.downloads + 1 }
            : item
        ));
      }, 500);
    } catch (error) {
      console.error('Error downloading:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível iniciar o download",
        variant: "destructive"
      });
    }
  };

  const handleRefresh = () => {
    fetchKnowledgeItems();
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
                onRefresh={handleRefresh}
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
