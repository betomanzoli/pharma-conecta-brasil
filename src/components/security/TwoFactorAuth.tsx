
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Smartphone, 
  Key, 
  CheckCircle, 
  AlertTriangle,
  Copy,
  RefreshCw,
  Download
} from 'lucide-react';

interface TwoFactorSettings {
  is_enabled: boolean;
  backup_codes: string[];
  setup_complete: boolean;
  last_used: string | null;
}

// Interface para os dados da tabela user_security_settings
interface UserSecuritySettings {
  id: string;
  user_id: string;
  two_factor_enabled: boolean;
  two_factor_secret: string | null;
  two_factor_setup_complete: boolean;
  two_factor_last_used: string | null;
  backup_codes: string[] | null;
  created_at: string;
  updated_at: string;
}

const TwoFactorAuth = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<TwoFactorSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  // Use o hook useSupabaseQuery para buscar as configurações de segurança
  const { data: securityData } = useSupabaseQuery<UserSecuritySettings>({
    queryKey: ['user_security_settings', user?.id],
    table: 'user_security_settings',
    filters: user ? { user_id: user.id } : {},
    single: true,
    enabled: !!user,
    throwError: false
  });

  useEffect(() => {
    if (securityData) {
      setSettings({
        is_enabled: securityData.two_factor_enabled,
        backup_codes: securityData.backup_codes || [],
        setup_complete: securityData.two_factor_setup_complete,
        last_used: securityData.two_factor_last_used
      });
    } else if (user) {
      // Configurações padrão se não existem dados
      setSettings({
        is_enabled: false,
        backup_codes: [],
        setup_complete: false,
        last_used: null
      });
    }
  }, [securityData, user]);

  const initializeTwoFactor = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('two-factor-setup', {
        body: { action: 'initialize' }
      });

      if (error) throw error;

      setQrCode(data.qr_code);
      setSetupStep(2);
      
      toast({
        title: "🔐 Configuração 2FA Iniciada",
        description: "Escaneie o QR code com seu aplicativo autenticador",
      });
    } catch (error) {
      console.error('Error initializing 2FA:', error);
      toast({
        title: "Erro na Configuração",
        description: "Falha ao inicializar autenticação de dois fatores",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const completeTwoFactorSetup = async () => {
    if (!user || !verificationCode) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('two-factor-setup', {
        body: { 
          action: 'verify_setup',
          verification_code: verificationCode
        }
      });

      if (error) throw error;

      setBackupCodes(data.backup_codes);
      setSetupStep(3);
      
      toast({
        title: "✅ 2FA Configurado!",
        description: "Autenticação de dois fatores ativada com sucesso",
      });

      // Recarregar configurações
      window.location.reload();
    } catch (error) {
      console.error('Error completing 2FA setup:', error);
      toast({
        title: "Código Inválido",
        description: "Verifique o código e tente novamente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const disableTwoFactor = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('two-factor-setup', {
        body: { action: 'disable' }
      });

      if (error) throw error;

      toast({
        title: "⚠️ 2FA Desabilitado",
        description: "Autenticação de dois fatores foi desativada",
      });

      // Recarregar configurações
      window.location.reload();
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast({
        title: "Erro",
        description: "Falha ao desabilitar autenticação de dois fatores",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateNewBackupCodes = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('two-factor-setup', {
        body: { action: 'regenerate_backup_codes' }
      });

      if (error) throw error;

      setBackupCodes(data.backup_codes);
      
      toast({
        title: "🔑 Códigos de Backup Atualizados",
        description: "Novos códigos de backup foram gerados",
      });

      // Recarregar configurações
      window.location.reload();
    } catch (error) {
      console.error('Error generating backup codes:', error);
      toast({
        title: "Erro",
        description: "Falha ao gerar novos códigos de backup",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Código copiado para a área de transferência",
    });
  };

  const downloadBackupCodes = () => {
    const content = `Códigos de Backup - PharmaConnect Brasil\n\n${backupCodes.join('\n')}\n\nData: ${new Date().toLocaleDateString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pharmaconnect-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className={`border-l-4 ${settings?.is_enabled ? 'border-l-green-500' : 'border-l-yellow-500'}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              settings?.is_enabled ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <Shield className={`h-6 w-6 ${
                settings?.is_enabled ? 'text-green-600' : 'text-yellow-600'
              }`} />
            </div>
            <div>
              <span className="text-xl">Autenticação de Dois Fatores</span>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={settings?.is_enabled ? 
                  'bg-green-100 text-green-800 border-green-300' : 
                  'bg-yellow-100 text-yellow-800 border-yellow-300'
                }>
                  {settings?.is_enabled ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Ativo
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Inativo
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {settings?.is_enabled ? 
              'Sua conta está protegida com autenticação de dois fatores.' :
              'Adicione uma camada extra de segurança à sua conta.'
            }
          </p>
          
          {settings?.is_enabled ? (
            <div className="flex space-x-4">
              <Button onClick={generateNewBackupCodes} disabled={loading} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Gerar Novos Códigos
              </Button>
              <Button onClick={disableTwoFactor} disabled={loading} variant="destructive">
                Desabilitar 2FA
              </Button>
            </div>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={initializeTwoFactor} disabled={loading}>
                  <Shield className="h-4 w-4 mr-2" />
                  Configurar 2FA
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Configurar Autenticação de Dois Fatores</DialogTitle>
                </DialogHeader>
                
                {setupStep === 1 && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Baixe um App Autenticador</h3>
                      <p className="text-sm text-muted-foreground">
                        Você precisará de um app como Google Authenticator, Authy ou Microsoft Authenticator
                      </p>
                    </div>
                    <Button onClick={initializeTwoFactor} disabled={loading} className="w-full">
                      {loading ? 'Iniciando...' : 'Continuar'}
                    </Button>
                  </div>
                )}
                
                {setupStep === 2 && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="bg-white p-4 rounded-lg border inline-block mb-4">
                        <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Escaneie este QR code com seu app autenticador
                      </p>
                    </div>
                    
                    <Input 
                      placeholder="Digite o código de 6 dígitos"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                    />
                    
                    <Button 
                      onClick={completeTwoFactorSetup} 
                      disabled={loading || verificationCode.length !== 6}
                      className="w-full"
                    >
                      {loading ? 'Verificando...' : 'Verificar e Ativar'}
                    </Button>
                  </div>
                )}
                
                {setupStep === 3 && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">2FA Configurado!</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Guarde estes códigos de backup em local seguro
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                        {backupCodes.map((code, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                            <span>{code}</span>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => copyToClipboard(code)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button onClick={downloadBackupCodes} variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Códigos
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>Dicas de Segurança</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <p>Use um aplicativo autenticador confiável como Google Authenticator ou Authy</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <p>Guarde os códigos de backup em local seguro e offline</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <p>Nunca compartilhe seus códigos de autenticação</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <p>Gere novos códigos de backup periodicamente</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoFactorAuth;
