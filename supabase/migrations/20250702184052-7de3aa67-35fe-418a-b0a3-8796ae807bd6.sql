-- Fase 2B: Criar sistema de fóruns funcional

-- Criar tabela de tópicos do fórum
CREATE TABLE public.forum_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  views_count INTEGER NOT NULL DEFAULT 0,
  replies_count INTEGER NOT NULL DEFAULT 0,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de respostas do fórum
CREATE TABLE public.forum_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES public.forum_topics(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_solution BOOLEAN NOT NULL DEFAULT FALSE,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de likes nas respostas
CREATE TABLE public.forum_reply_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reply_id UUID NOT NULL REFERENCES public.forum_replies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(reply_id, user_id)
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_reply_likes ENABLE ROW LEVEL SECURITY;

-- Políticas para forum_topics
CREATE POLICY "Anyone can view forum topics" ON public.forum_topics FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create topics" ON public.forum_topics FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own topics" ON public.forum_topics FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own topics" ON public.forum_topics FOR DELETE USING (auth.uid() = author_id);

-- Políticas para forum_replies
CREATE POLICY "Anyone can view forum replies" ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON public.forum_replies FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own replies" ON public.forum_replies FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own replies" ON public.forum_replies FOR DELETE USING (auth.uid() = author_id);

-- Políticas para forum_reply_likes
CREATE POLICY "Users can view all likes" ON public.forum_reply_likes FOR SELECT USING (true);
CREATE POLICY "Users can like replies" ON public.forum_reply_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own likes" ON public.forum_reply_likes FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar contadores e timestamps
CREATE OR REPLACE FUNCTION public.update_forum_topic_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar contador de respostas e last_activity
  UPDATE public.forum_topics 
  SET 
    replies_count = (
      SELECT COUNT(*) 
      FROM public.forum_replies 
      WHERE topic_id = COALESCE(NEW.topic_id, OLD.topic_id)
    ),
    last_activity_at = now()
  WHERE id = COALESCE(NEW.topic_id, OLD.topic_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar contador de likes
CREATE OR REPLACE FUNCTION public.update_reply_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.forum_replies 
  SET likes_count = (
    SELECT COUNT(*) 
    FROM public.forum_reply_likes 
    WHERE reply_id = COALESCE(NEW.reply_id, OLD.reply_id)
  )
  WHERE id = COALESCE(NEW.reply_id, OLD.reply_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers para manter estatísticas atualizadas
CREATE TRIGGER forum_replies_stats_trigger
  AFTER INSERT OR DELETE ON public.forum_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_forum_topic_stats();

CREATE TRIGGER forum_reply_likes_trigger
  AFTER INSERT OR DELETE ON public.forum_reply_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_reply_likes_count();

-- Inserir dados de exemplo para fóruns
INSERT INTO public.forum_topics (title, description, category, author_id, is_pinned, views_count) VALUES
('Diretrizes da Comunidade PharmaConnect', 'Regras e diretrizes importantes para participação na comunidade', 'announcements', (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), true, 245),
('Novas Regulamentações ANVISA 2024', 'Discussão sobre as principais mudanças regulatórias para este ano', 'regulatory', (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), false, 189),
('Melhores Práticas em Controle de Qualidade', 'Compartilhamento de experiências em controle de qualidade farmacêutica', 'quality', (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), false, 156),
('Networking: Como Expandir suas Conexões Profissionais', 'Dicas e estratégias para networking efetivo na indústria farmacêutica', 'networking', (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), false, 203),
('Tendências em Biotecnologia 2024', 'Discussão sobre as principais tendências e inovações em biotecnologia', 'research', (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), false, 167);

-- Inserir algumas respostas de exemplo
INSERT INTO public.forum_replies (topic_id, author_id, content) VALUES
((SELECT id FROM forum_topics WHERE title = 'Novas Regulamentações ANVISA 2024'), (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), 'Excelente tópico! As mudanças na RDC 786/2023 realmente impactaram nossos processos de registro.'),
((SELECT id FROM forum_topics WHERE title = 'Melhores Práticas em Controle de Qualidade'), (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), 'Em nossa empresa, implementamos um sistema de validação em múltiplas etapas que reduziu significativamente os desvios.'),
((SELECT id FROM forum_topics WHERE title = 'Networking: Como Expandir suas Conexões Profissionais'), (SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), 'LinkedIn tem sido fundamental para expandir minha rede profissional. Recomendo participar ativamente de grupos especializados.');