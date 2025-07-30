
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  BookOpen, 
  Brain, 
  FileText, 
  Users, 
  TrendingUp, 
  Lightbulb,
  Tag,
  Clock,
  Star,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeItem {
  id: string;
  title: string;
  type: 'best_practice' | 'template' | 'case_study' | 'methodology' | 'tool_guide';
  category: string;
  content: string;
  tags: string[];
  relevance_score: number;
  usage_count: number;
  last_updated: string;
  ai_generated: boolean;
  difficulty_level: 'basic' | 'intermediate' | 'advanced';
}

interface IntelligentKnowledgeBaseProps {
  searchTerm?: string;
  category?: string;
  onItemSelected?: (item: KnowledgeItem) => void;
}

const IntelligentKnowledgeBase: React.FC<IntelligentKnowledgeBaseProps> = ({
  searchTerm = '',
  category = '',
  onItemSelected
}) => {
  const { toast } = useToast();
  const [search, setSearch] = useState(searchTerm);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedType, setSelectedType] = useState('');

  const knowledgeItems: KnowledgeItem[] = [
    {
      id: '1',
      title: 'Guia Completo de AI Matching para Parcerias Farmacêuticas',
      type: 'best_practice',
      category: 'AI Matching',
      content: 'Estratégias avançadas para otimizar o uso do AI Matching...',
      tags: ['ai-matching', 'parcerias', 'otimização', 'farmacêutico'],
      relevance_score: 98,
      usage_count: 247,
      last_updated: '2024-01-28',
      ai_generated: true,
      difficulty_level: 'intermediate'
    },
    {
      id: '2',
      title: 'Template: Estrutura de Governança para Projetos Colaborativos',
      type: 'template',
      category: 'Governança',
      content: 'Template completo baseado nas Três Leis de Gomes-Casseres...',
      tags: ['governança', 'colaboração', 'template', 'gomes-casseres'],
      relevance_score: 94,
      usage_count: 189,
      last_updated: '2024-01-26',
      ai_generated: true,
      difficulty_level: 'advanced'
    },
    {
      id: '3',
      title: 'Caso de Sucesso: Desenvolvimento de Formulação Oral em 8 Meses',
      type: 'case_study',
      category: 'P&D',
      content: 'Como a empresa XYZ reduziu o tempo de desenvolvimento em 40%...',
      tags: ['caso-sucesso', 'desenvolvimento', 'eficiência', 'farmacêutico'],
      relevance_score: 91,
      usage_count: 156,
      last_updated: '2024-01-24',
      ai_generated: false,
      difficulty_level: 'intermediate'
    },
    {
      id: '4',
      title: 'Metodologia Híbrida PMBOK + Agile para Projetos Farmacêuticos',
      type: 'methodology',
      category: 'Metodologias',
      content: 'Guia prático para implementar metodologias híbridas...',
      tags: ['metodologia', 'pmbok', 'agile', 'híbrido', 'implementação'],
      relevance_score: 89,
      usage_count: 203,
      last_updated: '2024-01-22',
      ai_generated: true,
      difficulty_level: 'advanced'
    },
    {
      id: '5',
      title: 'Como Usar Analytics Preditivos para Reduzir Riscos em 60%',
      type: 'tool_guide',
      category: 'Analytics',
      content: 'Tutorial passo-a-passo para configurar e interpretar analytics preditivos...',
      tags: ['analytics', 'preditivo', 'riscos', 'tutorial', 'configuração'],
      relevance_score: 87,
      usage_count: 134,
      last_updated: '2024-01-20',
      ai_generated: true,
      difficulty_level: 'intermediate'
    }
  ];

  const getTypeIcon = (type: string) => {
    const icons = {
      best_practice: <Star className="h-4 w-4 text-yellow-500" />,
      template: <FileText className="h-4 w-4 text-blue-500" />,
      case_study: <Users className="h-4 w-4 text-green-500" />,
      methodology: <TrendingUp className="h-4 w-4 text-purple-500" />,
      tool_guide: <BookOpen className="h-4 w-4 text-orange-500" />
    };
    return icons[type] || <FileText className="h-4 w-4 text-gray-500" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      best_practice: 'bg-yellow-100 text-yellow-800',
      template: 'bg-blue-100 text-blue-800',
      case_study: 'bg-green-100 text-green-800',
      methodology: 'bg-purple-100 text-purple-800',
      tool_guide: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (level: string) => {
    const colors = {
      basic: 'text-green-600',
      intermediate: 'text-yellow-600',
      advanced: 'text-red-600'
    };
    return colors[level] || 'text-gray-600';
  };

  const filteredItems = knowledgeItems.filter(item => {
    return (!search || item.title.toLowerCase().includes(search.toLowerCase()) ||
           item.content.toLowerCase().includes(search.toLowerCase()) ||
           item.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))) &&
           (!selectedCategory || item.category === selectedCategory) &&
           (!selectedType || item.type === selectedType);
  });

  const categories = [...new Set(knowledgeItems.map(item => item.category))];
  const types = [...new Set(knowledgeItems.map(item => item.type))];

  const handleItemClick = (item: KnowledgeItem) => {
    if (onItemSelected) {
      onItemSelected(item);
    }
    toast({
      title: "Item Selecionado",
      description: `Abrindo: ${item.title}`
    });
  };

  const getTopItems = () => {
    return knowledgeItems
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 5);
  };

  const getPopularItems = () => {
    return knowledgeItems
      .sort((a, b) => b.usage_count - a.usage_count)
      .slice(0, 5);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center space-x-2">
          <Brain className="h-6 w-6 text-primary" />
          <span>Base de Conhecimento Inteligente</span>
        </h2>
        <p className="text-gray-600">
          Recursos curados e gerados por IA para otimizar seus projetos
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar na base de conhecimento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos os Itens</TabsTrigger>
          <TabsTrigger value="recommended">Recomendados</TabsTrigger>
          <TabsTrigger value="popular">Mais Populares</TabsTrigger>
          <TabsTrigger value="recent">Recentes</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredItems.map(item => (
              <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleItemClick(item)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getTypeIcon(item.type)}
                      <div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getTypeColor(item.type)}>
                            {item.type.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
                          {item.ai_generated && (
                            <Badge className="bg-purple-100 text-purple-800">
                              <Brain className="h-3 w-3 mr-1" />
                              IA
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getDifficultyColor(item.difficulty_level)}`}>
                        {item.difficulty_level}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.relevance_score}% relevância
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {item.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span>{item.usage_count} usos</span>
                      <span>
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(item.last_updated).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommended" className="space-y-4">
          <div className="space-y-4">
            {getTopItems().map((item, index) => (
              <Card key={item.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleItemClick(item)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getTypeColor(item.type)}>
                            {getTypeIcon(item.type)}
                            <span className="ml-1">{item.type.replace('_', ' ')}</span>
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
                          <span className="text-sm font-medium text-blue-600">
                            {item.relevance_score}% relevância
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{item.content}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <div className="space-y-4">
            {getPopularItems().map((item, index) => (
              <Card key={item.id} className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleItemClick(item)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getTypeColor(item.type)}>
                            {getTypeIcon(item.type)}
                            <span className="ml-1">{item.type.replace('_', ' ')}</span>
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
                          <span className="text-sm font-medium text-green-600">
                            {item.usage_count} usos
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{item.content}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {knowledgeItems
              .sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime())
              .slice(0, 6)
              .map(item => (
              <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleItemClick(item)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getTypeIcon(item.type)}
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Novo</Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3">{item.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Atualizado em {new Date(item.last_updated).toLocaleDateString('pt-BR')}</span>
                    <span>{item.relevance_score}% relevância</span>
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

export default IntelligentKnowledgeBase;
