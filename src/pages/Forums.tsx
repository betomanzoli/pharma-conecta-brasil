
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  Search,
  Plus,
  Star,
  Trophy,
  FileText,
  Clock,
  Users,
  TrendingUp,
  Shield,
  FlaskConical,
  BookOpen,
  Briefcase,
  Newspaper
} from "lucide-react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const Forums = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const forumCategories = [
    {
      id: "regulatory",
      title: "Regulatório & Compliance",
      description: "Discussões sobre ANVISA, FDA, EMA e compliance",
      icon: Shield,
      color: "bg-red-50 text-red-600",
      posts: 234,
      members: 1847
    },
    {
      id: "rd",
      title: "P&D Development",
      description: "Pesquisa, desenvolvimento e inovação farmacêutica",
      icon: FlaskConical,
      color: "bg-blue-50 text-blue-600",
      posts: 456,
      members: 2103
    },
    {
      id: "quality",
      title: "Controle de Qualidade",
      description: "Análises, validação e sistemas de qualidade",
      icon: Star,
      color: "bg-green-50 text-green-600",
      posts: 189,
      members: 1654
    },
    {
      id: "career",
      title: "Crescimento Profissional",
      description: "Carreira, networking e desenvolvimento pessoal",
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-600",
      posts: 312,
      members: 2845
    },
    {
      id: "news",
      title: "Notícias da Indústria",
      description: "Últimas novidades e tendências do setor",
      icon: Newspaper,
      color: "bg-orange-50 text-orange-600",
      posts: 167,
      members: 3021
    }
  ];

  const discussions = [
    {
      id: 1,
      title: "Nova RDC sobre Boas Práticas de Fabricação - Impactos na Indústria",
      category: "Regulatório & Compliance",
      author: "Dr. Carlos Silva",
      authorBadge: "Expert Regulatório",
      replies: 23,
      upvotes: 45,
      downvotes: 2,
      timeAgo: "2 horas atrás",
      isHot: true,
      excerpt: "A ANVISA publicou nova resolução que impacta significativamente os processos de fabricação..."
    },
    {
      id: 2,
      title: "Validação de Métodos Analíticos: Melhores Práticas e Desafios",
      category: "Controle de Qualidade",
      author: "Ana Santos",
      authorBadge: "QC Specialist",
      replies: 18,
      upvotes: 32,
      downvotes: 1,
      timeAgo: "4 horas atrás",
      isHot: false,
      excerpt: "Compartilhando experiências sobre validação de métodos HPLC para quantificação..."
    },
    {
      id: 3,
      title: "Transição de Carreira: De Bancada para Gestão - Dicas Práticas",
      category: "Crescimento Profissional",
      author: "Marina Costa",
      authorBadge: "Mentora",
      replies: 67,
      upvotes: 89,
      downvotes: 3,
      timeAgo: "1 dia atrás",
      isHot: true,
      excerpt: "Após 8 anos na bancada, fiz a transição para gerência. Aqui estão as lições aprendidas..."
    }
  ];

  const topContributors = [
    { name: "Dr. Carlos Silva", points: 2847, badge: "Expert Regulatório", avatar: "CS" },
    { name: "Ana Santos", points: 2103, badge: "QC Specialist", avatar: "AS" },
    { name: "Marina Costa", points: 1967, badge: "Mentora", avatar: "MC" },
    { name: "Roberto Lima", points: 1654, badge: "P&D Leader", avatar: "RL" }
  ];

  const handleUpvote = (discussionId: number) => {
    toast({
      title: "Voto registrado",
      description: "Sua avaliação foi registrada com sucesso.",
    });
  };

  const handleNewPost = () => {
    toast({
      title: "Nova discussão",
      description: "Redirecionando para criar nova discussão...",
    });
  };

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fóruns PharmaNexus</h1>
          <p className="text-gray-600">
            Participe das discussões mais relevantes da indústria farmacêutica
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Discussões Ativas</p>
                  <p className="text-2xl font-bold text-gray-900">1,358</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Membros Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">11,470</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Experts</p>
                  <p className="text-2xl font-bold text-gray-900">247</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Documentos</p>
                  <p className="text-2xl font-bold text-gray-900">892</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and New Post */}
            <Card>
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar discussões, tópicos ou autores..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleNewPost}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Discussão
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Forum Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categorias do Fórum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {forumCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <div key={category.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${category.color}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{category.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                            <div className="flex space-x-4 text-xs text-gray-500">
                              <span>{category.posts} posts</span>
                              <span>{category.members} membros</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Discussions */}
            <Card>
              <CardHeader>
                <CardTitle>Discussões Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {discussions.map((discussion) => (
                    <div key={discussion.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="text-sm">
                            {discussion.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900 hover:text-primary cursor-pointer">
                              {discussion.title}
                            </h3>
                            {discussion.isHot && (
                              <Badge variant="destructive" className="text-xs">HOT</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{discussion.excerpt}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{discussion.author}</span>
                            <Badge variant="outline" className="text-xs">{discussion.authorBadge}</Badge>
                            <span>{discussion.category}</span>
                            <span>{discussion.timeAgo}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleUpvote(discussion.id)}
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {discussion.upvotes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              {discussion.downvotes}
                            </Button>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            {discussion.replies}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topContributors.map((contributor, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                        {index + 1}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{contributor.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{contributor.name}</p>
                        <p className="text-xs text-gray-500">{contributor.points} pontos</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{contributor.badge}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Knowledge Library */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Biblioteca de Conhecimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Templates
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Insights Salariais
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Building2 className="h-4 w-4 mr-2" />
                    Avaliações de Empresas
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Trilhas de Carreira
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Receba um resumo das melhores discussões da semana
                </p>
                <div className="space-y-2">
                  <Input placeholder="Seu email" />
                  <Button className="w-full">Inscrever-se</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forums;
