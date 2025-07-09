import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
}

export const usePWA = () => {
  const [pwaState, setPWAState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOffline: !navigator.onLine,
    installPrompt: null
  });

  useEffect(() => {
    // Verificar se já está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebApp = (window.navigator as any).standalone === true;
    
    setPWAState(prev => ({
      ...prev,
      isInstalled: isStandalone || isInWebApp
    }));

    // Listener para prompt de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPWAState(prev => ({
        ...prev,
        isInstallable: true,
        installPrompt: e as BeforeInstallPromptEvent
      }));
    };

    // Listener para quando app é instalado
    const handleAppInstalled = () => {
      setPWAState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        installPrompt: null
      }));
      
      toast.success('PharmaConnect instalado com sucesso! 🎉', {
        description: 'Agora você pode usar o app diretamente da sua tela inicial.'
      });
    };

    // Listeners para status de conexão
    const handleOnline = () => {
      setPWAState(prev => ({ ...prev, isOffline: false }));
      toast.success('Conectado! 🌐', {
        description: 'Sua conexão foi restaurada.'
      });
    };

    const handleOffline = () => {
      setPWAState(prev => ({ ...prev, isOffline: true }));
      toast.warning('Modo Offline 📱', {
        description: 'Você está navegando no modo offline. Algumas funcionalidades podem ser limitadas.'
      });
    };

    // Registrar listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    if (!pwaState.installPrompt) {
      toast.error('Instalação não disponível', {
        description: 'Este dispositivo não suporta instalação ou o app já está instalado.'
      });
      return false;
    }

    try {
      await pwaState.installPrompt.prompt();
      const choiceResult = await pwaState.installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        toast.success('Instalação iniciada! ⬇️', {
          description: 'O PharmaConnect está sendo instalado...'
        });
        return true;
      } else {
        toast.info('Instalação cancelada', {
          description: 'Você pode instalar o app a qualquer momento.'
        });
        return false;
      }
    } catch (error) {
      console.error('Erro ao instalar PWA:', error);
      toast.error('Erro na instalação', {
        description: 'Não foi possível instalar o app. Tente novamente.'
      });
      return false;
    }
  };

  const checkForUpdates = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.update();
        
        toast.success('App atualizado! ✨', {
          description: 'A versão mais recente do PharmaConnect está disponível.'
        });
      } catch (error) {
        console.error('Erro ao verificar atualizações:', error);
      }
    }
  };

  const getNetworkStatus = () => {
    if (!navigator.onLine) return 'offline';
    
    const connection = (navigator as any).connection;
    if (!connection) return 'online';
    
    const { effectiveType, downlink } = connection;
    
    if (downlink < 0.5) return 'slow';
    if (effectiveType === '4g') return 'fast';
    return 'normal';
  };

  return {
    ...pwaState,
    installApp,
    checkForUpdates,
    networkStatus: getNetworkStatus()
  };
};