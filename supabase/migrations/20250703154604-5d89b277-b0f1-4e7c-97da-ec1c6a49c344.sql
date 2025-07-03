-- Fase 2C: Implementar Biblioteca de Conhecimento Real

-- Criar tabela de itens de conhecimento
CREATE TABLE public.knowledge_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('document', 'video', 'guide', 'template')),
  category TEXT NOT NULL DEFAULT 'general',
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_url TEXT,
  file_size TEXT,
  duration TEXT,
  downloads_count INTEGER NOT NULL DEFAULT 0,
  views_count INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0,
  ratings_count INTEGER NOT NULL DEFAULT 0,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de avaliações de itens de conhecimento
CREATE TABLE public.knowledge_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.knowledge_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(item_id, user_id)
);

-- Criar tabela de downloads
CREATE TABLE public.knowledge_downloads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.knowledge_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_downloads ENABLE ROW LEVEL SECURITY;

-- Políticas para knowledge_items
CREATE POLICY "Anyone can view knowledge items" ON public.knowledge_items FOR SELECT USING (true);
CREATE POLICY "Authors can create knowledge items" ON public.knowledge_items FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own knowledge items" ON public.knowledge_items FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own knowledge items" ON public.knowledge_items FOR DELETE USING (auth.uid() = author_id);

-- Políticas para knowledge_ratings
CREATE POLICY "Anyone can view ratings" ON public.knowledge_ratings FOR SELECT USING (true);
CREATE POLICY "Users can create ratings" ON public.knowledge_ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ratings" ON public.knowledge_ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ratings" ON public.knowledge_downloads FOR DELETE USING (auth.uid() = user_id);

-- Políticas para knowledge_downloads
CREATE POLICY "Users can view own downloads" ON public.knowledge_downloads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create downloads" ON public.knowledge_downloads FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Função para atualizar estatísticas de avaliação
CREATE OR REPLACE FUNCTION public.update_knowledge_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.knowledge_items 
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM public.knowledge_ratings 
      WHERE item_id = COALESCE(NEW.item_id, OLD.item_id)
    ),
    ratings_count = (
      SELECT COUNT(*)
      FROM public.knowledge_ratings 
      WHERE item_id = COALESCE(NEW.item_id, OLD.item_id)
    )
  WHERE id = COALESCE(NEW.item_id, OLD.item_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Função para incrementar contador de downloads
CREATE OR REPLACE FUNCTION public.increment_download_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.knowledge_items 
  SET downloads_count = downloads_count + 1
  WHERE id = NEW.item_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER knowledge_ratings_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.knowledge_ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_knowledge_rating_stats();

CREATE TRIGGER knowledge_downloads_count_trigger
  AFTER INSERT ON public.knowledge_downloads
  FOR EACH ROW EXECUTE FUNCTION public.increment_download_count();

-- Inserir dados de exemplo
INSERT INTO public.knowledge_items (title, description, content_type, category, author_id, file_size, downloads_count, views_count, rating, ratings_count, tags) VALUES
('Guia Completo de Registro na ANVISA', 'Manual completo com todos os procedimentos necessários para registro de medicamentos na ANVISA, incluindo formulários e documentação exigida.', 'guide', 'regulatory', (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), '2.5 MB', 1250, 3400, 4.8, 128, ARRAY['anvisa', 'registro', 'medicamentos', 'regulatorio']),
('Manual de Boas Práticas de Laboratório', 'Documento técnico sobre implementação de boas práticas em laboratórios farmacêuticos conforme normas ISO e ANVISA.', 'document', 'quality', (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), '3.8 MB', 1670, 3200, 4.7, 89, ARRAY['bpl', 'qualidade', 'laboratorio', 'iso']),
('Template de Protocolo de Bioequivalência', 'Template padronizado para elaboração de protocolos de estudos de bioequivalência conforme diretrizes da ANVISA.', 'template', 'clinical', (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), '1.2 MB', 2100, 4800, 4.9, 156, ARRAY['bioequivalencia', 'protocolo', 'clinico', 'template']),
('Webinar: Novas Diretrizes de Farmacovigilância', 'Apresentação sobre as recentes mudanças nas diretrizes de farmacovigilância e seu impacto na indústria farmacêutica.', 'video', 'regulatory', (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), NULL, 890, 2100, 4.6, 67, ARRAY['farmacovigilancia', 'webinar', 'diretrizes']),
('Checklist de Validação de Processos', 'Lista de verificação completa para validação de processos farmacêuticos seguindo normas internacionais.', 'template', 'manufacturing', (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), '850 KB', 980, 2350, 4.5, 43, ARRAY['validacao', 'processos', 'checklist', 'fabricacao']);

-- Inserir algumas avaliações de exemplo
INSERT INTO public.knowledge_ratings (item_id, user_id, rating, review) VALUES
((SELECT id FROM knowledge_items WHERE title = 'Guia Completo de Registro na ANVISA'), (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), 5, 'Recurso excelente! Muito detalhado e bem estruturado.'),
((SELECT id FROM knowledge_items WHERE title = 'Manual de Boas Práticas de Laboratório'), (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), 4, 'Muito útil para implementação de BPL no laboratório.');

-- Inserir alguns downloads de exemplo
INSERT INTO public.knowledge_downloads (item_id, user_id) VALUES
((SELECT id FROM knowledge_items WHERE title = 'Template de Protocolo de Bioequivalência'), (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com')),
((SELECT id FROM knowledge_items WHERE title = 'Guia Completo de Registro na ANVISA'), (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'));