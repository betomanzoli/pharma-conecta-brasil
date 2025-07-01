import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProjectStats from '@/components/projects/ProjectStats';
import ProjectFilters from '@/components/projects/ProjectFilters';
import ProjectCard from '@/components/projects/ProjectCard';
import CreateProjectDialog from '@/components/projects/CreateProjectDialog';
import { getStatusColor, getStatusLabel, getServiceTypeLabel } from '@/utils/projectUtils';

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

const Projects = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    service_type: '',
    budget_min: '',
    budget_max: '',
    deadline: ''
  });

  useEffect(() => {
    fetchProjects();
  }, [profile]);

  const fetchProjects = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('project_requests')
        .select('*')
        .eq('requester_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Erro ao carregar projetos",
          description: "Não foi possível carregar seus projetos",
          variant: "destructive"
        });
        return;
      }

      // Convert data to match our Project interface
      const formattedProjects: Project[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        service_type: item.service_type,
        status: (item.status as 'open' | 'in_progress' | 'completed' | 'cancelled') || 'open',
        budget_min: item.budget_min || 0,
        budget_max: item.budget_max || 0,
        deadline: item.deadline || '',
        created_at: item.created_at,
        requester_id: item.requester_id,
        assigned_to: item.provider_id || undefined
      }));

      setProjects(formattedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!profile || !newProject.title || !newProject.service_type) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos o título e tipo de serviço",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('project_requests')
        .insert({
          title: newProject.title,
          description: newProject.description,
          service_type: newProject.service_type,
          budget_min: parseFloat(newProject.budget_min) || 0,
          budget_max: parseFloat(newProject.budget_max) || 0,
          deadline: newProject.deadline || null,
          requester_id: profile.id,
          status: 'open'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        toast({
          title: "Erro ao criar projeto",
          description: "Não foi possível criar o projeto",
          variant: "destructive"
        });
        return;
      }

      // Convert to our Project interface
      const newProjectData: Project = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        service_type: data.service_type,
        status: (data.status as 'open' | 'in_progress' | 'completed' | 'cancelled') || 'open',
        budget_min: data.budget_min || 0,
        budget_max: data.budget_max || 0,
        deadline: data.deadline || '',
        created_at: data.created_at,
        requester_id: data.requester_id,
        assigned_to: data.provider_id || undefined
      };

      setProjects(prev => [newProjectData, ...prev]);
      setIsCreateDialogOpen(false);
      setNewProject({
        title: '',
        description: '',
        service_type: '',
        budget_min: '',
        budget_max: '',
        deadline: ''
      });

      toast({
        title: "Projeto criado!",
        description: "Seu projeto foi criado com sucesso",
      });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('project_requests')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('Error deleting project:', error);
        toast({
          title: "Erro ao excluir projeto",
          description: "Não foi possível excluir o projeto",
          variant: "destructive"
        });
        return;
      }

      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast({
        title: "Projeto excluído",
        description: "O projeto foi excluído com sucesso",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesServiceType = serviceTypeFilter === 'all' || project.service_type === serviceTypeFilter;
    
    return matchesSearch && matchesStatus && matchesServiceType;
  });

  const projectStats = {
    total: projects.length,
    open: projects.filter(p => p.status === 'open').length,
    inProgress: projects.filter(p => p.status === 'in_progress').length,
    completed: projects.filter(p => p.status === 'completed').length
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestão de Projetos
                </h1>
                <p className="text-gray-600 mt-2">
                  Gerencie seus projetos e colaborações
                </p>
              </div>
              <CreateProjectDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                newProject={newProject}
                setNewProject={setNewProject}
                onCreateProject={createProject}
              />
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-[#1565C0] hover:bg-[#1565C0]/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Projeto
              </Button>
            </div>
          </div>

          <ProjectStats {...projectStats} />

          <ProjectFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            serviceTypeFilter={serviceTypeFilter}
            setServiceTypeFilter={setServiceTypeFilter}
          />

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1565C0]"></div>
              <span className="ml-2 text-gray-600">Carregando projetos...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {projects.length === 0 ? 'Nenhum projeto criado' : 'Nenhum projeto encontrado'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {projects.length === 0 
                    ? 'Crie seu primeiro projeto para começar a colaborar'
                    : 'Tente ajustar os filtros de busca'
                  }
                </p>
                {projects.length === 0 && (
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-[#1565C0] hover:bg-[#1565C0]/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Projeto
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onView={setSelectedProject}
                  onEdit={() => {}} // Implementar edição
                  onDelete={deleteProject}
                />
              ))}
            </div>
          )}

          {/* Dialog de Visualização */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Detalhes do Projeto</DialogTitle>
              </DialogHeader>
              {selectedProject && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedProject.title}</h3>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant={getStatusColor(selectedProject.status)}>
                        {getStatusLabel(selectedProject.status)}
                      </Badge>
                      <Badge variant="outline">
                        {getServiceTypeLabel(selectedProject.service_type)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Descrição</h4>
                    <p className="text-gray-600">{selectedProject.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-1">Orçamento</h4>
                      <p className="text-gray-600">
                        R$ {selectedProject.budget_min.toLocaleString()} - R$ {selectedProject.budget_max.toLocaleString()}
                      </p>
                    </div>
                    {selectedProject.deadline && (
                      <div>
                        <h4 className="font-medium mb-1">Prazo</h4>
                        <p className="text-gray-600">
                          {new Date(selectedProject.deadline).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Criado em</h4>
                    <p className="text-gray-600">
                      {new Date(selectedProject.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Projects;
