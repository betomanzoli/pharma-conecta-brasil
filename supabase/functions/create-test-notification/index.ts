import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Sem autorização' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Set the auth header for the supabase client
    supabaseClient.auth.setSession({ access_token: authHeader.replace('Bearer ', ''), refresh_token: '' })

    // Get the current user
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Usuário não encontrado' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { type = 'system' } = await req.json()

    // Tipos de notificações de exemplo
    const notificationTypes = {
      mentorship: {
        title: 'Nova Sessão de Mentoria Disponível',
        message: 'Um novo mentor está disponível para sessões em Assuntos Regulatórios. Reserve já sua sessão!',
        type: 'mentorship'
      },
      forum: {
        title: 'Nova Discussão no Fórum',
        message: 'Nova discussão sobre "Registro de Medicamentos Genéricos" foi criada. Participe da conversa!',
        type: 'forum'
      },
      system: {
        title: 'Bem-vindo ao Sistema de Notificações!',
        message: 'Agora você receberá notificações em tempo real sobre atividades importantes na plataforma.',
        type: 'system'
      },
      achievement: {
        title: 'Conquista Desbloqueada!',
        message: 'Parabéns! Você completou seu primeiro projeto na plataforma. Continue assim!',
        type: 'system'
      }
    }

    const selectedNotification = notificationTypes[type as keyof typeof notificationTypes] || notificationTypes.system

    // Criar a notificação usando a função RPC
    const { data, error } = await supabaseClient.rpc('create_system_notification', {
      target_user_id: user.id,
      notification_title: selectedNotification.title,
      notification_message: selectedNotification.message,
      notification_type: selectedNotification.type
    })

    if (error) {
      console.error('Erro ao criar notificação:', error)
      return new Response(
        JSON.stringify({ error: 'Falha ao criar notificação', details: error.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        notification_id: data,
        notification: selectedNotification
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Erro no edge function:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})