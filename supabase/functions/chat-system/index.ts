import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const logStep = (step: string, details?: any) => {
  console.log(`[${new Date().toISOString()}] ${step}`, details || '');
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep('Chat System - Starting');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { action, message, chatId, userId, participants, aiMode } = await req.json();
    logStep('Chat action', { action, chatId, aiMode });

    let results = {};

    switch (action) {
      case 'create_chat':
        results = await createChat(supabase, participants, userId);
        break;
      case 'send_message':
        results = await sendMessage(supabase, chatId, userId, message);
        break;
      case 'get_messages':
        results = await getMessages(supabase, chatId, userId);
        break;
      case 'ai_assistant':
        results = await handleAIAssistant(supabase, perplexityKey, message, userId);
        break;
      case 'smart_suggestions':
        results = await getSmartSuggestions(supabase, perplexityKey, chatId, userId);
        break;
      case 'translate_message':
        results = await translateMessage(perplexityKey, message);
        break;
      default:
        throw new Error('Invalid chat action');
    }

    logStep('Chat action completed', { action, results: !!results });

    return new Response(JSON.stringify({
      success: true,
      action,
      results,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    logStep('Error in chat system', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function createChat(supabase: any, participants: string[], userId: string) {
  logStep('Creating new chat', { participants: participants.length });
  
  const chatId = crypto.randomUUID();
  
  // Criar chat
  const { error: chatError } = await supabase
    .from('chats')
    .insert({
      id: chatId,
      created_by: userId,
      participants: participants,
      chat_type: participants.length > 2 ? 'group' : 'direct',
      last_activity: new Date().toISOString()
    });

  if (chatError) throw chatError;

  // Mensagem de boas-vindas
  await supabase
    .from('chat_messages')
    .insert({
      chat_id: chatId,
      user_id: userId,
      message: 'Conversa iniciada! 👋',
      message_type: 'system'
    });

  return { 
    chat_id: chatId,
    participants,
    created_at: new Date().toISOString()
  };
}

async function sendMessage(supabase: any, chatId: string, userId: string, message: string) {
  logStep('Sending message', { chatId, messageLength: message.length });
  
  const messageId = crypto.randomUUID();
  
  // Inserir mensagem
  const { error: messageError } = await supabase
    .from('chat_messages')
    .insert({
      id: messageId,
      chat_id: chatId,
      user_id: userId,
      message: message,
      message_type: 'text',
      sent_at: new Date().toISOString()
    });

  if (messageError) throw messageError;

  // Atualizar última atividade do chat
  await supabase
    .from('chats')
    .update({
      last_activity: new Date().toISOString(),
      last_message: message.slice(0, 100)
    })
    .eq('id', chatId);

  // Buscar participantes para notificações
  const { data: chat } = await supabase
    .from('chats')
    .select('participants')
    .eq('id', chatId)
    .single();

  // Enviar notificações para outros participantes
  if (chat?.participants) {
    const otherParticipants = chat.participants.filter((p: string) => p !== userId);
    
    for (const participantId of otherParticipants) {
      await supabase
        .from('notifications')
        .insert({
          user_id: participantId,
          title: 'Nova mensagem',
          message: `Você recebeu uma nova mensagem: ${message.slice(0, 50)}...`,
          type: 'chat',
          metadata: { chat_id: chatId, message_id: messageId }
        });
    }
  }

  return { 
    message_id: messageId,
    sent_at: new Date().toISOString(),
    chat_id: chatId
  };
}

async function getMessages(supabase: any, chatId: string, userId: string) {
  logStep('Getting messages', { chatId });
  
  // Verificar se usuário tem acesso ao chat
  const { data: chat } = await supabase
    .from('chats')
    .select('participants')
    .eq('id', chatId)
    .single();

  if (!chat || !chat.participants.includes(userId)) {
    throw new Error('Acesso negado ao chat');
  }

  // Buscar mensagens
  const { data: messages, error } = await supabase
    .from('chat_messages')
    .select(`
      *,
      profiles:user_id (
        first_name,
        last_name
      )
    `)
    .eq('chat_id', chatId)
    .order('sent_at', { ascending: true })
    .limit(100);

  if (error) throw error;

  return { 
    messages: messages || [],
    chat_id: chatId,
    total_messages: messages?.length || 0
  };
}

async function handleAIAssistant(supabase: any, perplexityKey: string, message: string, userId: string) {
  logStep('Handling AI assistant request');
  
  // Buscar contexto do usuário
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  // Buscar empresa/laboratório do usuário
  const { data: userCompany } = await supabase
    .from('companies')
    .select('*')
    .eq('profile_id', userId)
    .single();

  const { data: userLab } = await supabase
    .from('laboratories')
    .select('*')
    .eq('profile_id', userId)
    .single();

  const userContext = {
    profile: userProfile,
    company: userCompany,
    laboratory: userLab
  };

  const systemPrompt = `Você é um assistente especializado em indústria farmacêutica brasileira. 
  Contexto do usuário: ${JSON.stringify(userContext)}
  
  Ajude com questões sobre:
  - Regulamentação ANVISA, FDA, EMA
  - Matching de parceiros comerciais
  - Análise de oportunidades de mercado
  - Compliance farmacêutico
  - Networking industrial
  
  Seja preciso, útil e focado no contexto farmacêutico brasileiro.`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${perplexityKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    }),
  });

  const data = await response.json();
  const aiResponse = data.choices[0].message.content;

  // Salvar interação para melhorar IA
  await supabase
    .from('performance_metrics')
    .insert({
      metric_name: 'ai_assistant_interaction',
      metric_value: 1,
      metric_unit: 'interaction',
      tags: {
        user_id: userId,
        user_type: userProfile?.user_type,
        query_length: message.length,
        response_length: aiResponse.length
      }
    });

  return {
    ai_response: aiResponse,
    sources: data.citations || [],
    related_questions: data.related_questions || [],
    timestamp: new Date().toISOString()
  };
}

async function getSmartSuggestions(supabase: any, perplexityKey: string, chatId: string, userId: string) {
  logStep('Getting smart suggestions');
  
  // Buscar últimas mensagens do chat
  const { data: recentMessages } = await supabase
    .from('chat_messages')
    .select('message')
    .eq('chat_id', chatId)
    .order('sent_at', { ascending: false })
    .limit(5);

  const conversationContext = recentMessages
    ?.map(m => m.message)
    .join('\n') || '';

  const prompt = `Baseado nesta conversa farmacêutica:
  "${conversationContext}"
  
  Sugira 3 tópicos relevantes para continuar a discussão, focando em:
  - Oportunidades de negócio
  - Questões regulatórias
  - Soluções técnicas
  - Parcerias estratégicas`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${perplexityKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        {
          role: 'system',
          content: 'Você é um facilitador de conversas de negócios farmacêuticos. Seja conciso e relevante.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 500
    }),
  });

  const data = await response.json();
  const suggestions = parseSuggestions(data.choices[0].message.content);

  return {
    suggestions,
    context_analyzed: !!conversationContext,
    timestamp: new Date().toISOString()
  };
}

async function translateMessage(perplexityKey: string, message: string) {
  logStep('Translating message');
  
  const prompt = `Traduza esta mensagem para inglês e português (se não estiver nestes idiomas):
  "${message}"
  
  Formato:
  🇧🇷 Português: [tradução]
  🇺🇸 English: [translation]`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${perplexityKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        {
          role: 'system',
          content: 'Você é um tradutor especializado em terminologia farmacêutica.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 300
    }),
  });

  const data = await response.json();
  return {
    translations: data.choices[0].message.content,
    original_message: message,
    timestamp: new Date().toISOString()
  };
}

function parseSuggestions(content: string): string[] {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  return lines
    .filter(line => line.includes('1.') || line.includes('2.') || line.includes('3.') || line.includes('-'))
    .map(line => line.replace(/^\d+\.|\-/g, '').trim())
    .slice(0, 3);
}