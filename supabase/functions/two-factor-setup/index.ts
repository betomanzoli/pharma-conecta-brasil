
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[TWO-FACTOR-SETUP] ${step}${detailsStr}`);
};

// Função para gerar código TOTP
function generateTOTPSecret(): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 32; i++) {
    secret += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return secret;
}

// Função para gerar códigos de backup
function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }
  return codes;
}

// Função para gerar QR code (usando uma API pública)
function generateQRCodeURL(secret: string, email: string): string {
  const issuer = 'PharmaConnect Brasil';
  const accountName = `${issuer}:${email}`;
  const otpauthURL = `otpauth://totp/${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthURL)}`;
}

// Função simplificada de verificação TOTP (para demo)
function verifyTOTP(secret: string, token: string): boolean {
  // Em produção, usar uma biblioteca TOTP real como otplib
  // Esta é uma verificação simplificada para demonstração
  const timeStep = Math.floor(Date.now() / 1000 / 30);
  const expectedTokens = [
    generateSimpleTOTP(secret, timeStep - 1),
    generateSimpleTOTP(secret, timeStep),
    generateSimpleTOTP(secret, timeStep + 1)
  ];
  
  return expectedTokens.includes(token);
}

function generateSimpleTOTP(secret: string, timeStep: number): string {
  // Implementação simplificada para demonstração
  // Em produção, usar algoritmo HMAC-SHA1 adequado
  const hash = btoa(secret + timeStep.toString()).slice(0, 6);
  return hash.replace(/[^0-9]/g, '').padStart(6, '0').slice(0, 6);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Two-factor setup request received");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const { action, verification_code } = await req.json();
    logStep("Processing action", { action, userId: user.id });

    switch (action) {
      case 'initialize': {
        // Gerar segredo TOTP e QR code
        const secret = generateTOTPSecret();
        const qrCodeURL = generateQRCodeURL(secret, user.email!);
        
        // Salvar segredo temporário (não ativado ainda)
        const { error: upsertError } = await supabase
          .from('user_security_settings')
          .upsert({
            user_id: user.id,
            two_factor_secret: secret,
            two_factor_enabled: false,
            two_factor_setup_complete: false,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });

        if (upsertError) throw upsertError;

        return new Response(JSON.stringify({
          success: true,
          qr_code: qrCodeURL,
          secret: secret // Remover em produção por segurança
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case 'verify_setup': {
        if (!verification_code) {
          throw new Error('Verification code required');
        }

        // Buscar segredo temporário
        const { data: settings, error: settingsError } = await supabase
          .from('user_security_settings')
          .select('two_factor_secret')
          .eq('user_id', user.id)
          .single();

        if (settingsError || !settings?.two_factor_secret) {
          throw new Error('Setup not initialized');
        }

        // Verificar código TOTP
        if (!verifyTOTP(settings.two_factor_secret, verification_code)) {
          throw new Error('Invalid verification code');
        }

        // Gerar códigos de backup
        const backupCodes = generateBackupCodes();

        // Ativar 2FA
        const { error: activateError } = await supabase
          .from('user_security_settings')
          .upsert({
            user_id: user.id,
            two_factor_enabled: true,
            two_factor_setup_complete: true,
            backup_codes: backupCodes,
            two_factor_activated_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });

        if (activateError) throw activateError;

        // Log segurança
        await supabase.from('security_audit_logs').insert({
          user_id: user.id,
          action: 'two_factor_enabled',
          ip_address: req.headers.get('cf-connecting-ip') || 'unknown',
          user_agent: req.headers.get('user-agent') || 'unknown',
          metadata: {
            setup_completed: true,
            backup_codes_generated: backupCodes.length
          }
        });

        return new Response(JSON.stringify({
          success: true,
          backup_codes: backupCodes,
          message: 'Two-factor authentication enabled successfully'
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case 'disable': {
        // Desabilitar 2FA
        const { error: disableError } = await supabase
          .from('user_security_settings')
          .update({
            two_factor_enabled: false,
            two_factor_setup_complete: false,
            two_factor_secret: null,
            backup_codes: null,
            two_factor_disabled_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (disableError) throw disableError;

        // Log segurança
        await supabase.from('security_audit_logs').insert({
          user_id: user.id,
          action: 'two_factor_disabled',
          ip_address: req.headers.get('cf-connecting-ip') || 'unknown',
          user_agent: req.headers.get('user-agent') || 'unknown',
          metadata: {
            disabled_at: new Date().toISOString()
          }
        });

        return new Response(JSON.stringify({
          success: true,
          message: 'Two-factor authentication disabled'
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      case 'regenerate_backup_codes': {
        // Verificar se 2FA está ativo
        const { data: settings, error: settingsError } = await supabase
          .from('user_security_settings')
          .select('two_factor_enabled')
          .eq('user_id', user.id)
          .single();

        if (settingsError || !settings?.two_factor_enabled) {
          throw new Error('Two-factor authentication not enabled');
        }

        // Gerar novos códigos
        const newBackupCodes = generateBackupCodes();

        const { error: updateError } = await supabase
          .from('user_security_settings')
          .update({
            backup_codes: newBackupCodes,
            backup_codes_regenerated_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (updateError) throw updateError;

        // Log segurança
        await supabase.from('security_audit_logs').insert({
          user_id: user.id,
          action: 'backup_codes_regenerated',
          ip_address: req.headers.get('cf-connecting-ip') || 'unknown',
          user_agent: req.headers.get('user-agent') || 'unknown',
          metadata: {
            codes_count: newBackupCodes.length
          }
        });

        return new Response(JSON.stringify({
          success: true,
          backup_codes: newBackupCodes,
          message: 'Backup codes regenerated successfully'
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in two-factor setup", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
