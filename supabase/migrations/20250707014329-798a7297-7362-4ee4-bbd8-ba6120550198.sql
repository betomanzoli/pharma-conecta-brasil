-- Criar triggers para notificações automáticas de fórum
CREATE OR REPLACE FUNCTION public.create_forum_notifications()
RETURNS TRIGGER AS $$
BEGIN
  -- Notificação quando alguém responde a um tópico do fórum
  IF TG_TABLE_NAME = 'forum_replies' THEN
    -- Notificar o autor do tópico (se não for o próprio autor respondendo)
    INSERT INTO public.notifications (user_id, title, message, type)
    SELECT 
      ft.author_id,
      'Nova resposta no seu tópico',
      'Alguém respondeu ao tópico "' || ft.title || '"',
      'forum'
    FROM public.forum_topics ft 
    WHERE ft.id = NEW.topic_id AND ft.author_id != NEW.author_id;
    
    -- Atualizar contador de respostas e última atividade
    UPDATE public.forum_topics 
    SET 
      replies_count = replies_count + 1,
      last_activity_at = now()
    WHERE id = NEW.topic_id;
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
    
    -- Atualizar contador de curtidas da resposta
    UPDATE public.forum_replies 
    SET likes_count = likes_count + 1
    WHERE id = NEW.reply_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para respostas do fórum
DROP TRIGGER IF EXISTS forum_reply_notifications_trigger ON public.forum_replies;
CREATE TRIGGER forum_reply_notifications_trigger
  AFTER INSERT ON public.forum_replies
  FOR EACH ROW
  EXECUTE FUNCTION public.create_forum_notifications();

-- Criar trigger para curtidas em respostas
DROP TRIGGER IF EXISTS forum_like_notifications_trigger ON public.forum_reply_likes;
CREATE TRIGGER forum_like_notifications_trigger
  AFTER INSERT ON public.forum_reply_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.create_forum_notifications();

-- Criar trigger para remover notificação quando curtida é removida
CREATE OR REPLACE FUNCTION public.handle_forum_like_removal()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar contador de curtidas da resposta
  UPDATE public.forum_replies 
  SET likes_count = likes_count - 1
  WHERE id = OLD.reply_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS forum_unlike_trigger ON public.forum_reply_likes;
CREATE TRIGGER forum_unlike_trigger
  AFTER DELETE ON public.forum_reply_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_forum_like_removal();