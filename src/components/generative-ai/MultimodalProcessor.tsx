
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  FileText, 
  Image, 
  Mic, 
  Database, 
  Sparkles,
  Upload,
  Play,
  Pause,
  Square,
  Download
} from 'lucide-react';

const MultimodalProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const processingModes = [
    {
      id: 'document-analysis',
      name: 'Análise de Documentos',
      description: 'Extração inteligente de informações de PDFs, contratos e regulamentações',
      icon: FileText,
      color: 'bg-blue-500',
      formats: ['PDF', 'DOC', 'DOCX', 'TXT']
    },
    {
      id: 'image-processing',
      name: 'Processamento de Imagens',
      description: 'Análise de gráficos, diagramas e imagens técnicas farmacêuticas',
      icon: Image,
      color: 'bg-green-500',
      formats: ['JPG', 'PNG', 'SVG', 'TIFF']
    },
    {
      id: 'audio-transcription',
      name: 'Transcrição de Áudio',
      description: 'Conversão de reuniões e apresentações em texto estruturado',
      icon: Mic,
      color: 'bg-purple-500',
      formats: ['MP3', 'WAV', 'M4A', 'OGG']
    },
    {
      id: 'data-synthesis',
      name: 'Síntese de Dados',
      description: 'Combinação inteligente de múltiplas fontes em insights únicos',
      icon: Database,
      color: 'bg-orange-500',
      formats: ['CSV', 'JSON', 'XML', 'XLS']
    }
  ];

  const handleProcess = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simular processamento
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Processador Multimodal IA</CardTitle>
              <p className="text-muted-foreground">
                Sistema avançado de processamento simultâneo de texto, imagem, áudio e dados
              </p>
            </div>
            <Badge variant="default" className="bg-green-500 ml-auto">
              <Sparkles className="h-3 w-3 mr-1" />
              Online
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Processing Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {processingModes.map((mode) => {
          const IconComponent = mode.icon;
          return (
            <Card key={mode.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${mode.color} text-white`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{mode.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-3">{mode.description}</p>
                <div className="flex flex-wrap gap-1">
                  {mode.formats.map((format) => (
                    <Badge key={format} variant="outline" className="text-xs">
                      {format}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Processing Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Interface de Processamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upload">Upload de Arquivos</TabsTrigger>
              <TabsTrigger value="realtime">Tempo Real</TabsTrigger>
              <TabsTrigger value="batch">Processamento em Lote</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Upload className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Arraste arquivos aqui</h3>
                    <p className="text-muted-foreground">
                      Ou clique para selecionar documentos, imagens, áudios ou dados
                    </p>
                  </div>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Selecionar Arquivos
                  </Button>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png,.svg,.mp3,.wav,.csv,.json"
                  />
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Arquivos Selecionados:</h4>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-sm">{file.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{file.type.split('/').pop()?.toUpperCase()}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="realtime" className="space-y-4">
              <div className="text-center p-8 bg-muted/30 rounded-lg">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-red-500 rounded-full text-white">
                      <Mic className="h-8 w-8" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Processamento em Tempo Real</h3>
                    <p className="text-muted-foreground">
                      Captura e processa áudio/vídeo em tempo real
                    </p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Iniciar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4 mr-2" />
                      Pausar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Square className="h-4 w-4 mr-2" />
                      Parar
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="batch" className="space-y-4">
              <div className="text-center p-8 bg-muted/30 rounded-lg">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Database className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Processamento em Lote</h3>
                    <p className="text-muted-foreground">
                      Processa grandes volumes de dados automaticamente
                    </p>
                  </div>
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Configurar Lote
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Processing Controls */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="space-y-2">
              <div className="text-sm font-medium">Status do Processamento</div>
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Progress value={processingProgress} className="w-32" />
                  <span className="text-sm text-muted-foreground">{processingProgress}%</span>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Aguardando arquivos</div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleProcess}
                disabled={isProcessing || selectedFiles.length === 0}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Processar com IA
                  </>
                )}
              </Button>
              {processingProgress === 100 && (
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Resultado
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Processamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-500">2.4k</div>
              <div className="text-sm text-muted-foreground">Documentos Processados</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-green-500">1.8k</div>
              <div className="text-sm text-muted-foreground">Imagens Analisadas</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-500">847h</div>
              <div className="text-sm text-muted-foreground">Áudio Transcrito</div>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-orange-500">99.1%</div>
              <div className="text-sm text-muted-foreground">Precisão Média</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultimodalProcessor;
