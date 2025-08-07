
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Eye, 
  Handshake, 
  MessageSquare, 
  Upload, 
  Download, 
  Calendar, 
  FileText, 
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Star,
  Shield,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isDemoMode } from '@/utils/demoMode';

interface EntityData {
  id: string;
  name: string;
  type: 'company' | 'laboratory' | 'consultant';
  location?: string;
  specialties?: string[];
  certifications?: string[];
  description?: string;
  contact?: {
    email?: string;
    phone?: string;
  };
  rating?: number;
  verified?: boolean;
}

interface MarketplaceActionsProps {
  entity: EntityData;
}

const MarketplaceActions: React.FC<MarketplaceActionsProps> = ({ entity }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [partnershipOpen, setPartnershipOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [partnershipProposal, setPartnershipProposal] = useState('');
  const { toast } = useToast();
  const isDemo = isDemoMode();

  const handleViewDetails = () => {
    setDetailsOpen(true);
  };

  const handleStartPartnership = () => {
    setPartnershipOpen(true);
  };

  const handleSendMessage = () => {
    toast({
      title: "Mensagem enviada",
      description: isDemo 
        ? `Mensagem enviada para ${entity.name} (simulação)`
        : `Sua mensagem foi enviada para ${entity.name}`,
    });
    setMessage('');
    setChatOpen(false);
  };

  const handleSendProposal = () => {
    toast({
      title: "Proposta enviada",
      description: isDemo 
        ? `Proposta de parceria enviada para ${entity.name} (simulação)`
        : `Sua proposta foi enviada para ${entity.name}`,
    });
    setPartnershipProposal('');
    setPartnershipOpen(false);
  };

  const handleScheduleDemo = () => {
    toast({
      title: "Demo agendada",
      description: isDemo 
        ? `Demo virtual agendada com ${entity.name} (simulação)`
        : `Demo foi agendada com ${entity.name}`,
    });
  };

  const handleUpload = () => {
    setUploadOpen(true);
  };

  const handleDownload = () => {
    toast({
      title: "Download iniciado",
      description: isDemo 
        ? "Baixando documento demonstrativo..."
        : "Download do documento foi iniciado",
    });
  };

  const getEntityIcon = () => {
    switch (entity.type) {
      case 'company': return <Building2 className="h-5 w-5" />;
      case 'laboratory': return <FileText className="h-5 w-5" />;
      case 'consultant': return <User className="h-5 w-5" />;
      default: return <Building2 className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Ver Detalhes */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" onClick={handleViewDetails}>
            <Eye className="h-4 w-4 mr-1" />
            Ver Detalhes
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {getEntityIcon()}
              <span>{entity.name}</span>
              {entity.verified && (
                <Badge className="bg-green-100 text-green-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Verificado
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Informações Gerais</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Tipo:</span>
                  <p className="font-medium">{entity.type === 'company' ? 'Empresa' : entity.type === 'laboratory' ? 'Laboratório' : 'Consultor'}</p>
                </div>
                {entity.location && (
                  <div>
                    <span className="text-muted-foreground">Localização:</span>
                    <p className="font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {entity.location}
                    </p>
                  </div>
                )}
                {entity.rating && (
                  <div>
                    <span className="text-muted-foreground">Avaliação:</span>
                    <p className="font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                      {entity.rating}/5
                    </p>
                  </div>
                )}
              </div>
            </div>

            {entity.description && (
              <div>
                <h4 className="font-semibold mb-2">Descrição</h4>
                <p className="text-sm text-muted-foreground">{entity.description}</p>
              </div>
            )}

            {entity.specialties && entity.specialties.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Especialidades</h4>
                <div className="flex flex-wrap gap-2">
                  {entity.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {entity.certifications && entity.certifications.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Certificações</h4>
                <div className="flex flex-wrap gap-2">
                  {entity.certifications.map((cert) => (
                    <Badge key={cert} className="bg-blue-100 text-blue-800">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {entity.contact && (
              <div>
                <h4 className="font-semibold mb-2">Contato</h4>
                <div className="space-y-2 text-sm">
                  {entity.contact.email && (
                    <p className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {entity.contact.email}
                    </p>
                  )}
                  {entity.contact.phone && (
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {entity.contact.phone}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Iniciar Parceria */}
      <Dialog open={partnershipOpen} onOpenChange={setPartnershipOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm" onClick={handleStartPartnership}>
            <Handshake className="h-4 w-4 mr-1" />
            Iniciar Parceria
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proposta de Parceria</DialogTitle>
            <DialogDescription>
              Envie uma proposta de parceria para {entity.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="proposal">Descrição da Proposta</Label>
              <Textarea
                id="proposal"
                placeholder="Descreva sua proposta de parceria, objetivos e benefícios mútuos..."
                value={partnershipProposal}
                onChange={(e) => setPartnershipProposal(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setPartnershipOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSendProposal} disabled={!partnershipProposal.trim()}>
                Enviar Proposta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Seguro */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-1" />
            Chat Seguro
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat Seguro</DialogTitle>
            <DialogDescription>
              Envie uma mensagem segura para {entity.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Digite sua mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setChatOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSendMessage} disabled={!message.trim()}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" onClick={handleUpload}>
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload de Documento</DialogTitle>
            <DialogDescription>
              Compartilhe um documento com {entity.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Clique ou arraste arquivos para fazer upload
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setUploadOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Upload realizado",
                  description: isDemo ? "Documento enviado (simulação)" : "Documento foi enviado com sucesso"
                });
                setUploadOpen(false);
              }}>
                Confirmar Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Download */}
      <Button variant="outline" size="sm" onClick={handleDownload}>
        <Download className="h-4 w-4 mr-1" />
        Download
      </Button>

      {/* Agendar Demo */}
      <Button variant="outline" size="sm" onClick={handleScheduleDemo}>
        <Calendar className="h-4 w-4 mr-1" />
        Agendar Demo
      </Button>
    </div>
  );
};

export default MarketplaceActions;
