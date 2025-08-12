
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ExternalLink, Crown, Network } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GomesCasseresReference: React.FC = () => {
  const { toast } = useToast();

  const handleOpenReport = () => {
    toast({
      title: "Abrindo Relatório",
      description: "Relatório sobre as Três Leis de Benjamin Gomes-Casseres"
    });
    // Aqui poderia abrir um modal ou navegar para uma página dedicada
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Download Iniciado",
      description: "Baixando relatório em PDF..."
    });
  };

  return (
    <Card className="border-2 border-dashed border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-50">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-600 text-white">
            <Crown className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-lg flex items-center space-x-2">
              <span>Estratégia Gomes-Casseres</span>
              <Badge className="bg-orange-100 text-orange-800">
                Referência Estratégica
              </Badge>
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              As Três Leis das Combinações de Negócios
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-700">
          Manual prático baseado na teoria de Benjamin Gomes-Casseres sobre 
          parcerias estratégicas e constelações de alianças na indústria farmacêutica.
        </p>
        
        <div className="bg-white rounded-lg p-4 border border-orange-200">
          <h4 className="font-semibold text-orange-800 mb-2 flex items-center space-x-2">
            <Network className="h-4 w-4" />
            <span>Conteúdo do Relatório:</span>
          </h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Primeira Lei: Identificação do Valor Conjunto</li>
            <li>• Segunda Lei: Governança da Colaboração</li>
            <li>• Terceira Lei: Compartilhamento Equitativo</li>
            <li>• Aplicação na PharmaConnect Brasil</li>
            <li>• Manual de Implementação de IA em Projetos</li>
          </ul>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={handleOpenReport}
            className="bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Ler Relatório
          </Button>
          
          <Button 
            onClick={handleDownloadPDF}
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 bg-orange-50 p-2 rounded">
          <strong>Sobre o Autor:</strong> Benjamin Gomes-Casseres é professor na Brandeis University 
          e especialista mundial em estratégia de alianças e parcerias empresariais.
        </div>
      </CardContent>
    </Card>
  );
};

export default GomesCasseresReference;
