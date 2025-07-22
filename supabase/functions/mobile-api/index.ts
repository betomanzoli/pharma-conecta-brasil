import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { action, userId, userType } = await req.json()

    console.log('Mobile API request:', { action, userType })

    switch (action) {
      case 'get_mobile_dashboard':
        return await getMobileDashboard(supabase, userId, userType)
      case 'get_mobile_matches':
        return await getMobileMatches(supabase, userId, userType)
      case 'get_mobile_notifications':
        return await getMobileNotifications(supabase, userId)
      case 'optimize_data':
        return await optimizeDataForMobile(supabase, userId, userType)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Mobile API error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function getMobileDashboard(supabase: any, userId: string, userType: string) {
  const dashboardData = {
    overview: {},
    quickActions: [],
    recentActivity: [],
    alerts: []
  }

  // Dados específicos por tipo de usuário
  if (userType === 'pharmaceutical_company') {
    const { data: company } = await supabase
      .from('companies')
      .select('*')
      .eq('profile_id', userId)
      .single()

    if (company) {
      dashboardData.overview = {
        companyName: company.name,
        complianceStatus: company.compliance_status,
        activeProjects: 12,
        sentimentScore: company.sentiment_score
      }
      
      dashboardData.quickActions = [
        { id: 'find_labs', title: 'Encontrar Laboratórios', icon: 'lab' },
        { id: 'check_compliance', title: 'Verificar Compliance', icon: 'shield' },
        { id: 'view_alerts', title: 'Alertas ANVISA', icon: 'alert' }
      ]
    }
  }

  return new Response(
    JSON.stringify({ success: true, dashboard: dashboardData }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getMobileMatches(supabase: any, userId: string, userType: string) {
  // Usar AI Matching existente otimizado para mobile
  const { data, error } = await supabase.functions.invoke('ai-matching-enhanced', {
    body: { userType, userId, isMobile: true, limit: 10 }
  })

  if (error) throw error

  // Simplificar dados para mobile
  const mobileMatches = data.matches?.map((match: any) => ({
    id: match.id,
    name: match.name,
    compatibility: Math.round(match.compatibility_score * 100),
    location: match.location || match.city,
    type: match.type,
    thumbnail: match.avatar_url || '/placeholder-avatar.png'
  })) || []

  return new Response(
    JSON.stringify({ success: true, matches: mobileMatches }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getMobileNotifications(supabase: any, userId: string) {
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('read', false)
    .order('created_at', { ascending: false })
    .limit(20)

  const mobileNotifications = notifications?.map((notif: any) => ({
    id: notif.id,
    title: notif.title,
    message: notif.message.substring(0, 80) + '...',
    type: notif.type,
    time: notif.created_at,
    read: notif.read
  })) || []

  return new Response(
    JSON.stringify({ success: true, notifications: mobileNotifications }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function optimizeDataForMobile(supabase: any, userId: string, userType: string) {
  // Cache dados essenciais para offline
  const cacheData: any = {}

  // Perfil do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (profile) {
    cacheData.profile = {
      id: profile.id,
      name: `${profile.first_name} ${profile.last_name}`,
      email: profile.email,
      type: profile.user_type
    }
  }

  // Dados específicos por tipo
  if (userType === 'pharmaceutical_company') {
    const { data: company } = await supabase
      .from('companies')
      .select('name, compliance_status, sentiment_score')
      .eq('profile_id', userId)
      .single()
    
    if (company) cacheData.company = company
  }

  return new Response(
    JSON.stringify({ success: true, cacheData }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}