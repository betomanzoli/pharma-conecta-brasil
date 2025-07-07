-- Criar tabela para preferências de notificações
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mentorship_enabled BOOLEAN NOT NULL DEFAULT true,
  forum_enabled BOOLEAN NOT NULL DEFAULT true,
  system_enabled BOOLEAN NOT NULL DEFAULT true,
  knowledge_enabled BOOLEAN NOT NULL DEFAULT true,
  marketing_enabled BOOLEAN NOT NULL DEFAULT false,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  push_notifications BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT notification_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT notification_preferences_user_id_unique UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own notification preferences" 
ON public.notification_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences" 
ON public.notification_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences" 
ON public.notification_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Função para criar preferências padrão quando um usuário é criado
CREATE OR REPLACE FUNCTION public.create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar preferências padrão
DROP TRIGGER IF EXISTS create_default_preferences_trigger ON public.profiles;
CREATE TRIGGER create_default_preferences_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_notification_preferences();

-- Atualizar função de notificações para respeitar preferências
CREATE OR REPLACE FUNCTION public.create_system_notification(target_user_id uuid, notification_title text, notification_message text, notification_type text DEFAULT 'system'::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
  should_notify BOOLEAN := true;
BEGIN
  -- Verificar preferências do usuário
  SELECT 
    CASE 
      WHEN notification_type = 'mentorship' THEN np.mentorship_enabled
      WHEN notification_type = 'forum' THEN np.forum_enabled
      WHEN notification_type = 'system' THEN np.system_enabled
      WHEN notification_type = 'knowledge' THEN np.knowledge_enabled
      ELSE true
    END INTO should_notify
  FROM public.notification_preferences np
  WHERE np.user_id = target_user_id;
  
  -- Se não encontrou preferências, criar padrão e permitir notificação
  IF should_notify IS NULL THEN
    INSERT INTO public.notification_preferences (user_id)
    VALUES (target_user_id)
    ON CONFLICT (user_id) DO NOTHING;
    should_notify := true;
  END IF;
  
  -- Criar notificação se usuário permitir
  IF should_notify THEN
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (target_user_id, notification_title, notification_message, notification_type)
    RETURNING id INTO notification_id;
  END IF;
  
  RETURN notification_id;
END;
$$;