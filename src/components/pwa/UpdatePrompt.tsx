import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';

interface UpdatePromptProps {
  onUpdate?: () => void;
  className?: string;
}

export function UpdatePrompt({ onUpdate, className }: UpdatePromptProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);
        
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowPrompt(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = async () => {
    if (!registration) return;

    setIsUpdating(true);

    try {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      await new Promise((resolve) => {
        const handleControllerChange = () => {
          navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
          resolve(true);
        };
        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
      });

      if (onUpdate) {
        onUpdate();
      } else {
        window.location.reload();
      }

      toast.success('Aplicativo atualizado!');
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      toast.error('Erro na atualização');
    } finally {
      setIsUpdating(false);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setTimeout(() => setShowPrompt(true), 60 * 60 * 1000);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Atualização Disponível</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0"
              disabled={isUpdating}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Uma nova versão do aplicativo está disponível com melhorias e correções.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button 
              onClick={handleUpdate} 
              className="flex-1"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Atualizar Agora
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDismiss}
              disabled={isUpdating}
            >
              Depois
            </Button>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            🚀 Nova versão • 🐛 Correções • ⚡ Melhor performance
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Hook for detecting app updates
export function useAppUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);
        
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const updateApp = async () => {
    if (!registration || !registration.waiting) return false;

    try {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      await new Promise((resolve) => {
        const handleControllerChange = () => {
          navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
          resolve(true);
        };
        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
      });

      return true;
    } catch (error) {
      console.error('Erro ao atualizar app:', error);
      return false;
    }
  };

  return {
    updateAvailable,
    updateApp,
    registration
  };
}

export default UpdatePrompt;