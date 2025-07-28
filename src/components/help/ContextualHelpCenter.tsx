
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  Video, 
  MessageCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  Clock,
  User,
  Zap,
  Target,
  CheckCircle
} from 'lucide-react';

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  views: number;
  lastUpdated: Date;
  tags: string[];
  userSegment: string[];
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  rating: number;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  votes: number;
  userSegment: string[];
}

const ContextualHelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userSegment, setUserSegment] = useState('pharmaceutical'); // Dinamicamente detectado
  const [currentPage, setCurrentPage] = useState('search');

  const helpArticles: HelpArticle[] = [
    {
      id: '1',
      title: 'Como Usar o AI Matching para Encontrar Parceiros Ideais',
      content: 'Guia completo sobre como utilizar nossa ferramenta de AI Matching...',
      category: 'ai-matching',
      difficulty: 'beginner',
      rating: 4.8,
      views: 1250,
      lastUpdated: new Date('2024-01-10'),
      tags: ['matching', 'parceiros', 'ia', 'tutorial'],
      userSegment: ['pharmaceutical', 'laboratory', 'consultant']
    },
    {
      id: '2',
      title: 'Configuração de Projetos Confidenciais',
      content: 'Aprenda a configurar níveis de confidencialidade para seus projetos...',
      category: 'security',
      difficulty: 'intermediate',
      rating: 4.9,
      views: 890,
      lastUpdated: new Date('2024-01-12'),
      tags: ['segurança', 'confidencialidade', 'projetos'],
      userSegment: ['pharmaceutical', 'laboratory']
    },
    {
      id: '3',
      title: 'Gestão de Capacidade para Laboratórios',
      content: 'Como otimizar sua agenda e gerenciar a capacidade do laboratório...',
      category: 'capacity',
      difficulty: 'intermediate',
      rating: 4.7,
      views: 650,
      lastUpdated: new Date('2024-01-08'),
      tags: ['laboratório', 'capacidade', 'agenda'],
      userSegment: ['laboratory']
    }
  ];

  const tutorials: Tutorial[] = [
    {
      id: '1',
      title: 'Primeiros Passos na Plataforma',
      description: 'Tutorial completo para novos usuários',
      videoUrl: 'https://example.com/video1',
      duration: 15,
      category: 'getting-started',
      difficulty: 'beginner',
      completed: false,
      rating: 4.9
    },
    {
      id: '2',
      title: 'Configuração Avançada de Projetos',
      description: 'Como configurar projetos complexos com múltiplos parceiros',
      videoUrl: 'https://example.com/video2',
      duration: 25,
      category: 'projects',
      difficulty: 'advanced',
      completed: true,
      rating: 4.8
    }
  ];

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'Como funciona o AI Matching?',
      answer: 'O AI Matching utiliza algoritmos de machine learning para analisar perfis e necessidades...',
      category: 'ai-matching',
      votes: 45,
      userSegment: ['pharmaceutical', 'laboratory', 'consultant']
    },
    {
      id: '2',
      question: 'Minhas informações confidenciais estão seguras?',
      answer: 'Sim, utilizamos criptografia AES-256 e múltiplas camadas de segurança...',
      category: 'security',
      votes: 38,
      userSegment: ['pharmaceutical', 'laboratory']
    },
    {
      id: '3',
      question: 'Como alterar minha disponibilidade no sistema?',
      answer: 'Você pode alterar sua disponibilidade acessando Configurações > Capacidade...',
      category: 'capacity',
      votes: 25,
      userSegment: ['laboratory', 'consultant']
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'ai-matching', name: 'AI Matching', icon: <Zap className="h-4 w-4" /> },
    { id: 'security', name: 'Segurança', icon: <Target className="h-4 w-4" /> },
    { id: 'projects', name: 'Projetos', icon: <CheckCircle className="h-4 w-4" /> },
    { id: 'capacity', name: 'Capacidade', icon: <Clock className="h-4 w-4" /> }
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSegment = article.userSegment.includes(userSegment);
    return matchesSearch && matchesCategory && matchesSegment;
  });

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSegment = faq.userSegment.includes(userSegment);
    return matchesSearch && matchesCategory && matchesSegment;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            <span>Centro de Ajuda Contextual</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Barra de Pesquisa */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar por artigos, tutoriais ou perguntas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat ao Vivo
            </Button>
          </div>

          {/* Categorias */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2"
              >
                {category.icon}
                <span>{category.name}</span>
              </Button>
            ))}
          </div>

          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="articles">Artigos</TabsTrigger>
              <TabsTrigger value="tutorials">Tutoriais</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="contact">Contato</TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="space-y-4">
              <div className="space-y-4">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {article.content}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span>{article.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{article.views} visualizações</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{article.lastUpdated.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getDifficultyColor(article.difficulty)}>
                            {article.difficulty}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Ler Artigo
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {article.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tutorials" className="space-y-4">
              <div className="space-y-4">
                {tutorials.map((tutorial) => (
                  <Card key={tutorial.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Video className="h-8 w-8 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{tutorial.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">
                              {tutorial.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{tutorial.duration} min</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span>{tutorial.rating}</span>
                              </div>
                              {tutorial.completed && (
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span>Concluído</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getDifficultyColor(tutorial.difficulty)}>
                            {tutorial.difficulty}
                          </Badge>
                          <Button variant="outline" size="sm">
                            {tutorial.completed ? 'Revisar' : 'Assistir'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="faqs" className="space-y-4">
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <Card key={faq.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                          <p className="text-sm text-gray-600 mb-3">{faq.answer}</p>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <ThumbsUp className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <ThumbsDown className="h-4 w-4" />
                              </Button>
                              <span className="text-sm text-gray-500">
                                {faq.votes} pessoas acharam útil
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{faq.category}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5 text-blue-600" />
                      <span>Chat ao Vivo</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Converse com nossa equipe de suporte em tempo real
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Status:</span>
                        <Badge className="bg-green-100 text-green-800">Online</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tempo de resposta:</span>
                        <span className="text-sm text-gray-600">~2 minutos</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4">
                      Iniciar Chat
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <HelpCircle className="h-5 w-5 text-purple-600" />
                      <span>Suporte Técnico</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Para questões técnicas complexas ou bugs
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">E-mail:</span>
                        <span className="text-sm text-gray-600">suporte@pharmaconnect.com</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Resposta:</span>
                        <span className="text-sm text-gray-600">24-48 horas</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Enviar Ticket
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Target className="h-4 w-4" />
                <AlertDescription>
                  <strong>Dica:</strong> Antes de entrar em contato, verifique se sua dúvida já foi respondida 
                  em nossos artigos ou FAQs. Isso pode economizar tempo e você terá a resposta imediatamente!
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContextualHelpCenter;
