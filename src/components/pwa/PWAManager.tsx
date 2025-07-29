
import React, { useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const PWAManager: React.FC = () => {
  const { isInstallable, isInstalled, isOffline } = usePWA();
  const { 
    isSupported: pushSupported, 
    permission: pushPermission, 
    isSubscribed: pushSubscribed,
    requestPermission: requestPushPermission 
  } = usePushNotifications();
  const { profile } = useAuth();

  useEffect(() => {
    // Verificar status PWA e notificações ao carregar
    if (profile && pushSupported && pushPermission === 'default' && !pushSubscribed) {
      // Solicitar permissão de notificações após 30 segundos para novos usuários
      const timer = setTimeout(() => {
        toast.info('Ativar Notificações?', {
          description: 'Receba atualizações importantes sobre seus projetos e parcerias.',
          action: {
            label: 'Ativar',
            onClick: () => requestPushPermission()
          }
        });
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [profile, pushSupported, pushPermission, pushSubscribed, requestPushPermission]);

  useEffect(() => {
    // Notificar mudanças no status de conectividade
    if (isOffline) {
      toast.warning('Modo Offline', {
        description: 'Você está no modo offline. Algumas funcionalidades podem ser limitadas.',
        duration: 5000
      });
    }
  }, [isOffline]);

  useEffect(() => {
    // Parabenizar usuário quando app for instalado
    if (isInstalled) {
      toast.success('App Instalado!', {
        description: 'O PharmaConnect agora está disponível na sua tela inicial.',
        duration: 5000
      });
    }
  }, [isInstalled]);

  return null; // Este componente não renderiza nada visualmente
};

export default PWAManager;
