
-- Add conversation_summary column to ai_chat_threads table
ALTER TABLE public.ai_chat_threads 
ADD COLUMN IF NOT EXISTS conversation_summary TEXT;
