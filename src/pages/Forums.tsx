
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, TrendingUp, Pin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import ForumCard from '@/components/forums/ForumCard';
import ForumFilters from '@/components/forums/ForumFilters';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface ForumTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  author: {
    name: string;
    avatar_url?: string;
  };
  replies_count: number;
  views_count: number;
  is_pinned: boolean;
  is_trending: boolean;
  last_activity: string;
  created_at: string;
}

const Forums = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<ForumTopic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    filterAndSortTopics();
  }, [searchTerm, categoryFilter, sortBy, topics]);

  const fetchTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_topics')
        .select(`
          *,
          author:profiles!forum_topics_author_id_fkey(first_name, last_name)
        `)
        .order('is_pinned', { ascending: false })
        .order('last_activity_at', { ascending: false });

      if (error) throw error;

      const formattedTopics: ForumTopic[] = data.map(topic => ({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        category: topic.category,
        author: {
          name: `${topic.author?.first_name || ''} ${topic.author?.last_name || ''}`.trim() || 'Usuário',
          avatar_url: undefined
        },
        replies_count: topic.replies_count,
        views_count: topic.views_count,
        is_pinned: topic.is_pinned,
        is_trending: topic.views_count > 150, // Define trending como mais de 150 visualizações
        last_activity: topic.last_activity_at,
        created_at: topic.created_at
      }));

      setTopics(formattedTopics);
      setFilteredTopics(formattedTopics);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast({
        title: "Erro ao carregar tópicos",
        description: "Não foi possível carregar os tópicos do fórum",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTopics = () => {
    let filtered = topics;

    if (searchTerm) {
      filtered = filtered.filter(topic =>
        topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(topic => topic.category === categoryFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime();
        case 'popular':
          return b.views_count - a.views_count;
        case 'trending':
          if (a.is_trending && !b.is_trending) return -1;
          if (!a.is_trending && b.is_trending) return 1;
          return b.views_count - a.views_count;
        case 'replies':
          return b.replies_count - a.replies_count;
        default:
          return 0;
      }
    });

    // Pinned topics always on top
    const pinned = filtered.filter(topic => topic.is_pinned);
    const regular = filtered.filter(topic => !topic.is_pinned);
    
    setFilteredTopics([...pinned, ...regular]);
  };

  const handleTopicClick = async (topicId: string) => {
    try {
      // Incrementar contador de visualizações
      await supabase
        .from('forum_topics')
        .update({ 
          views_count: topics.find(t => t.id === topicId)?.views_count + 1 || 1 
        })
        .eq('id', topicId);
      
      // Navegar para a página do tópico
      navigate(`/forums/${topicId}`);
    } catch (error) {
      console.error('Error updating views:', error);
      navigate(`/forums/${topicId}`);
    }
  };

  const handleCreateTopic = () => {
    toast({
      title: "Criar novo tópico",
      description: "Funcionalidade de criação de tópicos será implementada",
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Fóruns de Discussão
            </h1>
            <p className="text-gray-600 mt-2">
              Participe de discussões sobre tendências e desafios do setor farmacêutico
            </p>
          </div>

          <Tabs defaultValue="all-topics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all-topics" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Todos os Tópicos</span>
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Em Alta</span>
              </TabsTrigger>
              <TabsTrigger value="pinned" className="flex items-center space-x-2">
                <Pin className="h-4 w-4" />
                <span>Fixados</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all-topics" className="space-y-6">
              <ForumFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onCreateTopic={handleCreateTopic}
              />

              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredTopics.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum tópico encontrado
                    </h3>
                    <p className="text-gray-600">
                      Tente ajustar os filtros de busca ou criar um novo tópico
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredTopics.map((topic) => (
                    <ForumCard
                      key={topic.id}
                      topic={topic}
                      onClick={handleTopicClick}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="trending">
              <div className="space-y-4">
                {filteredTopics.filter(topic => topic.is_trending).map((topic) => (
                  <ForumCard
                    key={topic.id}
                    topic={topic}
                    onClick={handleTopicClick}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pinned">
              <div className="space-y-4">
                {filteredTopics.filter(topic => topic.is_pinned).map((topic) => (
                  <ForumCard
                    key={topic.id}
                    topic={topic}
                    onClick={handleTopicClick}
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

export default Forums;
