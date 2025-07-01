
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  service_type: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  budget_min: number;
  budget_max: number;
  deadline: string;
  created_at: string;
  requester_id: string;
  assigned_to?: string;
}

interface ProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

const ProjectCard = ({ project, onView, onEdit, onDelete }: ProjectCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Aberto';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getServiceTypeLabel = (serviceType: string) => {
    switch (serviceType) {
      case 'laboratory_analysis': return 'Análise Laboratorial';
      case 'regulatory_consulting': return 'Consultoria Regulatória';
      case 'clinical_research': return 'Pesquisa Clínica';
      case 'manufacturing': return 'Fabricação';
      case 'quality_control': return 'Controle de Qualidade';
      default: return serviceType;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              {getStatusIcon(project.status)}
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <Badge variant={getStatusColor(project.status)}>
                {getStatusLabel(project.status)}
              </Badge>
              <Badge variant="outline">
                {getServiceTypeLabel(project.service_type)}
              </Badge>
            </div>
            
            <p className="text-gray-600 mb-3 line-clamp-2">{project.description}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              {(project.budget_min > 0 || project.budget_max > 0) && (
                <span>
                  Orçamento: R$ {project.budget_min.toLocaleString()} - R$ {project.budget_max.toLocaleString()}
                </span>
              )}
              {project.deadline && (
                <span className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Prazo: {new Date(project.deadline).toLocaleDateString('pt-BR')}</span>
                </span>
              )}
              <span>
                Criado: {new Date(project.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(project)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(project)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm('Tem certeza que deseja excluir este projeto?')) {
                  onDelete(project.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
