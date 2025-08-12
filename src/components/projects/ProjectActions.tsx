
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Eye, 
  Edit, 
  Users, 
  Share, 
  Download, 
  Trash2, 
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProjectActionsProps {
  projectId: string;
  projectName: string;
  onEdit?: (projectId: string) => void;
  onCollaborate?: (projectId: string) => void;
  onShare?: (projectId: string) => void;
  onExport?: (projectId: string) => void;
  onDelete?: (projectId: string) => void;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({
  projectId,
  projectName,
  onEdit,
  onCollaborate,
  onShare,
  onExport,
  onDelete
}) => {
  const { toast } = useToast();

  const handleViewDetails = () => {
    toast({
      title: "Visualizando Projeto",
      description: `Abrindo detalhes do projeto: ${projectName}`
    });
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(projectId);
    } else {
      toast({
        title: "Editar Projeto",
        description: "Funcionalidade de edição em desenvolvimento"
      });
    }
  };

  const handleCollaborate = () => {
    if (onCollaborate) {
      onCollaborate(projectId);
    } else {
      toast({
        title: "Colaboração",
        description: "Abrindo painel de colaboração..."
      });
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(projectId);
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/projects/${projectId}`);
      toast({
        title: "Link Copiado",
        description: "Link do projeto copiado para a área de transferência"
      });
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(projectId);
    } else {
      toast({
        title: "Exportando",
        description: "Gerando relatório do projeto..."
      });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      const confirmed = window.confirm(`Tem certeza que deseja excluir o projeto "${projectName}"?`);
      if (confirmed) {
        onDelete(projectId);
      }
    } else {
      toast({
        title: "Exclusão",
        description: "Funcionalidade de exclusão em desenvolvimento",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleViewDetails}
      >
        <Eye className="h-4 w-4 mr-1" />
        Ver Detalhes
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCollaborate}>
            <Users className="h-4 w-4 mr-2" />
            Colaborar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Compartilhar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProjectActions;
