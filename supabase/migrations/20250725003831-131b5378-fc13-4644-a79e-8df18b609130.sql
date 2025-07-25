-- Criar tabelas para sistema de chat
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by UUID REFERENCES public.profiles(id),
  participants UUID[] NOT NULL,
  chat_type TEXT NOT NULL DEFAULT 'direct',
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text',
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  edited_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'
);

-- Habilitar RLS
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para chats
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view chats they participate in' AND tablename = 'chats') THEN
        CREATE POLICY "Users can view chats they participate in" ON public.chats 
        FOR SELECT USING (auth.uid() = ANY(participants));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create chats' AND tablename = 'chats') THEN
        CREATE POLICY "Users can create chats" ON public.chats 
        FOR INSERT WITH CHECK (auth.uid() = created_by);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Participants can update chat' AND tablename = 'chats') THEN
        CREATE POLICY "Participants can update chat" ON public.chats 
        FOR UPDATE USING (auth.uid() = ANY(participants));
    END IF;
END
$$;

-- Políticas para mensagens
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view messages in their chats' AND tablename = 'chat_messages') THEN
        CREATE POLICY "Users can view messages in their chats" ON public.chat_messages 
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = chat_messages.chat_id 
            AND auth.uid() = ANY(chats.participants)
          )
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can send messages' AND tablename = 'chat_messages') THEN
        CREATE POLICY "Users can send messages" ON public.chat_messages 
        FOR INSERT WITH CHECK (
          auth.uid() = user_id AND
          EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = chat_messages.chat_id 
            AND auth.uid() = ANY(chats.participants)
          )
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can edit own messages' AND tablename = 'chat_messages') THEN
        CREATE POLICY "Users can edit own messages" ON public.chat_messages 
        FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_chats_participants ON public.chats USING GIN(participants);
CREATE INDEX IF NOT EXISTS idx_chats_last_activity ON public.chats(last_activity);
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON public.chat_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sent_at ON public.chat_messages(sent_at);

-- Triggers para atualizar timestamps
CREATE TRIGGER update_chats_updated_at 
  BEFORE UPDATE ON public.chats 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para atualizar atividade do chat quando mensagem é enviada
CREATE OR REPLACE FUNCTION update_chat_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chats 
  SET 
    last_activity = NEW.sent_at,
    last_message = LEFT(NEW.message, 100)
  WHERE id = NEW.chat_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chat_activity_trigger
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_chat_activity();