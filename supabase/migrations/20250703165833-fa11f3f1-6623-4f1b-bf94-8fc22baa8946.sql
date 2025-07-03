-- Fase 2D: Implementar Sistema de Notificações Real com WebSockets

-- Habilitar realtime para a tabela de notificações
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Garantir que a tabela tenha REPLICA IDENTITY FULL para capturar dados completos
ALTER TABLE notifications REPLICA IDENTITY FULL;

-- Função para criar notificação do sistema
CREATE OR REPLACE FUNCTION public.create_system_notification(
  target_user_id UUID,
  notification_title TEXT,
  notification_message TEXT,
  notification_type TEXT DEFAULT 'system'
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (target_user_id, notification_title, notification_message, notification_type)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para marcar notificação como lida
CREATE OR REPLACE FUNCTION public.mark_notification_read(notification_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.notifications 
  SET read = true 
  WHERE id = notification_id AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para marcar todas as notificações como lidas
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.notifications 
  SET read = true 
  WHERE user_id = auth.uid() AND read = false;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função trigger para criar notificações automáticas
CREATE OR REPLACE FUNCTION public.create_auto_notifications()
RETURNS TRIGGER AS $$
BEGIN
  -- Notificação quando alguém responde a um tópico do fórum
  IF TG_TABLE_NAME = 'forum_replies' THEN
    -- Notificar o autor do tópico
    INSERT INTO public.notifications (user_id, title, message, type)
    SELECT 
      ft.author_id,
      'Nova resposta no seu tópico',
      'Alguém respondeu ao tópico "' || ft.title || '"',
      'forum_reply'
    FROM public.forum_topics ft 
    WHERE ft.id = NEW.topic_id AND ft.author_id != NEW.author_id;
  END IF;

  -- Notificação quando alguém curte uma resposta
  IF TG_TABLE_NAME = 'forum_reply_likes' THEN
    INSERT INTO public.notifications (user_id, title, message, type)
    SELECT 
      fr.author_id,
      'Sua resposta foi curtida',
      'Alguém curtiu sua resposta no fórum',
      'forum_like'
    FROM public.forum_replies fr 
    WHERE fr.id = NEW.reply_id AND fr.author_id != NEW.user_id;
  END IF;

  -- Notificação quando alguém avalia um recurso da biblioteca
  IF TG_TABLE_NAME = 'knowledge_ratings' THEN
    INSERT INTO public.notifications (user_id, title, message, type)
    SELECT 
      ki.author_id,
      'Novo rating no seu recurso',
      'Alguém avaliou seu recurso "' || ki.title || '"',
      'knowledge_rating'
    FROM public.knowledge_items ki 
    WHERE ki.id = NEW.item_id AND ki.author_id != NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers para notificações automáticas
CREATE TRIGGER auto_notification_forum_replies
  AFTER INSERT ON public.forum_replies
  FOR EACH ROW EXECUTE FUNCTION public.create_auto_notifications();

CREATE TRIGGER auto_notification_forum_likes
  AFTER INSERT ON public.forum_reply_likes
  FOR EACH ROW EXECUTE FUNCTION public.create_auto_notifications();

CREATE TRIGGER auto_notification_knowledge_ratings
  AFTER INSERT ON public.knowledge_ratings
  FOR EACH ROW EXECUTE FUNCTION public.create_auto_notifications();

-- Inserir algumas notificações de exemplo
INSERT INTO public.notifications (user_id, title, message, type) VALUES
((SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), 'Bem-vindo à Plataforma!', 'Sua conta foi criada com sucesso. Explore todas as funcionalidades disponíveis.', 'welcome'),
((SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), 'Novo Alerta Regulatório', 'A ANVISA publicou uma nova regulamentação sobre medicamentos genéricos.', 'regulatory'),
((SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), 'Atualização do Sistema', 'Nova versão da plataforma disponível com melhorias de performance.', 'system'),
((SELECT id FROM profiles WHERE email = 'betomanzoli@gmail.com'), 'Recurso Popular', 'Seu guia de registro na ANVISA atingiu 1000 downloads!', 'achievement');