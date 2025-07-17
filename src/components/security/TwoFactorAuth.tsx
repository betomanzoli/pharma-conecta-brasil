import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldCheck, Smartphone, Key, QrCode, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TwoFactorAuthProps {
  isEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

export function TwoFactorAuth({ isEnabled = false, onToggle }: TwoFactorAuthProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'setup' | 'verify' | 'backup'>('setup');
  const [verificationCode, setVerificationCode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const { toast } = useToast();

  const handleEnable2FA = async () => {
    setLoading(true);
    try {
      // Simulate 2FA setup process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock QR code and backup codes
      setQrCode('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/PharmaConnect:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=PharmaConnect');
      setBackupCodes([
        'A1B2-C3D4-E5F6',
        'G7H8-I9J0-K1L2',
        'M3N4-O5P6-Q7R8',
        'S9T0-U1V2-W3X4',
        'Y5Z6-A7B8-C9D0'
      ]);
      setStep('verify');
      
      toast({
        title: "2FA Configurado",
        description: "Escaneie o QR code com seu app autenticador",
      });
    } catch (error) {
      toast({
        title: "Erro na Configuração",
        description: "Não foi possível configurar 2FA. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Código Inválido",
        description: "Digite um código de 6 dígitos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (verificationCode === '123456') {
        setStep('backup');
        toast({
          title: "2FA Ativado",
          description: "Autenticação de dois fatores ativada com sucesso!",
        });
      } else {
        toast({
          title: "Código Incorreto",
          description: "Verifique o código e tente novamente",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na Verificação",
        description: "Não foi possível verificar o código",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onToggle?.(false);
      toast({
        title: "2FA Desativado",
        description: "Autenticação de dois fatores foi desativada",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível desativar 2FA",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFinishSetup = () => {
    onToggle?.(true);
    setStep('setup');
    setVerificationCode('');
  };

  if (isEnabled) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              <CardTitle>Autenticação de Dois Fatores</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Ativo
            </Badge>
          </div>
          <CardDescription>
            Sua conta está protegida com autenticação de dois fatores
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Sua conta possui uma camada extra de segurança. Você precisará do código do seu app autenticador para fazer login.
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Gerar Novos Códigos de Backup
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleDisable2FA}
              disabled={loading}
            >
              Desativar 2FA
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Autenticação de Dois Fatores</CardTitle>
        </div>
        <CardDescription>
          Adicione uma camada extra de segurança à sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 'setup' && (
          <div className="space-y-4">
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                A autenticação de dois fatores protege sua conta exigindo um código adicional do seu dispositivo móvel.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <h4 className="font-medium">Como funciona:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Instale um app autenticador (Google Authenticator, Authy, etc.)</li>
                <li>• Escaneie o QR code que será gerado</li>
                <li>• Digite códigos de 6 dígitos ao fazer login</li>
              </ul>
            </div>
            
            <Button onClick={handleEnable2FA} disabled={loading} className="w-full">
              {loading ? 'Configurando...' : 'Ativar 2FA'}
            </Button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <div className="text-center space-y-4">
              <QrCode className="h-8 w-8 mx-auto text-primary" />
              <h3 className="font-medium">Escaneie o QR Code</h3>
              
              {qrCode && (
                <div className="flex justify-center">
                  <img src={qrCode} alt="QR Code" className="border rounded" />
                </div>
              )}
              
              <p className="text-sm text-muted-foreground">
                Use seu app autenticador para escanear este código
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="verification-code">Código de Verificação</Label>
              <Input
                id="verification-code"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-lg tracking-wider"
              />
            </div>
            
            <Button 
              onClick={handleVerify2FA} 
              disabled={loading || verificationCode.length !== 6}
              className="w-full"
            >
              {loading ? 'Verificando...' : 'Verificar Código'}
            </Button>
          </div>
        )}

        {step === 'backup' && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <Key className="h-8 w-8 mx-auto text-primary" />
              <h3 className="font-medium">Códigos de Backup</h3>
              <p className="text-sm text-muted-foreground">
                Guarde estes códigos em local seguro. Use-os se perder acesso ao seu dispositivo.
              </p>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <div className="grid grid-cols-1 gap-2 font-mono text-sm">
                {backupCodes.map((code, index) => (
                  <div key={index} className="p-2 bg-background rounded border text-center">
                    {code}
                  </div>
                ))}
              </div>
            </div>
            
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> Cada código só pode ser usado uma vez. 
                Guarde-os em local seguro e não os compartilhe.
              </AlertDescription>
            </Alert>
            
            <Button onClick={handleFinishSetup} className="w-full">
              Concluir Configuração
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}