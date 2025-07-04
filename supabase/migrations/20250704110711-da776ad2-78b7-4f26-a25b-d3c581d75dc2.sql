-- Fase 2D: Sistema de Notificações Real (somente funções e triggers)

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
      'forum'
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
      'forum'
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
      'knowledge'
    FROM public.knowledge_items ki 
    WHERE ki.id = NEW.item_id AND ki.author_id != NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers para notificações automáticas
DROP TRIGGER IF EXISTS auto_notification_forum_replies ON public.forum_replies;
CREATE TRIGGER auto_notification_forum_replies
  AFTER INSERT ON public.forum_replies
  FOR EACH ROW EXECUTE FUNCTION public.create_auto_notifications();

DROP TRIGGER IF EXISTS auto_notification_forum_likes ON public.forum_reply_likes;
CREATE TRIGGER auto_notification_forum_likes
  AFTER INSERT ON public.forum_reply_likes
  FOR EACH ROW EXECUTE FUNCTION public.create_auto_notifications();

DROP TRIGGER IF EXISTS auto_notification_knowledge_ratings ON public.knowledge_ratings;
CREATE TRIGGER auto_notification_knowledge_ratings
  AFTER INSERT ON public.knowledge_ratings
  FOR EACH ROW EXECUTE FUNCTION public.create_auto_notifications();