
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newProject: {
    title: string;
    description: string;
    service_type: string;
    budget_min: string;
    budget_max: string;
    deadline: string;
  };
  setNewProject: (project: any) => void;
  onCreateProject: () => void;
}

const CreateProjectDialog = ({
  isOpen,
  onClose,
  newProject,
  setNewProject,
  onCreateProject
}: CreateProjectDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título do Projeto</label>
            <Input
              value={newProject.title}
              onChange={(e) => setNewProject({...newProject, title: e.target.value})}
              placeholder="Digite o título do projeto"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Tipo de Serviço</label>
            <Select value={newProject.service_type} onValueChange={(value) => setNewProject({...newProject, service_type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de serviço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="laboratory_analysis">Análise Laboratorial</SelectItem>
                <SelectItem value="regulatory_consulting">Consultoria Regulatória</SelectItem>
                <SelectItem value="clinical_research">Pesquisa Clínica</SelectItem>
                <SelectItem value="manufacturing">Fabricação</SelectItem>
                <SelectItem value="quality_control">Controle de Qualidade</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              value={newProject.description}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              placeholder="Descreva os detalhes do projeto"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Orçamento Mínimo (R$)</label>
              <Input
                type="number"
                value={newProject.budget_min}
                onChange={(e) => setNewProject({...newProject, budget_min: e.target.value})}
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Orçamento Máximo (R$)</label>
              <Input
                type="number"
                value={newProject.budget_max}
                onChange={(e) => setNewProject({...newProject, budget_max: e.target.value})}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Prazo</label>
            <Input
              type="date"
              value={newProject.deadline}
              onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={onCreateProject} className="bg-[#1565C0] hover:bg-[#1565C0]/90">
              Criar Projeto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
