
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Bell, Lock, Save } from 'lucide-react';

interface SecuritySettings {
  login_notifications: boolean;
  suspicious_activity_alerts: boolean;
  device_tracking: boolean;
  auto_lock_enabled: boolean;
  require_2fa_for_sensitive: boolean;
}

const SecuritySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<SecuritySettings>({
    login_notifications: true,
    suspicious_activity_alerts: true,
    device_tracking: true,
    auto_lock_enabled: true,
    require_2fa_for_sensitive: false
  });
  const [loading, setLoading] = useState(false);

  const { data: securityData, refetch } = useSupabaseQuery({
    queryKey: ['security-settings', user?.id],
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
        auto_lock_enabled: securityData.auto_lock_enabled ?? true,
        require_2fa_for_sensitive: securityData.require_2fa_for_sensitive ?? false
      });
    }
  }, [securityData]);

  const saveSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_security_settings' as any)
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "✅ Configurações Salvas",
        description: "Suas configurações de segurança foram atualizadas",
      });

      refetch();
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

  const updateSetting = (key: keyof SecuritySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <span>Configurações de Segurança</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">Notificações</h3>
            </div>
            
            <div className="space-y-4 pl-7">
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
            </div>
          </div>

          {/* Security Features */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">Recursos de Segurança</h3>
            </div>
            
            <div className="space-y-4 pl-7">
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
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
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

export default SecuritySettings;
