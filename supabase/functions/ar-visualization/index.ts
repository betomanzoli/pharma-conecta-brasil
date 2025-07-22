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

    const { action, facilityId, userId, coordinates, deviceInfo } = await req.json()

    console.log('AR Visualization request:', { action, facilityId })

    switch (action) {
      case 'generate_facility_model':
        return await generateFacilityModel(supabase, facilityId)
      case 'get_ar_markers':
        return await getARMarkers(supabase, facilityId)
      case 'create_virtual_tour':
        return await createVirtualTour(supabase, facilityId, userId)
      case 'track_ar_interaction':
        return await trackARInteraction(supabase, userId, coordinates, deviceInfo)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('AR Visualization error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function generateFacilityModel(supabase: any, facilityId: string) {
  // Buscar dados da instalação
  const { data: facility } = await supabase
    .from('laboratories')
    .select('*')
    .eq('id', facilityId)
    .single()

  if (!facility) {
    throw new Error('Facility not found')
  }

  // Gerar modelo 3D baseado nos dados
  const ar3DModel = {
    id: crypto.randomUUID(),
    facility_id: facilityId,
    model_type: 'laboratory_3d',
    model_url: generateModelUrl(facility),
    texture_urls: generateTextureUrls(facility),
    anchor_points: generateAnchorPoints(facility),
    equipment_markers: generateEquipmentMarkers(facility),
    scale: calculateOptimalScale(facility),
    metadata: {
      generated_at: new Date().toISOString(),
      equipment_count: facility.equipment_list?.length || 0,
      facility_area: calculateFacilityArea(facility),
      supported_devices: ['iOS', 'Android', 'WebXR']
    }
  }

  // Salvar modelo no banco
  const { data, error } = await supabase
    .from('ar_facility_models')
    .upsert(ar3DModel, { onConflict: 'facility_id' })
    .select()
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify({ 
      success: true, 
      model: ar3DModel,
      instructions: {
        webxr_url: `https://farmaconnect.app/ar/view/${facilityId}`,
        ios_requirements: 'iOS 12+ with ARKit support',
        android_requirements: 'Android 7.0+ with ARCore support'
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getARMarkers(supabase: any, facilityId: string) {
  const { data: facility } = await supabase
    .from('laboratories')
    .select('*')
    .eq('id', facilityId)
    .single()

  if (!facility) {
    throw new Error('Facility not found')
  }

  const arMarkers = [
    {
      id: 'entry_point',
      type: 'facility_entrance',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      content: {
        title: facility.name,
        description: facility.description,
        certifications: facility.certifications,
        operating_hours: facility.operating_hours
      }
    },
    ...generateEquipmentMarkers(facility),
    {
      id: 'info_panel',
      type: 'information_display',
      position: { x: 2, y: 1.5, z: -1 },
      content: {
        compliance_status: 'GMP Certified',
        capacity: facility.available_capacity,
        contact_info: facility.phone
      }
    }
  ]

  return new Response(
    JSON.stringify({ 
      success: true, 
      markers: arMarkers,
      tracking_image: `https://farmaconnect.app/ar/tracking/${facilityId}.png`
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function createVirtualTour(supabase: any, facilityId: string, userId: string) {
  const virtualTour = {
    id: crypto.randomUUID(),
    facility_id: facilityId,
    created_by: userId,
    tour_type: 'interactive_ar',
    waypoints: [
      {
        id: 'start',
        position: { x: 0, y: 0, z: 0 },
        title: 'Entrada Principal',
        description: 'Bem-vindo ao laboratório farmacêutico',
        duration: 30,
        media_url: '/ar/videos/entrance.mp4'
      },
      {
        id: 'production_area',
        position: { x: 5, y: 0, z: 3 },
        title: 'Área de Produção',
        description: 'Equipamentos de última geração para fabricação',
        duration: 60,
        media_url: '/ar/videos/production.mp4'
      },
      {
        id: 'quality_control',
        position: { x: -3, y: 0, z: 5 },
        title: 'Controle de Qualidade',
        description: 'Laboratório de análises e testes',
        duration: 45,
        media_url: '/ar/videos/quality.mp4'
      }
    ],
    total_duration: 135,
    languages: ['pt-BR', 'en-US'],
    accessibility: {
      audio_descriptions: true,
      subtitles: true,
      voice_navigation: true
    },
    created_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('ar_virtual_tours')
    .insert(virtualTour)
    .select()
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify({ 
      success: true, 
      tour: virtualTour,
      start_url: `https://farmaconnect.app/ar/tour/${virtualTour.id}`
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function trackARInteraction(supabase: any, userId: string, coordinates: any, deviceInfo: any) {
  const interaction = {
    id: crypto.randomUUID(),
    user_id: userId,
    interaction_type: 'ar_viewing',
    coordinates: coordinates,
    device_info: deviceInfo,
    timestamp: new Date().toISOString(),
    session_duration: Math.floor(Math.random() * 300), // Em segundos
    features_used: ['3d_model', 'markers', 'virtual_tour'],
    performance_metrics: {
      fps: Math.floor(Math.random() * 30) + 30,
      tracking_quality: 'high',
      occlusion_accuracy: 0.95
    }
  }

  await supabase.from('ar_interaction_analytics').insert(interaction)

  return new Response(
    JSON.stringify({ success: true, tracked: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Funções auxiliares
function generateModelUrl(facility: any): string {
  return `https://cdn.farmaconnect.app/3d/models/${facility.id}.glb`
}

function generateTextureUrls(facility: any): string[] {
  return [
    `https://cdn.farmaconnect.app/3d/textures/${facility.id}_diffuse.jpg`,
    `https://cdn.farmaconnect.app/3d/textures/${facility.id}_normal.jpg`,
    `https://cdn.farmaconnect.app/3d/textures/${facility.id}_metallic.jpg`
  ]
}

function generateAnchorPoints(facility: any): any[] {
  return [
    { id: 'floor', position: { x: 0, y: -0.1, z: 0 } },
    { id: 'ceiling', position: { x: 0, y: 3, z: 0 } },
    { id: 'walls', positions: [
      { x: -5, y: 1.5, z: 0 },
      { x: 5, y: 1.5, z: 0 },
      { x: 0, y: 1.5, z: -5 },
      { x: 0, y: 1.5, z: 5 }
    ]}
  ]
}

function generateEquipmentMarkers(facility: any): any[] {
  return facility.equipment_list?.map((equipment: string, index: number) => ({
    id: `equipment_${index}`,
    type: 'equipment_info',
    position: { 
      x: (index % 3) * 2 - 2, 
      y: 1, 
      z: Math.floor(index / 3) * 2 
    },
    content: {
      name: equipment,
      status: 'operational',
      last_maintenance: new Date().toISOString(),
      specifications: 'Ver manual técnico'
    }
  })) || []
}

function calculateOptimalScale(facility: any): { x: number, y: number, z: number } {
  const baseScale = Math.max(1, (facility.equipment_list?.length || 1) / 10)
  return { x: baseScale, y: baseScale, z: baseScale }
}

function calculateFacilityArea(facility: any): number {
  // Simular área baseada na quantidade de equipamentos
  return (facility.equipment_list?.length || 1) * 50 // m²
}