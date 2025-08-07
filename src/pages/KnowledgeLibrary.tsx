
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import UniversalDemoBanner from '@/components/layout/UniversalDemoBanner';
import { isDemoMode } from '@/utils/demoMode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Video, Download, AlertCircle, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const KnowledgeLibrary = () => {
  const { profile } = useAuth();
  const isDemo = isDemoMode();

  const renderDemoContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">156</div>
            <p className="text-sm text-muted-foreground">Disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <Video className="h-4 w-4 mr-2" />
              Vídeos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
            <p className="text-sm text-muted-foreground">Tutoriais</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">28</div>
            <p className="text-sm text-muted-foreground">Modelos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1.2k</div>
            <p className="text-sm text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Documentos Populares (Demo)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Guia Completo ANVISA 2024', type: 'PDF', downloads: 456 },
                { title: 'Checklist de Validação', type: 'DOCX', downloads: 234 },
                { title: 'Templates de Protocolo', type: 'ZIP', downloads: 189 }
              ].map((doc, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{doc.title}</p>
                    <p className="text-sm text-muted-foreground">{doc.type} • {doc.downloads} downloads</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorias de Conhecimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: 'Regulatório ANVISA', count: 45, color: 'bg-blue-100 text-blue-800' },
                { category: 'Controle de Qualidade', count: 32, color: 'bg-green-100 text-green-800' },
                { category: 'Desenvolvimento', count: 28, color: 'bg-purple-100 text-purple-800' },
                { category: 'Produção', count: 21, color: 'bg-orange-100 text-orange-800' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">{item.category}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.color}`}>
                    {item.count} itens
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recursos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Novas Diretrizes FDA', date: '2 dias atrás', type: 'Documento' },
              { title: 'Webinar Validação 2024', date: '1 semana atrás', type: 'Vídeo' },
              { title: 'Template Protocolo GMP', date: '2 semanas atrás', type: 'Template' },
            ].map((resource, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{resource.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{resource.type}</p>
                <p className="text-xs text-muted-foreground">{resource.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRealContent = () => (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Biblioteca de Conhecimento:</strong> Esta seção está sendo preparada para receber 
          conteúdo especializado do setor farmacêutico brasileiro. Contribua com seu conhecimento!
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              Seus Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">Nenhum ainda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <Video className="h-4 w-4 mr-2" />
              Conteúdo Multimídia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">Em preparação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Templates Públicos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">Sendo desenvolvidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Downloads Realizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-muted-foreground">Nenhum ainda</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Como Começar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Plus className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Contribua com Conhecimento</p>
                <p className="text-sm text-muted-foreground">
                  Compartilhe documentos, templates e recursos com a comunidade
                </p>
              </div>
              <Button variant="outline" disabled>
                Em Breve
              </Button>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Organize seu Material</p>
                <p className="text-sm text-muted-foreground">
                  Categorize e organize documentos por área de expertise
                </p>
              </div>
              <Button variant="outline" disabled>
                Em Desenvolvimento
              </Button>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Video className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Conteúdo Educacional</p>
                <p className="text-sm text-muted-foreground">
                  Acesse webinars, tutoriais e materiais de capacitação
                </p>
              </div>
              <Button variant="outline" disabled>
                Planejado
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Biblioteca Planejada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Categorias Previstas:</h4>
              <ul className="space-y-2 text-sm">
                <li>📋 Regulamentação ANVISA</li>
                <li>🧪 Controle de Qualidade</li>
                <li>🔬 Desenvolvimento de Produtos</li>
                <li>🏭 Boas Práticas de Fabricação</li>
                <li>📊 Análise e Validação</li>
                <li>💼 Gestão e Compliance</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Tipos de Conteúdo:</h4>
              <ul className="space-y-2 text-sm">
                <li>📄 Documentos técnicos</li>
                <li>📝 Templates e modelos</li>
                <li>🎥 Webinars e tutoriais</li>
                <li>📚 Guias e manuais</li>
                <li>📋 Checklists e formulários</li>
                <li>🔗 Links úteis e referências</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <UniversalDemoBanner variant="minimal" className="mb-6" />
          
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Biblioteca de Conhecimento
                </h1>
                <p className="text-muted-foreground">
                  {isDemo 
                    ? 'Central de recursos especializados do setor farmacêutico (dados demonstrativos)'
                    : 'Central de conhecimento colaborativo do setor farmacêutico brasileiro'
                  }
                </p>
              </div>
            </div>
          </div>

          {isDemo ? renderDemoContent() : renderRealContent()}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default KnowledgeLibrary;
