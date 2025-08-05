
import React from 'react';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Download, Star, User } from 'lucide-react';

const KnowledgeLibrary = () => {
  const knowledgeItems = [
    {
      id: 1,
      title: 'Guia de Boas Práticas de Fabricação - ANVISA',
      description: 'Manual completo sobre as diretrizes da ANVISA para boas práticas de fabricação de medicamentos.',
      author: 'Dr. João Silva',
      category: 'Regulatório',
      rating: 4.8,
      downloads: 1247,
      type: 'PDF'
    },
    {
      id: 2,
      title: 'Análise de Estabilidade de Medicamentos',
      description: 'Protocolo detalhado para estudos de estabilidade conforme normas brasileiras e internacionais.',
      author: 'Dra. Maria Santos',
      category: 'Laboratório',
      rating: 4.6,
      downloads: 892,
      type: 'Documento'
    },
    {
      id: 3,
      title: 'Registro de Medicamentos no Brasil',
      description: 'Passo a passo completo para registro de medicamentos junto à ANVISA.',
      author: 'Consultoria Regulatory',
      category: 'Regulatório',
      rating: 4.9,
      downloads: 2156,
      type: 'Guia'
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Biblioteca de Conhecimento</h1>
            <p className="text-muted-foreground">
              Acesse documentos, guias e recursos especializados do setor farmacêutico brasileiro
            </p>
          </div>

          <div className="grid gap-6">
            {knowledgeItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                      <p className="text-muted-foreground mb-3">{item.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{item.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{item.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>{item.downloads} downloads</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge variant="secondary">{item.category}</Badge>
                      <Badge variant="outline">{item.type}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Button size="sm">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Visualizar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default KnowledgeLibrary;
