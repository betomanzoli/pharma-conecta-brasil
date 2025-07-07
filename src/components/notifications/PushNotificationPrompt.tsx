import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, X } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { toast } from 'sonner';

const PushNotificationPrompt: React.FC = () => {
  const { isSupported, permission, requestPermission } = usePushNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Mostrar prompt se:
    // - Browser suporta notificações
    // - Usuário ainda não deu permissão
    // - Não foi dismissado antes
    const dismissed = localStorage.getItem('push-notification-dismissed');
    
    if (
      isSupported && 
      permission === 'default' && 
      !dismissed
    ) {
      // Mostrar após um delay para não ser intrusivo
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isSupported, permission]);

  const handleAllow = async () => {
    const granted = await requestPermission();
    
    if (granted) {
      toast.success('Notificações push ativadas!', {
        description: 'Você receberá notificações importantes mesmo quando a aba estiver fechada.'
      });
    } else {
      toast.error('Não foi possível ativar as notificações push');
    }
    
    setIsVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('push-notification-dismissed', 'true');
    setIsVisible(false);
    setIsDismissed(true);
  };

  const handleNotNow = () => {
    setIsVisible(false);
  };

  if (!isVisible || isDismissed || !isSupported || permission !== 'default') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-in-right">
      <Card className="shadow-lg border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">
                Ativar Notificações Push?
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Receba notificações importantes sobre mentoria, fórum e outras atividades, mesmo quando a aba estiver fechada.
              </p>
              
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={handleAllow}
                  className="text-xs"
                >
                  Permitir
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleNotNow}
                  className="text-xs"
                >
                  Agora não
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="p-1 h-auto flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PushNotificationPrompt;