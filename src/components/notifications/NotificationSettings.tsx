import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bell, MessageCircle, Award, BookOpen, Mail, Smartphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface NotificationPreferences {
  mentorship_enabled: boolean;
  forum_enabled: boolean;
  system_enabled: boolean;
  knowledge_enabled: boolean;
  marketing_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
}

const NotificationSettings: React.FC = () => {
  const { profile } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    mentorship_enabled: true,
    forum_enabled: true,
    system_enabled: true,
    knowledge_enabled: true,
    marketing_enabled: false,
    email_notifications: true,
    push_notifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      fetchPreferences();
    }
  }, [profile?.id]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', profile?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          mentorship_enabled: data.mentorship_enabled,
          forum_enabled: data.forum_enabled,
          system_enabled: data.system_enabled,
          knowledge_enabled: data.knowledge_enabled,
          marketing_enabled: data.marketing_enabled,
          email_notifications: data.email_notifications,
          push_notifications: data.push_notifications,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
      toast.error('Erro ao carregar preferências de notificação');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<NotificationPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);

    setSaving(true);
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: profile?.id,
          ...newPreferences,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('Preferências atualizadas com sucesso');
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      toast.error('Erro ao salvar preferências');
      // Reverter mudança em caso de erro
      setPreferences(preferences);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Configurações de Notificações</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Configurações de Notificações</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Escolha que tipos de notificações você deseja receber
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tipos de Notificações */}
        <div>
          <h3 className="text-lg font-medium mb-4">Tipos de Notificações</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Award className="h-5 w-5 text-blue-500" />
                <div>
                  <Label htmlFor="mentorship">Mentoria</Label>
                  <p className="text-sm text-muted-foreground">
                    Sessões agendadas, concluídas e canceladas
                  </p>
                </div>
              </div>
              <Switch
                id="mentorship"
                checked={preferences.mentorship_enabled}
                onCheckedChange={(checked) => 
                  updatePreferences({ mentorship_enabled: checked })
                }
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-5 w-5 text-green-500" />
                <div>
                  <Label htmlFor="forum">Fórum</Label>
                  <p className="text-sm text-muted-foreground">
                    Respostas nos seus tópicos e curtidas
                  </p>
                </div>
              </div>
              <Switch
                id="forum"
                checked={preferences.forum_enabled}
                onCheckedChange={(checked) => 
                  updatePreferences({ forum_enabled: checked })
                }
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-purple-500" />
                <div>
                  <Label htmlFor="knowledge">Biblioteca de Conhecimento</Label>
                  <p className="text-sm text-muted-foreground">
                    Avaliações nos seus recursos compartilhados
                  </p>
                </div>
              </div>
              <Switch
                id="knowledge"
                checked={preferences.knowledge_enabled}
                onCheckedChange={(checked) => 
                  updatePreferences({ knowledge_enabled: checked })
                }
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-yellow-500" />
                <div>
                  <Label htmlFor="system">Sistema</Label>
                  <p className="text-sm text-muted-foreground">
                    Atualizações importantes da plataforma
                  </p>
                </div>
              </div>
              <Switch
                id="system"
                checked={preferences.system_enabled}
                onCheckedChange={(checked) => 
                  updatePreferences({ system_enabled: checked })
                }
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-red-500" />
                <div>
                  <Label htmlFor="marketing">Marketing</Label>
                  <p className="text-sm text-muted-foreground">
                    Novidades, dicas e promoções
                  </p>
                </div>
              </div>
              <Switch
                id="marketing"
                checked={preferences.marketing_enabled}
                onCheckedChange={(checked) => 
                  updatePreferences({ marketing_enabled: checked })
                }
                disabled={saving}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Canais de Notificação */}
        <div>
          <h3 className="text-lg font-medium mb-4">Canais de Notificação</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <div>
                  <Label htmlFor="email">Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações no seu email
                  </p>
                </div>
              </div>
              <Switch
                id="email"
                checked={preferences.email_notifications}
                onCheckedChange={(checked) => 
                  updatePreferences({ email_notifications: checked })
                }
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-green-500" />
                <div>
                  <Label htmlFor="push">Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificações no navegador (quando disponível)
                  </p>
                </div>
              </div>
              <Switch
                id="push"
                checked={preferences.push_notifications}
                onCheckedChange={(checked) => 
                  updatePreferences({ push_notifications: checked })
                }
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {saving && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
            <span className="text-sm text-muted-foreground">Salvando...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;