
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Eye, 
  Users, 
  MessageSquare, 
  FileText, 
  Calendar,
  Settings,
  Trash2,
  Share2,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isDemoMode } from '@/utils/demoMode';

interface ProjectData {
  id: string;
  name: string;
  description?: string;
  status: string;
  phase: string;
  progress: number;
  timeline: string;
  budget?: number;
  partners?: string[];
  created_at: string;
}

interface ProjectActionsProps {
  project?: ProjectData;
  onCreateProject?: (projectData: any) => void;
  onUpdateProject?: (id: string, projectData: any) => void;
  onDeleteProject?: (id: string) => void;
  variant?: 'create' | 'manage';
}

const ProjectActions: React.FC<ProjectActionsProps> = ({
  project,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  variant = 'manage'
}) => {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [collaborateOpen, setCollaborateOpen] = useState(false);
  
  const [projectName, setProjectName] = useState(project?.name || '');
  const [projectDescription, setProjectDescription] = useState(project?.description || '');
  const [projectPhase, setProjectPhase] = useState(project?.phase || 'planning');
  const [projectTimeline, setProjectTimeline] = useState(project?.timeline || '');
  const [projectBudget, setProjectBudget] = useState(project?.budget?.toString() || '');
  
  const { toast } = useToast();
  const isDemo = isDemoMode();

  const handleCreateProject = () => {
    const newProject = {
      name: projectName,
      description: projectDescription,
      phase: projectPhase,
      timeline: projectTimeline,
      budget: projectBudget ? parseFloat(projectBudget) : undefined,
      status: 'planning',
      progress: 0
    };

    if (onCreateProject) {
      onCreateProject(newProject);
    }

    toast({
      title: "Projeto criado",
      description: isDemo 
        ? `Projeto "${projectName}" criado com dados demonstrativos`
        : `Projeto "${projectName}" foi criado com sucesso`,
    });

    // Reset form
    setProjectName('');
    setProjectDescription('');
    setProjectPhase('planning');
    setProjectTimeline('');
    setProjectBudget('');
    setCreateOpen(false);
  };

  const handleUpdateProject = () => {
    if (!project || !onUpdateProject) return;

    const updatedProject = {
      name: projectName,
      description: projectDescription,
      phase: projectPhase,
      timeline: projectTimeline,
      budget: projectBudget ? parseFloat(projectBudget) : project.budget,
    };

    onUpdateProject(project.id, updatedProject);

    toast({
      title: "Projeto atualizado",
      description: `Projeto "${projectName}" foi atualizado com sucesso`,
    });

    setEditOpen(false);
  };

  const handleDeleteProject = () => {
    if (!project || !onDeleteProject) return;

    onDeleteProject(project.id);

    toast({
      title: "Projeto removido",
      description: `Projeto "${project.name}" foi removido`,
      variant: "destructive"
    });
  };

  const handleInviteCollaborator = () => {
    toast({
      title: "Convite enviado",
      description: isDemo 
        ? "Convite de colaboração enviado (simulação)"
        : "Convite foi enviado para o colaborador",
    });
    setCollaborateOpen(false);
  };

  const handleShareProject = () => {
    toast({
      title: "Projeto compartilhado",
      description: "Link de compartilhamento copiado para área de transferência",
    });
  };

  const handleExportProject = () => {
    toast({
      title: "Exportação iniciada",
      description: isDemo 
        ? "Exportando dados do projeto (simulação)"
        : "Dados do projeto estão sendo exportados",
    });
  };

  if (variant === 'create') {
    return (
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Novo Projeto</DialogTitle>
            <DialogDescription>
              Preencha as informações básicas do seu novo projeto
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Projeto</Label>
              <Input
                id="name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Ex: Desenvolvimento de Medicamento Genérico"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Descreva os objetivos e escopo do projeto..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="phase">Fase Inicial</Label>
              <Select value={projectPhase} onValueChange={setProjectPhase}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planejamento</SelectItem>
                  <SelectItem value="research">Pesquisa</SelectItem>
                  <SelectItem value="development">Desenvolvimento</SelectItem>
                  <SelectItem value="clinical_trials">Testes Clínicos</SelectItem>
                  <SelectItem value="regulatory">Regulatório</SelectItem>
                  <SelectItem value="production">Produção</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timeline">Prazo Estimado</Label>
              <Input
                id="timeline"
                value={projectTimeline}
                onChange={(e) => setProjectTimeline(e.target.value)}
                placeholder="Ex: 12 meses, 2 anos..."
              />
            </div>

            <div>
              <Label htmlFor="budget">Orçamento (R$)</Label>
              <Input
                id="budget"
                type="number"
                value={projectBudget}
                onChange={(e) => setProjectBudget(e.target.value)}
                placeholder="Orçamento estimado"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateProject} disabled={!projectName.trim()}>
                Criar Projeto
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* Ver Detalhes */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            Ver Detalhes
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{project?.name}</DialogTitle>
          </DialogHeader>
          
          {project && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Status</h4>
                  <Badge className="bg-blue-100 text-blue-800">
                    {project.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Fase</h4>
                  <Badge className="bg-green-100 text-green-800">
                    {project.phase}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Progresso</h4>
                  <span>{project.progress}%</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Prazo</h4>
                  <span>{project.timeline}</span>
                </div>
              </div>

              {project.description && (
                <div>
                  <h4 className="font-semibold mb-2">Descrição</h4>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
              )}

              {project.partners && project.partners.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Parceiros</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.partners.map((partner) => (
                      <Badge key={partner} variant="secondary">
                        {partner}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {project.budget && (
                <div>
                  <h4 className="font-semibold mb-2">Orçamento</h4>
                  <span className="text-lg font-semibold">
                    R$ {project.budget.toLocaleString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Editar */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Projeto</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome do Projeto</Label>
              <Input
                id="edit-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-phase">Fase</Label>
              <Select value={projectPhase} onValueChange={setProjectPhase}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planejamento</SelectItem>
                  <SelectItem value="research">Pesquisa</SelectItem>
                  <SelectItem value="development">Desenvolvimento</SelectItem>
                  <SelectItem value="clinical_trials">Testes Clínicos</SelectItem>
                  <SelectItem value="regulatory">Regulatório</SelectItem>
                  <SelectItem value="production">Produção</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateProject}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Colaborar */}
      <Dialog open={collaborateOpen} onOpenChange={setCollaborateOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-1" />
            Colaborar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar Colaboradores</DialogTitle>
            <DialogDescription>
              Convide outros profissionais para colaborar no projeto
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail do Colaborador</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="role">Função no Projeto</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="researcher">Pesquisador</SelectItem>
                  <SelectItem value="consultant">Consultor</SelectItem>
                  <SelectItem value="analyst">Analista</SelectItem>
                  <SelectItem value="coordinator">Coordenador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message">Mensagem (opcional)</Label>
              <Textarea
                id="message"
                placeholder="Adicione uma mensagem personalizada ao convite..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setCollaborateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleInviteCollaborator}>
                Enviar Convite
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Outras ações */}
      <Button variant="outline" size="sm" onClick={handleShareProject}>
        <Share2 className="h-4 w-4 mr-1" />
        Compartilhar
      </Button>

      <Button variant="outline" size="sm" onClick={handleExportProject}>
        <Download className="h-4 w-4 mr-1" />
        Exportar
      </Button>

      <Button 
        variant="destructive" 
        size="sm" 
        onClick={handleDeleteProject}
        className="ml-2"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Excluir
      </Button>
    </div>
  );
};

export default ProjectActions;
