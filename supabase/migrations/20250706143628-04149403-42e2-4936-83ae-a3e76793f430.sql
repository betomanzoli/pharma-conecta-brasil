-- Criar triggers para notificações automáticas de mentoria
CREATE OR REPLACE FUNCTION public.create_mentorship_notifications()
RETURNS TRIGGER AS $$
BEGIN
  -- Notificar quando uma sessão é agendada
  IF TG_OP = 'INSERT' THEN
    -- Notificar o mentor
    INSERT INTO public.notifications (user_id, title, message, type)
    SELECT 
      m.profile_id,
      'Nova Sessão de Mentoria Agendada',
      'Você tem uma nova sessão agendada: "' || NEW.title || '" para ' || to_char(NEW.scheduled_at, 'DD/MM/YYYY às HH24:MI'),
      'mentorship'
    FROM public.mentors m 
    WHERE m.id = NEW.mentor_id;
    
    -- Notificar o mentee
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.mentee_id,
      'Sessão de Mentoria Confirmada',
      'Sua sessão "' || NEW.title || '" foi agendada para ' || to_char(NEW.scheduled_at, 'DD/MM/YYYY às HH24:MI'),
      'mentorship'
    );
  END IF;
  
  -- Notificar quando uma sessão é atualizada
  IF TG_OP = 'UPDATE' THEN
    -- Notificar quando status muda para completed
    IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES (
        NEW.mentee_id,
        'Sessão de Mentoria Concluída',
        'Sua sessão "' || NEW.title || '" foi concluída. Avalie sua experiência!',
        'mentorship'
      );
      
      INSERT INTO public.notifications (user_id, title, message, type)
      SELECT 
        m.profile_id,
        'Sessão de Mentoria Concluída',
        'A sessão "' || NEW.title || '" foi concluída com sucesso.',
        'mentorship'
      FROM public.mentors m 
      WHERE m.id = NEW.mentor_id;
    END IF;
    
    -- Notificar quando sessão é cancelada
    IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES (
        NEW.mentee_id,
        'Sessão de Mentoria Cancelada',
        'Sua sessão "' || NEW.title || '" foi cancelada.',
        'mentorship'
      );
      
      INSERT INTO public.notifications (user_id, title, message, type)
      SELECT 
        m.profile_id,
        'Sessão de Mentoria Cancelada',
        'A sessão "' || NEW.title || '" foi cancelada.',
        'mentorship'
      FROM public.mentors m 
      WHERE m.id = NEW.mentor_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para sessões de mentoria
DROP TRIGGER IF EXISTS mentorship_notifications_trigger ON public.mentorship_sessions;
CREATE TRIGGER mentorship_notifications_trigger
  AFTER INSERT OR UPDATE ON public.mentorship_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.create_mentorship_notifications();

-- Habilitar realtime para notifications
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;