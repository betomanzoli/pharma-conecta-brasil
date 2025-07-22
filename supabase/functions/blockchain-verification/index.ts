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

    const { action, documentId, documentHash, userId, verification } = await req.json()

    console.log('Blockchain verification request:', { action, documentId })

    switch (action) {
      case 'create_certificate':
        return await createCertificate(supabase, documentId, documentHash, userId)
      case 'verify_document':
        return await verifyDocument(supabase, documentId, documentHash)
      case 'register_verification':
        return await registerVerification(supabase, verification)
      case 'get_audit_trail':
        return await getAuditTrail(supabase, documentId)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Blockchain verification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function createCertificate(supabase: any, documentId: string, documentHash: string, userId: string) {
  const timestamp = new Date().toISOString()
  const blockchainHash = await generateBlockchainHash(documentHash, timestamp)
  
  // Simular registro em blockchain
  const certificate = {
    id: crypto.randomUUID(),
    document_id: documentId,
    document_hash: documentHash,
    blockchain_hash: blockchainHash,
    blockchain_address: `0x${Math.random().toString(16).substr(2, 40)}`,
    timestamp: timestamp,
    issuer_id: userId,
    status: 'verified',
    verification_type: 'pharmaceutical_document',
    metadata: {
      network: 'ethereum',
      gas_fee: '0.001 ETH',
      block_number: Math.floor(Math.random() * 1000000)
    }
  }

  const { data, error } = await supabase
    .from('blockchain_certificates')
    .insert(certificate)
    .select()
    .single()

  if (error) throw error

  // Log da operação
  await supabase.from('blockchain_audit_log').insert({
    certificate_id: certificate.id,
    action: 'certificate_created',
    user_id: userId,
    details: { documentId, blockchainHash }
  })

  return new Response(
    JSON.stringify({ 
      success: true, 
      certificate,
      verification_url: `https://etherscan.io/tx/${certificate.blockchain_hash}`
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function verifyDocument(supabase: any, documentId: string, documentHash: string) {
  const { data: certificate } = await supabase
    .from('blockchain_certificates')
    .select('*')
    .eq('document_id', documentId)
    .eq('document_hash', documentHash)
    .single()

  if (!certificate) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        verified: false, 
        error: 'Documento não encontrado na blockchain' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Verificar integridade
  const isValid = await verifyBlockchainIntegrity(certificate)
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      verified: isValid,
      certificate: {
        blockchain_address: certificate.blockchain_address,
        timestamp: certificate.timestamp,
        issuer: certificate.issuer_id,
        verification_url: `https://etherscan.io/tx/${certificate.blockchain_hash}`
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function registerVerification(supabase: any, verification: any) {
  const verificationRecord = {
    id: crypto.randomUUID(),
    entity_type: verification.entityType,
    entity_id: verification.entityId,
    verification_type: verification.type,
    verified_by: verification.verifiedBy,
    verification_date: new Date().toISOString(),
    expiry_date: verification.expiryDate,
    status: 'active',
    blockchain_hash: await generateBlockchainHash(
      JSON.stringify(verification), 
      new Date().toISOString()
    ),
    metadata: verification.metadata || {}
  }

  const { data, error } = await supabase
    .from('digital_verifications')
    .insert(verificationRecord)
    .select()
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true, verification: verificationRecord }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getAuditTrail(supabase: any, documentId: string) {
  const { data: auditTrail } = await supabase
    .from('blockchain_audit_log')
    .select(`
      *,
      blockchain_certificates(*)
    `)
    .eq('blockchain_certificates.document_id', documentId)
    .order('created_at', { ascending: false })

  return new Response(
    JSON.stringify({ success: true, auditTrail }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function generateBlockchainHash(data: string, timestamp: string): Promise<string> {
  const combinedData = data + timestamp + Math.random().toString()
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(combinedData)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function verifyBlockchainIntegrity(certificate: any): Promise<boolean> {
  // Simular verificação de integridade blockchain
  // Em produção, isso faria uma consulta real à blockchain
  const currentTime = new Date().getTime()
  const certTime = new Date(certificate.timestamp).getTime()
  const timeDiff = currentTime - certTime
  
  // Considera válido se foi criado nas últimas 24 horas (simulação)
  return timeDiff < 24 * 60 * 60 * 1000 && certificate.status === 'verified'
}