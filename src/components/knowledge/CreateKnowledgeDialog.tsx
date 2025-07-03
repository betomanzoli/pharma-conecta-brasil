import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface CreateKnowledgeDialogProps {
  onSuccess: () => void;
}

const CreateKnowledgeDialog = ({ onSuccess }: CreateKnowledgeDialogProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_type: '',
    category: '',
    file_size: '',
    duration: '',
    is_premium: false,
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar recursos",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('knowledge_items')
        .insert({
          title: formData.title,
          description: formData.description,
          content_type: formData.content_type,
          category: formData.category,
          author_id: profile.id,
          file_size: formData.file_size || null,
          duration: formData.duration || null,
          is_premium: formData.is_premium,
          tags: formData.tags
        });

      if (error) throw error;

      toast({
        title: "Recurso criado",
        description: "Seu recurso foi adicionado à biblioteca com sucesso",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        content_type: '',
        category: '',
        file_size: '',
        duration: '',
        is_premium: false,
        tags: []
      });

      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating knowledge item:', error);
      toast({
        title: "Erro ao criar recurso",
        description: "Não foi possível adicionar o recurso à biblioteca",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#1565C0] hover:bg-[#1565C0]/90">
          <Upload className="h-4 w-4 mr-2" />
          Adicionar Recurso
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Recurso</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Título do recurso"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content_type">Tipo *</Label>
              <Select 
                value={formData.content_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Documento</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="guide">Guia</SelectItem>
                  <SelectItem value="template">Template</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o conteúdo do recurso"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regulatory">Regulatório</SelectItem>
                  <SelectItem value="clinical">Clínico</SelectItem>
                  <SelectItem value="manufacturing">Fabricação</SelectItem>
                  <SelectItem value="quality">Qualidade</SelectItem>
                  <SelectItem value="general">Geral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file_size">Tamanho do Arquivo</Label>
              <Input
                id="file_size"
                value={formData.file_size}
                onChange={(e) => setFormData(prev => ({ ...prev, file_size: e.target.value }))}
                placeholder="ex: 2.5 MB"
              />
            </div>
          </div>

          {formData.content_type === 'video' && (
            <div className="space-y-2">
              <Label htmlFor="duration">Duração</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="ex: 45 min"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Adicionar tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                Adicionar
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)} 
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="premium"
              checked={formData.is_premium}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_premium: checked }))}
            />
            <Label htmlFor="premium">Recurso Premium</Label>
          </div>

          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#1565C0] hover:bg-[#1565C0]/90"
            >
              {loading ? 'Criando...' : 'Criar Recurso'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateKnowledgeDialog;