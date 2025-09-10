import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageCircle, ExternalLink, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WhatsAppContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorName: string;
  contextualSummary: string;
}

const WhatsAppContactModal: React.FC<WhatsAppContactModalProps> = ({
  isOpen,
  onClose,
  calculatorName,
  contextualSummary
}) => {
  const [customMessage, setCustomMessage] = useState("");
  
  // WhatsApp number from environment variable (fallback for demo)
  const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER || "5511982751655";
  
  const baseMessage = `Olá! Utilizei a ${calculatorName} da Essenza e gostaria de uma análise mais detalhada.\n\nResultado obtido: ${contextualSummary}`;
  
  const finalMessage = customMessage.trim() 
    ? `${baseMessage}\n\nInformações adicionais:\n${customMessage}`
    : baseMessage;

  const handleSendWhatsApp = () => {
    const encodedMessage = encodeURIComponent(finalMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Close modal
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Falar com Especialista
          </DialogTitle>
          <DialogDescription>
            Sua mensagem será enviada via WhatsApp para nossa equipe de especialistas. 
            Revise o conteúdo antes de enviar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preview da mensagem base */}
          <div>
            <Label className="text-sm font-medium">Mensagem Base (será enviada)</Label>
            <div className="mt-2 p-4 bg-muted/30 rounded-lg border">
              <p className="text-sm whitespace-pre-line">{baseMessage}</p>
            </div>
          </div>

          {/* Campo para informações adicionais */}
          <div>
            <Label htmlFor="customMessage" className="text-sm font-medium">
              Informações Adicionais (Opcional)
            </Label>
            <Textarea
              id="customMessage"
              placeholder="Adicione detalhes específicos sobre seu projeto, dúvidas ou objetivos..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="mt-2"
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Quanto mais detalhes você fornecer, melhor poderemos ajudá-lo.
            </p>
          </div>

          {/* Preview da mensagem final */}
          <div>
            <Label className="text-sm font-medium">Preview da Mensagem Completa</Label>
            <div className="mt-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 max-h-40 overflow-y-auto">
              <p className="text-sm whitespace-pre-line">{finalMessage}</p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {finalMessage.length} caracteres
              </Badge>
              <Badge variant="outline" className="text-xs">
                WhatsApp: {whatsappNumber}
              </Badge>
            </div>
          </div>

          {/* Aviso sobre privacidade */}
          <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-700 dark:text-amber-300">
              <p className="font-medium mb-1">Política de Privacidade</p>
              <p>
                As informações serão utilizadas exclusivamente para fornecer consultoria especializada. 
                Não compartilhamos dados com terceiros sem sua autorização.
              </p>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3">
            <Button onClick={handleSendWhatsApp} className="flex-1">
              <ExternalLink className="w-4 h-4 mr-2" />
              Enviar via WhatsApp
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppContactModal;