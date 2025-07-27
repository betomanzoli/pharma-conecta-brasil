import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  Lock, 
  Globe, 
  Clock, 
  AlertTriangle,
  Eye,
  Settings,
  Smartphone,
  Save
} from 'lucide-react';

interface SecuritySettings {
  login_notifications: boolean;
  suspicious_activity_alerts: boolean;
  device_tracking: boolean;
  session_timeout: number;
  allowed_ip_ranges: string[];
  max_failed_attempts: number;
  auto_lock_enabled: boolean;
  password_expiry_days: number;
  require_2fa_for_sensitive: boolean;
}

const AdvancedSecuritySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<SecuritySettings>({
    login_notifications: true,
    suspicious_activity_alerts: true,
    device_tracking: true,
    session_timeout: 30,
    allowed_ip_ranges: [],
    max_failed_attempts: 5,
    auto_lock_enabled: true,
    password_expiry_days: 90,
    require_2fa_for_sensitive: false
  });
  const [loading, setLoading] = useState(false);
  const [newIpRange, setNewIpRange] = useState('');

  const { data: securityData } = useSupabaseQuery({
    queryKey: ['user_security_settings', user?.id],
    table: 'user_security_settings',
    filters: { user_id: user?.id },
    single: true,
    enabled: !!user?.id
  });

  useEffect(() => {
    if (securityData) {
      setSettings({
        login_notifications: securityData.login_notifications ?? true,
        suspicious_activity_alerts: securityData.suspicious_activity_alerts ?? true,
        device_tracking: securityData.device_tracking ?? true,
        session_timeout: securityData.session_timeout ?? 30,
        allowed_ip_ranges: securityData.allowed_ip_ranges ?? [],
        max_failed_attempts: securityData.max_failed_attempts ?? 5,
        auto_lock_enabled: securityData.auto_lock_enabled ?? true,
        password_expiry_days: securityData.password_expiry_days ?? 90,
        require_2fa_for_sensitive: securityData.require_2fa_for_sensitive ?? false
      });
    }
  }, [securityData]);

  const saveSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_security_settings')
        .upsert({
          user_id: user.id,
          login_notifications: settings.login_notifications,
          suspicious_activity_alerts: settings.suspicious_activity_alerts,
          device_tracking: settings.device_tracking,
          session_timeout: settings.session_timeout,
          allowed_ip_ranges: settings.allowed_ip_ranges,
          max_failed_attempts: settings.max_failed_attempts,
          auto_lock_enabled: settings.auto_lock_enabled,
          password_expiry_days: settings.password_expiry_days,
          require_2fa_for_sensitive: settings.require_2fa_for_sensitive,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "✅ Configurações Salvas",
        description: "Suas configurações de segurança foram atualizadas",
      });

      // Log security event
      await supabase.rpc('log_security_event', {
        p_user_id: user.id,
        p_event_type: 'security_settings_updated',
        p_description: 'Configurações de segurança atualizadas pelo usuário'
      });

    } catch (error) {
      console.error('Error saving security settings:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar configurações de segurança",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addIpRange = () => {
    if (newIpRange && !settings.allowed_ip_ranges.includes(newIpRange)) {
      setSettings(prev => ({
        ...prev,
        allowed_ip_ranges: [...prev.allowed_ip_ranges, newIpRange]
      }));
      setNewIpRange('');
    }
  };

  const removeIpRange = (ipRange: string) => {
    setSettings(prev => ({
      ...prev,
      allowed_ip_ranges: prev.allowed_ip_ranges.filter(ip => ip !== ipRange)
    }));
  };

  const updateSetting = (key: keyof SecuritySettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <span className="text-xl">Configurações de Segurança Avançadas</span>
              <p className="text-sm text-muted-foreground mt-1">
                Configure opções avançadas de segurança para sua conta
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Notificações de Segurança</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="login-notifications">Notificações de Login</Label>
              <p className="text-sm text-muted-foreground">
                Receba notificações quando alguém fizer login na sua conta
              </p>
            </div>
            <Switch
              id="login-notifications"
              checked={settings.login_notifications}
              onCheckedChange={(checked) => updateSetting('login_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="suspicious-alerts">Alertas de Atividade Suspeita</Label>
              <p className="text-sm text-muted-foreground">
                Receba alertas quando atividades suspeitas forem detectadas
              </p>
            </div>
            <Switch
              id="suspicious-alerts"
              checked={settings.suspicious_activity_alerts}
              onCheckedChange={(checked) => updateSetting('suspicious_activity_alerts', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="device-tracking">Rastreamento de Dispositivos</Label>
              <p className="text-sm text-muted-foreground">
                Monitore dispositivos utilizados para acessar sua conta
              </p>
            </div>
            <Switch
              id="device-tracking"
              checked={settings.device_tracking}
              onCheckedChange={(checked) => updateSetting('device_tracking', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Session Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Configurações de Sessão</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session-timeout">Timeout da Sessão (minutos)</Label>
            <Select 
              value={settings.session_timeout.toString()} 
              onValueChange={(value) => updateSetting('session_timeout', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o timeout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="120">2 horas</SelectItem>
                <SelectItem value="480">8 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-lock">Bloqueio Automático</Label>
              <p className="text-sm text-muted-foreground">
                Bloquear conta automaticamente após tentativas falhadas
              </p>
            </div>
            <Switch
              id="auto-lock"
              checked={settings.auto_lock_enabled}
              onCheckedChange={(checked) => updateSetting('auto_lock_enabled', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-attempts">Máximo de Tentativas Falhadas</Label>
            <Select 
              value={settings.max_failed_attempts.toString()} 
              onValueChange={(value) => updateSetting('max_failed_attempts', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o máximo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 tentativas</SelectItem>
                <SelectItem value="5">5 tentativas</SelectItem>
                <SelectItem value="10">10 tentativas</SelectItem>
                <SelectItem value="15">15 tentativas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* IP Access Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Controle de Acesso por IP</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ip-ranges">Faixas de IP Permitidas</Label>
            <div className="flex space-x-2">
              <Input
                id="ip-ranges"
                placeholder="Ex: 192.168.1.0/24"
                value={newIpRange}
                onChange={(e) => setNewIpRange(e.target.value)}
              />
              <Button onClick={addIpRange} variant="outline">
                Adicionar
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {settings.allowed_ip_ranges.map((ipRange, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="font-mono text-sm">{ipRange}</span>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => removeIpRange(ipRange)}
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>

          {settings.allowed_ip_ranges.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhuma restrição de IP configurada (acesso permitido de qualquer IP)
            </p>
          )}
        </CardContent>
      </Card>

      {/* Password Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Configurações de Senha</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password-expiry">Expiração da Senha (dias)</Label>
            <Select 
              value={settings.password_expiry_days.toString()} 
              onValueChange={(value) => updateSetting('password_expiry_days', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a expiração" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 dias</SelectItem>
                <SelectItem value="60">60 dias</SelectItem>
                <SelectItem value="90">90 dias</SelectItem>
                <SelectItem value="180">180 dias</SelectItem>
                <SelectItem value="365">1 ano</SelectItem>
                <SelectItem value="0">Nunca expira</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="require-2fa">2FA para Ações Sensíveis</Label>
              <p className="text-sm text-muted-foreground">
                Exigir autenticação de dois fatores para ações críticas
              </p>
            </div>
            <Switch
              id="require-2fa"
              checked={settings.require_2fa_for_sensitive}
              onCheckedChange={(checked) => updateSetting('require_2fa_for_sensitive', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end space-x-4">
            <Button 
              onClick={saveSettings} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedSecuritySettings;
