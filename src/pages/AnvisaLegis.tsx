import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  ExternalLink, 
  Scale, 
  FileText, 
  Globe, 
  Maximize2, 
  Minimize2,
  RefreshCw,
  Info
} from 'lucide-react';
import Navigation from '@/components/Navigation';

const AnvisaLegis = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const anvisaLegisUrl = "https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=apresentacao&cod_modulo=134&cod_menu=1696";

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh by re-mounting iframe
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center space-x-2">
                <Scale className="h-8 w-8 text-primary" />
                <span>AnvisaLegis</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Portal de Legislação Sanitária - Integração Direta
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="flex items-center space-x-1">
                <Globe className="h-3 w-3" />
                <span>Online</span>
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center space-x-1"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Atualizar</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleFullscreen}
                className="flex items-center space-x-1"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="h-4 w-4" />
                    <span>Minimizar</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-4 w-4" />
                    <span>Tela Cheia</span>
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a 
                  href={anvisaLegisUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Abrir Externo</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Informações sobre o portal */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Sobre o AnvisaLegis</AlertTitle>
            <AlertDescription>
              O AnvisaLegis é o portal oficial da ANVISA para acesso à legislação sanitária brasileira. 
              Aqui você encontra resoluções, portarias, instruções normativas e demais atos normativos 
              relacionados à vigilância sanitária.
            </AlertDescription>
          </Alert>

          {/* Cards informativos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Legislação Disponível</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5000+</div>
                <p className="text-xs text-muted-foreground">
                  Documentos normativos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Últimas Atualizações</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Diário</div>
                <p className="text-xs text-muted-foreground">
                  Atualizações frequentes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portal Oficial</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">ANVISA</div>
                <p className="text-xs text-muted-foreground">
                  Fonte confiável
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Container do iframe */}
          <Card className={`${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
            <CardHeader className={`${isFullscreen ? 'border-b' : ''}`}>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Scale className="h-5 w-5" />
                  <span>Portal AnvisaLegis</span>
                </CardTitle>
                
                {isFullscreen && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFullscreen}
                    className="flex items-center space-x-1"
                  >
                    <Minimize2 className="h-4 w-4" />
                    <span>Sair da Tela Cheia</span>
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className={`relative ${isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[800px]'} w-full`}>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-gray-600">Carregando portal AnvisaLegis...</span>
                    </div>
                  </div>
                )}
                
                <iframe
                  key={isLoading ? 'loading' : 'loaded'} // Force remount on refresh
                  src={anvisaLegisUrl}
                  className="w-full h-full border-0"
                  title="Portal AnvisaLegis"
                  allowFullScreen
                  onLoad={handleIframeLoad}
                  style={{
                    display: isLoading ? 'none' : 'block'
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informações adicionais */}
          {!isFullscreen && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Funcionalidades do Portal</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Busca avançada por palavra-chave, número do ato ou data</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Filtros por tipo de documento e órgão emissor</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Acesso ao texto integral dos documentos</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>Histórico de alterações e revogações</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tipos de Documentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="space-y-1">
                      <Badge variant="outline">Resoluções</Badge>
                      <Badge variant="outline">Portarias</Badge>
                      <Badge variant="outline">Instruções Normativas</Badge>
                    </div>
                    <div className="space-y-1">
                      <Badge variant="outline">Notas Técnicas</Badge>
                      <Badge variant="outline">Consultas Públicas</Badge>
                      <Badge variant="outline">Atos Normativos</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnvisaLegis;