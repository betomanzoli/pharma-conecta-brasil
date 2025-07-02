import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  MessageSquare, 
  Eye, 
  ThumbsUp, 
  Pin, 
  Lock,
  Calendar,
  User
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface TopicData {
  id: string;
  title: string;
  description: string;
  category: string;
  author: {
    id: string;
    name: string;
  };
  views_count: number;
  replies_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  last_activity_at: string;
}

interface Reply {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  likes_count: number;
  is_solution: boolean;
  created_at: string;
  user_liked: boolean;
}

const ForumTopic = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();
  
  const [topic, setTopic] = useState<TopicData | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (topicId) {
      fetchTopicData();
      fetchReplies();
    }
  }, [topicId]);

  const fetchTopicData = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_topics')
        .select(`
          *,
          author:profiles!forum_topics_author_id_fkey(id, first_name, last_name)
        `)
        .eq('id', topicId)
        .single();

      if (error) throw error;

      setTopic({
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        author: {
          id: data.author.id,
          name: `${data.author.first_name || ''} ${data.author.last_name || ''}`.trim() || 'Usuário'
        },
        views_count: data.views_count,
        replies_count: data.replies_count,
        is_pinned: data.is_pinned,
        is_locked: data.is_locked,
        created_at: data.created_at,
        last_activity_at: data.last_activity_at
      });
    } catch (error) {
      console.error('Error fetching topic:', error);
      toast({
        title: "Erro ao carregar tópico",
        description: "Não foi possível carregar o tópico",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_replies')
        .select(`
          *,
          author:profiles!forum_replies_author_id_fkey(id, first_name, last_name),
          forum_reply_likes!inner(user_id)
        `)
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedReplies: Reply[] = data.map(reply => ({
        id: reply.id,
        content: reply.content,
        author: {
          id: reply.author.id,
          name: `${reply.author.first_name || ''} ${reply.author.last_name || ''}`.trim() || 'Usuário'
        },
        likes_count: reply.likes_count,
        is_solution: reply.is_solution,
        created_at: reply.created_at,
        user_liked: reply.forum_reply_likes?.some((like: any) => like.user_id === profile?.id) || false
      }));

      setReplies(formattedReplies);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const handleSubmitReply = async () => {
    if (!newReply.trim() || !profile) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('forum_replies')
        .insert({
          topic_id: topicId,
          author_id: profile.id,
          content: newReply.trim()
        });

      if (error) throw error;

      toast({
        title: "Resposta enviada",
        description: "Sua resposta foi publicada com sucesso",
      });

      setNewReply('');
      fetchReplies();
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast({
        title: "Erro ao enviar resposta",
        description: "Não foi possível enviar sua resposta",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeReply = async (replyId: string) => {
    if (!profile) return;

    try {
      const reply = replies.find(r => r.id === replyId);
      if (!reply) return;

      if (reply.user_liked) {
        // Remove like
        await supabase
          .from('forum_reply_likes')
          .delete()
          .eq('reply_id', replyId)
          .eq('user_id', profile.id);
      } else {
        // Add like
        await supabase
          .from('forum_reply_likes')
          .insert({
            reply_id: replyId,
            user_id: profile.id
          });
      }

      fetchReplies();
    } catch (error) {
      console.error('Error liking reply:', error);
      toast({
        title: "Erro ao curtir resposta",
        description: "Não foi possível processar a curtida",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      'announcements': 'Anúncios',
      'regulatory': 'Regulatório',
      'quality': 'Qualidade',
      'networking': 'Networking',
      'research': 'Pesquisa',
      'general': 'Geral'
    };
    return categories[category] || category;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (!topic) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tópico não encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  O tópico que você está procurando não existe ou foi removido
                </p>
                <Button onClick={() => navigate('/forums')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar aos Fóruns
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/forums')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Fóruns
            </Button>
          </div>

          {/* Topic Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="outline">{getCategoryLabel(topic.category)}</Badge>
                    {topic.is_pinned && (
                      <Badge variant="secondary">
                        <Pin className="h-3 w-3 mr-1" />
                        Fixado
                      </Badge>
                    )}
                    {topic.is_locked && (
                      <Badge variant="destructive">
                        <Lock className="h-3 w-3 mr-1" />
                        Bloqueado
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl text-primary mb-4">
                    {topic.title}
                  </CardTitle>
                  <p className="text-gray-600 mb-4">{topic.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{topic.author.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(topic.created_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{topic.views_count} visualizações</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>{topic.replies_count} respostas</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Replies */}
          <div className="space-y-4 mb-6">
            {replies.map((reply) => (
              <Card key={reply.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {reply.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{reply.author.name}</span>
                          {reply.is_solution && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              Solução
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(reply.created_at)}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                        {reply.content}
                      </p>
                      
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikeReply(reply.id)}
                          className={reply.user_liked ? "text-blue-600" : ""}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {reply.likes_count}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Reply Form */}
          {!topic.is_locked && (
            <Card>
              <CardHeader>
                <CardTitle>Responder ao Tópico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Digite sua resposta..."
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSubmitReply}
                      disabled={submitting || !newReply.trim()}
                    >
                      {submitting ? 'Enviando...' : 'Enviar Resposta'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default ForumTopic;